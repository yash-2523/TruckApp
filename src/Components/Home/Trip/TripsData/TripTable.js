import { Fab, Icon } from '@material-ui/core'
import { LocalShippingOutlined } from '@material-ui/icons'
import React from 'react'
import './style.scss'
import { ReactComponent as INRIcon} from './svg/Inr.svg'
import useTrip from './useTrip'

export default function TripTable() {
    const {tripData} = useTrip()
    return (
        <table className="w-100 rounded-3 table mt-4 px-2">
            <thead>
                <tr>
                    <th></th>
                    <th>Started Date</th>
                    <th>Party Name</th>
                    <th>Truck No</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Balance</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><Fab className="started" ><LocalShippingOutlined className="started" /></Fab></td>
                    <td>05-20-2021</td>
                    <td>Rajkappor</td>
                    <td>GM-34-BG-657H</td>
                    <td><p>Gurugram</p><p>Noida</p></td>
                    <td><li className="started">Started</li></td>
                    <td><Icon className="mx-1"><INRIcon className="mt-1" /></Icon>  7,250</td>
                </tr>
                <tr>
                    <td><Fab className="completed" ><LocalShippingOutlined className="completed" /></Fab></td>
                    <td>05-20-2021</td>
                    <td>Rajkappor</td>
                    <td>GM-34-BG-657H</td>
                    <td><p>Gurugram</p><p>Noida</p></td>
                    <td><li className="completed">Completed</li></td>
                    <td><Icon className="mx-1"><INRIcon className="mt-1" /></Icon>  7,250</td>
                </tr>
            </tbody>
        </table>
    )
}
