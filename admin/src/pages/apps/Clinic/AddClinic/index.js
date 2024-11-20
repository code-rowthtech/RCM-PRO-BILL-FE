import React, { useEffect, useState } from 'react';
import PageTitle from '../../../../components/PageTitle';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FormInput } from '../../../../components';  // Assuming this is a custom form input component
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getRolesAction } from '../../../../redux/actions';
import { createClinicAction, getStatesByCountryAction, stateEmptydAction } from '../../../../redux/clinics/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';
import ToastHandle from '../../../../helpers/ToastMessage';
import ClinicForm from './clinicForm';
import BillingForm from './billing';
import Contract from './contract';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
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
    const [activeTab, setActiveTab] = useState('clinic');
    const [resetEmail, setResetEmail] = useState({
        name: null, email: null, role: null, phone: null, clinicType: null
    });
    console.log(resetEmail, 'resetEmailresetEmailresetEmail')
    const [resetEmailError, setResetEmailError] = useState(null);
    // console.log(resetEmail, 'resetEmail')
    // console.log(resetEmailError, 'resetEmailError')
    const store = useSelector((state) => state);
    const navigate = useNavigate()
    const decryptedRolesData = store?.getRolesDataReducer?.data?.roles;
    const addClinicResponse = store?.createClinicsReducer?.data?.status;
    useEffect(() => {
        dispatch(getMastersDataAction({ status: true, category: 'clinic_type', search: '', limit: '' }));
        dispatch(getRolesAction({ limit: '', skip: '', search: '' }));
        dispatch(getStatesByCountryAction());
        if (addClinicResponse === 200) {
            reset();
            ToastHandle(store?.createClinicsReducer?.data?.message, 'success');
            dispatch(stateEmptydAction());
        }
    }, [dispatch, addClinicResponse])


    const handleActiveTab = (data) => {
        setActiveTab(data)
    }
    const [showMailModal, setShowMailModal] = useState(false);
    const closeMailModal = () => {
        setShowMailModal(false);
        setResetEmail({
            name: null, email: null, role: null, phone: null
        })
        setResetEmailError(null)
    }
    return (
        <>
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className='mb-3'>
                                <Col className='d-flex align-items-center gap-3'>
                                    {/* <span onClick={() => navigate(-1)}>
                                        <IoMdArrowRoundBack />
                                    </span> */}
                                    <span
                                        onClick={() => handleActiveTab('clinic')}
                                        className={`fw-semibold cursor-pointer ${activeTab === 'clinic' ? 'border-bottom border-2 border-dark text-black fw-bold' : ''}`}>
                                        Clinic Information
                                    </span>
                                    <span
                                        onClick={() => handleActiveTab('billing')}
                                        className={`fw-semibold cursor-pointer ${activeTab === 'billing' ? 'border-bottom border-2 border-dark text-black fw-bold' : ''}`}>
                                        Billing and Subscription Information
                                    </span>
                                    <span
                                        onClick={() => handleActiveTab('contract')}
                                        className={`fw-semibold cursor-pointer ${activeTab === 'contract' ? 'border-bottom border-2 border-dark text-black fw-bold' : ''}`}>
                                        Contract
                                    </span>
                                </Col>
                                <Col className={`${activeTab === 'clinic' ? 'd-flex' : 'd-none'} gap-2 justify-content-end align-items-center`}>
                                    {/* <Button
                                        className='custom-buttons'
                                        onClick={() => {
                                            if (!resetEmail || resetEmail.trim() === '') {
                                                setResetEmailError("This field is required.");
                                            } else {
                                                setShowMailModal(true);
                                            }
                                            // else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
                                            //     // Regex check for a valid email format
                                            //     setResetEmailError("Please enter a valid email address.");
                                            // } 
                                        }}
                                    > */}
                                    <Button
                                        className='custom-buttons'
                                        onClick={() => {
                                            if (!resetEmail?.name) {
                                                ToastHandle("Name is required.", 'danger');
                                            } else if (!resetEmail?.email) {
                                                ToastHandle("Email is required.", 'danger');
                                            } else if (!resetEmail?.phone) {
                                                ToastHandle("Phone number is required.", 'danger');
                                            } else if (!resetEmail?.clinicType) {
                                                ToastHandle("Clinic Type is required.", 'danger');
                                            } else {
                                                setResetEmailError(null); // Clear the error when all inputs are valid
                                                setShowMailModal(true);
                                            }
                                        }}
                                    >
                                        Email to Clinic
                                    </Button>

                                    <SendEmailModal show={showMailModal} closeModal={closeMailModal} mailId={resetEmail} />
                                    <Button className='custom-buttons' disabled>View</Button>
                                </Col>
                            </Row>
                            {activeTab === 'clinic' ?
                                <ClinicForm
                                    setResetEmail={setResetEmail} resetEmailError={resetEmailError}
                                    resetEmail={resetEmail} showMailModal={showMailModal}
                                    setActiveTab={setActiveTab} activeTab={activeTab}
                                    setClinicId={setClinicId} clinicId={clinicId} setBillingId={setBillingId}
                                    setContractId={setContractId} />
                                :
                                activeTab === 'billing' ?
                                    <BillingForm setActiveTab={setActiveTab} activeTab={activeTab} clinicId={clinicId} billingId={billingId} />
                                    :
                                    <Contract
                                        setClinicId={setClinicId} setBillingId={setBillingId}
                                        setActiveTab={setActiveTab} activeTab={activeTab}
                                        clinicId={clinicId} billingId={billingId} contractId={contractId} />
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row >
        </>
    );
};

export default Index;
