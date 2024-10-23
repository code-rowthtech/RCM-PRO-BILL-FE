import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { RolesActionTypes } from './constants';
import { createRolesApi } from './api';
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

export function* watchCreateRoles() {
    yield takeEvery(RolesActionTypes.CREATE_ROLES, createRolesFunction);
}

function* rolesSaga() {
    yield all([
        fork(watchCreateRoles),
    ]);
}
export default rolesSaga;
