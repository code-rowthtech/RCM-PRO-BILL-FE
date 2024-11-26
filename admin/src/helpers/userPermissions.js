const storageData = sessionStorage.getItem('hyper_user');
export const userPermissions = JSON.parse(storageData)?.permissions