import { db } from "./database";
class Service {
    constructor(connection = db) {
        this.connection = connection;
    }
    async fetchOne(id) {
        const entity = await this.table.get(id);
        return entity;
    }
    async fetchAll() {
        const entities = await this.table.toArray();
        return entities;
    }
    get table() {
        return this.connection[this.tableName];
    }
}
export class ContactService extends Service {
    constructor() {
        super(...arguments);
        this.tableName = "contacts";
    }
}
export class EncounterService extends Service {
    constructor() {
        super(...arguments);
        this.tableName = "encounters";
    }
    async fetchFor(contact) {
        return this.table
            .where("contactId")
            .equals(contact.id)
            .toArray();
    }
}
export class PlanService extends Service {
    constructor() {
        super(...arguments);
        this.tableName = "plans";
    }
    async fetchFor(contact) {
        return this.table
            .where("contactId")
            .equals(contact.id)
            .toArray();
    }
}
