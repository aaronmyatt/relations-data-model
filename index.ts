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
  Encounter.generateMock(contact);
  Plan.generateMock(contact);
})
  .then(renderContacts)
  .then(renderEncounters)
  .then(renderPlans)
  .then(() => db.delete())
  .catch(e => console.log(e.message));

async function renderContacts(): Promise<void> {
  const contactsDiv: HTMLElement = document.getElementById("contacts");
  const allContacts = await contactService.fetchAll();
  allContacts.forEach(contact => {
    const div = document.createElement("div");
    div.innerText = `${contact.id} | ${contact.email}`;
    contactsDiv.appendChild(div);
  });
}

async function renderEncounters() {
  const encountersDiv: HTMLElement = document.getElementById("encounters");
  const allEncountes = await encounterService.fetchAll();
  allEncountes.forEach(encounter => {
    const div = document.createElement("div");
    div.innerText = `${encounter.contactId} | ${encounter.details}`;
    encountersDiv.appendChild(div);
  });
}

async function renderPlans() {
  const plansDiv: HTMLElement = document.getElementById("plans");
  const allPlans = await planService.fetchAll();
  allPlans.forEach(plan => {
    const div = document.createElement("div");
    div.innerText = `${plan.contactId} | ${plan.when}`;
    plansDiv.appendChild(div);
  });
}
