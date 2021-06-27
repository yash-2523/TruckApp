import { Fab} from '@material-ui/core'
import { LocalShippingOutlined } from '@material-ui/icons'
import {useEffect} from 'react'
import { PulseLoader } from 'react-spinners'

import styles from '../../../styles/Truck.module.scss'

const TruckTable = ({trucks}) => {

    const cssClass={
        'Mini Truck/LCV': 'mini_truck' ,
        'Open Body Truck': 'open_body' ,
        'Closed Container' : 'closed_container',
        'Trailer' : 'trailers'
    }
    
    return ( 
        <>
        {
            trucks === 'loading' ?
            <div className="w-100 text-center"><PulseLoader size={15} margin={2} color="#36D7B7" /></div>:
            <>
            {
                trucks.length===0?
                <h4 className={`text-center mt-5 `}>No Data Found <SentimentDissatisfiedOutlined /></h4> :
                <table className={`w-100 px-2 my-3 ${styles.table}`}>
                    <thead>
                        <tr>
                            <th ></th>
                            <th>Truck No</th>
                            <th>Truck Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            trucks.map(
                                truck=>
                                <tr className={`w-100 `} key={truck.truck_number}>
                                    <td className={``}>
                                        <div className={`${styles.icon_bg} ${styles[cssClass[truck.container_type]]}`} ><LocalShippingOutlined className={``} /></div>
                                    </td>

                                    <td className={``}>
                                        {truck.truck_number}
                                    </td>

                                    <td className={`${styles[cssClass[truck.container_type]+'_text']}`}>
                                        {truck.container_type}
                                    </td>

                                </tr>
                            )
                        }
                        
                    </tbody>

                </table>
            }
            </>
        }
        </>
        );
}
 
export default TruckTable;