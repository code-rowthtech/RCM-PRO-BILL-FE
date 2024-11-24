import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getClinicById } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { Card, Col, Row } from 'react-bootstrap';
import Contract from '../AddClinic/contract';
import BillingForm from '../AddClinic/billing';
import ClinicForm from '../AddClinic/clinicForm';
import Clinic from './clinic';
import Billing from './billing';
import Contracttable from './contract';

const Updateclinic = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('updateid');
    const [activeTab, setActiveTab] = useState('clinic');

    useEffect(() => {
        dispatch(getClinicById({ key: encryptMessage({ id }) }));
    }, [dispatch])

    const handleActiveTab = (data) => {
        setActiveTab(data)
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
                            </Row>
                            <Row>
                                {activeTab === 'clinic' ?
                                    <Clinic />
                                    :
                                    activeTab === 'billing' ?
                                        <Billing />
                                        :
                                        <Contracttable />
                                }
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Updateclinic;