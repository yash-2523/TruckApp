import { useState, useContext, useEffect } from 'react'
import { Dialog, Button, Input } from '@material-ui/core'
import { DatePicker } from "@material-ui/pickers";
import { toast } from 'react-toastify';
import moment from 'moment'
import { GlobalLoadingContext } from '../../../../../Context/GlobalLoadingContext';

import { S3Upload, SubmitPod } from '../../../../../Services/PodServices'
import uploadSizeValidation from '../../../../uploadSizeValidation';

const PodModal = ({ open, onClose, updateTripDetails, tripId }) => {
    const [podDate, setPodDate] = useState(null)
    const [blob, setBlob] = useState()
    const [inputValid, setInputValid] = useState('')

    useEffect(() => {
        if (blob && podDate)
            setInputValid('')
        else if (podDate == null)
            setInputValid('POD date is not selected')
        else
            setInputValid('Image not selected')
    }, [blob, podDate])

    const { setGlobalLoading } = useContext(GlobalLoadingContext)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setGlobalLoading(true)
        try {
            const uploadRes = await S3Upload(blob)
            const sp = await SubmitPod(tripId, podDate, uploadRes)
            if (sp.success)
                toast.success('POD successfully uploaded')
            else
                toast.error('something went wrong')
        } catch (err) {
            toast.error(err)
        }
        updateTripDetails()
        onClose()
        setGlobalLoading(false)
    }


    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <form onSubmit={(e) => { handleSubmit(e) }} className={`p-4 d-flex flex-column`}>
                <h4 className='mb-4' style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Mark POD Submitted</h4>
                <DatePicker
                    variant="inline"
                    inputVariant="outlined"
                    label="POD Submitted Date"
                    format="DD/MM/yyyy"
                    value={podDate}
                    onChange={(d) => setPodDate(d)}
                    fullWidth
                    autoOk
                    required
                />
                <div className='w-100 d-flex flex-column justify-content-center align-items-center p-4 my-3' style={{ borderRadius: '4px', border: '1px dashed #DFE0E1' }}>
                    <h5 style={{ textAlign: 'center' }}>{blob ? blob.name : 'Upload Image,Doc'}</h5>
                    <label className='upload_image_2'>
                        <input type='file' onChange={(e) => {
                            if(uploadSizeValidation(e)){
                                setBlob(e.target.files[0])
                            }else{
                                setInputValid("File size should be less than 5 MB")
                            }
                            
                        }} required />
                        Select Image
                    </label>

                </div>

                <p className="mb-2" style={{ color: 'red', textAlign: 'center' }}>{inputValid}</p>

                <Button disabled={inputValid ? true : false} className='mt-3 align-self-center' size="large" variant='contained' color='primary' type='submit'>Confirm</Button>
            </form>
        </Dialog >
    );
}

export default PodModal;