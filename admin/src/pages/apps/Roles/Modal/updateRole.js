import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createPermissionAction, createRolesAction, createUserRolesAction, getPermissionAction, stateEmptydAction, updateUserRolesAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Multiselect from "multiselect-react-dropdown";
import { IoMdClose } from 'react-icons/io';
import Spinner from '../../../../constants/Spinner';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for eye visibility toggle
import { getMastersDataAction } from '../../../../redux/settings/actions';
import { createdBy } from '../../Settings/userId';
import us from '../../../../assets/images/flags/us.jpg'
import { handleFirstSpace } from '../../../../helpers/noBeginningSpace';

const UpdateRoles = ({ show, closeModal, data }) => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset, getValues, clearErrors,
        watch, setValue
    } = useForm();
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

    const clinicTypeData = store?.getMastersDataReducer?.data?.clinicTypes;
    useEffect(() => {
        if (data) {
            setValue('name', data?.name)
            setValue('email', data?.email)
            // setValue('phone', data?.phone)
            setValue(
                'phone',
                data?.phone
                    .replace(/^\+1/, '')
                    .replace(/\D/g, '')
                    .replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) =>
                        p3 ? `${p1}-${p2}-${p3}` : `${p1}-${p2}`
                    )

            );
            const formattedJoiningDate = data?.joiningDate
                ? new Date(data?.joiningDate).toISOString().split('T')[0]
                : '';
            setValue('joiningDate', formattedJoiningDate)
            setValue('designation', data?.designation)
            setValue('role', data?.role?._id)
            const formattedLeavingDate = data?.leavingDate
                ? new Date(data?.leavingDate).toISOString().split('T')[0]
                : '';

            setValue('leavingDate', formattedLeavingDate);
        }
    }, [data, setValue])

    const [updateId, setUpdateId] = useState(null);
    useEffect(() => {
        if (data?._id) {
            setUpdateId(data?._id)
        }
        const fields = {
            name: data?.firstName,
            phone: data?.phone ? data?.phone
                .replace(/^\+1/, '') // Remove the "+1" prefix
                .replace(/\D/g, '') // Remove all non-numeric characters
                .replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) =>
                    p3 ? `(${p1})${p2}-${p3}` : `(${p1})${p2}` // Format dynamically as (XXX)XXX-XXXX
                )
                : '',
            joiningDate: data?.joiningDate
                ? new Date(data?.joiningDate).toISOString().split('T')[0]
                : '',
            role: data?.role?._id,
            designation: data?.designation,
        };

        Object.entries(fields).forEach(([key, value]) => {
            if (value) setValue(key, value);
        });
    }, [data, setValue]);
    const password = watch('password');
    const confirmPassword = watch('confirmPassword');
    const designation = store?.getMastersDataReducer?.data?.clinicTypes;
    const onSubmit = (formdata) => {
        const payload = {
            id: updateId,
            ...(formdata.name !== data?.firstName ? { firstName: formdata.name } : {}),
            ...(formdata.email !== data?.email ? { email: formdata.email } : {}), // Conditionally include email
            // email: formdata.email,
            // password: formdata.password,
            phone: formdata?.phone,
            phone: '+1' + formdata?.phone?.replace(/\D/g, '') || '+1' + data?.phone?.replace(/\D/g, ''), // Phone number
            ...(formdata.leavingDate ? { leavingDate: formdata.leavingDate } : {}),// Add conditionally
            role: formdata.role,
        };
        dispatch(updateUserRolesAction({ key: `${encryptMessage(payload)}` }))
    };

    useEffect(() => {
        if (createResponse === 201) {
            closeModal();
        }
    }, [createResponse]);

    return (
        <Modal centered show={show} >
            <Modal.Body>
                <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                    <Col sm={1}></Col>
                    <Col sm={10}>
                        <h4 className="mb-0 text-center">Update User</h4>
                    </Col>
                    <Col sm={1}>
                        <IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} />
                    </Col>
                </Row>
                <Form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                    <Row >
                        <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Name"
                                    {...register('name')}
                                />
                                {errors.name && <span className="text-danger">{errors.name.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Email ID</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Email ID"
                                    // onKeyPress={(event) => handleFirstSpace(event, 0)}
                                    {...register('email')}
                                />
                                {errors.email && <span className="text-danger">{errors.email.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6} className='mb-2'>
                            <Form.Group className="mb-0 position-relative">
                                <Form.Label className='mb-1'>Contact Number <span className='text-danger'>*</span></Form.Label>
                                <Form.Group>
                                    <InputGroup>
                                        <InputGroup.Text className='ps-3 pe-1 fw-bold text-black'>+1</InputGroup.Text>
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
                                                    message: 'Contact must not exceed 13 characters.'
                                                },
                                                minLength: {
                                                    value: 13,
                                                    message: 'Contact must not be less than 13 characters.'
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
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    readOnly
                                    {...register('joiningDate')}
                                />

                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className='mb-2'>
                                <Form.Label>Deactivation Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    {...register('leavingDate')}
                                />
                            </Form.Group>
                        </Col>
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
                            </Form.Group>
                        </Col>
                        <Col sm={6} >
                            <Form.Group className='mb-2'>
                                <Form.Label>Role <span className='text-danger'>*</span></Form.Label>
                                <Form.Select
                                    {...register('role')}
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
                        <Button type='submit' disabled={store?.updateUserRolesReducer?.loading} className='custom-buttons'>
                            {store?.updateUserRolesReducer?.loading ?
                                <Spinner color='white' className="spinner-border-sm" />
                                :
                                'Update user'
                            }
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateRoles;
