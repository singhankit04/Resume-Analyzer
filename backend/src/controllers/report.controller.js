import { generate } from "../services/gemini.service.js";

export const createReport = async (req, res) => {
    try {
        pdfText=req.pdfText;
        const jobDescription = req.body.jobDescription;

        if(!jobDescription){
            return res.status(400).json({
                message:"Job Description is required"
            })
        }

        const report = await generate(pdfText, jobDescription)
        res.status(200).json({
            message: "Report Generated Successfully",
            report
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }

}