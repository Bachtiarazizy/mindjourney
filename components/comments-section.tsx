// components/comments-section.tsx
"use client";

import React from "react";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";

interface CommentsSectionProps {
  postId: string;
  postSlug: string;
  postTitle: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CommentsSection({ postId, postSlug, postTitle }: CommentsSectionProps) {
  return (
    <div className="space-y-12">
      {/* Comment Form */}
      <div>
        <CommentForm postId={postId} postSlug={postSlug} />
      </div>

      {/* Comments List */}
      <div>
        <CommentList postId={postId} postSlug={postSlug} />
      </div>
    </div>
  );
}
