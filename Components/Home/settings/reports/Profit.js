import { useState, useEffect, useContext } from 'react'
import { Button } from "@material-ui/core";
import { IoCaretUpCircle } from "react-icons/io5";
import { VscFilePdf } from "react-icons/vsc";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";
import Link from 'next/link'
import { toast } from 'react-toastify';

import { getReport, getReportPdf } from '../../../../Services/ReportServices'
import styles from '../../../../styles/Reports.module.scss'
import { GlobalLoadingContext } from '../../../../Context/GlobalLoadingContext';


const Profit = () => {


    const [date, setDate] = useState(moment())
    const [report, setReport] = useState({})
    const { setGlobalLoading } = useContext(GlobalLoadingContext);

    useEffect(async () => {
        var reportData = await getReport(date)
        setReport(reportData.report)
    }, [date])

    const handleViewPdf = async () => {
        setGlobalLoading(true);
        try {
            var reportPdfResponse = await getReportPdf('profit')
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
                <div className={` d-flex `}>
                    <IoCaretUpCircle className="me-2" style={{ fontSize: '2.4rem', color: '#4CD080' }} />
                    <div>
                        <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>₹ {report.profit}</p>
                        <p style={{ color: '#828282', fontSize: '.8rem' }}>{report.profit < 0 ? 'loss' : 'profit'}</p>
                    </div>
                </div>
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

            <h4 className="mb-3" style={{ fontSize: '1rem', fontWeight: 'bold' }}>Profit or Loss Overview</h4>
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
                <Button onClick={() => handleViewPdf()} size="large" variant='contained' color='primary' startIcon={<VscFilePdf />} className="me-3">view PDF</Button>
                <Link href='/settings'><Button size="large" variant='outlined'>Cancel</Button></Link>
            </div>

        </>
    );
}

export default Profit;