import * as yup from "yup";

export const createDepartmentValidator = yup.object({
    name: yup
        .string()
        .trim()
        .required("Department name is required")
        .min(2, "Department name must contain at least 2 characters"),

    description: yup
        .string()
        .trim()
        .optional(),

    isActive: yup
        .boolean()
        .optional()
});


export const updateDepartmentValidator = yup.object({
    name: yup
        .string()
        .trim()
        .min(2, "Department name must contain at least 2 characters")
        .optional(),

    description: yup
        .string()
        .trim()
        .optional(),

    isActive: yup
        .boolean()
        .optional()
});