import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {reactLocalStorage} from 'reactjs-localstorage';
import history from '../history';
import Loading from '../components/loading';
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@material-ui/core/Button'
import CustomTopNavigation from '../components/topnavigation';
import CustomBottomNavigation from '../components/bottomnavigation';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import Select from '@material-ui/core/Select'
import OutlinedInput from '@material-ui/core/OutlinedInput';

import { BN } from 'bn.js'
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
        backgroundColor: "black",
        color: "white",
        fontFamily: "Open-Sans",
        width: "100%",
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

const typo = {
    fontFamily: "Open-Sans", 
    margin: 5,
    fontSize: "1.0rem"
}

const accordionStyle = {
    backgroundColor: "#cfd8dc",
    marginLeft: "10px",
    marginRight: "10px",
    border: "1px solid black",
    padding: "15px"
}

export default function Payee() {
    const classes = useStyles()
    const classes2 = useStyles2()
    const [loading, setLoading] = useState(false)
    const [payeeList, setPayeeList] = useState([])
    const [open, setOpen] = useState(false)
    const [account, setAccount] = useState({})
    const [accountList, setAccountList] = useState([])
    const [fromPublicKey, setFromPublicKey] = useState({value: "", error: true})
    const [amount, setAmount] = useState({value: 0, error: true})
    const [remark, setRemark] = useState({value: "", error: false})
    const [toPublicKey, setToPublicKey] = useState("")
    const[solanaPublicKey, setSolanaPublicKey] = useState("")
    const[solanaSecretKey, setSolanaSecretKey] = useState("")
    const[addPayeeOpen, setAddPayeeOpen] = useState(false)

    //add payee
    const[payeeName, setPayeeName] = useState({value: "", error: true})
    const[payeePublicKey, setPayeePublicKey] = useState({value: "", error: true})
    const[payeeEmail, setPayeeEmail] = useState({value: "", error: true})
    const[payeeNickname, setPayeeNickname] = useState({value: "", error: true})
    const[payeeCurrency, setPayeeCurrency] = useState({value: "", error: true})

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleAddPayeeOpen = () => setAddPayeeOpen(true);
    const handleAddPayeeClose = () => setAddPayeeOpen(false);

    useEffect(() => {
        setLoading(true)
        let account = JSON.parse(reactLocalStorage.get("account"))
        setSolanaPublicKey(account.solanaAccount.publicKey)
        setSolanaSecretKey(account.solanaAccount.secretKey)
        setAccount(account)
        setPayeeList(account.payeeList)
        setAccountList(account.accountList)
        setLoading(false)
    }, [])

    const handleFromPublicKeyChange = (e) => {
        if (e.target.value != "") {
            setFromPublicKey({
                ...fromPublicKey,
                error:false,
                value: e.target.value
            })
        } else {
            setFromPublicKey({
                ...fromPublicKey,
                error: true,
                value: ""
            })
        }
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

    const handleRemarkChange = (e) => {
        setRemark({
            ...remark,
            error:false,
            value: e.target.value
        })
    }

    const handlePayeeNameChange = (e) => {
        if (e.target.value != "") {
            setPayeeName({
                ...payeeName,
                error:false,
                value: e.target.value
            })
        } else {
            setPayeeName({
                ...payeeName,
                error: true,
                value: ""
            })
        }
    }

    const handlePayeePublicKeyChange = (e) => {
        if (e.target.value != "") {
            setPayeePublicKey({
                ...payeePublicKey,
                error:false,
                value: e.target.value
            })
        } else {
            setPayeePublicKey({
                ...payeePublicKey,
                error: true,
                value: ""
            })
        }
    }

    const handlePayeeEmailChange = (e) => {
        if (e.target.value != "") {
            setPayeeEmail({
                ...payeeEmail,
                error:false,
                value: e.target.value
            })
        } else {
            setPayeeEmail({
                ...payeeEmail,
                error: true,
                value: ""
            })
        }
    }

    const handlePayeeNicknameChange = (e) => {
        if (e.target.value != "") {
            setPayeeNickname({
                ...payeeNickname,
                error:false,
                value: e.target.value
            })
        } else {
            setPayeeNickname({
                ...payeeNickname,
                error: true,
                value: ""
            })
        }
    }

    const handlePayeeCurrencyChange = (e) => {
        if (e.target.value != "") {
            setPayeeCurrency({
                ...payeeCurrency,
                error:false,
                value: e.target.value
            })
        } else {
            setPayeeCurrency({
                ...payeeCurrency,
                error: true,
                value: ""
            })
        }
    }

    async function getProvider(secretKey, newAccount = false) {
        const clientAccount = Keypair.fromSecretKey(newAccount ? secretKey : new Uint8Array(JSON.parse(secretKey)));
        const wallet = new NodeWallet(clientAccount);
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new Provider(
            connection, wallet, opts.preflightCommitment
        )
        return provider;
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

    async function transfer() {
        let errorMessage = "";
        if (fromPublicKey.value == "") {
            errorMessage += "You must select an account to transfer from!\n"
        }
        if (amount.value == "" || amount.value < 0) {
            errorMessage += "Invalid amount!\n"
        }
        if (solanaSecretKey == "" || solanaSecretKey == null) {
            errorMessage += "No solana account found!\n"
        }

        if (errorMessage != "") {
            alert(errorMessage)
            return
        }
        setLoading(true)
        const toAccount = new PublicKey(toPublicKey)
        let keys = fromPublicKey.value.split(" ")
        const fromAccount = new PublicKey(keys[0])
        try {
            const provider = await getProvider(solanaSecretKey);
            const program = new Program(idl, programID, provider);

            const transactionReferenceNumber = transactionReferenceGenerator();
            await program.rpc.transfer(
                new BN(amount.value),
                remark.value,
                transactionReferenceNumber, {
                accounts: {
                    fromAccount: fromAccount,
                    toAccount: toAccount
                }
            })
            setRemark({value: "", error: false})
            setAmount({value: 0, error: true})
            setToPublicKey({value: "", error: true})
            setFromPublicKey({value: "", error: true})
            alert("Successfully transfer!")
        } catch(error) {
            alert("Failed to transfer fund to payee: " + error)
        }
        
        handleClose()
        setLoading(false)
    }

    const addPayee = () => {
        let errorMessage = ""
        if (payeeName.value == "") {
            errorMessage += "Payee's name cannot be left empty!\n"
        }
        if (payeeEmail.value == "") {
            errorMessage += "Payee's email cannot be left empty!\n"
        }
        if (payeeNickname.value == "") {
            errorMessage += "Payee's nickname cannot be left empty!\n"
        }
        if (payeePublicKey.value == "") {
            errorMessage += "Payee's public key cannot be left empty!\n"
        }
        if (payeePublicKey.value == "") {
            errorMessage += "Payee's public key cannot be left empty!\n"
        }
        if (payeeCurrency.value == "") {
            errorMessage += "Payee's currency cannot be left empty!\n"
        }

        if (errorMessage != "") {
            alert(errorMessage)
            return
        }
        setLoading(true)
        let temporaryAccount = account
        let temporaryPayeeList = account.payeeList
        let newObj = {
            name: payeeName.value,
            email: payeeEmail.value,
            publicKey: payeePublicKey.value,
            nickname: payeeNickname.value,
            currency: payeeCurrency.value,
            secretKey: ""
        }
        temporaryPayeeList.push(newObj)
        temporaryAccount.payeeList = temporaryPayeeList
        setPayeeList(temporaryPayeeList)
        setAccount(temporaryAccount)
        setPayeeName({value: "", error: true})
        setPayeeNickname({value: "", error: true})
        setPayeeEmail({value: "", error: true})
        setPayeePublicKey({value: "", error: true})
        setPayeeCurrency({value: "", error: true})
        handleAddPayeeClose()
        reactLocalStorage.set("account", JSON.stringify(temporaryAccount))
        setLoading(false)
        return
    }
    

    return (
        <div>
            {loading ? <Loading /> : null}
            <CustomTopNavigation title={"Payee"}/>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div>
                        <label style={{fontFamily: "Open-Sans"}}>From account</label>
                        <Select 
                                native
                                value={fromPublicKey.value}
                                label="From Account"
                                onChange={handleFromPublicKeyChange}
                                className={classes.select}
                                error={fromPublicKey.error}
                                style={fromPublicKey.error ? {} : {marginBottom: 20}}
                                input={
                                    <OutlinedInput
                                        name="age"
                                        id="outlined-age-simple"
                                        classes={classes2}
                                    />
                                } 
                                >
                                    <option aria-label="None" value=""/>
                                    {accountList.map((item)=>{
                                        return(
                                            <option value={item.publicKey + " " + item.secretKey}>{item.name}</option>
                                        )
                                    })}

                            </Select>
                            {fromPublicKey.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
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
                            <TextField
                                id="outlined"
                                label="Remark"
                                variant="outlined"
                                value={remark.value}
                                onChange={handleRemarkChange}
                                error={remark.error}
                                style={remark.error ? {} : {marginBottom: 20}}
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
                        <Button variant="outlined" classes={{root: classes.button}} onClick={()=>{transfer()}}>Transfer</Button>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={addPayeeOpen}
                onClose={handleAddPayeeClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Payee Name"
                            variant="outlined"
                            value={payeeName.value}
                            onChange={handlePayeeNameChange}
                            error={payeeName.error}
                            style={payeeName.error ? {} : {marginBottom: 20}}
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
                        {payeeName.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
                        <TextField
                            id="outlined"
                            label="Payee Email"
                            variant="outlined"
                            value={payeeEmail.value}
                            onChange={handlePayeeEmailChange}
                            error={payeeEmail.error}
                            style={payeeEmail.error ? {} : {marginBottom: 20}}
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
                        {payeeEmail.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
                        <TextField
                            id="outlined"
                            label="Public Key"
                            variant="outlined"
                            value={payeePublicKey.value}
                            onChange={handlePayeePublicKeyChange}
                            error={payeePublicKey.error}
                            style={payeePublicKey.error ? {} : {marginBottom: 20}}
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
                        {payeePublicKey.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
                        <TextField
                            id="outlined"
                            label="Nickname"
                            variant="outlined"
                            value={payeeNickname.value}
                            onChange={handlePayeeNicknameChange}
                            error={payeeNickname.error}
                            style={payeeNickname.error ? {} : {marginBottom: 20}}
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
                        {payeeNickname.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
                        <label style={{fontFamily: "Open-Sans"}}>Currency</label>
                        <Select 
                            native
                            value={payeeCurrency.value}
                            label="Currency"
                            onChange={handlePayeeCurrencyChange}
                            className={classes.select}
                            error={payeeCurrency.error}
                            style={payeeCurrency.error ? {} : {marginBottom: 20}}
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
                        {payeeCurrency.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
                        <Button variant="outlined" classes={{root: classes.button}} onClick={()=>{ addPayee() }}>Add</Button>
                    </div>
                </Box>
            </Modal>
            <div style={{margin: 10}}>
                {payeeList.length > 0 ?
                        payeeList.map((item) => {
                            const amount = String(item.balance) + " " + item.currency
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
                                    <AccordionDetails style={accordionStyle}>
                                        <div style={{display: "flex"}}>
                                            <div style={{marginRight: 20}}>
                                                <Typography style={typo}>Nickname</Typography>
                                                <Typography style={typo}>Email</Typography>
                                                <Typography style={typo}>Currency</Typography>
                                            </div>
                                            <div>
                                                <Typography style={typo}>: {item.nickname}</Typography>
                                                <Typography style={typo}>: {item.email}</Typography>
                                                <Typography style={typo}>: {item.currency}</Typography>
                                            </div>
                                        </div>
                                        <Button variant="outlined" classes={{root: classes.button}} onClick={()=> {setToPublicKey(item.publicKey); handleOpen()}}>Transfer</Button>
                                    </AccordionDetails>
                                </Accordion>
                            )
                        }) : <div style={{fontFamily: "Open-Sans", textAlign: "center"}}>No Accounts</div>}
                <Button variant="outlined" classes={{root: classes.button}} style={{marginTop: "20px"}} onClick={()=>{handleAddPayeeOpen()}}>Add Payee</Button>
            </div>
            <CustomBottomNavigation name="payee"/>
        </div>
    )
}
