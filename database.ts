import Dexie from "dexie";
import { zeroOutDate } from "./utils";

export class Database extends Dexie {
  contacts: Dexie.Table<Contact, number>;
  encounters: Dexie.Table<Encounter, number>;
  plans: Dexie.Table<Plan, number>;

  constructor() {
    super("relations");
    const db = this;
    db.version(1).stores({
      contacts:
        "++id, firstName, lastName, email, telephone, birthday, location",
      encounters: "++id, contactId, details, how, when",
      plans: "++id, contactId, when, sooner, later"
    });

    db.contacts.mapToClass(Contact);
    db.encounters.mapToClass(Encounter);
    db.plans.mapToClass(Plan);
  }
}

export class Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  _birthday: Date;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    telephone: string,
    birthday?: Date,
    id?: number
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.telephone = telephone;
    if (birthday) this.birthday = birthday;
    if (id) this.id = id;
  }

  set birthday(birthday: Date) {
    this._birthday = zeroOutDate(birthday);
  }

  get birthday(): Date {
    return this._birthday;
  }

  public static async generateMock(): Promise<void> {
    const lastContact = await db.contacts.toCollection().last();
    const lastContactId = lastContact ? lastContact.id : 0;
    const contact = new Contact(
      `test${lastContactId + 1}`,
      `testLast${lastContactId + 1}`,
      `test@test${lastContactId + 1}.com`,
      "123-123-123",
      new Date()
    );
    db.contacts.add(contact);
  }

  // TODO: implement this
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export class Encounter {
  id: number;
  contactId: number;
  details: string;
  how: string;
  _when: Date;

  constructor(
    contactId: number,
    details: string,
    how: string,
    when: Date,
    id?: number
  ) {
    this.contactId = contactId;
    this.details = details;
    this.how = how;
    this.when = when;
    if (id) this.id = id;
  }

  set when(date: Date) {
    this._when = zeroOutDate(date);
  }

  get when(): Date {
    return this._when;
  }

  public static async generateMock(contact: Contact): Promise<number> {
    const encounter = new Encounter(
      contact.id,
      `something worth remembering happened between ${contact.firstName} and I`,
      "phone",
      new Date()
    );
    return db.encounters.add(encounter);
  }
}
export class Plan {
  id: number;
  contactId: number;
  _when: Date;
  sooner: boolean;
  later: boolean;

  constructor(
    contactId: number,
    when: Date,
    sooner: boolean,
    later: boolean,
    id?: number
  ) {
    this.contactId = contactId;
    this.when = when;
    this.sooner = sooner;
    this.later = later;
    if (id) this.id = id;
  }

  set when(date: Date) {
    this._when = zeroOutDate(date);
  }

  get when(): Date {
    return this._when;
  }

  // TODO: make first plan for contact
  // public makePlan(){}

  // TODO: make subsequent plans
  // public makeNextPlan(contact: Contact, soonerOrLater: boolan){}

  public static async generateMock(contact: Contact): Promise<number> {
    const plan = new Plan(contact.id, new Date(), true, false);
    return db.plans.add(plan);
  }
}

export var db = new Database();
