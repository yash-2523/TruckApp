import { useState, useEffect } from 'react'
import { Button } from "@material-ui/core";
import { IoCaretUpCircle } from "react-icons/io5";
import { VscFilePdf } from "react-icons/vsc";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";
import Link from 'next/link'

import { getReport, getReportPdf } from '../../../../Services/ReportServices'
import styles from '../../../../styles/Reports.module.scss'


const Balance = () => {

    const [date, setDate] = useState(moment())
    const [report, setReport] = useState({})

    useEffect(async () => {
        var reportData = await getReport(date)
        setReport(reportData.report)
        var reportPdfData = await getReportPdf('profit')
        console.log(reportData)
        console.log(reportPdfData)
    }, [date])

    return (
        <>
            <div className={`d-flex justify-content-between align-items-center p-3 mb-4 ${styles.profit}`}>
                <h4 className="mb-3" style={{ fontSize: '1rem', fontWeight: 'bold' }}>Balance Report</h4>
                <DatePicker
                    variant="inline"
                    inputVariant="outlined"
                    openTo="year"
                    views={["year", "month"]}
                    label="Year and Month"
                    value={date}
                    onChange={(d) => { setDate(d) }}
                    autoOk
                />
            </div>


            <div className="mb-4">
                <div className={`d-flex justify-content-between py-1 px-3 mb-2`} style={{ background: '#F7F6FB' }}>
                    <p>No. of Trips</p>
                    <p style={{ fontWeight: 600 }}>{report.total_trips}</p>
                </div>
                <div className={`d-flex justify-content-between py-1 px-3 mb-2`} style={{ background: '#F7F6FB' }}>
                    <p>Total Revenue</p>
                    <p style={{ fontWeight: 600 }}>₹ {report.revenue}</p>
                </div>
                <div className={`d-flex justify-content-between py-1 px-3 mb-2`} style={{ background: '#F7F6FB' }}>
                    <p>Total Expenses</p>
                    <p style={{ fontWeight: 600 }}>₹ {report.payments_made}</p>
                </div>
            </div>

            <div className={`d-flex justify-content-between py-1 px-3 mb-5`} style={{ background: '#312968', color: '#fff' }}>
                <p>Total Profit</p>
                <p style={{ fontWeight: 600 }}>₹ {report.profit}</p>
            </div>

            <div className="d-flex justify-content-end">
                <Button size="large" variant='contained' color='primary' startIcon={<VscFilePdf />} className="me-3">view PDF</Button>
                <Link href='/settings'><Button size="large" variant='outlined'>Cancel</Button></Link>
            </div>

        </>
    );
}

export default Balance;