import React, { useState, useEffect } from 'react';
import {reactLocalStorage} from 'reactjs-localstorage';
import history from '../history';
import { NodeWallet } from '@project-serum/anchor/dist/cjs/provider';
import idl from '../idl.json';
import {
    Program, Provider, web3
  } from '@project-serum/anchor';

  
import { Connection, PublicKey } from '@solana/web3.js';
const { SystemProgram, Keypair } = web3;

const opts = {
    preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);
const network = "https://api.devnet.solana.com";
const payer = Keypair.fromSecretKey(new Uint8Array(JSON.parse(reactLocalStorage.get("secretKey"))));
const client = Keypair.generate()
function Dashboard() {
    const[publicKey, setPublicKey] =  useState(reactLocalStorage.get("publicKey"));
    const[secretKey, setSecretKey] = useState(reactLocalStorage.get("secretKey"))
    const[balance, setBalance] = useState("");
    const[currency, setCurrency] = useState("");
    const[name, setName] = useState("");
    const[idNumber, setIdNumber] = useState("");
    const[idType, setIdType] = useState("");
    const[email, setEmail]  = useState("");
    const[remark, setRemark] = useState("");
    useEffect(async () => {
        console.log(reactLocalStorage.get("secretKey"))
    }, [])


    async function getProvider() {
        const wallet = new NodeWallet(payer);
        const network = "https://api.devnet.solana.com";
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new Provider(
            connection, wallet, opts.preflightCommitment
        )
        return provider;
    }

    async function requestAirDrop() {
        // const provider = await getProvider()
        // const program = new Program(idl, programID, provider)
        const provider = await getProvider();
        const program = new Program(idl, programID, provider);
        const connection = program.provider.connection;
        var fromAirdropSignature = await connection.requestAirdrop(
            new PublicKey(publicKey),
            web3.LAMPORTS_PER_SOL,
          );
        // Wait for airdrop confirmation
        await connection.confirmTransaction(fromAirdropSignature);
        var balance = await connection.getBalance(
            new PublicKey(publicKey)
        )

        setBalance(balance / web3.LAMPORTS_PER_SOL);
        return;
    }

    async function getBalance() {
        const provider = await getProvider();
        const program = new Program(idl, programID, provider);
        const connection = program.provider.connection;
        var balance = await connection.getBalance(
            new PublicKey(publicKey)
        )

        setBalance(balance / web3.LAMPORTS_PER_SOL);
        return;
    }

    async function createAccount() {
        const provider = await getProvider();
        const program = new Program(idl, programID, provider);
        var tempPublicKey = new PublicKey(publicKey)
        console.log(client)
        // await program.rpc.createAccount(
        //     name,
        //     currency,
        //     idNumber,
        //     idType,
        //     email,
        //     remark, 
        //     {
        //         accounts: {
        //             hydraAccount: tempPublicKey,
        //             user: payer,
        //             systemProgram: SystemProgram.programId,
        //         },
        //         signers: [payer]
        //     }
        // )
        program.rpc.createAccount("MYR", "MRA", "001", "PASSPORT", "mra@gmail.com", "Remark", {
            accounts: {
            hydraAccount: tempPublicKey,
            user: payer,
            systemProgram: SystemProgram.programId,
            },
            signers: [payer],
            });
    }

    return (
        <div>
            <h1>Balance: {balance}</h1>
            <div>
                <button onClick={()=> {requestAirDrop()}}>Request airdrop</button>
                <button onClick={()=> {getBalance()}}>Get Balance</button>
            </div>
            <div>
                <label>Name</label>
                <input type="text" onChange={(e)=>{setName(e.target.value)}} />
                <label>Currency</label>
                <input type="text" onChange={(e)=>{setCurrency(e.target.value)}} />
                <label>ID Number</label>
                <input type="text" onChange={(e)=>{setIdNumber(e.target.value)}} />
                <label>ID Type</label>
                <input type="text" onChange={(e)=>{setIdType(e.target.value)}} />
                <label>Email</label>
                <input type="text" onChange={(e)=>{setEmail(e.target.value)}} />
                <label>Remark</label>
                <input type="text" onChange={(e)=>{setRemark(e.target.value)}} />
                <button onClick={()=> {createAccount()}}>Create Account</button>
            </div>
        </div>
    )
}

export default Dashboard;