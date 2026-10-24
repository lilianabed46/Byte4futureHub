import { useState, type FormEvent } from "react";
import { POST_CATEGORIES, type PostCategory } from "../../types";
import type { ComposeResult } from "../../hooks/useCommunityData";

interface ComposeFormProps {
  onSubmit: (content: string, category: PostCategory) => Promise<ComposeResult>;
  onPublished: () => void;
}

export function ComposeForm({ onSubmit, onPublished }: ComposeFormProps) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PostCategory>("community");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await onSubmit(content, category);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setError(null);
    setContent("");
    setCategory("community");
    onPublished();
  }

  return (
    <form className="compose-form" onSubmit={handleSubmit} noValidate>
      <textarea
        className="text-input"
        placeholder="Share something with the community..."
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          if (error) setError(null);
        }}
        maxLength={250}
        aria-label="Share something with the community"
        aria-invalid={error ? "true" : "false"}
      />
      <div className="compose-form__count" aria-live="polite">
        {content.length}/250
      </div>
      <div className="compose-form__row">
        <select
          className="select-input"
          value={category}
          onChange={(e) => setCategory(e.target.value as PostCategory)}
          aria-label="Post category"
        >
          {POST_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
      {error && (
        <p className="compose-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
