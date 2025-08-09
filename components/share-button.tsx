"use client";
import { useState } from "react";
import { Share2, Instagram, Linkedin, Link, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
  excerpt?: string;
}

export function ShareButtons({ title, url, excerpt }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://mindjourneyme.vercel.app${url}`;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareLinks = {
    instagram: `https://www.instagram.com/`, // Instagram doesn't support direct URL sharing, opens app
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

  const handleInstagramShare = () => {
    // On mobile, try to open Instagram app, fallback to web
    const instagramUrl = `instagram://`;
    const fallbackUrl = `https://www.instagram.com/`;

    // Create a temporary link to test if Instagram app is available
    const link = document.createElement("a");
    link.href = instagramUrl;

    // For mobile devices, try Instagram app first
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.location.href = instagramUrl;
      // Fallback to web version after a short delay if app doesn't open
      setTimeout(() => {
        window.open(fallbackUrl, "_blank");
      }, 1000);
    } else {
      // For desktop, open Instagram web
      window.open(fallbackUrl, "_blank");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Desktop/Tablet Layout */}
      <div className="hidden sm:flex items-center justify-between p-4 md:p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
        <div className="flex items-center">
          <Share2 className="w-5 h-5 text-pink-600 mr-3" />
          <span className="font-medium text-gray-800 text-sm md:text-base">Share this article</span>
        </div>

        <div className="flex items-center gap-2 md:gap-3 relative">
          {/* Native Share API (mobile) */}
          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <button onClick={handleShare} className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-gray-600 hover:text-pink-600 hover:scale-105" title="Share">
              <Share2 className="w-4 h-4" />
            </button>
          )}

          {/* Instagram */}
          <button onClick={handleInstagramShare} className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-gray-600 hover:text-pink-500 hover:scale-105" title="Share on Instagram">
            <Instagram className="w-4 h-4" />
          </button>

          {/* LinkedIn */}
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-gray-600 hover:text-blue-700 hover:scale-105"
            title="Share on LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          {/* Copy Link */}
          <button onClick={copyToClipboard} className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-gray-600 hover:text-green-600 hover:scale-105" title="Copy link">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link className="w-4 h-4" />}
          </button>

          {/* Copy Success Message */}
          {copied && <div className="absolute right-0 top-full mt-2 px-3 py-1 bg-green-600 text-white text-xs md:text-sm rounded-lg shadow-lg whitespace-nowrap z-10">Link copied!</div>}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100 p-4">
        {/* Header */}
        <div className="flex items-center justify-center mb-4">
          <Share2 className="w-5 h-5 text-pink-600 mr-2" />
          <span className="font-medium text-gray-800 text-sm">Share this article</span>
        </div>

        {/* Share Buttons Grid */}
        <div className="grid grid-cols-2 gap-3 relative">
          {/* Native Share API (prioritized on mobile) */}
          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <button onClick={handleShare} className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 hover:text-pink-600 border border-gray-100">
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
          )}

          {/* Instagram */}
          <button onClick={handleInstagramShare} className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 hover:text-pink-500 border border-gray-100">
            <Instagram className="w-4 h-4" />
            <span className="text-sm font-medium">Instagram</span>
          </button>

          {/* LinkedIn */}
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 hover:text-blue-700 border border-gray-100"
          >
            <Linkedin className="w-4 h-4" />
            <span className="text-sm font-medium">LinkedIn</span>
          </a>

          {/* Copy Link */}
          <button onClick={copyToClipboard} className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 hover:text-green-600 border border-gray-100">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link className="w-4 h-4" />}
            <span className="text-sm font-medium">{copied ? "Copied!" : "Copy Link"}</span>
          </button>

          {/* Copy Success Message for Mobile */}
          {copied && <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-green-600 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">Link copied to clipboard!</div>}
        </div>
      </div>
    </div>
  );
}
