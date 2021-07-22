import { Icon } from '@material-ui/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from '../../styles/Home.module.scss'
import HomeIcon from './svg/home.svg'
import SettingsIcon from './svg/settings.svg'
import TripIcon from './svg/trip.svg'
import TruckIcon from './svg/truck.svg'

export default function SideNavBar() {
    const { t } = useTranslation()
    const route = useRouter();
    const path = route.pathname.split('/')[1];

    return (
        <div className={`w-100 h-100 ${styles['side-navbar']}`}>
            <img className="mt-3 mx-3" src="/TruckApp.png"></img>
            <div className="d-flex flex-column mt-5">
                <Link href="/dashboard" prefetch={true}><div className={"w-100 d-flex px-4 py-3" + " " + styles['side-nav-item'] + (path === "dashboard" ? " " + styles['active'] : "")} >
                    <Icon style={{ color: "white" }} component={HomeIcon}></Icon>
                    {t('Home')}
                </div></Link>
                <Link href="/trip" prefetch={true}><div className={"w-100 d-flex px-4 py-3" + " " + styles['side-nav-item'] + (path === "trip" ? " " + styles['active'] : "")} >
                    <Icon style={{ color: "white" }} component={TripIcon}></Icon>
                    {t('Trip')}
                </div></Link>
                <Link href="/truck" prefetch={true}><div className={"w-100 d-flex px-4 py-3" + " " + styles['side-nav-item'] + (path === "truck" ? " " + styles['active'] : "")} >
                    <Icon style={{ color: "white" }} component={TruckIcon}></Icon>
                    {t('Truck')}
                </div></Link>
                <Link href="/settings" prefetch={true}><div className={"w-100 d-flex px-4 py-3" + " " + styles['side-nav-item'] + (path === "settings" ? " " + styles['active'] : "")} >
                    <Icon style={{ color: "white" }} component={SettingsIcon}></Icon>
                    {t('Settings')}
                </div></Link>
            </div>
        </div>
    )
}
