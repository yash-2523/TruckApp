import { Button, Fab, Icon, TablePagination } from '@material-ui/core'
import { LocalShippingOutlined, RefreshOutlined } from '@material-ui/icons'
import React, { useContext} from 'react'
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

    return (
        <>
            <div className="text-end mt-4 mx-2">{<Button onClick={RefreshTrips} startIcon={<RefreshOutlined />} color="">Refresh</Button>}</div>
            <table className="w-100 rounded-3 position-relative mt-4 table px-lg-2 px-md-2 px-0">
                <thead>
                    <tr>
                        <th></th>
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
                            <td><Fab className={data.status.toString()} ><LocalShippingOutlined className={data.status.toString()} /></Fab></td>
                            <td>{getDate(data.trip_start_date)}</td>
                            <td>{data.customer_name}</td>
                            <td>{data.truck_id}</td>
                            <td><p>{data.origin_city}</p><p>{data.destination_city}</p></td>
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
            </table>
        </>
    )
}
