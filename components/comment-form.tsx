"use client";

import React, { useState } from "react";
import { MessageCircle, Send, User, Mail, Globe, AlertCircle } from "lucide-react";

interface CommentFormProps {
  postId: string;
  postSlug: string;
  parentId?: string;
  parentAuthor?: string;
  onCommentSubmitted?: () => void;
  onCancel?: () => void;
}

interface FormData {
  name: string;
  email: string;
  website: string;
  content: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  content?: string;
  submit?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CommentForm({ postId, postSlug, parentId, parentAuthor, onCommentSubmitted, onCancel }: CommentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    website: "",
    content: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = "Comment is required";
    } else if (formData.content.trim().length < 10) {
      newErrors.content = "Comment must be at least 10 characters long";
    } else if (formData.content.trim().length > 500) {
      newErrors.content = "Comment must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Get user's IP and user agent for moderation
      const userAgent = navigator.userAgent;

      const commentData = {
        _type: "comment",
        name: formData.name.trim(),
        email: formData.email.trim(),
        website: formData.website.trim() || undefined,
        content: formData.content.trim(),
        post: {
          _type: "reference",
          _ref: postId,
        },
        parent: parentId
          ? {
              _type: "reference",
              _ref: parentId,
            }
          : undefined,
        approved: false,
        spam: false,
        userAgent,
        createdAt: new Date().toISOString(),
      };

      // Submit to Sanity
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      // Reset form and show success message
      setFormData({ name: "", email: "", website: "", content: "" });
      setShowSuccessMessage(true);

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000);

      if (onCommentSubmitted) {
        onCommentSubmitted();
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      setErrors({ submit: "Failed to submit comment. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-xl">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-bold text-gray-900">{parentId ? `Reply to ${parentAuthor}` : "Leave a Comment"}</h3>
          <p className="text-gray-600 text-sm">{parentId ? "Your reply will be posted after moderation" : "Share your thoughts below"}</p>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-full p-1 mr-3">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-green-800">Comment submitted successfully!</h4>
              <p className="text-sm text-green-600">Your comment is awaiting moderation and will appear once approved.</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 ${errors.name ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`}
              placeholder="Your full name"
              maxLength={50}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 ${errors.email ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">Your email won&apos;t be published</p>
          </div>
        </div>

        {/* Website Field */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="w-4 h-4 inline mr-1" />
            Website (Optional)
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:bg-white transition-all duration-200"
            placeholder="https://your-website.com"
          />
        </div>

        {/* Comment Field */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Comment *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={5}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 resize-none ${
              errors.content ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"
            }`}
            placeholder={parentId ? `Write your reply to ${parentAuthor}...` : "Share your thoughts about this article..."}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            {errors.content ? (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.content}
              </p>
            ) : (
              <p className="text-xs text-gray-500">{formData.content.length}/500 characters</p>
            )}
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {errors.submit}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 focus:ring-4 focus:ring-pink-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {parentId ? "Post Reply" : "Post Comment"}
              </>
            )}
          </button>

          {parentId && onCancel && (
            <button type="button" onClick={onCancel} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 focus:ring-4 focus:ring-gray-500/25 transition-all duration-200">
              Cancel
            </button>
          )}
        </div>

        {/* Info Text */}
        <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-xl">
          <p>
            💡 <strong>Please note:</strong> All comments are moderated before appearing on the site. Be respectful and constructive in your feedback. Your email address will not be published or shared with third parties.
          </p>
        </div>
      </form>
    </div>
  );
}
