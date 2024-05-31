import * as authService from "../services/authServices.js";
import compareHash from "../helpers/compareHash.js";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";
import gravatar from "gravatar";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { authUserSubscritionSchema } from "../schemas/authSchema.js";
import Jimp from "jimp";
import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

const avatarsPath = path.resolve("public", "avatars");

const signUp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await authService.findUser({ email });
    if (user) {
      throw HttpError(409, "Email already use");
    }

    const verificationToken = nanoid();

    const avatarURL = gravatar.url(email, {
      s: "250",
      r: "pg",
      d: "'identicon'",
    });

    const newUser = await authService.saveUser({
      ...req.body,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await authService.findUser({ verificationToken });
    if (!user) {
      throw HttpError(404, "User not found or already verified");
    }
    await authService.updateUser(
      { _id: user._id },
      { verify: true, verificationToken: null }
    );
    res.json({
      message: "Email verification successful",
    });
  } catch (error) {
    next(error);
  }
};

const resendVerify = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await authService.findUser({ email });
    if (!user) {
      throw HttpError(404, "User not found");
    }
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Click verify email</a>`,
    };
    await sendEmail(verifyEmail);
    res.json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.findUser({ email });
    if (!user) {
      throw HttpError(401, "Email or password invalid");
    }

    if (!user.verify) {
      throw HttpError(401, "Email not verified");
    }

    const comparePass = await compareHash(password, user.password);

    if (!comparePass) {
      throw HttpError(401, "Email or password invalid");
    }

    const { _id: id } = user;
    const payload = {
      id,
    };

    const token = createToken(payload);
    await authService.updateUser({ _id: id }, { token });

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrent = (req, res) => {
  const { subscription, email } = req.user;

  res.json({
    subscription,
    email,
  });
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await authService.updateUser({ _id }, { token: "" });
    res.status(204).json({
      message: "No Content",
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { _id: id } = req.params;

    const user = await authService.updateUser({ id }, req.body);

    res.json({
      message: "Success",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    const { _id } = req.user;
    const { path: tempPath, originalname } = req.file;
    const ext = path.extname(originalname);
    const avatarName = `${_id}${ext}`;
    const newAvatarPath = path.join(avatarsPath, avatarName);

    const image = await Jimp.read(tempPath);
    await image.resize(250, 250).writeAsync(newAvatarPath);

    await fs.unlink(tempPath);
    const avatarURL = `/avatars/${avatarName}`;
    await authService.updateUser(_id, { avatarURL });

    res.json({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  signup: signUp,
  signin: signIn,
  current: getCurrent,
  logout,
  update,
  updateAvatar,
  verify,
  resendVerify,
};
