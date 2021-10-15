import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {reactLocalStorage} from 'reactjs-localstorage';
import { colorList } from '../data.js'
import CustomTopNavigation from '../components/topnavigation';
import CustomBottomNavigation from '../components/bottomnavigation';
import Loading from '../components/loading';
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@material-ui/core/Button'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import Select from '@material-ui/core/Select'
import OutlinedInput from '@material-ui/core/OutlinedInput';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PullToRefresh from 'react-simple-pull-to-refresh';


import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import axios from 'axios';

import { NodeWallet } from '@project-serum/anchor/dist/cjs/provider';
import idl from '../idl.json';
import {
    Program, Provider, web3
  } from '@project-serum/anchor';

  
import { Connection, PublicKey } from '@solana/web3.js';

const { Keypair } = web3;
const opts = {
    preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);
const network = "https://api.devnet.solana.com";
const base64 = {
    decode: s => Buffer.from(s, 'base64'),
    encode: b => Buffer.from(b).toString('base64')
  };
const useStyles = makeStyles({
    root: {
        width: "100%",
        marginTop: 20
    },
    accord: {
        fontFamily: "Open-Sans",
        marginBottom: 20
    },
    button: {
        backgroundColor: "#3699FF",
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
        color: "black",
        fontFamily: "Open-Sans",
        borderRadius: "10px",
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

const accordionStyle = {
    backgroundColor: "white",
    marginLeft: "10px",
    marginRight: "10px",
    border: "1px solid black",
    borderTop: "0px",
    padding: "15px",
    marginBottom: "10px"
}

function Dashboard() {
    const classes = useStyles();
    const classes2 = useStyles2();
    const[loading, setLoading] = useState(false)
    const[publicKey, setPublicKey] =  useState("");
    const[secretKey, setSecretKey] = useState("")
    const[account, setAccount] = useState({accountList: [], solanaAccount: {publicKey: "", secretKey: "", balance: 0}})
    const[open, setOpen] = useState(false)
    const[name, setName] = useState({value: "", error: true})
    const[currency, setCurrency] = useState({value: "", error: true})
    const[referenceNumber, setReferenceNumber] = useState({value: "", error: true})
    const[successOpen, setSuccessOpen] = useState(false)
    const[debitOpen, setDebitOpen] = useState(false)
    const[newPublicKey, setNewPublicKey] = useState("")
    const[shortenedPublicKey, setShortenedPublicKey] = useState("")
    const[solanaPublicKey, setSolanaPublicKey] = useState("")
    const[solanaSecretKey, setSolanaSecretKey] = useState("")
    const[shortenedSolanaPublicKey, setShortenedSolanaPublicKey] = useState("")
    const[solanaBalance, setSolanaBalance] = useState(0)
    const [value, setValue] = React.useState(0);
    const[amount, setAmount] = useState({value: 0, error: true})
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSuccessOpen = () => setSuccessOpen(true);
    const handleSuccessClose = () => setSuccessOpen(false);
    const handleDebitOpen = () => setDebitOpen(true)
    const handleDebitClose = () => setDebitOpen(false)

    useEffect(async () => {

        setLoading(true)
        let accountStorage = JSON.parse(reactLocalStorage.get("account"))
        setAccount(accountStorage)
        updateAllAccount(accountStorage)
        setSolanaPublicKey(accountStorage.solanaAccount.publicKey)
        setSolanaSecretKey(accountStorage.solanaAccount.secretKey)
        try {
            if (accountStorage.solanaAccount.publicKey.length > 0) {
                let half = Math.ceil(accountStorage.solanaAccount.publicKey.toString().length / 2)
                let publicKeyString = accountStorage.solanaAccount.publicKey.toString()
                setShortenedSolanaPublicKey(publicKeyString.substr(0, half) + "...")
                accountStorage.solanaAccount.balance = await getBalance(accountStorage.solanaAccount.publicKey, accountStorage.solanaAccount.secretKey)
                setSolanaBalance(accountStorage.solanaAccount.balance)
            }
        } catch(error) {
            alert("Failed to retrieve solana accounts details: " + error)
        }
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
        setLoading(true)
        try {
            const provider = await getProvider(secretKey);
            const program = new Program(idl, programID, provider);
            const connection = program.provider.connection;
            var fromAirdropSignature = await connection.requestAirdrop(
                new PublicKey(publicKey),
                web3.LAMPORTS_PER_SOL,
            );
            // Wait for airdrop confirmation
            await connection.confirmTransaction(fromAirdropSignature);
            // resetBalance();
            const balance = await getBalance(solanaPublicKey, solanaSecretKey)
            setSolanaBalance(balance)
            const timer = setTimeout(() => {
                setLoading(false)
            }, 2000);
        } catch(error) {
            alert("Failed to request airdrop: " + error)
        }
        return;
    }

    async function getBalance(publicKey, secretKey) {
        try {
            const provider = await getProvider(secretKey);
            const program = new Program(idl, programID, provider);
            const connection = program.provider.connection;
            var balance = await connection.getBalance(
                new PublicKey(publicKey)
            )

            return balance / web3.LAMPORTS_PER_SOL;
        } catch(error) {
            alert("Failed to get balance: " + error)
        }
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

    const handleReferenceNumberChange = (e) => {
        if (e.target.value != "") {
            setReferenceNumber({
                ...referenceNumber,
                error:false,
                value: e.target.value
            })
        } else {
            setReferenceNumber({
                ...referenceNumber,
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

    const transactionReferenceGenerator = (length = 10) => {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }

    async function createSolanaAccount() {
        setLoading(true)
        try {
            const solanaAccount = Keypair.generate()
            const provider = await getProvider(solanaAccount.secretKey, true);
            const publicKey = solanaAccount.publicKey
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

            balance = balance / web3.LAMPORTS_PER_SOL;
            let temporaryAccount = JSON.parse(reactLocalStorage.get("account"))
            let solanaAccountObject = {
                publicKey: publicKey.toString(),
                secretKey: JSON.stringify(Array.from(solanaAccount.secretKey)),
                balance: balance 
            }
            temporaryAccount.solanaAccount = solanaAccountObject
            setAccount(temporaryAccount)
            reactLocalStorage.set("account", JSON.stringify(temporaryAccount))
            setSolanaPublicKey(publicKey.toString())
            let half = Math.ceil(publicKey.toString().length / 2)
            let publicKeyString = publicKey.toString()
            setShortenedSolanaPublicKey(publicKeyString.substr(0, half) + "...")
            setSolanaBalance(balance)
            setSolanaSecretKey(JSON.stringify(Array.from(solanaAccount.secretKey)))
        } catch (error) {
            alert("Failed to create hydra account: " + error)
        }
        setLoading(false)
    }

    function createAccount() {
        if (account.solanaAccount.publicKey == "") {
            alert("Please create a solana account first!")
            return
        }
        let errorMessage = ""
        if (currency.value == "") {
            errorMessage += "You must select a currency!"
        }
        if (name.value == "") {
            errorMessage += "Name cannot be empty!"
        }
        if (referenceNumber.value == "") {
            errorMessage += "Reference Number cannot be empty!"
        }

        if (errorMessage != "") {
            alert(errorMessage)
            return
        }
        setLoading(true)
        handleClose()
        const solAccount = Keypair.fromSecretKey(new Uint8Array(JSON.parse(solanaSecretKey)))
        const formData = {
            currency: currency.value,
            name: name.value,
            id_number: account.idNumber,
            id_type: account.idType,
            email: account.email,
            remark: "Account Creation",
            referrence_number: referenceNumber.value,
            payer: base64.encode(solAccount.secretKey)
        }

        axios({
            method: 'post',
            url: '/account',
            data: formData,
            config: {headers: {'Content-Type': 'multipart/form-data' }}
        })
        .then((response) => {
            console.log(response)
            let secretKey = base64.decode(response.data)
            console.log(secretKey)
            let newAccount = Keypair.fromSecretKey(secretKey)
            console.log(newAccount)
            updateAccount(newAccount.publicKey, newAccount.secretKey)
        })
        .catch((error) => {
            console.log(error.message)
        })
        setLoading(false)
        return
    }

    function updateAccount(publicKey, secretKey) {
        setLoading(true)
        axios.get(`/account/${publicKey.toString()}`)
            .then(response => {
                let accountData = response.data
                console.log(accountData)
                let temporaryAccount = account
                let temporaryAccountList = account.accountList
                let newObject = {
                    name: accountData.clientName,
                    currency: accountData.currency,
                    publicKey: publicKey.toString(),
                    secretKey: JSON.stringify(Array.from(secretKey)),
                    balance: accountData.balance,
                    transactionList: accountData.transactions
                }
                temporaryAccountList.push(newObject)
                temporaryAccount.accountList = temporaryAccountList
                setNewPublicKey(publicKey.toString())
                let half = Math.ceil(publicKey.toString().length / 2)
                let publicKeyString = publicKey.toString()
                setShortenedPublicKey(publicKeyString.substr(0, half) + "...")
                reactLocalStorage.set("account", JSON.stringify(temporaryAccount))
                setCurrency({value: "", error: true})
                setName({value: "", error: true})
                setReferenceNumber({value: "", error: true})
                setSuccessOpen(true)
            })
            .catch(error => {
                console.log(error.message)
            })
        setLoading(false)
    }

    function updateAllAccount(accountStorage) {
        setLoading(true)
        let newAccount = []
        let promises = []
        for (let i=0; i<accountStorage.accountList.length; i++) {
            let publicKey = accountStorage.accountList[i].publicKey
            promises.push(
            axios.get(`/account/${publicKey}`)
                .then(response => {
                    newAccount.push(response)
                })
                .catch(error => {
                    console.log(error.message)
                })
            )
        }
        let newAccountList = []
        Promise.all(promises)
        .then(() => {
            for(let i=0; i<newAccount.length; i++) {
                let temporaryAccount = newAccount[i]
                console.log(temporaryAccount)
                let publicKey = accountStorage.accountList[i].publicKey
                let secretKey = accountStorage.accountList[i].secretKey
                let newObject = {
                    name: temporaryAccount.data.clientName,
                    currency: temporaryAccount.data.currency,
                    publicKey: publicKey,
                    secretKey: secretKey,
                    balance: temporaryAccount.data.balance,
                    transactionList: temporaryAccount.data.transactions
                }
                newAccountList.push(newObject)
            }
            if (newAccountList.length > 0) {
                console.log("Account updated!")
                let temporaryAccount = accountStorage
                temporaryAccount.accountList = newAccountList
                setAccount(temporaryAccount)
                reactLocalStorage.set("account", JSON.stringify(temporaryAccount))
            }
        })
        .catch(error => {
            alert("Failed to retrieve account data: " + error)
        })
        setLoading(false)
    }

    function topup(publicKeyString) {
        setLoading(true)
        let accountStorage = JSON.parse(reactLocalStorage.get("account"))
        const solAccount = Keypair.fromSecretKey(new Uint8Array(JSON.parse(solanaSecretKey)))
        let referenceNumber = transactionReferenceGenerator() 
        const formData = {
            public_key: publicKeyString,
            amount: amount.value,
            remark: "Top Up",
            referrence_number: referenceNumber,
            payer: base64.encode(solAccount.secretKey)
        }

        axios({
            method: 'post',
            url: '/topup',
            data: formData,
            config: {headers: {'Content-Type': 'multipart/form-data' }}
        })
        .then((response) => {
            updateAllAccount(accountStorage)
            handleDebitClose()
            alert("Top Up Successfully")
        })
        .catch((error) => {
            console.log(error.message)
        })
        setLoading(false)
    }

    const handleAmountChange = (e) => {
        if (e.target.value != "" || e.target.value == 0) {
            setAmount({
                ...amount,
                error:false,
                value: e.target.value
            })
        } else {
            setAmount({
                ...amount,
                error: true,
                value: ""
            })
        }
    }
    
    async function handleRefresh() {
        //same methods called from useEffect
        setLoading(true)
        let accountStorage = JSON.parse(reactLocalStorage.get("account"))
        console.log(accountStorage)
        setAccount(accountStorage)
        updateAllAccount(accountStorage)
        setSolanaPublicKey(accountStorage.solanaAccount.publicKey)
        setSolanaSecretKey(accountStorage.solanaAccount.secretKey)
        try {
            if (account.solanaAccount.publicKey.length > 0) {
                let half = Math.ceil(account.solanaAccount.publicKey.toString().length / 2)
                let publicKeyString = account.solanaAccount.publicKey.toString()
                setShortenedSolanaPublicKey(publicKeyString.substr(0, half) + "...")
                account.solanaAccount.balance = await getBalance(account.solanaAccount.publicKey, account.solanaAccount.secretKey)
                setSolanaBalance(account.solanaAccount.balance)
            }
        } catch(error) {
            alert("Failed to retrieve solana accounts details: " + error)
        }
        setLoading(false)
    }

    function TabPanel(props) {
        const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
            <Box>
                <Typography>{children}</Typography>
            </Box>
            )}
        </div>
        );
    }
    
    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };
    
    function a11yProps(index) {
        return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    return (
        <PullToRefresh onRefresh={handleRefresh}>
            <div style={{minHeight: "100vh"}}>
                {loading ? <Loading /> : null}
                <CustomTopNavigation title={account.name}/>
                <Modal
                    open={debitOpen}
                    onClose={handleDebitClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <div>
                            <TextField
                                required
                                type="number"
                                id="outlined-required"
                                label="Amount"
                                variant="outlined"
                                value={amount.value}
                                onChange={handleAmountChange}
                                error={amount.error}
                                style={amount.error ? {} : {marginBottom: 20}}
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
                            {amount.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
                            <Button variant="outlined" classes={{root: classes.button}} onClick={()=>{topup(publicKey)}}>Top Up</Button>
                        </div>
                    </Box>
                </Modal>
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
                            <label style={{fontFamily: "Open-Sans"}}>Currency</label>
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
                                        <option value="MYR">MYR</option>
                                        <option value="SGD">SGD</option>

                                </Select>
                                {currency.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Reference Number"
                                    variant="outlined"
                                    value={referenceNumber.value}
                                    onChange={handleReferenceNumberChange}
                                    error={referenceNumber.error}
                                    style={referenceNumber.error ? {} : {marginBottom: 20}}
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
                                {referenceNumber.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
                            <Button variant="outlined" classes={{root: classes.button}} onClick={()=>{createAccount()}}>Create</Button>
                        </div>
                    </Box>
                </Modal>
                <Modal
                    open={successOpen}
                    onClose={handleSuccessOpen}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <div>
                            <h4 c>Account Created Successfully!</h4>
                            <h2 style={{fontFamily: "Open-Sans"}}>Your generated public key, please save it for transaction purposes</h2>
                            <div style={{display: "flex", justifyContent:"space-between", border: "1px solid black", marginBottom: 20, padding: "10px"}}>
                                <div>{shortenedPublicKey}</div>
                                <ContentCopyIcon onClick={()=>{navigator.clipboard.writeText(newPublicKey); alert("Copied to clipboard")}}/>
                            </div>
                            <Button variant="outlined" classes={{root: classes.button}} onClick={()=>{handleSuccessClose()}}>Close</Button>
                        </div>
                    </Box>
                </Modal>
                <div style={{margin: 10, maxHeight: "80vh", overflow: "scroll"}}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider'}} style={{display: "flex", justifyContent: "space-evenly"}}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Account" {...a11yProps(0)} />
                            <Tab label="Solana Account" {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                        <h3 style={{fontFamily: "Open-Sans", textAlign: "center"}}>Accounts</h3>
                            {account.accountList.length > 0 ?
                                account.accountList.map((item) => {
                                    const amount = String(item.balance) + " " + item.currency
                                    return (
                                        <Accordion className={classes.accord}>
                                            <AccordionSummary style={{backgroundColor: colorList[Math.floor(Math.random() * colorList.length)]}}
                                            expandIcon={<ExpandMoreIcon style={{fill: "white"}} />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                            onClick={()=>{
                                            }}
                                            >
                                            <Typography style={{fontFamily: "Open-Sans"}}><strong>{item.name}</strong></Typography>
                                            </AccordionSummary>
                                            <AccordionDetails style={accordionStyle}>
                                                <Typography style={typo2}><strong>Balance: {item.balance ? amount : "0.000000"}</strong></Typography>
                                                {item.transactionList.map((item2)=> {
                                                    return (
                                                        <div style={{display: "flex", flexDirection: "column"}}>
                                                            {/* <Typography style={typo}>Signature: {item2.signature}</Typography>
                                                            <Typography style={typo3}>Amount: {item2.amount}</Typography> */}
                                                            <table width="100%">
                                                                <tr>
                                                                    <td style={{minWidth: "45vw", width: "45vw"}}>Journal Type</td>
                                                                    <td>: {item2.journalType}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{minWidth: "45vw", width: "45vw"}}>Transaction Reference</td>
                                                                    <td>: {item2.referrenceNumber}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{minWidth: "45vw", width: "45vw"}}>Amount</td>
                                                                    <td>: {item2.amount} {item2.currency}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{minWidth: "45vw", width: "45vw"}}>Remark</td>
                                                                    <td>: {item2.remark}</td>
                                                                </tr>
                                                            </table>
                                                            <hr style={{width: "95%", backgroundColor: "white", margin: "5px 0px 5px 0px"}}/>
                                                        </div>
                                                    )
                                                })}
                                                <Button variant="outlined" classes={{root: classes.button}} onClick={()=> {
                                                    setPublicKey(item.publicKey); setSecretKey(item.secretKey); handleDebitOpen()
                                                    }}>Top Up</Button>
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                                }) : <div style={{fontFamily: "Open-Sans", textAlign: "center"}}>No Accounts</div>}
                            <Button style={{marginTop: 20}} variant="outlined" classes={{root: classes.button}} onClick={handleOpen}>Create Account</Button>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <h3 style={{fontFamily: "Open-Sans", textAlign: "center"}}>Solana Account</h3>
                            {account.solanaAccount.publicKey != "" ? 
                                <div>
                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                        <div style={{fontFamily: "Open-Sans"}}>Public Key: {shortenedSolanaPublicKey}</div>
                                        <ContentCopyIcon onClick={()=>{navigator.clipboard.writeText(solanaPublicKey); alert("Copied to clipboard")}}/>
                                    </div>
                                    <div style={{fontFamily: "Open-Sans"}}>Balance: {solanaBalance} SOL</div>
                                </div>
                            : 
                                <h5  style={{fontFamily: "Open-Sans", textAlign: "center"}}>No Solana Account</h5>
                            }
                            {account.solanaAccount.publicKey != "" ? <Button variant="outlined" classes={{root: classes.button}} onClick={()=> {
                                requestAirDrop(solanaPublicKey, solanaSecretKey)
                            }}>Top Up</Button> : <Button variant="outlined" classes={{root: classes.button}} onClick={()=> {createSolanaAccount()}}>Create Solana Account</Button>}
                        </TabPanel>
                    </Box>
                    
                </div>
                <CustomBottomNavigation name="account"/>
            </div>
        </PullToRefresh>
    )
}

export default Dashboard;