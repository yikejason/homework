
import {Toast} from 'antd-mobile';

function buildParams(prefix, obj, traditional, add) {
    let name;
    if (Array.isArray(obj)) {
        // Serialize array item.
        for (let i in obj) {
            if (traditional || /\[\]$/.test(prefix)) {
                // Treat each array item as a scalar.
                add(prefix, obj[i]);
            } else {
                // Item is non-scalar (array or object), encode its numeric index.
                buildParams(
                    prefix + "[" + (typeof obj[i] === "object" && obj[i] != null ? i : "") + "]",
                    obj[i],
                    traditional,
                    add
                );
            }
        }
    } else if (!traditional && Object.prototype.toString.call(obj) === "[object Object]") {
        // Serialize object item.
        for (name in obj) {
            buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
        }
    } else {
        // Serialize scalar item.
        add(prefix, obj);
    }
}
/**
 *get请求
 */
export function getFetch(url,headReq) {
   if(!headReq){
       headReq = {};
   }
    let reqArray = Object.keys(headReq),reqHead='',header,token = sessionStorage.getItem('token');
    // Toast.loading('',999);
    if (reqArray.length !== 0) {
        reqArray.map((e, i) => {
            reqHead = reqHead + "&" + e + "=" + headReq[e];
        })
    }else {
        reqHead = "";
    }
    header = {
        method: "get",
    };
    return fetch(`${url}?token=${token}${reqHead}`, header).then(function(response) {
        // Toast.hide();
        return response.json();
    }).catch(function(e) {
        // Toast.info(e,3);
        console.log(e);
    });
}

/**
 *post请求
 */
export function postFetch(url,headReq = null, bodyReq = null) {
    let reqHead = "",token = sessionStorage.getItem('token'),header;
    // setTimeout(()=>{
    //     Toast.loading('loading',10000);
    // },0);
    if (headReq) {
        let reqArray = Object.keys(headReq);
        reqArray.map((e, i) => {
            reqHead = reqHead + "&" + e + "=" + headReq[e];
        })
    }
    header = {
        method: "post",
        headers: {
            "Content-Type":`application/x-www-form-urlencoded`
        },
        body:queryString(bodyReq ? bodyReq : "") ,
    };
    return fetch(`${url}?${reqHead === "" ? "" : reqHead}`,header).then(function(response) {
        // Toast.hide();
        return response.json();
    }).catch(function(e) {
        Toast.info(e,3);
        console.log(e);
    });
}

function queryString(a, traditional) {
    let prefix,
        s = [],
        add = function(key, valueOrFunction) {
            // If value is a function, invoke it and use its return value
            let value = Object.prototype.toString.call(valueOrFunction) === '[object Function]' ?
                valueOrFunction() :
                valueOrFunction;
            s[s.length] = encodeURIComponent(key) + "=" +
                encodeURIComponent(value == null ? "" : value);
        };
    // If an array was passed in, assume that it is an array of form elements.
    //if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
    if (Array.isArray(a)) {
        // Serialize the form elements
        for (let i in a) {
            add(i, a[i]);
        }
    } else {
        // If traditional, encode the "old" way (the way 1.3.2 or older
        // did it), otherwise encode params recursively.
        for (prefix in a) {
            buildParams(prefix, a[prefix], traditional, add);
        }
    }
    // Return the resulting serialization
    return s.join("&");
}

