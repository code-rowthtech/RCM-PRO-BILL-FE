import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function getSubscriptionsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getSubscriptions}?page=${data?.skip}&search=${data?.search}&status=${data?.status}`);
}

export function createSubscriptionsApi(params: any): any {
    const { data } = params;
    return api.create(URL.createSubscriptions, data);
}

export function updateSubscriptionsApi(params: any): any {
    const { data } = params;
    return api.update(URL.updateSubscriptions, data);
}

