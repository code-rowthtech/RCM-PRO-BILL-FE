import React, { useEffect, useState, useRef } from 'react'
import { Col, Form, Row, Button, Table, InputGroup, Dropdown } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Spinner from '../../../../constants/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import us from '../../../../assets/images/flags/us.jpg'
import {
    createClinicAction, deleteClinicAction, getCities2Action, getCitiesAction, getClinicById,
    getClinicByParentAction, getStatesByCountryAction,
    stateEmptydAction, updateClinicAction
} from '../../../../redux/clinics/actions';
import { FiDownloadCloud, FiMinus } from 'react-icons/fi';
import { handleUpload } from '../../../../helpers/HandleUpload';
import { encryptMessage } from '../../../../cryptoUtils';
import ToastHandle from '../../../../helpers/ToastMessage';
import { handleFirstSpace } from '../../../../helpers/noBeginningSpace';
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from 'react-icons/md';

const ClinicForm = ({ setActiveTab, setClinicId, clinicId, setBillingId, setMultiple, setContractId, setResetEmail, setIsModalRequest, isModalRequest, resetEmail }) => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch, getValues,
        setError,
        setValue,
        clearErrors
    } = useForm();
    const [updatePage, setUpdatePage] = useState(false);
    const [counter, setCounter] = useState(0);
    const [selectedState, setSelectedState] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [selectedCity, setSelectedCity] = useState(null);
    const [logo, setLogo] = useState(null);
    const [parentClinic, setParentclinic] = useState(null);
    const [logoName, setLogoName] = useState(null);
    const [focused, setFocused] = useState(false);
    const [mailingFocused, setMailingFocused] = useState(false);
    const [singleOrMultiple, setSingleOrMultiple] = useState(false);
    const [sameAsPrimary, setSameAsPrimary] = useState(false);
    const [accreditationDetails, setAccreditationDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [medicalDetails, setMedicalDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [stateDetails, setStateDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [posDetails, setPosDetails] = useState([
        { name: '', email: '', role: '', contact: '' }
    ])

    // Get store Data 
    const store = useSelector((state) => state);
    const clinicTypeData = store?.getMastersDataReducer?.data?.clinicTypes;
    const createResponse = store?.createClinicsReducer?.data?.status;
    const clinicDataToUpdate = store?.getClinicByIdReducer?.data?.clinic;
    const clinicsList = store?.getClinicsByParentReducer?.data?.data;
    const decryptedRolesData = store?.getRolesDataReducer?.data?.roles;
    const statesData = store?.getStatesReducer?.data;
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;
    const cities2 = store?.getCitiesReducer?.cities2?.data?.cities;
    const cities = store?.getCitiesReducer?.data?.cities;
    const logoFileInputRef = useRef(null);
    const accreditationFileInputRef = useRef(null);
    const medicalFileInputRef = useRef(null);
    const stateFileInputRef = useRef(null);

    useEffect(() => {
        if (decryptedRolesData) {
            const clinicRoleId = decryptedRolesData && decryptedRolesData.find(role => role?.name === "clinic")?._id;
            setResetEmail({ ...resetEmail, role: clinicRoleId })
        }
    }, [decryptedRolesData])

    const handleLogoClick = () => {
        logoFileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setLogo(url);
            setLogoName(selectedFile?.name)
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    useEffect(() => {
        if (logo && logoName) {
            setResetEmail({
                ...resetEmail,
                logo: {
                    url: logo?.url.split('?')[0],  // Removes any query parameters from the URL
                    fileName: logoName,             // Assigns the logo file name
                },
            });
        }
    }, [logo, logoName]);

    const handleAccreditationChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setAccreditationDetails((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    url: url?.url?.split('?')[0],
                    fileName: selectedFile.name,
                };
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    const handleMedicalChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setMedicalDetails((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    url: url?.url?.split('?')[0],
                    fileName: selectedFile.name,

                };
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    const handleAccreditationInputChange = (e, field, index) => {
        const value = e.target.value;
        setAccreditationDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value
            };
            return updatedDetails;
        });
    };

    const handleMedicalInputChange = (e, field, index) => {
        const value = e.target.value;
        setMedicalDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value
            };
            return updatedDetails;
        });
    };

    const handleAddAccreditation = () => {
        const isIncomplete = accreditationDetails.some(
            (accreditation) =>
                !accreditation.name || !accreditation.number || !accreditation.url
        );

        if (isIncomplete) {
            // Show a toast message if any field is incomplete
            ToastHandle('Please fill all the fields before adding a new one', 'danger');
            return;
        }
        setAccreditationDetails([
            ...accreditationDetails,
            { name: '', number: '', url: null }
        ]);
    };

    const handleRemoveAccreditation = (index) => {
        setAccreditationDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            return updatedDetails;
        });
    };

    const handleAddMedical = () => {
        const isIncomplete = medicalDetails.some(
            (medical) =>
                !medical.name || !medical.number || !medical.url
        );

        if (isIncomplete) {
            // Show a toast message if any field is incomplete
            ToastHandle('Please fill all the fields before adding a new one', 'danger');
            return;
        }
        setMedicalDetails([
            ...medicalDetails,
            { name: '', number: '', url: null }
        ]);
    };

    const handleRemoveMedical = (index) => {
        setMedicalDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            return updatedDetails;
        });
    };

    const handleAddPOS = () => {
        const isIncomplete = posDetails.some(
            (pos) =>
                !pos.name || !pos.role || !pos.contact || !pos.email
        );

        if (isIncomplete) {
            // Show a toast message if any field is incomplete
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
    const handleStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0]
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        setSelectedState(e.target.value);
        dispatch(getCitiesAction({ state_code: key, name: '', limit: 25 }));
    };
    const handleMailingStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0]
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        setMailingStateToSelect(e.target.value);
        dispatch(getCities2Action({ state_code: key, name: '', limit: 25 }));
    };

    const handleCitySelection = (e) => {
        const value = e.target.value;
        setSelectedCity(value)
    };
    const deleteResponse = store?.deleteClinicOnboardingReducer?.data?.status;
    // create Response
    useEffect(() => {
        if (createResponse === 200) {
            // reset Data
            reset();
            setAccreditationDetails([{ name: '', number: '', url: null, fileName: '' }]);
            setPosDetails([{ name: '', number: '', url: null, fileName: '' }]);
            setStateDetails([{ name: '', number: '', url: null, fileName: '' }]);
            setMedicalDetails([{ name: '', number: '', url: null, fileName: '' }]);
            setSelectedCity(null);
            setSelectedState(null);

            if (!singleOrMultiple && !isModalRequest) {
                setBillingId(store?.createClinicsReducer?.data?.data?._id);
                setContractId(store?.createClinicsReducer?.data?.data?.clinicId?._id);
                setActiveTab('billing');
                setCounter(0);
            } else {
                if (counter === 1) {
                    setParentclinic(store?.createClinicsReducer?.data?.data?.clinicId?._id);
                    setBillingId(store?.createClinicsReducer?.data?.data?._id);
                    const payload = {
                        parentClinic: store?.createClinicsReducer?.data?.data?.clinicId?._id,
                    }
                    dispatch(getClinicByParentAction({ key: encryptMessage(payload) }));
                } else if (counter > 1 && clinicsList) {
                    setParentclinic(clinicsList[0]?.parentClinic)
                    setBillingId(clinicsList[0]?.userId?._id);
                    const payload = {
                        parentClinic: parentClinic,
                    }
                    dispatch(getClinicByParentAction({ key: encryptMessage(payload) }));
                }

            }
            const payload = {
                parentClinic: parentClinic,
            }
            dispatch(getClinicByParentAction({ key: encryptMessage(payload) }));

        }
        if (deleteResponse === 200) {
            const payload = {
                parentClinic: parentClinic,
            }
            dispatch(getClinicByParentAction({ key: encryptMessage(payload) }));
        }

    }, [createResponse, clinicsList, parentClinic, deleteResponse, counter]);
    // Submit Button 

    const [formValid, setFormValid] = useState(false)
    const clinicname = watch('clinicname');
    const email = watch('email');
    const contact = watch('contact');
    const clinicType = watch('clinicType');
    const isFormValid = clinicname && email && contact && clinicType;
    useEffect(() => {
        if (resetEmail?.name && resetEmail?.email && resetEmail?.phone && resetEmail?.clinicType) {
            setFormValid(true)
        }
    }, [resetEmail])


    const onSubmit = (data) => {
        // console.log({ counter })
        setIsModalRequest(false);
        const newPayload = {
            isParent: counter < 1 ? true : false, // Conditional property assignment using a ternary operator
            parentClinic: parentClinic,
            name: data?.clinicname,
            email: data?.email,
            role: decryptedRolesData && decryptedRolesData.find(role => role?.name === "clinic")?._id,
            phone: '+1' + data?.contact,
            clinicType: data?.clinicType,
            ...(data?.taxId ? { taxIdOrEIN: data.taxId.replace(/^(\d{2})(\d*)/, '$1-$2') } : ''),
            ...(data?.npi ? { npiNumber: data?.npi } : ''),
            stateOfLicensing: stateDetails,
            accreditationDetails: accreditationDetails,
            pos: posDetails,
            primaryAddress: {
                ...(data?.address ? { address: data?.address } : {}),
                ...(data?.city ? { city: data?.city } : {}),
                ...(data?.zip ? { zip: data?.zip } : {}),
                ...(data?.street ? { street: data?.street } : {}),
                ...(stateToSelect?._id ? { state: stateToSelect?._id } : {}),
                ...(latitude ? { latitude: latitude } : {}),
                ...(longitude ? { longitude: longitude } : {}),
            },
            mailingAddress: sameAsPrimary
                ? {
                    ...(data?.address ? { address: data?.address } : {}),
                    ...(data?.city ? { city: data?.city } : {}),
                    ...(data?.zip ? { zip: data?.zip } : {}),
                    ...(data?.street ? { street: data?.street } : {}),
                    ...(stateToSelect?._id ? { state: stateToSelect?._id } : {}),
                    ...(latitude ? { latitude: latitude } : {}),
                    ...(longitude ? { longitude: longitude } : {}),
                }
                : {
                    ...(data?.mailingAddress ? { address: data?.mailingAddress } : {}),
                    ...(data?.mailingCity ? { city: data?.mailingCity } : {}),
                    ...(data?.mailingZip ? { zip: data?.mailingZip } : {}),
                    ...(data?.mailingStreet ? { street: data?.mailingStreet } : {}),
                    ...(mailingStateToSelect?._id ? { state: mailingStateToSelect?._id } : {}),
                    ...(mailingLatitude ? { latitude: mailingLatitude } : {}),
                    ...(mailingLongitude ? { longitude: mailingLongitude } : {})
                },
            logo: {
                url: logo?.url.split('?')[0],
                fileName: logoName
            },
            practiceSpecialty: data?.speciality,
        };
        // console.log(newPayload, 'newPayloadnewPayloadnewPayload')
        dispatch(createClinicAction({ key: encryptMessage(newPayload) }));
    };
    const createData = store?.createClinicsReducer?.data?.data;
    const [createTableData, setCreateTableData] = useState(null);
    // console.log({ createTableData })
    useEffect(() => {
        if (createData) {
            setCreateTableData(createData)
        }
    }, [createData]);

    const handleDeleteClinic = (data) => {
        const payload = {
            id: data
        }
        dispatch(deleteClinicAction({ key: encryptMessage(payload) }))
    }

    const [searchedLocations, setSearchedLocations] = useState(null)
    const [searchedMailingLocations, setSearchedMailingLocations] = useState(null)
    const getGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed'; // Replace with your API key
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
                    setSearchedLocations(data?.results);
                } else {
                    console.log("No data returned.");
                }
            });
    }
    const getMailingGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed'; // Replace with your API key
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Failed to fetch geocode data:", error);
                return null;
            }
        }
        fetchGeocodeData(addressToSearch)
            .then((data) => {
                if (data) {
                    setSearchedMailingLocations(data?.results);
                } else {
                    console.log("No data returned.");
                }
            });
    }

    // Example usage
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [mailingLongitude, setMailingLongitude] = useState(null);
    const [mailingLatitude, setMailingLatitude] = useState(null);
    const [stateToSelect, setStateToSelect] = useState(null);
    const [mailingStateToSelect, setMailingStateToSelect] = useState(null);
    // console.log({ mailingStateToSelect })
    useEffect(() => {
        if (latitude && longitude) {
            setFocused(false);
        }
        if (mailingLatitude && mailingLongitude) {
            setMailingFocused(false);
        }
    }, [latitude, longitude, mailingLatitude, mailingLongitude]);

    const stateGeoLocation = watch('stateName');
    const mailingStateGeoLocation = watch('mailingStateName');

    useEffect(() => {
        if (stateGeoLocation) {
            setStateToSelect(statesData?.states && statesData?.states.find((data) => data?.state_code === stateGeoLocation));
        }
        if (mailingStateGeoLocation) {
            setMailingStateToSelect(statesData?.states && statesData?.states.find((data) => data?.state_code === mailingStateGeoLocation));
        }
    }, [stateGeoLocation, mailingStateGeoLocation])

    const [citySearch, setCitySearch] = useState(null);
    const [mailingCitySearch, setMailingCitySearch] = useState(null);
    useEffect(() => {
        if (citySearch) {
            setValue('city', cities1 && cities1.find((data) => data?.name === citySearch)?._id)
        }
        if (mailingCitySearch) {
            setValue('mailingCity', cities2 && cities2.find((data) => data?.name === mailingCitySearch)?._id)
        }
    }, [citySearch, cities1, mailingCitySearch, cities2])
    useEffect(() => {
        if (stateToSelect) {
            dispatch(getCitiesAction({ state_code: stateToSelect?.id, name: citySearch ? citySearch : '', limit: 25, skip: '' }));
        }
        if (mailingStateToSelect) {
            dispatch(getCities2Action({ state_code: mailingStateToSelect?.id, name: mailingCitySearch ? mailingCitySearch : '', limit: 25, skip: '' }));
        }
    }, [stateToSelect, citySearch, mailingStateToSelect, mailingCitySearch])

    const [selectedStates, setSelectedStates] = useState([]);
    const [statesMenu, setStatesMenu] = useState(false);
    const handleCheckboxChange = (stateName) => {
        setSelectedStates((prev) => {
            const updatedStates = prev.includes(stateName)
                ? prev.filter((name) => name !== stateName)
                : [...prev, stateName];
            setStateDetails((prevDetails) => {
                const newDetails = updatedStates.map((state) =>
                    prevDetails.find((detail) => detail.name === state) || { name: state, number: '', url: null, fileName: '' }
                );
                return newDetails;
            });
            return updatedStates;
        });
    };

    const handleStateInputChange = (e, field, index) => {
        const value = e.target.value;
        setStateDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value,
            };
            return updatedDetails;
        });
    };

    const handleStateChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setStateDetails((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    url: url?.url?.split('?')[0],
                    fileName: selectedFile.name,
                };
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    const handleRemoveState = (index) => {
        setStateDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            setSelectedStates(updatedDetails.map((detail) => detail.name)); // Update selectedStates as well
            return updatedDetails;
        });
    };
    const menuRef = useRef(null); // Reference for the menu
    const containerRef = useRef(null); // Reference for the container
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setStatesMenu(false);
            }
        };
        // Add event listener to detect clicks outside the menu
        document.addEventListener('mousedown', handleClickOutside);
        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);



    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Practice Name <span className='text-danger'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                {...register('clinicname', {
                                    required: 'This field is required',
                                    validate: (value) =>
                                        !value.startsWith(' ') || 'First character cannot be a space',
                                })}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.startsWith(' ')) {
                                        e.target.value = value.trimStart(); // Prevent spaces at the start
                                    }
                                    setResetEmail({ ...resetEmail, name: e.target.value });
                                }}
                                placeholder="Practice name"
                                onKeyPress={handleFirstSpace}
                            />
                            {errors.clinicname && <span className="text-danger">{errors.clinicname.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Practice type <span className='text-danger'>*</span></Form.Label>
                            <Form.Select
                                // defaultValue={updatePage ? clinicDataToUpdate?.clinicType : ''}
                                {...register('clinicType', { required: 'This field is required' })}
                                onChange={(e) => setResetEmail({ ...resetEmail, clinicType: e.target.value })}
                            >
                                <option value="">Select practice type</option> {/* Ensure this has a value to represent unselected */}
                                {clinicTypeData?.map((data) => (
                                    <option key={data?._id} value={data?.name}>{data?.name}</option>
                                ))}
                            </Form.Select>
                            {errors.clinicType && <span className="text-danger">{errors.clinicType.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Email ID<span className='text-danger'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                // defaultValue={updatePage ? clinicDataToUpdate?.email : ''}
                                {...register('email', {
                                    required: 'This field is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
                                        message: 'Please enter a valid email address'
                                    }
                                })}
                                onChange={(e) => setResetEmail({ ...resetEmail, email: e.target.value })}
                                placeholder="Email ID"
                            />

                            {errors.email && <span className="text-danger">{errors.email.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Practice Speciality</Form.Label>
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
                                    setResetEmail({ ...resetEmail, practiceSpecialty: value });
                                }}
                                placeholder="Practice speciality"
                                onKeyPress={handleFirstSpace}
                            />

                            {errors.speciality && <span className="text-danger">{errors.speciality.message}</span>}

                        </Form.Group>
                    </Col>

                    <Col sm={6}>
                        <Form.Group className="mb-0 position-relative">
                            <Form.Label className='mb-1'>Contact Person <span className='text-danger'>*</span></Form.Label>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Text className='ps-3 pe-1 fw-bold text-black'>&nbsp;&nbsp;+1</InputGroup.Text> {/* This is the prefix */}
                                    <Form.Control
                                        type="tel"
                                        // value={formattedPhone}
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
                                                value: 9,
                                                message: 'Contact must not be less than 9 digits'
                                            }
                                        })}
                                        onChange={(e) => {
                                            setResetEmail({ ...resetEmail, phone: '+1' + e.target.value });
                                            // handlePhoneChange(e.target.value)
                                        }}
                                        defaultValue={updatePage ? clinicDataToUpdate?.phone : ''}
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
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Tax ID / EIN</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('taxId', {
                                    minLength: {
                                        value: 9,
                                        message: 'Tax ID / EIN must be at least 9 characters long', // Error message
                                    },
                                    pattern: {
                                        value: /^[0-9]+$/, // Pattern for numbers only
                                        message: 'Tax ID / EIN must contain numbers only', // Error message
                                    },
                                })}
                                // defaultValue={updatePage ? clinicDataToUpdate?.taxIdOrEIN : ''}
                                onKeyPress={(event) => handleFirstSpace(event, 0)}
                                maxLength={9}
                                onChange={(e) => setResetEmail({ ...resetEmail, taxIdOrEIN: e.target.value })}
                                placeholder="Tax ID / EIN" />
                            {errors.taxId && <span className="text-danger">{errors.taxId.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>NPI Type 2  Number</Form.Label>
                            <Form.Control
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
                                defaultValue={updatePage ? clinicDataToUpdate?.npiNumber : ''}
                                placeholder="NPI Number"
                                maxLength={10}
                                onChange={(e) => setResetEmail({ ...resetEmail, npiNumber: e.target.value })}
                                onKeyPress={(event) => handleFirstSpace(event, 0)} />
                            {errors.npi && <span className="text-danger">{errors.npi.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6} className='mb-2 d-flex flex-column position-relative'>
                        <Form.Label>Upload Logo</Form.Label>
                        <div onClick={handleLogoClick}
                            className={`custom-file-upload justify-content-between cursor-pointer ${logoName ? 'form-control' : 'custom-form-fields'}`}>
                            {logoName ? logoName : 'Upload Logo'}
                            <p className='mb-0'><FiDownloadCloud /></p>
                        </div>
                        <Form.Control
                            type="file"
                            id='file-input'
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
                    <Col sm={12}>
                        <Form.Label>
                            Accreditation Details&nbsp;
                            <span
                                onClick={handleAddAccreditation}
                                className=' fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer'>
                                {/* <CiCirclePlus size={20} /> */}
                            </span>
                        </Form.Label>
                    </Col>
                    {accreditationDetails.map((accreditation, index) => (
                        <React.Fragment key={index}>
                            <Col sm={4}>
                                <Form.Control
                                    type="text"
                                    value={accreditation.name}
                                    placeholder="Name"
                                    onChange={(e) => handleAccreditationInputChange(e, 'name', index)}
                                    onKeyPress={handleFirstSpace}
                                />
                            </Col>
                            <Col sm={4}>
                                <Form.Control
                                    type="text"
                                    value={accreditation.number}
                                    {...register('accDocno', {
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: 'Document no must be a number'
                                        },
                                    })}
                                    placeholder="Document Number"
                                    onChange={(e) => handleAccreditationInputChange(e, 'number', index)}
                                    onKeyPress={(event) => handleFirstSpace(event, 0)}
                                />
                                {errors.accDocno && <span className="text-danger">{errors.accDocno.message}</span>}
                            </Col>
                            <Col sm={4} className="mb-2 position-relative">
                                <div
                                    onClick={() => document.getElementById(`fileInput-accreditation=${index}`).click()}
                                    //  onClick={() => accreditationFileInputRef.current.click()}
                                    className={`custom-file-upload justify-content-between cursor-pointer ${accreditation.fileName ? 'form-control' : 'custom-form-fields'}`}>
                                    {accreditation.fileName ? accreditation?.fileName?.length > 30 ? accreditation?.fileName?.slice(0, 25) + '...' : accreditation?.fileName : 'Upload Document'}
                                    <p className='mb-0'><FiDownloadCloud /></p>
                                </div>
                                {/* <img className={`${accreditation ? "" : "d-none"}`} src={accreditation?.url} alt='...' /> */}
                                <Form.Control
                                    type="file"
                                    id={`fileInput-accreditation=${index}`}
                                    className="rounded-circle "
                                    style={{ display: 'none' }}
                                    ref={accreditationFileInputRef}
                                    onChange={(e) => handleAccreditationChange(e, index)}
                                />
                                <span
                                    onClick={() => handleRemoveAccreditation(index)}
                                    style={{ right: '-2%', top: '20%' }}
                                    className={`${accreditationDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}>
                                    {/* <CiCircleMinus size={16} fontWeight={900} /> */}
                                </span>
                            </Col>

                        </React.Fragment>
                    ))}

                    <hr />

                    <Col sm={12} className="position-relative">
                        <Form.Label ref={containerRef}>
                            State of Licensure&nbsp;
                            <span
                                onClick={() => setStatesMenu(!statesMenu)}
                                className={`plusicon ms-1 fs-5 ${statesMenu ? 'uil-angle-down' : 'uil-angle-up'} fw-bold cursor-pointer`}
                            ></span>
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
                        </Form.Label>
                    </Col>
                    {stateDetails.map((data, index) => (
                        <React.Fragment key={index}>
                            <Col sm={4}>
                                <Form.Control
                                    type="text"
                                    value={data.name}
                                    readOnly // Display selected state name
                                    placeholder="State"
                                />
                            </Col>
                            <Col sm={4}>
                                <Form.Control
                                    type="text"
                                    value={data.number}
                                    placeholder="Document Number"
                                    onChange={(e) => handleStateInputChange(e, 'number', index)}
                                />
                            </Col>
                            <Col sm={4} className="mb-2 position-relative">
                                <div
                                    onClick={() => document.getElementById(`fileInput-state=${index}`).click()}
                                    className={`custom-file-upload justify-content-between cursor-pointer ${data.fileName ? 'form-control' : 'custom-form-fields'
                                        }`}
                                >
                                    {data.fileName
                                        ? data?.fileName?.length > 30
                                            ? data?.fileName?.slice(0, 25) + '...'
                                            : data?.fileName
                                        : 'Upload Document'}
                                    <p className="mb-0">
                                        <FiDownloadCloud />
                                    </p>
                                </div>
                                <Form.Control
                                    type="file"
                                    id={`fileInput-state=${index}`}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleStateChange(e, index)}
                                />
                                <span
                                    onClick={() => handleRemoveState(index)}
                                    className={`${stateDetails.length <= 1 ? 'd-none' : ''
                                        } uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}
                                    style={{ right: '-2%', top: '20%' }}
                                ></span>
                            </Col>
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
                                                    defaultValue={updatePage ? clinicDataToUpdate?.address?.address1 : ''}
                                                    {...register('address')}
                                                    onChange={(e) => {
                                                        getGeolocation(e);
                                                        setFocused(true);
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
                                                    className={`scroll-container hover-bg-change ${searchedLocations?.length === 0 || !focused ? 'd-none' : ''}`}
                                                >
                                                    {searchedLocations?.map((data, index) => (
                                                        <p
                                                            key={index}
                                                            onClick={() => {
                                                                // console.log(data)
                                                                setValue('zip', data?.components?.postcode)
                                                                setValue('stateName', data?.components?.state_code)
                                                                setLatitude(data?.bounds?.southwest?.lat);
                                                                setLongitude(data?.bounds?.southwest?.lng);
                                                                setCitySearch(data?.components?.county)
                                                                setValue('address', data?.formatted)
                                                                setFocused(false);
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
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Longitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                defaultValue={longitude}
                                                placeholder="Longitude" />
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
                                                onChange={(e) => {
                                                    handleStateSelection(e, 'primary');

                                                }}
                                            >
                                                <option >State</option>
                                                {statesData?.states?.map((data) => (
                                                    <option
                                                        key={data?.name}
                                                        data-key={data?.id}
                                                        value={data?.state_code}
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
                                                disabled={store?.getCitiesReducer?.loading}
                                                {...register('city')}
                                                onChange={(e) => handleCitySelection(e)}
                                            >
                                                <option value='' >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                {cities1?.map((data) => (
                                                    <option key={data?.name} value={data?._id}>
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
                                                    defaultValue={updatePage ? clinicDataToUpdate?.address?.address1 : ''}
                                                    {...register('mailingAddress')}
                                                    onChange={(e) => {
                                                        getMailingGeolocation(e);
                                                        setMailingFocused(true);
                                                    }}
                                                    onFocus={() => setMailingFocused(true)}
                                                    onBlur={() => {
                                                        setTimeout(() => setMailingFocused(false), 200);
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
                                                    className={`scroll-container hover-bg-change ${searchedMailingLocations?.length === 0 || !mailingFocused ? 'd-none' : ''}`}
                                                >
                                                    {searchedMailingLocations?.map((data, index) => (
                                                        <p
                                                            key={index}
                                                            onClick={() => {
                                                                setValue('mailingZip', data?.components?.postcode)
                                                                setValue('mailingStateName', data?.components?.state_code)
                                                                setMailingLatitude(data?.bounds?.southwest?.lat);
                                                                setMailingLongitude(data?.bounds?.southwest?.lng);
                                                                setMailingCitySearch(data?.components?.county)
                                                                setValue('mailingAddress', data?.formatted)
                                                                setMailingFocused(false);
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
                                                defaultValue={mailingLatitude}
                                                placeholder="Latitude"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Longitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                defaultValue={mailingLongitude}
                                                placeholder="Longitude" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1' >State</Form.Label>
                                            {sameAsPrimary ?
                                                <Form.Control
                                                    value={statesData?.states?.find((data) => data?.state_code === getValues('stateName'))?.name}
                                                    readOnly />
                                                :
                                                <Form.Select
                                                    {...register('mailingStateName')}
                                                    onChange={(e) => {
                                                        handleMailingStateSelection(e);

                                                    }}
                                                >
                                                    <option >State</option>
                                                    {statesData?.states?.map((data) => (
                                                        <option
                                                            key={data?.name}
                                                            data-key={data?.id}
                                                            value={data?.state_code}
                                                        >
                                                            {data?.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            }

                                        </Form.Group>

                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>City</Form.Label>
                                            {sameAsPrimary ?
                                                <Form.Control
                                                    value={cities1?.find((data) => data?._id === getValues('city'))?.name}
                                                    readOnly />
                                                :
                                                <Form.Select
                                                    disabled={store?.getCitiesReducer?.loading}
                                                    {...register('mailingCity')}
                                                    onChange={(e) => handleCitySelection(e)}
                                                >
                                                    <option value='' >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                    {cities2?.map((data) => (
                                                        <option key={data?.name} value={data?._id}>
                                                            {data?.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            }
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Street</Form.Label>
                                            <Form.Control
                                                type="text"
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
                                                defaultValue={updatePage ? clinicDataToUpdate?.address?.zip : ''}
                                                type="text"
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
                            <Col sm={12} className="mb-2">
                                <span className="text-black fw-semibold form-label">
                                    POC (Point of contact)
                                    <span
                                        onClick={handleAddPOS}
                                        className="plusicon ms-1 fs-5 uil-plus-circle fw-bold cursor-pointer">
                                    </span>
                                </span>
                            </Col>
                            {posDetails.map((data, index) => (
                                <React.Fragment key={index}>
                                    <Col sm={12} className='form-label'>
                                        {'POS ' + `${index + 1}`}
                                        <span
                                            onClick={() => handleRemovePOS(index)}
                                            className={`${posDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer  fs-5 fw-bold text-danger`}>
                                        </span>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Full Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => handlePOSInputChange(e, 'name', index)}
                                                onKeyPress={handleFirstSpace}
                                                placeholder="Full Name"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Contact Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={data.email}
                                                {...register('contactemail', {
                                                    pattern: {
                                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
                                                        message: 'Please enter a valid email address'
                                                    }
                                                })}
                                                onChange={(e) => handlePOSInputChange(e, 'email', index)}
                                                placeholder="Contact Email"
                                            />
                                            {errors.contactemail && <span className="text-danger">{errors.contactemail.message}</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Job Title / Role</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='Job Title / Role'
                                                onKeyPress={handleFirstSpace}
                                                onChange={(e) => handlePOSInputChange(e, 'role', index)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2 position-relative">
                                            <Form.Label className="mb-1">Phone Number</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text className='ps-3 pe-1 fw-bold text-black'>&nbsp;&nbsp;+1</InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    value={data.contact}
                                                    {...register('pocContact', {
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
                                                    onKeyPress={handleFirstSpace}
                                                    placeholder="Phone Number"
                                                    maxLength={10}
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
                                        {errors.pocContact && <span className="text-danger pt-0">{errors.pocContact.message}</span>}

                                    </Col>
                                </React.Fragment>
                            ))}
                        </Row>

                    </Col>
                    <hr />
                    <Col md={12} className='mt-2 d-flex gap-2 justify-content-end'>

                        <Button variant="primary" type='submit' className='custom-buttons' disabled={!formValid || store?.createClinicsReducer?.loading} onClick={() => { setSingleOrMultiple(true); setCounter(counter + 1) }} >
                            {store?.createClinicsReducer?.loading && counter > 1 ?
                                <Spinner color='white' className='spinner-border-sm' />
                                :
                                'Add Multiple Practices'
                            }
                        </Button>
                        <Button
                            variant="primary"
                            type={counter <= 1 ? 'submit' : 'button'}
                            className='custom-buttons'
                            disabled={!formValid || store?.createClinicsReducer?.loading}
                            onClick={() => {
                                setSingleOrMultiple(false);
                                // setCounter(1);
                                if (counter > 1 && !isModalRequest) {
                                    setMultiple(counter)
                                    setActiveTab('billing');
                                    setSingleOrMultiple(false);
                                    setCounter(0);
                                }
                            }}
                        >
                            {store?.createClinicsReducer?.loading && counter === 0 ?
                                <Spinner color='white' className='spinner-border-sm' />
                                :
                                'Next'
                            }
                        </Button>
                    </Col>
                </Row >
            </Form >
            <Row className={`${clinicsList?.length > 0 || counter === 1 && createResponse === 200 ? '' : 'd-none'}`}>
                <Col>
                    <Table responsive className="mt-3 table-centered border border-muted table-nowrap mb-0 ">
                        <thead>
                            <tr>
                                <th>Clinic Name</th>
                                <th>Location</th>
                                <th>Clinic Type</th>
                                <th>Email</th>
                                <th>Contact</th>
                                {/* <th>Tax / EIN Id</th> */}
                                {/* <th></th> */}
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className={`${counter === 1 ? 'd-none' : ''}`}>
                            {store?.getClinicsByParentReducer?.loading ?
                                <tr>
                                    <td colSpan={5} className='text-center'>
                                        <Spinner />
                                    </td>
                                </tr>
                                :
                                clinicsList?.map((multipleData, index) => (
                                    <tr key={multipleData?._id}>
                                        <td className='text-capitalize'>{multipleData?.name}</td>
                                        <td>{(multipleData?.userId?.address?.city?.state_code || 'N/A') + ' / ' + (multipleData?.userId?.address?.city?.name || 'N/A')}</td>
                                        <td>{multipleData?.clinicType}</td>
                                        <td className='text-lowercase'>{multipleData?.userId?.email}</td>
                                        <td>{multipleData?.userId?.phone}</td>
                                        <td className='fs-4 d-flex gap-1'>
                                            <i
                                                className="mdi mdi-delete cursor-pointer"
                                                onClick={() => {
                                                    const payload = {
                                                        id: index === 0 ? multipleData?.clinicId : multipleData?._id,
                                                    };
                                                    dispatch(deleteClinicAction({ key: encryptMessage(payload) }));
                                                }}
                                            ></i>
                                        </td>
                                    </tr>
                                )
                                )}
                        </tbody>
                        <tbody className={`${counter === 1 ? '' : 'd-none'}`}>
                            <tr key={createTableData?._id}>
                                <td className='text-capitalize'>{createTableData?.clinicId?.name}</td>
                                <td>{(createTableData?.address?.state?.state_code || "N/A") + " / " + (createTableData?.address?.city?.name || "N/A")}</td>
                                <td>{createTableData?.clinicId?.clinicType}</td>
                                <td>{createTableData?.email}</td>
                                <td>{createTableData?.phone}</td>
                                <td>
                                    <i onClick={() => handleDeleteClinic(createTableData?._id)} className="mdi mdi-delete cursor-pointer"></i>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );
}

export default ClinicForm;