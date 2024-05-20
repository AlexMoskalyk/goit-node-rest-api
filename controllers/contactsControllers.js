import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const filter = { owner };
    const fields = "-createdAt -updatedAt";
    const { favorite, page, limit } = req.query;
    const skip = (page - 1) * limit;
    const settings = { skip, limit };
    if (favorite) {
      filter.favorite = favorite === "true";
    }
    const result = await contactsService.listContacts({
      filter,
      fields,
      settings,
    });
    const total = await contactsService.countContacts(filter);

    res.status(200).json({ result, total });
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    const { _id: owner } = req.user;
    const result = await contactsService.getContact({ _id, owner });
    if (!result) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    const { _id: owner } = req.user;
    const result = await contactsService.removeContact({ _id, owner });
    if (!result) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contactsService.addContact({ ...req.body, owner });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { id: _id } = req.params;
    const { _id: owner } = req.user;
    const result = await contactsService.updateContact(
      { _id, owner },
      req.body
    );

    if (!result) {
      throw HttpError(404, "Not found");
    }

    res.json(result).status(200);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { error } = updateStatusContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { id: _id } = req.params;
    const { _id: owner } = req.user;
    const result = await contactsService.updateStatusContact(
      { _id, owner },
      req.body
    );
    if (!result) {
      throw HttpError(404, "Not found");
    }

    res.json(result).status(200);
  } catch (error) {
    next(error);
  }
};
