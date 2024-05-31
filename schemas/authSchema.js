import Joi from "joi";

export const authSignupSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export const authSigninSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export const authUserSubscritionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

export const authEmailSchema = Joi.object({
  email: Joi.string().required(),
});
