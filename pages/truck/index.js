import {useState} from 'react'
import MoreVertIcon from '@material-ui/icons/MoreVert';

import TruckStats from '../../Components/Home/Truck/TruckStats'
import Operations from '../../Components/Home/Truck/Operations'
import { currentUser } from '../../Services/AuthServices'
import styles from '../../styles/Truck.module.scss'



export default function Truck() {

    const [user,setUser] = useState(currentUser.value);

    return (
        <>
        {(user!==null && user!=="loading") && 
            <div className={`w-100 h-100 px-lg-3 px-md-2 px-1 `}>
                <Operations/>
                
                <TruckStats/>

                <table className='w-100 my-3'>
                    <tr className={`w-100 d-flex justify-content-between align-items-center ${styles.row}`}>
                        <td className={`d-flex flex-column`}>
                            <p className={`${styles.col_title}`}>Truck Number</p>
                            <p className={`${styles.col_data}`}>GM-34-BG-12FR</p>
                        </td>

                        <td className={`d-flex flex-column`}>
                            <p className={`${styles.col_title}`}>Truck type</p>
                            <p className={`${styles.col_data}`}>Open Body</p>
                        </td>

                        <td className={`d-flex flex-column`}>
                            <p className={`${styles.col_title}`}>Date</p>
                            <p className={`${styles.col_data}`}>05-11-2021</p>
                        </td>

                        <td className={`d-flex flex-column`}>
                            <p className={`${styles.col_title}`}>Status</p>
                            <p className={`d-flex align-items-center ${styles.col_data} ${styles.status_data}`}><div className={`${styles.dot} mx-1`}></div>available</p>
                        </td>

                        <td className={styles.options}><MoreVertIcon/></td>
                    </tr>

                </table>
            </div>
        }
        </>
    )
}
