// @flow
import { EmailChangeActionTypres } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const generateOtpAction = (data): AuthAction => ({
    type: EmailChangeActionTypres.GENERATE_OTP,
    data
});

export const verifyOtpAction = (data): AuthAction => ({
    type: EmailChangeActionTypres.VERIFY_OTP,
    data
});

export const newEmailAction = (data): AuthAction => ({
    type: EmailChangeActionTypres.NEW_EMAIL,
    data
});

export const stateEmptydAction = (): LayoutAction => ({
    type: EmailChangeActionTypres.STATE_EMPTY_INTIAL_STATE,

});