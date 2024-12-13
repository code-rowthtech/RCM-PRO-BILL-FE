import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { generateContractAction, getClinicById, getRolesAction, getStatesByCountryAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Contract from '../AddClinic/contract';
import BillingForm from '../AddClinic/billing';
import ClinicForm from '../AddClinic/clinicForm';
import Clinic from './clinic';
import Billing from './billing';
import Contracttable from './contract';
import { getMastersDataAction } from '../../../../redux/settings/actions';
import Spinner from '../../../../constants/Spinner';

const Updateclinic = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('updateid');
    const [activeTab, setActiveTab] = useState('clinic');
    const [quillBuffer, setQuillBuffer] = useState(null); // Store Uint8Array buffer
    const store = useSelector((state) => state);
    const clinicData = store?.getClinicByIdReducer?.data?.clinic;
    console.log(clinicData, 'from-index==========')
    console.log(store?.getClinicByIdReducer, 'store?.getClinicByIdReducerstore?.getClinicByIdReduceraaaaaa')
    useEffect(() => {
        dispatch(getClinicById({ key: encryptMessage({ id }) }));
        dispatch(getMastersDataAction({ status: true, category: 'clinic_type', search: '', limit: '' }));
        dispatch(getRolesAction({ limit: '', skip: '', search: 'clinic', status: '' }));
        dispatch(getStatesByCountryAction());

    }, [dispatch, activeTab, id])
    useEffect(() => {
        if (store?.updateClinicsReducer?.data?.status === 200) {
            dispatch(getClinicById({ key: encryptMessage({ id }) }));

        }
    }, [store?.updateClinicsReducer?.data?.status])
    const handleActiveTab = (data) => {
        setActiveTab(data)
    }
    const user = JSON.parse(sessionStorage.getItem('hyper_user'));
    const billingDetails = store?.createSubscriptionPlanReducer?.data?.result;
    const handleContractGeneration = () => {
        const data = {
            adminId: user?._id,
            adminEmail: user?.email,
            adminName: user?.name,
            clinicId: clinicData?._id,
            clinicEmail: clinicData?.userId?.email,
            clinicName: clinicData?.userId?.firstName,
            html: quillBuffer
        };
        console.log(data, '================')
        dispatch(generateContractAction({ key: encryptMessage(data) }))
    }

    return (
        <>
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body className='scroll-container' style={{ height: '88vh' }}>
                            <Row className='mb-1' style={{ height: '7%' }}>
                                <Col className='d-flex align-items-center gap-3'>
                                    <span
                                        onClick={() => handleActiveTab('clinic')}
                                        className={`fw-semibold cursor-pointer ${activeTab === 'clinic' ? 'border-bottom border-2 border-dark text-black fw-bold' : ''}`}>
                                        Practice Information
                                    </span>
                                    <span
                                        onClick={() => handleActiveTab('billing')}
                                        className={`fw-semibold cursor-pointer
                                         ${activeTab === 'billing' ? 'border-bottom border-2 border-dark text-black fw-bold' : ''}`}>
                                        Billing and Subscription Information
                                    </span>
                                    <span
                                        onClick={() => handleActiveTab('contract')}
                                        className={`fw-semibold cursor-pointer 
                                        ${activeTab === 'contract' ? 'border-bottom border-2 border-dark text-black fw-bold' : ''}`}>
                                        Contract
                                    </span>
                                </Col>
                                <Col className='d-flex justify-content-end align-items-center'>
                                    <Button onClick={handleContractGeneration} className={`custom-buttons me-2 ${clinicData?.contractId || activeTab !== 'contract' ? 'd-none' : ''}`}>Generate Contract</Button>
                                    <Button onClick={() => navigate(-1)} className='custom-buttons'>Back</Button>
                                </Col>
                            </Row>
                            <Row className='scroll-container w pt-2' style={{ height: '93%' }}>
                                <Col>
                                    {activeTab === 'clinic' ?
                                        store?.getClinicByIdReducer?.loading ?
                                            <div className=' d-flex align-items-center flex-column justify-content-center pt-5 mt-5'>
                                                <Spinner />
                                            </div>
                                            :
                                            <Clinic id={id} />
                                        :
                                        activeTab === 'billing' ?
                                            <Billing setActiveTab={setActiveTab} id={store?.getClinicByIdReducer?.data?.clinic?.userId?._id} activeTab={activeTab} />
                                            :
                                            <Contracttable setQuillBuffer={setQuillBuffer} activeTab={activeTab} id={store?.getClinicByIdReducer?.data?.clinic?._id} />
                                    }
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row >
        </>
    )
}

export default Updateclinic;