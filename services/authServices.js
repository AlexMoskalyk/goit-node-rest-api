import bcrypt from "bcrypt";
import User from "../models/user.js";

export const findUser = (filter) => User.findOne(filter);

export const saveUser = async (data) => {
  const hashPass = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashPass });
};

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);
