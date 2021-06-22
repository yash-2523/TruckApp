import { Button, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Link from 'next/link'

import styles from '../../../styles/Truck.module.scss'


const Operations = ({ trucks }) => {
    return (
        <div className={`w-100 d-flex justify-content-between ${styles.operations}`}>
            <div className={styles.no_of_trucks}>
                My Truck : {Array.isArray(trucks) ? trucks.length : '0'}
                <div className={`d-flex justify-content-center align-items-center ${styles.truck_image}`}>
                    <img src="/truck.png" alt="" />
                </div>
            </div>

            <Link href='/truck/add'><Button startIcon={<AddIcon />} variant='contained' color="primary">Add New Truck</Button></Link>
        </div>
    );
}

export default Operations;