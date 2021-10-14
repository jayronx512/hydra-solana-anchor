// @ts-nocheck
import { Program, Provider } from '@project-serum/anchor';
import { NodeWallet } from '@project-serum/anchor/dist/cjs/provider';
import { Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import express from 'express';
import idl from './idl.json';
import appconfig from "./appconfig.json";
import fxrates from "./fxrate.json";
import { DbConnection } from './db';

const app = express();
const opts = {
  preflightCommitment: 'processed'
}

const base64 = {
  decode: s => Buffer.from(s, 'base64'),
  encode: b => Buffer.from(b).toString('base64')
};

const programID = new PublicKey("2WGPmHfmXLfUjL1wEpmUGGHA8LRwbPbYEbMwmUQ6Z186");
const superAccount = Keypair.fromSecretKey(new Uint8Array([202, 160, 29, 252, 172, 166, 186, 79, 200, 110, 186, 144, 77, 36, 214, 103, 159, 163, 95, 253, 186, 192, 67, 222, 186, 176, 231, 222, 4, 163, 130, 166, 142, 22, 34, 158, 55, 203, 116, 182, 166, 19, 252, 27, 30, 120, 0, 141, 181, 2, 106, 216, 165, 187, 101, 213, 136, 245, 131, 232, 225, 226, 69, 13]));

app.use(express.json())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/accounts', async (req, res) => {
  let accounts = await getAccounts();
  return res.json(accounts);
})

app.get('/account/:pubkey', async (req, res) => {
  let account = await getAccount(req.params['pubkey']);
  return res.json(account);
})

app.post('/account', async (req, res) => {
  console.log('Handle create account request', req.body);
  if (!req.body.currency?.trim() || !req.body.name?.trim() || !req.body.id_number?.trim() || !req.body.id_type?.trim() || !req.body.email?.trim() || !req.body.remark?.trim() || !req.body.referrence_number?.trim() || !req.body.payer?.trim()) {
    return res.status(400).send({
      message: 'Unable to Create Account! Invalid parameters.'
    });
  }

  try {
    const customerAccount = Keypair.generate();
    await createAccount(customerAccount, req.body);
    res.send(base64.encode(customerAccount.secretKey));
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Unable to Create Account! Internal server error!'
    })
  }
})

app.post('/topup', async (req, res) => {
  console.log('Handle top up to account request', req.body);
  if (!req.body.public_key?.trim() || !req.body.amount?.trim() || !req.body.payer?.trim()) {
    return res.status(400).send({
      message: 'Unable to Top Up! Invalid parameters.'
    });
  }

  try {
    await topupAccount(req.body);
    res.send('Top Up Successfully!');
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Unable to Top Up! Internal server error!'
    })
  }
})

app.post('/transfer', async (req, res) => {
  console.log('Handle transfer request', req.body);
  try {
    await transfer(req.body);
    res.send('Transfer Successfully!');
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Unable to Transfer! Internal server error!'
    })
  }
})

try {
  onProgramAccountChange();
} catch (error) {
  console.log(error);
}


async function getProvider(solAccount) {
  const network = "https://api.devnet.solana.com";
  var connection = new Connection(network, opts.preflightCommitment);
  return new Provider(connection, new NodeWallet(solAccount), opts.preflightCommitment);
}

async function getAccounts() {
  const provider = await getProvider(superAccount);
  var program = new Program(idl, programID, provider);
  let response = await provider.connection.getProgramAccounts(programID);

  let decodeAccount = (pubkey, account) => {
    try {
      let data = program.coder.accounts.decode(program.account.hydraAccount._idlAccount.name, account.data);
      return {
        publicKey: pubkey,
        data,
      };
    } catch (error) { }
  };

  return response.map(({ pubkey, account }) => decodeAccount(pubkey, account))
    .filter(value => value != undefined);
}

async function getAccount(param) {
  const provider = await getProvider(superAccount);
  var program = new Program(idl, programID, provider);
  return program.account.hydraAccount.fetch(new PublicKey(param));
}

async function createAccount(customerAccount, param) {
  const payer = getPayer(param.payer);
  const provider = await getProvider(payer);
  const program = new Program(idl, programID, provider);

  return program.rpc.createAccount(param.currency, param.name, param.id_number, param.id_type, param.email, param.remark, param.referrence_number, {
    accounts: {
      hydraAccount: customerAccount.publicKey,
      authority: payer.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [payer, customerAccount],
  });
}

async function topupAccount(param) {
  const payer = getPayer(param.payer);
  const provider = await getProvider(payer);
  const program = new Program(idl, programID, provider);

  return program.rpc.topup(param.amount, param.remark, param.referrence_number, {
    accounts: {
      hydraAccount: new PublicKey(param.public_key)
    }
  })
}

async function transfer(param) {
  let fxrate = 1;
  if (param.sender_currency != param.receiver_currency) {
    let fxrate_info = fxrates
      .find(fxrate => fxrate.base == param.receiver_currency && fxrate.rates[param.sender_currency]);
    fxrate = fxrate_info == null ? 1 : fxrate_info.rates[param.sender_currency];
  }

  const payer = getPayer(param.payer);
  const sender = getPayer(param.sender);
  const provider = await getProvider(payer);
  const program = new Program(idl, programID, provider);

  return program.rpc.crossCurrencyTransfer(param.amount, fxrate.toString(), param.remark, param.referrence_number, {
    accounts: {
      fromAccount: sender.publicKey,
      authority: payer.publicKey,
      toAccount: new PublicKey(param.receiver)
    },
    signers: [payer, sender]
  });
}

async function onProgramAccountChange() {
  const provider = await getProvider(superAccount);
  var program = new Program(idl, programID, provider);

  provider.connection.onProgramAccountChange(programID, async account => {
    console.log('Handle on change event for account', account.accountId.toString());
    let data = program.coder.accounts.decode(program.account.hydraAccount._idlAccount.name, account.accountInfo.data);
    (await DbConnection.getDb()).collection('account_change_event').insertOne(data);
  });
}

function getPayer(payer) {
  const secret = new Uint8Array(base64.decode(payer));
  return Keypair.fromSecretKey(secret);
}

app.listen(appconfig.server.nodePort, () => {
  console.log('Service started at port', appconfig.server.nodePort);
});