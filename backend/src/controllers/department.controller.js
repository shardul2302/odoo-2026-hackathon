import Department from "../models/department.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


// Create Department
export const createDepartment = asyncHandler(async (req, res) => {

    const { name, description, isActive } = req.body;


    const existingDepartment = await Department.findOne({
        name: name.trim()
    });


    if (existingDepartment) {
        throw new ApiError(
            409,
            "Department already exists"
        );
    }


    const department = await Department.create({
        name,
        description,
        isActive
    });


    return res.status(201).json(
        new ApiResponse(
            201,
            department,
            "Department created successfully"
        )
    );

});



// Get All Departments
export const getDepartments = asyncHandler(async (req, res) => {


    const departments = await Department.find()
        .sort({
            createdAt: -1
        });


    return res.status(200).json(
        new ApiResponse(
            200,
            departments,
            "Departments fetched successfully"
        )
    );

});




// Get Single Department
export const getDepartmentById = asyncHandler(async (req, res) => {


    const department = await Department.findById(
        req.params.id
    );


    if (!department) {
        throw new ApiError(
            404,
            "Department not found"
        );
    }


    return res.status(200).json(
        new ApiResponse(
            200,
            department,
            "Department fetched successfully"
        )
    );

});




// Update Department
export const updateDepartment = asyncHandler(async (req, res) => {


    const department = await Department.findById(
        req.params.id
    );


    if (!department) {
        throw new ApiError(
            404,
            "Department not found"
        );
    }



    if(req.body.name){

        const duplicate = await Department.findOne({
            name:req.body.name.trim(),
            _id:{
                $ne:req.params.id
            }
        });


        if(duplicate){
            throw new ApiError(
                409,
                "Department name already exists"
            );
        }

    }



    const updatedDepartment =
        await Department.findByIdAndUpdate(
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
            updatedDepartment,
            "Department updated successfully"
        )
    );


});




// Delete Department
export const deleteDepartment = asyncHandler(async(req,res)=>{


    const department =
        await Department.findById(
            req.params.id
        );


    if(!department){

        throw new ApiError(
            404,
            "Department not found"
        );

    }



    await Department.findByIdAndDelete(
        req.params.id
    );



    return res.status(200).json(

        new ApiResponse(
            200,
            {},
            "Department deleted successfully"
        )

    );


});