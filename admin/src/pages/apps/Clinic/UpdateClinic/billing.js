import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscriptionsAction } from '../../../../redux/subscriptions/actions'
import { encryptMessage } from '../../../../cryptoUtils';
import { addSubscriptionPlanAction, stateEmptydAction } from '../../../../redux/actions';
import ToastHandle from '../../../../helpers/ToastMessage';
import Spinner from '../../../../constants/Spinner';
import { createdBy } from '../../Settings/userId';
import us from '../../../../assets/images/flags/us.jpg'
import { handleFirstSpace } from '../../../../helpers/noBeginningSpace';
const Billing = ({ activeTab, setActiveTab, id }) => {

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
    const [amount, setAmount] = useState((null));
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Store the selected date

    const subscriptionsData = store?.getSubscriptionsReducer?.data?.plans;
    const subscriptionLoading = store?.getSubscriptionsReducer?.loading;
    const createResponse = store?.createSubscriptionPlanReducer?.data?.status;
    const subClinics = store?.getClinicsByParentReducer?.data?.data;
    const [loading, setLoading] = useState(false);
    const billingDone = store?.getClinicByIdReducer?.data?.clinic?.userId?.subscription?.isActive;
    const billingData = store?.getClinicByIdReducer?.data?.clinic?.userId?.subscription;
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
            userId: id,
            billingContactName: data?.name,
            billingContactPhone: '+1' + data?.contact,
            billingContactemail: data?.email.toLowerCase(),
            adminId: createdBy,
        }
        console.log(payload)
        dispatch(addSubscriptionPlanAction({ key: encryptMessage(payload) }));
    };

    const billingAddResponse = store?.createSubscriptionPlanReducer?.data?.status;
    useEffect(() => {
        if (billingAddResponse === 200) {
            reset();
            setActiveTab('contract');
            ToastHandle(store?.createSubscriptionPlanReducer?.data?.message, 'success');
            dispatch(stateEmptydAction());
        }
    }, [billingAddResponse]);

    useEffect(() => {
        if (amount?.months && selectedDate) {
            const calculateEndDate = () => {
                const currentDate = new Date(selectedDate); // Use selected date
                let newDate = new Date(currentDate);
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
        <>
            {billingDone ?
                <>
                    <Row>
                        <Col>
                            <h5 className=''>
                                There is already a subscription attached to this account. Below are the details of the current subscription:
                            </h5>
                        </Col>
                    </Row>
                    <Table responsive className="table-centered border border-muted table-nowrap mb-0">
                        <thead>
                            <tr>
                                <th>Subscription Name</th>
                                <th>Renewal Date</th>
                                <th>Start Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{billingData?.name}</td>
                                <td>
                                    {billingData?.subscriptionRenewalDate ?
                                        new Date(billingData.subscriptionRenewalDate).toLocaleDateString('en-GB') :
                                        'N/A'}
                                </td>
                                <td>
                                    {billingData?.subscriptionStartDate ?
                                        new Date(billingData.subscriptionStartDate).toLocaleDateString('en-GB') :
                                        'N/A'}
                                </td>
                                <td>
                                    {billingData?.totalAmount}
                                </td>
                                <td>
                                    <Form.Switch checked={billingData?.isActive} />
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </>
                :
                <div>
                    {subscriptionLoading ?
                        <Row>
                            <Col className='d-flex justify-content-center align-items-center'>
                                <Spinner />
                            </Col>
                        </Row>

                        :
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col sm={6} className="mb-2">
                                    <Form.Group >
                                        <Form.Label className='mb-1'>Subscription Plan <span className='text-danger'>*</span></Form.Label>
                                        <Form.Select
                                            {...register('subscription', {
                                                required: 'This field is required'
                                            })}
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
                                            <span className=' uil-info-circle mb-0 cursor-pointer'
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title="The amount displayed is inclusive of all applicable taxes and covers all added clinics." />
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={
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
                                            value={selectedDate} // Controlled input
                                            onChange={handleDateChange} // Update state on change
                                            min={new Date().toISOString().split('T')[0]} // Min date is today
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
                                                        <Form.Label className='mb-1'>Payment Method</Form.Label>
                                                        <Form.Select
                                                            {...register('method', {
                                                                required: 'This field is required'
                                                            })}
                                                            onChange={(e) => setPaymentType(e.target.value)}>
                                                            <option value=''>Select payment method</option>
                                                            <option value='card'>Card</option>
                                                            <option value='online'>Online banking</option>
                                                            <option value='cheque'>Cheque</option>
                                                        </Form.Select>
                                                        {errors?.method && <span className='text-danger'>{errors?.method?.message}</span>}
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={12}>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label className='mb-1'>Billing Address</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            {...register('billingaddress', { required: 'This field is required' })}
                                                            placeholder="Billing Address" />
                                                        {errors.billingaddress && <span className="text-danger">{errors.billingaddress.message}</span>}
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
                                                <Col sm={12} className='mb-2'>
                                                    <Form.Group className="">
                                                        <Form.Label className='mb-1'>Billing Contact Name</Form.Label>
                                                        <Form.Control
                                                            type='text'
                                                            {...register('name', {
                                                                required: 'This field is required.'
                                                            })}
                                                            placeholder='Billing Contact Name' />
                                                    </Form.Group>
                                                    {errors.name && <span className="text-danger">{errors.name.message}</span>}
                                                </Col>
                                                <Col sm={12} className='mb-2'>
                                                    <Form.Group className="">
                                                        <Form.Label className='mb-1'>Billing Contact Email</Form.Label>
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
                                                    {errors.contact && <span className="text-danger">{errors.contact.message}</span>}
                                                </Col>


                                                {/* <Col sm={12} className='mb-2'>
                                                    <Form.Group className="">
                                                        <Form.Label className='mb-1'>Billing Contact Phone Number</Form.Label>
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
                                                    </Form.Group>
                                                    {errors.contact && <span className="text-danger">{errors.contact.message}</span>}
                                                </Col> */}
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
                    }

                </div>
            }
        </>


    )
}
export default Billing;