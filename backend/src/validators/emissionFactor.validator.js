import * as yup from "yup";


export const createEmissionFactorValidator = yup.object({

    name: yup
        .string()
        .trim()
        .required("Emission factor name is required")
        .min(2, "Name must contain at least 2 characters"),


    category: yup
        .string()
        .required("Category is required"),


    unit: yup
        .string()
        .trim()
        .required("Unit is required"),


    factor: yup
        .number()
        .required("Emission factor value is required")
        .positive("Factor must be greater than zero"),


    description: yup
        .string()
        .trim()
        .optional(),


    isActive: yup
        .boolean()
        .optional()

});



export const updateEmissionFactorValidator = yup.object({

    name: yup
        .string()
        .trim()
        .min(2)
        .optional(),


    category: yup
        .string()
        .optional(),


    unit: yup
        .string()
        .trim()
        .optional(),


    factor: yup
        .number()
        .positive()
        .optional(),


    description: yup
        .string()
        .trim()
        .optional(),


    isActive: yup
        .boolean()
        .optional()

});