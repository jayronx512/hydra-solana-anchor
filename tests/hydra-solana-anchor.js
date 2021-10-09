const assert = require("assert");
const anchor = require("@project-serum/anchor");
const { SystemProgram, PublicKey } = anchor.web3;

describe("hydra_solana_anchor", () => {
  /* create and set a Provider */
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.HydraSolanaAnchor;

  it("Creates customer account", async () => {
    const payer = new PublicKey("AZeUEhQx4kUTEPE2ovdDJrvP2dsGcPGzceher6X5SM3a");
    const clientAccount = anchor.web3.Keypair.generate();

    await program.rpc.createAccount("MYR", "MRA", "001", "PASSPORT", "mra@gmail.com", {
      accounts: {
        scAccount: clientAccount.publicKey,
        user: payer,
        systemProgram: SystemProgram.programId,
      },
      signers: [clientAccount],
    });

    const account = await program.account.scAccount.fetch(clientAccount.publicKey);
    console.log(account);

    assert.ok(account.balance == 0);
  });
});