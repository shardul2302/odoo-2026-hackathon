import Category from "../models/category.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";



// Create Category
export const createCategory = asyncHandler(async (req,res)=>{


    const {
        name,
        description,
        isActive

    } = req.body;



    const existingCategory = await Category.findOne({
        name:name.trim()
    });



    if(existingCategory){

        throw new ApiError(
            409,
            "Category already exists"
        );

    }



    const category = await Category.create({

        name,
        description,
        isActive

    });



    return res.status(201).json(

        new ApiResponse(
            201,
            category,
            "Category created successfully"
        )

    );


});




// Get All Categories
export const getCategories = asyncHandler(async(req,res)=>{


    const categories = await Category.find()
        .sort({
            createdAt:-1
        });



    return res.status(200).json(

        new ApiResponse(
            200,
            categories,
            "Categories fetched successfully"
        )

    );


});





// Get Single Category
export const getCategoryById = asyncHandler(async(req,res)=>{


    const category = await Category.findById(
        req.params.id
    );



    if(!category){

        throw new ApiError(
            404,
            "Category not found"
        );

    }



    return res.status(200).json(

        new ApiResponse(
            200,
            category,
            "Category fetched successfully"
        )

    );


});





// Update Category
export const updateCategory = asyncHandler(async(req,res)=>{


    const category = await Category.findById(
        req.params.id
    );



    if(!category){

        throw new ApiError(
            404,
            "Category not found"
        );

    }



    if(req.body.name){


        const duplicate = await Category.findOne({

            name:req.body.name.trim(),

            _id:{
                $ne:req.params.id
            }

        });



        if(duplicate){

            throw new ApiError(
                409,
                "Category name already exists"
            );

        }

    }



    const updatedCategory =
        await Category.findByIdAndUpdate(

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
            updatedCategory,
            "Category updated successfully"
        )

    );


});





// Delete Category
export const deleteCategory = asyncHandler(async(req,res)=>{


    const category = await Category.findById(
        req.params.id
    );



    if(!category){

        throw new ApiError(
            404,
            "Category not found"
        );

    }



    await Category.findByIdAndDelete(
        req.params.id
    );



    return res.status(200).json(

        new ApiResponse(
            200,
            {},
            "Category deleted successfully"
        )

    );


});