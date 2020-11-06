import { Database, db, Contact, Encounter, Plan } from "./database";

class Service<T> {
  connection: Database;
  tableName: string;

  constructor(connection: Database = db) {
    this.connection = connection;
  }

  public async fetchOne(id: number): Promise<T> {
    const entity = await this.table.get(id);
    return entity;
  }

  public async fetchAll(): Promise<T[]> {
    const entities = await this.table.toArray();
    return entities;
  }

  public async addOne(entity: T): Promise<number> {
    return this.table.add(entity);
  }

  public async updateOne(entity: T): Promise<number> {
    return this.table.put(entity);
  }

  get table(): Dexie.Table<T, number> {
    return this.connection[this.tableName];
  }
}

export class ContactService extends Service<Contact> {
  tableName = "contacts";
}
export class EncounterService extends Service<Encounter> {
  tableName = "encounters";

  public async fetchFor(contact: Contact): Promise<Encounter[]> {
    return this.table
      .where("contactId")
      .equals(contact.id)
      .toArray();
  }
}
export class PlanService extends Service<Plan> {
  tableName = "plans";

  public async fetchFor(contact: Contact): Promise<Plan[]> {
    return this.table
      .where("contactId")
      .equals(contact.id)
      .toArray();
  }
}
