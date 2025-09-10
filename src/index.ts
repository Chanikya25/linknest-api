import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes'; // <-- ADD THIS LINE

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to LinkNest API! 🚀');
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes); // <-- AND ADD THIS LINE

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});