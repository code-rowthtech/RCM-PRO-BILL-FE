// @flow
import { RolesActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };

export const createRolesAction = (data): AuthAction => ({
    type: RolesActionTypes.CREATE_ROLES,
    data
});

export const getRolesAction = (data): AuthAction => ({
    type: RolesActionTypes.GET_ROLES,
    data
});

