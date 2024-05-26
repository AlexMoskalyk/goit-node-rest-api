import multer from "multer";
import path from "path";
import HttpError from "../helpers/HttpError.js";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniquePrefix = `${
      Date.now() + "-" + Math.round(Math.random() * 1e9)
    }`;
    const fileName = `${uniquePrefix}-${file.originalname}`;

    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const extension = file.originalname.split(".").pop();
  if (extension !== "jpg" && extension !== "png" && extension !== "jpeg") {
    return cb(HttpError(400, `${extension} is invalid file type`));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
