import * as yup from "yup";


export const createCategoryValidator = yup.object({

    name: yup
        .string()
        .trim()
        .required("Category name is required")
        .min(2, "Category name must contain at least 2 characters"),


    description: yup
        .string()
        .trim()
        .optional(),


    isActive: yup
        .boolean()
        .optional()

});



export const updateCategoryValidator = yup.object({

    name: yup
        .string()
        .trim()
        .min(2, "Category name must contain at least 2 characters")
        .optional(),


    description: yup
        .string()
        .trim()
        .optional(),


    isActive: yup
        .boolean()
        .optional()

});