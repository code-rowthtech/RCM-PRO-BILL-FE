import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createMastersDataApi(params: any): any {
    const { data } = params;
    return api.create(URL.addMastersData, data);
}

export function createContractApi(params: any): any {
    const { data } = params;
    return api.create(URL.createContract, data);
}

export function updateContractApi(params: any): any {
    const { data } = params;
    return api.update(URL.updateContract, data);
}

export function getContractApi(params: any): any {
    const { data } = params;
    return api.get(URL.getContractapi, data);
}

export function getMastersDataApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getMastersData}?status=${data?.status}&category=${data?.category}&search=${data?.search}&page=${data?.skip}&limit=${data?.limit}`);
}

export function getTenureApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getTenure}?status=${data?.status}&category=${data?.category}&search=${data?.search}&page=${data?.skip}&limit=${data?.limit}`);
}

export function updateMastersDataApi(params: any): any {
    const { data } = params;
    return api.update(URL.updateMastersData, data)
}

export function getCodesApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getCodesApi}?codeType=${data.codeType}&search=${data.search}&status=${data.status}&limit=${data.limit}&page=${data.page}`);
}