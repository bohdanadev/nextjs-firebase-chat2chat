import Joi from "joi";

const baseSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email address",
    }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
});

const registerSchema = baseSchema.keys({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "string.empty": "Confirm Password is required",
    "any.only": "Passwords do not match",
  }),
});

export { baseSchema, registerSchema };
