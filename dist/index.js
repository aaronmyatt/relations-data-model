import { database, services, models } from "./main";
if (window) {
    window.database = database;
    window.services = services;
    window.models = models;
}
import { db, Contact, Encounter, Plan } from "./database";
import { ContactService, EncounterService, PlanService } from "./services";
import SettingService from "./settingService";
const contactService = new ContactService();
const encounterService = new EncounterService();
const planService = new PlanService();
const settingService = new SettingService();
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
    .then(renderSettings)
    .then(() => db.delete())
    .catch(e => console.log(e.message));
async function renderContacts() {
    const contactsDiv = document.getElementById("contacts");
    const contacts = await contactService.fetchAll().toArray();
    contacts.forEach(contact => {
        const div = document.createElement("div");
        div.innerText = `${contact.id} | ${contact.fullName}`;
        contactsDiv.appendChild(div);
    });
    return contacts;
}
async function renderEncounters(contacts) {
    const encountersDiv = document.getElementById("encounters");
    contacts.forEach(async (contact) => {
        try {
            const encounters = await encounterService.fetchFor(contact).toArray();
            encounters.forEach(encounter => {
                const div = document.createElement("div");
                div.innerText = `${encounter.contactId} | ${encounter.details}`;
                encountersDiv.appendChild(div);
            });
        }
        catch (e) {
            console.log(e.message);
        }
    });
    return contacts;
}
function renderPlans(contacts) {
    const plansDiv = document.getElementById("plans");
    contacts.forEach(async (contact) => {
        try {
            const plans = await planService.fetchFor(contact).toArray();
            plans.forEach(plan => {
                const div = document.createElement("div");
                div.innerText = `${plan.contactId} | ${plan.when}`;
                plansDiv.appendChild(div);
            });
        }
        catch (e) {
            console.log(e.message);
        }
    });
    planService
        .fetchAllForDate(new Date())
        .toArray()
        .then(plans => {
        const span = document.createElement("span");
        span.innerText = `|| Plan Count: ${plans.length}`;
        plansDiv.append(span);
    });
}
async function renderSettings() {
    const exportInput = document.getElementById("dbexport");
    exportInput.setAttribute("value", await settingService.exportDB());
    const settingsDiv = document.getElementById("settings");
    try {
        const settings = await settingService.fetchAll().toArray();
        settings.forEach(setting => {
            const div = document.createElement("div");
            div.innerText = `${setting.name} | ${setting.value}`;
            settingsDiv.appendChild(div);
        });
    }
    catch (e) {
        console.log(e.message);
    }
}
