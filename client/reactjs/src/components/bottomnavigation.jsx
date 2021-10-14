import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

// import DashboardIcon from '@mui/icons-material/Dashboard';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import history from '../history'

const useStyles = makeStyles({
    actionItemStyles: {
        backgroundColor: "#3699FF",
        color: "#0d47a1",
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
    const [value, setValue] = useState(null);

    useEffect(() => {
        if(initState.name == "home") {
            setValue(0)
        } else if (initState.name == "account") {
            setValue(1)
        } else if (initState.name == "transfer") {
            setValue(2)
        } else if (initState.name == "payee") {
            setValue(3)
        }
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
                }} label = "Home"
                    onClick={(e) => {
                        history.push("/home")
                    }}
                    icon={<HomeIcon/>}/>
                <BottomNavigationAction classes= {{
                    root: classes.actionItemStyles,
                    selected: classes.selected,
                    label: classes.label
                }} label = "Account"
                    onClick={(e) => {
                        history.push("/account")
                    }}
                    icon={<AccountBalanceIcon/>}/>
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