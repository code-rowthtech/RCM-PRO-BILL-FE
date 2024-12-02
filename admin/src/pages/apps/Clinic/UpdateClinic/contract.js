import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getContractAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { Table } from 'react-bootstrap';
import Spinner from '../../../../constants/Spinner';

const Contracttable = ({ activeTab, id }) => {
    const dispatch = useDispatch()
    const store = useSelector((state) => state);
    const contracts = store?.getContractReducer?.data?.response;
    console.log(contracts, 'ccccccccc')
    useEffect(() => {
        if (activeTab === 'contract') {
            const payload = {
                parentClinicId: id
            }
            dispatch(getContractAction({ key: encryptMessage(payload) }))
        }

    }, [activeTab])
    const handleDownload = (fileUrl) => {
        if (fileUrl) {
            window.open(fileUrl, '_blank');
        }
    };
    return (
        <div>
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
                            : contracts?.length === 0 ? (
                                <tr>
                                    <td className="text-center" colSpan={5}>
                                        No data found
                                    </td>
                                </tr>
                            ) :
                                contracts?.map((item, index) => (
                                    <tr key={item?._id}>
                                        <td>{item?.contractName}</td>
                                        <td><span className={`${item?.clinicSignStatus ? 'bg-success' : 'bg-secondary'} text-light px-1 rounded-1`}>{item?.clinicSignStatus ? 'Signed' : 'Pending'}</span></td>
                                        <td><span className={`${item?.adminSignStatus ? 'bg-success' : 'bg-secondary'} text-light px-1 rounded-1`}>{item?.adminSignStatus ? 'Signed' : 'Pending'}</span></td>
                                        <td>
                                            {new Date(item?.sentDate).toLocaleDateString('en-GB')}
                                        </td>
                                        <td>
                                            <i className="fs-4 me-1 mdi mdi-eye cursor-pointer mdi mdi-eye"
                                                onClick={() => handleDownload(item?.certificateFileUrl)}></i>
                                            <i
                                                className="fs-4 mdi mdi-download"
                                                onClick={() => handleDownload(item?.certificateFileUrl)}></i>
                                        </td>
                                    </tr>
                                ))
                    }



                </tbody>
            </Table>
        </div>
    )
}

export default Contracttable