import { Database, db, Contact, Encounter, Plan } from "./database";
import { MS_PER_DAY } from "./utils";
import { Collection } from "dexie";

export class Service<T> {
  connection: Database;
  tableName: string;

  constructor(connection: Database = db) {
    this.connection = connection;
  }

  public fetchOne(id: number): Promise<T> {
    const entity = this.table.get(id);
    return entity;
  }

  public fetchAll(): Collection<T, number> {
    const entities = this.table.reverse();
    return entities;
  }

  public addOne(entity: T): Promise<number> {
    return this.table.add(entity);
  }

  public updateOne(entity: T): Promise<number> {
    return this.table.put(entity);
  }

  public deleteOne(id: number): Promise<void> {
    return this.table.delete(id);
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

  public fetchFor(contact: Contact): Collection<Encounter, number> {
    return this.table
      .where("contactId")
      .equals(contact.id)
      .reverse();
  }
}

export class PlanService extends Service<Plan> {
  tableName = "plans";

  public fetchFor(contact: Contact): Collection<Plan, number> {
    return this.table
      .where("contactId")
      .equals(contact.id)
      .reverse();
  }

  public fetchFutureFor(contact: Contact): Collection<Plan, number> {
    return this.table
      .where("contactId")
      .equals(contact.id)
      .filter(plan => {
        return plan.when > new Date();
      })
      .reverse();
  }

  public fetchLastFor(contact: Contact): Promise<Plan> {
    return this.table
      .where("contactId")
      .equals(contact.id)
      .first();
  }

  public fetchForDate(date: Date): Promise<Plan> {
    return this.fetchAllForDate(date).first();
  }

  public fetchAllForDate(date: Date): Collection<Plan, number> {
    let nextDay = new Date();
    nextDay.setDate(date.getDate() + 1);

    return this.table
      .filter(plan => {
        return plan.when >= date && plan.when < nextDay;
      })
      .reverse();
  }

  public async daysBetweenLastPlans(
    contact: Contact
  ): Promise<number | boolean> {
    const numberOfPlans = await this.fetchFor(contact).count();

    if (numberOfPlans > 1) {
      const [latestPlan, previousPlan] = await this.fetchFor(contact)
        .limit(2)
        .toArray();
      const daysBetweenPlans = Math.abs(
        Math.round(
          (latestPlan.when.valueOf() - previousPlan.when.valueOf()) / MS_PER_DAY
        )
      );
      return Math.round(daysBetweenPlans / 2);
    } else {
      return false;
    }
  }
}
