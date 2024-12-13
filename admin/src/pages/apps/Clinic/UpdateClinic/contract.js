import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getContractAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { Table } from 'react-bootstrap';
import Spinner from '../../../../constants/Spinner';

const Contracttable = ({ activeTab, id }) => {
    const dispatch = useDispatch();
    const [viewList, setViewList] = useState(false);
    const store = useSelector((state) => state);
    const contracts = store?.getContractReducer?.data?.contract;
    console.log(store?.getContractReducer, 'store?.getContractReducerstore?.getContractReducerstore?.getContractReducer')
    useEffect(() => {
        if (activeTab === 'contract') {
            const payload = {
                clinicId: id
            }
            dispatch(getContractAction({ key: encryptMessage(payload) }))
        }

    }, [activeTab]);

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
                        <th>Practice Sign</th>
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
                                // contracts?.map((contracts, index) => (
                                <tr key={contracts?._id}>
                                    <td>{contracts?.contractName}</td>
                                    <td><span className={`${contracts?.clinicSignStatus ? 'bg-success' : 'bg-secondary'} text-light px-1 rounded-1`}>{contracts?.clinicSignStatus ? 'Signed' : 'Pending'}</span></td>
                                    <td><span className={`${contracts?.adminSignStatus ? 'bg-success' : 'bg-secondary'} text-light px-1 rounded-1`}>{contracts?.adminSignStatus ? 'Signed' : 'Pending'}</span></td>
                                    <td>
                                        {new Date(contracts?.sentDate).toLocaleDateString('en-GB')}
                                    </td>
                                    <td>
                                        <i className="fs-4 me-1 uil-external-link-alt"
                                            onClick={() => {
                                                setViewList(!viewList);
                                            }}></i>
                                        <div className={`${viewList ? 'px-1 position-absolute bg-white' : 'd-none'}`}>
                                            <p className='mb-0 border px-1 pe-3 cursor-pointer view-docs' onClick={() => {
                                                handleDownload(contracts?.documentFileUrl);
                                                setViewList(false);
                                            }}>Document</p>
                                            <p className='mb-0 border px-1 pe-3 cursor-pointer view-docs' onClick={() => {
                                                handleDownload(contracts?.certificateFileUrl);
                                                setViewList(false);
                                            }}>Certificate</p>
                                        </div>
                                    </td>
                                </tr>
                        // ))
                    }



                </tbody>
            </Table>
        </div>
    )
}

export default Contracttable