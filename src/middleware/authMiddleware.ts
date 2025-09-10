import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  // 1. Get the token from the request header
  const authHeader = req.headers.authorization;

  // 2. Check if a token exists and is in the correct format ('Bearer TOKEN')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // 3. Extract the token from the "Bearer <token>" string
    const token = authHeader.split(' ')[1];

    // 4. Verify the token is valid using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

    // 5. If valid, attach the user's ID to the request object
    req.userId = decoded.userId;

    // 6. Call 'next()' to pass the request to the actual route handler
    next();
  } catch (error) {
    // If verification fails, send an error
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};