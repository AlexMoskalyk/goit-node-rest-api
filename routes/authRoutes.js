import express from "express";
import {
  authSignupSchema,
  authSigninSchema,
  authUserSubscritionSchema,
  authEmailSchema,
} from "../schemas/authSchema.js";
import isValidId from "../middlewars/isValidId.js";
import isEmptyBody from "../middlewars/isEmpryBody.js";
import validateBody from "../decorators/validateBody.js";
import authControllers from "../controllers/authControllers.js";
import authenticate from "../middlewars/authenticate.js";
import upload from "../middlewars/upload.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(authSignupSchema),
  authControllers.signup
);

authRouter.get("/verify/:verificationToken", authControllers.verify);

authRouter.post(
  "/verify",
  validateBody(authEmailSchema),
  authControllers.resendVerify
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authControllers.updateAvatar
);

authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(authSigninSchema),
  authControllers.signin
);

authRouter.get("/current", authenticate, authControllers.current);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.patch(
  "/:id",
  authenticate,
  isEmptyBody,
  validateBody(authUserSubscritionSchema),
  authControllers.update
);

export default authRouter;
