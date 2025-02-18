import React, { useEffect, useState, useRef } from 'react'
import { Col, Form, Row, Button, Table, InputGroup, Dropdown } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Spinner from '../../../../constants/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import us from '../../../../assets/images/flags/us.jpg'
import {
    createClinicAction, deleteClinicAction, getCities2Action, getCitiesAction, getClinicById, getClinicByParentAction,
} from '../../../../redux/clinics/actions';
import { FiDownloadCloud, FiMinus } from 'react-icons/fi';
import { handleUpload } from '../../../../helpers/HandleUpload';
import { encryptMessage } from '../../../../cryptoUtils';
import ToastHandle from '../../../../helpers/ToastMessage';
import { handleFirstSpace } from '../../../../helpers/noBeginningSpace';
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from 'react-icons/md';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

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
    const navigate = useNavigate()

    // Variable initializations
    const clinicname = watch('clinicname');
    const email = watch('email');
    const contact = watch('contact');
    const clinicType = watch('clinicType');
    const stateGeoLocation = watch('stateName');
    const mailingStateGeoLocation = watch('mailingStateName');
    const isFormValid = clinicname && email && contact && clinicType;
    const [searchParams] = useSearchParams();
    const parentClinicId = searchParams.get('clincid');
    const parentUserId = searchParams.get('userId');
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
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [mailingLongitude, setMailingLongitude] = useState(null);
    const [mailingLatitude, setMailingLatitude] = useState(null);
    const [stateToSelect, setStateToSelect] = useState(null);
    const [mailingStateToSelect, setMailingStateToSelect] = useState(null);
    const [medicalDetails, setMedicalDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [accreditationDetails, setAccreditationDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [stateDetails, setStateDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [posDetails, setPosDetails] = useState([
        { name: '', email: '', role: '', contact: '' }
    ])
    const [ids, setIds] = useState({
        userId: null, clinicId: null,
    })
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
    useEffect(() => {
        const validCodes = taxonomyCodes.filter(code => code.trim() !== '');
        if (validCodes?.length > 0) {
            setResetEmail({ ...resetEmail, taxonomyCodes: taxonomyCodes })
        }
    }, [taxonomyCodes])

    // GET store data
    const store = useSelector((state) => state);
    const clinicTypeData = store?.getMastersDataReducer?.data?.clinicTypes;
    const createResponse = store?.createClinicsReducer?.data?.status;
    const clinicDataToUpdate = store?.getClinicByIdReducer?.data?.clinic;
    const clinicsList = store?.getClinicsByParentReducer?.data?.data;
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
                id: parentClinicId
            }
            dispatch(getClinicById({ key: encryptMessage(payload) }))
            const data = {
                parentClinicId: parentClinicId,
            };
            dispatch(getClinicByParentAction({ key: encryptMessage(data) }));
        }
    }, [parentClinicId]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        const validateDetails = (details, keys) =>
            details.every((item) =>
                keys.every((key) => item?.[key]?.toString().trim())
            );

        const updatedResetEmail = { ...resetEmail };
        if (validateDetails(accreditationDetails, ['name', 'number', 'url', 'fileName'])) {
            updatedResetEmail.accreditationDetails = accreditationDetails;
        }
        if (validateDetails(stateDetails, ['name', 'number', 'url', 'fileName'])) {
            updatedResetEmail.stateOfLicensing = stateDetails;
        }
        if (
            posDetails.every(
                (item) =>
                    item?.name?.trim() &&
                    item?.email?.trim() &&
                    item?.role?.trim() &&
                    item?.contact?.trim()
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
    }, [accreditationDetails, stateDetails, posDetails, stateToSelect, getValues, latitude, longitude, watch('city'), watch('street'), watch('zip')]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (decryptedRolesData) {
            const clinicRoleId = decryptedRolesData && decryptedRolesData.find(role => role?.name === "clinic")?._id;
            setResetEmail({ ...resetEmail, role: clinicRoleId })
        }
    }, [decryptedRolesData])
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (createResponse === 200) {
            reset();
            setLogo(null);
            setLogoName(null);
            setAccreditationDetails([{ name: '', number: '', url: null, fileName: '' }]);
            setPosDetails([{ name: '', number: '', url: null, fileName: '' }]);
            setStateDetails([{ name: '', number: '', url: null, fileName: '' }]);
            setMedicalDetails([{ name: '', number: '', url: null, fileName: '' }]);
            setSelectedCity(null);
            setSelectedState(null);
            setLatitude(null);
            setLongitude(null);
            setMailingLatitude(null);
            setMailingLongitude(null);
            setTaxonomyCodes(['']);
            setSameAsPrimary(false);
            if (!parentClinicId && counter === 0 && !isModalRequest) {
                setBillingId(store?.createClinicsReducer?.data?.data?._id);
                setContractId(store?.createClinicsReducer?.data?.data?.clinicId?._id);
                setActiveTab('billing');
            }
        }
        if (createResponse === 200 && parentClinicId) {
            const payload = {
                parentClinicId: parentClinicId,
            };
            dispatch(getClinicByParentAction({ key: encryptMessage(payload) }));
        }
    }, [createResponse, clinicsList, parentClinicId, counter]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (deleteResponse === 200 && parentClinicId) {
            const payload = {
                parentClinicId: parentClinicId,
            };
            dispatch(getClinicByParentAction({ key: encryptMessage(payload) }));
        }
    }, [deleteResponse])
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (resetEmail?.name && resetEmail?.email && resetEmail?.phone && resetEmail?.clinicType) {
            setFormValid(true)
        }
    }, [resetEmail])
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (createResponse === 200 && counter === 1) {
            setIds({
                userId: store?.createClinicsReducer?.data?.data?._id,
                clinicId: store?.createClinicsReducer?.data?.data?.clinicId?._id
            });
            navigate(`/apps/rcm/addclinic?clincid=${store?.createClinicsReducer?.data?.data?.clinicId?._id}&userId=${store?.createClinicsReducer?.data?.data?._id}`)
        }
    }, [createResponse, counter]);
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (createData) {
            setCreateTableData(createData)
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
            setStateToSelect(statesData?.states && statesData?.states.find((data) => data?.state_code === stateGeoLocation));
        }
        if (mailingStateGeoLocation) {
            setMailingStateToSelect(statesData?.states && statesData?.states.find((data) => data?.state_code === mailingStateGeoLocation));
        }
    }, [stateGeoLocation, mailingStateGeoLocation])
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (citySearch) {
            setValue('city', cities1 && cities1.find((data) => data?.name === citySearch)?._id)
            setResetEmail((prevState) => ({
                ...prevState,
                primaryAddress: {
                    ...prevState.primaryAddress, // Preserve other fields inside primaryAddress
                    city: cities1 && cities1.find((data) => data?.name === citySearch)?._id,     // Update only the address field
                }
            }));
        }
        if (mailingCitySearch) {
            setValue('mailingCity', cities2 && cities2.find((data) => data?.name === mailingCitySearch)?._id)
        }
    }, [citySearch, cities1, mailingCitySearch, cities2])
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        if (stateToSelect) {
            dispatch(getCitiesAction({ state_code: stateToSelect?.id, name: citySearch ? citySearch : '', limit: 25, skip: '' }));
        }
        if (mailingStateToSelect) {
            dispatch(getCities2Action({ state_code: mailingStateToSelect?.id, name: mailingCitySearch ? mailingCitySearch : '', limit: 25, skip: '' }));
        }
    }, [stateToSelect, citySearch, mailingStateToSelect, mailingCitySearch])

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setLogoUploading);
            setLogo(url);
            setLogoName(selectedFile?.name)
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
                    url: logo?.url.split('?')[0],  // Removes any query parameters from the URL
                    fileName: logoName,             // Assigns the logo file name
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
            ToastHandle('Please fill available accreditation fields before adding a new one.', 'danger');
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
            ToastHandle('Please fill available medical details fields before adding a new one', 'danger');
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
            ToastHandle('Please fill available POC fields before adding a new one', 'danger');
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

    const checkForDuplicates = (accreditationDetails, stateDetails) => {
        const accreditationNumbers = accreditationDetails.map(item => item.number);
        const stateNumbers = stateDetails.map(item => item.number);
        const hasDuplicates = (array) => {
            const filteredArray = array.filter(number => number); // Remove empty/null values
            return filteredArray.some((number, index) => filteredArray.indexOf(number) !== index);
        };

        const accreditationHasDuplicates = hasDuplicates(accreditationNumbers);
        const stateHasDuplicates = hasDuplicates(stateNumbers);
        const crossArrayDuplicates = hasDuplicates([...accreditationNumbers, ...stateNumbers]);

        if (accreditationHasDuplicates) {
            ToastHandle('Duplicate document numbers found in Accreditation Details. Please ensure all document numbers are unique.', 'danger');
            return true;
        } else if (stateHasDuplicates) {
            ToastHandle('Duplicate document numbers found in State Details. Please ensure all document numbers are unique.', 'danger');
            return true;
        } else if (crossArrayDuplicates) {
            ToastHandle('Duplicate document numbers found across Accreditation and State Details. Please ensure all document numbers are unique.', 'danger');
            return true;
        }
        return false;
    };
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useEffect(() => {
        checkForDuplicates(accreditationDetails, stateDetails);
    }, [accreditationDetails, stateDetails]);

    const onSubmit = (data) => {
        const isDuplicate = checkForDuplicates(accreditationDetails, stateDetails);
        if (!isDuplicate) {
            setIsModalRequest(false);
            const newPayload = {
                ...(parentClinicId ? {
                    parentUserId: parentUserId,
                    parentClinicId: parentClinicId,
                } : {}),
                flag: parentClinicId ? "subClinic" : "Clinic",
                name: data?.clinicname,
                isPrimaryAndMailingAddressSame: sameAsPrimary,
                email: data?.email,
                phone: '+1' + data?.contact?.replace(/\D/g, ''),
                clinicType: data?.clinicType,
                ...(data?.taxId ? { taxIdOrEIN: data.taxId?.replace(/\D/g, '') } : ''),
                ...(data?.npi ? { npiNumber: data?.npi } : ''),
                stateOfLicensing: stateDetails,
                accreditationDetails: accreditationDetails,
                ...(data?.clia ? { CLIA_Number: data?.clia } : {}),
                taxonomyCodes: taxonomyCodes,
                ...(data?.medicaid ? { medicaidNumber: data?.medicaid } : {}),
                ...(data?.medicare ? { medicareNumber: data?.medicare } : {}),
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
                        ...(longitude ? { longitude: longitude } : {})
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
            // console.log(newPayload, 'payload')
            dispatch(createClinicAction({ key: encryptMessage(newPayload) }));
        }
    };
    const handleDeleteClinic = (data) => {
        const payload = {
            id: data
        }
        dispatch(deleteClinicAction({ key: encryptMessage(payload) }))
    }

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
                return data;
            } catch (error) {
                console.error("Failed to fetch geocode data:", error);
                return null;
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
            ToastHandle('Please complete the current Taxonomy Code field before adding another.', 'danger')
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

    const defaultIdentifiers = ["NPI", "CLIA", "EIN"];
    const identifierOptions = ["NPI", "TIN", "EIN", "Medicare", "Medicaid", "State License", "Accreditation", "CLIA", "DUNS", "Facility ID"];
    const [constantIdentifiers, setConstantIdentifiers] = useState([]);

    useEffect(() => {
        // Ensure default identifiers are always present
        setConstantIdentifiers(defaultIdentifiers.map(type => ({
            type,
            number: "",
            file: null,
            expiry: ""
        })));
    }, []);
    const addIdentifier = () => {
        setConstantIdentifiers([...constantIdentifiers, { type: "", number: "", file: null, expiry: "" }]);
    };

    const removeIdentifier = (index) => {
        if (index < defaultIdentifiers.length) return; // Prevent removal of default identifiers
        setConstantIdentifiers(constantIdentifiers.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        const updatedIdentifiers = [...constantIdentifiers];
        updatedIdentifiers[index][field] = value;
        setConstantIdentifiers(updatedIdentifiers);
    };

    return (
        <>
            <Form autoComplete='off'>
                <Row>
                    <Col sm={4}>
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
                            // onKeyPress={handleFirstSpace}
                            />
                            {errors.clinicname && <span className="text-danger">{errors.clinicname.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={4}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Practice type <span className='text-danger'>*</span></Form.Label>
                            <Form.Select
                                {...register('clinicType', { required: 'This field is required' })}
                                // data-has-value={!!watch('clinicType')}
                                className={` ${!resetEmail?.email ? 'emptyField' : 'selectedField'}`}
                                onChange={(e) => setResetEmail({ ...resetEmail, clinicType: e.target.value })}
                            >
                                <option value="">Select practice type</option>
                                {clinicTypeData?.map((data) => (
                                    <option key={data?._id} value={data?.name}>{data?.name}</option>
                                ))}
                            </Form.Select>
                            {errors.clinicType && <span className="text-danger">{errors.clinicType.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={4}>
                        <Form.Label>Upload Logo</Form.Label>
                        <div
                            onClick={() => document.getElementById(`logo-file-input`).click()}
                            className={`custom-file-upload justify-content-between cursor-pointer ${logoName || logoUploading ? 'form-control' : 'custom-form-fields'}`}>
                            {logoName ? logoName : logoUploading ? 'Uploading...' : 'Upload Logo'}
                            <p className='mb-0'><FiDownloadCloud /></p>
                        </div>
                        <Form.Control
                            type="file"
                            id='logo-file-input'
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
                        <Row className="mb-3">
                            <Col sm={9}>
                                <h5>Identifiers</h5>
                            </Col>
                            <Col sm={3} className="text-end">
                                <Button variant="success" onClick={addIdentifier}>+</Button>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={3}><Form.Label>Identifier Type</Form.Label></Col>
                            <Col sm={3}><Form.Label>Identifier Number</Form.Label></Col>
                            <Col sm={3}><Form.Label>Identifier Document</Form.Label></Col>
                            <Col sm={2}><Form.Label>Identifier Expiry</Form.Label></Col>
                            <Col sm={1}><Form.Label>Action</Form.Label></Col>
                        </Row>

                        {constantIdentifiers.map((item, index) => (
                            <Row key={index} className="mb-2">
                                <Col sm={3}>
                                    <Form.Select
                                        value={item.type}
                                        onChange={(e) => handleChange(index, "type", e.target.value)}
                                        disabled={defaultIdentifiers.includes(item.type)}
                                    >
                                        <option value='' disabled>Select Identifier Type</option>
                                        {identifierOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col sm={3}>
                                    <Form.Control
                                        type="text"
                                        placeholder='Document Number'
                                        value={item.number}
                                        onChange={(e) => handleChange(index, "number", e.target.value)}
                                    />
                                </Col>
                                <Col sm={3}>
                                    <Form.Control
                                        type="file"
                                        onChange={(e) => handleChange(index, "file", e.target.files[0])}
                                    />
                                </Col>
                                <Col sm={2}>
                                    <Form.Control
                                        type='date'
                                        value={item.expiry}
                                        onChange={(e) => handleChange(index, "expiry", e.target.value)}
                                    />
                                </Col>
                                <Col sm={1} className="text-center">
                                    {index >= defaultIdentifiers.length && (
                                        <Button variant="danger" onClick={() => removeIdentifier(index)}>-</Button>
                                    )}
                                </Col>
                            </Row>
                        ))}
                    </Col>
                </Row>
            </Form>
        </>
    );
}
export default ClinicForm;
