import * as yup from "yup";


export const createCarbonTransactionValidator = yup.object({

    category:yup
    .string()
    .required("Category is required"),


    activity:yup
    .string()
    .required("Activity is required"),


    quantity:yup
    .number()
    .positive()
    .required("Quantity required"),


    unit:yup
    .string()
    .required("Unit required")


});



export const updateCarbonTransactionValidator =
yup.object({

    activity:yup.string(),

    quantity:yup.number(),

    unit:yup.string(),

    category:yup.string()

});