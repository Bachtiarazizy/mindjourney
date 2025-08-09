import { Clock, Crown, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Author {
  name: string;
  jobTitle: string;
  shortBio: string;
  image: string | null;
  slug: string;
}

interface BlogPost {
  id: string;
  category: string;
  categoryColor: string;
  categoryIcon: string | null;
  title: string;
  description: string;
  author: Author;
  date: string;
  imageUrl: string | null;
  imageAlt: string;
  slug: string;
  readTime: number;
  tags: string[];
  featured: boolean;
  recommended: boolean;
  favorite: boolean;
  premium: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface BlogData {
  featuredPosts: BlogPost[];
  recommendedPosts: BlogPost[];
  favoritePosts: BlogPost[];
  allPosts: BlogPost[];
  pagination: {
    currentPage: number;
    totalPosts: number;
    postsPerPage: number;
    totalPages: number;
  };
}

export const BlogCard: React.FC<{ post: BlogPost; variant?: "default" | "featured" | "compact" }> = ({ post, variant = "default" }) => {
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <div className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${isFeatured ? "lg:col-span-2" : ""} ${isCompact ? "h-full" : ""}`}>
        <div className={`relative ${isCompact ? "aspect-[4/3]" : "aspect-[3/2]"} overflow-hidden`}>
          {post.imageUrl ? (
            <Image src={post.imageUrl} alt={post.imageAlt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-4xl">📝</div>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <div className="px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm" style={{ backgroundColor: `${post.categoryColor}CC` }}>
              {post.categoryIcon && <Image src={post.categoryIcon} alt="" width={12} height={12} className="inline mr-1" />}
              {post.category}
            </div>
          </div>

          {/* Premium Badge */}
          {post.premium && (
            <div className="absolute top-4 left-4 mt-8">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs flex items-center font-semibold">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </div>
            </div>
          )}

          {/* Read Time */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {post.readTime} min
          </div>
        </div>

        <div className={`p-${isCompact ? "4" : "6"}`}>
          <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors ${isFeatured ? "text-xl" : isCompact ? "text-base" : "text-lg"}`}>{post.title}</h3>

          <p className={`text-gray-600 mb-4 line-clamp-${isCompact ? "2" : "3"} ${isCompact ? "text-sm" : "text-base"}`}>{post.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {post.author.image ? (
                <Image src={post.author.image} alt={post.author.name} width={32} height={32} className="rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <div>
                <p className={`font-medium text-gray-900 ${isCompact ? "text-sm" : "text-base"}`}>{post.author.name}</p>
                {/* {post.author.jobTitle && !isCompact && <p className="text-xs text-gray-500">{post.author.jobTitle}</p>} */}
              </div>
            </div>

            <div className={`text-right ${isCompact ? "text-xs" : "text-sm"} text-gray-500`}>{post.date}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};
