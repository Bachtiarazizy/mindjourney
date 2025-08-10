"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, Reply, Clock, Globe, ChevronDown, ChevronUp } from "lucide-react";
import { CommentForm } from "./comment-form";

interface Comment {
  _id: string;
  name: string;
  content: string;
  website?: string;
  createdAt: string;
  parent?: {
    _ref: string;
  };
  replies?: Comment[];
}

interface CommentListProps {
  postId: string;
  postSlug: string;
}

export function CommentList({ postId, postSlug }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments?postId=${postId}`);
      if (!response.ok) throw new Error("Failed to fetch comments");

      const data = await response.json();
      setComments(organizeComments(data.comments || []));
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const organizeComments = (commentList: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create map of all comments
    commentList.forEach((comment) => {
      commentMap.set(comment._id, { ...comment, replies: [] });
    });

    // Second pass: organize into tree structure
    commentList.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment._id)!;

      if (comment.parent) {
        const parent = commentMap.get(comment.parent._ref);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentWithReplies);
        } else {
          rootComments.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  const handleCommentSubmitted = () => {
    setReplyingTo(null);
    fetchComments(); // Refresh comments list
  };

  const toggleExpanded = (commentId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const renderComment = (comment: Comment, depth = 0) => {
    const isExpanded = expandedComments.has(comment._id);
    const hasReplies = comment.replies && comment.replies.length > 0;
    const shouldTruncate = comment.content.length > 200;
    const displayContent = isExpanded || !shouldTruncate ? comment.content : comment.content.substring(0, 200) + "...";

    return (
      <div key={comment._id} className={`${depth > 0 ? "ml-8 md:ml-12" : ""}`}>
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4 hover:shadow-md transition-all duration-200">
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="bg-gradient-to-br from-pink-400 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm">{comment.name.charAt(0).toUpperCase()}</div>

              <div>
                <div className="flex items-center space-x-2">
                  {comment.website ? (
                    <a href={comment.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-900 hover:text-pink-600 transition-colors flex items-center">
                      {comment.name}
                      <Globe className="w-3 h-3 ml-1 opacity-60" />
                    </a>
                  ) : (
                    <span className="font-semibold text-gray-900">{comment.name}</span>
                  )}

                  {depth > 0 && <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">Reply</span>}
                </div>

                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(comment.createdAt)}
                </div>
              </div>
            </div>

            {/* Reply Button */}
            <button onClick={() => handleReply(comment._id)} className="text-gray-400 hover:text-pink-600 transition-colors p-2 rounded-lg hover:bg-pink-50" title="Reply to this comment">
              <Reply className="w-4 h-4" />
            </button>
          </div>

          {/* Comment Content */}
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{displayContent}</p>

            {shouldTruncate && (
              <button onClick={() => toggleExpanded(comment._id)} className="text-pink-600 hover:text-pink-700 text-sm font-medium mt-2 flex items-center">
                {isExpanded ? (
                  <>
                    Show less <ChevronUp className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Reply Form */}
          {replyingTo === comment._id && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <CommentForm postId={postId} postSlug={postSlug} parentId={comment._id} parentAuthor={comment.name} onCommentSubmitted={handleCommentSubmitted} onCancel={() => setReplyingTo(null)} />
            </div>
          )}
        </div>

        {/* Replies */}
        {hasReplies && <div className="space-y-0">{comment.replies!.map((reply) => renderComment(reply, depth + 1))}</div>}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gray-200 w-10 h-10 rounded-full"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 w-24 rounded"></div>
                  <div className="bg-gray-200 h-3 w-16 rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-gray-200 h-4 w-full rounded"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <MessageCircle className="w-6 h-6 mr-2 text-pink-600" />
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No comments yet</h4>
          <p className="text-gray-500">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">{comments.map((comment) => renderComment(comment))}</div>
      )}
    </div>
  );
}
