import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createPermissionsApi(params: any): any {
    const { data } = params;
    return api.create(URL.addPermissions, data);
}
export function getPermissionsApi(params: any): any {
    const { data } = params;
    return api.get(URL.getPermissions, data);
}
export function deletePermissionsApi(params: any): any {
    const { data } = params;
    console.log(params)
    return api.create(URL.deletePermissions, data);
}
