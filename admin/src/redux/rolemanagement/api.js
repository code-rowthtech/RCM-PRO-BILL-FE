import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createUserRolesApi(params: any): any {
    const { data } = params;
    // console.log(data)
    return api.get(URL.addNewUserRole, data);
}

