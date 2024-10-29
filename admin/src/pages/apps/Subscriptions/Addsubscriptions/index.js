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

const toCamelCase = (str) => {
    return str
        .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) // Capitalizes first letter of each word
        .replace(/\s+/g, ''); // Removes spaces
};

const AddSubscriptions = () => {
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

    const store = useSelector((state) => state);
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

    const onSubmit = (data) => {
        if (data.Password !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'Passwords do not match',
            });
            return;
        }
        const clinicRoleId = decryptedRolesData && decryptedRolesData.find(role => role?.name === "clinic")?._id;
        const payload = {
            email: data?.email,
            password: data?.Password,
            role: clinicRoleId,
            name: data?.subscriptionname,
            address: data?.Address,
            phone: data?.phone,
        };
        dispatch(createClinicAction({ key: `${encryptMessage(payload)}` }));
    }

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Subscriptions', path: '/apps/subscriptions/list', active: true },
                    { label: 'Add Subscriptions', path: '/apps/subscriptions/add', active: true },
                ]}
                title={'Add Subscriptions'}
            />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col md={12}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Clinic Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        {...register('subscriptionname', { required: 'Subscription name is required' })}
                                                        placeholder="Enter subscription name" />
                                                    {errors.clinicname && <span className="text-danger">{errors.clinicname.message}</span>}
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control
                                                        {...register('email', {
                                                            required: 'Clinic email is required',
                                                            pattern: {
                                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                                message: 'Enter a valid email'
                                                            }
                                                        })}
                                                        type="email"
                                                        placeholder="Enter email"
                                                    />
                                                    {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                                </Form.Group>
                                            </Col>


                                            {/* <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Type of Clinic</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter type of clinic" />
                                                </Form.Group>
                                            </Col> */}

                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Contact No.</Form.Label>
                                                    <Form.Control
                                                        {...register('phone', {
                                                            required: 'Clinic contact details are required',
                                                            minLength: {
                                                                value: 10,
                                                                message: 'Contact number must be at least 10 digits'
                                                            },
                                                            maxLength: {
                                                                value: 10,
                                                                message: 'Contact number must be at most 10 digits'
                                                            },
                                                        })}
                                                        type="tel"
                                                        placeholder="Enter contact number"
                                                        maxLength={10} // Prevent entering more than 10 characters
                                                        onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')} // Allow only numeric input
                                                    />
                                                    {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Role</Form.Label>
                                                    <Form.Select
                                                        {...register('role')}
                                                        defaultValue={decryptedRolesData?.find(role => role?.name === "clinic")?._id}
                                                        disabled
                                                    >
                                                        {decryptedRolesData
                                                            ?.sort((a, b) => (a.name === "clinic" ? -1 : b.name === "clinic" ? 1 : 0)) // Moves "clinic" to the top
                                                            .map((data) => (
                                                                <option className='text-capitalize' key={data?._id} value={data?._id}>
                                                                    {toCamelCase(data?.name)}
                                                                </option>
                                                            ))}
                                                    </Form.Select>


                                                </Form.Group>

                                            </Col>
                                            {/* <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control
                                                        {...register('Password', { required: 'Password is required' })}
                                                        type="text"
                                                        placeholder="Enter password" />
                                                    {errors.Password && <span className="text-danger">{errors.Password.message}</span>}

                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Confirm Password</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter password" />
                                                </Form.Group>
                                            </Col> */}
                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Password</Form.Label>
                                                    <div className="input-group">
                                                        <Form.Control
                                                            {...register('Password', { required: 'Password is required' })}
                                                            type={showPassword ? 'text' : 'password'}
                                                            placeholder="Enter password"
                                                        />
                                                        <Button
                                                            variant="outline-secondary"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? <span className='uil-eye-slash'></span> : <span className='uil-eye'></span>}
                                                        </Button>
                                                    </div>
                                                    {errors.Password && <span className="text-danger">{errors.Password.message}</span>}
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Confirm Password</Form.Label>
                                                    <div className="input-group">
                                                        <Form.Control
                                                            {...register('confirmPassword', { required: 'Confirm Password is required' })}
                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                            placeholder="Enter confirm password"
                                                        />
                                                        <Button
                                                            variant="outline-secondary"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        >
                                                            {showConfirmPassword ? <span className='uil-eye-slash'></span> : <span className='uil-eye'></span>}
                                                        </Button>
                                                    </div>
                                                    {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword.message}</span>}
                                                </Form.Group>
                                            </Col>

                                            <Col md={12}>
                                                <Form.Group className="mb-0">
                                                    <Form.Label>Permanent Address</Form.Label>
                                                    <Form.Control
                                                        {...register('Address', { required: 'Address is required' })}
                                                        as="textarea" rows={3} placeholder="Enter address" />
                                                    {errors.Address && <span className="text-danger">{errors.Address.message}</span>}

                                                </Form.Group>
                                            </Col>


                                        </Row>

                                    </Col>
                                    <Col md={12} className='mt-2 text-end'>
                                        <Button variant="primary" type="submit" disabled={store?.createClinicsReducer?.loading} className='custom-buttons'>
                                            {store?.createClinicsReducer?.loading ?
                                                <Spinner className="spinner-border-sm" />
                                                :
                                                'Save'
                                            }
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row >
        </>
    );
};

export default AddSubscriptions;
