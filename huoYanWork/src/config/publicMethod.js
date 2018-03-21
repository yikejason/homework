import config from './config';
const publicMethod = {
    /**
     * 获取token
     */
    getToken(cb) {
        if(config.isDebug){
            sessionStorage.setItem('token', config.token);
            if(cb && typeof(cb) == 'function'){
                cb();
            }
        }else {
            let u = navigator.userAgent;
            if (u.indexOf('UCUX_WebBrowser') >=0) {
                try {
                    window.location.href = "ucux://getappinfo?callback=ongetappinfo";
                }catch (e){
                    console.log(e);
                }
                window.ongetappinfo = function(dataStr){
                    let data = JSON.parse(dataStr);
                    config.userPhone = data.UserCode,
                    config.token = data.AccessToken;
                    sessionStorage.setItem('token', data.AccessToken);
                    sessionStorage.setItem('userID', data.UserID);
                    config.appInfo = {
                        ver: "3000",
                        appname: data.AppName,
                        sourcechan: "youxin",
                    };
                    if(cb && typeof(cb) == 'function'){
                        cb();
                    }
                }
            }
        }
    },
    /**
    * 判断浏览器类型
    */
    isBrowser() {
        let u = navigator.userAgent;
        let browser = {
            pc:false,
            type:0, //type = 1优信/2微信/3QQapp/4QQ浏览器Android版
        };
        let IsPC = ()=> {
            let Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
            let flag = true;
            for (let v = 0; v < Agents.length; v++) {
                if (u.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        };
        if(IsPC()){
            browser.pc = true;
        }else {
            browser.pc = false;
        }
        if(u.indexOf('Android') >=0){
            if (u.indexOf('UCUX_WebBrowser') >=0) {
                browser.type = 1;
            }else if(u.indexOf('MicroMessenger') >=0){
                browser.type = 2;
            }else if(u.indexOf('MicroMessenger')<0&&u.indexOf('QQ')>=0){
                browser.type = 3;
            }else if(u.indexOf('MicroMessenger')<0&&u.indexOf('MQQBrowser')>=0){
                browser.type = 4;
            }
        }
        if(u.indexOf('iPhone') >=0){
            if (u.indexOf('UCUX_WebBrowser') >=0) {
                browser.type = 1;
            }else {
                if(u.indexOf('MicroMessenger')>=0){
                    browser.type = 2;
                }
                if(u.indexOf('QQ')>=0){
                    browser.type = 3;
                }
            }
        }
        return browser;
    },
    /**
     *优课优信app分享
     */
    appShare(json){
        let browser;
        browser = publicMethod.isBrowser();
        if(browser.type === 1){
            window.location.href = 'ucux://forward?contentjscall=share';
            window.share = ()=>{
                return JSON.stringify(json);
            };
        }
    },
    /**
     * 获取url参数
     */
    getQueryString (name) {
        let after = window.location.hash.split("?")[1];
        if(after){
            let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            let r = after.match(reg);
            if(r != null){
                return  decodeURIComponent(r[2]);
            }else {
                return null;
            }
        }
    },
    /**
     * 控制优信app右上角的显示
     */
    showAppMenu(){
        let browser;
        browser = publicMethod.isBrowser();
        if(browser.type === 1){
            window.location.href = 'ucux://webview?action=setMenu&Level=1';
        }
    },
};
export default publicMethod;