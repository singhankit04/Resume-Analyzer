import { z } from "zod";

const technicalQuestionAndAns = z.object({
    question: z
        .string()
        .describe(
            "Technical interview question based on the resume and job description"
        ),

    answer: z
        .string()
        .describe(
            "Answer to the technical interview question"
        ),
});

const behavioralQuestionAndAns = z.object({
    question: z
        .string()
        .describe(
            "Behavioral interview question based on the resume and job description"
        ),

    answer: z
        .string()
        .describe(
            "Answer to the behavioral interview question"
        ),
});

const skillsGap = z.object({
    skill: z
        .string()
        .describe(
            "Missing skill compared to the job description"
        ),

    severity: z
        .enum(["High", "Medium", "Low"])
        .describe(
            "Severity level of the missing skill"
        ),
});

const dayWisePlan = z.object({
    day: z
        .number()
        .describe(
            "Day number of the study plan"
        ),

    topic: z
        .string()
        .describe(
            "Main topic for the day"
        ),

    subtopics: z
        .array(z.string())
        .describe(
            "List of subtopics for the day"
        ),
});

export const finalReportSchema = z.object({

    technicalQuestions: z
        .array(technicalQuestionAndAns)
        .describe(
            "Technical interview questions and answers"
        ),

    behavioralQuestions: z
        .array(behavioralQuestionAndAns)
        .describe(
            "Behavioral interview questions and answers"
        ),

    skillsGap: z
        .array(skillsGap)
        .describe(
            "Skills missing from the resume"
        ),

    dayWisePlan: z
        .array(dayWisePlan)
        .describe(
            "Day-wise preparation roadmap"
        ),

    matchscore: z
        .number()
        .min(0)
        .max(100)
        .describe(
            "Resume match score from 0 to 100"
        ),
});