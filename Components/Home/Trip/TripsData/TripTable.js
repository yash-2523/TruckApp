import { Button, Fab, Icon } from '@material-ui/core'
import { LocalShippingOutlined, RefreshOutlined, SentimentDissatisfiedOutlined } from '@material-ui/icons'
import * as moment from 'moment'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { PulseLoader } from 'react-spinners'
import styles from '../../../../styles/TripsData.module.scss'
import INRIcon from '../../svg/InrIcon.svg'

export default function TripTable(props) {
    const {tripData, token, loading, LoadMoreTrips, RefreshTrips } = props.Operations
    let getDate = (milliseconds) => {
        return moment(new Date(milliseconds * 1000)).format('DD-MM-YYYY')
    }

    let getTableScaling = () => {
        let tableRows = document.querySelectorAll("tr");
        let table = document.querySelector("#table");
        let mainContainer = document.querySelector("#main-container")
        if(tableRows !== undefined && table!==null && tableRows.length > 0){
            if(mainContainer.offsetWidth < tableRows[0].offsetWidth){
                for(let i=0;i<tableRows.length;i++){
                    tableRows[i].style.transform = `scale(${(mainContainer.offsetWidth / tableRows[i].offsetWidth) - 0.03})`
                    tableRows[i].style.transformOrigin = "0% 0%";
                    table.style.borderSpacing = "0rem 0rem"
                }
            }
            else{
                for(let i=0;i<tableRows.length;i++){
                    tableRows[i].style.transform = `scale(1)`
                    tableRows[i].style.transformOrigin = "0% 0%"
                    table.style.borderSpacing = "0rem 0.8rem"
                }
            }
            
        }
        
    }

    useEffect(() => {
        getTableScaling();

        window.addEventListener('resize',getTableScaling)

        return () => {
            window.removeEventListener('resize',getTableScaling)
        }
    },[tripData])

    return (
        <>
            <div className="text-end mt-4 mx-2">{<Button onClick={RefreshTrips} startIcon={<RefreshOutlined />} color="">Refresh</Button>}</div>

            {tripData === "loading" ? <div className="w-100 text-center"><PulseLoader size={15} margin={2} color="#36D7B7" /></div> 
            :
            <>
            {tripData.length === 0 ? 
            <h4 className={`text-center mt-5 no-data-found`}>No Data Found <SentimentDissatisfiedOutlined /></h4> 
                : 
            <table className={`w-100 rounded-3 position-relative mt-4 ${styles['table']} px-lg-2 px-md-2 px-1 mx-auto`} id="table">
                <thead>
                    <tr>
                        <th style={{width: "1%"}}></th>
                        <th>Start Date</th>
                        <th>Party Name</th>
                        <th>Truck No</th>
                        <th>Route</th>
                        <th>Status</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {tripData.map(data =>
                        <Link href={`/trip/${data.trip_id}`} key={data.trip_id}>
                            <tr style={{cursor: "pointer"}} > 
                                <td style={{width: "1%"}}><Fab className={styles[data.status.toString()]} ><LocalShippingOutlined className={styles[data.status.toString()]} /></Fab></td>
                                <td>{getDate(data.trip_start_date)}</td>
                                <td>{data.customer_name}</td>
                                <td>{data.truck_id}</td>
                                <td className="d-flex justify-content-center align-items-center">
                                    <div className="d-flex flex-column justify-content-between align-items-start m-auto">
                                        <div className="d-flex align-items-center justify-content-start">
                                            <span className={styles['dot']} style={{backgroundColor: "rgba(45, 188, 83, 1)"}}></span>
                                            <span className="mx-1">{data.origin_city}</span>
                                        </div>
                                        <span className={styles["vertical-line"]}></span>
                                        <div className="d-flex align-items-center justify-content-start">
                                            <span className={styles["dot"]} style={{backgroundColor: "rgba(231, 104, 50, 1)"}}></span>
                                            <span className="mx-1">{data.destination_city}</span>
                                        </div>
                                    </div>
                                </td>
                                <td><span className={styles[data.status]} style={{background: "transparent"}}>{data.status.replace('_','-')}</span></td>
                                <td><INRIcon className="inr-icon" /> {data.to_receive}</td>
                            </tr>
                        </Link>
                    )}

                </tbody>
                <tr>
                    <td colSpan="7" className="text-center">
                    {loading ? <PulseLoader size={15} margin={2} color="#36D7B7" /> : (token!=="" && token!=="[]") && <Button onClick={LoadMoreTrips}>Load More</Button>}
                    </td>
                </tr>
            </table>}
            </> }
        </>
    )
}
