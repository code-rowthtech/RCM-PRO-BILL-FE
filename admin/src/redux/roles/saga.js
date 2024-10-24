import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { RolesActionTypes } from './constants';
import { createRolesApi, getRolesApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createRolesFunction(data) {
    try {
        yield put({
            type: RolesActionTypes.CREATE_ROLES_LOADING,
            payload: {},
        });
        const response = yield call(createRolesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {

            yield put({
                type: RolesActionTypes.CREATE_ROLES_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: RolesActionTypes.CREATE_ROLES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: RolesActionTypes.CREATE_ROLES_ERROR,
            payload: error,
        });
    }
}

function* getRolesFunction(data) {
    try {
        yield put({
            type: RolesActionTypes.GET_ROLES_LOADING,
            payload: {},
        });
        const response = yield call(getRolesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {

            yield put({
                type: RolesActionTypes.GET_ROLES_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: RolesActionTypes.GET_ROLES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        // console.log(error, 'error in getPermissions')
        yield put({
            type: RolesActionTypes.GET_ROLES_ERROR,
            payload: error,
        });
    }
}

export function* callStateEmpty() {
    put({
        type: RolesActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}

export function* watchCreateRoles() {
    yield takeEvery(RolesActionTypes.CREATE_ROLES, createRolesFunction);
}
export function* watchGetRoles() {
    yield takeEvery(RolesActionTypes.GET_ROLES, getRolesFunction);
}
export function* watchresetState() {
    yield takeEvery(RolesActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

function* rolesSaga() {
    yield all([
        fork(watchCreateRoles), fork(watchGetRoles), fork(watchresetState)
    ]);
}
export default rolesSaga;
