import { Db, MongoClient } from "mongodb";

export class DbConnection {
    private static db: Db;

    private constructor() { }

    private async connect() {
        const uri = 'mongodb+srv://infinitude_adm:infinitude_adm@cluster0.zypfs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
        return await MongoClient.connect(uri);
    }

    static async getDb() {
        if (!this.db) {
            this.db = (await new this().connect()).db();
        }
        return this.db;
    }
}