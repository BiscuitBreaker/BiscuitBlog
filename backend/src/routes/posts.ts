import { Router } from 'express';
import { db } from '../db/connection';
import { posts, postTags, tags } from '../db/schema';
import { eq, desc, like, or } from 'drizzle-orm';

const router = Router();

// GET /api/posts - Get all published posts
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tag } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = db
      .select()
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.publishedAt))
      .limit(Number(limit))
      .offset(offset);

    if (search) {
      query = query.where(
        or(
          like(posts.title, `%${search}%`),
          like(posts.excerpt, `%${search}%`),
          like(posts.content, `%${search}%`)
        )
      );
    }

    const allPosts = await query;
    res.json({ posts: allPosts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/posts/:slug - Get single post by slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, req.params.slug))
      .limit(1);

    if (!post.length) {
      return res.status(404).json({ error: 'Post not found' });
    }

    return res.json({ post: post[0] });
  } catch (error) {
    console.error('Error fetching post:', error);
    return res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// POST /api/posts - Create new post (protected route)
router.post('/', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { title, slug, excerpt, content, coverImage, published = false } = req.body;

    const newPost = await db
      .insert(posts)
      .values({
        title,
        slug,
        excerpt,
        content,
        coverImage,
        published,
        authorId: (req.user as any).id,
        publishedAt: published ? new Date() : null
      })
      .returning();

    return res.status(201).json({ post: newPost[0] });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ error: 'Failed to create post' });
  }
});

export default router;