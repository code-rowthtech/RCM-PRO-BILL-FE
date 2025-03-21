// src/components/Clinic.js

import React, { useEffect, useRef, useState } from 'react';
import { Col, Form, Row, Button, InputGroup, Modal, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiDownloadCloud } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { handleUpload } from '../../../../helpers/HandleUpload';
import us from '../../../../assets/images/flags/us.jpg';
import ToastHandle from '../../../../helpers/ToastMessage';
import {
    forgotPassword,
    generateOtpAction,
    getCities2Action,
    getCitiesAction,
    stateEmptydAction,
    updateClinicAction,
    verifyOtpAction,
} from '../../../../redux/actions';
import Spinner from '../../../../constants/Spinner';
import { encryptMessage } from '../../../../cryptoUtils';
import { handleFirstSpace } from '../../../../helpers/noBeginningSpace';
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked, MdVerified } from 'react-icons/md';
import { GoAlert } from 'react-icons/go';
import { IoMdClose } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { otpVerification } from '../../../../helpers/api/apiEndpoints';
import EmailChangeModal from './emailChangeModal';
import { CiCircleMinus } from 'react-icons/ci';

const Clinic = ({ id }) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        getValues,
        formState: { errors },
        clearErrors,
    } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
    const [accUploading, setAccUploading] = useState(false);
    const [identifierDocument, setIdentifierDocumnent] = useState(false);
    const clinicData = store?.getClinicByIdReducer?.data?.clinic;
    console.log(clinicData, 'clinicDataIdentifier');
    const clinicTypeData = store?.getMastersDataReducer?.data?.clinicTypes;
    const statesData = store?.getStatesReducer?.data;
    console.log(statesData, 'statesData');
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;
    console.log(cities1, 'cities1');
    const cities2 = store?.getCitiesReducer?.cities2?.data?.cities;
    const cities = store?.getCitiesReducer?.data?.cities;
    const subClinics = store?.getClinicsByParentReducer?.data?.result;

    const [formDetails, setFormDetails] = useState({
        accreditationDetails: [{ name: '', number: '', url: null, fileName: '' }],
        stateDetails: [{ name: '', number: '', url: null, fileName: '' }],
    });
    const [posDetails, setPosDetails] = useState([{ name: '', email: '', role: '', contact: '' }]);
    const [taxonomyCodes, setTaxonomyCodes] = useState(['']);
    useEffect(() => {
        setFormDetails((prevDetails) => ({
            ...prevDetails,
            accreditationDetails:
                clinicData?.accreditationDetails?.length === 0
                    ? formDetails?.accreditationDetails
                    : clinicData?.accreditationDetails || prevDetails.accreditationDetails,
            medicalDetails: clinicData?.medicalLicenses || prevDetails.medicalDetails,
            stateDetails:
                clinicData?.stateOfLicensing?.length === 0
                    ? formDetails?.stateDetails
                    : clinicData?.accreditationDetails,
            // stateDetails: clinicData?.stateOfLicensing?.length === 0 ? formDetails?.stateDetails : clinicData?.accreditationDetails,
        }));
        setPosDetails(clinicData?.pos?.length === 0 ? posDetails : clinicData?.pos);
    }, [clinicData]);

    const setField = (key, value) => value && setValue(key, value);
    // useEffect(() => {
    //     if (!clinicData) return;

    //     if (clinicData?.orgType) {
    //         setValue('clinicType', clinicData.orgType); // Setting value from API response
    //     }
    //     setField('name', clinicData?.name);
    //     setField('email', clinicData?.userId?.email);
    //     setField('use', clinicData?.userId?.name?.use);
    //     setField('family', clinicData?.userId?.name?.family);
    //     setField('given', clinicData?.userId?.name?.given);

    //     // Handle Address Fields
    //     setField('address', clinicData?.userId?.primaryAddress?.address || '');
    //     // setField('mailingAddress', clinicData?.userId?.mailingAddress?.address || '');
    //     // setField('mailingZip', clinicData?.userId?.mailingAddress?.zip || '');
    //     // setField('mailingStreet', clinicData?.userId?.mailingAddress?.street || '');
    //     // setField('street', clinicData?.userId?.primaryAddress?.street || '');
    //     // setField('zip', clinicData?.userId?.primaryAddress?.zip || '');
    //     // setField('stateName', clinicData?.userId?.primaryAddress?.state?._id || '');
    //     // setField('mailingStateName', clinicData?.userId?.mailingAddress?.state?._id || '');
    //     setSameAsPrimary(clinicData?.userId?.isPrimaryAndMailingAddressSame);

    //     // Format & Set Contact Number
    //     const formattedPhone = clinicData?.userId?.phone
    //         ? clinicData.userId.phone
    //               .replace(/^\+1/, '') // Remove "+1" prefix
    //               .replace(/\D/g, '') // Remove non-numeric characters
    //               .replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) =>
    //                   p3 ? `(${p1})${p2}-${p3}` : `(${p1})${p2}`
    //               )
    //         : '';

    //     setField('contact', formattedPhone);

    //     // Handle Tax ID (if exists)
    //     // if (clinicData?.taxIdOrEIN) {
    //     //     setField('taxId', `${clinicData.taxIdOrEIN.slice(0, 2)}-${clinicData.taxIdOrEIN.slice(2, 9)}`);
    //     // }

    //     // Handle Specialties
    //     // setField('speciality', clinicData?.practiceSpecialty || []);

    //     // Handle NPI Number
    //     // setField('npi', clinicData?.npiNumber || '');

    //     // Handle Taxonomy Codes
    //     if (clinicData?.taxonomyCodes?.length) {
    //         setTaxonomyCodes(clinicData.taxonomyCodes);
    //         clinicData.taxonomyCodes.forEach((code, index) => {
    //             setValue(`taxonomyCode[${index}]`, code);
    //         });
    //     } else {
    //         setTaxonomyCodes(['']);
    //     }

    //     // Dispatch city actions if state & city are available
    //     if (clinicData?.userId?.primaryAddress?.city) {
    //         dispatch(
    //             getCitiesAction({
    //                 state_code: clinicData?.userId?.primaryAddress?.state?.id,
    //                 name: clinicData?.userId?.primaryAddress?.city?.name,
    //                 limit: '',
    //                 skip: '',
    //             })
    //         );
    //     }

    //     if (clinicData?.userId?.mailingAddress?.city) {
    //         dispatch(
    //             getCities2Action({
    //                 state_code: clinicData?.userId?.mailingAddress?.state?.id,
    //                 name: clinicData?.userId?.mailingAddress?.city?.name,
    //                 limit: '',
    //                 skip: '',
    //             })
    //         );
    //     }

    //     // Handle Longitude & Latitude
    //     setLongitude(clinicData?.userId?.primaryAddress?.longitude || '');
    //     setLatitude(clinicData?.userId?.primaryAddress?.latitude || '');
    //     setMailingLongitude(clinicData?.userId?.mailingAddress?.longitude || '');
    //     setMailingLatitude(clinicData?.userId?.mailingAddress?.latitude || '');

    //     // Handle Organization Logo
    //     if (clinicData?.orgLogo) {
    //         setLogoName(clinicData.orgLogo.fileName);
    //     }
    // }, [clinicData, dispatch, setValue]);

    const handleLogoClick = () => {
        if (logoFileInputRef.current) {
            logoFileInputRef.current.click();
        }
    };
    const closeOtpModal = () => {
        setShowOtpModal(false);
    };
    const [logoUploading, setLogoUploading] = useState(false);
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
            const url = await handleUpload(
                selectedFile,
                type === 'accreditationDetails' ? setAccreditationUploading : setStateUploading
            );
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
        console.log(key, 'key');
        dispatch(getCitiesAction({ state_code: key, name: '', limit: 25, skip: '' }));
    };

    const handleMailingStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0]; // Get the selected <option>
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        dispatch(getCities2Action({ state_code: key?.id, name: '', limit: 25, skip: '' }));
    };

    const handleCitySelection = (e) => {};

    const onSubmit = (data) => {
        console.log(data, 'data working');
        const newPayload = {
            userId: clinicData?.userId?._id,
            clinicId: clinicData?._id,
            name: { text: data?.clinicname },

            // active: true,
            email: data?.email || clinicData?.email || '',

            orgType: data?.practiceType || clinicData?.orgType || '',
            // orgSpecialty: clinicData?.orgSpecialty || [],

            orgLogo: {
                url: logo?.url?.split('?')[0] || clinicData?.orgLogo?.url || '',
                fileName: logoName || clinicData?.orgLogo?.fileName || '',
            },
            identifier: constantIdentifiers
                .filter((item) => item.number?.trim()) // Only include items with a non-empty 'number'
                .map((item) => ({
                    identifierType: item.type || '',
                    use: item.use || '',
                    value: item.number || '',
                    documents: [
                        {
                            url: item?.file?.url || '',
                            fileName: item?.file?.name || '',
                        },
                    ],
                    expirationDate:
                        item.expiry ||
                        clinicData?.identifier?.find((id) => id.identifierType === item.type)?.expirationDate ||
                        '',
                    issuingAuthority: item.issuingAuthority || '',
                    status: 'active',
                    system: 'urn:oid:2.16.840.1.113883.4.7',
                    sliceName: item.type || '',
                })),

            // identifier: constantIdentifiers.map((item) => ({
            //     ...(item.type&&{identifierType: item.type} ),
            //     ...(item.use&&{use: item.use}),
            //     ...(item.number&&{number: item.number}),
            //     ...(item.file&&{documents: item.file}),
            //     ...(item.expiry&&{expirationDate: item.expiry}),
            //     ...(item.issuingAuthority&&{issuingAuthority: item.issuingAuthority}),
            //     ...(item.status&&{status: 'active'}),
            //     ...(item.system&&{system: 'urn:oid:2.16.840.1.113883.4.7'}),
            //     ...(item.sliceName&&{sliceName: item.sliceName}),

            // identifierType: item.type || '',
            // use: item?.use || '',
            // value: item?.number || '',

            // documents: [{ url: item?.file?.url || '', fileName: item?.file?.name || '' }],
            // expirationDate:
            //     item.expiry ||
            //     clinicData?.identifier?.find((id) => id.identifierType === item.type)?.expirationDate ||
            //     '',
            // status: 'active',
            // system: 'urn:oid:2.16.840.1.113883.4.7',
            // sliceName: item.type || '',
            // issuingAuthority: item.issuingAuthority || '',
            // })),

            telecom: constantContact.map((contact) => ({
                system: contact.system || '',
                value: contact.value || '',
                use: contact.use || '',
            })),

            address: addresses.length > 0 ? addresses : clinicData?.address || [],

            poc: pocs.length > 0 ? pocs : clinicData?.poc || [],
        };

        console.log('Final Payload:', newPayload);

        dispatch(updateClinicAction({ key: encryptMessage(newPayload) }));
    };

    const handleAddPOS = () => {
        const isIncomplete = posDetails.some((pos) => !pos.name || !pos.role || !pos.contact || !pos.email);
        if (isIncomplete) {
            ToastHandle('Please fill all the fields before adding a new one', 'danger');
            return;
        }
        setPosDetails([...posDetails, { name: '', email: '', role: null, contact: '' }]);
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
                [field]: value,
            };
            return updatedDetails;
        });
    };

    const [searchedLocations, setSearchedLocations] = useState(null);
    console.log(searchedLocations, 'searchedLocations');
    const [searchedMailingLocations, setSearchedMailingLocations] = useState(null);
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
    const getMailingGeolocation = (e) => {
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
                setSearchedMailingLocations(data?.results);
            } else {
                console.error('No data returned.');
            }
        });
    };
    const [selectedLocation, setSelectedLocation] = useState(null);
    console.log(selectedLocation, 'selectedLocation');
    const [selectedMailingLocation, setSelectedMailingLocation] = useState(null);
    useEffect(() => {
        if (selectedLocation) {
            setLatitude(selectedLocation?.bounds?.southwest?.lat);
            setLongitude(selectedLocation?.bounds?.southwest?.lng);
            setValue('address', selectedLocation?.formatted);
            const stateId =
                statesData?.states &&
                statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?.id;
            const selectedState =
                statesData?.states &&
                statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?._id;
            setValue('stateName', selectedState);
            const countyName = selectedLocation?.components?.county;
            dispatch(getCitiesAction({ state_code: stateId, name: countyName, limit: '', skip: '' }));
        }
        // if (selectedMailingLocation) {
        //     setMailingLatitude(selectedMailingLocation?.bounds?.southwest?.lat);
        //     setMailingLongitude(selectedMailingLocation?.bounds?.southwest?.lng);
        //     setValue('mailingAddress', selectedMailingLocation?.formatted);
        //     const stateId =
        //         statesData?.states &&
        //         statesData?.states.find((data) => data?.state_code === selectedMailingLocation?.components?.state_code)
        //             ?.id;
        //     const selectedState =
        //         statesData?.states &&
        //         statesData?.states.find((data) => data?.state_code === selectedMailingLocation?.components?.state_code)
        //             ?._id;
        //     setValue('mailingStateName', selectedState);
        //     const countyName = selectedMailingLocation?.components?.county;
        //     dispatch(getCities2Action({ state_code: stateId, name: countyName, limit: '', skip: '' }));
        // }
    }, [selectedLocation, setValue, statesData, dispatch]);
    useEffect(() => {
        if (cities1) {
            const selectedCounty =
                cities1 &&
                cities1.find(
                    (data) =>
                        data?.name === selectedLocation?.components?.county ||
                        clinicData?.userId?.primaryAddress?.city?.name
                )?._id;
            setValue('city', selectedCounty);
        }
        if (cities2) {
            const selectedCounty =
                cities2 &&
                cities2.find(
                    (data) =>
                        data?.name === selectedLocation?.components?.county ||
                        clinicData?.userId?.mailingAddress?.city?.name
                )?._id;
            setValue('mailingCity', selectedCounty);
        }
    }, [cities1, cities2]);

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
                const updatedStateDetails = updatedStates.map(
                    (state) =>
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
            ToastHandle('Please complete the current Taxonomy Code field before adding another.', 'danger');
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
    };

    const sendResetMail = (data) => {
        const payload = {
            email: data?.resetEmail,
        };
        dispatch(forgotPassword({ key: encryptMessage(payload) }));
    };

    const handleOpenStatusModal = (data) => {
        setStatusModal(true);
        setStatusData(data);
    };
    const closeStatusModal = () => {
        setStatusModal(false);
    };
    const handleStatusUpdate = () => {
        const payload = {
            userId: statusData?.userId?._id,
            clinicId: statusData?._id,
            id: statusData?._id,
            status: !statusData?.status,
        };
        dispatch(updateClinicAction({ key: encryptMessage(payload) }));
    };
    const updateSuccess = store?.updateClinicsReducer?.data?.status;

    useEffect(() => {
        if (updateSuccess === 200) {
            // dispatch(stateEmptydAction());
            closeStatusModal();
        }
    }, [updateSuccess]);
    // new changes
    const defaultIdentifiers = ['NPI', 'CLIA', 'NAIC'];
    const defaultIssuingAuthority = [
        'NPPES',
        'CLIA',
        'State Licensing Authority',
        'IRS',
        'CMS',
        'The Joint Commission',
        'Dun & Bradstreet',
        'Other',
    ];
    const contactDetails = ['phone', 'email'];
    const addressUses = [ 'work', 'temp', 'old', 'billing', 'mailing', 'primary'];
    const uses = ['usual', 'old', 'temp', 'secondary', 'official'];
    const identifierOptions = [
        'NPI',
        'TIN',
        'NAIC',
        'Medicare',
        'Medicaid',
        'State License',
        'Accreditation',
        'CLIA',
        'DUNS',
        'Facility ID',
    ];
    const formatDateForInput = (dateString) => {
        if (!dateString) return ''; // Return empty if no date
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
    };

    const contactOptions = ['phone', 'fax', 'email', 'pager', 'url', 'sms', 'other'];
    const [constantIdentifiers, setConstantIdentifiers] = useState([]);
    const [constantContact, setConstantContact] = useState([]);
    const [name, setName] = useState({
        use: '',
        text: '',
        family: '',
        given: [''],
        prefix: [''],
        suffix: [],
        period: { start: new Date().toISOString() },
    });
    const [addresses, setAddresses] = useState([
        { use: '', line: [''], city: '', state: '', postalCode: '', country: 'US' }, // Default address
    ]);
    console.log(addresses, 'addresses');
    const [activeAddressIndex, setActiveAddressIndex] = useState(null);
    const [addressFocused, setAddressFocused] = useState(false);
    // Load Default Identifiers & Contacts
    useEffect(() => {
        setConstantIdentifiers(
            defaultIdentifiers.map((type) => ({
                type,
                number: '',
                file: '',
                expiry: '',
                issuingAuthority: '',
                use: '',
            }))
        );
        setConstantContact(
            contactDetails.map((system) => ({
                system,
                value: '',
                use: '',
            }))
        );
    }, []);

    // Function to Add New Fields
    const addIdentifier = () => {
        setConstantIdentifiers([
            ...constantIdentifiers,
            { type: '', number: '', file: '', expiry: '', issuingAuthority: '', use: '' },
        ]);
    };
    const addContactDetails = () => {
        setConstantContact([...constantContact, { system: '', value: '', use: '' }]);
    };
    const addAddress = () => {
        setAddresses([...addresses, { use: '', line: [''], city: '', state: '', postalCode: '', country: 'US' }]);
    };

    // Function to Remove Fields
    const removeIdentifier = (index) => {
        if (index < defaultIdentifiers.length) return;
        setConstantIdentifiers(constantIdentifiers.filter((_, i) => i !== index));
    };
    const removeContact = (index) => {
        if (index < contactDetails.length) return;
        setConstantContact(constantContact.filter((_, i) => i !== index));
    };
    const removeAddress = (index) => {
        if (addresses.length > 1) {
            setAddresses(addresses.filter((_, i) => i !== index));
        }
    };

    // Function to Handle Changes
    const handleChange = (index, field, value) => {
        const updatedIdentifiers = [...constantIdentifiers];
        updatedIdentifiers[index][field] = value;
        setConstantIdentifiers(updatedIdentifiers);
    };
    const handleContactChange = (index, field, value) => {
        const updatedContacts = [...constantContact];

        if (field === 'value' && updatedContacts[index].system === 'phone') {
            // Remove non-numeric characters
            let rawValue = value.replace(/\D/g, '');
            if (rawValue.length > 10) rawValue = rawValue.slice(0, 10);

            // Format as (XXX)XXX-XXXX
            const formattedValue = rawValue.replace(/(\d{1,3})(\d{0,3})(\d{0,4})/, (match, p1, p2, p3) => {
                if (p3) return `(${p1})${p2}-${p3}`;
                if (p2) return `(${p1})${p2}`;
                return `(${p1}`;
            });

            updatedContacts[index][field] = formattedValue; // Store formatted phone number
        } else {
            updatedContacts[index][field] = value; // Store other fields as they are
        }

        setConstantContact(updatedContacts);
    };
    const formatDisplayValue = (value) => {
        if (!value) return '';
        const rawValue = value.replace(/\D/g, '');
        return rawValue.replace(/(\d{1,3})(\d{0,3})(\d{0,4})/, (match, p1, p2, p3) => {
            if (p3) return `(${p1})${p2}-${p3}`;
            if (p2) return `(${p1})${p2}`;
            return `(${p1}`;
        });
    };
    const handleAddressChange = (index, field, value) => {
        const updatedAddresses = [...addresses];
        if (field === 'line') {
            updatedAddresses[index].line[0] = value; // update street address
        } else {
            updatedAddresses[index][field] = value;
        }
        setAddresses(updatedAddresses);
    };
    // Default telecom contact options

    // State for POCs (at least one default POC)
    const [pocs, setPocs] = useState([
        {
            name: {
                use: '',
                text: '',
                family: '',
                given: [''],
                prefix: [''],
                suffix: [],
                // period: { start: '', end: '' },
            },
            email: '',
            role: '',
            telecom: [{ system: '', value: '', use: '' }],
        },
    ]);
    // Function to handle POC field changes
    const handlePocChange = (index, field, value) => {
        setPocs((prevPocs) => {
            const updatedPocs = [...prevPocs];
            const keys = field.split('.');
            let target = updatedPocs[index];
            for (let i = 0; i < keys.length - 1; i++) {
                target = target[keys[i]] = { ...target[keys[i]] };
            }
            target[keys[keys.length - 1]] = value;
            return updatedPocs;
        });
    };

    const handleNameArrayChange = (index, field, value) => {
        const updatedPocs = [...pocs];
        updatedPocs[index].name[field] = [value];
        setPocs(updatedPocs);
    };

    // Function to handle Telecom (Contact) field changes inside POCs
    const handleTelecomChange = (pocIndex, telecomIndex, field, value) => {
        const updatedPoc = [...pocs]; // Assuming pocList is your state
        let rawValue = value.replace(/\D/g, ''); // Remove non-numeric characters

        // Limit to 10 digits
        if (rawValue.length > 10) rawValue = rawValue.slice(0, 10);

        // Format as (XXX)XXXXXXX
        const formattedValue = rawValue.replace(/(\d{1,3})(\d{0,7})/, (match, p1, p2) => {
            if (p2) return `(${p1})${p2}`;
            return `(${p1}`;
        });

        updatedPoc[pocIndex].telecom[telecomIndex][field] = formattedValue; // Store formatted number
        setPocs(updatedPoc);
    };

    // Function to add a new POC
    const addPoc = () => {
        setPocs([
            ...pocs,
            {
                name: {
                    use: '',
                    text: '',
                    family: '',
                    given: [''],
                    prefix: [''],
                    suffix: [],
                    // period: { start: '', end: '' },
                },
                email: '',
                role: '',
                telecom: [{ system: '', value: '', use: '' }],
            },
        ]);
    };

    // Function to remove a POC (at least one should remain)
    const removePoc = (index) => {
        if (pocs.length > 1) {
            setPocs(pocs.filter((_, i) => i !== index));
        }
    };

    // Function to add a new telecom contact inside a POC
    const addTelecom = (pocIndex) => {
        const updatedPocs = [...pocs];
        updatedPocs[pocIndex].telecom.push({ system: '', value: '', use: '' });
        setPocs(updatedPocs);
    };

    // Function to remove a telecom contact inside a POC
    const removeTelecom = (pocIndex, telecomIndex) => {
        const updatedPocs = [...pocs];
        if (updatedPocs[pocIndex].telecom.length > 1) {
            updatedPocs[pocIndex].telecom = updatedPocs[pocIndex].telecom.filter((_, i) => i !== telecomIndex);
            setPocs(updatedPocs);
        }
    };
    useEffect(() => {
        if (clinicData) {
            if (clinicData?.orgType) {
                setValue('practiceType', clinicData?.orgType);
            }
            setField('clinicname', clinicData?.name);
            setField('email', clinicData?.userId?.email);
            if (clinicData?.orgLogo) {
                setLogoName(clinicData.orgLogo.fileName);
            }

            // ✅ Ensure at least 'NPI', 'CLIA', 'NAIC' are set
            let identifiers =
                clinicData?.identifier?.map((data) => ({
                    type: data.identifierType || '',
                    number: data?.value || '',
                    file: data?.documents?.[0]?.fileName
                        ? {
                              url: data.documents[0].url,
                              name: data.documents[0].fileName,
                          }
                        : '',
                    expiry: data?.expirationDate || '',
                    issuingAuthority: data.issuingAuthority || '',
                    use: data.use || '',
                })) || [];
            // If no identifiers exist, default to 'NPI', 'CLIA', 'NAIC'
            if (identifiers.length === 0) {
                identifiers = defaultIdentifiers?.map((type) => ({
                    type,
                    number: '',
                    file: '',
                    expiry: '',
                    issuingAuthority: '',
                    use: '',
                }));
            }

            setConstantIdentifiers(identifiers);

            // ✅ Ensure at least 'phone' and 'email' are set
            let contacts =
                clinicData.telecom?.map((contact) => ({
                    system: contact.system || '',
                    value: contact.value || '',
                    use: contact.use || '',
                })) || [];

            if (contacts.length === 0) {
                contacts = contactDetails.map((system) => ({
                    system,
                    value: '',
                    use: '',
                }));
            }

            setConstantContact(contacts);

            // ✅ Set Addresses
            // setAddresses(
            //     clinicData?.address?.map((addr) => ({
            //         use: addr.use || '',
            //         line: addr.line && Array.isArray(addr.line) ? addr.line : [''], // Ensure array
            //         city: addr.city || '',
            //         state: addr.state || '',
            //         postalCode: addr.postalCode || '',
            //         country: addr.country || '',
            //     })) || [{ use: '', line: [''], city: '', state: '', postalCode: '', country: '' }]
            // );
            if (clinicData?.address) {
                const formattedAddresses = clinicData.address.map((addr) => ({
                    use: addr.use || '',
                    line: Array.isArray(addr.line) ? addr.line : [''],
                    city: addr.city || '',
                    state: addr.state || '',
                    postalCode: addr.postalCode || '',
                    country: addr.country || '',
                }));
                setAddresses(formattedAddresses);
            }

            // ✅ Set POCs (Point of Contacts)
            setPocs(
                clinicData?.poc?.map((pocs) => ({
                    name: {
                        use: pocs.name?.use || '',
                        text: pocs.name?.text || '',
                        family: pocs.name?.family || '',
                        given: pocs.name?.given || [''], // Ensure array
                        prefix: pocs.name?.prefix || [''], // Ensure array
                        suffix: pocs.name?.suffix || [], // Ensure array
                    },
                    email: pocs.email || '',
                    role: pocs.role || '',
                    telecom: pocs?.telecom?.map((tele) => ({
                        system: tele?.system || '',
                        value: tele?.value || '',
                        use: tele?.use || '',
                    })) || [{ system: '', value: '', use: '' }], // Default telecom
                })) || [
                    {
                        name: {
                            use: '',
                            text: '',
                            family: '',
                            given: [''],
                            prefix: [''],
                            suffix: [],
                        },
                        email: '',
                        role: '',
                        telecom: [{ system: '', value: '', use: '' }],
                    },
                ]
            );
        }
    }, [clinicData, setValue]);

    useEffect(() => {
        if (clinicData && statesData?.states?.length > 0) {
            const stateCode = statesData?.states?.find((data) => data?.name === clinicData?.address?.[0]?.state)?.id;
            dispatch(
                getCitiesAction({ state_code: stateCode, name: clinicData?.address?.[0]?.city, limit: '', skip: '' })
            );
        }
    }, [clinicData, statesData]);
    // Runs when `apiResponse` changes
    const handleIdentifierFileChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        console.log(selectedFile, 'selectedFile');
        if (!selectedFile) return;

        try {
            const url = await handleUpload(selectedFile, setAccUploading); // Upload file
            setConstantIdentifiers((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    file: {
                        url: url?.url?.split('?')[0],
                        name: selectedFile.name,
                    },
                };
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    return (
        <>
            <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col sm={3}>
                        <Form.Group className="mb-2">
                            <Form.Label className="mb-0">
                                Practice Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                {...register('clinicname', {
                                    required: 'This field is required',
                                    validate: (value) => !value.startsWith(' ') || 'First character cannot be a space',
                                })}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.startsWith(' ')) {
                                        e.target.value = value.trimStart(); // Prevent spaces at the start
                                    }
                                    // setResetEmail({ ...resetEmail, name: e.target.value });
                                }}
                                placeholder="Practice name"
                                // onKeyPress={handleFirstSpace}
                            />
                            {errors.clinicname && <span className="text-danger">{errors.clinicname.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group className="mb-2">
                            <Form.Label className="mb-0">
                                Practice Type <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                                data-has-value={!!watch('practiceType')}
                                {...register('practiceType', { required: 'This field is required' })}
                                defaultValue="">
                                <option value="" hidden>
                                    Select clinic type
                                </option>
                                {clinicTypeData?.map((data) => (
                                    <option
                                        key={data?._id}
                                        value={data?.name}
                                        selected={data?.name === clinicData?.orgType}>
                                        {data?.name}
                                    </option>
                                ))}
                            </Form.Select>

                            {errors.practiceType && <span className="text-danger">{errors.practiceType.message}</span>}
                        </Form.Group>
                    </Col>

                    <Col xs={3}>
                        <Form.Label className="mb-0">
                            Email <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            {...register('email', {
                                required: 'This field is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
                                    message: 'Please enter a valid email address',
                                },
                            })}
                            onChange={(e) => clearErrors('email')} // Only clearing errors, no `setResetEmail`
                            placeholder="Email ID"
                        />
                    </Col>

                    <Col sm={3}>
                        <Form.Label className="mb-0">Upload Logo</Form.Label>
                        <div
                            onClick={() => document.getElementById(`logo-file-input`).click()}
                            className={`custom-file-upload justify-content-between cursor-pointer ${
                                logoName || logoUploading ? 'form-control' : 'custom-form-fields'
                            }`}>
                            {logoName ? logoName : logoUploading ? 'Uploading...' : 'Upload Logo'}
                            <p className="mb-0">
                                <FiDownloadCloud />
                            </p>
                        </div>
                        <Form.Control
                            type="file"
                            id="logo-file-input"
                            className="rounded-circle"
                            style={{ display: 'none' }}
                            accept=".png, .jpg, .jpeg, .svg"
                            onChange={handleFileChange}
                        />
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col sm={12}>
                        <Row className="">
                            <Col sm={12}>
                                <h5>
                                    Identifiers
                                    <span
                                        className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                        onClick={addIdentifier}></span>
                                </h5>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Label>Identifier Type</Form.Label>
                            </Col>
                            <Col>
                                <Form.Label>Identifier Number</Form.Label>
                            </Col>
                            <Col>
                                <Form.Label>Identifier Document</Form.Label>
                            </Col>
                            <Col>
                                <Form.Label>Issuing Authority</Form.Label>
                            </Col>
                            <Col>
                                <Form.Label>Identifier Expiry (If Applicable)</Form.Label>
                            </Col>
                        </Row>

                        {constantIdentifiers?.map((item, index) => (
                            <Row key={index} className="mb-2">
                                <Col>
                                    <Form.Select
                                        data-has-value={!!watch(`identifiers[${index}].type`)}
                                        {...register(
                                            `identifiers[${index}].type`
                                            //  { required: 'Identifier Type is required' }
                                        )}
                                        value={item.type}
                                        onChange={(e) => handleChange(index, 'type', e.target.value)}
                                        disabled={defaultIdentifiers.includes(item.type)}>
                                        <option value="" hidden>
                                            Select Identifier Type
                                        </option>
                                        {identifierOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Document Number"
                                        value={item.number}
                                        maxLength={
                                            item.type === 'NPI' || item.type === 'CLIA'
                                                ? 10
                                                : item.type === 'NAIC'
                                                ? 5
                                                : undefined
                                        }
                                        {...register(`identifiers[${index}].number`, {
                                            // required: defaultIdentifiers.includes(item.type)
                                            //     ? 'Document Number is required'
                                            //     : false,
                                            validate: (value) => {
                                                if (!value) return true; // Skip validation if field is empty (for dynamic fields)

                                                if (item.type === 'NPI' && !/^[0-9]{10}$/.test(value)) {
                                                    return 'NPI number must be exactly 10 digits long';
                                                }
                                                if (item.type === 'CLIA' && !/^[A-Z0-9]{2}D[0-9]{7}$/.test(value)) {
                                                    return 'CLIA number must be in the format XXDXXXXXXX, where X is alphanumeric and the rest are digits';
                                                }
                                                if (item.type === 'NAIC' && !/^[0-9]{5}$/.test(value)) {
                                                    return 'NAIC number must be exactly 5 digits long';
                                                }
                                                return true; // No validation for other types (like DUNS, etc.)
                                            },
                                        })}
                                        onChange={(e) => {
                                            let value = e.target.value;

                                            // Enforce length limit only for NPI, CLIA, and NAIC
                                            if (item.type === 'NPI' || item.type === 'CLIA') {
                                                value = value.slice(0, 10);
                                            } else if (item.type === 'NAIC') {
                                                value = value.slice(0, 5);
                                            }

                                            handleChange(index, 'number', value);
                                        }}
                                    />
                                    {errors.identifiers?.[index]?.number && (
                                        <span className="text-danger">{errors.identifiers[index].number.message}</span>
                                    )}
                                </Col>
                                <Col className="mb-2 position-relative">
                                    <div
                                        onClick={() => document.getElementById(`fileInput-identifier-${index}`).click()}
                                        className={`custom-file-upload justify-content-between cursor-pointer ${
                                            item.file || item.uploading ? 'form-control' : 'custom-form-fields'
                                        }`}>
                                        {item.uploading
                                            ? 'Uploading...'
                                            : item.file?.name
                                            ? item.file.name.length > 30
                                                ? item.file.name.slice(0, 25) + '...'
                                                : item.file.name
                                            : 'Upload Document'}
                                        <p className="mb-0">
                                            <FiDownloadCloud />
                                        </p>
                                    </div>

                                    <Form.Control
                                        type="file"
                                        id={`fileInput-identifier-${index}`}
                                        style={{ display: 'none' }}
                                        accept=".png, .jpg, .jpeg, .pdf"
                                        onChange={(e) => handleIdentifierFileChange(e, index)}
                                    />

                                    {errors?.[index]?.file && (
                                        <span className="text-danger">Please upload a document</span>
                                    )}
                                </Col>

                                <Col>
                                    <Form.Select
                                        value={item.issuingAuthority}
                                        data-has-value={!!watch(`identifiers[${index}].issuingAuthority`)}
                                        {...register(`identifiers[${index}].issuingAuthority`)}
                                        onChange={(e) => handleChange(index, 'issuingAuthority', e.target.value)}>
                                        <option value="" hidden>
                                            Select Issuing Authority
                                        </option>
                                        {defaultIssuingAuthority.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col className="position-relative">
                                    <Form.Control
                                        type="date"
                                        value={item?.expiry ? formatDateForInput(item.expiry) : ''}
                                        onChange={(e) => handleChange(index, 'expiry', e.target.value)}
                                    />
                                    {index >= defaultIdentifiers?.length && (
                                        <span
                                            className="text-danger cursor-pointer position-absolute fs-5 fw-bold"
                                            style={{ right: '-2%', top: '12%' }}
                                            onClick={() => removeIdentifier(index)}>
                                            <CiCircleMinus />
                                        </span>
                                    )}
                                </Col>
                            </Row>
                        ))}
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col sm={12}>
                        <Row className="">
                            <Col sm={12}>
                                <h5>
                                    Contact Details
                                    <span
                                        className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                        onClick={addContactDetails}></span>
                                </h5>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={4}>
                                <Form.Label>Contact Type</Form.Label>
                            </Col>
                            <Col sm={4}>
                                <Form.Label>Value </Form.Label>
                            </Col>
                            <Col sm={4}>
                                <Form.Label>Use</Form.Label>
                            </Col>
                        </Row>

                        {constantContact.map((item, index) => (
                            <Row key={index} className="mb-2">
                                <Col sm={4}>
                                    <Form.Select
                                        className="text-capitalize"
                                        value={item.system}
                                        data-has-value={!!watch(`constantContact[${index}].system`)}
                                        {...register(`constantContact[${index}].system`)}
                                        onChange={(e) => handleContactChange(index, 'system', e.target.value)}
                                        disabled={contactDetails.includes(item.type)}>
                                        <option value="" hidden>
                                            Select Contact Type
                                        </option>
                                        {contactOptions.map((option) => (
                                            <option key={option} className="text-capitalize" value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col sm={4}>
                                    {item.system === 'phone' ? (
                                        <InputGroup className="position-relative">
                                            {/* Country Code Prefix */}
                                            <InputGroup.Text className="ps-4 p-0 pe-1 fw-bold text-black">
                                                +1
                                            </InputGroup.Text>

                                            {/* Phone Input */}
                                            <Form.Control
                                                type="tel"
                                                placeholder="(123)456-7890"
                                                value={formatDisplayValue(item.value)}
                                                onChange={(e) => handleContactChange(index, 'value', e.target.value)}
                                                maxLength={14}
                                                onKeyPress={(event) => {
                                                    if (!/[0-9]/.test(event.key)) event.preventDefault();
                                                }}
                                                style={{ paddingLeft: '40px' }}
                                            />
                                            {/* Flag Icon */}
                                            <div
                                                className="position-absolute"
                                                style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                                                <img src={us} alt="flag" width={20} />
                                            </div>
                                        </InputGroup>
                                    ) : (
                                        <Form.Control
                                            type={item.system === 'email' ? 'email' : 'text'}
                                            placeholder={item.system === 'email' ? 'Enter email' : 'Enter value'}
                                            value={item.value || ''}
                                            onChange={(e) => handleContactChange(index, 'value', e.target.value)}
                                        />
                                    )}
                                </Col>

                                <Col sm={4} className="position-relative">
                                    <Form.Select
                                        value={item.use}
                                        data-has-value={!!watch(`constantContact[${index}].use`)}
                                        {...register(`constantContact[${index}].use`)}
                                        onChange={(e) => handleContactChange(index, 'use', e.target.value)}>
                                        <option value="" hidden>
                                            Select Option
                                        </option>{' '}
                                        {/* Placeholder option */}
                                        <option value="temp">Temp</option>
                                        <option value="work">Work</option>
                                        <option value="old">Old</option>
                                        {/* Add more options as needed */}
                                    </Form.Select>
                                    {index >= contactDetails.length && (
                                        <span
                                            className="text-danger cursor-pointer position-absolute fs-5 fw-bold"
                                            style={{ right: '-1%', top: '12%' }}
                                            onClick={() => removeContact(index)}>
                                            <CiCircleMinus />
                                        </span>
                                    )}
                                </Col>
                            </Row>
                        ))}
                    </Col>
                </Row>
                <hr />

                <Row>
                    <Col sm={12}>
                        <h5>
                            Address Details
                            <span
                                className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                onClick={addAddress}></span>
                        </h5>
                    </Col>
                </Row>
                {addresses.map((item, index) => (
                    <Row key={index} className="mb-2">
                        <Col sm={4} className="mb-2">
                            <Form.Label className="mb-1">Use</Form.Label>
                            <Form.Select
                                value={item.use}
                                data-has-value={!!watch(`addresses[${index}].use`)}
                                {...register(`addresses[${index}].use`)}
                                onChange={(e) => handleAddressChange(index, 'use', e.target.value)}>
                                <option value="" hidden>
                                    Select
                                </option>
                                <option value="home">Home</option>
                                <option value="work">Work</option>
                                <option value="temp">Temp</option>
                                <option value="old">Old</option>
                                <option value="billing">Billing</option>
                                <option value="mailing">Mailing</option>
                                <option value="primary">Primary</option>
                            </Form.Select>
                        </Col>
                        <Col sm={4} className="mb-2 position-relative">
                            <Form.Label className="mb-1">Address</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Street Address"
                                value={item.line[0]}
                                onChange={(e) => {
                                    handleAddressChange(index, 'line', e.target.value);
                                    // Set active index so suggestions appear for this address
                                    setActiveAddressIndex(index);
                                    setAddressFocused(true);
                                    // Call your geolocation API with the current input value
                                    getGeolocation(e)?.then((data) => {
                                        // Expecting your getGeolocation to return an object with results
                                        if (data && data.results) {
                                            setSearchedLocations(data.results);
                                        }
                                    });
                                }}
                                onFocus={() => {
                                    setActiveAddressIndex(index);
                                    setAddressFocused(true);
                                }}
                                onBlur={() => {
                                    setTimeout(() => setAddressFocused(false), 200);
                                }}
                            />
                            {activeAddressIndex === index && addressFocused && searchedLocations?.length > 0 && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        width: '100%',
                                        maxHeight: '150px',
                                        overflowY: 'auto',
                                        zIndex: 111,
                                        backgroundColor: '#fff',
                                        border: '1px solid #ced4da',
                                        borderTop: 'none',
                                    }}>
                                    {searchedLocations.map((data, suggestionIndex) => (
                                        <p
                                            key={suggestionIndex}
                                            onClick={() => {
                                                // Extract the necessary fields from the API response
                                                const formatted = data.formatted || '';
                                                const components = data.components || {};
                                                // Build the new address object with auto-populated fields
                                                const newAddress = {
                                                    use: item.use, // preserve existing use
                                                    line: [data?.formatted ? data?.formatted : ''],
                                                    city:
                                                        components.city || components.town || components.village || '',
                                                    state: components.state || components.state_code || '',
                                                    postalCode: data?.components.postcode || item.postalCode || '', // Auto-fill or keep user input
                                                    country: components.country || '',
                                                };
                                                // Update the specific address entry
                                                const updatedAddresses = [...addresses];
                                                updatedAddresses[index] = newAddress;
                                                setAddresses(updatedAddresses);
                                                // Clear suggestions and remove focus
                                                setSearchedLocations([]);
                                                setAddressFocused(false);
                                            }}
                                            style={{
                                                margin: 0,
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                            }}
                                            className="hover-bg-change text-black">
                                            {data.formatted}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </Col>
                        {/* <Col sm={4}>
                            <Form.Label className="mb-1">State</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="State"
                                value={item.state}
                                onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                            />
                        </Col> */}
                        <Col sm={4} className="mb-2">
                            <Form.Label className="mb-1">State</Form.Label>
                            <Form.Select
                                {...register(`address[${index}].state`)}
                                value={item?.state}
                                data-has-value={!!getValues(`address[${index}].state`)}
                                onChange={(e) => {
                                    handleStateSelection(e);
                                    const updatedAddresses = [...addresses];
                                    updatedAddresses[index] = {
                                        ...updatedAddresses[index],
                                        state: e.target.value,
                                    };
                                    setAddresses(updatedAddresses);
                                }}>
                                <option value="">Select State</option>
                                {statesData?.states?.map((data) => (
                                    <option key={data?.name} data-key={data?.id} value={data?.name}>
                                        {data?.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col sm={4} className="mb-2">
                            <Form.Label className="mb-1">City</Form.Label>
                            <Form.Select
                                data-has-value={!!getValues(`address[${index}].city`)}
                                {...register(`address[${index}].city`)}
                                value={item?.city}
                                onChange={(e) => {
                                    const updatedAddresses = [...addresses];
                                    updatedAddresses[index] = {
                                        ...updatedAddresses[index],
                                        city: e.target.value,
                                    };
                                    setAddresses(updatedAddresses);
                                }}>
                                <option value="">
                                    {store?.getCitiesReducer?.loading ? 'Loading...' : 'Select City'}
                                </option>
                                {cities1?.map((data) => (
                                    <option key={data?.name} value={data?.name}>
                                        {data?.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                        {/* <Col sm={4} className="mb-2">
                            <Form.Label className="mb-1">City</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="City"
                                value={item.city}
                                onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                            />
                        </Col> */}

                        <Col sm={4}className='position-relative'>
                            <Form.Group className="mb-2">
                                <Form.Label className="mb-1">Postal Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={item.postalCode}
                                    placeholder="Postal Code"
                                    {...register(`address[${index}].postalCode`, {
                                        minLength: {
                                            value: 5,
                                            message: 'Postal code must be at least 5 characters long',
                                        },
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: 'Postal code must contain numbers only',
                                        },
                                    })}
                                    maxLength={5}
                                    onKeyPress={handleFirstSpace}
                                />
                                {addresses.length > 1 && index !== 0 && (
                                    <span
                                        className="text-danger cursor-pointer position-absolute fs-5 fw-bold"
                                        style={{ right: '-2%', top: '50%' }}
                                        onClick={() => removeAddress(index)}>
                                        <CiCircleMinus />
                                    </span>
                                )}
                                {errors?.address?.[index]?.postalCode && (
                                    <span className="text-danger">{errors.address[index].postalCode.message}</span>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>
                ))}
                <hr />
                <Row>
                    <Col sm={12}>
                        <h5>
                            Points of Contact (POC)
                            <span
                                className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                onClick={addPoc}></span>
                        </h5>
                    </Col>
                </Row>
                {pocs.map((poc, pocIndex) => (
                    <div key={pocIndex} className="p-1">
                        <Row>
                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={poc.name.text}
                                        onChange={(e) => handlePocChange(pocIndex, 'name.text', e.target.value)}
                                        placeholder="Enter full name"
                                    />
                                </Form.Group>
                            </Col>

                            <Col sm={6} className="position-relative">
                                <Form.Group>
                                    <Form.Label>Job Title/Role</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Role"
                                        value={poc.role}
                                        onChange={(e) => handlePocChange(pocIndex, 'role', e.target.value)}
                                    />
                                </Form.Group>
                                {pocs.length > 1 && (
                                    <span
                                        className="text-danger cursor-pointer position-absolute fs-5 fw-bold"
                                        style={{ right: '-1%', top: '50%' }}
                                        onClick={() => removePoc(pocIndex)}>
                                        <CiCircleMinus />
                                    </span>
                                )}
                            </Col>

                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter Email"
                                        value={poc.email}
                                        onChange={(e) => handlePocChange(pocIndex, 'email', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            {poc?.telecom?.map((telecom, telecomIndex) => (
                                <Col sm={6} key={telecomIndex}>
                                    <Form.Group className="mb-2 position-relative">
                                        <Form.Label className="mb-1">Phone Number</Form.Label>
                                        <InputGroup>
                                            {/* Country Code Prefix */}
                                            <InputGroup.Text className="ps-3 pe-1 p-0 fw-bold text-black">
                                                &nbsp;&nbsp;+1
                                            </InputGroup.Text>

                                            {/* Phone Input Field */}
                                            <Form.Control
                                                type="text"
                                                placeholder="Phone Number"
                                                value={formatDisplayValue(telecom.value)} // Apply formatting
                                                onChange={(e) =>
                                                    handleTelecomChange(pocIndex, telecomIndex, 'value', e.target.value)
                                                }
                                                maxLength={14} // To accommodate formatted (XXX)XXXXXXX
                                                onKeyPress={(event) => {
                                                    if (!/[0-9]/.test(event.key)) {
                                                        event.preventDefault(); // Prevent non-numeric input
                                                    }
                                                }}
                                            />
                                        </InputGroup>

                                        {/* Flag Icon */}
                                        <div className="position-absolute" style={{ top: '52%', left: '1%' }}>
                                            <img src={us} alt="country code flag" width={20} />
                                        </div>
                                    </Form.Group>
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))}
                <Row>
                    <Col className="d-flex gap-2 justify-content-end align-items-end">
                        <Button
                            className="custom-buttons"
                            disabled={!clinicData?.userId?.email}
                            onClick={() => {
                                setShowReset(true);
                                setValue('resetEmail', clinicData?.userId?.email);
                            }}>
                            Change Password
                        </Button>
                        <Button
                            className={`custom-buttons ${clinicData?.isParent === false ? 'd-none' : ''}`}
                            onClick={() => {
                                navigate(
                                    `/apps/rcm/addclinic?clincid=${clinicData?._id}&userId=${clinicData?.userId?._id}`
                                );
                            }}>
                            Add Multiple Practice
                        </Button>
                        <Button
                            type="submit"
                            disabled={store?.updateClinicsReducer?.loading}
                            className="mt-3 custom-buttons">
                            {store?.updateClinicsReducer?.loading ? (
                                <Spinner color="white" className="spinner-border-sm" />
                            ) : (
                                'Update'
                            )}
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Row className={`mt-2 ${clinicData?.isParent === false ? 'd-none' : ''}`}>
                <Col sm={12}>
                    <Table responsive className="table-centered table-responsive table-nowrap mb-0">
                        <thead className="text-white">
                            <tr>
                                <th className="text-white">S.No.</th>
                                <th className="text-white">PRACTICE NAME</th>
                                <th className="text-white">LOCATION</th>
                                <th className="text-white">PRACTICE TYPE</th>
                                <th className="text-white">RESOURCETYPE</th>
                                <th className="text-white">STATUS</th>
                                <th className="text-white">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store?.getClinicsByParentReducer?.loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                        <Spinner />
                                    </td>
                                </tr>
                            ) : subClinics?.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                        <h4> No Data Found</h4>
                                    </td>
                                </tr>
                            ) : (
                                subClinics?.map((data, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{data?.name}</td>
                                        <td>
                                            {' '}
                                            {data.address?.map((addr, idx) => (
                                                <span key={idx}>{addr?.line?.[0] || 'N/A'}</span>
                                            ))}
                                        </td>
                                        <td>{data?.orgType}</td>
                                        <td>{data?.resourceType || 'N/A'}</td>
                                        <td>
                                            <Form.Switch
                                                onClick={() => handleOpenStatusModal(data)}
                                                checked={data?.active === true}
                                            />
                                        </td>
                                        <td>
                                            <Link
                                                to={`/apps/rcm/updateclinic?updateid=${data?._id}`}
                                                className="action-icon">
                                                <i className="mdi mdi-square-edit-outline cursor-pointer"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Modal centered size="md" show={showReset} onHide={closeResetModal}>
                <Modal.Body>
                    <Row className=" mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">Change password</h4>
                        </Col>
                        <Col sm={1}></Col>
                    </Row>
                    <Form onSubmit={handleSubmit(sendResetMail)}>
                        <Row>
                            <Col md={12} className="d-flex justify-content-center">
                                <Form.Group className="mb-2 w-50">
                                    <Form.Control
                                        type="email"
                                        readOnly
                                        // defaultValue={mailId?.email}
                                        {...register('resetEmail')}
                                    />
                                    {errors.resetEmail && (
                                        <span className="text-danger">{errors.resetEmail.message}</span>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={12} className="text-center">
                                The practice will receive a reset password email at {clinicData?.userId?.email}.
                            </Col>
                            <Col sm={12} className="text-center d-flex justify-content-center mt-2">
                                <Button type="submit" disabled={store?.Auth?.loading} className="custom-buttons">
                                    {store?.Auth?.loading ? (
                                        <Spinner color="white" className="spinner-border-sm" />
                                    ) : (
                                        'Send'
                                    )}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
            <EmailChangeModal
                show={showOtpModal}
                onClose={closeOtpModal}
                email={clinicData?.userId?.email}
                userId={clinicData?.userId?._id}
            />
            <Modal show={statusModal} centered size="md">
                <Modal.Body>
                    <div>
                        <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                            <Col sm={1}></Col>
                            <Col sm={10}>
                                <h4 className="mb-0  d-flex align-items-center justify-content-center">
                                    <span className="text-danger">
                                        <GoAlert />
                                        &nbsp;
                                    </span>
                                    {statusData?.status === true ? 'Deactivate' : 'Activate'} Clinic
                                </h4>
                            </Col>
                            <Col sm={1}>
                                <IoMdClose className="fs-4 cursor-pointer" onClick={closeStatusModal} />
                            </Col>
                        </Row>
                        <Row className="">
                            {statusData?.status === true ? (
                                <Col sm={12}>
                                    <p className="mb-0">
                                        Once this change is applied, please be aware that{' '}
                                        <strong>{statusData?.name}</strong> will:
                                    </p>
                                    <ul>
                                        <li>Lose access to their account and will not be able to log in.</li>
                                        <li>
                                            All plans associated with their account will be deactivated or canceled.
                                        </li>
                                        <li>
                                            Any services linked to the account will be suspended and they will not be
                                            able to make any changes to account settings or details.
                                        </li>
                                    </ul>
                                </Col>
                            ) : (
                                <Col>
                                    After this {statusData?.name} will have full access to their account, plans, and
                                    services.
                                </Col>
                            )}
                            <Modal.Footer className="d-flex justify-content-end gap-2">
                                <Button className="custom-buttons" onClick={closeStatusModal}>
                                    Cancel
                                </Button>
                                <Button
                                    className="custom-buttons"
                                    disabled={store?.updateClinicsReducer?.loading}
                                    onClick={() => handleStatusUpdate()}>
                                    {store?.updateClinicsReducer?.loading ? (
                                        <Spinner color="light" className="spinner-border-sm" />
                                    ) : statusData?.status === true ? (
                                        'Deactivate'
                                    ) : (
                                        'Activate'
                                    )}
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
