const BaseRoute = '/api/v1/admin';

// Permissions
export const addPermissions = '/api/v1/admin/permisssions';
export const getPermissions = `${BaseRoute}/permissions/`;
export const deletePermissions = '/api/v1/admin/permisssions/delete';
export const updatePermissions = '/api/v1/admin/permisssions';

// ROLES
export const createRoles = `${BaseRoute}/roles/create`;
export const updateRoles = `${BaseRoute}/roles/edit`;
export const getRoles = `${BaseRoute}/roles`;

// CLINIC
export const createClinic = `${BaseRoute}/clinics/create`;
export const updateClinic = `${BaseRoute}/clinics/update`;
export const getClinic = `${BaseRoute}/clinics/all`;
export const getClinicById = `${BaseRoute}/clinics/by-id`;
export const getStatedByCountry = '/api/v1/admin/address/states'
export const getCityByState = '/api/v1/admin/address/cities/';
export const addSubscriptionPlan = `${BaseRoute}/clinics/subscription/add`;
export const getClinicsByParentId = `${BaseRoute}/clinics/subclinics`;
export const deleteClinicOnboarding = `${BaseRoute}/clinics/delete`;
// export const getContract = '/api/v1/admin/getAllContracts'
export const getContract = `${BaseRoute}/contracts/details`;
export const generateContract = `${BaseRoute}/contracts/`;

// DOCTORS
export const getDoctor = '/api/v1/admin/getAllDoctors';

// PATIENTS
export const getPatients = '/api/v1/admin/getAllPatients';

// DASHBOARD
export const getAnalytics = '/api/v1/admin/analytics';

// SUBSCRIPTIONS
export const getSubscriptions = '/api/v1/admin/subscriptions/all'
export const createSubscriptions = '/api/v1/admin/subscriptions/create'
export const updateSubscriptions = '/api/v1/admin/subscriptions/edit'

// SETTINGS
export const addMastersData = `${BaseRoute}/master-data/create`;
export const createContract = '/api/v1/admin/contract/template';
export const updateContract = "/api/v1/admin/update-template";
export const getContractapi = '/api/v1/admin/contracts/templates?type=Standard';
export const getMastersData = `${BaseRoute}/master-data/`;
export const getTenure = `${BaseRoute}/master-data/tenure`;
export const updateMastersData = `${BaseRoute}/master-data/edit`;
export const getCodesApi = `${BaseRoute}/codes/find`;



// ROLE MANAGEMENT
export const addNewUserRole = `${BaseRoute}/role-management/create`;
export const updateNewUserRole = `${BaseRoute}/role-management/edit`;
export const getNewUserRole = `${BaseRoute}/role-management/`;

// Email changing
export const otpGeneration = 'api/v1/admin/users/requestOtpForEmailVerification';
export const otpVerification = 'api/v1/admin/users/verifyOtpForEmailChange';
export const enterNewEmail = 'api/v1/admin/users/changeEmail';