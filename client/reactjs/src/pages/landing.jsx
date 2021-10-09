import React, { useState} from 'react';
import {reactLocalStorage} from 'reactjs-localstorage';
import history from '../history';

import {
    Program, Provider, web3
  } from '@project-serum/anchor';


import { Connection, PublicKey } from '@solana/web3.js';
const { SystemProgram, Keypair } = web3;
if (reactLocalStorage.get("publicKey") == null || reactLocalStorage.get("publicKey") == "") {
    const baseAccount = Keypair.generate();
    reactLocalStorage.set("publicKey", baseAccount.publicKey);
    reactLocalStorage.set("secretKey", JSON.stringify(Array.from(baseAccount.secretKey)))
} else {
    history.push('/dashboard');
}


function Landing() {
    const[publicKey, setPublicKey] = useState("");

    return (
        <div>
            <h1>Testing</h1>
        </div>
    )
}

export default Landing;