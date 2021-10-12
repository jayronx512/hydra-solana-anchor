import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CustomTopNavigation from '../components/topnavigation';
import Loading from '../components/loading';
import {reactLocalStorage} from 'reactjs-localstorage';

import { BN } from 'bn.js'
import { NodeWallet } from '@project-serum/anchor/dist/cjs/provider';
import idl from '../idl.json';
import {
    Program, Provider, web3
  } from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@material-ui/core/Button'


const { SystemProgram, Keypair } = web3;
const opts = {
    preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);
const network = "https://api.devnet.solana.com";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "75vw",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: "80vh",
    overflow: "scroll"
  };

const useStyles = makeStyles({
    root: {
        width: "100%",
        marginTop: 20
    },
    button: {
        backgroundColor: "black",
        color: "white",
        fontFamily: "Open-Sans",
        width: "100%",
    }
})

export default function Admin() {
    const classes = useStyles()
    const[loading, setLoading] = useState(false)
    const[allAccountList, setAllAccountList] = useState([])
    const[solanaPublicKey, setSolanaPublicKey] = useState("")
    const[solanaSecretKey, setSolanaSecretKey] = useState("")
    const[account, setAccount] = useState({})
    const[transactionList, setTransactionList] = useState([])

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(async () => {
        setLoading(true)
        let account = JSON.parse(reactLocalStorage.get("account"))
        setSolanaPublicKey(account.solanaAccount.publicKey)
        setSolanaSecretKey(account.solanaAccount.secretKey)
        setAccount(account)
        if (account.solanaAccount.secretKey != "") {
            try {
                const provider = await getProvider(account.solanaAccount.secretKey);
                const program = new Program(idl, programID, provider);
                let allAccountList = await program.account.hydraAccount.all();
                setAllAccountList(allAccountList)
                console.log(allAccountList)
            } catch(error) {
                alert("Failed to get all accounts: " + error)
            }
        }
       setLoading(false)
    }, [])

    async function getProvider(secretKey) {
        const clientAccount = Keypair.fromSecretKey(new Uint8Array(JSON.parse(secretKey)));
        const wallet = new NodeWallet(clientAccount);
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new Provider(
            connection, wallet, opts.preflightCommitment
        )
        return provider;
    }

    return (
        <div>
            {loading ? <Loading /> : null}
            <CustomTopNavigation title={"Admin"}/>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h4 style={{fontFamily: "Open-Sans"}}>Transactions</h4>
                    <hr/>
                    <div>
                        {transactionList.map((item)=> {
                            return(
                                <div>
                                    <table>
                                        <tr>
                                            <td>Journal Type</td>
                                            <td>: {item.journalType}</td>
                                        </tr>
                                        <tr>
                                            <td>Amount</td>
                                            <td>: {item.amount.words[0]} {item.currency}</td>
                                        </tr>
                                        <tr>
                                            <td>Reference Number</td>
                                            <td>: {item.referrenceNumber}</td>
                                        </tr>
                                        <tr>
                                            <td>Remark</td>
                                            <td>: {item.remark}</td>
                                        </tr>
                                    </table>
                                    <hr />
                                </div>
                            )
                        })}
                        <Button variant="outlined" classes={{root: classes.button}} onClick={()=>{ handleClose() }}>Close</Button>
                    </div>
                </Box>
            </Modal>
            <div style={{margin: 10}}>
                {allAccountList.map((item, index) => {
                    return(
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: "center",
                                '& > :not(style)': {
                                m: 1,
                                width: 280,
                                height: 200,
                                },
                            }}
                            >
                            <Paper elevation={3} style={index % 2 == 0 ? {fontFamily: "Open-Sans", padding: 20} : {fontFamily: "Open-Sans", padding: 20, backgroundColor: "#ffcdd2"}} onClick={()=>{setTransactionList(item.account.transactions); handleOpen()}}>
                                <div style={{display: "flex", justifyContent: "space-around", alignItems: "center"}}>
                                    <div style={{fontSize: "1rem"}}><strong>{item.account.clientName}</strong></div>
                                    <div style={{fontSize: "2rem"}}>{item.account.balance.words[0]} {item.account.currency}</div>
                                </div>
                                <hr/>
                                <br/>
                                <div>
                                    <table>
                                        <tr>
                                            <td>Email</td>
                                            <td>: {item.account.clientEmail}</td>
                                        </tr>
                                        <tr>
                                            <td>ID Type</td>
                                            <td>: {item.account.clientIdentificationType}</td>
                                        </tr>
                                        <tr>
                                            <td>ID No</td>
                                            <td>: {item.account.clientIdentificationNumber}</td>
                                        </tr>
                                    </table>
                                </div>
                            </Paper>
                        </Box>
                    )
                })}
            </div>
        </div>
    )
}