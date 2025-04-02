import React, { useEffect, useState, useRef } from 'react';
import { Col, Form, Row, Button, Table, InputGroup, Dropdown, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Spinner from '../../../../constants/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import us from '../../../../assets/images/flags/us.jpg';
import {
    createClinicAction,
    deleteClinicAction,
    getCities2Action,
    getCitiesAction,
    getClinicById,
    getClinicByParentAction,
} from '../../../../redux/clinics/actions';
import { FiDownloadCloud, FiInfo, FiMinus } from 'react-icons/fi';
import { handleUpload } from '../../../../helpers/HandleUpload';
import { encryptMessage } from '../../../../cryptoUtils';
import ToastHandle from '../../../../helpers/ToastMessage';
import { handleFirstSpace } from '../../../../helpers/noBeginningSpace';
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from 'react-icons/md';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CiCircleMinus } from 'react-icons/ci';

const ClinicForm = ({
    setActiveTab,
    setClinicId,
    clinicId,
    setBillingId,
    setMultiple,
    setContractId,
    setResetEmail,
    setIsModalRequest,
    isModalRequest,
    resetEmail,
}) => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        getValues,
        setError,
        setValue,
        clearErrors,
    } = useForm();
    const navigate = useNavigate();

    // Variable initializations
    const clinicname = watch('clinicname');
    const store = useSelector((state) => state);
    const email = watch('email');
    const contact = watch('contact');
    const clinicType = watch('clinicType');
    const stateGeoLocation = watch('stateName');
    const mailingStateGeoLocation = watch('mailingStateName');
    const isFormValid = clinicname && email && clinicType;
    const [searchParams] = useSearchParams();
    const parentClinicId = searchParams.get('clincid');
    const parentUserId = searchParams.get('userId');
    const [updatePage, setUpdatePage] = useState(false);
    const [counter, setCounter] = useState(0);
    const [selectedState, setSelectedState] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);
    const [logo, setLogo] = useState(null);
    const [parentClinic, setParentclinic] = useState(null);
    const [logoName, setLogoName] = useState(null);
    const [focused, setFocused] = useState(false);
    const [mailingFocused, setMailingFocused] = useState(false);
    const [singleOrMultiple, setSingleOrMultiple] = useState(false);
    const [sameAsPrimary, setSameAsPrimary] = useState(false);
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [mailingLongitude, setMailingLongitude] = useState(null);
    const [mailingLatitude, setMailingLatitude] = useState(null);
    const [stateToSelect, setStateToSelect] = useState(null);
    const [showPopup, setShowPopup] = useState(false); // Controls success popup
    const [mailingStateToSelect, setMailingStateToSelect] = useState(null);
    const [medicalDetails, setMedicalDetails] = useState([{ name: '', number: '', url: null, fileName: '' }]);
    const [accreditationDetails, setAccreditationDetails] = useState([
        { name: '', number: '', url: null, fileName: '' },
    ]);
    let message = `A confirmation email has been sent to your registered email address. Please check your inbox (and spam folder if necessary) for the email. In the email, you will find a link to set up your account password. Follow the instructions to create a secure password and access your account. Once your password is set, you can log in and proceed with adding your billing details to complete the setup. If you face any issues, feel free to contact our support team.`;
    let sentences = message.split('.').filter((sentence) => sentence.trim() !== '');

    const [stateDetails, setStateDetails] = useState([{ name: '', number: '', url: null, fileName: '' }]);
    const [posDetails, setPosDetails] = useState([{ name: '', email: '', role: '', contact: '' }]);
    const [ids, setIds] = useState({
        userId: null,
        clinicId: null,
    });
    const [taxonomyCodes, setTaxonomyCodes] = useState(['']);
    const [stateUploading, setStateUploading] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const [createTableData, setCreateTableData] = useState(null);
    const [searchedLocations, setSearchedLocations] = useState(null);
    const [searchedMailingLocations, setSearchedMailingLocations] = useState(null);
    const [selectedStates, setSelectedStates] = useState([]);
    const [statesMenu, setStatesMenu] = useState(false);
    const [clinicData, setClinicData] = useState(null);
    const [citySearch, setCitySearch] = useState(null);
    const [mailingCitySearch, setMailingCitySearch] = useState(null);
    const [logoUploading, setLogoUploading] = useState(false);
    const [accUploading, setAccUploading] = useState(false);
    const [identifierDocument, setIdentifierDocumnent] = useState(false);
    const userId = store?.createClinicsReducer?.data?.user?._id;
    // useEffect(() => {
    //     const validCodes = taxonomyCodes.filter((code) => code.trim() !== '');
    //     if (validCodes?.length > 0) {
    //         setResetEmail({ ...resetEmail, taxonomyCodes: taxonomyCodes });
    //     }
    // }, [taxonomyCodes]);

    // GET store data
    const clinicTypeData = store?.getMastersDataReducer?.data?.clinicTypes;
    const createResponse = store?.createClinicsReducer?.data?.status;
    const clinicDataToUpdate = store?.getClinicByIdReducer?.data?.clinic;
    const clinicsList = store?.getClinicsByParentReducer?.data?.result;
    const decryptedRolesData = store?.getRolesDataReducer?.data?.roles;
    const statesData = store?.getStatesReducer?.data;
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;
    const cities2 = store?.getCitiesReducer?.cities2?.data?.cities;
    const deleteResponse = store?.deleteClinicOnboardingReducer?.data?.status;
    const cities = store?.getCitiesReducer?.data?.cities;
    const createData = store?.createClinicsReducer?.data?.data;
    const parentData = store?.getClinicByIdReducer?.data?.clinic;

    /* eslint-disable-next-line react-hooks/rules-of-hooks */

    useEffect(() => {
        if (parentClinicId && parentData) {
            setClinicData(parentData);
        }
    }, [parentClinicId, parentData]);

    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (parentClinicId) {
            const payload = {
                id: parentClinicId,
            };
            dispatch(getClinicById({ key: encryptMessage(payload) }));
            const data = {
                parentOrgId: parentClinicId,
                search: '',
            };
            dispatch(getClinicByParentAction(data));
        }
    }, [parentClinicId]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        const validateDetails = (details, keys) =>
            details.every((item) => keys.every((key) => item?.[key]?.toString().trim()));

        const updatedResetEmail = { ...resetEmail };
        if (validateDetails(accreditationDetails, ['name', 'number', 'url', 'fileName'])) {
            updatedResetEmail.accreditationDetails = accreditationDetails;
        }
        if (validateDetails(stateDetails, ['name', 'number', 'url', 'fileName'])) {
            updatedResetEmail.stateOfLicensing = stateDetails;
        }
        if (
            posDetails.every(
                (item) => item?.name?.trim() && item?.email?.trim() && item?.role?.trim() && item?.contact?.trim()
            )
        ) {
            updatedResetEmail.pos = posDetails;
        }
        if (stateToSelect?._id) {
            updatedResetEmail.primaryAddress = {
                ...updatedResetEmail.primaryAddress,
                state: stateToSelect._id,
            };
        }
        setResetEmail(updatedResetEmail);
    }, [
        accreditationDetails,
        stateDetails,
        posDetails,
        stateToSelect,
        getValues,
        latitude,
        longitude,
        watch('city'),
        watch('street'),
        watch('zip'),
    ]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (decryptedRolesData) {
            const clinicRoleId = decryptedRolesData && decryptedRolesData.find((role) => role?.name === 'clinic')?._id;
            setResetEmail({ ...resetEmail, role: clinicRoleId });
        }
    }, [decryptedRolesData]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (createResponse === 200) {
            // setShowPopup(true); // Show success popup
            reset();
            setConstantContact([]);
            setLogo(null);
            setLogoName(null);
            setConstantIdentifiers([]);
            setAddresses([{ type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: 'US' }]);
            setIdentifierDocumnent(false);
            setPocs([]);
            // setAccreditationDetails([{ name: '', number: '', url: null, fileName: '' }]);
            // setPosDetails([{ name: '', number: '', url: null, fileName: '' }]);
            // setStateDetails([{ name: '', number: '', url: null, fileName: '' }]);
            // setMedicalDetails([{ name: '', number: '', url: null, fileName: '' }]);
            // setSelectedCity(null);
            // setSelectedState(null);
            // setLatitude(null);
            // setLongitude(null);
            // setMailingLatitude(null);
            // setMailingLongitude(null);
            // setTaxonomyCodes(['']);
            // setSameAsPrimary(false);
            if (!parentClinicId && counter === 0 && !isModalRequest) {
                setBillingId(store?.createClinicsReducer?.data?.data?._id);
                setContractId(store?.createClinicsReducer?.data?.data?.clinicId?._id);
            }
        }
        if (createResponse === 200 && parentClinicId) {
            const payload = {
                parentOrgId: parentClinicId,
                search: '',
            };
            dispatch(getClinicByParentAction(payload));
        }
    }, [createResponse, clinicsList, parentClinicId, counter]);
    const handleClosePopup = () => {
        setShowPopup(false);
        setActiveTab('billing');
    };
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (deleteResponse === 200 && parentClinicId) {
            const payload = {
                parentOrgId: parentClinicId,
                search: '',
            };
            dispatch(getClinicByParentAction(payload));
        }
    }, [deleteResponse]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (resetEmail?.name && resetEmail?.email && resetEmail?.clinicType) {
            setFormValid(true);
        }
    }, [resetEmail]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (createResponse === 200 && counter === 1) {
            setIds({
                userId: store?.createClinicsReducer?.data?.clinic?._id,
                clinicId: store?.createClinicsReducer?.data?.clinic?.userId,
            });
            navigate(
                `/apps/rcm/addclinic?clincid=${store?.createClinicsReducer?.data?.clinic?._id}&userId=${store?.createClinicsReducer?.data?.clinic?.userId}`
            );
        }
    }, [createResponse, counter]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (createData) {
            setCreateTableData(createData);
        }
    }, [createData]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (latitude && longitude) {
            setFocused(false);
        }
        if (mailingLatitude && mailingLongitude) {
            setMailingFocused(false);
        }
    }, [latitude, longitude, mailingLatitude, mailingLongitude]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (stateGeoLocation) {
            setStateToSelect(
                statesData?.states && statesData?.states.find((data) => data?.state_code === stateGeoLocation)
            );
        }
        if (mailingStateGeoLocation) {
            setMailingStateToSelect(
                statesData?.states && statesData?.states.find((data) => data?.state_code === mailingStateGeoLocation)
            );
        }
    }, [stateGeoLocation, mailingStateGeoLocation]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (citySearch) {
            setValue('city', cities1 && cities1.find((data) => data?.name === citySearch)?._id);
            setResetEmail((prevState) => ({
                ...prevState,
                primaryAddress: {
                    ...prevState.primaryAddress, // Preserve other fields inside primaryAddress
                    city: cities1 && cities1.find((data) => data?.name === citySearch)?._id, // Update only the address field
                },
            }));
        }
        if (mailingCitySearch) {
            setValue('mailingCity', cities2 && cities2.find((data) => data?.name === mailingCitySearch)?._id);
        }
    }, [citySearch, cities1, mailingCitySearch, cities2]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
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
        if (mailingStateToSelect) {
            dispatch(
                getCities2Action({
                    state_code: mailingStateToSelect?.id,
                    name: mailingCitySearch ? mailingCitySearch : '',
                    limit: 25,
                    skip: '',
                })
            );
        }
    }, [stateToSelect, citySearch, mailingStateToSelect, mailingCitySearch]);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setLogoUploading);
            setLogo(url);
            setLogoName(selectedFile?.name);
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (logo && logoName) {
            setResetEmail({
                ...resetEmail,
                logo: {
                    url: logo?.url.split('?')[0], // Removes any query parameters from the URL
                    fileName: logoName, // Assigns the logo file name
                },
            });
        }
    }, [logo, logoName]);

    const handleAccreditationChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setAccUploading);
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
        // if (field === 'number'
        //     // && !/^[a-zA-Z0-9]{0,10}$/.test(value)
        // ) {
        //     return;
        // }
        // if (/\s/.test(value)) {
        //     return;
        // }

        setAccreditationDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value,
            };
            return updatedDetails;
        });
    };

    const handleAddAccreditation = () => {
        const isIncomplete = accreditationDetails.some(
            (accreditation) => !accreditation.name || !accreditation.number || !accreditation.url
        );

        if (isIncomplete) {
            ToastHandle('Please fill available accreditation fields before adding a new one.', 'danger');
            return;
        }
        setAccreditationDetails([...accreditationDetails, { name: '', number: '', url: null }]);
    };

    const handleRemoveAccreditation = (index) => {
        setAccreditationDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            return updatedDetails;
        });
    };

    const handleAddMedical = () => {
        const isIncomplete = medicalDetails.some((medical) => !medical.name || !medical.number || !medical.url);

        if (isIncomplete) {
            ToastHandle('Please fill available medical details fields before adding a new one', 'danger');
            return;
        }
        setMedicalDetails([...medicalDetails, { name: '', number: '', url: null }]);
    };

    const handleRemoveMedical = (index) => {
        setMedicalDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            return updatedDetails;
        });
    };

    const handleAddPOS = () => {
        const isIncomplete = posDetails.some((pos) => !pos.name || !pos.role || !pos.contact || !pos.email);

        if (isIncomplete) {
            ToastHandle('Please fill available POC fields before adding a new one', 'danger');
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

    const handleStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        setSelectedState(e.target.value);
        dispatch(getCitiesAction({ state_code: key, name: '', limit: 25 }));
    };
    const handleMailingStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        setMailingStateToSelect(e.target.value);
        dispatch(getCities2Action({ state_code: key, name: '', limit: 25 }));
    };

    const handleCitySelection = (e) => {
        const value = e.target.value;
        setSelectedCity(value);
    };

    const checkForDuplicates = (accreditationDetails, stateDetails) => {
        const accreditationNumbers = accreditationDetails.map((item) => item.number);
        const stateNumbers = stateDetails.map((item) => item.number);
        const hasDuplicates = (array) => {
            const filteredArray = array.filter((number) => number); // Remove empty/null values
            return filteredArray.some((number, index) => filteredArray.indexOf(number) !== index);
        };

        const accreditationHasDuplicates = hasDuplicates(accreditationNumbers);
        const stateHasDuplicates = hasDuplicates(stateNumbers);
        const crossArrayDuplicates = hasDuplicates([...accreditationNumbers, ...stateNumbers]);

        if (accreditationHasDuplicates) {
            ToastHandle(
                'Duplicate document numbers found in Accreditation Details. Please ensure all document numbers are unique.',
                'danger'
            );
            return true;
        } else if (stateHasDuplicates) {
            ToastHandle(
                'Duplicate document numbers found in State Details. Please ensure all document numbers are unique.',
                'danger'
            );
            return true;
        } else if (crossArrayDuplicates) {
            ToastHandle(
                'Duplicate document numbers found across Accreditation and State Details. Please ensure all document numbers are unique.',
                'danger'
            );
            return true;
        }
        return false;
    };
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        checkForDuplicates(accreditationDetails, stateDetails);
    }, [accreditationDetails, stateDetails]);

    // const onSubmit = (data) => {
    //     const isDuplicate = checkForDuplicates(accreditationDetails, stateDetails);
    //     if (!isDuplicate) {
    //         setIsModalRequest(false);
    //         const newPayload = {
    //             ...(parentClinicId
    //                 ? {
    //                       parentUserId: parentUserId,
    //                       parentClinicId: parentClinicId,
    //                   }
    //                 : {}),
    //             flag: parentClinicId ? 'subClinic' : 'Clinic',
    //             name: data?.clinicname,
    //             isPrimaryAndMailingAddressSame: sameAsPrimary,
    //             email: data?.email,
    //             phone: '+1' + data?.contact?.replace(/\D/g, ''),
    //             // clinicType: data?.clinicType,
    //             clinicType: 'Nerology',
    //             ...(data?.taxId ? { taxIdOrEIN: data.taxId?.replace(/\D/g, '') } : ''),
    //             ...(data?.npi ? { npiNumber: data?.npi } : ''),
    //             stateOfLicensing: stateDetails,
    //             accreditationDetails: accreditationDetails,
    //             ...(data?.clia ? { CLIA_Number: data?.clia } : {}),
    //             taxonomyCodes: taxonomyCodes,
    //             ...(data?.medicaid ? { medicaidNumber: data?.medicaid } : {}),
    //             ...(data?.medicare ? { medicareNumber: data?.medicare } : {}),
    //             pos: posDetails,
    //             primaryAddress: {
    //                 ...(data?.address ? { address: data?.address } : {}),
    //                 ...(data?.city ? { city: data?.city } : {}),
    //                 ...(data?.zip ? { zip: data?.zip } : {}),
    //                 ...(data?.street ? { street: data?.street } : {}),
    //                 ...(stateToSelect?._id ? { state: stateToSelect?._id } : {}),
    //                 ...(latitude ? { latitude: latitude } : {}),
    //                 ...(longitude ? { longitude: longitude } : {}),
    //             },
    //             mailingAddress: sameAsPrimary
    //                 ? {
    //                       ...(data?.address ? { address: data?.address } : {}),
    //                       ...(data?.city ? { city: data?.city } : {}),
    //                       ...(data?.zip ? { zip: data?.zip } : {}),
    //                       ...(data?.street ? { street: data?.street } : {}),
    //                       ...(stateToSelect?._id ? { state: stateToSelect?._id } : {}),
    //                       ...(latitude ? { latitude: latitude } : {}),
    //                       ...(longitude ? { longitude: longitude } : {}),
    //                   }
    //                 : {
    //                       ...(data?.mailingAddress ? { address: data?.mailingAddress } : {}),
    //                       ...(data?.mailingCity ? { city: data?.mailingCity } : {}),
    //                       ...(data?.mailingZip ? { zip: data?.mailingZip } : {}),
    //                       ...(data?.mailingStreet ? { street: data?.mailingStreet } : {}),
    //                       ...(mailingStateToSelect?._id ? { state: mailingStateToSelect?._id } : {}),
    //                       ...(mailingLatitude ? { latitude: mailingLatitude } : {}),
    //                       ...(mailingLongitude ? { longitude: mailingLongitude } : {}),
    //                   },
    //             logo: {
    //                 url: logo?.url.split('?')[0],
    //                 fileName: logoName,
    //             },
    //             practiceSpecialty: data?.speciality,
    //         };
    //         console.log(newPayload, 'payload')
    //         // dispatch(createClinicAction({ key: encryptMessage(newPayload) }));
    //     }
    // };

    const onSubmit = (data) => {
        const isDuplicate = checkForDuplicates(accreditationDetails, stateDetails);
        if (!isDuplicate) {
            setIsModalRequest(false);

            const newPayload = {
                ...(parentClinicId
                    ? {
                          parentUserId: parentUserId,
                          parentOrgId: parentClinicId,
                      }
                    : {}),
                flag: parentClinicId ? 'subClinic' : 'Clinic',
                name: data?.clinicname,
                // active: true,
                email: data?.email,
                orgType: data?.clinicType,
                // orgSpecialty: [],
                orgLogo: {
                    url: logo?.url.split('?')[0] || '',
                    fileName: logoName || '',
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

                telecom: constantContact,
                address: addresses,
                poc: pocs,
            };

            dispatch(createClinicAction({ key: encryptMessage(newPayload) }));
            console.log(newPayload, 'payload');
        }
    };

    const handleDeleteClinic = (data) => {
        const payload = {
            id: data,
        };
        dispatch(deleteClinicAction({ key: encryptMessage(payload) }));
    };
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
                return data;
            } catch (error) {
                console.error('Failed to fetch geocode data:', error);
                return null;
            }
        }

        return fetchGeocodeData(addressToSearch);
    };
    const getMailingGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed'; // Replace with your API key
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
                location
            )}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Failed to fetch geocode data:', error);
                return null;
            }
        }
        fetchGeocodeData(addressToSearch).then((data) => {
            if (data) {
                setSearchedMailingLocations(data?.results);
            } else {
                console.log('No data returned.');
            }
        });
    };

    const handleCheckboxChange = (stateName) => {
        setSelectedStates((prev) => {
            const updatedStates = prev.includes(stateName)
                ? prev.filter((name) => name !== stateName)
                : [...prev, stateName];
            setStateDetails((prevDetails) => {
                const newDetails = updatedStates.map(
                    (state) =>
                        prevDetails.find((detail) => detail.name === state) || {
                            name: state,
                            number: '',
                            url: null,
                            fileName: '',
                        }
                );
                return newDetails;
            });
            return updatedStates;
        });
    };

    const handleStateInputChange = (e, field, index) => {
        const value = e.target.value;
        if (field === 'number' && !/^[a-zA-Z0-9]{0,10}$/.test(value)) {
            return;
        }
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
            const url = await handleUpload(selectedFile, setStateUploading);
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
    // const menuRef = useRef(null);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    const containerRef = useRef(null);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setStatesMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddTaxonomy = () => {
        const lastCode = taxonomyCodes[taxonomyCodes.length - 1];
        if (lastCode.trim()) {
            setTaxonomyCodes([...taxonomyCodes, '']);
        } else {
            ToastHandle('Please complete the current Taxonomy Code field before adding another.', 'danger');
        }
    };
    const handleRemoveTaxonomy = (index) => {
        setTaxonomyCodes((prev) => {
            const updatedCodes = prev.filter((_, i) => i !== index);
            return updatedCodes.length > 0 ? updatedCodes : [''];
        });
    };

    // Function to handle field changes
    const handleTaxonomyChange = (index, value) => {
        const updatedCodes = [...taxonomyCodes];
        updatedCodes[index] = value;
        setTaxonomyCodes(updatedCodes);
    };
    const clinicTypeSelected = watch('clinicType');
    const watchAllFields = watch(['address', 'zip', 'stateName', 'city', 'street']);

    // const [constantIdentifiers, setConstantIdentifiers] = useState([
    // ]);
    // const [identifierTypes, SetIdentifierTypes] = useState(['NPI', 'TIN', 'EIN', 'Medicare', 'Medicaid', 'State License', 'Accreditation', 'CLIA', 'DUNS', 'Facility ID']);
    const defaultIdentifiers = ['NPI', 'TIN', 'Taxonomy'];
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
    const addressUses = ['work', 'temp', 'old', 'billing', 'mailing', 'primary'];
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
        'Taxonomy',
        'CCN',
        'Facility ID',
    ];

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
        { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: 'US' }, // Default address
    ]);
    const addressTypes = ['postal', 'physical', 'both'];
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
        setAddresses([
            ...addresses,
            { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: 'US' },
        ]);
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
                    use: 'official',
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
        updatedPocs[pocIndex].telecom.push({ system: 'phone', value: '', use: 'work' });
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
    const handleIdentifierFileChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        try {
            const url = await handleUpload(selectedFile, setIdentifierDocumnent); // Upload file
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
                                    setResetEmail({ ...resetEmail, name: e.target.value });
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
                                Practice type <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                                data-has-value={!!watch('clinicType')}
                                {...register('clinicType', { required: 'This field is required' })}
                                className={` ${!resetEmail?.email ? 'emptyField' : 'selectedField'}`}
                                onChange={(e) => setResetEmail({ ...resetEmail, clinicType: e.target.value })}>
                                <option value="" hidden>
                                    Select practice type
                                </option>
                                {clinicTypeData?.map((data) => (
                                    <option key={data?._id} value={data?.name}>
                                        {data?.name}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.clinicType && <span className="text-danger">{errors.clinicType.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group className="mb-2">
                            <Form.Label className="mb-0">
                                Email ID<span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                // defaultValue={updatePage ? clinicDataToUpdate?.email : ''}
                                {...register('email', {
                                    required: 'This field is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
                                        message: 'Please enter a valid email address',
                                    },
                                })}
                                onChange={(e) => {
                                    setResetEmail({ ...resetEmail, email: e.target.value });
                                    clearErrors('email');
                                }}
                                placeholder="Email ID"
                            />

                            {errors.email && <span className="text-danger">{errors.email.message}</span>}
                        </Form.Group>
                    </Col>
                    {/* <Col sm={3}>
    <Form.Group className="mb-2">
        <Form.Label className="mb-0">
            Email ID<span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
            type="text"
            value={constantContact[constantContact?.length+1]?.value || ''} // Get value from constantContact array
            {...register(`email-${constantContact?.length+1}`, {
                required: 'This field is required',
                pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email regex
                    message: 'Please enter a valid email address',
                },
            })}
            onChange={(e) => {
                handleContactChange(constantContact?.length+1, 'value', e.target.value); // Update via function
                setResetEmail({ ...resetEmail, email: e.target.value }); // Optional: still update here?
                // clearErrors(`email-${index}`); // Clear errors for this field
            }}
            placeholder="Email ID"
        />

        {errors[`email-${constantContact?.length+1}`] && (
            <span className="text-danger">{errors[`email-${constantContact?.length+1}`].message}</span>
        )}
    </Form.Group>
</Col> */}

                    <Col sm={3}>
                        <Form.Label className="mb-0">Upload Logo</Form.Label>
                        <div
                            onClick={() => document.getElementById(`logo-file-input`).click()}
                            className={`custom-file-upload justify-content-between cursor-pointer ${
                                logoName || logoUploading ? 'form-control' : 'custom-form-fields'
                            }`}>
                            {logoName
                                ? logoName.split('/').pop().slice(0, 30) + '...'
                                : logoUploading
                                ? 'Uploading...'
                                : 'Upload Logo'}
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
                        <Row>
                            <Col sm={12}>
                                <h5>
                                    Identifiers
                                    <span
                                        className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                        onClick={addIdentifier}></span>
                                </h5>
                            </Col>
                        </Row>

                        {/* Table Header */}
                        <Row className="fw-bold">
                            <Col>
                                <Form.Label>Identifier Type</Form.Label>
                            </Col>
                            <Col>
                                <Form.Label>Identifier Number</Form.Label>
                            </Col>
                            <Col className="d-flex align-items-center gap-2">
                                <Form.Label>Identifier Document</Form.Label>

                                {/* Tooltip Icon */}
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id="tooltip-identifier">
                                            File size should be less than 2MB. Supported formats: JPG, PNG, JPEG, PDF.
                                        </Tooltip>
                                    }>
                                    <span className="text-secondary cursor-pointer mb-2">
                                        <FiInfo size={15} />
                                    </span>
                                </OverlayTrigger>
                            </Col>
                            <Col>
                                <Form.Label>Issuing Authority</Form.Label>
                            </Col>
                            <Col>
                                <Form.Label>Identifier Expiry (If Applicable)</Form.Label>
                            </Col>
                        </Row>

                        {/* Dynamic Identifier Fields */}
                        {constantIdentifiers.map((item, index) => (
                            <Row key={index} className="mb-2">
                                {/* Identifier Type */}
                                <Col>
                                    <Form.Select
                                        value={item.type}
                                        data-has-value={!!watch(`identifiers[${index}].type`)}
                                        {...register(`identifiers[${index}].type`)}
                                        onChange={(e) => handleChange(index, 'type', e.target.value)}
                                        disabled={defaultIdentifiers.includes(item.type)}
                                        className={defaultIdentifiers.includes(item.type) ? 'no-arrow' : ''}>
                                        <option value="" disabled>
                                            Select Identifier Type
                                        </option>
                                        {identifierOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors?.[index]?.type && (
                                        <span className="text-danger">This field is required</span>
                                    )}
                                </Col>

                                {/* Identifier Number */}
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
                                                : 10
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

                                {/* File Upload */}
                                <Col className="mb-2 position-relative">
                                    <div
                                        onClick={() => document.getElementById(`fileInput-identifier-${index}`).click()}
                                        className={`custom-file-upload justify-content-between cursor-pointer ${
                                            item.file ? 'form-control' : 'custom-form-fields'
                                        }`}>
                                        {identifierDocument
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

                                {/* Issuing Authority */}
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
                                    {errors?.[index]?.issuingAuthority && (
                                        <span className="text-danger">This field is required</span>
                                    )}
                                </Col>
                                {/* Expiry Date */}
                                <Col className="position-relative">
                                    <Form.Control
                                        type="date"
                                        value={item.expiry}
                                        min={new Date().toISOString().split('T')[0]} // Sets min date to today
                                        onChange={(e) => handleChange(index, 'expiry', e.target.value)}
                                    />
                                    {errors?.[index]?.expiry && (
                                        <span className="text-danger">Select a valid expiry date</span>
                                    )}

                                    {/* Remove Identifier Button */}
                                    {index >= defaultIdentifiers.length && (
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
                                            <option className="text-capitalize" key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                {/* Contact Value Field (Dynamic) */}
                                <Col sm={4}>
                                    {item.system === 'phone' ? (
                                        <InputGroup
                                        // className="position-relative"
                                        >
                                            {/* Country Code Prefix */}
                                            {/* <InputGroup.Text className="ps-4 p-0 pe-1 fw-bold text-black">
                                                +1
                                            </InputGroup.Text> */}
                                            <InputGroup.Text className="p-0 px-1 d-flex align-items-center justify-content-center fs-6 gap-1 fw-bold text-black">
                                                <img src={us} alt="country code flag" width={16} />
                                                +1{' '}
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
                                            {/* <div
                                                className="position-absolute"
                                                style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                                                <img src={us} alt="flag" width={20} />
                                            </div> */}
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
                                        {/* <option value="home">Home</option> */}
                                        <option value="work">Work</option>
                                        <option value="old">Old</option>
                                        {/* <option value="mobile">Mobile</option> */}
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
                        <Col sm={4} className="mb-0" style={{ height: 'fit-content' }}>
                            <Form.Label className="mb-1">Address Type</Form.Label>
                            <Form.Select
                                value={item.type}
                                className="text-capitalize"
                                data-has-value={!!watch(`address[${index}].type`)}
                                {...register(`address[${index}].type`)}
                                onChange={(e) => handleAddressChange(index, 'type', e.target.value)}>
                                <option value="" hidden>
                                    Select
                                </option>
                                {addressTypes?.map((type) => (
                                    <option key={type} className="text-capitalize" value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col sm={4} className="mb-2">
                            <Form.Label className="mb-1">Address Use</Form.Label>
                            <Form.Select
                                value={item.use}
                                className="text-capitalize"
                                data-has-value={!!watch(`address[${index}].use`)}
                                {...register(`address[${index}].use`)}
                                onChange={(e) => handleAddressChange(index, 'use', e.target.value)}>
                                <option value="" hidden>
                                    Select
                                </option>
                                {addressUses.map((use) => (
                                    <option key={use} className="text-capitalize" value={use}>
                                        {use}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col sm={4} className="mb-2 position-relative">
                            <Form.Label className="mb-1">Address Line</Form.Label>
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
                                                // const formatted = data.formatted || '';
                                                // const components = data.components || {};
                                                // Build the new address object with auto-populated fields
                                                const newAddress = {
                                                    use: item.use, // preserve existing use
                                                    line: [data?.formatted ? data?.formatted : ''],
                                                    city:
                                                        data?.components.city ||
                                                        data?.components.town ||
                                                        data?.components.village ||
                                                        '',
                                                    state: data?.components.state
                                                        ? data?.components.state
                                                        : data?.components.state_code,
                                                    postalCode: data?.components.postcode || item.postalCode || '', // Auto-fill or keep user input
                                                    country: data?.components?.country || '',
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
                        {/* <Col sm={4} className="mb-2">
                            <Form.Label className="mb-1">City</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="City"
                                value={item.city}
                                onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                            />
                        </Col> */}
                        <Col sm={4} className="mb-2">
                            <Form.Label className="mb-1">State</Form.Label>
                            <Form.Select
                                {...register(`address[${index}].state`)}
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
                                    <option
                                        selected={data?.name == addresses[0]?.state}
                                        key={data?.name}
                                        data-key={data?.id}
                                        value={addresses[0]?.state}>
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
                                onChange={(e) => {
                                    const updatedAddresses = [...addresses];
                                    updatedAddresses[index] = {
                                        ...updatedAddresses[index],
                                        city: e.target.value,
                                    };
                                    setAddresses(updatedAddresses);
                                }}
                                // disabled={!selectedState || store?.getCitiesReducer?.loading}
                            >
                                <option value="">
                                    {store?.getCitiesReducer?.loading ? 'Loading...' : 'Select City'}
                                </option>
                                {cities1?.map((data) => (
                                    <option
                                        selected={data?.name == addresses[0]?.city}
                                        key={data?.name}
                                        value={data?.name}>
                                        {data?.name}
                                    </option>
                                ))}
                            </Form.Select>
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

                        <Col sm={4} className="position-relative">
                            <Form.Group className="mb-2">
                                <Form.Label className="mb-1">Postal Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={item.postalCode} // Bind postal code value
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
                                {errors.postalCode && <span className="text-danger">{errors.postalCode.message}</span>}
                            </Form.Group>
                        </Col>

                        {/* <Col sm={4} className="position-relative">
                            <Form.Label className="mb-1">Country</Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="Country"
                                value={item.country}
                                onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                            />
                        </Col> */}
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
                            {poc.telecom.map((telecom, telecomIndex) => (
                                <Col sm={6} key={telecomIndex}>
                                    <Form.Group className="mb-2 ">
                                        <Form.Label className="mb-1">Phone Number</Form.Label>
                                        <InputGroup>
                                            {/* Country Code Prefix */}
                                            <InputGroup.Text className="p-0 px-1 d-flex align-items-center justify-content-center fs-6 gap-1 fw-bold text-black">
                                                {' '}
                                                <img src={us} alt="country code flag" width={16} />
                                                +1{' '}
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
                                        {/* <div className="position-absolute" style={{ top: '52%', left: '1%' }}>
                                            <img src={us} alt="country code flag" width={20} />
                                        </div> */}
                                    </Form.Group>
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))}
                <Row>
                    <Col md={12} className="mt-2 d-flex gap-2 justify-content-end">
                        <Button
                            variant="primary"
                            type="submit"
                            className="custom-buttons"
                            // disabled={!formValid || store?.createClinicsReducer?.loading}
                            onClick={() => {
                                if (!parentClinicId) {
                                    setCounter(1);
                                } else {
                                    setCounter(2);
                                }
                            }}>
                            {store?.createClinicsReducer?.loading && parentClinicId ? (
                                <Spinner color="white" className="spinner-border-sm" />
                            ) : (
                                'Add Multiple Practices'
                            )}
                        </Button>
                        {!parentUserId && !parentClinicId && (
                            <Button
                                variant="primary"
                                type={!parentClinicId ? 'submit' : 'button'}
                                className="custom-buttons"
                                // disabled={!formValid || store?.createClinicsReducer?.loading}
                                onClick={() => {
                                    if (parentClinicId && !isModalRequest) {
                                        setMultiple(counter);
                                        setActiveTab('billing');
                                        // setSingleOrMultiple(false);
                                        // setCounter(0);
                                    }
                                }}>
                                {store?.createClinicsReducer?.loading && !parentClinicId ? (
                                    <Spinner color="white" className="spinner-border-sm" />
                                ) : (
                                    'Next'
                                )}
                            </Button>
                        )}
                    </Col>
                </Row>
                <Modal show={showPopup} onHide={handleClosePopup} centered backdrop="static">
                    <Modal.Header closeButton className="border-0 w-100 text-center d-flex justify-content-center">
                        <h5 className="m-0 text-center w-100">Practice Created Successfully!</h5>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        {/* Success Message */}
                        <h4 className="fw-bold"></h4>
                        <ul className="list-inline text-muted text-start">
                            {sentences.map((sentence, index) => (
                                <li key={index} className="list-inline-item ">
                                    {index + 1}. {sentence.trim()}.
                                </li>
                            ))}
                        </ul>
                    </Modal.Body>
                    <Modal.Footer className="border-0 d-flex justify-content-center">
                        <Button className="px-4 py-2 fw-semibold custom-buttons" onClick={handleClosePopup}>
                            Proceed to Billing
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Form>

            <Row className={`${clinicsList?.length > 0 || (clinicData && parentClinicId) ? '' : 'd-none'}`}>
                <Col>
                    <Table responsive className="mt-3 table-centered border border-muted table-nowrap mb-0 ">
                        <thead>
                            <tr>
                                <th>Sr. no.</th>
                                <th>Practice Name</th>
                                <th>Location</th>
                                <th>Practice Type</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className={`${!parentClinicId ? 'd-none' : ''}`}>
                            {/* <tr >
                                <td className='text-capitalize'>1</td>
                                <td className='text-capitalize'>{clinicData?.name}</td>
                                <td>{(clinicData?.userId?.primaryAddress?.city?.state_code || 'N/A') + ' / ' + (clinicData?.userId?.primaryAddress?.city?.name || 'N/A')}</td>
                                <td>{clinicData?.clinicType}</td>
                                <td>{clinicData?.userId?.email}</td>
                                <td>{clinicData?.userId?.phone}</td>
                                <td> <i
                                    onClick={() => navigate(`/apps/rcm/updateclinic?updateid=${clinicData?._id}`)}
                                    className=" mdi mdi-square-edit-outline"></i></td>
                            </tr> */}
                            {store?.getClinicsByParentReducer?.loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                        <Spinner />
                                    </td>
                                </tr>
                            ) : (
                                clinicsList?.map((multipleData, index) => (
                                    <tr key={multipleData?._id}>
                                        <td className="text-capitalize">{index + 1}</td>
                                        <td className="text-capitalize">{multipleData?.name}</td>
                                        <td>
                                            {' '}
                                            {multipleData?.address?.map((addr, idx) => (
                                                <span key={idx}>{addr?.line?.[0] || 'N/A'}</span>
                                            ))}
                                        </td>{' '}
                                        <td>{multipleData?.orgType}</td>
                                        <td className="text-lowercase">{multipleData?.userId?.email}</td>
                                        <td>
                                            {multipleData?.telecom?.map((tele, idx) => (
                                                <span key={idx}>{tele?.value || 'N/A'}</span>
                                            ))}
                                        </td>
                                        <td className="fs-4 d-flex gap-1">
                                            <Link
                                                to={`/apps/rcm/updateclinic?updateid=${multipleData?._id}`}
                                                className="action-icon">
                                                <i className="mdi mdi-square-edit-outline cursor-pointer"></i>
                                            </Link>
                                            {/* <i
                                                className="mdi mdi-delete cursor-pointer"
                                                style={{ cursor: store?.deleteClinicOnboardingReducer?.loading ? "not-allowed" : 'pointer' }}
                                                onClick={() => {
                                                    const payload = {
                                                        id: multipleData?._id,
                                                    };
                                                    dispatch(deleteClinicAction({ key: encryptMessage(payload) }));
                                                }}
                                            ></i> */}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );
};
export default ClinicForm;
