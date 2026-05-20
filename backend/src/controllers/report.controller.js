import { saveReport } from "../dao/report.dao.js";
import {generateReport } from "../services/gemini.service.js";

export const createReport = async (req, res) => {
    try {
        const pdfText=req.pdfText;
        const jobDescription = req.body.jobDescription;

        if(!jobDescription){
            return res.status(400).json({
                message:"Job Description is required"
            })
        }

        const report = await generateReport(pdfText, jobDescription);

        const savedReport = await saveReport({user:req.user.id, resume:pdfText, jobDescription ,report}) 
        res.status(200).json({
            message: "Report Generated Successfully",
            savedReport
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }

}