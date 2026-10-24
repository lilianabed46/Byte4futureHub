import type { Post } from "../../types";
import { formatRelativeTime } from "../../lib/format";
import { Avatar } from "../shared/Avatar";
import { CATEGORY_BADGE_LABEL, CATEGORY_BADGE_STYLE } from "./categoryMeta";

interface PostCardProps {
  post: Post;
  onToggleLike: (id: number) => void;
  isPending: boolean;
}

export function PostCard({ post, onToggleLike, isPending }: PostCardProps) {
  return (
    <article className="post-card">
      <div className="post-card__head">
        <Avatar initials={post.avatar} seed={post.author} shape="round" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="post-card__author-row">
            <span className="post-card__name">{post.author}</span>
            <span className="badge-type" style={CATEGORY_BADGE_STYLE[post.category]}>
              {CATEGORY_BADGE_LABEL[post.category]}
            </span>
          </div>
          <div className="post-card__time">{formatRelativeTime(post.createdAt)}</div>
          <p className="post-card__content">{post.content}</p>
          <div className="post-card__foot">
            <button
              type="button"
              className={`like-btn ${post.liked ? "is-liked" : ""}`}
              onClick={() => onToggleLike(post.id)}
              aria-pressed={post.liked}
              disabled={isPending}
            >
              {isPending ? "…" : post.liked ? "♥ Liked" : "♡ Like"}
              <span className="like-btn__count">{post.likes} {post.likes === 1 ? "like" : "likes"}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
