import Contact from "../models/contact.js";

async function listContacts(filter, field) {
  return Contact.find(filter, field);
}

async function getContactById(contactId) {
  return Contact.findById(contactId);
}

async function removeContact(contactId) {
  return Contact.findByIdAndDelete(contactId);
}

async function addContact(data) {
  return Contact.create(data);
}

export const updateContactById = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data);
};

export const updateStatusContactById = (id, data) =>
  Contact.findByIdAndUpdate(id, data);

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
  updateStatusContactById,
};
