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
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        setLoading(true)
        let account = JSON.parse(reactLocalStorage.get("account"))
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

        if (errorMessage != "") {
            alert(errorMessage)
            return
        }
        setLoading(true)
        const toAccount = new PublicKey(toPublicKey)
        let keys = fromPublicKey.value.split(" ")
        const fromAccount = new PublicKey(keys[0])
        const provider = await getProvider(keys[1]);
        const program = new Program(idl, programID, provider);

        const transactionReferenceNumber = transactionReferenceGenerator();
        console.log(amount.value)
        console.log(toPublicKey)
        console.log(keys[0])
        console.log(keys[1])
        await program.rpc.transfer(
            new BN(amount.value),
            remark.value,
            transactionReferenceNumber, {
            accounts: {
                fromAccount: fromAccount,
                toAccount: toAccount
            }
        })

        setLoading(false)
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
            <div style={{margin: 10}}>
                {payeeList.length > 0 ?
                        payeeList.map((item) => {
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
            </div>
            <CustomBottomNavigation name="payee"/>
        </div>
    )
}
