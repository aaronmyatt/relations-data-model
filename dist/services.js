import { db } from "./database";
import { zeroOutDate } from "./utils";
class Service {
    constructor(connection = db) {
        this.connection = connection;
    }
    fetchOne(id) {
        const entity = this.table.get(id);
        return entity;
    }
    fetchAll() {
        // TODO: make sortable
        const entities = this.table.reverse().toArray();
        return entities;
    }
    addOne(entity) {
        return this.table.add(entity);
    }
    updateOne(entity) {
        return this.table.put(entity);
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
    fetchFor(contact) {
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
    fetchFor(contact) {
        return this.table
            .where("contactId")
            .equals(contact.id)
            .toArray();
    }
    fetchFutureFor(contact) {
        return this.table
            .where("contactId")
            .equals(contact.id)
            .filter(plan => {
            return plan.when > new Date();
        })
            .toArray();
    }
    fetchForDate(date) {
        return this.table
            .where("when")
            .equals(zeroOutDate(date))
            .first();
    }
    fetchAllForDate(date) {
        return this.table
            .where("when")
            .equals(zeroOutDate(date))
            .toArray();
    }
}
