import styles from '../../../../styles/CustomerData.module.scss'
import INRIcon from '../../svg/InrIcon.svg'
import { Button, Avatar } from '@material-ui/core'
import { RefreshOutlined, SentimentDissatisfiedOutlined } from '@material-ui/icons'
import { PulseLoader } from 'react-spinners'
import Link from 'next/link'

export default function CustomerTable(props) {

    const {customerData,token,LoadMoreCustomers, RefreshCustomerData, loading} = props.operations

    return (
        <>

            <div className="text-end mt-4 mx-2">{<Button onClick={RefreshCustomerData} startIcon={<RefreshOutlined />} color="">Refresh</Button>}</div>

            {customerData === "loading" ? <div className="w-100 text-center"><PulseLoader size={15} margin={2} color="#36D7B7" /></div>
                :

                <>
                    {customerData.length === 0 ?

                        <h4 className={`text-center mt-5 ${styles['no-trip-found']}`}>No Data Found <SentimentDissatisfiedOutlined /></h4>
                        
                        :

                        <table className={`w-100 rounded-3 position-relative mt-4 ${styles['table']} mx-auto`} id="table">

                            <thead className="py-2 px-2">
                                <tr>
                                    <th>Customer Name</th>
                                    <th className="text-center">Balance</th>
                                </tr>
                            </thead>

                            <tbody>
                                {customerData.map(customer => 
                                    <Link href={`/dashboard/customer/${customer.from_uid}`} key={customer.from_uid}><tr onClick={() => window.sessionStorage.setItem('balance',customer.balance)}>
                                        <td>
                                            <div className="d-flex justify-content-start align-items-center">
                                                <Avatar className={`${styles['avatar']}`} variant="circle">{customer.from_name.split(' ').map(word => word.charAt(0).toUpperCase())}</Avatar>
                                                {customer.from_name}
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <INRIcon /> {customer.balance}
                                        </td>
                                    </tr></Link>
                                )}
                                
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="7" className="text-center">
                                    {loading ? <PulseLoader size={15} margin={2} color="#36D7B7" /> : (token!=="" && token!=="[]") && <Button onClick={LoadMoreCustomers}>Load More</Button>}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    }
                
                </>
            }

        </>
    )
}
