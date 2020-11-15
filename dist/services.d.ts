import { Database, Contact, Encounter, Plan } from "./database";
import { Collection } from "dexie";
declare class Service<T> {
    connection: Database;
    tableName: string;
    constructor(connection?: Database);
    fetchOne(id: number): Promise<T>;
    fetchAll(): Collection<T, number>;
    addOne(entity: T): Promise<number>;
    updateOne(entity: T): Promise<number>;
    get table(): Dexie.Table<T, number>;
}
export declare class ContactService extends Service<Contact> {
    tableName: string;
}
export declare class EncounterService extends Service<Encounter> {
    tableName: string;
    fetchFor(contact: Contact): Collection<Encounter, number>;
}
export declare class PlanService extends Service<Plan> {
    tableName: string;
    fetchFor(contact: Contact): Collection<Plan, number>;
    fetchFutureFor(contact: Contact): Collection<Plan, number>;
    fetchLastFor(contact: Contact): Promise<Plan>;
    fetchForDate(date: Date): Promise<Plan>;
    fetchAllForDate(date: Date): Collection<Plan, number>;
    daysBetweenLastPlans(contact: Contact): Promise<number | boolean>;
}
export {};
