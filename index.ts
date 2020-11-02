// Import stylesheets
import "./style.css";

import { db, Contact, Encounter, Plan } from "./database";

db.transaction("rw", db.contacts, db.encounters, db.plans, async () => {
  await db.contacts.clear();
  await db.encounters.clear();
  await db.plans.clear();

  await Contact.generateMock();
  await Contact.generateMock();

  const contact = await db.contacts.toCollection().first();
  Encounter.generateMock(contact);
  Plan.generateMock(contact);
})
  .then(renderContacts)
  .then(renderEncounters)
  .then(renderPlans);

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

function renderPlans() {
  const plansDiv: HTMLElement = document.getElementById("plans");
  db.plans.each(plan => {
    const div = document.createElement("div");
    div.innerText = `${plan.contactId} | ${plan.when}`;
    plansDiv.appendChild(div);
  });
}
