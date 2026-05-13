import {Router} from "express";
import upload from "../middlewares/multer.middelware.js";
import { parsePdf } from "../middlewares/pdfParser.middleware.js";


const router = Router();

router.post("/getreport",upload.single("resume"), parsePdf, (req, res)=>{
    res.send(req.pdfText);
})


export default router