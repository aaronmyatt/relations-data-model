import { Contact, Encounter, Plan } from "./database";
import { ContactService, EncounterService, PlanService } from "./services";
export declare const database: import("./database").Database;
export declare const models: {
    Contact: typeof Contact;
    Encounter: typeof Encounter;
    Plan: typeof Plan;
};
export declare const services: {
    contactService: ContactService;
    encounterService: EncounterService;
    planService: PlanService;
};
