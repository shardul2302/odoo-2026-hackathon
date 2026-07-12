import CarbonTransaction from "../models/carbonTransaction.model.js";

import asyncHandler from "../utils/asyncHandler.js";

import ApiError from "../utils/ApiError.js";

import ApiResponse from "../utils/ApiResponse.js";

import calculateCO2 from "../utils/co2Calculator.js";




// CREATE


export const createCarbonTransaction = asyncHandler(
async(req,res)=>{


const {
    category,
    activity,
    quantity,
    unit

}=req.body;



const carbonAmount =
calculateCO2(
    quantity,
    unit
);



const transaction =
await CarbonTransaction.create({

    user:req.user._id,

    category,

    activity,

    quantity,

    unit,

    carbonAmount

});



return res.status(201).json(

new ApiResponse(

201,

transaction,

"Carbon transaction created successfully"

)

);


});








// GET ALL


export const getCarbonTransactions =
asyncHandler(
async(req,res)=>{


const transactions =
await CarbonTransaction.find()

.populate(
"category",
"name"
)

.populate(
"user",
"name email"
)

.sort({
createdAt:-1
});



return res.status(200).json(

new ApiResponse(

200,

transactions,

"Carbon transactions fetched successfully"

)

);


});








// GET SINGLE


export const getCarbonTransactionById =
asyncHandler(
async(req,res)=>{


const transaction =
await CarbonTransaction.findById(
req.params.id
);



if(!transaction){

throw new ApiError(
404,
"Carbon transaction not found"
);

}



return res.status(200).json(

new ApiResponse(

200,

transaction,

"Carbon transaction fetched successfully"

)

);


});









// UPDATE


export const updateCarbonTransaction =
asyncHandler(
async(req,res)=>{


const transaction =
await CarbonTransaction.findById(
req.params.id
);



if(!transaction){

throw new ApiError(
404,
"Transaction not found"
);

}




if(
req.body.quantity ||
req.body.unit
){

transaction.carbonAmount =
calculateCO2(

req.body.quantity ??
transaction.quantity,


req.body.unit ??
transaction.unit

);

}




Object.assign(
transaction,
req.body
);



await transaction.save();



return res.status(200).json(

new ApiResponse(

200,

transaction,

"Carbon transaction updated successfully"

)

);


});









// DELETE


export const deleteCarbonTransaction =
asyncHandler(
async(req,res)=>{


const transaction =
await CarbonTransaction.findById(
req.params.id
);



if(!transaction){

throw new ApiError(
404,
"Transaction not found"
);

}



await transaction.deleteOne();



return res.status(200).json(

new ApiResponse(

200,

{},

"Carbon transaction deleted successfully"

)

);


});