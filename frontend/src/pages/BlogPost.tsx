import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { postsAPI } from '../services/api';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data, isLoading, error } = useQuery(
    ['post', slug],
    () => postsAPI.getBySlug(slug!),
    { 
      enabled: !!slug,
      refetchOnWindowFocus: false,
    }
  );

  const post = data?.data.post;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass p-8 rounded-lg text-center max-w-md">
          <h2 className="text-xl font-semibold text-red-400 mb-4">Post Not Found</h2>
          <p className="text-white/70 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blogs" className="btn-primary">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          to="/blogs"
          className="inline-flex items-center gap-2 text-white/70 hover:text-accent-teal transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8 rounded-lg overflow-hidden border border-white/10">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-xl text-white/80 mb-6">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedAt || post.createdAt)}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Author
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {estimateReadingTime(post.content)}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          <div className="glass p-8 rounded-lg">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              className="text-white/90 leading-relaxed"
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold text-white mb-3 mt-6">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-bold text-white mb-2 mt-4">{children}</h3>,
                p: ({ children }) => <p className="mb-4 text-white/80 leading-relaxed">{children}</p>,
                a: ({ href, children }) => (
                  <a href={href} className="text-accent-teal hover:text-white underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                code: ({ children, className }) => {
                  const isBlock = className?.includes('language-');
                  if (isBlock) {
                    return (
                      <pre className="glass-strong p-4 rounded-lg overflow-x-auto my-4">
                        <code className={className}>{children}</code>
                      </pre>
                    );
                  }
                  return <code className="glass-strong px-2 py-1 rounded text-sm">{children}</code>;
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-accent-teal pl-4 my-4 italic text-white/70">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-white/80">{children}</li>,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-12 flex justify-center">
          <Link to="/blogs" className="btn-primary">
            Read More Posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;