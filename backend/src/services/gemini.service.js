import { GoogleGenAI } from "@google/genai";
import { zodToJsonSchema } from "zod-to-json-schema";
import { finalReportSchema } from "./zodValidation.service.js";


const ai = new GoogleGenAI({});

export const generateReport = async (resumeText, jobDescription) => {

    const prompt = `You are an expert technical recruiter and career coach. Your task is to perform a deep analysis of the candidate's resume and compare it with the provided job description. Based on this comparison, you must generate a structured interview preparation report.

Follow these instructions carefully:

1. Extract and analyze the candidate's skills, projects, and experience from the resume text.
2. Compare these with the responsibilities, required skills, and preferred skills listed in the job description.
3. Identify the key areas where the candidate matches the requirements.
4. Identify gaps where the candidate needs improvement or lacks specific skills mentioned in the job description.
5. Generate a comprehensive interview preparation plan covering:
   a) Technical questions that will likely be asked during the interview.
   b) Behavioral questions to assess soft skills and cultural fit.
   c) A detailed study plan organized by day (for 1 to 14 days) covering topics to master for the interview.
6. Determine a match score between 0 and 100 based on the overall fit between the candidate's profile and the job requirements.

Use the following JSON format for the output:
{
  "technicalQuestions": [{"question": "...", "answer": "..."}],
  "behavioralQuestions": [{"question": "...", "answer": "..."}],
  "skillsGap": [{"skill": "...", "severity": "..."}],
  "dayWisePlan": [{"day": 1, "topic": "...", "subtopics": [...]}, ...],
  "matchscore": 0
}

Remember to provide realistic and practical insights that will genuinely help the candidate prepare for the interview.

Resume Text:
${resumeText}

Job Description:
${jobDescription}
`


    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseFormat: { text: { mimeType: "application/json", schema: zodToJsonSchema(finalReportSchema) } },
        },
    });

    let cleanText = response.text.replace(/```(?:json)?/gi, '').trim();
    const report = finalReportSchema.parse(JSON.parse(cleanText));
    console.log(report)
    return report;

}


