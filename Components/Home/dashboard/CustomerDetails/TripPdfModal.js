import { useState, useContext, useEffect } from 'react'
import { Dialog, Button } from '@material-ui/core'
import { DatePicker } from "@material-ui/pickers";
import { useRouter } from 'next/router'
import { toast } from 'react-toastify';
import moment from 'moment'

import { getCustomerTripPdf } from '../../../../Services/CustomerDataServices';
import { GlobalLoadingContext } from '../../../../Context/GlobalLoadingContext';

const TruckPdfModal = ({ open, onClose, customerName }) => {

    const [fromDate, setFromDate] = useState(moment().subtract(2, 'months')) //one less than the months required should be entered here
    const [toDate, setToDate] = useState(moment())
    const [inputValid, setInputValid] = useState('')
    const { setGlobalLoading } = useContext(GlobalLoadingContext)
    const router = useRouter()
    const { id } = router.query

    useEffect(() => {
        if (toDate.diff(fromDate, 'months') > 2)
            setInputValid('date range should be less then or equal to 3 months')
        else
            setInputValid('')
        console.log(customerName)

    }, [fromDate, toDate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setGlobalLoading(true)
        try {
            const tripPdfResponse = await getCustomerTripPdf(fromDate, toDate, id, customerName)
            console.log(tripPdfResponse)
            if (tripPdfResponse && tripPdfResponse.success)
                window.open(tripPdfResponse.link, '_blank')
            else
                toast.error('unable to get the PDF')
        } catch (error) {
            toast.error('unable to get the PDF')
            alert(error)
        }
        setGlobalLoading(false)
        onClose()

    }

    return (
        <Dialog open={open} onClose={onClose} >
            <form onSubmit={(e) => { handleSubmit(e) }} className={`p-3 d-flex flex-column`}>

                <h4 className='mb-4' style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Get Trip Details PDF</h4>

                <div className="flex mb-2">
                    <DatePicker
                        className='me-2'
                        openTo="month"
                        variant="inline"
                        views={["year", "month"]}
                        inputVariant="outlined"
                        label="from Date"
                        value={fromDate}
                        onChange={(d) => setFromDate(d)}
                        autoOk
                    />

                    <DatePicker
                        openTo="month"
                        variant="inline"
                        views={["year", "month"]}
                        inputVariant="outlined"
                        label="To Date"
                        value={toDate}
                        onChange={(d) => setToDate(d)}
                        autoOk
                    />
                </div>

                <p className="mb-2" style={{ color: 'red', textAlign: 'center' }}>{inputValid}</p>
                <Button disabled={inputValid ? true : false} type='submit' color="primary" variant='contained'>Get PDF</Button>
            </form>
        </Dialog>
    );
}

export default TruckPdfModal;
