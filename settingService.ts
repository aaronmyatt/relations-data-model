import { Service } from "./services";
import { Settings } from "./database";
import { importDB, exportDB } from "dexie-export-import";

export default class SettingService extends Service<Settings> {
  constructor() {
    super();
    if (location) {
      const url = new URL(location.href);
      const dbString = url.searchParams.get("json");
      if (dbString) {
        const dbJson = JSON.parse(dbString);
        const dbBlob = new Blob(dbJson);

        if (confirm("Import database?")) {
          importDB(dbBlob);
        }
      }
    }
  }

  public async exportDB() {
    const blob = await exportDB(this.connection);
    const dbJson = await blob.text();
    return `${location.href}/import?json=${dbJson}`;
  }
}
