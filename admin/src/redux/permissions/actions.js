// @flow
import { PermissionsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const createPermissionAction = (data): AuthAction => ({
    type: PermissionsActionTypes.CREATE_PERMISSIONS,
    data
});
export const getPermissionAction = (data): AuthAction => ({
    type: PermissionsActionTypes.GET_PERMISSIONS,
    data
});
export const deletePermissionAction = (data): AuthAction => ({
    type: PermissionsActionTypes.DELETE_PERMISSIONS,
    data
});
