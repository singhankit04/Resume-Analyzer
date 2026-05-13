import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

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


const finalReportSchema = z.object({
    technicalQuestions: z.array(technicalQuestionAndAns).describe("array of technical questions and answers"),
    behavioralQuestions: z.array(behavioralQuestionAndAns).describe("array of behavioral questions and answers"),
    skillsGap: z.array(skillsGap).describe("array of skills gap"),
    dayWisePlan: z.array(dayWisePlan).describe("array of day wise plan"),
    matchscore: z.number().min(0).max(100).describe("match score between resume and job description and give a number between 0 to 100")
});

const ai = new GoogleGenAI({ });


const resumeText=`ANKIT SHARMA
Ghaziabad, Uttar Pradesh
ankit.sharma@gmail.com
+91 9876543210
LinkedIn: linkedin.com/in/ankitsharma
GitHub: github.com/ankitsharma

--------------------------------------------------

SUMMARY

Motivated backend developer with strong knowledge of Node.js, Express.js,
MongoDB, and REST APIs. Passionate about building scalable backend systems,
authentication systems, and AI-integrated applications. Familiar with Docker,
Git, and cloud deployment basics.

--------------------------------------------------

TECHNICAL SKILLS

Languages:
- JavaScript
- TypeScript
- Python

Backend:
- Node.js
- Express.js
- REST APIs
- JWT Authentication

Database:
- MongoDB
- PostgreSQL
- Prisma ORM

Frontend:
- React.js
- HTML
- CSS
- Tailwind CSS

Tools & Platforms:
- Git
- GitHub
- Postman
- Docker
- Vercel
- Render

AI & Validation:
- Google Gemini API
- Zod Validation

--------------------------------------------------

PROJECTS

1. AI Resume Analyzer
- Built a backend application using Node.js and Gemini API.
- Extracted resume data from PDF files.
- Compared resumes with job descriptions using AI.
- Generated interview questions and skill-gap analysis.
- Used Zod for structured AI response validation.

Tech Stack:
Node.js, Express.js, Gemini API, MongoDB, Multer, Zod

--------------------------------------------------

2. Authentication System
- Developed JWT-based authentication system.
- Implemented login, signup, forgot password, and role-based authorization.
- Added secure password hashing using bcrypt.

Tech Stack:
Node.js, Express.js, MongoDB, JWT

--------------------------------------------------

3. Task Management API
- Created RESTful APIs for task management.
- Implemented CRUD operations and pagination.
- Added filtering and search functionality.

Tech Stack:
Node.js, Express.js, MongoDB

--------------------------------------------------

EDUCATION

Bachelor of Computer Applications (BCA)
ABES Institute of Technology
2023 - 2026

--------------------------------------------------

CERTIFICATIONS

- Backend Development with Node.js
- MongoDB Basics
- REST API Development

--------------------------------------------------

SOFT SKILLS

- Problem Solving
- Team Collaboration
- Communication
- Quick Learner`
const jobDescription = `JOB ROLE: Backend Developer Intern

COMPANY:
TechNova Solutions Pvt. Ltd.

LOCATION:
Noida, Uttar Pradesh

--------------------------------------------------

JOB DESCRIPTION

We are looking for a Backend Developer Intern who is passionate about
building scalable APIs and modern backend systems. The candidate should
have strong knowledge of Node.js and database management.

--------------------------------------------------

RESPONSIBILITIES

- Develop and maintain REST APIs using Node.js and Express.js
- Work with MongoDB and PostgreSQL databases
- Implement authentication and authorization systems
- Integrate third-party APIs and AI services
- Write clean, maintainable, and scalable code
- Collaborate with frontend developers and designers
- Debug and optimize backend performance

--------------------------------------------------

REQUIRED SKILLS

- Strong understanding of JavaScript
- Experience with Node.js and Express.js
- Knowledge of MongoDB or PostgreSQL
- Understanding of REST APIs
- Familiarity with Git and GitHub
- Basic understanding of Docker
- Good problem-solving skills

--------------------------------------------------

PREFERRED SKILLS

- TypeScript
- Prisma ORM
- AI API Integration
- Cloud deployment knowledge
- Experience with Zod validation
- Understanding of system design basics

--------------------------------------------------

ELIGIBILITY

- Pursuing BCA, BTech, MCA, or related degree
- Strong interest in backend development
- Good communication skills

--------------------------------------------------

INTERVIEW PROCESS

1. Resume Screening
2. Technical Interview
3. Assignment Round
4. HR Interview`

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

export const generate = async () => {


    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseFormat: { text: { mimeType: "application/json", schema: zodToJsonSchema(finalReportSchema) } },
        },
    });

    let cleanText = response.text.replace(/```(?:json)?/gi, '').trim();
    const report = finalReportSchema.parse(JSON.parse(cleanText));
    console.log(report);

}


