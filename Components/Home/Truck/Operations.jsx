import { Button, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import FilterListIcon from '@material-ui/icons/FilterList';
import SortIcon from '@material-ui/icons/Sort';
import Link from 'next/link'

import styles from '../../../styles/Truck.module.scss'


const Operations = ({ trucks }) => {
    return (
        <>

            <div className={`w-100 d-flex justify-content-between align-items-center ${styles.operations}`}>
                <div className={styles.no_of_trucks}>
                    My Truck : {Array.isArray(trucks) ? trucks.length : '0'}
                    <div className={`d-flex justify-content-center align-items-center ${styles.truck_image}`}>
                        <img src="/truck.png" alt="" />
                    </div>
                </div>
                <div className={`d-flex justify-content-end`}>
                    <TextField className={`mx-4`} label="Search Trucks" variant="standard" />
                    <Link href='/truck/add'><Button startIcon={<AddIcon />} variant='contained' color="primary">Add New Truck</Button></Link>
                </div>

            </div>
        </>);
}

export default Operations;