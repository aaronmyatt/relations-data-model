import Dexie from "dexie";

class RelationsDatabase extends Dexie {
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

  public static async generateMock() {
    const lastContact = await db.contacts.toCollection().last();
    console.log("last ", lastContact);
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

  public static async generateMock(contact: Contact) {
    const encounter = new Encounter(
      contact.id,
      `something worth remembering happened between ${contact.firstName} and I`,
      "phone",
      new Date()
    );
    db.encounters.add(encounter);
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
}

export var db = new RelationsDatabase();
