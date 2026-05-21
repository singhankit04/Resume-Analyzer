import { Router } from "express";
import upload from "../services/multer.service.js";
import { parsePdf } from "../middlewares/pdfParser.middleware.js";
import { createReport, getAllUserReports, getReportById } from "../controllers/report.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const reportRouter = Router();

reportRouter.post("/generatereport", authMiddleware, upload.single("resume"), parsePdf, createReport)
reportRouter.get("/reports", authMiddleware, getAllUserReports)
reportRouter.get("/reports/:reportId", authMiddleware, getReportById)

export default reportRouter;