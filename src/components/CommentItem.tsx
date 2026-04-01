"use client";

import { Comment } from "@/types/post";

interface CommentItemProps {
  comment: Comment;
  onDelete?: (commentId: string) => void;
}

export default function CommentItem({ comment, onDelete }: CommentItemProps) {
  return (
    <div className="flex gap-3 py-4 border-b border-border last:border-b-0">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-xs font-medium shrink-0">
        {comment.author[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">{comment.author}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">{comment.content}</p>
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(comment.id)}
          className="shrink-0 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          삭제
        </button>
      )}
    </div>
  );
}
