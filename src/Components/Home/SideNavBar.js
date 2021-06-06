import { Icon } from '@material-ui/core'
import React from 'react'
import './style.scss'
import { ReactComponent as HomeIcon} from './svg/home.svg'
import { ReactComponent as TripIcon} from './svg/trip.svg'
import { ReactComponent as TruckIcon} from './svg/truck.svg'
import { ReactComponent as SettingsIcon} from './svg/settings.svg'
import {  useLocation } from 'react-router'
import { Link } from 'react-router-dom'

export default function SideNavBar() {
    const route = useLocation()
    const path = route.pathname.split('/')[1];

    return (
        <div className="w-100 h-100 side-navbar">
            <img className="mt-3 mx-3" src="assets/TruckApp.png"></img>
            <div className="d-flex flex-column mt-5">
                <Link to="/"><div className={"w-100 d-flex px-4 py-3 side-nav-item" + (path === "" ? " active" : "")} > 
                    <Icon style={{color: "white"}} component={HomeIcon}></Icon>
                    Dashboard
                </div></Link>
                <Link to="/trip"><div className={"w-100 d-flex px-4 py-3 side-nav-item" + (path === "trip" ? " active" : "")} >
                    <Icon style={{color: "white"}} component={TripIcon}></Icon>
                    Trip
                </div></Link>
                <Link to="/truck"><div className={"w-100 d-flex px-4 py-3 side-nav-item" + (path === "truck" ? " active" : "")} >
                    <Icon style={{color: "white"}} component={TruckIcon}></Icon>
                    Truck
                </div></Link>
                <Link to="/settings"><div className={"w-100 d-flex px-4 py-3 side-nav-item" + (path === "settings" ? " active" : "")} >
                    <Icon style={{color: "white"}} component={SettingsIcon}></Icon>
                    Settings
                </div></Link>
            </div>
        </div>
    )
}
