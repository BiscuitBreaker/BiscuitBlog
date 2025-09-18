import axios from 'axios';

// Configure axios defaults
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Types
export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Memory {
  id: number;
  title: string;
  description?: string;
  date: string;
  image?: string;
  content?: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

// Auth API
export const authAPI = {
  me: () => api.get<{ user: User }>('/auth/me'),
  logout: () => api.post('/auth/logout'),
  loginUrl: () => '/api/auth/google',
};

// Posts API
export const postsAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string; tag?: string }) =>
    api.get<{ posts: Post[] }>('/posts', { params }),
  getBySlug: (slug: string) => api.get<{ post: Post }>(`/posts/${slug}`),
  create: (data: Partial<Post>) => api.post<{ post: Post }>('/posts', data),
  update: (id: number, data: Partial<Post>) => api.put<{ post: Post }>(`/posts/${id}`, data),
  delete: (id: number) => api.delete(`/posts/${id}`),
};

// Memories API
export const memoriesAPI = {
  getAll: () => api.get<{ memories: Memory[] }>('/memories'),
  create: (data: Partial<Memory>) => api.post<{ memory: Memory }>('/memories', data),
  update: (id: number, data: Partial<Memory>) => api.put<{ memory: Memory }>(`/memories/${id}`, data),
  delete: (id: number) => api.delete(`/memories/${id}`),
};

// Uploads API
export const uploadsAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post<{ imageUrl: string }>('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;