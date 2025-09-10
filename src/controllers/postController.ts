import { Request, Response } from 'express';
import pool from '../db';

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const { rows: posts } = await pool.query(`
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
            GROUP BY p.id, u.email  -- <-- ADD u.email HERE
            ORDER BY upvotes DESC;
        `);
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching posts.' });
    }
};

export const createPost = async (req: Request, res: Response) => {
    const { title, url } = req.body;
    const userId = req.userId;
    if (!title || !url) {
        return res.status(400).json({ message: 'Title and URL are required.' });
    }
    try {
        await pool.query(
            'INSERT INTO posts (title, url, user_id) VALUES ($1, $2, $3)', // <-- Changed ?, ?, ?
            [title, url, userId]
        );
        res.status(201).json({ message: 'Post created!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error creating post.' });
    }
};

export const upvotePost = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = req.userId;
    try {
        await pool.query(
            'INSERT INTO upvotes (user_id, post_id) VALUES ($1, $2)', // <-- Changed ?, ?
            [userId, postId]
        );
        res.status(200).json({ message: 'Post upvoted!' });
    } catch (error) {
        res.status(409).json({ message: 'You have already upvoted this post.' });
    }
};