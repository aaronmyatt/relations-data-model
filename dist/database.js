import Dexie from "dexie";
import { zeroOutDate } from "./utils";
export class Database extends Dexie {
    constructor() {
        super("relations");
        const db = this;
        db.version(1).stores({
            contacts: "++id, firstName, lastName, email, telephone, birthday, location",
            encounters: "++id, contactId, details, how, when",
            plans: "++id, contactId, when, sooner, later",
            settings: "++id, name, value"
        });
        db.contacts.mapToClass(Contact);
        db.encounters.mapToClass(Encounter);
        db.plans.mapToClass(Plan);
        db.settings.mapToClass(Settings);
    }
}
export class Contact {
    constructor(firstName, lastName, email, telephone, birthday, id) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.telephone = telephone;
        if (birthday)
            this.birthday = birthday;
        if (id)
            this.id = id;
    }
    set birthday(birthday) {
        this._birthday = zeroOutDate(birthday);
    }
    get birthday() {
        return this._birthday;
    }
    static async generateMock() {
        const lastContact = await db.contacts.toCollection().last();
        const lastContactId = lastContact ? lastContact.id : 0;
        const contact = new Contact(`test${lastContactId + 1}`, `testLast${lastContactId + 1}`, `test@test${lastContactId + 1}.com`, "123-123-123", new Date());
        db.contacts.add(contact);
    }
    // TODO: implement this
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
export class Encounter {
    constructor(contactId, details, how, when, id) {
        this.contactId = contactId;
        this.details = details;
        this.how = how;
        this.when = when;
        if (id)
            this.id = id;
    }
    set when(date) {
        this._when = zeroOutDate(date);
    }
    get when() {
        return this._when;
    }
    static async generateMock(contact) {
        const encounter = new Encounter(contact.id, `something worth remembering happened between ${contact.firstName} and I`, "phone", new Date());
        return db.encounters.add(encounter);
    }
}
export class Plan {
    constructor(contactId, when, sooner, later, id) {
        this.contactId = contactId;
        this.when = when;
        this.sooner = sooner;
        this.later = later;
        if (id)
            this.id = id;
    }
    set when(date) {
        this._when = zeroOutDate(date);
    }
    get when() {
        return this._when;
    }
    // TODO: make first plan for contact
    // public makePlan(){}
    // TODO: make subsequent plans
    // public makeNextPlan(contact: Contact, soonerOrLater: boolan){}
    static async generateMock(contact) {
        const plan = new Plan(contact.id, new Date(), true, false);
        return db.plans.add(plan);
    }
}
export class Settings {
    constructor(name, value, id) {
        this.name = name;
        this.value = value;
        if (id)
            this.id = id;
    }
}
export var db = new Database();
