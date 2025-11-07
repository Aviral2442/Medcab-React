import express, { Request, Response } from 'express';
import cors from "cors";
import dashboard from "./routes/dashboard.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import manpowerRoutes from "./routes/manpower.routes";
import bookingRoutes from "./routes/booking.routes";
import transactionRoutes from "./routes/transaction.routes";
import vendor from "./routes/vendor.routes";
import consumer from "./routes/consumer.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Medcab Backend API');
});

app.use("/api/auth", authRoutes);
app.use("/api/", userRoutes);
app.use("/api/manpower", manpowerRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/vendor", vendor);
app.use("/api/dashboard", dashboard);
app.use("/api/consumer", consumer);
app.use(errorMiddleware);

export default app;