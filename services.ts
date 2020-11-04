import { Database, db, Contact, Encounter, Plan } from "./database";

class Service<T> {
  connection: Database;
  tableName: string;

  constructor(connection: Database = db) {
    this.connection = connection;
  }

  public async fetchOne(id: number): Promise<T> {
    const entity = await this.connection[this.tableName].get(id);
    return entity;
  }

  public async fetchAll(): Promise<T[]> {
    const entities = await this.connection[this.tableName].toArray();
    return entities;
  }
}

export class ContactService extends Service<Contact> {
  tableName = "contacts";
}
export class EncounterService extends Service<Encounter> {
  tableName = "encounters";
}
export class PlanService extends Service<Plan> {
  tableName = "plans";
}
