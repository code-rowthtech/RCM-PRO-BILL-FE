// @flow
import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import { getPermissionsDataReducer, createPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer } from './permissions/reducers';
import { createRolesReducer, getRolesDataReducer, updateRolesReducer } from './roles/reducers';
import {
    createClinicsReducer, getClinicsReducer, getClinicByIdReducer, updateClinicsReducer,
    getStatesReducer, getCitiesReducer, createSubscriptionPlanReducer, getClinicsByParentReducer,
    deleteClinicOnboardingReducer, getContract,
    getContractReducer, generateContractReducer
} from './clinics/reducers';
import { getDoctorsReducer } from './doctors/reducers';
import { getAnalyticsReducer } from './dashboard/reducers';
import { getPatientsReducer } from './patients/reducers';
import { getSubscriptionsReducer, createSubscriptionsReducer, updateSubscriptionsReducer } from './subscriptions/reducers';
import { createMastersDataReducer, getMastersDataReducer, updateMastersDataReducer, getTenureReducer } from './settings/reducers';
import { createUserRolesReducer, getUserRolesReducer, updateUserRolesReducer } from './rolemanagement/reducers';
export default (combineReducers({
    Auth,
    Layout,
    createPermissionsDataReducer, getPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer,
    createRolesReducer, getRolesDataReducer, updateRolesReducer,
    createClinicsReducer, getClinicsReducer, getClinicByIdReducer, updateClinicsReducer,
    getStatesReducer, getCitiesReducer, createSubscriptionPlanReducer, getClinicsByParentReducer, deleteClinicOnboardingReducer, getContractReducer, generateContractReducer,
    getAnalyticsReducer,
    getDoctorsReducer,
    getPatientsReducer,
    getSubscriptionsReducer, createSubscriptionsReducer, updateSubscriptionsReducer,
    createMastersDataReducer, getMastersDataReducer, updateMastersDataReducer, getTenureReducer,
    createUserRolesReducer, getUserRolesReducer, updateUserRolesReducer
}): any);
