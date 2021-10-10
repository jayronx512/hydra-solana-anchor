import React, { useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import history from '../history';

import TextField from '@material-ui/core/TextField'
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button'
import CustomTopNavigation from '../components/topnavigation';
import Select from '@material-ui/core/Select'
import FormHelperText from '@material-ui/core/FormHelperText'

const useStyles = makeStyles({
    root: {
        backgroundColor: "white",
        color: "black",
        fontFamily: "Open-Sans",
    },
    button: {
        backgroundColor: "black",
        color: "white",
        fontFamily: "Open-Sans",
    },
    select: {
        "& $notchedOutline": {
            borderColor: "grey"
        },
        "&$focused $nothchedOutline": {
            borderColor: "red"
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

export default function SignUp() {
    const classes = useStyles();
    const[username, setUsername] = useState({value: "", error: true});
    const[password, setPassword] = useState({value: "", error: true});
    const[confirmPassword, setConfirmPassword] = useState({value: "", error: true});
    const[name, setName] = useState({value: "", error: true});
    const[idNumber, setIdNumber] = useState({value: "", error: true});
    const[idType, setIdType] = useState({value: "", error: true});
    const[email, setEmail]  = useState({value: "", error: true});

    const handleUsernameChange = (e) => {
        if (e.target.value != "") {
            setUsername({
                ...username,
                error:false,
                value: e.target.value
            })
        } else {
            setUsername({
                ...username,
                error: true,
                value: ""
            })
        }
    }
    const handlePasswordChange = (e) => {
        if (e.target.value != "") {
            setPassword({
                ...password,
                error:false,
                value: e.target.value
            })
        } else {
            setPassword({
                ...password,
                error: true,
                value: ""
            })
        }
    }
    const handleConfirmPasswordChange = (e) => {
        if (e.target.value != "") {
            setConfirmPassword({
                ...confirmPassword,
                error:false,
                value: e.target.value
            })
        } else {
            setConfirmPassword({
                ...confirmPassword,
                error: true,
                value: ""
            })
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

    const handleIdTypeChange = (e) => {
        if (e.target.value != "") {
            setIdType({
                ...idType,
                error:false,
                value: e.target.value
            })
        } else {
            setIdType({
                ...idType,
                error: true,
                value: ""
            })
        }
    }

    const handleIdNumberChange = (e) => {
        if (e.target.value != "") {
            setIdNumber({
                ...idNumber,
                error:false,
                value: e.target.value
            })
        } else {
            setIdNumber({
                ...idNumber,
                error: true,
                value: ""
            })
        }
    }

    const handleEmailChange = (e) => {
        if (e.target.value != "") {
            setEmail({
                ...email,
                error:false,
                value: e.target.value
            })
        } else {
            setEmail({
                ...email,
                error: true,
                value: ""
            })
        }
    }

    const signUp = () => {
        history.push('/dashboard')
    }

    return (
        <div>
            <CustomTopNavigation title={"Sign Up"}/>
            <div style={{margin: 10}}>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly", marginBottom: 60, height: "100%"}}>
                    <div style={{display: "flex", flexDirection: "column", width: "80%", marginTop: 40}}>
                            <TextField
                                required
                                id="outlined-required"
                                label="Username"
                                variant="outlined"
                                value={username.value}
                                onChange={handleUsernameChange}
                                error={username.error}
                                style={username.error ? {} : {marginBottom: 20}}
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
                            {username.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
                            <TextField
                                id="outlined-password-input"
                                label="Password"
                                type="password"
                                variant="outlined"
                                value={password.value}
                                onChange={handlePasswordChange}
                                error={password.error}
                                style={password.error ? {} : {marginBottom: 20}}
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
                            {password.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
                            <TextField
                                id="outlined-password-input"
                                label="Confirm Password"
                                type="password"
                                variant="outlined"
                                value={confirmPassword.value}
                                onChange={handleConfirmPasswordChange}
                                error={confirmPassword.error}
                                style={confirmPassword.error ? {} : {marginBottom: 20}}
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
                            {confirmPassword.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
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
                                value={idType.value}
                                label="ID Type"
                                onChange={handleIdTypeChange}
                                className={classes.select}
                                error={idType.error}
                                style={idType.error ? {} : {marginBottom: 20}}
                                input={
                                    <OutlinedInput
                                        name="age"
                                        id="outlined-age-simple"
                                        classes={classes}
                                    />
                                } 
                                >
                                    <option aria-label="None" value=""/>
                                    <option value="id">National Identification</option>

                            </Select>
                            {idType.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
                            <TextField
                                required
                                id="outlined-required"
                                label="ID Number"
                                variant="outlined"
                                value={idNumber.value}
                                onChange={handleIdNumberChange}
                                error={idNumber.error}
                                style={idNumber.error ? {} : {marginBottom: 20}}
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
                            {idNumber.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
                            <TextField
                                required
                                id="outlined-required"
                                label="Email"
                                variant="outlined"
                                value={email.value}
                                onChange={handleEmailChange}
                                style={{marginBottom:10}}
                                error={email.error}
                                style={email.error ? {} : {marginBottom: 20}}
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
                            {email.error ? <FormHelperText style={{color: "red", marginBottom:10}}>Required</FormHelperText> : null}
                            <Button variant="outlined" classes={{root: classes.button}} onClick={()=> signUp()}>Sign Up</Button>
                        </div>
                </div>
            </div>
        </div>
    )
}