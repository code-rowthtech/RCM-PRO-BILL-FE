// @flow
import { RoleManagementActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const createUserRolesAction = (data): AuthAction => ({
    type: RoleManagementActionTypes.CREATE_USER_ROLE,
    data
});

export const updateUserRolesAction = (data): AuthAction => ({
    type: RoleManagementActionTypes.UPDATE_USER_ROLE,
    data
});

export const getUserRolesAction = (data): AuthAction => ({
    type: RoleManagementActionTypes.GET_USER_ROLE,
    data
});



export const stateEmptydAction = (): LayoutAction => ({
    type: RoleManagementActionTypes.STATE_EMPTY_INTIAL_STATE,

});