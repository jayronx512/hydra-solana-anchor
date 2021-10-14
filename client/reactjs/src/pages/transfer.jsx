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
import axios from 'axios';
import { formLabelClasses } from '@mui/material';
const { SystemProgram, Keypair } = web3;

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
        marginTop: 20,
    },
    button: {
        backgroundColor: "#3699FF",
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
        zIndex: 1,
    }
})

const useStyles3 = makeStyles({
    root: {
        width: "100%",
        zIndex: 1,
        marginTop: 20
    }
})

export default function Transfer() {
    const classes = useStyles()
    const classes2 = useStyles2()
    const classes3 = useStyles3()
    const[loading, setLoading] = useState(false)
    const[fromPublicKey, setFromPublicKey] = useState({value: "", error: true})
    const [amount, setAmount] = useState({value: 0, error: true})
    const [remark, setRemark] = useState({value: "", error: false})
    const [referenceNumber, setReferenceNumber] = useState({value: "", error: true})
    const [toPublicKey, setToPublicKey] = useState({value: "", error: true})
    const[account, setAccount] = useState({})
    const[accountList, setAccountList] = useState([])
    const[solanaPublicKey, setSolanaPublicKey] = useState("")
    const[solanaSecretKey, setSolanaSecretKey] = useState("")
    const[toCurrency, setToCurrency] = useState("")
    const[fromCurrency, setFromCurrency] = useState("")

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

    function getCurrency(fromPublicKeyString, toPublicKeyString) {
        let errorMessage = "";
        if (fromPublicKey.value == "") {
            errorMessage += "You must select an account to transfer from!\n"
        }
        if (toPublicKey.value == "") {
            errorMessage += "You must key in the receipient's public key!\n"
        }
        if (solanaSecretKey == "" || solanaSecretKey == null) {
            errorMessage += "No solana account found!\n"
        }
        if (errorMessage != "") {
            alert(errorMessage)
            return
        }
        setLoading(true)
        let newAccount = []
        let promises = []
        promises.push(
        axios.get(`/account/${fromPublicKeyString}`)
            .then(response => {
                newAccount.push(response)
            })
            .catch(error => {
                console.log(error.message)
            })
        )
        promises.push(
        axios.get(`/account/${toPublicKeyString}`)
            .then(response => {
                newAccount.push(response)
            })
            .catch(error => {
                console.log(error.message)
            })
        )

        let temporaryFromCurrency = ""
        let temporaryToCurrency = ""
        console.log(promises)
        Promise.all(promises)
        .then(() => {
            for(let i=0; i<newAccount.length; i++) {
                let temporaryAccount = newAccount[i]
                if (i == 0) {
                    console.log("----Sender----")
                    console.log(temporaryAccount.data.currency)
                    setFromCurrency(temporaryAccount.data.currency)
                    temporaryFromCurrency = temporaryAccount.data.currency
                } else {
                    console.log("----Receiver----")
                    console.log(temporaryAccount.data.currency)
                    setToCurrency(temporaryAccount.data.currency)
                    temporaryToCurrency = temporaryAccount.data.currency
                }
            }
        })
        .catch(error => {
            alert("Failed to retrieve account data: " + error)
        })
        if (temporaryFromCurrency != temporaryToCurrency) {
            var confirm=window.confirm("Cross currency detected! " + temporaryFromCurrency + " -> " + temporaryToCurrency + "\nDaily fx rate will be applied if you wish to continue.")
            if(!confirm){return}
        }
        setLoading(false)
        transfer()
    }

    function transfer() {
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
        if (referenceNumber.value == "") {
            errorMessage += "Reference Number cannot be empty!\n"
        }

        if (errorMessage != "") {
            alert(errorMessage)
            return
        }
        console.log(toCurrency)
        console.log(fromCurrency)
        return
        let secondErrorMessage = ""
        setLoading(true)
        const toAccount = new PublicKey(toPublicKey.value)
        let keys = fromPublicKey.value.split(" ")
        const fromAccount = new PublicKey(keys[0])
        const solAccount = Keypair.fromSecretKey(new Uint8Array(JSON.parse(solanaSecretKey)))
        const senderAccount = Keypair.fromSecretKey(new Uint8Array(JSON.parse(keys[1])))
        if (toCurrency == "" || fromCurrency == "") {
            secondErrorMessage += "Failed to get account's currency!\n"
        }

        if (secondErrorMessage != "") {
            alert(secondErrorMessage)
            setLoading(false)
            return
        }
        const formData = {
            amount: amount.value,
            sender: base64.encode(senderAccount.secretKey),
            sender_currency: fromCurrency,
            receiver: toPublicKey.value,
            receiver_currency: toCurrency,
            remark: remark.value,
            referrence_number: referenceNumber.value,
            payer: base64.encode(solAccount.secretKey),

        }
        console.log(formData)
        axios({
            method: 'post',
            url: '/transfer',
            data: formData,
            config: {headers: {'Content-Type': 'multipart/form-data' }}
        })
        .then((response) => {
            setToCurrency("")
            setFromCurrency("")
            setAmount({value: 0, error: true})
            setToPublicKey({value: "", error: true})
            setFromPublicKey({value: "", error: true})
            setRemark({values: "", error: false})
            setReferenceNumber({value: "", error: true})
            alert("Successfully transfer!")
        })
        .catch((error) => {
            alert("Failed to transfer fund: " + error.message)
        })
        setLoading(false)
        return
        // try {
        //     const solAccount = Keypair.fromSecretKey(new Uint8Array(JSON.parse(solanaSecretKey)));
        //     const payer = Keypair.fromSecretKey(new Uint8Array(JSON.parse(keys[1])));
        //     const provider = await getProvider(solanaSecretKey);
        //     const program = new Program(idl, programID, provider);
        //     const transactionReferenceNumber = transactionReferenceGenerator();
        //     setLoading(false)
        //     await program.rpc.transfer(
        //         new BN(amount.value),
        //         remark.value,
        //         referenceNumber.value, {
        //         accounts: {
        //             fromAccount: fromAccount,
        //             authority: solAccount.publicKey,
        //             toAccount: toAccount
        //         },
        //         signers: [solAccount, payer]
        //     })
        //     setAmount({value: 0, error: true})
        //     setToPublicKey({value: "", error: true})
        //     setFromPublicKey({value: "", error: true})
        //     setRemark({values: "", error: formLabelClasses})
        //     setReferenceNumber({value: "", error: true})
        //     alert("Successfully transfer!")
        // } catch(error) {
        //     alert("Transfer fund error: " + error )
        // }

        // setLoading(false)
    }

    return (
        <div>
            {loading ? <Loading /> : null}
            <CustomTopNavigation title={"Transfer"}/>
            <div style={{margin: "30px 10px 10px 10px", minHeight: "120vh", overflow: "scroll"}}>
                <label style={{fontFamily: "Open-Sans"}}>From Account</label>
                <Select 
                    native
                    value={fromPublicKey.value}
                    label="From Account"
                    onChange={handleFromPublicKeyChange}
                    className={classes.select}
                    error={fromPublicKey.error}
                    style={fromPublicKey.error ? {} : {marginBottom: 10}}
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
                    id="outlined-required"
                    label="To Public Key"
                    variant="outlined"
                    value={toPublicKey.value}
                    className={classes3.root}
                    onChange={handleToPublicKeyChange}
                    error={toPublicKey.error}
                    style={toPublicKey.error ? {} : {marginBottom: 10}}
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
                    className={classes3.root}
                    value={amount.value}
                    onChange={handleAmountChange}
                    error={amount.error}
                    style={amount.error ? {} : {marginBottom: 10}}
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
                    label="Reference Number"
                    variant="outlined"
                    value={referenceNumber.value}
                    className={classes.root}
                    onChange={handleReferenceNumberChange}
                    error={referenceNumber.error}
                    style={referenceNumber.error ? {} : {marginBottom: 10}}
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
                <TextField
                    id="outlined"
                    label="Remark"
                    variant="outlined"
                    value={remark.value}
                    className={classes.root}
                    onChange={handleRemarkChange}
                    error={remark.error}
                    style={remark.error ? {} : {marginBottom: 10}}
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