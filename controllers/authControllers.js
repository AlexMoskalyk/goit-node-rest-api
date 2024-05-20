import * as authService from "../services/authServices.js";
import compareHash from "../helpers/compareHash.js";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { authUserSubscritionSchema } from "../schemas/authSchema.js";

const signUp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await authService.findUser({ email });
    if (user) {
      throw HttpError(409, "Email already use");
    }
    const newUser = await authService.saveUser(req.body);
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

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.findUser({ email });

    if (!user) {
      throw HttpError(401, "Email or password invalid");
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
    res.json({
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

export default {
  signup: signUp,
  signin: signIn,
  current: getCurrent,
  logout,
  update,
};
