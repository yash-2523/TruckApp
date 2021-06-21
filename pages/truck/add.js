import {useState} from 'react'


import { currentUser } from '../../Services/AuthServices'
import styles from '../../styles/Truck.module.scss'


const AddTruck = () => {

    const [user,setUser] = useState(currentUser.value);

    return ( 
        <>
        {(user!==null && user!=="loading") && 
            <div className={`w-100 h-100 px-lg-3 px-md-2 px-1 `}>
                <div className={`${styles.add_truck_form} my-3`}>
                    <h4>addTruck form here</h4>
                </div>
            </div>
        }
        </>
     );
}
 
export default AddTruck;