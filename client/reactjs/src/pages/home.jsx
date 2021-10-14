import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {reactLocalStorage} from 'reactjs-localstorage';
import history from '../history';
import PullToRefresh from 'react-simple-pull-to-refresh';
import Loading from '../components/loading';
import Box from '@mui/material/Box';
import CustomTopNavigation from '../components/topnavigation';

// import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import RedeemIcon from '@mui/icons-material/Redeem';

import { NodeWallet } from '@project-serum/anchor/dist/cjs/provider';
import idl from '../idl.json';
import {
    Program, Provider, web3
  } from '@project-serum/anchor';

  
import { Connection, PublicKey } from '@solana/web3.js';
import { HistoryOutlined } from '@material-ui/icons';
const { SystemProgram, Keypair } = web3;
const opts = {
    preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);
const network = "https://api.devnet.solana.com";

const boxStyle = {
    width: "75vw",
    height: "40vh",
    backgroundColor: "#3699FF",
    borderRadius: "5px",
    padding: "30px",
    color: "white",
}

const subBoxStyle = {
    minWidth: "32vw",
    height: "20vw",
    padding: "30px 15px 0px 15px",
    backgroundColor: "white",
    borderRadius: "5px",
    margin: "0px 5px 0px 5px"
}

export default function Home() {
    const [loading, setLoading] = useState(false)
    const [accountList, setAccountList] = useState([])
    const [transactionCount, setTransactionCount] = useState(0)
    const[solanaPublicKey, setSolanaPublicKey] = useState("")
    const[solanaSecretKey, setSolanaSecretKey] = useState("")
    const[account, setAccount] = useState({name: ""})

    useEffect(async () => {
        setLoading(true)
        let account = JSON.parse(reactLocalStorage.get("account"))
        let newCount = 0
        let newAccount = []
        for (let i=0; i<account.accountList.length; i++) {
            let individualAccount = account.accountList[i]
            try {
                if (account.solanaAccount.secretKey != "") {
                    const provider = await getProvider(account.solanaAccount.secretKey);
                    const program = new Program(idl, programID, provider);
                    let publicKey = new PublicKey(individualAccount.publicKey)
                    let receiverAccount = await program.account.hydraAccount.fetch(publicKey);
                    individualAccount.balance = receiverAccount.balance.words[0]
                    individualAccount.transactionList = receiverAccount.transactions
                    newCount += receiverAccount.transactions.length
                    newAccount.push(individualAccount)
                }
            } catch(error) {
                alert("Failed to get account details: " + error)
            }
        }
        account.accountList = newAccount
        setSolanaPublicKey(account.solanaAccount.publicKey)
        setSolanaSecretKey(account.solanaAccount.secretKey)
        setTransactionCount(newCount)
        setAccountList(account.accountList)
        setAccount(account)
        setLoading(false)
    }, [])

    async function getProvider(secretKey, newAccount = false) {
        const clientAccount = Keypair.fromSecretKey(newAccount ? secretKey : new Uint8Array(JSON.parse(secretKey)));
        const wallet = new NodeWallet(clientAccount);
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new Provider(
            connection, wallet, opts.preflightCommitment
        )
        return provider;
    }

    async function handleRefresh() {

    }

    return(
        <PullToRefresh onRefresh={handleRefresh}>
            <div style={{minHeight: "120vh", backgroundColor: "#eceff1", zIndex: -1}}>
                {loading ? <Loading /> : null}
                <CustomTopNavigation title={"Home"}/>
                <div style={{fontFamily: "Open-Sans", fontSize: "2rem", margin: "0px 10px 10px 10px", paddingTop: "5vh"}}>Hi, {account.name}</div>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <Box sx={boxStyle}>
                          <div style={{fontFamily: "Open-Sans", fontSize: "3rem"}}>{accountList.length}</div>
                          <div style={{fontFamily: "Open-Sans", fontSize: "2rem"}}>Accounts</div>  
                          <hr style={{background: "white", marginTop: 10, marginBottom: 10}} />
                          <div style={{fontFamily: "Open-Sans", fontSize: "1.5rem", marginBottom: "30px"}}>{transactionCount} Transactions last week</div>  
                          <div style={{display: "flex", marginTop: "10vh", justifyContent: "center", zIndex: -1}}>
                              <Box sx={subBoxStyle}  onClick={()=>{history.push("/account")}}>
                                    <div><AccountBalanceIcon style={{fill: "#1de9b6"}}/></div>
                                    <div style={{color: "#1de9b6", fontFamily: "Open-Sans", fontSize: "1.2rem"}}><strong>Account</strong></div>
                              </Box>
                              <Box sx={subBoxStyle} onClick={()=>{history.push("/transfer")}}>
                                    <div><PaymentIcon style={{fill: "#f44336"}}/></div>
                                    <div style={{color: "#f44336", fontFamily: "Open-Sans", fontSize: "1.2rem"}}><strong>Transfer</strong></div>
                              </Box>
                          </div>
                          <br/>
                          <div style={{display: "flex", justifyContent: "center"}}>
                                <Box sx={subBoxStyle} onClick={()=>{history.push("/payee")}}>
                                    <div><PeopleAltIcon style={{fill: "#ba68c8"}} /></div>
                                    <div style={{color: "#ba68c8", fontFamily: "Open-Sans", fontSize: "1.2rem"}}><strong>Payee</strong></div>
                                </Box>
                                <Box sx={subBoxStyle} onClick={()=>{history.push("/reward")}}>
                                    <div><RedeemIcon style={{fill: "#26a69a"}} /></div>
                                    <div style={{color: "#26a69a", fontFamily: "Open-Sans", fontSize: "1.2rem"}}><strong>Reward</strong></div>
                                </Box>
                          </div>
                    </Box>
                </div>
                
            </div>
        </PullToRefresh>
    )
}