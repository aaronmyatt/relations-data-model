import { db, Contact, Encounter, Plan } from "./database";
import { ContactService, EncounterService, PlanService } from "./services";
export const database = db;
export const models = {
    Contact,
    Encounter,
    Plan
};
export const services = {
    contactService: new ContactService(),
    encounterService: new EncounterService(),
    planService: new PlanService()
};
