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
    const [designationValue, setDesignationValue] = useState('');
    const [reEnterDesignationValue, setReEnterDesignationValue] = useState('');
    const [designationError, setDesignationError] = useState('');
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
        watch, clearErrors
    } = useForm();
    const joiningDate = watch('joiningDate');
    const password = watch('password');
    const confirmPassword = watch('confirmPassword');
    const designation = store?.getMastersDataReducer?.data?.clinicTypes;
    const creatorId = JSON.parse(sessionStorage.getItem('hyper_user'))?._id;
    const onSubmit = (data) => {
        const payload = {
            firstName: data.name,
            email: data.email,
            password: data.password,
            phone: '+1' + data?.phone?.replace(/\D/g, ''),
            reportingTo: creatorId,
            createdById: creatorId,
            joiningDate: data.joiningDate,
            designation: designationValue,
            role: data.role,
        };
        dispatch(createUserRolesAction({ key: `${encryptMessage(payload)}` }))
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



    const handleDesignationChange = (e) => {
        setDesignationValue(e.target.value);
        if (reEnterDesignationValue && e.target.value !== reEnterDesignationValue) {
            setDesignationError('The designations do not match.');
        } else {
            setDesignationError('');
        }
    };

    const handleReEnterDesignationChange = (e) => {
        setReEnterDesignationValue(e.target.value);
        if (designationValue && e.target.value !== designationValue) {
            setDesignationError('The designations do not match.');
        } else {
            setDesignationError('');
        }
    };
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
                <Form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
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
                                    // onKeyPress={(event) => handleFirstSpace(event, 0)}
                                    {...register('email', { required: 'This field is required' })}
                                />
                                {errors.email && <span className="text-danger">{errors.email.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6} className='mb-2'>
                            <Form.Group className="mb-0 position-relative">
                                <Form.Label className='mb-1'>Contact Number <span className='text-danger'>*</span></Form.Label>
                                <Form.Group>
                                    <InputGroup>
                                        <InputGroup.Text className='ps-3 pe-1 fw-bold text-black'>+1</InputGroup.Text> {/* This is the prefix */}
                                        <Form.Control
                                            type="tel"
                                            {...register('phone', {
                                                required: 'This field is required',
                                                pattern: {
                                                    value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                                    message: 'Contact must be in the format (XXX)XXX-XXXX',
                                                },
                                                maxLength: {
                                                    value: 13, // Includes characters for (XXX)XXX-XXXX
                                                    message: 'Contact must not exceed 13 characters'
                                                },
                                                minLength: {
                                                    value: 13,
                                                    message: 'Contact must not be less than 13 characters'
                                                }
                                            })}
                                            onChange={(e) => {
                                                let rawValue = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters
                                                if (rawValue.length > 10) rawValue = rawValue.slice(0, 10); // Limit to 10 digits
                                                const formattedValue = rawValue.replace(
                                                    /(\d{1,3})(\d{0,3})(\d{0,4})/,
                                                    (match, p1, p2, p3) => {
                                                        if (p3) return `(${p1})${p2}-${p3}`;
                                                        if (p2) return `(${p1})${p2}`;
                                                        return `(${p1}`;
                                                    }
                                                ); // Format dynamically as (XXX)XXX-XXXX
                                                e.target.value = formattedValue; // Update input value
                                                clearErrors('phone'); // Clear validation errors
                                            }}
                                            placeholder="(123)456-7890"
                                            maxLength={14}
                                            onKeyPress={(event) => {
                                                // Only allow numeric characters (0-9)
                                                if (!/[0-9]/.test(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }}
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
                                        // onKeyPress={(event) => handleFirstSpace(event, 0)}
                                        onCopy={(e) => e.preventDefault()}
                                        onCut={(e) => e.preventDefault()}
                                        onPaste={(e) => e.preventDefault()}
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
                                        // onKeyPress={(event)   => handleFirstSpace(event, 0)}
                                        onCopy={(e) => e.preventDefault()}
                                        onCut={(e) => e.preventDefault()}
                                        onPaste={(e) => e.preventDefault()}
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
                                <Form.Label>Start Date <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="date"
                                    className={` ${!joiningDate ? 'emptyField' : 'selectedField'}`}
                                    {...register('joiningDate', { required: 'This field is required' })}
                                />
                                {errors.joiningDate && <span className="text-danger">{errors.joiningDate.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Designation <span className='text-danger'>*</span></Form.Label>
                                <Form.Select
                                    {...register('designation')}
                                    data-has-value={!!getValues('designation')}
                                    value={designationValue} // Set the value from state
                                    onChange={handleDesignationChange}
                                    onBlur={(e) => {
                                        e.target.setAttribute('data-has-value', !!e.target.value);
                                    }}>
                                    <option value={''} key={''}>Designation</option>
                                    {designation?.map((data, i) => (
                                        <option key={data?._id} value={data?.name}>{data?.name}</option>
                                    ))}
                                </Form.Select>
                                {designationError && <span className="text-danger">{designationError}</span>}
                            </Form.Group>
                        </Col>

                        {/* <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Re-Select Designation <span className='text-danger'>*</span></Form.Label>
                                <Form.Select
                                    value={reEnterDesignationValue} // Set the value from state
                                    onChange={handleReEnterDesignationChange}>
                                    <option value={''} key={''}>Re-Enter Designation</option>
                                    {designation?.map((data, i) => (
                                        <option key={data?._id} value={data?.name}>{data?.name}</option>
                                    ))}
                                </Form.Select>
                                {designationError && <span className="text-danger">{designationError}</span>}
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
