import { Request, Response } from 'express';
import pool from '../db';

// --- LOGIC TO GET ALL POSTS ---
export const getAllPosts = async (req: Request, res: Response) => {
    try {
        // This SQL query joins posts with users and counts upvotes for each post.
        const [posts] = await pool.query(`
            SELECT 
                p.id, 
                p.title, 
                p.url, 
                p.created_at, 
                u.email as author_email,
                COUNT(up.post_id) as upvotes
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN upvotes up ON p.id = up.post_id
            GROUP BY p.id
            ORDER BY upvotes DESC;
        `);
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching posts.' });
    }
};

// --- LOGIC TO CREATE A NEW POST ---
export const createPost = async (req: Request, res: Response) => {
    // We get the title and url from the user's request
    const { title, url } = req.body;
    // We get the userId from our 'protect' middleware!
    const userId = req.userId;

    try {
        await pool.query(
            'INSERT INTO posts (title, url, user_id) VALUES (?, ?, ?)',
            [title, url, userId]
        );
        res.status(201).json({ message: 'Post created successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating post.' });
    }
};

// --- LOGIC TO UPVOTE A POST ---
export const upvotePost = async (req: Request, res: Response) => {
    // We get the post's ID from the URL (e.g., /api/posts/1/upvote)
    const { postId } = req.params;
    // We get the user's ID from our 'protect' middleware
    const userId = req.userId;

    try {
        // The PRIMARY KEY on the 'upvotes' table prevents a user from upvoting the same post twice.
        await pool.query(
            'INSERT INTO upvotes (user_id, post_id) VALUES (?, ?)',
            [userId, postId]
        );
        res.status(200).json({ message: 'Post upvoted!' });
    } catch (error) {
        // If a "duplicate entry" error occurs, it means the user already voted.
        res.status(409).json({ message: 'You have already upvoted this post.' });
    }
};