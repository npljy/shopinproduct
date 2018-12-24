import React from 'react';
import Temps from './Templetes';

let temps = new Temps();

export default class TCCreater {
    // dataArr 为三维数组
    createRowComps(dataArr) {
        let components = new Array();

        for(let i = 0; i< dataArr.length; i ++) {
            let tDArr = dataArr[i];

            let tarComponent = temps.createComponents(tDArr);

            components.push(tarComponent);
        }

        return components;
    }

    createCompsWithArray(dataArr) {
        return temps.createCompsWithArray(dataArr);
    }

    createComps(comp,props,children) {
        return temps.createComps(comp,props,children);
    }
};
