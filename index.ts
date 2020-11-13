// Import stylesheets
import "./style.css";

import { db, Contact, Encounter, Plan } from "./database";
import { ContactService, EncounterService, PlanService } from "./services";

const contactService = new ContactService();
const encounterService = new EncounterService();
const planService = new PlanService();

db.transaction("rw", db.contacts, db.encounters, db.plans, async () => {
  await Contact.generateMock();
  await Contact.generateMock();

  const contact = await db.contacts.toCollection().first();
  const contact2 = await db.contacts.toCollection().last();
  await Encounter.generateMock(contact);
  Encounter.generateMock(contact2);
  Plan.generateMock(contact);
})
  .then(renderContacts)
  .then(renderEncounters)
  .then(renderPlans)
  .then(() => db.delete())
  .catch(e => console.log(e.message));

async function renderContacts(): Promise<Contact[]> {
  const contactsDiv: HTMLElement = document.getElementById("contacts");
  const contacts = await contactService.fetchAll();
  contacts.forEach(contact => {
    const div = document.createElement("div");
    div.innerText = `${contact.id} | ${contact.fullName}`;
    contactsDiv.appendChild(div);
  });
  return contacts;
}

async function renderEncounters(contacts: Contact[]) {
  const encountersDiv: HTMLElement = document.getElementById("encounters");

  contacts.forEach(async contact => {
    try {
      const encounters = await encounterService.fetchFor(contact);
      encounters.forEach(encounter => {
        const div = document.createElement("div");
        div.innerText = `${encounter.contactId} | ${encounter.details}`;
        encountersDiv.appendChild(div);
      });
    } catch (e) {
      console.log(e.message);
    }
  });
  return contacts;
}

function renderPlans(contacts: Contact[]) {
  const plansDiv: HTMLElement = document.getElementById("plans");

  contacts.forEach(async contact => {
    try {
      const plans = await planService.fetchFor(contact);
      plans.forEach(plan => {
        const div = document.createElement("div");
        div.innerText = `${plan.contactId} | ${plan.when}`;
        plansDiv.appendChild(div);
      });
    } catch (e) {
      console.log(e.message);
    }
  });
}
