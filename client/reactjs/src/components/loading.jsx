import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress'

export default function Loading() {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100vw",
            height: "100vh",
            backgroundColor: "black",
            opacity: 0.5,
            color: "white",
            zIndex: 1100
        }}>
            <CircularProgress style={{width: 80, height: 80}}/>
        </div>
    )
}