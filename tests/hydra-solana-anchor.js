const assert = require("assert");
const anchor = require("@project-serum/anchor");
const { KeyObject } = require("crypto");
const { Keypair } = require("@solana/web3.js");
const { BN } = require("bn.js");
const { SystemProgram, PublicKey } = anchor.web3;

const provider = anchor.Provider.env();
anchor.setProvider(provider);
const program = anchor.workspace.HydraSolanaAnchor;

describe("hydra_solana_anchor", () => {
  //it("Create customer account", async () => testCreateAccount());

  //it("Reset", async () => reset());
  it("Retrieve", async () => getAccountInfo());
  it("Fund transfer", async () => testFundTransfer());
  it("Fund transfer", async () => testFundTransfer());
  it("Retrieve", async () => getAccountInfo());
});

async function testCreateAccount() {
  const payer = new PublicKey("AZeUEhQx4kUTEPE2ovdDJrvP2dsGcPGzceher6X5SM3a");
  const clientAccount = anchor.web3.Keypair.generate();

  console.log("Create account for pubkey string: ", clientAccount.publicKey.toString());
  console.log("Create account for pubkey string: ", clientAccount.secretKey);

  await program.rpc.createAccount("MYR", "MR A", "001", "PASSPORT", "mra@gmail.com", "Remark", "REF000000001", {
    accounts: {
      hydraAccount: clientAccount.publicKey,
      user: payer,
      systemProgram: SystemProgram.programId,
    },
    signers: [clientAccount],
  });

  const account = await program.account.hydraAccount.fetch(clientAccount.publicKey);
  console.log(account);
  console.log(account.pubkey);
  console.log(account.pubkey.toString());
  console.log(account.balance.toString());
  console.log(account.currency);

  assert.ok(account.balance == 0);
}

async function testFundTransfer() {
  const payer = new PublicKey("81gTeoq29CJhRDiJRy392pXj78JdWpubyE14xob4Laxj");
  const receiver = new PublicKey("28n6qWs8iJPFajVNvLXCnnxn4Vr6AdyJTUdgbj2kbzqp");

  await program.rpc.transfer(new BN(100), "transfer money", "REF002", {
    accounts: {
      fromAccount: payer,
      toAccount: receiver
    }
  });

  // const payerAccount = await program.account.hydraAccount.fetch(payer);
  // console.log(payerAccount);
  // console.log(payerAccount.balance.toString());

  // const receiverAccount = await program.account.hydraAccount.fetch(receiver);
  // console.log(receiverAccount);
  // console.log(receiverAccount.balance.toString());
}

async function getAccountInfo() {
  const payer = new PublicKey("81gTeoq29CJhRDiJRy392pXj78JdWpubyE14xob4Laxj");
  const receiver = new PublicKey("28n6qWs8iJPFajVNvLXCnnxn4Vr6AdyJTUdgbj2kbzqp");

  const payerAccount = await program.account.hydraAccount.fetch(payer);
  console.log(payerAccount.pubkey.toString());
  console.log(payerAccount.balance.toString());
  console.log("Journal");
  payerAccount.transactions.forEach(journal => {
    console.log(journal.journalType + " : " + journal.amount.toString());
  });

  const receiverAccount = await program.account.hydraAccount.fetch(receiver);
  console.log(receiverAccount.pubkey.toString());
  console.log(receiverAccount.balance.toString());
  console.log("Journal");
  receiverAccount.transactions.forEach(journal => {
    console.log(journal.journalType + " : " + journal.amount.toString());
  });
}

async function reset() {
  const payer = new PublicKey("81gTeoq29CJhRDiJRy392pXj78JdWpubyE14xob4Laxj");
  const receiver = new PublicKey("28n6qWs8iJPFajVNvLXCnnxn4Vr6AdyJTUdgbj2kbzqp");

  await program.rpc.reset({
    accounts: {
      fromAccount: payer,
      toAccount: receiver
    }
  });
}