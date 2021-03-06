import { Service } from "./services";
import { Settings } from "./database";
import { exportDB } from "dexie-export-import";

export default class SettingService extends Service<Settings> {
  tableName = "settings";

  constructor() {
    super();
    if (location) {
      const url = new URL(location.href);
      const dbString = url.searchParams.get("json");
      if (dbString) {
        const dbBlob = new Blob([dbString], { type: "application/json" });
        if (confirm("Import database?")) {
          this.connection.import(dbBlob, {
            clearTablesBeforeImport: true
          });
        }
      }
    }
    this.initialiseSettings();
  }

  public async exportDBRaw() {
    const blob = await exportDB(this.connection);
    return await blob.text();
  }

  public async exportDB() {
    const dbJson = await this.exportDBRaw();
    return `${location.href}/import?json=${dbJson}`;
  }

  public async deleteDB() {
    await this.connection.delete();
  }

  public async initialiseSettings() {
    this.table.bulkAdd([
      new Settings("firstTimeLogin", true),
      new Settings("minDaysBetweenPlans", 2),
      new Settings("maxPlansPerDay", 2),
      new Settings("targetedDailyEncounters", 1)
    ]);
  }
}
