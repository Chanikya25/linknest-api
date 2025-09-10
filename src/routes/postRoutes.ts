import { Router } from 'express';
import { getAllPosts, createPost, upvotePost } from '../controllers/postController';
import { protect } from '../middleware/authMiddleware'; // <-- Import our guard!

const router = Router();

// Anyone can view all the posts
router.get('/', getAllPosts);

// To create a post, you must pass through the 'protect' guard first
router.post('/', protect, createPost);

// To upvote a post, you must also pass through the 'protect' guard
router.post('/:postId/upvote', protect, upvotePost);

export default router;