export const addPermissions = '/api/v1/admin/permisssions';
export const getPermissions = '/api/v1/admin/permisssions';
export const deletePermissions = '/api/v1/admin/permisssions/delete';
export const updatePermissions = '/api/v1/admin/permisssions';

// ROLES
export const createRoles = '/api/v1/admin/roles/create';
export const updateRoles = '/api/v1/admin/roles/edit';
export const getRoles = '/api/v1/admin/roles';

// CLINIC
export const createClinic = '/api/v1/admin/users/create';
export const updateClinic = '/api/v1/admin/users/edit';
export const getClinic = '/api/v1/admin/clinics';
export const getClinicById = '/api/v1/admin/clinic/byId';
export const getStatedByCountry = '/api/v1/admin/states/US'
export const getCityByState = '/api/v1/admin/cities/';
export const addSubscriptionPlan = '/api/v1/admin/users/addSubscriptionPlan';
export const getClinicsByParentId = '/api/v1/admin/sub-clinics';
export const deleteClinicOnboarding = '/api/v1/admin/deleteClinicOnboarding';
export const getContract = '/api/v1/admin/getAllContracts'
// DOCTORS
export const getDoctor = '/api/v1/admin/getAllDoctors';
// PATIENTS
export const getPatients = '/api/v1/admin/getAllPatients';
// DASHBOARD
export const getAnalytics = '/api/v1/admin/analytics';
// SUBSCRIPTIONS
export const getSubscriptions = '/api/v1/admin/subscription/all'
export const createSubscriptions = '/api/v1/admin/subscription/add'
export const updateSubscriptions = '/api/v1/admin/subscription/update'
// SETTINGS
export const addMastersData = '/api/v1/admin/masterdata';
export const getMastersData = '/api/v1/admin/masterdata/getmasterData';
export const updateMastersData = '/api/v1/admin/masterdata/edit';