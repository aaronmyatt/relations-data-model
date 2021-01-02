import Dexie from "dexie";

export class Database extends Dexie {
  contacts: Dexie.Table<Contact, number>;
  encounters: Dexie.Table<Encounter, number>;
  plans: Dexie.Table<Plan, number>;
  settings: Dexie.Table<Settings, number>;

  constructor() {
    super("relations");
    const db = this;

    db.version(1).stores({
      contacts:
        "++id, firstName, lastName, email, telephone, birthday, location",
      encounters: "++id, contactId, details, how, when",
      plans: "++id, contactId, when, sooner, later",
      settings: "++id, &name, value"
    });

    db.version(2)
      .stores({
        contacts:
          "++id, firstName, lastName, email, telephone, birthday, location",
        encounters: "++id, contactId, details, how, when",
        plans: "++id, contactId, when, sooner, later",
        settings: "++id, &name, value"
      })
      .upgrade(function(trans) {
        return trans.db.transaction(
          "rw",
          db.contacts,
          db.encounters,
          db.plans,
          async () => {
            db.contacts.toCollection().modify(contact => {
              contact.birthday = contact._birthday;
              delete contact._birthday;
            });

            db.encounters.toCollection().modify(encounter => {
              encounter.when = encounter._when;
              delete encounter._when;
            });

            db.plans.toCollection().modify(plan => {
              plan.when = plan._when;
              delete plan._when;
            });
          }
        );
      });

    db.contacts.mapToClass(Contact);
    db.encounters.mapToClass(Encounter);
    db.plans.mapToClass(Plan);
    db.settings.mapToClass(Settings);
  }
}

export class Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  birthday: Date;

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

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export class Encounter {
  id: number;
  contactId: number;
  details: string;
  how: string;
  when: Date;

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
  when: Date;
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

  // TODO: make first plan for contact
  // public makePlan(){}

  // TODO: make subsequent plans
  // public makeNextPlan(contact: Contact, soonerOrLater: boolan){}

  public static async generateMock(contact: Contact): Promise<number> {
    const plan = new Plan(contact.id, new Date(), true, false);
    return db.plans.add(plan);
  }
}

export class Settings {
  id: number;
  name: string;
  value: any;

  constructor(name: string, value: any, id?: number) {
    this.name = name;
    this.value = value;
    if (id) this.id = id;
  }
}

export var db = new Database();
