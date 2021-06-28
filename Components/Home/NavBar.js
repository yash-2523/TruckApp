import { AppBar, IconButton, Menu, MenuItem, Avatar } from '@material-ui/core';
import {  ExpandMoreOutlined, MenuOutlined, NotificationsOutlined } from '@material-ui/icons';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link'

import { GlobalLoadingContext } from '../../Context/GlobalLoadingContext';
import { currentUser, SignOut } from '../../Services/AuthServices';
import styles from '../../styles/Home.module.scss';
import { useStyles } from './MaterialStyles';

export default function NavBar(props) {

    const classes = useStyles();
    const [user,setUser] = useState("loading");
    const [anchorEl, setAnchorEl] = useState(null);
    const route = useRouter();
    const path = route.pathname.split('/');
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

    const handleRedirectToProfile = () => {
        setAnchorEl(null);
        route.push('/dashboard/profile')
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

        <AppBar className={`${styles['appBar']} px-2 py-1`}>
            <div className={`d-flex px-lg-4 px-md-3 px-1 py-2 justify-content-between align-items-center ${styles['navbar']}`}>
                <div className="d-flex align-items-center">
                    <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={props.handleDrawerToggle}
                    className={classes.menuButton+ " "+styles['collapsable-bars']}
                    >
                        <MenuOutlined style={{color:"rgba(197, 199, 205, 1)"}} />
                    </IconButton>
                    <h3>{path[1]==="dashboard" ? (path[2] === "profile" ? "profile" : (path[2] === "customer" ? JSON.parse(window.sessionStorage.getItem('customer'))?.name || "dashboard" : "dashboard")) : path[1]}</h3>
                </div>
                <div className={`d-flex justify-content-end align-items-center ${styles['navbar-user-icon']}`}>
                    <span className="d-flex align-items-center" onClick={handleClick}>
                        {user.name}
                        <Avatar src={user.profile} className={styles['avatar']} variant="circle">{user && user.name?.split(' ').map(word => word.charAt(0).toUpperCase())}</Avatar>
                        <ExpandMoreOutlined style={{color:"rgba(54, 123, 245, 1)"}} />
                    </span>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        getContentAnchorEl={null}
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                        transformOrigin={{ vertical: "top", horizontal: "center" }}
                    >
                        <MenuItem onClick={handleRedirectToProfile}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </div>
            </div>
        </AppBar>
    )
}
