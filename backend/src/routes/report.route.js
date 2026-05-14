import { Router } from "express";
import upload from "../services/multer.service.js";
import { parsePdf } from "../middlewares/pdfParser.middleware.js";


const reportRouter = Router();

reportRouter.post("/generatereport", upload.single("resume"), parsePdf, )


export default reportRouter;