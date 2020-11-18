import { db, Contact, Encounter, Plan, Settings } from "./database";
import SettingService from "./settingService";
import { ContactService, EncounterService, PlanService } from "./services";
export const database = db;
export const models = {
    Contact,
    Encounter,
    Plan,
    Settings
};
export const services = {
    contactService: new ContactService(),
    encounterService: new EncounterService(),
    planService: new PlanService(),
    settingService: new SettingService()
};
