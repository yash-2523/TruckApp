import { useState, useEffect, useContext } from 'react'
import { Button } from "@material-ui/core";
import { VscFilePdf } from "react-icons/vsc";
import { DatePicker } from "@material-ui/pickers";
import Link from 'next/link'
import { toast } from 'react-toastify';

import { getReportPdf } from '../../../../Services/ReportServices'
import styles from '../../../../styles/Reports.module.scss'
import { GlobalLoadingContext } from '../../../../Context/GlobalLoadingContext';

const Balance = ({ report, date, setDate }) => {

    const { setGlobalLoading } = useContext(GlobalLoadingContext);

    const handleViewPdf = async () => {
        setGlobalLoading(true);
        try {
            var reportPdfResponse = await getReportPdf('balance')
            setGlobalLoading(false)
            if (reportPdfResponse && reportPdfResponse.success) {
                window.open(reportPdfResponse.link, '_blank')
                setGlobalLoading(false)
            } else {
                setGlobalLoading(false)
                toast.error("Unable to get Bill");
            }
        } catch (err) {
            setGlobalLoading(false)
            toast.error("Unable to get Bill");
        }

    }

    return (
        <>
            <div className={`d-flex justify-content-between align-items-center p-3 mb-4 ${styles.profit}`}>
                <h4 className="mb-3" style={{ fontSize: '1rem', fontWeight: 'bold' }}>Balance Report</h4>
                <DatePicker
                    variant="inline"
                    inputVariant="outlined"
                    openTo="month"
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
                    <p>Total Payment Recieved</p>
                    <p style={{ fontWeight: 600 }}>₹ {report.payments_received}</p>
                </div>
            </div>

            <div className={`d-flex justify-content-between py-1 px-3 mb-5`} style={{ background: '#312968', color: '#fff' }}>
                <p>Total Balance</p>
                <p style={{ fontWeight: 600 }}>₹ {report.balance}</p>
            </div>

            <div className="d-flex justify-content-end">
                <Button onClick={() => handleViewPdf()} size="large" variant='contained' color='primary' startIcon={<VscFilePdf />} className="me-3">view PDF</Button>
                <Link href='/settings'><Button size="large" variant='outlined'>Cancel</Button></Link>
            </div>

        </>
    );
}

export default Balance;