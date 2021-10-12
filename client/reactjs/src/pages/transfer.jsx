import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {reactLocalStorage} from 'reactjs-localstorage';
import Loading from '../components/loading';
import CustomTopNavigation from '../components/topnavigation';
import CustomBottomNavigation from '../components/bottomnavigation';
import Select from '@material-ui/core/Select'
import OutlinedInput from '@material-ui/core/OutlinedInput';
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'

import { BN } from 'bn.js'
import { NodeWallet } from '@project-serum/anchor/dist/cjs/provider';
import idl from '../idl.json';
import {
    Program, Provider, web3
  } from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js';
import { formLabelClasses } from '@mui/material';
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

export default function Transfer() {
    const classes = useStyles()
    const classes2 = useStyles2()
    const[loading, setLoading] = useState(false)
    const[fromPublicKey, setFromPublicKey] = useState({value: "", error: true})
    const [amount, setAmount] = useState({value: 0, error: true})
    const [remark, setRemark] = useState({value: "", error: false})
    const [toPublicKey, setToPublicKey] = useState({value: "", error: true})
    const[account, setAccount] = useState({})
    const[accountList, setAccountList] = useState([])
    const[solanaPublicKey, setSolanaPublicKey] = useState("")
    const[solanaSecretKey, setSolanaSecretKey] = useState("")

    useEffect(()=> {
        let account = JSON.parse(reactLocalStorage.get("account"))
        setSolanaPublicKey(account.solanaAccount.publicKey)
        setSolanaSecretKey(account.solanaAccount.secretKey)
        setAccount(account)
        setAccountList(account.accountList)
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
        console.log(fromPublicKey)
    }
    const handleToPublicKeyChange = (e) => {
        if (e.target.value != "") {
            setToPublicKey({
                ...toPublicKey,
                error:false,
                value: e.target.value
            })
        } else {
            setToPublicKey({
                ...toPublicKey,
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
        if (toPublicKey.value == "") {
            errorMessage += "You must key in the receipient's public key!\n"
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
        const toAccount = new PublicKey(toPublicKey.value)
        const fromAccount = new PublicKey(fromPublicKey.value)
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
            setAmount({value: 0, error: true})
            setToPublicKey({value: "", error: true})
            setFromPublicKey({value: "", error: true})
            setRemark({values: "", error: formLabelClasses})
            alert("Successfully transfer!")
        } catch(error) {
            alert("Transfer fund error: " + error )
        }

        setLoading(false)
    }

    return (
        <div>
            {loading ? <Loading /> : null}
            <CustomTopNavigation title={"Transfer"}/>
            <div style={{margin: "50px 10px 10px 10px"}}>
            <label style={{fontFamily: "Open-Sans"}}>From Account</label>
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
                                <option value={item.publicKey}>{item.name}</option>
                            )
                        })}

                </Select>
                {fromPublicKey.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
                <TextField
                    required
                    id="outlined-required"
                    label="To Public Key"
                    variant="outlined"
                    value={toPublicKey.value}
                    className={classes.root}
                    onChange={handleToPublicKeyChange}
                    error={toPublicKey.error}
                    style={toPublicKey.error ? {} : {marginBottom: 20}}
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
                {toPublicKey.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
                <TextField
                    required
                    type="number"
                    id="outlined-required"
                    label="Amount"
                    variant="outlined"
                    className={classes.root}
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
                    className={classes.root}
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
            <CustomBottomNavigation name="transfer"/>
        </div>
    )
}