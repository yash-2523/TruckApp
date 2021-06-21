import {Button, IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RefreshIcon from '@material-ui/icons/Refresh';
import FilterListIcon from '@material-ui/icons/FilterList';
import SortIcon from '@material-ui/icons/Sort';
import Link from 'next/link'

import styles from '../../../styles/Truck.module.scss'


const Operations = () => {
    return ( <div className={`w-100 d-flex ${styles.operations}`}>
        <Button className={`{${styles.add_button}}`} variant="outlined" color="primary" startIcon={<AddCircleIcon />}>
            <Link href="/truck/add" prefetch={true}>Add A New Truck</Link>
        </Button>
        <div className={`flex-grow-1 d-flex justify-content-between align-items-center ${styles.buttons_container}`}>
            <div className="d-flex">
                <IconButton>
                    <RefreshIcon/>
                </IconButton>
                
            </div>
            <div className="d-flex">
                <Button startIcon={<SortIcon />}>Sort</Button>
                <Button startIcon={<FilterListIcon />}>Filter</Button>
            </div>
        </div>
    </div> );
}

export default Operations;