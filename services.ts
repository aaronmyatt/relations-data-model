import { Database, db, Contact, Encounter, Plan } from "./database";
import { zeroOutDate } from "./utils";

class Service<T> {
  connection: Database;
  tableName: string;

  constructor(connection: Database = db) {
    this.connection = connection;
  }

  public fetchOne(id: number): Promise<T> {
    const entity = this.table.get(id);
    return entity;
  }

  public fetchAll(): Promise<T[]> {
    // TODO: make sortable
    const entities = this.table.reverse().toArray();
    return entities;
  }

  public addOne(entity: T): Promise<number> {
    return this.table.add(entity);
  }

  public updateOne(entity: T): Promise<number> {
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

  public fetchFor(contact: Contact): Promise<Encounter[]> {
    return this.table
      .where("contactId")
      .equals(contact.id)
      .toArray();
  }
}

export class PlanService extends Service<Plan> {
  tableName = "plans";

  public fetchFor(contact: Contact): Promise<Plan[]> {
    return this.table
      .where("contactId")
      .equals(contact.id)
      .toArray();
  }

  public fetchFutureFor(contact: Contact): Promise<Plan[]> {
    return this.table
      .where("contactId")
      .equals(contact.id)
      .filter(plan => {
        return plan.when > new Date();
      })
      .toArray();
  }

  public fetchForDate(date: Date): Promise<Plan> {
    return this.table
      .where("when")
      .equals(zeroOutDate(date))
      .first();
  }

  public fetchAllForDate(date: Date): Promise<Plan[]> {
    return this.table
      .where("when")
      .equals(zeroOutDate(date))
      .toArray();
  }
}
