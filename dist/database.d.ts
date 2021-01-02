import Dexie from "dexie";
export declare class Database extends Dexie {
    contacts: Dexie.Table<Contact, number>;
    encounters: Dexie.Table<Encounter, number>;
    plans: Dexie.Table<Plan, number>;
    settings: Dexie.Table<Settings, number>;
    constructor();
}
export declare class Contact {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    birthday: Date;
    constructor(firstName: string, lastName: string, email: string, telephone: string, birthday?: Date, id?: number);
    static generateMock(): Promise<void>;
    get fullName(): string;
}
export declare class Encounter {
    id: number;
    contactId: number;
    details: string;
    how: string;
    when: Date;
    constructor(contactId: number, details: string, how: string, when: Date, id?: number);
    static generateMock(contact: Contact): Promise<number>;
}
export declare class Plan {
    id: number;
    contactId: number;
    when: Date;
    sooner: boolean;
    later: boolean;
    constructor(contactId: number, when: Date, sooner: boolean, later: boolean, id?: number);
    static generateMock(contact: Contact): Promise<number>;
}
export declare class Settings {
    id: number;
    name: string;
    value: any;
    constructor(name: string, value: any, id?: number);
}
export declare var db: Database;
