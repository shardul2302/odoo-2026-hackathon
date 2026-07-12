import { Router } from "express";


import {

    createEmissionFactor,
    getEmissionFactors,
    getEmissionFactorById,
    updateEmissionFactor,
    deleteEmissionFactor

} from "../controllers/emissionFactor.controller.js";


import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";


import {

    createEmissionFactorValidator,
    updateEmissionFactorValidator

} from "../validators/emissionFactor.validator.js";



const router = Router();



router.use(authMiddleware);



// Admin create
router.post(

    "/",

    roleMiddleware("Admin"),

    validate(createEmissionFactorValidator),

    createEmissionFactor

);



// Get all
router.get(

    "/",

    getEmissionFactors

);



// Get one
router.get(

    "/:id",

    getEmissionFactorById

);



// Update
router.patch(

    "/:id",

    roleMiddleware("Admin"),

    validate(updateEmissionFactorValidator),

    updateEmissionFactor

);



// Delete
router.delete(

    "/:id",

    roleMiddleware("Admin"),

    deleteEmissionFactor

);



export default router;