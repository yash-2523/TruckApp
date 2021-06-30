import { useState } from 'react'

import Profit from '../../Components/Home/settings/reports/Profit'
import Balance from '../../Components/Home/settings/reports/Balance'
import styles from '../../styles/Reports.module.scss'

const Reports = () => {

    const [currentTab, setCurrentTab] = useState('profit')

    return (
        <div className="w-100 py-md-1 px-md-3 py-4 px-2">
            <div className="custom_container py-3">
                <nav className='d-flex py-4 px-4'>
                    <div className={`${styles.nav_card} ${currentTab === "profit" ? " " + styles['current'] : ""}`} onClick={() => setCurrentTab('profit')}>
                        <img src="/reports/money.svg" alt="" />
                        <p>Profit and Loss</p>
                    </div>

                    <div className={`${styles.nav_card} ${currentTab === "balance" ? " " + styles['current'] : ""}`} onClick={() => setCurrentTab('balance')}>
                        <img src="/reports/business-and-finance.svg" alt="" />
                        <p>Balance Report</p>
                    </div>
                </nav>

                <hr className={styles.hr} />

                <div className="p-4">
                    {(() => {

                        switch (currentTab) {
                            case 'profit':
                                return <Profit />
                            case 'balance':
                                return <Balance />
                            default:
                                return (
                                    <div>this route doesnot exists</div>
                                )
                        }

                    })()}
                </div>
            </div>
        </div>
    );
}

export default Reports;