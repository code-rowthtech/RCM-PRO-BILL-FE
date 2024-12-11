import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createPermissionAction, createRolesAction, createUserRolesAction, getPermissionAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Multiselect from "multiselect-react-dropdown";
import { IoMdClose } from 'react-icons/io';
import Spinner from '../../../../constants/Spinner';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for eye visibility toggle
import { getMastersDataAction } from '../../../../redux/settings/actions';
import { createdBy } from '../../Settings/userId';
import { handleFirstSpace } from '../../../../helpers/noBeginningSpace';
import us from '../../../../assets/images/flags/us.jpg'

const AddRoles = ({ show, closeModal }) => {
    const dispatch = useDispatch();
    const idFromStorage = JSON.parse(sessionStorage.getItem('hyper_user'));
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const store = useSelector((state) => state);
    const createResponse = store?.createUserRolesReducer?.data?.status;
    const decryptedPermissionsData = store?.getPermissionsDataReducer?.data?.data?.map((item) => ({
        ...item,
        name: `${item?.name}`,
    }));
    const decryptedRolesData = store?.getRolesDataReducer?.data?.roles;
    const updateResponse = store?.updateUserRolesReducer?.data?.status;

    useEffect(() => {
        // if (show) {
        dispatch(getMastersDataAction({ status: true, category: 'designation', search: '', limit: 10 }));
        dispatch(getPermissionAction({ search: '', limit: '' }));
        // }
    }, [dispatch, createResponse, updateResponse])
    const clinicTypeData = store?.getMastersDataReducer?.data?.clinicTypes;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset, getValues,
        watch
    } = useForm();

    const password = watch('password');
    const confirmPassword = watch('confirmPassword');
    const designation = store?.getMastersDataReducer?.data?.clinicTypes;
    const creatorId = JSON.parse(sessionStorage.getItem('hyper_user'))?._id;
    const onSubmit = (data) => {
        const payload = {
            firstName: data.name,
            email: data.email,
            password: data.password,
            phone: data?.phone,
            reportingTo: creatorId,
            createdById: creatorId,
            joiningDate: data.joiningDate,
            designation: data.designation,
            role: data.role,
        };
        // console.log(payload)
        dispatch(createUserRolesAction({ key: `${encryptMessage(payload)}` }))
        // dispatch(createUserRolesAction(payload))
    };

    const handleSelect = (selectedList) => {
        const selectedIds = selectedList.map((item) => item._id);
        setSelectedPermissionIds(selectedIds);
    };

    const handleRemove = (selectedList) => {
        const selectedIds = selectedList.map((item) => item._id);
        setSelectedPermissionIds(selectedIds);
    };

    useEffect(() => {
        if (createResponse === 201) {
            reset();
            closeModal();
        }
    }, [createResponse]);

    return (
        <Modal centered show={show} >
            <Modal.Body>
                <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                    <Col sm={1}></Col>
                    <Col sm={10}>
                        <h4 className="mb-0 text-center">Add New User</h4>
                    </Col>
                    <Col sm={1}>
                        <IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} />
                    </Col>
                </Row>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row >
                        <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Name <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Name"
                                    {...register('name', { required: 'This field is required' })}
                                />
                                {errors.name && <span className="text-danger">{errors.name.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Email ID <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Email ID"
                                    {...register('email', { required: 'This field is required' })}
                                />
                                {errors.email && <span className="text-danger">{errors.email.message}</span>}
                            </Form.Group>
                        </Col>
                        {/* <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Contact No <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    maxLength={10}
                                    placeholder="Contact No"
                                    {...register('phone', { required: 'This field is required' })}
                                />
                                {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
                            </Form.Group>
                        </Col> */}
                        <Col sm={6} className='mb-2'>
                            <Form.Group className="mb-0 position-relative">
                                <Form.Label className='mb-1'>Billing Contact Phone Number <span className='text-danger'>*</span></Form.Label>
                                <Form.Group>
                                    <InputGroup>
                                        <InputGroup.Text className='ps-3 pe-1 fw-bold text-black'>+1</InputGroup.Text> {/* This is the prefix */}
                                        <Form.Control
                                            type="tel"
                                            {...register('phone', {
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
                            {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
                        </Col>
                        <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Reporting</Form.Label>
                                <Form.Select disabled>
                                    <option>Reporting</option>
                                    <option value="">1</option>
                                    <option value="">2</option>
                                    <option value="">3</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Password  <span className='text-danger'>*</span></Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        {...register('password', {
                                            required: 'This field is required',
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                                                message: 'At least 8 characters required, including 1 uppercase letter, 1 number, and 1 special character',
                                            },
                                        })}
                                    />
                                    <span
                                        className="position-absolute end-0 top-0 mt-1 me-2 cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                    {errors.password && <span className="text-danger">{errors.password.message}</span>}
                                </div>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Confirm Password <span className='text-danger'>*</span></Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        {...register('confirmPassword', {
                                            required: 'This field is required',
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                                                message: 'At least 8 characters required, including 1 uppercase letter, 1 number, and 1 special character',
                                            },
                                            validate: value =>
                                                value === password || 'Passwords do not match'
                                        })}
                                    />
                                    <span
                                        className="position-absolute end-0 top-0 mt-1 me-2 cursor-pointer"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                    {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword.message}</span>}
                                </div>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Date of Joining <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="date"
                                    {...register('joiningDate', { required: 'This field is required' })}
                                />
                                {errors.joiningDate && <span className="text-danger">{errors.joiningDate.message}</span>}
                            </Form.Group>
                        </Col>
                        {/* <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Date of Leaving <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="date"
                                    {...register('leavingDate', { required: 'This field is required' })}
                                />
                                {errors.leavingDate && <span className="text-danger">{errors.leavingDate.message}</span>}
                            </Form.Group>
                        </Col> */}
                        <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Designation <span className='text-danger'>*</span></Form.Label>
                                <Form.Select
                                    {...register('designation')}
                                    data-has-value={!!getValues('designation')}
                                    onBlur={(e) => {
                                        e.target.setAttribute('data-has-value', !!e.target.value);
                                    }}>
                                    <option value={''} key={''}>Designation</option>
                                    {designation?.map((data, i) => (
                                        <option key={data?._id} value={data?.name}>{data?.name}</option>
                                    ))}
                                </Form.Select>
                                {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
                            </Form.Group>
                        </Col>
                        {/* <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Re-Enter Designation <span className='text-danger'>*</span></Form.Label>
                                <Form.Select>
                                    <option value={''} key={''}>Re-Enter Designation</option>
                                    {clinicTypeData?.map((data, i) => (
                                        <option key={data?._id} value={data?.name}>{data?.name}</option>
                                    ))}
                                </Form.Select>
                                {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
                            </Form.Group>
                        </Col> */}
                        <Col sm={6} >
                            <Form.Group className='mb-2'>
                                <Form.Label>Role <span className='text-danger'>*</span></Form.Label>
                                <Form.Select
                                    {...register('role', {
                                        required: 'This field is required'
                                    })}
                                    data-has-value={!!getValues('role')}
                                    onBlur={(e) => {
                                        e.target.setAttribute('data-has-value', !!e.target.value);
                                    }}
                                    className='text-capitalize'>
                                    <option value='' key=''>Select role</option>
                                    {decryptedRolesData?.map((data) => (
                                        <option className='text-capitalize' value={data?._id} key={data?._id}>{data?.name}</option>
                                    ))}
                                </Form.Select>
                                {errors?.role && <span className='text-danger'>{errors?.role?.message}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    {/* <hr className='my-1' /> */}

                    <Modal.Footer className='border-0'>
                        <Button className='custom-buttons' onClick={() => closeModal()}>Cancel</Button>
                        <Button type='submit' disabled={store?.createUserRolesReducer?.loading} className='custom-buttons'>
                            {store?.createUserRolesReducer?.loading ?
                                <Spinner color='white' className="spinner-border-sm" />
                                :
                                'Create user'
                            }
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddRoles;
