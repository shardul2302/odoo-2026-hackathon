import mongoose from "mongoose";


const emissionFactorSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },


    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },


    unit:{
        type:String,
        required:true
    },


    factor:{
        type:Number,
        required:true
    },


    description:{
        type:String,
        default:""
    },


    isActive:{
        type:Boolean,
        default:true
    }

},
{
    timestamps:true
}
);



const EmissionFactor = mongoose.model(
    "EmissionFactor",
    emissionFactorSchema
);


export default EmissionFactor;