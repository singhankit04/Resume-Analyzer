import express from 'express'
import reportRouter from './routes/report.routes.js'

export const app = express();


app.use("/api", reportRouter);




