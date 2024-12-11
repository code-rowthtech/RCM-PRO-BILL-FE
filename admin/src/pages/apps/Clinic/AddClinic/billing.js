import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscriptionsAction } from '../../../../redux/subscriptions/actions'
import { encryptMessage } from '../../../../cryptoUtils';
import { addSubscriptionPlanAction, stateEmptydAction } from '../../../../redux/actions';
import ToastHandle from '../../../../helpers/ToastMessage';
import Spinner from '../../../../constants/Spinner';
import us from '../../../../assets/images/flags/us.jpg'
import { handleFirstSpace } from '../../../../helpers/noBeginningSpace';
import { useSearchParams } from 'react-router-dom';
const BillingForm = ({ activeTab, setActiveTab, clinicId, billingId, multiple }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch, getValues,
        setError,
        clearErrors
    } = useForm();
    const [searchParams] = useSearchParams();
    const parentClincId = searchParams.get('clincid');
    const parentUserId = searchParams.get('userId');
    const [paymentType, setPaymentType] = useState('');
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [amount, setAmount] = useState((null));
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Store the selected date

    const subscriptionsData = store?.getSubscriptionsReducer?.data?.plans;
    const createResponse = store?.createSubscriptionPlanReducer?.data?.status;
    const subClinics = store?.getClinicsByParentReducer?.data?.data;
    useEffect(() => {
        if (activeTab === 'billing') {
            dispatch(getSubscriptionsAction({ search: '', status: true, skip: 1 }));
        }
        if (createResponse === 200) {
            setActiveTab('contract');
        }
    }, [dispatch, activeTab]);
    const adminData = JSON.parse(sessionStorage.getItem('hyper_user'));
    const onSubmit = (data) => {
        const payload = {
            subscription: data?.subscription,
            userId: parentClincId ? parentUserId : billingId,
            billingContactName: data?.name,
            billingContactPhone: '+1' + data?.contact,
            billingContactemail: data?.email,
            adminId: adminData?._id,
            clinicCount: multiple === 0 ? 1 : multiple,
        }
        dispatch(addSubscriptionPlanAction({ key: encryptMessage(payload) }));
    };

    const billingAddResponse = store?.createSubscriptionPlanReducer?.data?.status;
    useEffect(() => {
        if (billingAddResponse === 200) {
            reset();
            setActiveTab('contract');
            ToastHandle(store?.createSubscriptionPlanReducer?.data?.message, 'success');
            // dispatch(stateEmptydAction());
        }
    }, [billingAddResponse]);


    // useEffect(() => {
    //     if (amount?.months) {
    //         const calculateEndDate = () => {
    //             const currentDate = new Date();
    //             let newDate = new Date();

    //             // Add the number of months from `amount?.months`
    //             newDate.setMonth(currentDate.getMonth() + amount.months);

    //             return newDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    //         };

    //         setEndDate(calculateEndDate());
    //     }
    // }, [amount?.months]);
    useEffect(() => {
        if (amount?.months && selectedDate) {
            const calculateEndDate = () => {
                const currentDate = new Date(selectedDate); // Use selected date
                let newDate = new Date(currentDate);

                // Add the number of months from `amount?.months`
                newDate.setMonth(currentDate.getMonth() + amount.months);

                return newDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            };

            setEndDate(calculateEndDate());
        }
    }, [amount?.months, selectedDate]);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col sm={6} className="mb-2">
                    <Form.Group >
                        <Form.Label className='mb-1'>Subscription Plan <span className='text-danger'>*</span></Form.Label>
                        <Form.Select
                            {...register('subscription', {
                                required: 'This field is required'
                            })}
                            // data-has-value={!!getValues('subscription')}
                            // onBlur={(e) => {
                            //     e.target.setAttribute('data-has-value', !!e.target.value);
                            // }}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const selectedSubscription = subscriptionsData?.find(data => data._id === selectedId);
                                setAmount(selectedSubscription || 0);
                            }}
                        >
                            <option value="">Select plan type</option>
                            {subscriptionsData?.map((data) => (
                                <option value={data?._id} key={data?._id} className="text-capitalize">
                                    {data?.name} {data?.billingFrequency} {data?.price}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    {errors?.subscription && <span className='text-danger'>{errors?.subscription?.message}</span>}
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-2">
                        <Form.Label className='mb-1'>Amount&nbsp;
                            <span className=' uil-info-circle billing-info mb-0 cursor-pointer' />
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={
                                multiple > 0 ?
                                    amount?.totalAmount * multiple
                                    :
                                    amount?.totalAmount
                            }
                            readOnly
                            // {...register('amount', { required: 'This field is required' })}
                            placeholder="Amount" />
                        {/* {errors.amount && <span className="text-danger">{errors.amount.message}</span>} */}
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-2">
                        <Form.Label className='mb-1'>Plan Tenure</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder='Plan Tenure'
                            defaultValue={amount?.billingFrequency}
                            readOnly />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-2">
                        <Form.Label className='mb-1'>Implemented Date</Form.Label>
                        <Form.Control
                            type="date"
                            placeholder="Implemented Date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-2">
                        <Form.Label className='mb-1'>End Date</Form.Label>
                        <Form.Control
                            type="date"
                            placeholder='End Date'
                            defaultValue={amount ? endDate : ''}
                            readOnly
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-2">
                        <Form.Label className='mb-1'>Doctor Count</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder='Doctor Count'
                            defaultValue={amount?.doctorLimit}
                            readOnly />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-2">
                        <Form.Label className='mb-1'>Patient Count</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder='Patient Count'
                            defaultValue={amount?.patientLimit}
                            readOnly />
                    </Form.Group>
                </Col>
            </Row>
            <hr />
            <Row className='mt-2'>
                <Col sm={12}>
                    <Row>
                        <Col sm={6} className=''>
                            <Row className='mt-2'>
                                <Col sm={12}>
                                    <span className='text-black fw-semibold'>Payment Information</span>
                                </Col>
                                <Col sm={12}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Payment Method <span className='text-danger'>*</span></Form.Label>
                                        <Form.Select
                                            {...register('method', {
                                                required: 'This field is required'
                                            })}
                                            // data-has-value={!!getValues('method')}
                                            // onBlur={(e) => {
                                            // e.target.setAttribute('data-has-value', !!e.target.value);
                                            // }}
                                            onChange={(e) => setPaymentType(e.target.value)}>
                                            <option value=''>Select payment method</option>
                                            <option value='card'>Card</option>
                                            <option value='online'>Online banking</option>
                                            <option value='cheque'>Cheque</option>
                                        </Form.Select>
                                        {/* {errors?.method && <span className='text-danger'>{errors?.method?.message}</span>} */}
                                    </Form.Group>
                                </Col>
                                <Col sm={12}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Billing Address <span className='text-danger'>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            {...register('billingaddress', { required: 'This field is required' })}
                                            placeholder="Billing Address" />
                                        {errors.billingaddress && <span className="text-danger">{errors.billingaddress.message}</span>}
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className={`${paymentType === 'card' ? '' : 'd-none'}`}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Cardholder Name <span className='text-danger'>*</span></Form.Label>
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
                                            placeholder="xxxx-xxxx-xxxx"
                                            // {...register('cardnumber', {
                                            //     // required: 'This field is required',
                                            //     minLength: {
                                            //         value: 12,
                                            //         message: 'Card number must be at least 12 characters',
                                            //     },
                                            // })}
                                            maxLength={12}
                                        />
                                        {/* {errors.cardnumber && <span className='text-danger'>{errors.cardnumber.message}</span>} */}
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className={`${paymentType === 'card' ? '' : 'd-none'}`}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>CVV (Security Code)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            // {...register('cvv', {
                                            //     // required: 'This field is required',
                                            //     minLength: {
                                            //         value: 3,
                                            //         message: 'CVV must be at least 3 characters',
                                            //     },
                                            // })}
                                            maxLength={3}
                                            placeholder="---" />
                                        {/* {errors.cvv && <span className="text-danger">{errors.cvv.message}</span>} */}
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className={`${paymentType === 'card' ? '' : 'd-none'}`}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Expiration Date (Security Code)</Form.Label>
                                        <Form.Control
                                            type="date"
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
                                <Col sm={12} className='mb-2'>
                                    <Form.Group className="">
                                        <Form.Label className='mb-1'>Billing Contact Name <span className='text-danger'>*</span></Form.Label>
                                        <Form.Control
                                            type='text'
                                            {...register('name', {
                                                required: 'This field is required.'
                                            })}
                                            onKeyPress={handleFirstSpace}
                                            placeholder='Billing Contact Name' />
                                    </Form.Group>
                                    {errors.name && <span className="text-danger">{errors.name.message}</span>}
                                </Col>
                                <Col sm={12} className='mb-2'>
                                    <Form.Group className="">
                                        <Form.Label className='mb-1'>Billing Contact Email <span className='text-danger'>*</span></Form.Label>
                                        <Form.Control
                                            type='email'
                                            {...register('email', {
                                                required: 'This field is required',
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
                                                    message: 'Please enter a valid email address'
                                                }
                                            })}
                                            placeholder='Billing Contact Email' />
                                    </Form.Group>
                                    {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                </Col>
                                <Col sm={12} className='mb-2'>
                                    <Form.Group className="mb-0 position-relative">
                                        <Form.Label className='mb-1'>Billing Contact Phone Number <span className='text-danger'>*</span></Form.Label>
                                        <Form.Group>
                                            <InputGroup>
                                                <InputGroup.Text className='ps-3 pe-1 fw-bold text-black'>&nbsp;&nbsp;+1</InputGroup.Text> {/* This is the prefix */}
                                                <Form.Control
                                                    type="tel"
                                                    {...register('contact', {
                                                        required: 'This field is required',
                                                        pattern: {
                                                            value: /^[0-9]*$/,
                                                            message: 'Contact must be a number'
                                                        },
                                                        maxLength: {
                                                            value: 10,
                                                            message: 'Contact must not exceed 10 digits'
                                                        },
                                                        minLength: {
                                                            value: 10,
                                                            message: 'Contact must not be less than 10 digits'
                                                        }
                                                    })}

                                                    placeholder="1234-234-234"
                                                    maxLength={10}
                                                    onKeyPress={(event) => handleFirstSpace(event, 0)}
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                        <div
                                            className='position-absolute ' style={{ top: '52%', left: '1%' }}
                                        >
                                            <img
                                                src={us}
                                                alt="country code flag"
                                                width={20} />
                                        </div>
                                    </Form.Group>
                                    {/* <Form.Group className="">
                                        <Form.Control
                                            type='text'
                                            {...register('contact', {
                                                required: 'This field is required',
                                                pattern: {
                                                    value: /^[0-9]*$/,
                                                    message: 'Contact must be a number'
                                                },
                                                maxLength: {
                                                    value: 10,
                                                    message: 'Contact must not exceed 10 digits'
                                                },
                                                minLength: {
                                                    value: 10,
                                                    message: 'Contact must not be less than 10 digits '
                                                }
                                            })}
                                            maxLength={10}

                                            placeholder='Billing Contact Phone Number' />
                                    </Form.Group> */}
                                    {errors.contact && <span className="text-danger">{errors.contact.message}</span>}
                                </Col>
                            </Row>
                        </Col>


                    </Row>
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col sm={12} className='text-end'>
                    <Button type='submit' className='custom-button' disabled={store?.createSubscriptionPlanReducer?.loading}>
                        {store?.createSubscriptionPlanReducer?.loading ?
                            <Spinner className='spinner-border-sm' color='white' />
                            :
                            'Generate Contract'
                        }
                    </Button>
                </Col>
            </Row>

        </Form>
    )
}
export default BillingForm;