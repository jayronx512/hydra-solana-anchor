import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {reactLocalStorage} from 'reactjs-localstorage';
import history from '../history';
import CustomTopNavigation from '../components/topnavigation';
import CustomBottomNavigation from '../components/bottomnavigation';
import Loading from '../components/loading';
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from '@material-ui/core/Button'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import Select from '@material-ui/core/Select'
import OutlinedInput from '@material-ui/core/OutlinedInput';

import { NodeWallet } from '@project-serum/anchor/dist/cjs/provider';
import idl from '../idl.json';
import {
    Program, Provider, web3
  } from '@project-serum/anchor';

  
import { Connection, PublicKey } from '@solana/web3.js';
import { isPlainObject } from '@mui/utils/deepmerge';

const { SystemProgram, Keypair } = web3;
const opts = {
    preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);
const network = "https://api.devnet.solana.com";

const useStyles = makeStyles({
    root: {
        width: "100%",
        marginTop: 20
    },
    accord: {
        fontFamily: "Open-Sans",
    },
    button: {
        backgroundColor: "black",
        color: "white",
        fontFamily: "Open-Sans",
        width: "100%",
    },
    root2: {
        backgroundColor: "white",
        color: "black",
        fontFamily: "Open-Sans",
    },
    select: {
        "& $notchedOutline": {
            borderColor: "grey",
        },
        "&$focused $nothchedOutline": {
            borderColor: "red",
        }
    },
    cssOutlinedInput: {
        width: "75vw",
        fontFamily: "Open-Sans",
        '&$cssFocused $notchedOutline': {
            borderColor: "yellow"
        }
    },
    cssFocused: {
        '&$cssFocused $notchedOutline': {
            borderColor: "black"
        }
    },
    notchedOutline: {
        borderWidth: '2px',
        borderColor: 'grey'
    }
})

const useStyles2 = makeStyles({
    root: {
        width: "100%",
        marginTop: 20
    }
})

const typo = {
    fontFamily: "Open-Sans", 
    display: "flex",
    margin: 5,
    fontSize: "1.0rem"
}

const typo2 = {
    fontFamily: "Open-Sans", 
    display: "flex",
    margin: 5,
    fontSize: "1.3rem"
}

const typo3 = {
    fontFamily: "Open-Sans", 
    display: "flex",
    justifyContent: "flex-end",
    margin: 5,
    fontSize: "1.0rem"
}

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
  };

const Accordion = withStyles({
  root: {
    border: "none",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    },
    "&$expanded": {
      margin: "auto"
    }
  },
  expanded: {}
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        backgroundColor: 'black',
        color: "white",
        fontFamily: "Open-Sans",
        // borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
        minHeight: 56,
        },
    },
    content: {
        flexGrow: 0,
        margin: "auto",
        "&$expanded": {
        flexGrow: 0,
        margin: "auto",
        },
        "&:last-child": {
        marginLeft: "auto"
        }
    },
    expanded: {},
    expandIcon:{
        order: 0,
    },
    })(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
root: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
},
}))(MuiAccordionDetails);

// const secretKey = JSON.parse(reactLocalStorage.get("account")).secretKey
// const clientAccount = Keypair.fromSecretKey(new Uint8Array(secretKey));
// console.log(JSON.parse(reactLocalStorage.get("account")).secretKey)

