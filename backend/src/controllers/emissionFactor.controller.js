import EmissionFactor from "../models/emissionFactor.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";



// Create Emission Factor

export const createEmissionFactor = asyncHandler(async(req,res)=>{


    const {
        name,
        category,
        unit,
        factor,
        description,
        isActive

    } = req.body;



    const existingFactor =
        await EmissionFactor.findOne({

            name:name.trim()

        });



    if(existingFactor){

        throw new ApiError(
            409,
            "Emission factor already exists"
        );

    }



    const emissionFactor =
        await EmissionFactor.create({

            name,
            category,
            unit,
            factor,
            description,
            isActive

        });



    return res.status(201).json(

        new ApiResponse(

            201,
            emissionFactor,
            "Emission factor created successfully"

        )

    );


});





// Get All

export const getEmissionFactors = asyncHandler(async(req,res)=>{


    const emissionFactors =
        await EmissionFactor.find()
        .populate(
            "category",
            "name"
        )
        .sort({
            createdAt:-1
        });



    return res.status(200).json(

        new ApiResponse(

            200,
            emissionFactors,
            "Emission factors fetched successfully"

        )

    );


});





// Get Single

export const getEmissionFactorById = asyncHandler(async(req,res)=>{


    const emissionFactor =
        await EmissionFactor.findById(
            req.params.id
        )
        .populate(
            "category",
            "name"
        );



    if(!emissionFactor){

        throw new ApiError(
            404,
            "Emission factor not found"
        );

    }



    return res.status(200).json(

        new ApiResponse(

            200,
            emissionFactor,
            "Emission factor fetched successfully"

        )

    );


});





// Update

export const updateEmissionFactor = asyncHandler(async(req,res)=>{


    const emissionFactor =
        await EmissionFactor.findById(
            req.params.id
        );



    if(!emissionFactor){

        throw new ApiError(
            404,
            "Emission factor not found"
        );

    }




    const updatedEmissionFactor =
        await EmissionFactor.findByIdAndUpdate(

            req.params.id,

            {
                $set:req.body
            },

            {
                new:true
            }

        );



    return res.status(200).json(

        new ApiResponse(

            200,
            updatedEmissionFactor,
            "Emission factor updated successfully"

        )

    );


});





// Delete

export const deleteEmissionFactor = asyncHandler(async(req,res)=>{


    const emissionFactor =
        await EmissionFactor.findById(
            req.params.id
        );



    if(!EmissionFactor){

        throw new ApiError(
            404,
            "Emission factor not found"
        );

    }



    await EmissionFactor.findByIdAndDelete(
        req.params.id
    );



    return res.status(200).json(

        new ApiResponse(

            200,
            {},
            "Emission factor deleted successfully"

        )

    );


});