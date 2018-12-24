// 存储信息，取出信息，删除信息
const MutilsCookie = {
    // 封装cookie存储cookie取出cookie
    set:function(key,val){
        var date=new Date();
        date.setHours(date.getHours() + (24 * 30))
        // var expiresHours=10;
        // console.log(date)
        // date.setTime(date.getTime()+expiresHours*60*60*60);
        console.log(date.toGMTString());
        document.cookie=key + "=" + val +";expires="+date.toGMTString()+";path=/;domain=dbuy.cn";
        // document.cookie=key + "=" + val +";path=/";        
    },
    get:function(key){
        var getCookie = document.cookie.replace(/[ ]/g,"");
        var arrCookie = getCookie.split(";")
        var tips;
        for(var i=0;i<arrCookie.length;i++){
            var arr=arrCookie[i].split("=");
            if(key==arr[0]){
                tips=arr[1];
                break;
            }
        }
        return tips;
    },
    // 删除cookie
    // del:function(key)
    // {
    //     var exp = new Date();
    //     exp.setTime(exp.getTime() - 1);
    //     var cval=MutilsCookie.get(key);
    //     if(cval!=null){
    //       document.cookie= key + "="+cval+";expires="+exp.toGMTString();
    //     }
    // } 
    

}
export default MutilsCookie;