// @flow
import { SettingsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const createMastersDataAction = (data): AuthAction => ({
    type: SettingsActionTypes.CREATE_MASTERS_DATA,
    data
});

export const createContractAction = (data): AuthAction => ({
    type: SettingsActionTypes.CREATE_NEW_CONTRACT,
    data
});

export const getContractFormatAction = (data): AuthAction => ({
    type: SettingsActionTypes.GET_NEW_CONTRACT,
    data
});

export const getMastersDataAction = (data): AuthAction => ({
    type: SettingsActionTypes.GET_MASTERS_DATA,
    data
});

export const getTenureAction = (data): AuthAction => ({
    type: SettingsActionTypes.GET_TENURE,
    data
});

export const updateMastersDataAction = (data): AuthAction => ({
    type: SettingsActionTypes.UPDATE_MASTERS_DATA,
    data
});

export const stateEmptydAction = (): LayoutAction => ({
    type: SettingsActionTypes.STATE_EMPTY_INTIAL_STATE,

});