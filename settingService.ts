import { Service } from "./services";
import { Settings } from "./database";
import { importDB, exportDB } from "dexie-export-import";
import Dexie from "dexie";

export default class SettingService extends Service<Settings> {
  constructor() {
    super();
    if (location) {
      const url = new URL(location.href);
      const dbString = url.searchParams.get("json");
      if (dbString) {
        const dbBlob = new Blob([dbString], { type: "application/json" });
        if (confirm("Import database?")) {
          Dexie.import(dbBlob, {
            clearTablesBeforeImport: true
          });
        }
      }
    }
  }

  public async exportDB() {
    const blob = await exportDB(this.connection);
    const dbJson = await blob.text();
    return `${location.href}import?json=${dbJson}`;
  }
}
