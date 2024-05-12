import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import isValidId from "../middlewars/isValidId.js";
import isEmptyBody from "../middlewars/isEmpryBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", isEmptyBody, createContact);

contactsRouter.put("/:id", isValidId, updateContact);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  isEmptyBody,
  updateStatusContact
);

export default contactsRouter;
