import Contact from "../models/contact.js";

function listContacts(search = {}) {
  const { filter = {}, fields = "", settings = {} } = search;
  return Contact.find(filter, fields, settings).populate(
    "owner",
    "subscription email"
  );
}

function countContacts(filter) {
  return Contact.countDocuments(filter);
}

function getContact(filter) {
  return Contact.findOne(filter);
}

function removeContact(filter) {
  return Contact.findOneAndDelete(filter);
}

function addContact(data) {
  return Contact.create(data);
}

export const updateContact = async (filter, data) => {
  return Contact.findOneAndUpdate(filter, data);
};

export const updateStatusContact = (filter, data) =>
  Contact.findOneAndUpdate(filter, data);

export default {
  listContacts,
  getContact,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
  countContacts,
};
