import { Service } from "./services";
import { Settings } from "./database";
import { exportDB } from "dexie-export-import";
export default class SettingService extends Service {
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
    async exportDB() {
        const blob = await exportDB(this.connection);
        const dbJson = await blob.text();
        return `${location.href}import?json=${dbJson}`;
    }
    async deleteDB() {
        await this.connection.delete();
    }
    async initialiseSettings() {
        this.table.bulkAdd([
            new Settings("firstTimeLogin", false),
            new Settings("minDaysBetweenPlans", 2),
            new Settings("maxPlansPerDay", 2)
        ]);
    }
}