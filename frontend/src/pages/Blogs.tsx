import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { postsAPI, Post } from '../services/api';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';

const Blogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  
  const { data, isLoading, error } = useQuery(
    ['posts', page, searchTerm],
    () => postsAPI.getAll({ page, limit: 10, search: searchTerm }),
    { 
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const posts = data?.data.posts || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-400 mb-4">Error Loading Posts</h2>
          <p className="text-white/70">Unable to fetch blog posts. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Blog Posts</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 glass-input text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-teal focus:border-transparent rounded-lg"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal"></div>
          </div>
        )}

        {/* Posts Grid */}
        {!isLoading && posts.length > 0 && (
          <div className="grid gap-6">
            {posts.map((post: Post) => (
              <article key={post.id} className="glass p-6 rounded-lg hover:scale-[1.01] transition-all duration-200">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Cover Image */}
                  {post.coverImage && (
                    <div className="md:w-48 md:flex-shrink-0">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-48 md:h-32 object-cover rounded-lg border border-white/10"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 text-sm text-white/50 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.publishedAt || post.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Author
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-white mb-2 hover:text-accent-teal transition-colors">
                      <Link to={`/blogs/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    
                    {post.excerpt && (
                      <p className="text-white/70 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    
                    <Link
                      to={`/blogs/${post.slug}`}
                      className="inline-flex items-center gap-2 text-accent-teal hover:text-white transition-colors"
                    >
                      Read more
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && posts.length === 0 && (
          <div className="glass p-8 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-white mb-4">
              {searchTerm ? 'No posts found' : 'No posts yet'}
            </h2>
            <p className="text-white/70 mb-6">
              {searchTerm 
                ? `No posts match "${searchTerm}". Try a different search term.`
                : 'We\'re working on creating fresh content. Stay tuned!'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="btn-secondary"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && posts.length > 0 && (
          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="flex items-center text-white/70">
              Page {page}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={posts.length < 10}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;