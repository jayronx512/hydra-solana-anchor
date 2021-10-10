import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import history from '../history'

const useStyles = makeStyles({
    actionItemStyles: {
        backgroundColor: "black",
        color: "grey",
        "&$selected": {
            color: "white"
        }
    },
    label: {
        fontFamily: 'Open-Sans',
        fontSize: "0.9rem",
        "&$selected": {
            fontSize: "0.9rem"
        }
    },
    selected: {}
})

export default function CustomBottomNavigation(initState) {
    const classes = useStyles();
    const [value, setValue] = useState(0);

    useEffect(() => {

    }, []);

    return (
        <div style={{
            position: "fixed",
            width: "100%",
            bottom: 0,
            zIndex: 1000
        }}>
            <BottomNavigation value={value} onChange={(e, newValue) => {
                setValue(newValue)
            }}
            showLabels
            classes = {classes.root}>
                <BottomNavigationAction classes= {{
                    root: classes.actionItemStyles,
                    selected: classes.selected,
                    label: classes.label
                }} label = "Dashboard"
                    onClick={(e) => {
                        history.push("/dashboard")
                    }}
                    icon={<DashboardIcon/>}/>
                <BottomNavigationAction classes= {{
                    root: classes.actionItemStyles,
                    selected: classes.selected,
                    label: classes.label
                }} label = "Transfer"
                    onClick={(e) => {
                        history.push("/transfer")
                    }}
                icon={<PaymentIcon/>}/>
                <BottomNavigationAction classes= {{
                    root: classes.actionItemStyles,
                    selected: classes.selected,
                    label: classes.label
                }} label = "Payee"
                    onClick={(e) => {
                        history.push("/payee")
                    }}
                    icon={<PeopleAltIcon/>}/>
                    
            </BottomNavigation>
        </div>
    )
}