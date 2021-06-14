import { Button, Fab, Icon, TablePagination } from '@material-ui/core'
import { LocalShippingOutlined, RefreshOutlined } from '@material-ui/icons'
import React, { useContext, useEffect} from 'react'
import './style.scss'
import { ReactComponent as INRIcon} from './svg/Inr.svg'
import useTrip from './useTrip'
import { PulseLoader } from 'react-spinners'
import { TripContext } from '../../../../Context/TripContext'
import * as moment from 'moment'

export default function TripTable() {
    const {tripData, token, loading, LoadMoreTrips, RefreshTrips } = useTrip()
    const { TripPage,TripId } = useContext(TripContext);
    const [tripId,setTripId] = TripId;
    const [tripPage,setTripPage] = TripPage;
    let getDate = (milliseconds) => {
        return moment(new Date(milliseconds)).format('DD-MM-YYYY')
    }

    let getTableScaling = () => {
        let tableRows = document.querySelectorAll("tr");
        let table = document.querySelector(".table");
        if(tableRows !== undefined && table!==null && tableRows.length > 0){
            if(window.innerWidth < tableRows[0].offsetWidth){
                for(let i=0;i<tableRows.length;i++){
                    tableRows[i].style.transform = `scale(${(window.innerWidth / tableRows[i].offsetWidth) - 0.03})`
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
            {tripData.length === 0 ? <div className="w-100 text-center"><PulseLoader size={15} margin={2} color="#36D7B7" /></div> :
            <table className="w-100 rounded-3 position-relative mt-4 table px-lg-2 px-md-2 px-1 mx-auto">
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
                        <tr style={{cursor: "pointer"}} key={data.trip_id} onClick={() => {setTripId(data.trip_id);setTripPage(2)}}> 
                            <td style={{width: "1%"}}><Fab className={data.status.toString()} ><LocalShippingOutlined className={data.status.toString()} /></Fab></td>
                            <td>{getDate(data.trip_start_date)}</td>
                            <td>{data.customer_name}</td>
                            <td>{data.truck_id}</td>
                            <td className="d-flex justify-content-center align-items-center">
                                {/* <div className="d-flex justify-content-center align-items-center m-auto">
                                    <div className="d-flex flex-column justify-content-between align-items-center mx-1">
                                        <span className="dot" style={{backgroundColor: "rgba(45, 188, 83, 1)"}}></span>
                                        <span className="vertical-line my-1"></span>
                                        <span className="dot" style={{backgroundColor: "rgba(231, 104, 50, 1)"}}></span>
                                    </div>
                                    <div className="d-flex flex-column justify-content-between align-items-center"><span>{data.origin_city}</span><span>{data.destination_city}</span></div>
                                </div> */}
                                <div className="d-flex flex-column justify-content-between align-items-start m-auto">
                                    <div className="d-flex align-items-center justify-content-start">
                                        <span className="dot" style={{backgroundColor: "rgba(45, 188, 83, 1)"}}></span>
                                        <span className="mx-1">{data.origin_city}</span>
                                    </div>
                                    <span className="vertical-line"></span>
                                    <div className="d-flex align-items-center justify-content-start">
                                        <span className="dot" style={{backgroundColor: "rgba(231, 104, 50, 1)"}}></span>
                                        <span className="mx-1">{data.destination_city}</span>
                                    </div>
                                </div>
                            </td>
                            <td><span className={data.status}>{data.status}</span></td>
                            <td><Icon className="mx-1"><INRIcon className="mt-1" /></Icon>  {data.to_receive}</td>
                        </tr>
                    )}

                </tbody>
                <tr>
                    <td colSpan="7" className="text-center">
                    {loading ? <PulseLoader size={15} margin={2} color="#36D7B7" /> : (token!=="" && token!=="[]") && <Button onClick={LoadMoreTrips}>Load More</Button>}
                    </td>
                </tr>
            </table> }
        </>
    )
}
