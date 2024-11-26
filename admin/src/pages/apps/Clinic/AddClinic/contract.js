import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getContractAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';


const Contract = ({ billingId, activeTab, contractId, setBillingId, setClinicId }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setError,
        clearErrors
    } = useForm();
    const dispatch = useDispatch()
    const store = useSelector((state) => state);
    const contracts = store?.getContractReducer?.data?.response;

    useEffect(() => {
        if (activeTab === 'contract') {
            const payload = {
                parentClinicId: billingId
            }
            dispatch(getContractAction({ key: encryptMessage(payload) }))
        }
        if (store?.getContractReducer?.data?.status === 200) {
            setBillingId(null);
            setClinicId(null)
        }
    }, [activeTab, store?.getContractReducer?.data?.status])
    return (
        <>
            <Table responsive className="table-centered border border-muted table-nowrap mb-0">
                <thead>
                    <tr>
                        <th>Contract Name</th>
                        <th>Clinic Sign</th>
                        <th>Probill Sign</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        store?.getContractReducer?.loading ?
                            <tr>
                                <td className='text-center' colSpan={5}>
                                    <Spinner />
                                </td>
                            </tr>
                            :
                            contracts?.map((item, index) => (
                                <tr key={item?._id}>
                                    <td>{item?.contractName}</td>
                                    <td><span className={`${item?.clinicSignStatus ? 'bg-success' : 'bg-secondary'} text-light px-1 rounded-1`}>{item?.clinicSignStatus ? 'Signed' : 'Pending'}</span></td>
                                    <td><span className={`${item?.adminSignStatus ? 'bg-success' : 'bg-secondary'} text-light px-1 rounded-1`}>{item?.adminSignStatus ? 'Signed' : 'Pending'}</span></td>
                                    <td>8:00 AM 26th Sep, 2024</td>
                                    <td>
                                        <i className="fs-5 mdi mdi-eye"></i>
                                        <i className="fs-5 mdi mdi-download"></i>
                                    </td>
                                </tr>
                            ))
                    }



                </tbody>
            </Table>
        </>
    );
}

export default Contract