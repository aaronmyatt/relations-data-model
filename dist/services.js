import { db } from "./database";
import { MS_PER_DAY } from "./utils";
export class Service {
    constructor(connection = db) {
        this.connection = connection;
    }
    fetchOne(id) {
        const entity = this.table.get(id);
        return entity;
    }
    fetchAll() {
        const entities = this.table.reverse();
        return entities;
    }
    addOne(entity) {
        return this.table.add(entity);
    }
    updateOne(entity) {
        return this.table.put(entity);
    }
    deleteOne(id) {
        return this.table.delete(id);
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
            .reverse();
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
            .reverse();
    }
    fetchFutureFor(contact) {
        return this.table
            .where("contactId")
            .equals(contact.id)
            .filter(plan => {
            return plan.when > new Date();
        })
            .reverse();
    }
    fetchLastFor(contact) {
        return this.table
            .where("contactId")
            .equals(contact.id)
            .first();
    }
    fetchForDate(date) {
        return this.fetchAllForDate(date).first();
    }
    fetchAllForDate(date) {
        let nextDay = new Date();
        nextDay.setDate(date.getDate() + 1);
        return this.table
            .filter(plan => {
            return plan.when >= date && plan.when < nextDay;
        })
            .reverse();
    }
    async daysBetweenLastPlans(contact) {
        const numberOfPlans = await this.fetchFor(contact).count();
        if (numberOfPlans > 1) {
            const [latestPlan, previousPlan] = await this.fetchFor(contact)
                .limit(2)
                .toArray();
            const daysBetweenPlans = Math.abs(Math.round((latestPlan.when.valueOf() - previousPlan.when.valueOf()) / MS_PER_DAY));
            return Math.round(daysBetweenPlans / 2);
        }
        else {
            return false;
        }
    }
}
