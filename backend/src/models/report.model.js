import mongoose from 'mongoose'

const technicalQuestionsSchema = new mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    }
})
const behavioralQuestionsSchema = new mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    }
})
const dayWisePlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required:true
    },
    topic:{
        type:String,
        required:true
    },
    subtopics:{
        type:[String],
        required:true
    },
})

const skillsGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required:true,
    },
    severity:{
        type:String,
        enum:["High", "Medium", "Low"],
        required:true
    }
})


const reportSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        index:true
    },
    resume:{
        type:String,
        required:[true, "Resume is required"]
    },
    jobDescription:{
        type:String,
        required:[true, "Job Description is required"]
    },
    matchscore:{
        type:Number,
        required:true,
    },
    technicalQuestions:[technicalQuestionsSchema],
    behavioralQuestions:[behavioralQuestionsSchema],
    skillsGap:[skillsGapSchema],
    dayWisePlan:[dayWisePlanSchema],

})

export const Report = mongoose.model("Report", reportSchema);
