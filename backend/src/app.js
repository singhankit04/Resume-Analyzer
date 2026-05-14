import express from 'express'
import reportRouter from './routes/report.route.js'
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

app.use("/api", reportRouter);
app.use("/api/auth", authRouter)




