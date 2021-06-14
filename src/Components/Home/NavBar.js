import { AppBar, IconButton, Menu, MenuItem } from '@material-ui/core'
import { ExpandMoreOutlined, MenuOutlined, NotificationsOutlined } from '@material-ui/icons';
import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { useLocation } from 'react-router';
import { GlobalLoadingContext } from '../../Context/GlobalLoadingContext';
import { useStyles } from './MaterialStyles';
import {currentUser, SignOut} from '../../Services/AuthServices';
import { toast } from 'react-toastify'
import './style.scss'

export default function NavBar(props) {

    const classes = useStyles();
    const [user,setUser] = useState("loading");
    const [anchorEl, setAnchorEl] = useState(null);
    const route = useLocation();
    const path = route.pathname.split('/')[1];
    const { setGlobalLoading } = useContext(GlobalLoadingContext)


    useEffect(() => {
        let AuthObservable = currentUser.subscribe((data) => {
          setUser(data);
        })
        return () => {
          AuthObservable.unsubscribe()
        }
    })

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    let handleLogout = async () => {
        setGlobalLoading(true);
        let signOutResponse = await SignOut();
        setGlobalLoading(false);

        if(!signOutResponse){
            toast.error("Unable to Logout")
        }
    }
    

    return (

        <AppBar className={"appBar px-2 py-1"}>
            <div className="d-flex px-lg-4 px-md-3 px-1 justify-content-between align-items-center navbar">
                <div className="d-flex align-items-center">
                    <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={props.handleDrawerToggle}
                    className={classes.menuButton+ " collapsable-bars"}
                    >
                        <MenuOutlined style={{color:"rgba(197, 199, 205, 1)"}} />
                    </IconButton>
                    <h3>{path==="" ? "dashboard" : path}</h3>
                </div>
                <div className="d-flex align-items-center navbar-user-icon">
                    <IconButton><NotificationsOutlined style={{color:"rgba(197, 199, 205, 1)"}} /></IconButton>
                    <span className="d-flex align-items-center" onClick={handleClick}>
                        {user.name}
                        <img className="rounded-circle" src="assets/TruckApp.png"></img>
                        <ExpandMoreOutlined style={{color:"rgba(54, 123, 245, 1)"}} />
                    </span>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        style={{marginTop: "30px"}}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </div>
            </div>
        </AppBar>

        // <div className="w-100 flex-grow-1 flex-stretch d-flex px-2 py-2 justify-content-between align-items-center navbar">
            
          
        // </div>
    )
}
