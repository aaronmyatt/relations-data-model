import Dexie from "dexie";
export declare class Database extends Dexie {
    contacts: Dexie.Table<Contact, number>;
    encounters: Dexie.Table<Encounter, number>;
    plans: Dexie.Table<Plan, number>;
    constructor();
}
export declare class Contact {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    _birthday: Date;
    constructor(firstName: string, lastName: string, email: string, telephone: string, birthday?: Date, id?: number);
    set birthday(birthday: Date);
    get birthday(): Date;
    static generateMock(): Promise<void>;
    get fullName(): string;
}
export declare class Encounter {
    id: number;
    contactId: number;
    details: string;
    how: string;
    _when: Date;
    constructor(contactId: number, details: string, how: string, when: Date, id?: number);
    set when(date: Date);
    get when(): Date;
    static generateMock(contact: Contact): Promise<number>;
}
export declare class Plan {
    id: number;
    contactId: number;
    _when: Date;
    sooner: boolean;
    later: boolean;
    constructor(contactId: number, when: Date, sooner: boolean, later: boolean, id?: number);
    set when(date: Date);
    get when(): Date;
    static generateMock(contact: Contact): Promise<number>;
}
export declare var db: Database;
