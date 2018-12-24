import MutilsCookie from '../cookie';
const tools = {
    //判断一个对象是否为空
    voidObj:function(obj){
        if(Object.prototype.toString.call(obj) !== "[object Object]")return false;
        for(var attr in obj){
            return false;
        }
        return true;
    },
    //修改时间格式
    getMyDate:function(val){
        if(!val)return;
        let date = new Date(val*1);
        return date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+","+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    },
    //判断输入字符串长度（汉字算两个字符，字母数字算一个）
    getByteLen:function(val){
        var len = 0;
        for (var i = 0; i < val.length; i++){
            var a = val.charAt(i);
            if (a.match(/[^\x00-\xff]/ig) != null) {
                len += 2;
            }
            else {
                len += 1;
            }
        }
        return len;
    },
    //查找两个数组中相同的元素，然后给这个元素添加属性
    fndSameArr: function (a, b) {
        if (Object.prototype.toString.call(a) !== "[object Array]" || Object.prototype.toString.call(a) !== "[object Array]") return [];
        for (let i = 0; i < b.length; i++) {
            for (let j = 0; j < a.length; j++) {
                if (a[j].erpCategoryNo === b[i]) {
                    a[j].disabled = true;
                }
            }
        }
        return a;
    },
    //去除a数组中与b数据中元素相同的值
    twoArrDiff: function (a, b) {
        if (Object.prototype.toString.call(a) !== "[object Array]" || Object.prototype.toString.call(a) !== "[object Array]") return [];
        for (let i = 0; i < b.length; i++) {
            for (let j = 0; j < a.length; j++) {
                if (a[j].key === b[i].key) {
                    a.splice(j, 1);
                    j = j - 1;
                }
            }
        }
        return a;
    },
    //去除数组arr中str值相同的元素
    arrDiff: function (arr, str) {
        if (!arr || !arr.length) return [];
        let result = [], i, j, len = arr.length;
        for (i = 0; i < len; i++) {
            for (j = i + 1; j < len; j++) {
                if (arr[i][str] === arr[j][str]) {
                    j = ++i;
                }
            }
            result.push(arr[i]);
        }
        return result;
    },
    // 查找最后一级子级，同级字符串长度是相同的，因最后一级子级的字符串长度是最长的
    findLastSon: function (arr) {
        if (!arr || !arr.length) return [];
        let lastLevel = -Infinity;
        arr.forEach(e => {
            e.length > lastLevel && (lastLevel = e.length)
        })
        return arr.filter(e => e.length === lastLevel)
    },
    findParent: function (arr) {
        if (!arr || !arr.length) return [];
        let lastLevel = Infinity;
        arr.forEach(e => {
            e.length < lastLevel && (lastLevel = e.length)
        })
        return arr.filter(e => e.length === lastLevel)
    },
    // 递归查找子级，如果子级的children为空，则删掉这个子级，否则，继续递归children
    intoArr: function (arr) {
        if (Object.prototype.toString.call(arr) !== "[object Array]") return [];
        arr.forEach((e, i, a) => {
            if (e.children) {
                //console.log("lllll",e.children.length)
                if (e.children.length === 0) a.splice(i, 1);
                else if (e.children.length > 0) this.intoArr(e.children);
            }
        })
        return arr;
    },
    // 找到arr中子项productAttrNo的值为str时 的productAttrValue的值
    findStrVal: function (arr, str, val) {
        if (Object.prototype.toString.call(arr) !== "[object Array]" || !arr.length || !str) return [];
        let tmpStr = "";
        arr.forEach(e => {
            if (e.productAttrNo === str) tmpStr = e[val];
        })
        return tmpStr;
    },
    //查看cookie是否过期
    check:function(data) {
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
                alert("登录已过期，请重新登录")
				 window.parent.postMessage({
                    logout:'1',//token失效，退出登录
                },'*');
            }
            // 没有用户
            else if(data.code === '400') {
                isSucess = false;
                alert("登录已失效，请重新登录")
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
    },
    //封装fetch
    fetchData: function (obj) {
        let defaultObj = {
            url:'',
            type:'post',
            token:MutilsCookie.get('userInfo'),
            params:{},
            success:function(){},
            fail:function(){}
        }
        let attrs = Object.assign(defaultObj,obj);
        let bodyAttr = {};
        if (JSON.stringify(attrs.params).length === 2){
            bodyAttr={
                'method': attrs.type,
            }
        }
        else{
            bodyAttr={
                'method': attrs.type,
                'body': JSON.stringify(attrs.params)
            }
        }
        let request = new Request(attrs.url, {
            headers: new Headers({
                'Content-Type': 'application/json',
                'token':attrs.token
            })
        })

        fetch(request, bodyAttr)
            .then(res => {
                return (res.json())
            }).then(res => {
                if (this.check(res) && res.code==="0") {
                    attrs.success(res.content);
                }else{
                    attrs.fail(res.msg);
                }
            })
            .catch(err => {
                attrs.fail("系统错误");
            });
    }

}
export default tools;