// src/components/Clinic.js

import React, { useEffect, useRef, useState } from 'react';
import { Col, Form, Row, Button, InputGroup, Modal, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiDownloadCloud } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { handleUpload } from '../../../../helpers/HandleUpload';
import us from '../../../../assets/images/flags/us.jpg'
import ToastHandle from '../../../../helpers/ToastMessage';
import { forgotPassword, generateOtpAction, getCities2Action, getCitiesAction, stateEmptydAction, updateClinicAction, verifyOtpAction } from '../../../../redux/actions';
import Spinner from '../../../../constants/Spinner';
import { encryptMessage } from '../../../../cryptoUtils';
import { handleFirstSpace } from '../../../../helpers/noBeginningSpace';
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked, MdVerified } from 'react-icons/md';
import { GoAlert } from 'react-icons/go';
import { IoMdClose } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { otpVerification } from '../../../../helpers/api/apiEndpoints';
import EmailChangeModal from './emailChangeModal';

const Clinic = ({ id }) => {
    const {
        register,
        handleSubmit,
        setValue, watch, getValues,
        formState: { errors }, clearErrors
    } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const stateGeoLocation = watch('stateName');
    const logoFileInputRef = useRef(null);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [focused, setFocused] = useState(false);
    const [mailingFocused, setMailingFocused] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [mailingLatitude, setMailingLatitude] = useState(null);
    const [mailingLongitude, setMailingLongitude] = useState(null);
    const [citySearch, setCitySearch] = useState(null);
    const [stateToSelect, setStateToSelect] = useState(null);
    const [showReset, setShowReset] = useState(false);
    const [sameAsPrimary, setSameAsPrimary] = useState(false);
    const [statusModal, setStatusModal] = useState(false);
    const [statusData, setStatusData] = useState(null);
    const store = useSelector((state) => state);
    const clinicData = store?.getClinicByIdReducer?.data?.clinic;
    const clinicTypeData = store?.getMastersDataReducer?.data?.clinicTypes;
    const statesData = store?.getStatesReducer?.data;
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;
    const cities2 = store?.getCitiesReducer?.cities2?.data?.cities;
    const cities = store?.getCitiesReducer?.data?.cities;
    const subClinics = store?.getClinicsByParentReducer?.data?.data;

    const [formDetails, setFormDetails] = useState({
        accreditationDetails: [{ name: '', number: '', url: null, fileName: '' }],
        stateDetails: [{ name: '', number: '', url: null, fileName: '' }],
    });
    const [posDetails, setPosDetails] = useState([
        { name: '', email: '', role: '', contact: '' }
    ])
    const [taxonomyCodes, setTaxonomyCodes] = useState([''])
    useEffect(() => {
        setFormDetails((prevDetails) => ({
            ...prevDetails,
            accreditationDetails: clinicData?.accreditationDetails?.length === 0 ? formDetails?.accreditationDetails : clinicData?.accreditationDetails || prevDetails.accreditationDetails,
            medicalDetails: clinicData?.medicalLicenses || prevDetails.medicalDetails,
            stateDetails: clinicData?.stateOfLicensing?.length === 0 ? formDetails?.stateDetails : clinicData?.accreditationDetails,
            // stateDetails: clinicData?.stateOfLicensing?.length === 0 ? formDetails?.stateDetails : clinicData?.accreditationDetails,
        }));
        setPosDetails(clinicData?.pos?.length === 0 ? posDetails : clinicData?.pos);

    }, [clinicData]);

    const setField = (key, value) => value && setValue(key, value);
    useEffect(() => {
        setField('clinicType', clinicData?.clinicType);
        // setField('contact', clinicData?.userId?.phone?.startsWith("+1")
        //     ? clinicData.userId.phone.substring(2)
        //     : clinicData?.userId?.phone);
        setField(
            'contact',
            clinicData?.userId?.phone
                ? clinicData.userId.phone
                    .replace(/^\+1/, '') // Remove the "+1" prefix
                    .replace(/\D/g, '') // Remove all non-numeric characters
                    .replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) =>
                        p3 ? `(${p1})${p2}-${p3}` : `(${p1})${p2}` // Format dynamically as (XXX)XXX-XXXX
                    )
                : ''
        );
        setField('name', clinicData?.name);
        setField('taxId', `${clinicData?.taxIdOrEIN?.slice(0, 2)}-${clinicData?.taxIdOrEIN?.slice(2, 9)}`);
        setField('speciality', clinicData?.practiceSpecialty)
        setField('npi', clinicData?.npiNumber);
        setField('email', clinicData?.userId?.email);
        setField('address', clinicData?.userId?.primaryAddress?.address);
        setField('mailingAddress', clinicData?.userId?.mailingAddress?.address);
        setField('street', clinicData?.userId?.primaryAddress?.street);
        setField('zip', clinicData?.userId?.primaryAddress?.zip);
        setSameAsPrimary(clinicData?.userId?.isPrimaryAndMailingAddressSame);
        setField('stateName', clinicData?.userId?.primaryAddress?.state?._id)
        setField('mailingStateName', clinicData?.userId?.mailingAddress?.state?._id)
        setField('medicaid', clinicData?.medicaidNumber)
        setField('medicare', clinicData?.medicareNumber)
        setField('clia', clinicData?.CLIA_Number)
        if (clinicData?.taxonomyCodes?.length === 0) {
            setTaxonomyCodes([''])
        } else {
            setTaxonomyCodes(clinicData?.taxonomyCodes);
            clinicData?.taxonomyCodes?.forEach((code, index) => {
                setValue(`taxonomyCode[${index}]`, code);
            });
            // setTaxonomyCodes(clinicData?.taxonomyCodes)
        }
        // alert(clinicData?.taxonomyCodes?.length)
        if (clinicData?.userId?.primaryAddress?.city) {
            dispatch(getCitiesAction({ state_code: clinicData?.userId?.primaryAddress?.state?.id, name: clinicData?.userId?.primaryAddress?.city?.name, limit: '', skip: '' }))
        }
        if (clinicData?.userId?.mailingAddress?.city) {
            dispatch(getCities2Action({ state_code: clinicData?.userId?.mailingAddress?.state?.id, name: clinicData?.userId?.mailingAddress?.city?.name, limit: '', skip: '' }))
        }
        setLongitude(clinicData?.userId?.primaryAddress?.longitude)
        setLatitude(clinicData?.userId?.primaryAddress?.latitude);
        setMailingLongitude(clinicData?.userId?.mailingAddress?.longitude)
        setMailingLatitude(clinicData?.userId?.mailingAddress?.latitude);

        if (clinicData?.logo) {
            setLogoName(clinicData?.logo?.fileName)
        }


    }, [clinicData, statesData, setValue]);
    const handleLogoClick = () => {
        if (logoFileInputRef.current) {
            logoFileInputRef.current.click();
        }
    };
    const closeOtpModal = () => {
        setShowOtpModal(false)
    }
    const [logoUploading, setLogoUploading] = useState(false)
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setLogoUploading);
            setLogo(url);
            setLogoName(selectedFile?.name);

            // Update the form value for validation purposes
            setValue('logo', url, { shouldValidate: true });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    const handleInputChange = (e, field, type, index) => {
        const value = e.target.value;
        // if (type === 'accreditationDetails' && /\s/.test(value)
        // ) {
        //     return;
        // }
        setFormDetails((prevDetails) => {
            const updatedDetails = { ...prevDetails };
            updatedDetails[type][index] = {
                ...updatedDetails[type][index],
                [field]: value,
            };
            return updatedDetails;
        });
    };
    const [accreditationUploading, setAccreditationUploading] = useState(false);
    const [stateUploading, setStateUploading] = useState(false);
    const handleFileUpload = async (e, type, index) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, type === 'accreditationDetails' ? setAccreditationUploading : setStateUploading);
            setFormDetails((prevDetails) => {
                const updatedDetails = { ...prevDetails };
                updatedDetails[type][index] = {
                    ...updatedDetails[type][index],
                    url: url?.url?.split('?')[0],
                    fileName: selectedFile?.name,
                };
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    const handleAddField = (type) => {
        setFormDetails((prevDetails) => ({
            ...prevDetails,
            [type]: [...prevDetails[type], { name: '', number: '', url: null, fileName: '' }],
        }));
    };

    const handleRemoveField = (type, index) => {
        setFormDetails((prevDetails) => ({
            ...prevDetails,
            [type]: prevDetails[type].filter((_, i) => i !== index),
        }));
    };

    const handleStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0]; // Get the selected <option>
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        dispatch(getCitiesAction({ state_code: key?.id, name: '', limit: 25, skip: '' }))
    };

    const handleMailingStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0]; // Get the selected <option>
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        dispatch(getCities2Action({ state_code: key?.id, name: '', limit: 25, skip: '' }))
    };


    const handleCitySelection = (e) => {

    };

    const onSubmit = (data) => {
        const newPayload = {
            userId: clinicData?.userId?._id,
            clinicId: clinicData?._id,
            ...(data?.name ? { name: data?.name } : ''),
            // name: data?.name || clinicData?.name, // Clinic name
            ...(data?.email.toLowerCase() !== clinicData?.userId?.email.toLowerCase() && {
                email: data?.email.toLowerCase() || clinicData?.userId?.email.toLowerCase(),
            }),
            phone: '+1' + data?.contact?.replace(/\D/g, '') || '+1' + clinicData?.userId?.phone, // Phone number
            clinicType: data?.clinicType || clinicData?.clinicType, // Clinic Type
            taxIdOrEIN: data?.taxId?.replace(/\D/g, '') || clinicData?.taxIdOrEIN?.replace(/\D/g, ''), // Tax ID/EIN
            npiNumber: data?.npi || clinicData?.npiNumber,
            stateOfLicensing: formDetails.stateDetails || clinicData?.stateOfLicensing, // State Licensing
            accreditationDetails: formDetails.accreditationDetails || clinicData?.accreditationDetails,
            taxonomyCodes: taxonomyCodes.filter(code => code), // Filter out empty taxonomy codes
            ...(data?.medicaid ? { medicaidNumber: data?.medicaid } : {}),
            ...(data?.medicare ? { medicareNumber: data?.medicare } : {}),
            logo: {
                url: logo?.url.split('?')[0],
                fileName: logoName
            },
            ...(data?.clia ? { CLIA_Number: data?.clia } : {}),
            id: id || clinicData?._id, // Clinic ID
            primaryAddress: {
                ...(data?.address ? { address: data?.address } : {}),
                ...(data?.city ? { city: data?.city } : ''),
                ...(data?.stateName ? { state: data?.stateName } : ''),
                ...(data?.street ? { street: data?.street } : ''),
                ...(data?.zip ? { zip: data?.zip } : ''),
                ...(latitude ? { latitude: latitude } : ''),
                ...(longitude ? { longitude: longitude } : ''),
            },
            isPrimaryAndMailingAddressSame: sameAsPrimary,
            mailingAddress: sameAsPrimary ?
                {
                    ...(data?.address ? { address: data?.address } : {}),
                    ...(data?.city ? { city: data?.city } : ''),
                    ...(data?.stateName ? { state: data?.stateName } : ''),
                    ...(data?.street ? { street: data?.street } : ''),
                    ...(data?.zip ? { zip: data?.zip } : ''),
                    ...(latitude ? { latitude: latitude } : ''),
                    ...(longitude ? { longitude: longitude } : ''),
                }
                : {
                    ...(data?.mailingAddress ? { address: data?.mailingAddress } : {}),
                    ...(data?.mailingCity ? { city: data?.mailingCity } : ''),
                    ...(data?.mailingStateName ? { state: data?.mailingStateName } : ''),
                    ...(data?.mailingStreet ? { street: data?.mailingStreet } : ''),
                    ...(data?.mailingZip ? { zip: data?.mailingZip } : ''),
                    ...(mailingLatitude ? { latitude: mailingLatitude } : ''),
                    ...(mailingLongitude ? { longitude: mailingLongitude } : ''),
                },
            practiceSpecialty: data?.speciality,
            pos: posDetails,
        };
        // console.log(newPayload, 'payllll')
        dispatch(updateClinicAction({ key: encryptMessage(newPayload) }));
    };

    const handleAddPOS = () => {
        const isIncomplete = posDetails.some(
            (pos) =>
                !pos.name || !pos.role || !pos.contact || !pos.email
        );
        if (isIncomplete) {
            ToastHandle('Please fill all the fields before adding a new one', 'danger');
            return;
        }
        setPosDetails([
            ...posDetails,
            { name: '', email: '', role: null, contact: '' }
        ]);
    };
    const handleRemovePOS = (index) => {
        setPosDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            return updatedDetails;
        });
    };

    const handlePOSInputChange = (e, field, index) => {
        const value = e.target.value;
        setPosDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value
            };
            return updatedDetails;
        });
    };

    const [searchedLocations, setSearchedLocations] = useState(null)
    const [searchedMailingLocations, setSearchedMailingLocations] = useState(null)
    const getGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed';
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                return data; // Return the geocoding data
            } catch (error) {
                console.error("Failed to fetch geocode data:", error);
                return null; // Return null in case of error
            }
        }
        fetchGeocodeData(addressToSearch)
            .then((data) => {
                if (data) {
                    setSearchedLocations(data?.results)
                } else {
                    console.error("No data returned.");
                }
            });
    }
    const getMailingGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed';
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                return data; // Return the geocoding data
            } catch (error) {
                console.error("Failed to fetch geocode data:", error);
                return null; // Return null in case of error
            }
        }
        fetchGeocodeData(addressToSearch)
            .then((data) => {
                if (data) {
                    setSearchedMailingLocations(data?.results)
                } else {
                    console.error("No data returned.");
                }
            });
    }
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedMailingLocation, setSelectedMailingLocation] = useState(null);
    useEffect(() => {
        if (selectedLocation) {
            setLatitude(selectedLocation?.bounds?.southwest?.lat);
            setLongitude(selectedLocation?.bounds?.southwest?.lng);
            setValue('address', selectedLocation?.formatted)
            const stateId = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?.id;
            const selectedState = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?._id;
            setValue('stateName', selectedState)
            const countyName = selectedLocation?.components?.county;
            dispatch(getCitiesAction({ state_code: stateId, name: countyName, limit: '', skip: '' }))
        }
        if (selectedMailingLocation) {
            setMailingLatitude(selectedMailingLocation?.bounds?.southwest?.lat);
            setMailingLongitude(selectedMailingLocation?.bounds?.southwest?.lng);
            setValue('mailingAddress', selectedMailingLocation?.formatted)
            const stateId = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedMailingLocation?.components?.state_code)?.id;
            const selectedState = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedMailingLocation?.components?.state_code)?._id;
            setValue('mailingStateName', selectedState)
            const countyName = selectedMailingLocation?.components?.county;
            dispatch(getCities2Action({ state_code: stateId, name: countyName, limit: '', skip: '' }))
        }
    }, [selectedLocation, selectedMailingLocation, setValue, statesData, dispatch])
    useEffect(() => {
        if (cities1) {
            const selectedCounty = cities1 && cities1.find((data) => data?.name === selectedLocation?.components?.county || clinicData?.userId?.primaryAddress?.city?.name)?._id;
            setValue('city', selectedCounty)
        }
        if (cities2) {
            const selectedCounty = cities2 && cities2.find((data) => data?.name === selectedLocation?.components?.county || clinicData?.userId?.mailingAddress?.city?.name)?._id;
            setValue('mailingCity', selectedCounty)
        }
    }, [cities1, cities2])

    const [selectedStates, setSelectedStates] = useState([]);
    const [statesMenu, setStatesMenu] = useState(false);
    useEffect(() => {
        if (clinicData?.stateOfLicensing) {
            const initialSelectedStates = clinicData.stateOfLicensing.map((item) => item.name);
            setSelectedStates(initialSelectedStates);

            setFormDetails((prevDetails) => ({
                ...prevDetails,
                stateDetails: clinicData.stateOfLicensing.map((item) => ({
                    name: item.name,
                    number: item.number || '',
                    url: item.url || null,
                    fileName: item.fileName || '',
                    _id: item._id || null,
                })),
            }));
        }
    }, [clinicData]);

    const handleCheckboxChange = (stateName) => {
        setSelectedStates((prev) => {
            const updatedStates = prev.includes(stateName)
                ? prev.filter((name) => name !== stateName) // Remove unchecked state
                : [...prev, stateName]; // Add checked state

            // Sync stateDetails in formDetails with selectedStates
            setFormDetails((prevDetails) => {
                const updatedStateDetails = updatedStates.map((state) =>
                    prevDetails.stateDetails.find((detail) => detail.name === state) || {
                        name: state,
                        number: '',
                        url: null,
                        fileName: '',
                    }
                );

                return {
                    ...prevDetails,
                    stateDetails: updatedStateDetails,
                };
            });

            return updatedStates;
        });
    };

    const menuRef = useRef(null);
    const containerRef = useRef(null);

    // Close menu if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setStatesMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleAddTaxonomy = () => {
        // Check if the last field has a value
        const lastCode = taxonomyCodes[taxonomyCodes.length - 1];

        if (lastCode) {
            // Filter out any empty values from the array
            const validCodes = taxonomyCodes.filter((code) => code.trim() !== '');
            setTaxonomyCodes([...validCodes, '']);
            // setAddFieldError(false); // Clear error if the new field is added successfully
        } else {
            ToastHandle('Please complete the current Taxonomy Code field before adding another.', 'danger')
        }
    };
    const handleRemoveTaxonomy = (index) => {
        setTaxonomyCodes((prev) => {
            const updatedCodes = prev.filter((_, i) => i !== index);
            return updatedCodes.length > 0 ? updatedCodes : ['']; // Ensure at least one field remains
        });

    };
    // Function to handle field changes
    const handleTaxonomyChange = (index, value) => {
        const updatedCodes = [...taxonomyCodes];
        updatedCodes[index] = value;
        setTaxonomyCodes(updatedCodes);
    };

    const closeResetModal = () => {
        setShowReset(false);
    }


    const sendResetMail = (data) => {
        const payload = {
            email: data?.resetEmail
        }
        dispatch(forgotPassword({ key: encryptMessage(payload) }))
    }


    const handleOpenStatusModal = (data) => {
        setStatusModal(true);
        setStatusData(data);
    }
    const closeStatusModal = () => {
        setStatusModal(false);
    }
    const handleStatusUpdate = () => {
        const payload = {
            userId: statusData?.userId?._id,
            clinicId: statusData?._id,
            id: statusData?._id,
            status: !statusData?.status
        }
        dispatch(updateClinicAction({ key: encryptMessage(payload) }));
    }
    const updateSuccess = store?.updateClinicsReducer?.data?.status;

    useEffect(() => {
        if (updateSuccess === 200) {
            dispatch(stateEmptydAction())
            closeStatusModal();
        }
    }, [updateSuccess]);


    return (
        <>
            <Form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    {/* Clinic Name Field */}
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className="mb-1">
                                Practice Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                placeholder="Enter clinic name"
                                {...register('name', {
                                    required: 'This field is required',
                                    validate: (value) =>
                                        !value.startsWith(' ') || 'First character cannot be a space',
                                })}
                            // onKeyPress={handleFirstSpace}
                            />
                            {errors.name && <span className="text-danger">{errors.name.message}</span>}
                        </Form.Group>

                    </Col>

                    {/* Clinic Type Field */}
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className="mb-1">Practice Type <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                {...register('clinicType', { required: 'This field is required' })}
                            >
                                <option value="">Select clinic type</option>
                                {clinicTypeData?.map((data) => (
                                    <option key={data?._id} value={data?.name}>{data?.name}</option>
                                ))}
                            </Form.Select>
                            {errors.clinicType && <span className="text-danger">{errors.clinicType.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2 position-relative">
                            <Form.Label className='mb-1'>Email ID <i onClick={() => {
                                setShowOtpModal(true);
                            }} className="mdi mdi-square-edit-outline plusicon cursor-pointer"></i></Form.Label>
                            <Form.Control
                                readOnly
                                type="text"
                                {...register('email', {
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
                                        message: 'Please enter a valid email address'
                                    }
                                })}
                                placeholder="Email ID"
                            />
                            <span
                                style={{ right: "2%", top: '48%' }}
                                className={`${clinicData?.userId?.verified_email ? 'text-success position-absolute fs-4' : 'd-none'}`}>
                                <MdVerified />
                            </span>
                            {errors.email && <span className="text-danger">{errors.email.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Tax ID / EIN</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('taxId', {
                                    pattern: {
                                        value: /^\d{2}-\d{7}$/, // Accepts only the hyphenated format XX-XXXXXXX
                                        message: 'Tax ID / EIN must be in the format XX-XXXXXXX',
                                    },
                                    minLength: {
                                        value: 10,
                                        message: 'Tax ID / EIN must be exactly 10 characters long',
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: 'Tax ID / EIN must be exactly 10 characters long',
                                    },
                                })}
                                // defaultValue={updatePage ? clinicDataToUpdate?.taxIdOrEIN : ''}
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key) && event.key !== '-') {
                                        event.preventDefault(); // Allow only numbers and the hyphen
                                    }
                                }}
                                onChange={(e) => {
                                    let rawValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                    let formattedValue = '';
                                    if (rawValue.length > 2) {
                                        formattedValue = `${rawValue.slice(0, 2)}-${rawValue.slice(2, 9)}`;
                                    } else {
                                        formattedValue = rawValue;
                                    }
                                    e.target.value = formattedValue;
                                }}
                                maxLength={10}
                                placeholder="Tax ID / EIN" />
                            {errors.taxId && <span className="text-danger">{errors.taxId.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-0 position-relative">
                            <Form.Label className='mb-1'>Contact Person <span className='text-danger'>*</span></Form.Label>
                            <InputGroup>
                                <InputGroup.Text className='ps-3 pe-1 fw-bold text-black'>&nbsp;&nbsp;+1</InputGroup.Text>
                                <Form.Control
                                    type="tel"
                                    {...register('contact', {
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
                                        clearErrors('contact'); // Clear validation errors
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
                            <div
                                className='position-absolute' style={{ top: '52%', left: '1%' }}
                            >
                                <img
                                    src={us}
                                    alt="country code flag"
                                    width={20} />
                            </div>


                        </Form.Group>
                        {errors.contact && <span className="text-danger">{errors.contact.message}</span>}
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>NPI Type 2 Number</Form.Label>
                            <Form.Control
                                defaultValue={clinicData?.npiNumber}
                                type="text"
                                {...register('npi', {
                                    minLength: {
                                        value: 10,
                                        message: 'NPI must be at least 10 characters long', // Error message
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: 'NPI cannot exceed 10 characters', // Error message
                                    },
                                    pattern: {
                                        value: /^[0-9]+$/, // Pattern for numbers only
                                        message: 'NPI must contain numbers only', // Error message
                                    },
                                })}
                                maxLength={10}
                                onKeyPress={(event) => handleFirstSpace(event, 0)}
                                placeholder="NPI Number" />
                            {errors.npi && <span className="text-danger">{errors.npi.message}</span>}
                        </Form.Group>
                    </Col>

                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Practice Speciality Description</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('speciality', {
                                    validate: (value) =>
                                        !value.startsWith(' ') || 'First character cannot be a space',
                                })}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.startsWith(' ')) {
                                        e.target.value = value.trimStart(); // Prevent spaces at the start
                                    }
                                    clearErrors('speciality')
                                }}
                                placeholder="Practice speciality"
                                onKeyPress={handleFirstSpace}
                            />

                            {errors.speciality && <span className="text-danger">{errors.speciality.message}</span>}

                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>CLIA  Number</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('clia', {
                                    minLength: {
                                        value: 10,
                                        message: 'CLIA number must be at least 10 characters long', // Error message
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: 'CLIA number cannot exceed 10 characters', // Error message
                                    },
                                    pattern: {
                                        value: /^[A-Z0-9]{2}D[0-9]{7}$/, // Ensures the CLIA number matches the specific format
                                        message: 'CLIA number must be in the format XXDXXXXXXX, where X is alphanumeric and the rest are digits',
                                    },
                                })}
                                placeholder="CLIA Number"
                                maxLength={10}
                                onKeyPress={(event) => handleFirstSpace(event, 0)}
                            />
                            {errors.clia && <span className="text-danger">{errors.clia.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Medicare Number</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('medicare', {
                                    minLength: {
                                        value: 6,
                                        message: 'Medicare number must be at least 6 characters long', // Error message
                                    },
                                })}
                                placeholder="Medicare Number"
                                maxLength={12}
                                // onChange={(e) => setResetEmail({ ...resetEmail, npiNumber: e.target.value })}
                                onKeyPress={(event) => handleFirstSpace(event, 0)}
                            />
                            {errors.medicare && <span className="text-danger">{errors.medicare.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Medicaid Number</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('medicaid', {
                                    minLength: {
                                        value: 10,
                                        message: 'Medicaid number must be at least 10 characters long',
                                    },
                                })}
                                placeholder="Medicaid Number"
                                maxLength={10}
                                // onChange={(e) => setResetEmail({ ...resetEmail, npiNumber: e.target.value })}
                                onKeyPress={(event) => handleFirstSpace(event, 0)}
                            />
                            {errors.medicaid && <span className="text-danger">{errors.medicaid.message}</span>}
                        </Form.Group>
                    </Col>
                    {taxonomyCodes && taxonomyCodes.map((code, index) => (
                        <Col sm={6} key={index}>
                            <Form.Group className="mb-2 position-relative">
                                <Form.Label className="mb-1">
                                    Taxonomy Code(s)
                                    {index === taxonomyCodes.length - 1 && (
                                        <span
                                            className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                            onClick={handleAddTaxonomy}
                                        >
                                        </span>
                                    )}
                                    {/* <span className="text-danger">*</span> */}
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register(`taxonomyCode[${index}]`, {
                                        // required: 'This field is required.'
                                    })}
                                    value={code}
                                    placeholder="Taxonomy Code"
                                    maxLength={10}
                                    onKeyPress={(event) => handleFirstSpace(event, index)}
                                    onChange={(e) => {
                                        handleTaxonomyChange(index, e.target.value)
                                        clearErrors(`taxonomyCode[${index}]`)
                                    }}
                                />
                                <span
                                    style={{ top: '55%', right: '1%' }}
                                    onClick={() => handleRemoveTaxonomy(index)} className={`${taxonomyCodes?.length === 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}></span>
                                {errors.taxonomyCode?.[index] && (
                                    <span className="text-danger">{errors.taxonomyCode[index].message}</span>
                                )}
                            </Form.Group>
                        </Col>
                    ))}
                    <Col sm={6} className='mb-2 d-flex flex-column position-relative'>
                        <Form.Label>Upload Logo</Form.Label>
                        <div onClick={handleLogoClick}
                            className={`custom-file-upload justify-content-between cursor-pointer ${logoName || logoUploading ? 'form-control' : 'custom-form-fields'}`}>
                            {logoUploading
                                ? 'Uploading...'
                                : logoName
                                    ? logoName
                                    : 'Upload Logo'}
                            <p className='mb-0'><FiDownloadCloud /></p>
                        </div>
                        <Form.Control
                            type="file"
                            className="rounded-circle"
                            style={{ display: 'none' }}
                            // {...register('logoimage', { required: 'This field is required' })}
                            ref={logoFileInputRef}
                            accept=".png, .jpg, .jpeg, .svg" // Allow only specific file types
                            onChange={handleFileChange}
                        />
                        {/* {errors.logoimage && <span className="text-danger">{errors.logoimage.message}</span>} */}
                    </Col>
                    <hr />
                    {/* Dynamic Fields Section */}
                    {['accreditationDetails', 'stateDetails'].map((type) => (
                        <React.Fragment key={type}>
                            <Col sm={12} className={`${type === 'stateDetails' ? 'position-relative' : ''}`}>
                                <Form.Label ref={type === 'stateDetails' ? containerRef : null}>
                                    {type === 'accreditationDetails'
                                        ? 'Accreditation Details'
                                        : type === 'stateDetails'
                                            ? 'State of Licensure'
                                            : ''}
                                    <span
                                        onClick={() => {
                                            if (type === 'accreditationDetails') {
                                                const allFieldsFilled = formDetails[type].every(item => item.name && item.number && item.url);
                                                if (!allFieldsFilled) {
                                                    ToastHandle('Please fill all the fields before adding a new one', 'danger');
                                                    return;  // Prevent adding a new field
                                                }
                                                handleAddField(type);  // Add new field if validation passes
                                            } else if (type === 'stateDetails') {
                                                setStatesMenu(!statesMenu)
                                            }
                                        }}
                                        className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                    >
                                        {/* Add Icon */}
                                    </span>
                                    {type === 'stateDetails' && (
                                        <div
                                            ref={menuRef}
                                            className={`scroll-container ${statesMenu ? '' : 'd-none'} bg-white border border-secondary position-absolute ps-1 py-1`}
                                            style={{ height: '14rem', width: '12em', zIndex: '111' }}
                                        >
                                            {/* <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}> */}
                                            {statesData?.states?.map((data, index) => (
                                                <div className='d-flex align-items-center px-1' key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }} onClick={() => handleCheckboxChange(data?.name)}
                                                >
                                                    {selectedStates.includes(data?.name) ?
                                                        <MdOutlineRadioButtonChecked />
                                                        :
                                                        <MdOutlineRadioButtonUnchecked />
                                                    }
                                                    <span className='ps-1'>
                                                        {data?.name}
                                                    </span>
                                                </div>
                                            ))}
                                            {/* </ul> */}
                                        </div>
                                    )}

                                </Form.Label>
                            </Col>
                            {formDetails[type] && formDetails[type].map((item, index) => (
                                <React.Fragment key={index}>
                                    {type === 'stateDetails' ? (
                                        <Col sm={4}>
                                            <Form.Control
                                                type="text"
                                                value={item?.name}
                                                placeholder="Name"
                                                readOnly
                                                onChange={(e) => handleInputChange(e, 'name', type, index)}
                                            />
                                        </Col>
                                    ) : (
                                        <Col sm={4}>
                                            <Form.Control
                                                type="text"
                                                value={item?.name}
                                                placeholder="Name"
                                                onChange={(e) => handleInputChange(e, 'name', type, index)}
                                            />
                                        </Col>
                                    )}
                                    <Col sm={4}>
                                        <Form.Control
                                            type="text"
                                            value={item.number}
                                            placeholder="Document Number"
                                            onKeyPress={(event) => {
                                                if (type !== 'accreditationDetails')
                                                    handleFirstSpace(event, 0)
                                            }}
                                            onChange={(e) => handleInputChange(e, 'number', type, index)}
                                        />
                                    </Col>
                                    <Col sm={4} className="mb-2 position-relative">
                                        <div
                                            onClick={() => document.getElementById(`fileInput-${type}-${index}`).click()}
                                            className={`custom-file-upload justify-content-between cursor-pointer ${item.fileName || accreditationUploading || stateUploading ? 'form-control' : 'custom-form-fields'}`}
                                        >
                                            {/* {item.fileName ? item.fileName?.slice(0, 35) + '...' : 'Upload Document'} */}
                                            {(type === 'accreditationDetails' && accreditationUploading) ||
                                                (type === 'stateDetails' && stateUploading)
                                                ? 'Uploading...'
                                                : item.fileName
                                                    ? item.fileName.slice(0, 35) + '...'
                                                    : 'Upload Document'}
                                            <p className="mb-0"><FiDownloadCloud /></p>
                                        </div>
                                        <Form.Control
                                            id={`fileInput-${type}-${index}`}
                                            type="file"
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleFileUpload(e, type, index)}
                                        />

                                        <span
                                            onClick={() => handleRemoveField(type, index)}
                                            className={`${formDetails[type].length > 1 ? '' : 'd-none'} uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}
                                            style={{ right: '-0.5%', top: '20%', zIndex: '111' }}
                                        >
                                            {/* Remove Icon */}
                                        </span>
                                    </Col>
                                </React.Fragment>
                            ))}
                            <hr />
                        </React.Fragment>
                    ))}
                    <hr />

                    <Col sm={12}>
                        <Row>
                            <Col sm={12} className='mb-2'>
                                <span className='text-black fw-semibold form-label'>Address Details</span>
                            </Col>
                            <Col sm={6}>
                                <Row className='position-relative'>
                                    <Col sm={12}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Address</Form.Label>
                                            <div style={{ position: 'relative' }}>
                                                <Form.Control
                                                    type="text"
                                                    // defaultValue={updatePage ? clinicDataToUpdate?.address?.address1 : ''}
                                                    {...register('address')}
                                                    onChange={(e) => {
                                                        getGeolocation(e);
                                                        setFocused(true); // Open dropdown on input
                                                    }}
                                                    onFocus={() => setFocused(true)} // Open dropdown when the field is focused
                                                    onBlur={() => {
                                                        setTimeout(() => setFocused(false), 200); // Delay to allow selection before hiding dropdown
                                                    }}
                                                    placeholder="Search for address"
                                                    autoComplete="off"
                                                />
                                                {/* Dropdown suggestions */}
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
                                                    className={`scroll-container hover-bg-change ${searchedLocations?.length === 0 || !focused ? 'd-none' : ''}`}
                                                >
                                                    {searchedLocations?.map((data, index) => (
                                                        <p
                                                            key={index}
                                                            onClick={() => {
                                                                setSelectedLocation(data);
                                                                setFocused(false); // Close dropdown after selection
                                                            }}
                                                            style={{
                                                                margin: 0,
                                                                padding: '8px 12px',
                                                                cursor: 'pointer',
                                                            }}
                                                            className="hover-bg-change text-black"
                                                        >
                                                            {data?.formatted}
                                                        </p>
                                                    ))}
                                                    {searchedLocations?.length === 0 && <p className="text-muted px-2 py-1">No results found</p>}
                                                </div>
                                            </div>
                                            {errors.address && <span className="text-danger">{errors.address.message}</span>}
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Latitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                defaultValue={latitude}
                                                placeholder="Latitude"
                                            />
                                            {/* {errors.street && <span className="text-danger">{errors.street.message}</span>} */}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Longitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                defaultValue={longitude}
                                                placeholder="Longitude" />
                                            {/* {errors.street && <span className="text-danger">{errors.street.message}</span>} */}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1' >State</Form.Label>
                                            <Form.Select
                                                {...register('stateName')}
                                                onChange={(e) => handleStateSelection(e)}
                                            >
                                                <option value=''>State</option>
                                                {statesData?.states?.map((data) => (
                                                    <option
                                                        key={data?.id} // Unique key for each option
                                                        data-key={JSON.stringify({ id: data?.id, _id: data?._id })} // Store the key as a data attribute
                                                        value={data?._id}
                                                    >
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>

                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>City</Form.Label>
                                            {/* {
                                                store?.getCitiesReducer?.loading ?
                                                    <Row>
                                                        <Col sm={12}>
                                                            <Spinner className='fs-5' />
                                                        </Col>
                                                    </Row>
                                                    : */}
                                            <Form.Select
                                                disabled={store?.getCitiesReducer?.loading}
                                                {...register('city')}
                                                onChange={(e) => handleCitySelection(e)}
                                            >
                                                <option value='' >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                {cities1?.map((data) => (
                                                    <option data-key={JSON.stringify({ _id: data?._id, latitude: data?.latitude, longitude: data?.longitude })} key={data?._id} value={data?._id}>
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {/* } */}
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Street</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register('street')}
                                                onKeyPress={handleFirstSpace}
                                                placeholder="Street" />
                                            {/* {errors.street && <span className="text-danger">{errors.street.message}</span>} */}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Zip</Form.Label>
                                            <Form.Control
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
                                            {errors.zip && <span className="text-danger">{errors.zip.message}</span>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <hr />
                    <Col sm={12}>
                        <Row>
                            <Col sm={12} className='mb-2'>
                                <span className='text-black fw-semibold form-label'>Mailing Address</span>
                                <Form.Check
                                    type="checkbox"
                                    label="Same as Primary Address"
                                    checked={sameAsPrimary}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSameAsPrimary(true);
                                            setValue('mailingAddress', getValues('address'));
                                            setValue('mailingZip', getValues('zip'));
                                            setValue('mailingStreet', getValues('street'));
                                            setMailingLatitude(latitude);
                                            setMailingLongitude(longitude);
                                        } else {
                                            setSameAsPrimary(false)
                                            setValue('mailingAddress', '');
                                            setValue('mailingZip', '');
                                            setValue('mailingStreet', '');
                                            setMailingLatitude(null);
                                            setMailingLongitude(null);
                                        }
                                    }}
                                />
                            </Col>
                            <Col sm={6}>
                                <Row className='position-relative'>
                                    <Col sm={12}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Address</Form.Label>
                                            <div style={{ position: 'relative' }}>
                                                <Form.Control
                                                    type="text"
                                                    // defaultValue={updatePage ? clinicDataToUpdate?.address?.address1 : ''}
                                                    {...register('mailingAddress')}
                                                    onChange={(e) => {
                                                        getMailingGeolocation(e);
                                                        setMailingFocused(true); // Open dropdown on input
                                                    }}
                                                    onFocus={() => setMailingFocused(true)} // Open dropdown when the field is focused
                                                    onBlur={() => {
                                                        setTimeout(() => setMailingFocused(false), 200); // Delay to allow selection before hiding dropdown
                                                    }}
                                                    placeholder="Search for address"
                                                    autoComplete="off"
                                                    readOnly={sameAsPrimary}
                                                />
                                                {/* Dropdown suggestions */}
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
                                                    className={`scroll-container hover-bg-change ${searchedMailingLocations?.length === 0 || !mailingFocused ? 'd-none' : ''}`}
                                                >
                                                    {searchedMailingLocations?.map((data, index) => (
                                                        <p
                                                            key={index}
                                                            onClick={() => {
                                                                setSelectedMailingLocation(data);
                                                                setMailingFocused(false); // Close dropdown after selection
                                                            }}
                                                            style={{
                                                                margin: 0,
                                                                padding: '8px 12px',
                                                                cursor: 'pointer',
                                                            }}
                                                            className="hover-bg-change text-black"
                                                        >
                                                            {data?.formatted}
                                                        </p>
                                                    ))}
                                                    {searchedMailingLocations?.length === 0 && <p className="text-muted px-2 py-1">No results found</p>}
                                                </div>
                                            </div>
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Latitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                readOnly={sameAsPrimary}
                                                defaultValue={mailingLatitude}
                                                placeholder="Latitude"
                                            />
                                            {/* {errors.street && <span className="text-danger">{errors.street.message}</span>} */}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Longitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                readOnly={sameAsPrimary}
                                                defaultValue={mailingLongitude}
                                                placeholder="Longitude" />
                                            {/* {errors.street && <span className="text-danger">{errors.street.message}</span>} */}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1' >State</Form.Label>
                                            <Form.Select
                                                {...register('mailingStateName')}
                                                onChange={(e) => handleMailingStateSelection(e)}
                                                disabled={sameAsPrimary}
                                            >
                                                <option value=''>State</option>
                                                {statesData?.states?.map((data) => (
                                                    <option
                                                        key={data?.id} // Unique key for each option
                                                        data-key={JSON.stringify({ id: data?.id, _id: data?._id })} // Store the key as a data attribute
                                                        value={data?._id}
                                                    >
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>

                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>City</Form.Label>
                                            <Form.Select
                                                disabled={store?.getCitiesReducer?.loading || sameAsPrimary}
                                                {...register('mailingCity')}
                                                onChange={(e) => handleCitySelection(e)}
                                            >
                                                <option value='' >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                {cities2?.map((data) => (
                                                    <option data-key={JSON.stringify({ _id: data?._id, latitude: data?.latitude, longitude: data?.longitude })} key={data?._id} value={data?._id}>
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {/* } */}
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Street</Form.Label>
                                            <Form.Control
                                                type="text"
                                                readOnly={sameAsPrimary}
                                                {...register('mailingStreet')}
                                                onKeyPress={handleFirstSpace}
                                                placeholder="Street" />
                                            {/* {errors.street && <span className="text-danger">{errors.street.message}</span>} */}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Zip</Form.Label>
                                            <Form.Control
                                                type="text"
                                                readOnly={sameAsPrimary}
                                                {...register('mailingZip', {
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
                                            {errors.mailingZip && <span className="text-danger">{errors.mailingZip.message}</span>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <hr />
                    <Col sm={12}>
                        <Row>
                            <Col sm={12} className="mb-2">
                                <span className="text-black fw-semibold form-label  ">
                                    POC (Point of contact)
                                    <span
                                        onClick={handleAddPOS}
                                        className="plusicon ms-1 fs-5 uil-plus-circle fw-bold cursor-pointer">
                                    </span>
                                </span>
                            </Col>
                            {posDetails && posDetails?.map((data, index) => (
                                <React.Fragment key={index}>
                                    <Col sm={12} className="form-label">
                                        {'POS ' + `${index + 1}`}
                                        <span
                                            onClick={() => handleRemovePOS(index)}
                                            className={`${posDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer fs-5 fw-bold text-danger`}>
                                        </span>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Full Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register(`contactName_${index}`)}
                                                value={data.name || ''} // Ensure it defaults to an empty string
                                                onChange={(e) => {
                                                    clearErrors(`contactName_${index}`)
                                                    handlePOSInputChange(e, 'name', index)
                                                }}
                                                placeholder="Full Name"
                                            />
                                            {errors[`contactName_${index}`] && (
                                                <span className="text-danger">{errors[`contactName_${index}`].message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Contact Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={data.email || ''} // Ensure it defaults to an empty string
                                                {...register(`contactemail_${index}`, {
                                                    pattern: {
                                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
                                                        message: 'Please enter a valid email address'
                                                    }
                                                })}
                                                onChange={(e) => handlePOSInputChange(e, 'email', index)}
                                                placeholder="Contact Email"
                                            />
                                            {errors[`contactemail_${index}`] && (
                                                <span className="text-danger">{errors[`contactemail_${index}`].message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Job Title / Role</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={data.role || ''} // Ensure it defaults to an empty string
                                                placeholder="Job Title / Role"
                                                onChange={(e) => handlePOSInputChange(e, 'role', index)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2 position-relative">
                                            <Form.Label className="mb-1">Phone Number</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text className="ps-3 pe-1 fw-bold text-black">&nbsp;&nbsp;+1</InputGroup.Text>
                                                <Form.Control
                                                    type="tel"
                                                    value={data.contact || ''} // Ensure it defaults to an empty string
                                                    {...register(`pocContact_${index}`, {
                                                        pattern: {
                                                            value: /^[0-9]*$/,
                                                            message: 'Contact must be a number'
                                                        },
                                                        maxLength: {
                                                            value: 10,
                                                            message: 'Contact must not exceed 10 digits'
                                                        },
                                                        minLength: {
                                                            value: 9,
                                                            message: 'Contact must not be less than 9 digits'
                                                        }
                                                    })}
                                                    onChange={(e) => handlePOSInputChange(e, 'contact', index)}
                                                    placeholder="Phone Number"
                                                    maxLength={10}
                                                />
                                            </InputGroup>
                                            <div className="position-absolute" style={{ top: '52%', left: '1%' }}>
                                                <img src={us} alt="country code flag" width={20} />
                                            </div>
                                        </Form.Group>
                                        {errors[`pocContact_${index}`] && (
                                            <span className="text-danger pt-0">{errors[`pocContact_${index}`].message}</span>
                                        )}
                                    </Col>
                                </React.Fragment>
                            ))}
                        </Row>
                    </Col>
                </Row >
                <Row>
                    <Col className='d-flex gap-2 justify-content-end align-items-end'>
                        <Button className='custom-buttons' onClick={() => {
                            setShowReset(true)
                            setValue('resetEmail', clinicData?.userId?.email)
                        }}>
                            {store?.Auth?.loading ?
                                <Spinner color='white' className='spinner-border-sm' />
                                :
                                'Change Password'
                            }
                        </Button>
                        <Button className={`custom-buttons ${clinicData?.isParent === false ? 'd-none' : ''}`} onClick={() => {
                            navigate(`/apps/rcm/addclinic?clincid=${clinicData?._id}&userId=${clinicData?.userId?._id}`)
                        }}>
                            Add Multiple Practice
                        </Button>
                        <Button type='submit' disabled={store?.updateClinicsReducer?.loading} className="mt-3">
                            {store?.updateClinicsReducer?.loading ?
                                <Spinner color='white' className='spinner-border-sm' />
                                :
                                'Update'
                            }
                        </Button>
                    </Col>
                </Row>
            </Form >
            <Row className={`mt-2 ${clinicData?.isParent === false ? 'd-none' : ''}`}>
                <Col sm={12}>
                    <Table responsive className="table-centered table-responsive table-nowrap mb-0">
                        <thead className="text-white">
                            <tr>
                                <th className="text-white">S.No.</th>
                                <th className="text-white">PRACTICE NAME</th>
                                <th className="text-white">LOCATION</th>
                                <th className="text-white">PRACTICE TYPE</th>
                                <th className="text-white">SPECIALITY</th>
                                <th className="text-white">STATUS</th>
                                <th className="text-white">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store?.getClinicsByParentReducer?.loading ?
                                <tr>
                                    <td colSpan={7} className='text-center'>
                                        <Spinner />
                                    </td>
                                </tr>
                                :
                                subClinics?.length === 0 ?
                                    <tr>
                                        <td colSpan={7} className='text-center'>
                                            <h4> No Data Found</h4>
                                        </td>
                                    </tr>
                                    :
                                    subClinics?.map((data, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{data?.name}</td>
                                            <td>
                                                {(data?.userId?.primaryAddress?.city?.state_code || 'N/A') + ' / ' + (data?.userId?.primaryAddress?.city?.name || 'N/A')}
                                            </td>
                                            <td>{data?.clinicType}</td>
                                            <td>{data?.practiceSpecialty || 'N/A'}</td>
                                            <td>
                                                <Form.Switch
                                                    onClick={() => handleOpenStatusModal(data)}
                                                    checked={data?.status === true}
                                                />
                                            </td>
                                            <td>
                                                <Link to={`/apps/rcm/updateclinic?updateid=${data?._id}`} className="action-icon">
                                                    <i className="mdi mdi-square-edit-outline cursor-pointer"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Modal centered size='md' show={showReset} onHide={closeResetModal}>
                <Modal.Body>
                    <Row className=" mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">Change password</h4>
                        </Col>
                        <Col sm={1}>
                        </Col>
                    </Row>
                    <Form onSubmit={handleSubmit(sendResetMail)}>
                        <Row>
                            <Col md={12}
                                className='d-flex justify-content-center'>
                                <Form.Group
                                    className="mb-2 w-50">
                                    <Form.Control
                                        type="email"
                                        readOnly
                                        // defaultValue={mailId?.email}
                                        {...register('resetEmail')}
                                    />
                                    {errors.resetEmail && <span className="text-danger">{errors.resetEmail.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col sm={12} className='text-center'>
                                The practice will receive a reset password email at {clinicData?.userId?.email}.
                            </Col>
                            <Col sm={12} className='text-center mt-2' >
                                <Button type='submit' className='custom-buttons' >
                                    Send
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
            <EmailChangeModal show={showOtpModal} onClose={closeOtpModal} email={clinicData?.userId?.email} userId={clinicData?.userId?._id} />
            <Modal show={statusModal} centered size='md' >
                <Modal.Body>
                    <div>
                        <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                            <Col sm={1}></Col>
                            <Col sm={10}>
                                <h4 className="mb-0  d-flex align-items-center justify-content-center"><span className='text-danger'><GoAlert />&nbsp;</span>{statusData?.status === true ? 'Deactivate' : "Activate"} Clinic</h4>
                            </Col>
                            <Col sm={1}>
                                <IoMdClose className="fs-4 cursor-pointer" onClick={closeStatusModal} />
                            </Col>
                        </Row>
                        <Row className=''>
                            {statusData?.status === true ?
                                <Col sm={12}>
                                    <p className='mb-0'>
                                        Once this change is applied, please be aware that <strong>{statusData?.name}</strong> will:
                                    </p>
                                    <ul>
                                        <li>Lose access to
                                            their account and will not be able to log in.</li>
                                        <li>All plans associated with their account will be deactivated or canceled.</li>
                                        <li>Any services linked to the
                                            account will be suspended and they will not be able to make any changes to account settings or details.</li>
                                    </ul>
                                </Col>
                                :
                                <Col>
                                    After this {statusData?.name} will have full access to their account, plans, and services.
                                </Col>
                            }
                            <Modal.Footer className='d-flex justify-content-end gap-2'>
                                <Button className='custom-buttons' onClick={closeStatusModal}>
                                    Cancel
                                </Button>
                                <Button className='custom-buttons' disabled={store?.updateClinicsReducer?.loading} onClick={() => handleStatusUpdate()}>
                                    {store?.updateClinicsReducer?.loading ?
                                        <Spinner color='light' className='spinner-border-sm' />
                                        :
                                        statusData?.status === true ? 'Deactivate' : "Activate"
                                    }
                                </Button>
                            </Modal.Footer>
                        </Row>
                    </div>
                </Modal.Body>
            </Modal>
        </>

    );
};

export default Clinic;
