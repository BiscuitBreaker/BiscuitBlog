import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { postsAPI, memoriesAPI, uploadsAPI } from '../services/api';
import { 
  PlusCircle, 
  FileText, 
  Calendar, 
  Upload, 
  Image as ImageIcon,
  Users,
  BarChart3,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';

interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
}

interface MemoryForm {
  title: string;
  description: string;
  date: string;
  image: string;
  content: string;
}

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'memories' | 'media'>('overview');
  const [showPostForm, setShowPostForm] = useState(false);
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  
  const [postForm, setPostForm] = useState<PostForm>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    published: false
  });

  const [memoryForm, setMemoryForm] = useState<MemoryForm>({
    title: '',
    description: '',
    date: '',
    image: '',
    content: ''
  });

  const queryClient = useQueryClient();

  // Queries
  const { data: postsData } = useQuery('posts', () => postsAPI.getAll());
  const { data: memoriesData } = useQuery('memories', memoriesAPI.getAll);
  
  const posts = postsData?.data.posts || [];
  const memories = memoriesData?.data.memories || [];

  // Mutations
  const createPostMutation = useMutation(postsAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
      setShowPostForm(false);
      resetPostForm();
    }
  });

  const createMemoryMutation = useMutation(memoriesAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('memories');
      setShowMemoryForm(false);
      resetMemoryForm();
    }
  });

  const uploadImageMutation = useMutation(uploadsAPI.uploadImage);

  // Form handlers
  const resetPostForm = () => {
    setPostForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '',
      published: false
    });
  };

  const resetMemoryForm = () => {
    setMemoryForm({
      title: '',
      description: '',
      date: '',
      image: '',
      content: ''
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handlePostTitleChange = (title: string) => {
    setPostForm(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadImageMutation.mutateAsync(file);
      return result.data.imageUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      return '';
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate(postForm);
  };

  const handleMemorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createMemoryMutation.mutate(memoryForm);
  };

  const TabButton: React.FC<{ id: typeof activeTab; label: string; icon: React.ReactNode }> = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === id
          ? 'glass bg-accent-teal/20 text-accent-teal border border-accent-teal/30'
          : 'glass text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          <TabButton id="overview" label="Overview" icon={<BarChart3 className="w-4 h-4" />} />
          <TabButton id="posts" label="Posts" icon={<FileText className="w-4 h-4" />} />
          <TabButton id="memories" label="Memories" icon={<Calendar className="w-4 h-4" />} />
          <TabButton id="media" label="Media" icon={<ImageIcon className="w-4 h-4" />} />
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="glass p-6 rounded-lg text-center">
                <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{posts.length}</div>
                <div className="text-sm text-gray-400">Total Posts</div>
              </div>
              <div className="glass p-6 rounded-lg text-center">
                <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{memories.length}</div>
                <div className="text-sm text-gray-400">Memories</div>
              </div>
              <div className="glass p-6 rounded-lg text-center">
                <ImageIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {memories.filter(m => m.image).length + posts.filter(p => p.coverImage).length}
                </div>
                <div className="text-sm text-gray-400">Images</div>
              </div>
              <div className="glass p-6 rounded-lg text-center">
                <Users className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">1</div>
                <div className="text-sm text-gray-400">Admin Users</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setActiveTab('posts');
                    setShowPostForm(true);
                  }}
                  className="btn-primary flex items-center gap-2 justify-center"
                >
                  <PlusCircle className="w-4 h-4" />
                  New Post
                </button>
                <button
                  onClick={() => {
                    setActiveTab('memories');
                    setShowMemoryForm(true);
                  }}
                  className="btn-primary flex items-center gap-2 justify-center"
                >
                  <PlusCircle className="w-4 h-4" />
                  New Memory
                </button>
                <button
                  onClick={() => setActiveTab('media')}
                  className="btn-secondary flex items-center gap-2 justify-center"
                >
                  <Upload className="w-4 h-4" />
                  Upload Media
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Manage Posts</h2>
              <button
                onClick={() => setShowPostForm(true)}
                className="btn-primary flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                New Post
              </button>
            </div>

            {/* Post Form Modal */}
            {showPostForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="glass p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">Create New Post</h3>
                    <button
                      onClick={() => {
                        setShowPostForm(false);
                        resetPostForm();
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={handlePostSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                      <input
                        type="text"
                        value={postForm.title}
                        onChange={(e) => handlePostTitleChange(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                      <input
                        type="text"
                        value={postForm.slug}
                        onChange={(e) => setPostForm(prev => ({ ...prev, slug: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
                      <textarea
                        value={postForm.excerpt}
                        onChange={(e) => setPostForm(prev => ({ ...prev, excerpt: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Content (Markdown)</label>
                      <textarea
                        value={postForm.content}
                        onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
                        rows={10}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image URL</label>
                      <input
                        type="url"
                        value={postForm.coverImage}
                        onChange={(e) => setPostForm(prev => ({ ...prev, coverImage: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="published"
                        checked={postForm.published}
                        onChange={(e) => setPostForm(prev => ({ ...prev, published: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="published" className="text-sm text-gray-300">
                        Publish immediately
                      </label>
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={createPostMutation.isLoading}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {createPostMutation.isLoading ? 'Creating...' : 'Create Post'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPostForm(false);
                          resetPostForm();
                        }}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Posts List */}
            <div className="glass p-6 rounded-lg">
              {posts.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No posts yet. Create your first post!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="border border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                          <p className="text-gray-400 text-sm">/{post.slug}</p>
                          {post.excerpt && (
                            <p className="text-gray-300 mt-2">{post.excerpt}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                            <span className={`px-2 py-1 rounded ${
                              post.published ? 'bg-green-600' : 'bg-yellow-600'
                            }`}>
                              {post.published ? 'Published' : 'Draft'}
                            </span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-blue-400 hover:text-blue-300">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Memories Tab */}
        {activeTab === 'memories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Manage Memories</h2>
              <button
                onClick={() => setShowMemoryForm(true)}
                className="btn-primary flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                New Memory
              </button>
            </div>

            {/* Memory Form Modal */}
            {showMemoryForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="glass p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">Create New Memory</h3>
                    <button
                      onClick={() => {
                        setShowMemoryForm(false);
                        resetMemoryForm();
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleMemorySubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                      <input
                        type="text"
                        value={memoryForm.title}
                        onChange={(e) => setMemoryForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                      <input
                        type="date"
                        value={memoryForm.date}
                        onChange={(e) => setMemoryForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <textarea
                        value={memoryForm.description}
                        onChange={(e) => setMemoryForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                      <textarea
                        value={memoryForm.content}
                        onChange={(e) => setMemoryForm(prev => ({ ...prev, content: e.target.value }))}
                        rows={5}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                      <input
                        type="url"
                        value={memoryForm.image}
                        onChange={(e) => setMemoryForm(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={createMemoryMutation.isLoading}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {createMemoryMutation.isLoading ? 'Creating...' : 'Create Memory'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowMemoryForm(false);
                          resetMemoryForm();
                        }}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Memories List */}
            <div className="glass p-6 rounded-lg">
              {memories.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No memories yet. Create your first memory!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {memories.map((memory) => (
                    <div key={memory.id} className="border border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          {memory.image && (
                            <img
                              src={memory.image}
                              alt={memory.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-white">{memory.title}</h3>
                            <p className="text-gray-400 text-sm">
                              {new Date(memory.date).toLocaleDateString()}
                            </p>
                            {memory.description && (
                              <p className="text-gray-300 mt-2">{memory.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-blue-400 hover:text-blue-300">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Media Management</h2>
            
            <div className="glass p-6 rounded-lg">
              <div className="text-center py-8">
                <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Upload Images</h3>
                <p className="text-gray-400 mb-6">
                  Drag and drop images here or click to browse. 
                  Images will be automatically optimized.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await handleImageUpload(file);
                      if (url) {
                        alert(`Image uploaded successfully! URL: ${url}`);
                      }
                    }
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="btn-primary cursor-pointer inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploadImageMutation.isLoading ? 'Uploading...' : 'Choose Image'}
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;