import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { getSubscriptionsAction } from '../../../../redux/subscriptions/actions'
const BillingForm = ({ activeTab, setActiveTab }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setError,
        clearErrors
    } = useForm();
    const [paymentType, setPaymentType] = useState('');
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const subscriptionsData = store?.getSubscriptionsReducer?.data?.plans;
    useEffect(() => {
        if (activeTab === 'billing') {
            dispatch(getSubscriptionsAction());
        }
    }, [dispatch, activeTab]);
    const onSubmit = () => {
        console.log('Form submitted');
        setActiveTab('contract');
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col sm={6}>
                    <Form.Group className="mb-2">
                        <Form.Label className='mb-1'>Subscription Plan</Form.Label>
                        <Form.Select>
                            <option>Select</option>
                            {subscriptionsData?.map((data) => (
                                <option key={data?._id} className='text-capitalize'>
                                    {data?.name} {data?.billingFrequency} {data?.price}
                                </option>
                            ))}

                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-2">
                        <Form.Label className='mb-1'>Amount</Form.Label>
                        <Form.Control
                            type="text"
                            // {...register('amount', { required: 'This field is required' })}
                            placeholder="Amount" />
                        {/* {errors.amount && <span className="text-danger">{errors.amount.message}</span>} */}
                    </Form.Group>
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col sm={12} className='border-top border-dark '>
                    <Row>
                        <Col sm={6} className='border-end border-dark'>
                            <Row className='mt-2'>
                                <Col sm={12}>
                                    <span className='text-black fw-semibold'>Payment Information</span>
                                </Col>
                                <Col sm={12}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Payment Method</Form.Label>
                                        <Form.Select onChange={(e) => setPaymentType(e.target.value)}>
                                            <option>Select</option>
                                            <option value='card'>Card</option>
                                            <option value='online'>Online banking</option>
                                            <option value='cheque'>Cheque</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col sm={12}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Billing Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            // {...register('billingaddress', { required: 'This field is required' })}
                                            placeholder="Billing Address" />
                                        {/* {errors.billingaddress && <span className="text-danger">{errors.billingaddress.message}</span>} */}
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className={`${paymentType === 'card' ? '' : 'd-none'}`}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Cardholder Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            // {...register('cardholder', { required: 'This field is required' })}
                                            placeholder="Name on card" />
                                        {/* {errors.cardholder && <span className="text-danger">{errors.cardholder.message}</span>} */}
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className={`${paymentType === 'card' ? '' : 'd-none'}`}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Credit / Debit Card Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            // {...register('cardnumber', { required: 'This field is required' })}
                                            placeholder="xxxx-xxxx-xxxx" />
                                        {/* {errors.cardnumber && <span className="text-danger">{errors.cardnumber.message}</span>} */}
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className={`${paymentType === 'card' ? '' : 'd-none'}`}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>CVV (Security Code)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            // {...register('cvv', { required: 'This field is required' })}
                                            placeholder="---" />
                                        {/* {errors.cvv && <span className="text-danger">{errors.cvv.message}</span>} */}
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className={`${paymentType === 'card' ? '' : 'd-none'}`}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Expiration Date (Security Code)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            // {...register('expiration', { required: 'This field is required' })}
                                            placeholder="---" />
                                        {/* {errors.expiration && <span className="text-danger">{errors.expiration.message}</span>} */}
                                    </Form.Group>
                                </Col>
                            </Row>

                        </Col>
                        <Col sm={6}>
                            <Row className='mt-2'>
                                <Col sm={12}>
                                    <span className='text-black fw-semibold'>Billing Contact Information</span>
                                </Col>
                                <Col sm={12}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Billing Contact Name</Form.Label>
                                        <Form.Control type='text' placeholder='Billing Contact Name' />
                                    </Form.Group>
                                </Col>
                                <Col sm={12}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Billing Contact Email</Form.Label>
                                        <Form.Control type='email' placeholder='Billing Contact Email' />
                                    </Form.Group>
                                </Col>
                                <Col sm={12}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Billing Contact Phone Number</Form.Label>
                                        <Form.Control type='text' placeholder='Billing Contact Phone Number' />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>


                    </Row>
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col sm={12} className='text-end'>
                    <Button type='submit' className='custom-button'>
                        Generate Contract
                    </Button>
                </Col>
            </Row>

        </Form>
    )
}
export default BillingForm;