
import styles from '../../../styles/Truck.module.scss'


const TruckStats = () => {
    return (
        <div className={`d-flex w-100 justify-content-between align-items-center ${styles.truck_stats}`}>

            <div className={`d-flex flex-column align-items-start ${styles.stat_item}`}>
                <p className={styles.item_title}>My Truck</p>
                <div className={`d-flex align-items-center ${styles.item_data} ${styles.no_of_trucks}`}>
                    <img src="/truck.png" alt="" />
                    <p className='mx-2'>5</p>
                </div>
            </div>

            <div className={`d-flex flex-column align-items-start ${styles.stat_item}`}>
                <p className={styles.item_title}>Status</p>
                <div className={`d-flex align-items-center ${styles.item_data} ${styles.available}`}>
                    <div className={styles.dot}></div>
                    <p className='mx-2'>available : 3</p>
                </div>
            </div>

            <div className={`d-flex flex-column align-items-start ${styles.stat_item}`}>
                <p className={styles.item_title}>Market</p>
                <div className={`d-flex align-items-center ${styles.item_data} ${styles.on_a_trip}`}>
                    <div className={styles.dot}></div>
                    <p className='mx-2'>on a trip : 2</p>
                </div>
            </div>

        </div>
    );
}

export default TruckStats;