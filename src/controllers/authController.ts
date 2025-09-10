import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Make sure jwt is imported
import pool from '../db';

// The register function you already have
export const register = async (req: Request, res: Response) => {
    // ... (your existing register code is here)
    const { email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        await pool.query(
            'INSERT INTO users (email, password_hash) VALUES (?, ?)',
            [email, passwordHash]
        );
        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user or email already exists.' });
    }
};

// --- PASTE THE NEW FUNCTION BELOW ---

export const login = async (req: Request, res: Response) => {
    try {
        // 1. Get the email and password from the request
        const { email, password } = req.body;

        // 2. Find the user in the database by their email
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const users = rows as any[];

        // 3. If no user is found, send an error
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const user = users[0];

        // 4. Compare the password from the request with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 5. If the password is correct, create a JWT token
        const payload = { userId: user.id };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET!, // The secret key from our .env file
            { expiresIn: '1h' }      // The token will be valid for 1 hour
        );

        // 6. Send the token back to the user
        res.status(200).json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};