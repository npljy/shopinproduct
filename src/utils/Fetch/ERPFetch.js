/**
 * Created by Cwwng on 2018/2/6.
 */
import {headers} from "./headers"

var Setting = {
    host: 'http://localhost:3006',
    headers: headers
};

const ERPFetch = {

    fetch(init, path, paramters) {
        return new Promise(function (resolve, reject) {
            let initHeader = init;
            initHeader.header = Setting.headers;
            fetch(path, {
                method: 'POST',
                headers: initHeader.header,
                body: JSON.stringify(paramters),
            }).then((response) => {
                if (response.ok) {
                    resolve(response.json());
                } else {
                    reject({status: response.status})
                }
            }).catch((err) => {
                console.log('err = ' + JSON.stringify(err))
                reject(err);
            })
        });
    },

    fetchGet(init, path, paramters) {
        return new Promise(function (resolve, reject) {
            let initHeader = init;
            initHeader.header = Setting.headers;
            var AllPath = path + '?';
            for (var key in paramters) {
                let tempPath = AllPath + key + '=' + paramters[key] + '&';
                AllPath = tempPath
            }
            if(AllPath.endsWith("&")){
                AllPath = AllPath.substring(0,AllPath.length-1);
            }
            fetch(AllPath, {
                method: 'GET',
                headers: initHeader.header,
            }).then((response) => {
                if (response.ok) {
                    resolve(response.json());
                } else {
                    reject({status: response.status})
                }
            }).catch((err) => {
                console.log('err = ' + JSON.stringify(err));
                reject(err);
            })
        });
    },
    // 导出excel表格
    fetchExcel(init, path, paramters) {
        return new Promise(function (resolve, reject) {
            let initHeader = init;
            initHeader.header = Setting.headers;
            fetch(path, {
                method: 'POST',
                headers: initHeader.header,
                body:JSON.stringify(paramters),    
            }).then(
                res => res.blob().then(blob => { 
                    var a = document.createElement('a'); 
                    var url = window.URL.createObjectURL(blob); 
                    var filename = res.headers.get('Content-Disposition'); 
                    a.href = url; 
                    a.download = filename; 
                    a.click(); 
                    window.URL.revokeObjectURL(url); 
                    if(filename){
                        resolve('ok')
                    }
                // console.log('response:'+JSON.stringify(res))
            })).catch((err)=> {
                console.log('err = ' + JSON.stringify(err))
                reject(err);
            })
        });
    }
};

export default ERPFetch;