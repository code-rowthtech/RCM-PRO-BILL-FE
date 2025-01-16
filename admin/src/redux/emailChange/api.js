import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function generateOtpApi(params: any): any {
    const { data } = params;
    return api.create(URL.otpGeneration, data);
}
export function verifyOtpApi(params: any): any {
    const { data } = params;
    return api.create(URL.otpVerification, data);
}

export function enterNewEmailApi(params: any): any {
    const { data } = params;
    return api.create(URL.enterNewEmail, data);
}

