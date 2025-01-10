import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { generateContractAction, getClinicById, getContractAction, getRolesAction, getStatesByCountryAction } from '../../../../redux/actions';
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
    useEffect(() => {
        dispatch(getClinicById({ key: encryptMessage({ id }) }));
        dispatch(getMastersDataAction({ status: true, category: 'clinic_type', search: '', limit: '' }));
        dispatch(getRolesAction({ limit: '', skip: '', search: 'clinic', status: '' }));
        dispatch(getStatesByCountryAction());

    }, [dispatch, activeTab, id]);
    const billingAddResponse = store?.createSubscriptionPlanReducer?.data?.status;

    useEffect(() => {
        if (store?.updateClinicsReducer?.data?.status === 200 || billingAddResponse === 200) {
            dispatch(getClinicById({ key: encryptMessage({ id }) }));

        }
    }, [store?.updateClinicsReducer?.data?.status, billingAddResponse])
    const handleActiveTab = (data) => {
        setActiveTab(data)
    }
    const user = JSON.parse(sessionStorage.getItem('hyper_user'));
    const billingDetails = store?.createSubscriptionPlanReducer?.data?.result;
    const contracts = store?.getContractReducer?.data;
    const handleContractGeneration = () => {
        const data = {
            clinicId: id,
            adminName: user?.name,
            adminEmail: user?.email,
            clinicName: clinicData?.name,
            clinicEmail: clinicData?.userId?.email
        }
        dispatch(generateContractAction({ key: encryptMessage(data) }))
    }
    useEffect(() => {
        if (store?.generateContractReducer?.data?.status === 200) {
            const payload = {
                clinicId: clinicData?._id,
                // clinicId: billingId,
            };
            dispatch(getContractAction({ key: encryptMessage(payload) }));
        }
    }, [dispatch, store?.generateContractReducer?.data?.status])

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
                                    <Button onClick={handleContractGeneration} className={`custom-buttons me-2 ${store?.getContractReducer?.data?.contract || activeTab !== 'contract' ? 'd-none' : ''}`}>
                                        {store?.generateContractReducer?.loading ?
                                            <Spinner color='white' className='spinner-border-sm' />
                                            :
                                            'Send Email'
                                        }
                                    </Button>
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