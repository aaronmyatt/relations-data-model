// import { database, services, models } from "./main";

// declare global {
//   interface Window {
//     database: any;
//   }
//   interface Window {
//     services: any;
//   }
//   interface Window {
//     models: any;
//   }
// }

// if (window) {
//   window.database = database;
//   window.services = services;
//   window.models = models;
// }
import { db, Contact, Encounter, Plan } from "./database";
import { ContactService, EncounterService, PlanService } from "./services";

const contactService = new ContactService();
const encounterService = new EncounterService();
const planService = new PlanService();

db.transaction("rw", db.contacts, db.encounters, db.plans, async () => {
  await Contact.generateMock();
  await Contact.generateMock();

  const contact = await contactService.fetchAll().first();

  await Encounter.generateMock(contact);
  await Plan.generateMock(contact);
})
  .then(renderContacts)
  .then(renderEncounters)
  .then(renderPlans)
  .then(() => db.delete())
  .catch(e => console.log(e.message));

async function renderContacts(): Promise<Contact[]> {
  const contactsDiv: HTMLElement = document.getElementById("contacts");
  const contacts = await contactService.fetchAll().toArray();
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
      const encounters = await encounterService.fetchFor(contact).toArray();
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
      const plans = await planService.fetchFor(contact).toArray();
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
