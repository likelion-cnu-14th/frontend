"use client";

import { Comment } from "@/types/post";
import { Trash2 } from "lucide-react";

interface CommentItemProps {
  comment: Comment;
  onDelete?: (commentId: string) => void;
}

export default function CommentItem({ comment, onDelete }: CommentItemProps) {
  const formattedDate = new Date(comment.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-start justify-between border-b border-border py-3 last:border-b-0">
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2 text-sm">
          <span className="font-medium">{comment.author}</span>
          <span className="text-muted-foreground">{formattedDate}</span>
        </div>
        <p className="text-sm">{comment.content}</p>
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(comment.id)}
          className="ml-2 rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