function Dashboard() {
    const classes = useStyles();
    const classes2 = useStyles2();
    const[loading, setLoading] = useState(false)
    const[publicKey, setPublicKey] =  useState(reactLocalStorage.get("publicKey"));
    const[secretKey, setSecretKey] = useState(reactLocalStorage.get("secretKey"))
    const[account, setAccount] = useState({accountList: []})
    const[open, setOpen] = useState(false)
    const[name, setName] = useState({value: "", error: true})
    const[currency, setCurrency] = useState({value: "", error: true})
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    useEffect(async () => {

        setLoading(true)
        let account = JSON.parse(reactLocalStorage.get("account"))
        let newAccount = []
        for (let i=0; i<account.accountList.length; i++) {
            let individualAccount = account.accountList[i]
            individualAccount.balance = await getBalance(individualAccount.publicKey, individualAccount.secretKey)
            newAccount.push(individualAccount)
        }
        account.accountList = newAccount
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

    async function requestAirDrop(publicKey, secretKey) {
        // const provider = await getProvider()
        // const program = new Program(idl, programID, provider)
        setLoading(true)
        const provider = await getProvider(secretKey);
        const program = new Program(idl, programID, provider);
        const connection = program.provider.connection;
        var fromAirdropSignature = await connection.requestAirdrop(
            new PublicKey(publicKey),
            web3.LAMPORTS_PER_SOL,
          );
        // Wait for airdrop confirmation
        await connection.confirmTransaction(fromAirdropSignature);
        resetBalance();
        const timer = setTimeout(() => {
            setLoading(false)
          }, 2000);
        return;
    }

    async function getBalance(publicKey, secretKey) {
        const provider = await getProvider(secretKey);
        const program = new Program(idl, programID, provider);
        const connection = program.provider.connection;
        var balance = await connection.getBalance(
            new PublicKey(publicKey)
        )

        return balance / web3.LAMPORTS_PER_SOL;
    }

    async function resetBalance() {
        let temporaryAccount = account
        let newAccount = []
        for (let i=0; i<temporaryAccount.accountList.length; i++) {
            let individualAccount = temporaryAccount.accountList[i]
            individualAccount.balance = await getBalance(individualAccount.publicKey, individualAccount.secretKey)
            newAccount.push(individualAccount)
        }
        console.log(temporaryAccount)
        temporaryAccount.accountList = newAccount
        setAccount(temporaryAccount)
    }

    const handleNameChange = (e) => {
        if (e.target.value != "") {
            setName({
                ...name,
                error:false,
                value: e.target.value
            })
        } else {
            setName({
                ...name,
                error: true,
                value: ""
            })
        }
    }

    const handleCurrencyChange = (e) => {
        if (e.target.value != "") {
            setCurrency({
                ...currency,
                error:false,
                value: e.target.value
            })
        } else {
            setCurrency({
                ...currency,
                error: true,
                value: ""
            })
        }
    }

    async function createAccount() {
        const clientAccount = Keypair.generate()
        const provider = await getProvider(clientAccount.secretKey, true);

        const publicKey = clientAccount.publicKey
        const program = new Program(idl, programID, provider);
        const connection = program.provider.connection;
        var fromAirdropSignature = await connection.requestAirdrop(
            publicKey,
            web3.LAMPORTS_PER_SOL,
          );
        // Wait for airdrop confirmation
        await connection.confirmTransaction(fromAirdropSignature);
        var balance = await connection.getBalance(
            publicKey
        )
        console.log(balance / web3.LAMPORTS_PER_SOL)
        await program.rpc.createAccount(
            "TEST",
            "TEST",
            "test",
            "test",
            "test",
            "test", {
            accounts: {
                hydraAccount: publicKey,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
                },
                signers: [clientAccount],
            });
        const account = await program.account.hydraAccount.fetch(clientAccount.publicKey);
        console.log(account);
        return
    }

    return (
        <div>
            {loading ? <Loading /> : null}
            <CustomTopNavigation title={account.name}/>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Name"
                            variant="outlined"
                            value={name.value}
                            onChange={handleNameChange}
                            error={name.error}
                            style={name.error ? {} : {marginBottom: 20}}
                            InputLabelProps={{
                                classes: {
                                    root: classes.cssLabel,
                                    focused: classes.cssFocused
                                }
                            }}
                            InputProps={{
                                classes: {
                                    root: classes.cssOutlinedInput,
                                    focused: classes.cssFocused,
                                    notchedOutline: classes.notchedOutline
                                }
                            }}
                        />
                        {name.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
                        <Select 
                                native
                                value={currency.value}
                                label="ID Type"
                                onChange={handleCurrencyChange}
                                className={classes.select}
                                error={currency.error}
                                style={currency.error ? {} : {marginBottom: 20}}
                                input={
                                    <OutlinedInput
                                        name="age"
                                        id="outlined-age-simple"
                                        classes={classes2}
                                    />
                                } 
                                >
                                    <option aria-label="None" value=""/>
                                    <option value="USD">USD</option>

                            </Select>
                            {currency.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
                        <Button variant="outlined" classes={{root: classes.button}} onClick={()=>{createAccount()}}>Create</Button>
                    </div>
                </Box>
            </Modal>
            <div style={{margin: 10}}>
                {account.accountList.length > 0 ?
                    account.accountList.map((item) => {
                        const amount = String(item.balance) + item.currency
                        return (
                            <Accordion className={classes.accord}>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon style={{fill: "white"}} />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                onClick={()=>{
                                }}
                                >
                                <Typography style={{fontFamily: "Open-Sans"}}>{item.name}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography style={typo2}><strong>Balance: {item.balance ? amount : "0.000000"}</strong></Typography>
                                    {item.transactionList.map((item2)=> {
                                        return (
                                            <div style={{display: "flex", flexDirection: "column"}}>
                                                <Typography style={typo}>Signature: {item2.signature}</Typography>
                                                <Typography style={typo3}>Amount: {item2.amount}</Typography>
                                                <hr style={{width: "95%", backgroundColor: "black"}}/>
                                            </div>
                                        )
                                    })}
                                    <Button variant="outlined" classes={{root: classes.button}} onClick={()=> requestAirDrop(item.publicKey, item.secretKey)}>Request Airdrop</Button>
                                </AccordionDetails>
                            </Accordion>
                        )
                    }) : <div style={{fontFamily: "Open-Sans", textAlign: "center"}}>No Accounts</div>}
                <Button style={{marginTop: 20}} variant="outlined" classes={{root: classes.button}} onClick={handleOpen}>Create Account</Button>
            </div>
            <CustomBottomNavigation />
        </div>
    )
}

export default Dashboard;