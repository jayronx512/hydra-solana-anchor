const assert = require("assert");
const anchor = require("@project-serum/anchor");
const { Keypair } = require("@solana/web3.js");
const { BN } = require("bn.js");
const { SystemProgram, PublicKey } = anchor.web3;

const provider = anchor.Provider.env();
anchor.setProvider(provider);
const program = anchor.workspace.HydraCorelessBanking;

describe("hydra_coreless_banking", () => {
  //it("Create customer account", async () => testCreateAccount());
  it("Debit to account", async () => testDebitToAccount("GbtSfPVAn1bAJePuQtj2ebHgVoKPhGzoyC8d24t6Vgjb"));

  //it("Reset", async () => reset());
  //it("Retrieve", async () => getAccountInfo());
  it("Fund transfer", async () => testFundTransfer());
  //it("Fund transfer", async () => testFundTransfer());
  //it("Fund transfer", async () => testFundTransfer());
  //it("Fund transfer", async () => testFundTransfer());

  it("Retrieve", async () => getAccountInfo("GbtSfPVAn1bAJePuQtj2ebHgVoKPhGzoyC8d24t6Vgjb"));
  it("Retrieve", async () => getAccountInfo("D6L9yvFNkto1NECN1jnfcKLn9hzuNcY4ngdchiaXXVNC"));
});

async function testCreateAccount() {
  const payer = new PublicKey("AZeUEhQx4kUTEPE2ovdDJrvP2dsGcPGzceher6X5SM3a");
  const clientAccount = Keypair.generate();

  console.log("Create account for pubkey string: ", clientAccount.publicKey.toString());
  console.log("Create account for pubkey string: ", clientAccount.secretKey);

  await program.rpc.createAccount("MYR", "MR B", "001", "PASSPORT", "mrb@gmail.com", "Remark", "REF000000002", {
    accounts: {
      hydraAccount: clientAccount.publicKey,
      user: payer,
      systemProgram: SystemProgram.programId,
    },
    signers: [clientAccount],
  });

  const account = await program.account.hydraAccount.fetch(clientAccount.publicKey);
  console.log(account);
  console.log(account.pubkey.toString());
  console.log(account.balance.toString());
  console.log(account.currency);

  assert.ok(account.balance == 0);
}

async function testFundTransfer() {
  const payer = new PublicKey("GbtSfPVAn1bAJePuQtj2ebHgVoKPhGzoyC8d24t6Vgjb");
  const receiver = new PublicKey("D6L9yvFNkto1NECN1jnfcKLn9hzuNcY4ngdchiaXXVNC");

  await program.rpc.transfer(new BN(20), "transfer money", "REF002", {
    accounts: {
      fromAccount: payer,
      toAccount: receiver
    }
  });
}

async function testDebitToAccount(pubkey) {
  const receiver = new PublicKey(pubkey);

  await program.rpc.debit(new BN(100), "debit money", "REF003", {
    accounts: {
      hydraAccount: receiver
    }
  });

  const receiverAccount = await program.account.hydraAccount.fetch(receiver);
  console.log(receiverAccount.pubkey.toString());
  console.log(receiverAccount.balance.toString());
  console.log("Journal");
  receiverAccount.transactions.forEach(journal => {
    console.log(journal.journalType + " : " + journal.amount.toString());
  });
}

async function getAccountInfo(pubkey) {
  const customerPk = new PublicKey(pubkey);

  const customerAccount = await program.account.hydraAccount.fetch(customerPk);
  console.log(customerAccount.pubkey.toString());
  console.log(customerAccount.balance.toString());
  console.log("Journal");
  customerAccount.transactions.forEach(journal => {
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