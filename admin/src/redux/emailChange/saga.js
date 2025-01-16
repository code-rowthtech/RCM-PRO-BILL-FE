import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { EmailChangeActionTypres } from './constants';
import { enterNewEmailApi, generateOtpApi, verifyOtpApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* generateOtpFunction(data) {
    try {
        yield put({
            type: EmailChangeActionTypres.GENERATE_OTP_LOADING,
            payload: {},
        });
        const response = yield call(generateOtpApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: EmailChangeActionTypres.GENERATE_OTP_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: EmailChangeActionTypres.GENERATE_OTP_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger')
        yield put({
            type: EmailChangeActionTypres.GENERATE_OTP_ERROR,
            payload: error,
        });
    }
}

function* verifyOtpFunction(data) {
    try {
        yield put({
            type: EmailChangeActionTypres.VERIFY_OTP_LOADING,
            payload: {},
        });
        const response = yield call(verifyOtpApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: EmailChangeActionTypres.VERIFY_OTP_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: EmailChangeActionTypres.VERIFY_OTP_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger')
        yield put({
            type: EmailChangeActionTypres.VERIFY_OTP_ERROR,
            payload: error,
        });
    }
}

function* newEmailFunction(data) {
    try {
        yield put({
            type: EmailChangeActionTypres.NEW_EMAIL_LOADING,
            payload: {},
        });
        const response = yield call(enterNewEmailApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: EmailChangeActionTypres.NEW_EMAIL_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: EmailChangeActionTypres.NEW_EMAIL_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger')
        yield put({
            type: EmailChangeActionTypres.NEW_EMAIL_ERROR,
            payload: error,
        });
    }
}

export function* callStateEmpty() {
    put({
        type: EmailChangeActionTypres.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}


export function* watchGenerateOtp() {
    yield takeEvery(EmailChangeActionTypres.GENERATE_OTP, generateOtpFunction);
}

export function* watchVerifyOtp() {
    yield takeEvery(EmailChangeActionTypres.VERIFY_OTP, verifyOtpFunction);
}

export function* watchNewEmail() {
    yield takeEvery(EmailChangeActionTypres.NEW_EMAIL, newEmailFunction);
}



export function* watchresetState() {
    yield takeEvery(EmailChangeActionTypres.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

function* emailChangeSaga() {
    yield all([
        fork(watchGenerateOtp),
        fork(watchVerifyOtp),
        fork(watchNewEmail),
        fork(watchresetState)
    ]);
}
export default emailChangeSaga;
