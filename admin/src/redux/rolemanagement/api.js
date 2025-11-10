import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createUserRolesApi(params: any): any {
    const { data } = params;
    return api.create(URL.addNewUserRole, data);
}

export function updateUserRolesApi(params: any): any {
    const { data } = params;
    return api.update(URL.updateNewUserRole, data);
}

export function getUserRolesApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getNewUserRole}?page=${data?.skip}&limit=${data?.limit}&status=${data?.status}&search=${data?.search}`);
}

