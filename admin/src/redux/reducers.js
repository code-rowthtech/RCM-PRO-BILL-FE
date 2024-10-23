// @flow
import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import { getPermissionsDataReducer, createPermissionsDataReducer, deletePermissionsDataReducer } from './permissions/reducers';
import { createRolesReducer } from './roles/reducers';
export default (combineReducers({
    Auth,
    Layout, createPermissionsDataReducer, getPermissionsDataReducer, createRolesReducer, deletePermissionsDataReducer
}): any);
