import { Contact, Encounter, Plan, Settings } from "./database";
import SettingService from "./settingService";
import { ContactService, EncounterService, PlanService } from "./services";
export declare const database: import("./database").Database;
export declare const models: {
    Contact: typeof Contact;
    Encounter: typeof Encounter;
    Plan: typeof Plan;
    Settings: typeof Settings;
};
export declare const services: {
    contactService: ContactService;
    encounterService: EncounterService;
    planService: PlanService;
    settingService: SettingService;
};
