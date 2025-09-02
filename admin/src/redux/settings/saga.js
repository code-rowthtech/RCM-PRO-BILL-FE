import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { SettingsActionTypes } from './constants';
import { createMastersDataApi, getMastersDataApi, getTenureApi, updateMastersDataApi, createContractApi, updateContractApi, getContractApi, getCodesApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* createMastersDataFunction(data) {
    try {
        yield put({
            type: SettingsActionTypes.CREATE_MASTERS_DATA_LOADING,
            payload: {},
        });
        const response = yield call(createMastersDataApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success')
            yield put({
                type: SettingsActionTypes.CREATE_MASTERS_DATA_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: SettingsActionTypes.CREATE_MASTERS_DATA_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger')
        yield put({
            type: SettingsActionTypes.CREATE_MASTERS_DATA_ERROR,
            payload: error,
        });
    }
}

function* createContractFunction(data) {
    try {
        yield put({
            type: SettingsActionTypes.CREATE_NEW_CONTRACT_LOADING,
            payload: {},
        });
        const response = yield call(createContractApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success')
            yield put({
                type: SettingsActionTypes.CREATE_NEW_CONTRACT_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: SettingsActionTypes.CREATE_NEW_CONTRACT_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger')
        yield put({
            type: SettingsActionTypes.CREATE_NEW_CONTRACT_ERROR,
            payload: error,
        });
    }
}

function* updateContractFunction(data) {
    try {
        yield put({
            type: SettingsActionTypes.UPDATE_CONTRACT_LOADING,
            payload: {},
        });
        const response = yield call(updateContractApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success')
            yield put({
                type: SettingsActionTypes.UPDATE_CONTRACT_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: SettingsActionTypes.UPDATE_CONTRACT_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger')
        yield put({
            type: SettingsActionTypes.UPDATE_CONTRACT_ERROR,
            payload: error,
        });
    }
}

function* getContractFunction(data) {
    try {
        yield put({
            type: SettingsActionTypes.GET_NEW_CONTRACT_LOADING,
            payload: {},
        });
        const response = yield call(getContractApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success')
            yield put({
                type: SettingsActionTypes.GET_NEW_CONTRACT_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: SettingsActionTypes.GET_NEW_CONTRACT_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger')
        yield put({
            type: SettingsActionTypes.GET_NEW_CONTRACT_ERROR,
            payload: error,
        });
    }
}

function* getMastersDataFunction(data) {
    try {
        yield put({
            type: SettingsActionTypes.GET_MASTERS_DATA_LOADING,
            payload: {},
        });
        const response = yield call(getMastersDataApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: SettingsActionTypes.GET_MASTERS_DATA_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: SettingsActionTypes.GET_MASTERS_DATA_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: SettingsActionTypes.GET_MASTERS_DATA_ERROR,
            payload: error,
        });
    }
}

function* getTenureDataFunction(data) {
    try {
        yield put({
            type: SettingsActionTypes.GET_TENURE_LOADING,
            payload: {},
        });
        const response = yield call(getTenureApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: SettingsActionTypes.GET_TENURE_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: SettingsActionTypes.GET_TENURE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: SettingsActionTypes.GET_TENURE_ERROR,
            payload: error,
        });
    }
}

function* updateMastersDataFunction(data) {
    const dataFromApi = JSON.parse(decryptMessage(data?.data?.key));
    try {
        yield put({
            type: SettingsActionTypes.UPDATE_MASTERS_DATA_LOADING,
            payload: {},
        });
        const response = yield call(updateMastersDataApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            const ifStatus = dataFromApi?.isActive;
            const setting = dataFromApi?.settingType;
            if (ifStatus === true) {
                ToastHandle(`${setting.charAt(0).toUpperCase() + setting.slice(1)} activated successfully`, 'success');
            } else if (ifStatus === false) {
                ToastHandle(`${setting.charAt(0).toUpperCase() + setting.slice(1)} deactivated successfully`, 'success');
            } else {
                ToastHandle(decryptedData?.message, 'success');
            }
            yield put({
                type: SettingsActionTypes.UPDATE_MASTERS_DATA_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: SettingsActionTypes.UPDATE_MASTERS_DATA_RESET,
                payload: {},
              });   
        } else {
            yield put({
                type: SettingsActionTypes.UPDATE_MASTERS_DATA_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger')
        yield put({
            type: SettingsActionTypes.UPDATE_MASTERS_DATA_ERROR,
            payload: error,
        });
    }
}

function* getCodesFunction(data) {
    try {
        yield put({
            type: SettingsActionTypes.GET_CODES_LOADING,
            payload: {},
        });
        const response = yield call(getCodesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success')
            yield put({
                type: SettingsActionTypes.GET_CODES_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: SettingsActionTypes.GET_CODES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger')
        yield put({
            type: SettingsActionTypes.GET_CODES_ERROR,
            payload: error,
        });
    }
}
export function* callStateEmpty() {
    put({
        type: SettingsActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}

export function* watchCreateMastersData() {
    yield takeEvery(SettingsActionTypes.CREATE_MASTERS_DATA, createMastersDataFunction);
}

export function* watchCreateContractData() {
    yield takeEvery(SettingsActionTypes.CREATE_NEW_CONTRACT, createContractFunction);
}
export function* watchUpdateContractData() {
    yield takeEvery(SettingsActionTypes.UPDATE_CONTRACT, updateContractFunction);
}

export function* watchGetContractData() {
    yield takeEvery(SettingsActionTypes.GET_NEW_CONTRACT, getContractFunction);
}
export function* watchGetMastersData() {
    yield takeEvery(SettingsActionTypes.GET_MASTERS_DATA, getMastersDataFunction);
}
export function* watchGetTenureData() {
    yield takeEvery(SettingsActionTypes.GET_TENURE, getTenureDataFunction);
}
export function* watchUpdateMastersData() {
    yield takeEvery(SettingsActionTypes.UPDATE_MASTERS_DATA, updateMastersDataFunction);
}

export function* watchresetState() {
    yield takeEvery(SettingsActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

export function* watchGetCodesData() {
    yield takeEvery(SettingsActionTypes.GET_CODES, getCodesFunction);
}
function* settingsSaga() {
    yield all([
        fork(watchCreateMastersData),
        fork(watchGetMastersData),
        fork(watchGetContractData),
        fork(watchCreateContractData),
        fork(watchUpdateContractData),
        fork(watchGetTenureData),
        fork(watchUpdateMastersData),
        fork(watchGetCodesData),
        fork(watchresetState),

    ]);
}
export default settingsSaga;
