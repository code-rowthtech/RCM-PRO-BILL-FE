import React, { useEffect, useState } from 'react';
import PageTitle from '../../../../components/PageTitle';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FormInput } from '../../../../components';  // Assuming this is a custom form input component
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getRolesAction } from '../../../../redux/actions';
import { createClinicAction, stateEmptydAction } from '../../../../redux/clinics/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';
import ToastHandle from '../../../../helpers/ToastMessage';
import ClinicForm from './clinicForm';
import BillingForm from './billing';
import Contract from './contract';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

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
    const [activeTab, setActiveTab] = useState('clinic');
    const store = useSelector((state) => state);
    const navigate = useNavigate()
    const decryptedRolesData = store?.getRolesDataReducer?.data?.roles;
    const addClinicResponse = store?.createClinicsReducer?.data?.status;
    useEffect(() => {
        dispatch(getRolesAction({ limit: '', skip: '', search: '' }));
        if (addClinicResponse === 200) {
            reset();
            ToastHandle(store?.createClinicsReducer?.data?.message, 'success');
            dispatch(stateEmptydAction());
        }
    }, [dispatch, addClinicResponse])

    const handleActiveTab = (data) => {
        setActiveTab(data)
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
                                    <Button className='custom-buttons'>Email to Clinic</Button>
                                    <Button className='custom-buttons' disabled>View</Button>
                                </Col>
                            </Row>
                            {activeTab === 'clinic' ?
                                <ClinicForm setActiveTab={setActiveTab} activeTab={activeTab} setClinicId={setClinicId} clinicId={clinicId} setBillingId={setBillingId} />
                                :
                                activeTab === 'billing' ?
                                    <BillingForm setActiveTab={setActiveTab} activeTab={activeTab} clinicId={clinicId} billingId={billingId} />
                                    :
                                    <Contract setActiveTab={setActiveTab} activeTab={activeTab} clinicId={clinicId} />
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row >
        </>
    );
};

export default Index;
