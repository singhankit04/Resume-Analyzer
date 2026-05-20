import { InterviewReport } from "../models/interviewReport.model.js";


export const saveReport = async ({user, resume, jobDescription, report}) => {
    try{
        const savedReport = await InterviewReport.create({
            user,
            resume,
            jobDescription,
            ...report
        })
        return savedReport;
    }catch(error){
        console.log(error)
    }
}


export const getReportsbyUserId = async(userId)=>{
    try{
        const reports = await InterviewReport.find({user:userId})
        return reports;
    }catch(error){
        console.log("reports not found ", error)
    }
}