import { Service } from "./services";
import { Settings } from "./database";
export default class SettingService extends Service<Settings> {
    tableName: string;
    constructor();
    exportDBRaw(): Promise<string>;
    exportDB(): Promise<string>;
    deleteDB(): Promise<void>;
    initialiseSettings(): Promise<void>;
}
