  <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Author Card */}
              {post.author && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="text-center">
                    {authorImageUrl ? (
                      <Image src={authorImageUrl} alt={post.author.name} width={80} height={80} className="rounded-full mx-auto mb-4" />
                    ) : (
                      <div className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-900 mb-1">{post.author.name}</h3>
                    {post.author.jobTitle && <p className="text-pink-600 text-sm mb-3">{post.author.jobTitle}</p>}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.author.bio || `Expert writer specializing in ${post.category?.title || "various topics"}.`}</p>
                    <Link href={`/blog?author=${post.author.slug?.current}`} className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                      View all articles →
                    </Link>
                  </div>
                </div>
              )}

              {/* Featured Posts */}
              {sidebarData.featuredPosts && sidebarData.featuredPosts.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-pink-600" />
                    Featured Posts
                  </h3>
                  <div className="space-y-4">
                    {sidebarData.featuredPosts.map((featuredPost: any) => {
                      const featuredImageUrl = featuredPost.mainImage ? urlForImage(featuredPost.mainImage)?.url() : null;

                      return (
                        <Link key={featuredPost._id} href={`/blog/${featuredPost.slug.current}`} className="group block">
                          <article className="flex space-x-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              {featuredImageUrl ? (
                                <Image src={featuredImageUrl} alt={featuredPost.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                  <BookOpen className="w-4 h-4 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2 text-sm mb-1">{featuredPost.title}</h4>
                              <div className="text-xs text-gray-500 flex items-center">
                                <span>{featuredPost.author?.name}</span>
                                <span className="mx-1">•</span>
                                <span>{formatRelativeDate(featuredPost.publishedAt)}</span>
                              </div>
                            </div>
                          </article>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Categories */}
              {sidebarData.categories && sidebarData.categories.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-pink-600" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {sidebarData.categories.slice(0, 8).map((category: any) => (
                      <Link key={category._id} href={`/blog?category=${category.slug.current}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                        <span className="text-gray-700 group-hover:text-pink-600 text-sm font-medium">{category.title}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{category.postCount}</span>
                      </Link>
                    ))}
                  </div>
                  <Link href="/blog" className="block text-center mt-4 text-pink-600 hover:text-pink-700 text-sm font-medium">
                    View all categories →
                  </Link>
                </div>
              )}
              {/* Popular Tags */}
              {uniqueTags.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-pink-600" />
                    Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueTags.map((tag: string, index: number) => (
                      <Link key={index} href={`/blog?tag=${tag}`} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs hover:bg-gray-200 transition-colors">
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>