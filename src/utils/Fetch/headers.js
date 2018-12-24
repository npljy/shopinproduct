//公用headers
// import MutilsCookie from '../cookie'
import MutilsCookie from '../cookie.js';
var headers = {
    'Content-Type': 'application/json',
    'token': MutilsCookie.get('userInfo')
}

let uploadHeaders = {
    'BrandFlag': 'TS',
    'token': MutilsCookie.get('userInfo'),
    'authorization': 'authorization-text'
};

export { headers, uploadHeaders };