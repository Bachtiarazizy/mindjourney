"use client";

import { useState } from "react";
import { Share2, Twitter, Facebook, Linkedin, Link, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
  excerpt?: string;
}

export function ShareButtons({ title, url, excerpt }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${process.env.NODE_ENV === "production" ? "https://yourdomain.com" : "http://localhost:3000"}${url}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);
  // const encodedExcerpt = encodeURIComponent(excerpt || title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  return (
    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
      <div className="flex items-center">
        <Share2 className="w-5 h-5 text-pink-600 mr-3" />
        <span className="font-medium text-gray-800">Share this article</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Native Share API (mobile) */}
        {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
          <button onClick={handleShare} className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-600 hover:text-pink-600" title="Share">
            <Share2 className="w-4 h-4" />
          </button>
        )}

        {/* Twitter */}
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-blue-400 hover:scale-105" title="Share on Twitter">
          <Twitter className="w-4 h-4" />
        </a>

        {/* Facebook */}
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-blue-600 hover:scale-105" title="Share on Facebook">
          <Facebook className="w-4 h-4" />
        </a>

        {/* LinkedIn */}
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-blue-700 hover:scale-105" title="Share on LinkedIn">
          <Linkedin className="w-4 h-4" />
        </a>

        {/* Copy Link */}
        <button onClick={copyToClipboard} className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-green-600 hover:scale-105 relative" title="Copy link">
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link className="w-4 h-4" />}
        </button>

        {copied && <div className="absolute right-0 top-full mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded-lg shadow-lg">Link copied!</div>}
      </div>
    </div>
  );
}
