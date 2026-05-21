import { Report } from "../models/report.model.js";


export const saveReport = async ({user, resume, jobDescription, report}) => {
    try{
        const savedReport = await Report.create({
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
   

    const reports = await Report.find({user:userId}).sort({createdAt: -1});
    return reports;
 
}

export const findReportById = async (reportId) => {
    try {
        return await Report.findById(reportId);
    } catch (error) {
        console.log("report not found ", error)
    }
}