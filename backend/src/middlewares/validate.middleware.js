
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            req.body = await schema.validate(
                req.body,
                {
                    abortEarly: false,
                    stripUnknown: true,
                }
            );

            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: error.errors,
            });
        }
    };
};

export default validate;