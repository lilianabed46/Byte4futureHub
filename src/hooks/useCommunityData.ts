import { useCallback, useMemo, useState } from "react";
import { ApiError, createPost, fetchPosts, setPostLiked } from "../api/client";
import { useAsyncResource } from "./useAsyncResource";
import type { Post, PostCategory } from "../types";

export interface ComposeResult {
  ok: boolean;
  error?: string;
}

export function useCommunityData() {
  const fetcher = useCallback(() => fetchPosts(), []);
  const { status, data: posts, setData: setPosts, retry } = useAsyncResource<Post[]>(fetcher, []);

  // Hash Table: id -> post, rebuilt whenever `posts` changes. Anywhere we
  // need "the post this id refers to" (e.g. reading its current `liked`
  // state before sending a PATCH), we look it up here in O(1) instead of
  // scanning the array with .find().
  const postsById = useMemo(() => new Map(posts.map((p) => [p.id, p])), [posts]);

  // Ids with an in-flight like/unlike request, so a second click on the
  // same post while one is still pending is a no-op instead of firing a
  // second overlapping request.
  const [pendingLikeIds, setPendingLikeIds] = useState<Set<number>>(new Set());

  const addPost = useCallback(async (content: string, category: PostCategory): Promise<ComposeResult> => {
    // A quick client-side check saves a round trip for the obvious case;
    // the server re-validates regardless and its message wins either way.
    const trimmed = content.trim();
    if (trimmed.length < 3) {
      return { ok: false, error: "Post must be at least 3 characters." };
    }
    if (trimmed.length > 2000) {
      return { ok: false, error: "Post must be 2000 characters or fewer." };
    }
    try {
      const newPost = await createPost({ content, category });
      setPosts((prev) => [newPost, ...prev]);
      return { ok: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      return { ok: false, error: message };
    }
  }, [setPosts]);

  /**
   * Deliberately NOT optimistic: the assessment spec calls for updating the
   * UI only after the API call succeeds, and telling the user clearly if it
   * fails (rather than a silent rollback). Returns whether it succeeded so
   * the caller can surface that failure.
   */
  const toggleLike = useCallback(
    async (id: number): Promise<boolean> => {
      if (pendingLikeIds.has(id)) return false; // a request for this post is already in flight

      const current = postsById.get(id);
      if (!current) return false;
      const nextLiked = !current.liked;

      setPendingLikeIds((prev) => new Set(prev).add(id));
      try {
        const updated = await setPostLiked(id, nextLiked);
        setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        return true;
      } catch {
        // Nothing was changed optimistically, so there's nothing to roll
        // back — the post is already exactly as it was.
        return false;
      } finally {
        setPendingLikeIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [pendingLikeIds, postsById, setPosts]
  );

  return { status, posts, retry, addPost, toggleLike, pendingLikeIds };
}
