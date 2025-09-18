import { Router } from 'express';
import { db } from '../db/connection';
import { memories } from '../db/schema';
import { desc } from 'drizzle-orm';

const router = Router();

// GET /api/memories - Get all memories
router.get('/', async (req, res) => {
  try {
    const allMemories = await db
      .select()
      .from(memories)
      .orderBy(desc(memories.date));

    res.json({ memories: allMemories });
  } catch (error) {
    console.error('Error fetching memories:', error);
    res.status(500).json({ error: 'Failed to fetch memories' });
  }
});

// POST /api/memories - Create new memory (protected route)
router.post('/', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { title, description, date, image, content } = req.body;

    const newMemory = await db
      .insert(memories)
      .values({
        title,
        description,
        date: new Date(date),
        image,
        content,
        authorId: (req.user as any).id
      })
      .returning();

    return res.status(201).json({ memory: newMemory[0] });
  } catch (error) {
    console.error('Error creating memory:', error);
    return res.status(500).json({ error: 'Failed to create memory' });
  }
});

export default router;