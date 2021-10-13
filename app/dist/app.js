"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const anchor_1 = require("@project-serum/anchor");
const provider_1 = require("@project-serum/anchor/dist/cjs/provider");
const web3_js_1 = require("@solana/web3.js");
const express_1 = __importDefault(require("express"));
const idl_json_1 = __importDefault(require("./idl.json"));
const app = (0, express_1.default)();
const port = 5000;
const opts = {
    preflightCommitment: "processed"
};
app.get('/accounts', (req, res) => {
    let accounts = getAccounts();
    return accounts;
});
const programID = new web3_js_1.PublicKey("2WGPmHfmXLfUjL1wEpmUGGHA8LRwbPbYEbMwmUQ6Z186");
const solAccount = web3_js_1.Keypair.fromSecretKey(new Uint8Array([205, 227, 67, 30, 196, 134, 37, 87, 83, 72, 27, 113, 10, 75, 15, 171, 117, 140, 130, 204, 78, 10, 4, 164, 36, 3, 34, 189, 122, 158, 173, 105, 238, 144, 212, 46, 182, 206, 229, 51, 60, 191, 246, 86, 155, 22, 188, 91, 169, 112, 222, 248, 143, 86, 197, 1, 110, 93, 185, 14, 28, 79, 95, 215]));
function getProvider(solAccount) {
    return __awaiter(this, void 0, void 0, function* () {
        const network = "https://api.devnet.solana.com";
        var connection = new web3_js_1.Connection(network, opts.preflightCommitment);
        return new anchor_1.Provider(connection, new provider_1.NodeWallet(solAccount), opts.preflightCommitment);
    });
}
function getAccounts() {
    return __awaiter(this, void 0, void 0, function* () {
        return "aa";
        const provider = yield getProvider(solAccount);
        var program = new anchor_1.Program(idl_json_1.default, programID, provider);
        var instances = yield provider.connection.getProgramAccounts(programID);
        instances.forEach((instance) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = instance.account.data;
                let val = program.coder.accounts.decode(program.account.hydraAccount._idlAccount.name, data);
                console.log(val.pubkey.toString());
                console.log(val);
            }
            catch (error) {
            }
        }));
        return "aa";
    });
}
app.listen(port, () => {
    console.log('server started at port ${port}');
});
//# sourceMappingURL=app.js.map