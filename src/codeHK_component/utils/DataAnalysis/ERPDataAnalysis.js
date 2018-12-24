import React, {Component} from 'react';

const DataChecker = {
    check(data) {
        let isSucess = true;

        if(data instanceof Object) {
            // 业务失败
            if(data.code === '1') {
                isSucess = false;
            }
            // 业务成功
            else if(data.code === '0') {
                isSucess = true;
            }
            // 权限不够
            else if(data.code === '401') {
                isSucess = false;
				 window.parent.postMessage({
                    logout:'1',//token失效，退出登录
                },'*');
            }
            // 没有用户
            else if(data.code === '400') {
                isSucess = false;
				 window.parent.postMessage({
                    logout:'1',//token失效，退出登录
                },'*');
            }
            // 连接成功，但是Exception异常
            else if(data.code === '999') {
                isSucess = false;
            }
        }
        else {
            isSucess = false;
        }

        return isSucess;
    }
}

export default DataChecker;