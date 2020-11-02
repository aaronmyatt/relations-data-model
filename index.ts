// Import stylesheets
import "./style.css";

import { db, Contact, Encounter } from "./database";

db.transaction("rw", db.contacts, db.encounters, async () => {
  await db.contacts.clear();
  await db.encounters.clear();
  await Contact.generateMock();
  await Contact.generateMock();

  const contact = await db.contacts.toCollection().first();
  Encounter.generateMock(contact);
})
  .then(renderContacts)
  .then(renderEncounters);

function renderContacts() {
  const contactsDiv: HTMLElement = document.getElementById("contacts");
  return db.contacts.each(contact => {
    const div = document.createElement("div");
    div.innerText = `${contact.id} | ${contact.email}`;
    contactsDiv.appendChild(div);
  });
}

function renderEncounters() {
  const encountersDiv: HTMLElement = document.getElementById("encounters");
  db.encounters.each(encounter => {
    const div = document.createElement("div");
    div.innerText = `${encounter.contactId} | ${encounter.details}`;
    encountersDiv.appendChild(div);
  });
}
