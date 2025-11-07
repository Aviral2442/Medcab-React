import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.Backend_PORT;

app.listen(PORT, () => {
    console.log(`Backend Server is running on port ${PORT}`);
});