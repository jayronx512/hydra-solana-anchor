import React, { useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Hydra from '../asset/Hydra_logo.png'

import SettingsIcon from '@mui/icons-material/Settings';

export default function CustomTopNavigation(initState) {
    return (
        <div style={{display: "flex", width: "100%", height: "60px"}}>
            <div style={{
                position: "fixed",
                width: "100%",
                top: 0,
                backgroundColor: "black",
                height: "60px",
                zIndex: -1000,
                display: "flex",
                justifyContent: initState.loginPage ? "center" : "space-between"
            }}>
            {initState.loginPage ? null :
                <div style={{zIndex: 1000, width: "30%"}}>
                    <img src={Hydra} style={{ margin: 5, height: "80%"}} />
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
                    justifyContent: "flex-end"
                }}>
                    <SettingsIcon style={{
                        marginRight: 10,
                        fill: "white"
                    }} />
                </div>
            }
            </div>
        </div>
    )
}