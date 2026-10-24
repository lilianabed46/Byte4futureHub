import { useMemo, useState } from "react";
import type { LoadStatus, Post, PostCategory } from "../../types";
import type { ComposeResult } from "../../hooks/useCommunityData";
import { LoadingState } from "../shared/LoadingState";
import { ErrorState } from "../shared/ErrorState";
import { EmptyState } from "../shared/EmptyState";
import { ComposeForm } from "./ComposeForm";
import { PostCard } from "./PostCard";
import { CATEGORY_FILTER_OPTIONS } from "./categoryMeta";

interface CommunityPanelProps {
  status: LoadStatus;
  posts: Post[];
  retry: () => void;
  addPost: (content: string, category: PostCategory) => Promise<ComposeResult>;
  toggleLike: (id: number) => Promise<boolean>;
  pendingLikeIds: Set<number>;
  onPostPublished: () => void;
  onLikeFailed: () => void;
}

export function CommunityPanel({
  status,
  posts,
  retry,
  addPost,
  toggleLike,
  pendingLikeIds,
  onPostPublished,
  onLikeFailed,
}: CommunityPanelProps) {
  const [categoryFilter, setCategoryFilter] = useState<PostCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [likedOnly, setLikedOnly] = useState(false);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return posts.filter((post) => {
      if (categoryFilter !== "all" && post.category !== categoryFilter) return false;
      if (likedOnly && !post.liked) return false;
      if (query) {
        const haystack = `${post.author} ${post.content}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [posts, categoryFilter, search, likedOnly]);

  async function handleToggleLike(id: number) {
    const ok = await toggleLike(id);
    if (!ok) onLikeFailed();
  }

  return (
    <section className="panel">
      <div className="panel__header">
        <h2 className="panel__title">Community</h2>
      </div>
      <div className="panel__body">
        <div className="panel__sticky">
          <ComposeForm onSubmit={addPost} onPublished={onPostPublished} />

          <div className="filter-pills">
            {CATEGORY_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`pill pill-filter ${categoryFilter === opt.value ? "is-active" : ""}`}
                onClick={() => setCategoryFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="search-row">
            <input
              type="text"
              className="text-input"
              placeholder="Search author or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search author or content"
            />
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={likedOnly}
                onChange={(e) => setLikedOnly(e.target.checked)}
              />
              Liked only
            </label>
          </div>

          {status === "ready" && (
            <p className="panel__count">
              {filteredPosts.length} of {posts.length} posts shown
            </p>
          )}
        </div>

        {status === "loading" && <LoadingState label="Loading the community feed..." />}
        {status === "error" && (
          <ErrorState message="We could not load the community feed. Please check your connection and try again." onRetry={retry} />
        )}
        {status === "ready" && filteredPosts.length === 0 && (
          <EmptyState message="No posts match your filters right now." />
        )}
        {status === "ready" && filteredPosts.length > 0 && (
          <div className="post-list">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleLike={handleToggleLike}
                isPending={pendingLikeIds.has(post.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
