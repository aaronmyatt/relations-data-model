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
    // TODO: make sortable
    const entities = await this.table.reverse().toArray();
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

  // Implement pagination query
  // public async paginate(offset: number, limit: number): Promise<T[]>{
  //   // https://github.com/dfahlander/Dexie.js/issues/411
  // }
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

  public async fetchFutureFor(contact: Contact): Promise<Plan[]> {
    return this.table
      .where("contactId")
      .equals(contact.id)
      .filter(plan => {
        return plan.when > new Date();
      })
      .toArray();
  }

  // TODO: enable querying for plan on date
  // fetchForDate(date: Date){}

  // TODO: check if
  // schedulingConflict(date1: Date, date2: Date){}
}
