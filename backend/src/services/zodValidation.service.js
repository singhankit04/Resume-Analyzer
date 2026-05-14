import { z } from "zod";

const technicalQuestionAndAns = z.object({
    question: z.string().describe("tecnical question that can be asked by the interviewer based on the resume and job description"),
    answer: z.string().describe("answer to the technical question based on the resume and job description")
});
const behavioralQuestionAndAns = z.object({
    question: z.string().describe("behavioral question that can be asked by the interviewer based on the resume and job description"),
    answer: z.string().describe("answer to the behavioral question based on the resume and job description")
});
const skillsGap = z.object({
    skill: z.string().describe("the skill that is missing in the resume compared to the job description"),
    severity: z.enum(["High", "Medium", "Low"]).describe("the severity of the missing skill")
});
const dayWisePlan = z.object({
    day: z.number().describe("The day number for the study plan."),
    topic: z.string().describe("The main topic to be covered on this day."),
    subtopics: z.array(z.string().describe("Name of the subtopic.")).describe("array of subtopics to be covered in this day")
});


export const finalReportSchema = z.object({
    technicalQuestions: z.array(technicalQuestionAndAns).describe("array of technical questions and answers"),
    behavioralQuestions: z.array(behavioralQuestionAndAns).describe("array of behavioral questions and answers"),
    skillsGap: z.array(skillsGap).describe("array of skills gap"),
    dayWisePlan: z.array(dayWisePlan).describe("array of day wise plan"),
    matchscore: z.number().min(0).max(100).describe("match score between resume and job description and give a number between 0 to 100")
});

