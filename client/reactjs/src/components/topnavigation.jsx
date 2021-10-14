import React, { useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Infinity from '../asset/infinity.png'

import SettingsIcon from '@mui/icons-material/Settings';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@material-ui/core/Button'

import history from '../history'
import {reactLocalStorage} from 'reactjs-localstorage';

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

const useStyles = makeStyles({
    button: {
        width: "100%",
        backgroundColor: "#b23b3b",
        color: "white"
    },
    button2: {
        width: "100%",
        backgroundColor: "#4dd0e1",
        color: "white",
        marginBottom: 20
    }
})

export default function CustomTopNavigation(initState) {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const logout = () => {
        reactLocalStorage.remove("account")
        history.push('/')
        handleClose()
    }
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h4 style={{fontFamily: "Open-Sans"}}>Settings</h4>
                    <hr style={{marginBottom: 30}}/>
                    <div>
                        <Button variant="outlined" classes={{root: classes.button2}} onClick={()=>{ history.push('/admin') }}>Admin</Button>
                        <Button variant="outlined" classes={{root: classes.button}} onClick={()=>{ logout() }}>Logout</Button>
                    </div>
                </Box>
            </Modal>
            <div style={{display: "flex", width: "100%", height: "60px"}}>
                <div style={{
                    position: "fixed",
                    width: "100%",
                    top: 0,
                    backgroundColor: "#3699FF",
                    height: "60px",
                    display: "flex",
                    justifyContent: initState.loginPage ? "center" : "space-between"
                }}>
                {initState.loginPage ? null :
                    <div style={{zIndex: 1000, width: "30%"}}>
                        <img src={Infinity} style={{ margin: 5, height: "80%"}} />
                    </div>
                }
                <div style={{
                    display: "flex", 
                    justifyContent: "center", 
                    fontFamily: "Open-Sans", 
                    color: "white", 
                    alignItems:"center", 
                    fontSize: "1.5rem", 
                    width: "40%"}}>{initState.title}</div>
                {initState.loginPage ? null :
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        textAlign: "center",
                        fontSize: "1.5rem",
                        width: "30%",
                        justifyContent: "flex-end",
                    }}>
                        <SettingsIcon style={{
                            marginRight: 10,
                            fill: "white"
                        }} onClick={()=>{handleOpen()}}/>
                    </div>
                }
                </div>
            </div>
        </div>
    )
}