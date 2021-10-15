import React, { useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {reactLocalStorage} from 'reactjs-localstorage';
import history from '../history';

import CustomTopNavigation from '../components/topnavigation';
import { accountData } from '../data.js'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Infinity from '../asset/infinity2.png'

const useStyles = makeStyles({
    root: {
        backgroundColor: "#3699FF",
        color: "white",
        fontFamily: "Open-Sans",
        width: "100%",
    }
})

export default function Landing() {
    const classes = useStyles();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [account, setAccount] = useState([])

    const login = () => {
        for (let i =0; i<accountData.length ; i++) {
            if (accountData[i].username == username && accountData[i].password == password) {
                reactLocalStorage.set("account", JSON.stringify(accountData[i]))
                setAccount(accountData[i])
                history.push('/home')
                return
            }
        }
        alert("Invalid username or password")
    }

    const signup = () => {
        history.push('/signup')
    }

    return (
        <div>
            <CustomTopNavigation title={"Login"} loginPage={true}/>
            <div style={{margin: 10}}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"}}>
                    <h1 style={{fontFamily: "Open-Sans", marginTop: "10vh", marginBottom: "15vh"}}>Infinitude</h1>
                    <img src={Infinity} style={{height: "10vh", marginBottom: "2vh"}} />
                    <h4 style={{fontFamily: "Open-Sans", marginBottom: "10vh"}}>It's coreless</h4>
                    <div style={{display: "flex", flexDirection: "column", width: "80%"}}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Username"
                            variant="outlined"
                            value={username}
                            onChange={(e)=>{setUsername(e.target.value)}}
                            style={{marginBottom:20}}
                        />
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e)=>{setPassword(e.target.value)}}
                            style={{marginBottom:20}}
                        />
                    </div>
                    <div style={{display: "flex", flexDirection: "row", padding: 5, width: "80%", justifyContent: "space-between"}}>
                        <Button variant="contained" classes={{root: classes.root}} onClick={()=>{login()}}>Login</Button>
                        <div style={{width: "5vw"}}></div>
                        <Button variant="contained" classes={{root: classes.root}} onClick={()=>{signup()}}>Sign Up</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
