import { Router } from "express";


import {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment

} from "../controllers/department.controller.js";


import validate from "../middlewares/validate.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";


import {
    createDepartmentValidator,
    updateDepartmentValidator

} from "../validators/department.validator.js";


const router = Router();



// All routes protected
router.use(authMiddleware);



// Admin only
router.post(
    "/",
    roleMiddleware("Admin"),
    validate(createDepartmentValidator),
    createDepartment
);



router.get(
    "/",
    getDepartments
);



router.get(
    "/:id",
    getDepartmentById
);



router.patch(
    "/:id",
    roleMiddleware("Admin"),
    validate(updateDepartmentValidator),
    updateDepartment
);



router.delete(
    "/:id",
    roleMiddleware("Admin"),
    deleteDepartment
);



export default router;