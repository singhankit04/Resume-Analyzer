import { PDFParse } from 'pdf-parse';

export const parsePdf = async (req, res, next) => {

    try {

        // Check file exists
        if (!req.file) {

            return res.status(400).json({
                message: "PDF file required"
            });
        }

        // Parse PDF
        const parser = new PDFParse(new Uint8Array(req.file.buffer));
        const data = await parser.getText();

        // Store extracted text in request
        req.pdfText = data.text;

        next();

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};




