// @flow
import { ClinicsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };

export const createClinicAction = (data): AuthAction => ({
    type: ClinicsActionTypes.CREATE_CLINIC,
    data
});
export const getClinicAction = (data): AuthAction => ({
    type: ClinicsActionTypes.GET_CLINIC,
    data
});

export const stateEmptydAction = (): LayoutAction => ({
    type: ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE,

});