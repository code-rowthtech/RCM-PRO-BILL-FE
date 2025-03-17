import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
    createPermissionAction,
    createRolesAction,
    createUserRolesAction,
    getCitiesAction,
    getPermissionAction,
    getStatesByCountryAction,
    stateEmptydAction,
    updateUserRolesAction,
} from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Multiselect from 'multiselect-react-dropdown';
import { IoMdClose } from 'react-icons/io';
import Spinner from '../../../../constants/Spinner';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for eye visibility toggle
import { getMastersDataAction } from '../../../../redux/settings/actions';
import { createdBy } from '../../Settings/userId';
import us from '../../../../assets/images/flags/us.jpg';
import { handleFirstSpace } from '../../../../helpers/noBeginningSpace';

const UpdateRoles = ({ show, closeModal, data }) => {
    const dispatch = useDispatch();
    console.log(data,'datadatadatadatadata')
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        clearErrors,
        watch,
        setValue,
    } = useForm();
    const stateGeoLocation = watch('stateName');
    const idFromStorage = JSON.parse(sessionStorage.getItem('hyper_user'));
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const store = useSelector((state) => state);
    const [searchedLocations, setSearchedLocations] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [mailingLatitude, setMailingLatitude] = useState(null);
    const [mailingFocused, setMailingFocused] = useState(false);
    const [citySearch, setCitySearch] = useState(null);
    const [updatePage, setUpdatePage] = useState(false);
    const [mailingLongitude, setMailingLongitude] = useState(null);
    const [selectedStates, setSelectedStates] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [country, setCountry] = useState(null);
    const [focused, setFocused] = useState(false);
    const [stateToSelect, setStateToSelect] = useState(null);
    const statesData = store?.getStatesReducer?.data;
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;
    const clinicDataToUpdate = store?.getClinicByIdReducer?.data?.clinic;
    const createResponse = store?.createUserRolesReducer?.data?.status;
    const decryptedPermissionsData = store?.getPermissionsDataReducer?.data?.data?.map((item) => ({
        ...item,
        name: `${item?.name}`,
    }));
    const decryptedRolesData = store?.getRolesDataReducer?.data?.roles;

    const clinicTypeData = store?.getMastersDataReducer?.data?.clinicTypes;
    const setField = (key, value) => value && setValue(key, value);
    useEffect(() => {
        if (data) {
            setValue('name', data?.name?.text);
            setValue('email', data?.email);
            setValue(
                'phone',
                data?.telecom?.[0]?.value
                    ?.replace(/^\+1/, '')
                    ?.replace(/\D/g, '')
                    ?.replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) =>
                        p3 ? `${p1}-${p2}-${p3}` : `${p1}-${p2}`
                    )
            );
            const formattedJoiningDate = data?.joiningDate
                ? new Date(data?.joiningDate).toISOString().split('T')[0]
                : '';
            setValue('joiningDate', formattedJoiningDate);
            setValue('designation', data?.designation);
            setValue('role', data?.roleId?._id);
            const formattedLeavingDate = data?.leavingDate
                ? new Date(data?.leavingDate).toISOString().split('T')[0]
                : '';
                setField('address', data?.address?.[0]?.line || '');
                setField('stateName', data?.address?.[0]?.state || '');
                setField('city', data?.address?.[0]?.city || '');
                setCountry( data?.address?.[0]?.country || '');
                setField('street', data?.address?.[0]?.street || '');
                setField('zip', data?.address?.[0]?.postalCode || '');
                // if (data?.address?.[0]?.city) {
                //             dispatch(
                //                 getCitiesAction({
                //                     state_code: data?.address?.[0]?.state?.id,
                //                     name: data?.address?.[0]?.city?.name,
                //                     limit: '',
                //                     skip: '',
                //                 })
                //             );
                //         }

            setValue('leavingDate', formattedLeavingDate);
        }
    }, [data, setValue,cities1]);

    const [updateId, setUpdateId] = useState(null);
    useEffect(() => {
        if (data?._id) {
            setUpdateId(data?._id);
        }
        const fields = {
            name: data?.firstName,
            phone: data?.phone
                ? data?.phone
                      .replace(/^\+1/, '') // Remove the "+1" prefix
                      .replace(/\D/g, '') // Remove all non-numeric characters
                      .replace(
                          /(\d{3})(\d{3})(\d{0,4})/,
                          (match, p1, p2, p3) => (p3 ? `(${p1})${p2}-${p3}` : `(${p1})${p2}`) // Format dynamically as (XXX)XXX-XXXX
                      )
                : '',
            joiningDate: data?.joiningDate ? new Date(data?.joiningDate).toISOString().split('T')[0] : '',
            role: data?.roleId?._id,
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
            id: updateId,  // Ensure ID is included
            name: { text: formdata.name }, // Ensure name is properly structured
            email: formdata.email,
            role: formdata.role,
            phone: formdata.phone ? '+1' + formdata.phone.replace(/\D/g, '') : '', // Format phone number
            ...(formdata.leavingDate ? { leavingDate: formdata.leavingDate } : {}),// Add conditionally
            address: [
                {
                    line: formdata.address || '',  
                    city: formdata.city || '',
                    state: formdata.stateName || '',
                    country: country || '',
                    postalCode: formdata.zip || '',
                },
            ],
        };
        
     console.log(payload,"formdata")
        dispatch(updateUserRolesAction({ key: `${encryptMessage(payload)}` }));
    };

    useEffect(() => {
        if (createResponse === 201) {
            closeModal();
        }
    }, [createResponse]);

    useEffect(() => {
        dispatch(getStatesByCountryAction());
    }, [dispatch]);

    const getGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed';
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
                location
            )}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                return data; // Return the geocoding data
            } catch (error) {
                console.error('Failed to fetch geocode data:', error);
                return null; // Return null in case of error
            }
        }
        fetchGeocodeData(addressToSearch).then((data) => {
            if (data) {
                setSearchedLocations(data?.results);
            } else {
                console.error('No data returned.');
            }
        });
    };
    useEffect(() => {
        if (citySearch) {
            setValue('city', cities1 && cities1.find((data) => data?.name === citySearch)?._id);
        }
    }, [citySearch, cities1]);
    useEffect(() => {
        if (latitude && longitude) {
            setFocused(false);
        }
        if (mailingLatitude && mailingLongitude) {
            setMailingFocused(false);
        }
    }, [latitude, longitude, mailingLatitude, mailingLongitude]);
    const handleStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        setSelectedState(e.target.value);
        dispatch(getCitiesAction({ state_code: key, name: '', limit: 25 }));
    };

    useEffect(() => {
        if (stateGeoLocation) {
            setStateToSelect(
                statesData?.states && statesData?.states.find((data) => data?.state_code === stateGeoLocation)
            );
        }
    }, [stateGeoLocation]);
    useEffect(() => {
        if (stateToSelect) {
            dispatch(
                getCitiesAction({
                    state_code: stateToSelect?.id,
                    name: citySearch ? citySearch : '',
                    limit: 25,
                    skip: '',
                })
            );
        }
    }, [stateToSelect, citySearch]);

    const handleCitySelection = (e) => {
        const value = e.target.value;
        setSelectedCity(value);
    };

    return (
        <Modal centered show={show} size='lg'>
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
                <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Name" {...register('name')} />
                                {errors.name && <span className="text-danger">{errors.name.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
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
                        <Col sm={6} className="mb-2">
                            <Form.Group className="mb-0 position-relative">
                                <Form.Label className="mb-1">
                                    Contact Number <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Group>
                                    <InputGroup>
                                        <InputGroup.Text className="ps-3 pe-1 fw-bold text-black">+1</InputGroup.Text>
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
                                                    message: 'Contact must not exceed 13 characters.',
                                                },
                                                minLength: {
                                                    value: 13,
                                                    message: 'Contact must not be less than 13 characters.',
                                                },
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
                                <div className="position-absolute " style={{ top: '52%', left: '1%' }}>
                                    <img src={us} alt="country code flag" width={20} />
                                </div>
                            </Form.Group>
                            {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
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
                            <Form.Group className="mb-2">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control type="date" readOnly {...register('joiningDate')} />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Deactivation Date</Form.Label>
                                <Form.Control type="date" {...register('leavingDate')} />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>
                                    Designation <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Select
                                    {...register('designation')}
                                    data-has-value={!!getValues('designation')}
                                    onBlur={(e) => {
                                        e.target.setAttribute('data-has-value', !!e.target.value);
                                    }}>
                                    <option value={''} key={''}>
                                        Designation
                                    </option>
                                    {designation?.map((data, i) => (
                                        <option key={data?._id} value={data?.name}>
                                            {data?.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>
                                    Role <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Select
                                    {...register('role')}
                                    data-has-value={!!getValues('role')}
                                    onBlur={(e) => {
                                        e.target.setAttribute('data-has-value', !!e.target.value);
                                    }}
                                    className="text-capitalize">
                                    <option value="" key="">
                                        Select role
                                    </option>
                                    {decryptedRolesData?.map((data) => (
                                        <option className="text-capitalize" value={data?._id} key={data?._id}>
                                            {data?.name}
                                        </option>
                                    ))}
                                </Form.Select>
                                {errors?.role && <span className="text-danger">{errors?.role?.message}</span>}
                            </Form.Group>
                        </Col>
                        {/* ADDRESS */}
                        <Col sm={12}>
                            <Row>
                                <Col sm={12} className="mb-2">
                                    <span className="text-black fw-semibold form-label">Address Details</span>
                                </Col>
                                <Col sm={6}>
                                    <Row className="position-relative">
                                        <Col sm={12}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="mb-1">Address</Form.Label>
                                                <div style={{ position: 'relative' }}>
                                                    <Form.Control
                                                        type="text"
                                                        {...register('address', {})}
                                                        onChange={(e) => {
                                                            getGeolocation(e);
                                                            setFocused(true);
                                                            clearErrors('address');
                                                        }}
                                                        onFocus={() => setFocused(true)}
                                                        onBlur={() => {
                                                            setTimeout(() => setFocused(false), 200);
                                                        }}
                                                        placeholder="Search for address"
                                                        autoComplete="off"
                                                    />
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: '100%',
                                                            left: 0,
                                                            width: '100%',
                                                            maxHeight: '150px',
                                                            zIndex: 111,
                                                            backgroundColor: '#fff',
                                                            border: '1px solid #ced4da',
                                                            borderTop: 'none',
                                                        }}
                                                        className={`scroll-container hover-bg-change ${
                                                            searchedLocations?.length === 0 || !focused ? 'd-none' : ''
                                                        }`}>
                                                        {searchedLocations?.map((data, index) => (
                                                            <p
                                                                key={index}
                                                                onClick={() => {
                                                                    setValue('zip', data?.components?.postcode);
                                                                    setValue('stateName', data?.components?.state_code);
                                                                    setLatitude(data?.bounds?.southwest?.lat);
                                                                    setLongitude(data?.bounds?.southwest?.lng);
                                                                    setCitySearch(data?.components?.county);
                                                                    setValue('address', data?.formatted);
                                                                    setFocused(false);
                                                                    setCountry(data?.components?.country);
                                                                }}
                                                                style={{
                                                                    margin: 0,
                                                                    padding: '8px 12px',
                                                                    cursor: 'pointer',
                                                                }}
                                                                className="hover-bg-change text-black">
                                                                {data?.formatted}
                                                            </p>
                                                        ))}
                                                        {searchedLocations?.length === 0 && (
                                                            <p className="text-muted px-2 py-1">No results found</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {errors.address && (
                                                    <span className="text-danger">{errors.address.message}</span>
                                                )}
                                            </Form.Group>
                                        </Col>

                                        {/* <Col sm={6}>
                                                                    <Form.Group className="mb-2">
                                                                        <Form.Label className="mb-1">Latitude</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            defaultValue={latitude}
                                                                            placeholder="Latitude"
                                                                        />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-2">
                                                                        <Form.Label className="mb-1">Longitude</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            defaultValue={longitude}
                                                                            placeholder="Longitude"
                                                                        />
                                                                    </Form.Group>
                                                                </Col> */}
                                        <Col sm={12}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="mb-1">Country</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    defaultValue={country}
                                                    placeholder="Country"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col sm={6}>
                                    <Row>
                                        <Col sm={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="mb-1">State</Form.Label>
                                                <Form.Select
                                                    {...register('stateName')}
                                                    data-has-value={!!getValues('stateName')}
                                                    onBlur={(e) => {
                                                        e.target.setAttribute('data-has-value', !!e.target.value);
                                                    }}
                                                    onChange={(e) => {
                                                        handleStateSelection(e, 'primary');
                                                        clearErrors('stateName');
                                                    }}>
                                                    <option value="">State</option>
                                                    {statesData?.states?.map((data) => (
                                                        <option
                                                            key={data?.name}
                                                            data-key={data?.id}
                                                            value={data?.state_code}>
                                                            {data?.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                {errors.stateName && (
                                                    <span className="text-danger">{errors.stateName.message}</span>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="mb-1">City</Form.Label>
                                                <Form.Select
                                                    disabled={store?.getCitiesReducer?.loading}
                                                    {...register('city')}
                                                    data-has-value={!!getValues('city')}
                                                    onBlur={(e) => {
                                                        e.target.setAttribute('data-has-value', !!e.target.value);
                                                    }}
                                                    onChange={(e) => {
                                                        handleCitySelection(e);
                                                        clearErrors('city');
                                                    }}>
                                                    <option value="">
                                                        {store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}
                                                    </option>
                                                    {cities1?.map((data) => (
                                                        <option key={data?.name} value={data?._id}>
                                                            {data?.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                {errors.city && (
                                                    <span className="text-danger">{errors.city.message}</span>
                                                )}
                                            </Form.Group>
                                        </Col>
{/* 
                                        <Col sm={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="mb-1">Street</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    {...register('street')}
                                                    onKeyPress={handleFirstSpace}
                                                    onChange={(e) => {
                                                        clearErrors('street');
                                                    }}
                                                    placeholder="Street"
                                                />
                                                {errors.street && (
                                                    <span className="text-danger">{errors.street.message}</span>
                                                )}
                                            </Form.Group>
                                        </Col> */}
                                        <Col sm={12}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="mb-1">Zip</Form.Label>
                                                <Form.Control
                                                    defaultValue={updatePage ? clinicDataToUpdate?.address?.zip : ''}
                                                    type="text"
                                                    {...register('zip', {
                                                        minLength: {
                                                            value: 5,
                                                            message: 'ZIP code must be at least 5 characters long',
                                                        },
                                                        pattern: {
                                                            value: /^[0-9]+$/,
                                                            message: 'ZIP code must contain numbers only',
                                                        },
                                                    })}
                                                    onKeyPress={handleFirstSpace}
                                                    placeholder="Zip"
                                                    maxLength={5}
                                                />
                                                {errors.zip && (
                                                    <span className="text-danger">{errors.zip.message}</span>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {/* <hr className='my-1' /> */}

                    <Modal.Footer className="border-0">
                        <Button className="custom-buttons" onClick={() => closeModal()}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={store?.updateUserRolesReducer?.loading}
                            className="custom-buttons">
                            {store?.updateUserRolesReducer?.loading ? (
                                <Spinner color="white" className="spinner-border-sm" />
                            ) : (
                                'Update user'
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateRoles;
