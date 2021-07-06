import { useState, useEffect } from 'react'
import moment from "moment";
import { PulseLoader } from 'react-spinners'

import Profit from '../../Components/Home/settings/reports/Profit'
import Balance from '../../Components/Home/settings/reports/Balance'
import styles from '../../styles/Reports.module.scss'
import { getReport } from '../../Services/ReportServices'

const Reports = () => {

    const [currentTab, setCurrentTab] = useState('profit')
    const [date, setDate] = useState(moment())
    const [report, setReport] = useState({})


    useEffect(async () => {
        var reportData = await getReport(date)
        setReport(reportData.report)
    }, [date])

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
                    {
                        (Object.keys(report).length == 0) ?
                            <div className="w-100 text-center"><PulseLoader size={15} margin={2} color="#36D7B7" /></div> :
                            (() => {

                                switch (currentTab) {
                                    case 'profit':
                                        return <Profit report={report} date={date} setDate={setDate} />
                                    case 'balance':
                                        return <Balance report={report} date={date} setDate={setDate} />
                                    default:
                                        return (
                                            <div>this route doesnot exists</div>
                                        )
                                }

                            })()

                    }


                </div>
            </div>
        </div>
    );
}

export default Reports;