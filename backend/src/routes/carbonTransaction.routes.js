import {Router} from "express";


import authMiddleware from "../middlewares/auth.middleware.js";


import validate from "../middlewares/validate.middleware.js";


import {

createCarbonTransaction,

getCarbonTransactions,

getCarbonTransactionById,

updateCarbonTransaction,

deleteCarbonTransaction


}
from "../controllers/carbonTransaction.controller.js";



import {

createCarbonTransactionValidator,

updateCarbonTransactionValidator


}
from "../validators/carbonTransaction.validator.js";



const router = Router();



router.use(authMiddleware);



router.post(

"/",

validate(createCarbonTransactionValidator),

createCarbonTransaction

);



router.get(

"/",

getCarbonTransactions

);



router.get(

"/:id",

getCarbonTransactionById

);



router.patch(

"/:id",

validate(updateCarbonTransactionValidator),

updateCarbonTransaction

);



router.delete(

"/:id",

deleteCarbonTransaction

);



export default router;