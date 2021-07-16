import { useState } from 'react'
import { Button, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AddTruckModal from '../AddTruckModal';
import Link from 'next/link'

import styles from '../../../styles/Truck.module.scss'
import { useTranslation } from 'react-i18next';


const Operations = ({ trucks, getTrucks }) => {
    const { t } = useTranslation()
    const [addTruckModalOpen, setAddTruckModalOpen] = useState(false)

    let AddTruckModalClose = () => {
        setAddTruckModalOpen(false);
    }

    return (
        <>
            <div className={`w-100 d-flex justify-content-between flex-wrap ${styles.operations}`}>
                <div className={`${styles.no_of_trucks}`}>
                    {t('my truck')} : {Array.isArray(trucks) ? trucks.length : '0'}
                    <div className={`d-flex justify-content-center align-items-center ${styles.truck_image}`}>
                        <img src="/truck.png" alt="" />
                    </div>
                </div>

                <Button onClick={() => setAddTruckModalOpen(true)} startIcon={<AddIcon />} variant='contained' color="primary">Add New Truck</Button>
            </div>
            <AddTruckModal open={addTruckModalOpen} truckListUpdate={getTrucks} close={AddTruckModalClose} />
        </>

    );
}

export default Operations;