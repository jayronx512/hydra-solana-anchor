import { Db, MongoClient } from "mongodb";

export class DbConnection {
    private static db: Db;

    private constructor() { }

    private async connect() {
        const uri = 'mongodb://infinitude_adm:infinitude_adm@127.0.0.1:27017/infinitude?retryWrites=true&w=majority';
        return await MongoClient.connect(uri);
    }

    static async getDb() {
        if (!this.db) {
            this.db = (await new this().connect()).db();
        }
        return this.db;
    }
}