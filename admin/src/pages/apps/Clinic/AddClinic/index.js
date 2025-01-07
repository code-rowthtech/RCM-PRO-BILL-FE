import React, { useEffect, useState } from 'react';
import PageTitle from '../../../../components/PageTitle';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FormInput } from '../../../../components';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getRolesAction } from '../../../../redux/actions';
import { createClinicAction, generateContractAction, getContractAction, getStatesByCountryAction, stateEmptydAction } from '../../../../redux/clinics/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';
import ToastHandle from '../../../../helpers/ToastMessage';
import ClinicForm from './clinicForm';
import BillingForm from './billing';
import Contract from './contract';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SendEmailModal from './emailModal';
import { getMastersDataAction } from '../../../../redux/settings/actions';

const Index = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setError,
        clearErrors
    } = useForm();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [clinicId, setClinicId] = useState(null);
    const [billingId, setBillingId] = useState(null);
    const [contractId, setContractId] = useState(null);
    const [multiple, setMultiple] = useState(0);
    const [activeTab, setActiveTab] = useState('clinic');
    const [allowedTabs, setAllowedTabs] = useState(['clinic'])
    const [resetEmail, setResetEmail] = useState({
        name: null, email: null, phone: null, clinicType: null, flag: 'Clinic'
    });
    const [searchParams] = useSearchParams();
    const parentClincId = searchParams.get('clincid');
    const [isModalRequest, setIsModalRequest] = useState(false); // Track whether the API was triggered by the modal
    const [resetEmailError, setResetEmailError] = useState(null);
    const store = useSelector((state) => state);
    const navigate = useNavigate()
    const decryptedRolesData = store?.getRolesDataReducer?.data?.roles;
    const addClinicResponse = store?.createClinicsReducer?.data?.status;
    // const addClinicData = store?.createClinicsReducer?.data?.data;
    const [addClinicData, setAddClinicData] = useState(null);
    console.log(addClinicData, 'addClinicDataaddClinicData')
    const createResponse = store?.createClinicsReducer?.data?.status;
    const createBillingResponse = store?.createSubscriptionPlanReducer?.data?.status;

    useEffect(() => {
        dispatch(getMastersDataAction({ status: true, category: 'clinic_type', search: '', limit: '' }));
        dispatch(getRolesAction({ limit: '', skip: '', search: 'clinic', status: '' }));
        dispatch(getStatesByCountryAction());
        if (addClinicResponse === 200) {
            reset();
            setAddClinicData(store?.createClinicsReducer?.data?.data)
            dispatch(stateEmptydAction());
        }
    }, [dispatch, addClinicResponse, activeTab])

    const setMailDataNull = () => {
        setResetEmail({
            name: null, email: null, role: null, phone: null, clinicType: null
        })
    }
    const handleActiveTab = (data) => {
        setActiveTab(data)
    }
    const [showMailModal, setShowMailModal] = useState(false);
    const closeMailModal = () => {
        setShowMailModal(false);
        setResetEmailError(null)
    }
    const [buffer, setBuffer] = useState(null);
    const [quillBuffer, setQuillBuffer] = useState(null); // Store Uint8Array buffer

    const user = JSON.parse(sessionStorage.getItem('hyper_user'));
    const billingResponse = store?.createSubscriptionPlanReducer?.data?.result;
    console.log(store?.createSubscriptionPlanReducer, 'store?.createSubscriptionPlanReducer')
    const contracts = store?.getContractReducer?.data?.contract;
    const handleContractGeneration = () => {
        const data = {
            clinicId: addClinicData?.clinicId?._id,
            adminName: user?.name,
            adminEmail: user?.email,
            clinicName: addClinicData?.clinicId?.name,
            clinicEmail: addClinicData?.email
        }
        console.log(data, 'data')
        dispatch(generateContractAction({ key: encryptMessage(data) }));
    }
    useEffect(() => {
        if (store?.generateContractReducer?.data?.status === 200) {
            const payload = {
                clinicId: addClinicData?.clinicId?._id,
                // clinicId: billingId,
            };
            dispatch(getContractAction({ key: encryptMessage(payload) }));
        }
    }, [dispatch, store?.generateContractReducer?.data?.status])
    const requiredFields = [
        { key: "name", message: "Name is required." },
        { key: "email", message: "Email is required." },
        { key: "phone", message: "Phone number is required." },
        { key: "clinicType", message: "Clinic Type is required." },
        // { key: "taxIdOrEIN", message: "Tax ID is required." },
        // { key: "npiNumber", message: "NPI number is required." },
        // { key: "npiNumber", message: "NPI number is required." },
        // { key: "practiceSpecialty", message: "Practice specialty description is required." },
        // { key: "CLIA_Number", message: "Practice specialty description is required." },
        // { key: "medicareNumber", message: "Practice specialty description is required." },
        // { key: "medicaidNumber", message: "Practice specialty description is required." },
        // { key: "taxonomyCodes", message: "Practice specialty description is required." },
        // { key: "primaryAddress", message: "Practice specialty description is required." },
    ];

    // Check for missing fields
    const missingField = requiredFields.find(field => !resetEmail?.[field.key]);
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
                                        onClick={() => {
                                            handleActiveTab('billing')
                                            // if (createResponse === 200) {
                                            // } else {
                                            //     ToastHandle('You must fill in and submit the clinic details to go for billing and supscriptions.', 'danger')
                                            // }
                                        }}
                                        className={`fw-semibold cursor-pointer ${activeTab === 'billing' ? 'border-bottom border-2 border-dark text-black fw-bold' : ''}`}>
                                        Billing and Subscription Information
                                    </span>
                                    <span
                                        onClick={() => {
                                            handleActiveTab('contract')
                                            // if (createBillingResponse === 200) {
                                            // } else {
                                            //     ToastHandle('You must fill in and submit the billing details to go for contract generation.', 'danger')
                                            // }
                                        }}
                                        className={`fw-semibold cursor-pointer ${activeTab === 'contract' ? 'border-bottom border-2 border-dark text-black fw-bold' : ''}`}>
                                        Contract
                                    </span>
                                </Col>
                                <Col className={`${activeTab === 'clinic' ? 'd-flex' : 'd-none'} gap-2 justify-content-end align-items-center`}>
                                    <Button
                                        className={`custom-buttons ${parentClincId ? 'd-none' : ''}`}
                                        disabled={missingField}
                                        onClick={() => {
                                            if (missingField) {
                                                ToastHandle('Please fill in all mandatory fields to proceed.', 'danger');
                                            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail?.email)) {
                                                ToastHandle("Please enter a valid email address.", 'danger');
                                            } else if (!/^\d{9,10}$/.test(resetEmail?.phone)) {
                                                ToastHandle("Please enter a valid phone number with 9 or 10 digits.", 'danger');
                                            }
                                            else {
                                                setResetEmailError(null); // Clear the error when all inputs are valid
                                                setShowMailModal(true);
                                            }
                                        }}
                                    >
                                        Email to Practice
                                    </Button>
                                    <Button className='custom-buttons' onClick={() => navigate(-1)}>Back</Button>
                                    <SendEmailModal setIsModalRequest={setIsModalRequest} show={showMailModal} closeModal={closeMailModal} mailId={resetEmail} setMailDataNull={setMailDataNull} />
                                </Col>
                                <Col className={`${activeTab !== 'clinic' ? 'd-flex' : 'd-none'} gap-2 justify-content-end align-items-center`}>
                                    <Button onClick={handleContractGeneration} className={`custom-buttons ${activeTab === 'contract' ? '' : 'd-none'}`}>
                                        {store?.generateContractReducer?.loading ?
                                            <Spinner className='spinner-border-sm' color='white' />
                                            :
                                            'Send Email'
                                        }
                                    </Button>
                                    <Button className='custom-buttons' onClick={() => navigate(-1)}>Back</Button>
                                </Col>
                            </Row>
                            <Row className='scroll-container pt-2' style={{ height: '93%' }}>
                                <Col>
                                    {activeTab === 'clinic' ?
                                        <ClinicForm
                                            setIsModalRequest={setIsModalRequest} isModalRequest={isModalRequest}
                                            setResetEmail={setResetEmail} resetEmailError={resetEmailError}
                                            resetEmail={resetEmail} showMailModal={showMailModal}
                                            setActiveTab={setActiveTab} activeTab={activeTab}
                                            setClinicId={setClinicId} clinicId={clinicId} setBillingId={setBillingId}
                                            setContractId={setContractId} setMultiple={setMultiple} />
                                        :
                                        activeTab === 'billing' ?
                                            <BillingForm multiple={multiple} setActiveTab={setActiveTab} activeTab={activeTab} clinicId={clinicId} billingId={billingId} />
                                            :
                                            <Contract
                                                setQuillBuffer={setQuillBuffer}
                                                setClinicId={setClinicId} setBillingId={setBillingId}
                                                setActiveTab={setActiveTab} activeTab={activeTab}
                                                clinicId={clinicId} addClinicId={addClinicData?.clinicId?._id} billingId={billingId} contractId={contractId} />
                                    }
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row >
        </>
    );
};

export default Index;
