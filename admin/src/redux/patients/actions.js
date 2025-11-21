// @flow
import { PatientsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const getPatientsAction = (data): AuthAction => ({
    type: PatientsActionTypes.GET_PATIENTS,
    data
});

export const stateEmptydAction = (): LayoutAction => ({
    type: PatientsActionTypes.STATE_EMPTY_INTIAL_STATE,

});

export const getPatientEncounterDataAction = (data): AuthAction => ({
    type: PatientsActionTypes.GET_PATIENT_ENCOUNTER_DATA,
    data
});




