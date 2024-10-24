import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { ClinicsActionTypes } from './constants';
import { createClinicApi, getClinicApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createClinicsFunction(data) {
    try {
        yield put({
            type: ClinicsActionTypes.CREATE_CLINIC_LOADING,
            payload: {},
        });
        const response = yield call(createClinicApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: ClinicsActionTypes.CREATE_CLINIC_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicsActionTypes.CREATE_CLINIC_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        console.log({ error })
        yield put({
            type: ClinicsActionTypes.CREATE_CLINIC_ERROR,
            payload: error,
        });
    }
}
function* getClinicsFunction(data) {
    try {
        yield put({
            type: ClinicsActionTypes.GET_CLINIC_LOADING,
            payload: {},
        });
        const response = yield call(getClinicApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: ClinicsActionTypes.GET_CLINIC_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicsActionTypes.GET_CLINIC_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: ClinicsActionTypes.GET_CLINIC_ERROR,
            payload: error,
        });
    }
}

export function* callStateEmpty() {
    put({
        type: ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}

export function* watchCreateClinics() {
    yield takeEvery(ClinicsActionTypes.CREATE_CLINIC, createClinicsFunction);
}
export function* watchGetClinics() {
    yield takeEvery(ClinicsActionTypes.GET_CLINIC, getClinicsFunction);
}

export function* watchresetState() {
    yield takeEvery(ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

function* clinicsSaga() {
    yield all([
        fork(watchCreateClinics), fork(watchGetClinics),
        fork(watchresetState)
    ]);
}
export default clinicsSaga;
