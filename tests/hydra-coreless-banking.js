const assert = require("assert");
const anchor = require("@project-serum/anchor");
const { Keypair, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const { BN } = require("bn.js");
const { SystemProgram, PublicKey } = anchor.web3;

const provider = anchor.Provider.env();
anchor.setProvider(provider);
const program = anchor.workspace.HydraCorelessBanking;

const solAccount = Keypair.fromSecretKey(new Uint8Array([
  251, 209, 181, 94, 47, 22, 24, 237, 190, 25, 120,
  138, 4, 233, 78, 203, 251, 57, 144, 253, 100, 104,
  211, 101, 95, 25, 174, 162, 164, 181, 152, 165, 26,
  41, 176, 78, 175, 4, 39, 228, 243, 96, 101, 56,
  254, 78, 11, 89, 44, 98, 49, 150, 17, 46, 65,
  208, 74, 213, 2, 94, 227, 74, 216, 154
]));

describe("hydra_coreless_banking", () => {
  //it("Create solana account and airdrop", async () => testInitAccount());

  //it("Create customer account", async () => testCreateAccount());

  //it("Update client name", async () => updateClientName("Fesw6UDS8ybLbsCSNiZhDyCfS3wi5RjYjPT324KzSY8n"));

  //it("Topup to account", async () => testTopUpAccount("TFXxTahUD6MVLQ1CTyB8x77gqxcCRprWXhU8PqfmQac"));
  //it("Withdraw from account", async () => testWithdrawFromAccount());

  //it("Retrieve", async () => getAccountInfo());

  //it("Fund transfer", async () => testTransfer());
  //it("Fund transfer", async () => testTransfer());
  //it("Fund transfer", async () => testTransfer());
  //it("Fund transfer", async () => testTransfer());
  //it("Fund transfer", async () => testTransfer());

  //it("Retrieve", async () => getAccountInfo("TFXxTahUD6MVLQ1CTyB8x77gqxcCRprWXhU8PqfmQac"));
  //it("Retrieve", async () => getAccountInfo("66cxZVY2XGBvsHCQD3AcCrNsSA3r5dc7x36A1PYGvucy"));

  //it("Retrieve All", async () => getProgramAccounts());

  it("Init", async () => init());
});

async function testInitAccount() {
  const customerAccount = Keypair.generate();
  var requestAirdropTransaction = await provider.connection.requestAirdrop(customerAccount.publicKey, LAMPORTS_PER_SOL);

  console.log("Create account for pubkey string: ", customerAccount.publicKey.toString());
  console.log("Create account for pubkey string: ", customerAccount.secretKey);

  await provider.connection.confirmTransaction(requestAirdropTransaction);
  var balance = await provider.connection.getBalance(customerAccount.publicKey);
  console.log("Balance: ", balance);
}

async function testCreateAccount() {
  const clientAccount = Keypair.generate();

  console.log("Create account for pubkey string: ", clientAccount.publicKey.toString());
  console.log("Create account for pubkey string: ", clientAccount.secretKey);

  await program.rpc.createAccount("MYR", "MR B", "001", "PASSPORT", "mrb@gmail.com", "Remark", "REF000000002", {
    accounts: {
      hydraAccount: clientAccount.publicKey,
      authority: solAccount.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [solAccount, clientAccount],
  });

  const account = await program.account.hydraAccount.fetch(clientAccount.publicKey);
  console.log(account);
  console.log(account.pubkey.toString());
  console.log(account.balance.toString());
  console.log(account.currency);

  assert.ok(account.balance == 0);
}

async function testTransfer() {
  const payer = Keypair.fromSecretKey(new Uint8Array([
    180, 68, 194, 97, 159, 192, 155, 125, 172, 206, 198,
    161, 86, 98, 130, 119, 37, 51, 38, 86, 214, 93,
    123, 204, 54, 156, 134, 21, 130, 116, 193, 112, 6,
    185, 136, 204, 182, 183, 229, 53, 28, 69, 146, 129,
    116, 175, 71, 147, 246, 150, 25, 205, 253, 182, 1,
    91, 202, 150, 122, 200, 20, 103, 161, 25
  ]));
  const receiver = new PublicKey("EuJnasNnwrcYP2UV22uGppb8coB6ZrTuyrWUEG6dPsax");

  await program.rpc.transfer(new BN(20), "transfer money", "REF002", {
    accounts: {
      fromAccount: payer.publicKey,
      authority: solAccount.publicKey,
      toAccount: receiver
    },
    signers: [solAccount, payer]
  }).catch(error => console.log(error));
}

async function testTopUpAccount(pubkey) {
  const receiver = new PublicKey(pubkey);

  await program.rpc.topup(new BN(100.05), "topup to account", "REF003", {
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

async function testWithdrawFromAccount() {
  const withdrawer = Keypair.fromSecretKey(new Uint8Array([
    180, 68, 194, 97, 159, 192, 155, 125, 172, 206, 198,
    161, 86, 98, 130, 119, 37, 51, 38, 86, 214, 93,
    123, 204, 54, 156, 134, 21, 130, 116, 193, 112, 6,
    185, 136, 204, 182, 183, 229, 53, 28, 69, 146, 129,
    116, 175, 71, 147, 246, 150, 25, 205, 253, 182, 1,
    91, 202, 150, 122, 200, 20, 103, 161, 25
  ]));

  try {
    await program.rpc.withdraw(new BN(80), "withdraw money", "REF004", {
      accounts: {
        hydraAccount: withdrawer.publicKey,
        authority: solAccount.publicKey,
      },
      signers: [solAccount, withdrawer]
    });
  } catch (error) {
    console.log(error);
    return;
  }

  const withdrawerAccount = await program.account.hydraAccount.fetch(withdrawer.publicKey);
  console.log(withdrawerAccount.pubkey.toString());
  console.log(withdrawerAccount.balance.toString());
  console.log("Journal");
  withdrawerAccount.transactions.forEach(journal => {
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

async function getProgramAccounts() {
  var instances = await program.account.hydraAccount.all();
  instances.forEach(instance => {
    console.log(instance.publicKey.toString());
    console.log(instance.account.pubkey.toString());
    console.log(instance.account);
    instance.account.transactions.forEach(transaction => {
      console.log(transaction.amount.toString());
    });
  });
}

async function init() {
  await program.rpc.initialize("80.05", "1.358", {
    accounts: {
      hydraAccount: new PublicKey("DNLJUyH11hSLgRCarjRoZReTyD7hwEZ4xyNMQWE6YWu4"),
    }
  });
}