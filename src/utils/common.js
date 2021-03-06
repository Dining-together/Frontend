export const validateEmail = email => {
    const regex = /^[0-9?A-z0-9?]+(\.)?[0-9?A-z0-9?]+@[0-9?A-z]+\.[A-z]{2}.?[A-z]{0,3}$/;
    return regex.test(email);
};

export const removeWhitespace = text => {
    const regex = /\s/g;
    return text.replace(regex, "");
};

export const validatePassword = password => {
    const regex = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
    return regex.test(password);
};

export const changeDateData = date => {
    if(date!==null){
    var y = date.slice(0,4);
    var m = date.slice(5,7);
    var d = date.slice(8,10);
    var h = date.slice(11,13);
    var min = date.slice(14,16);
    return y+"/"+m+"/"+d+" "+h+":"+min;   
    } 
};

export const changeEndDateData = date => {
    var now = new Date();
    console.log(now);
    console.log(date);
    var moment = require('moment');
    var now_y = moment(now).format('YYYY');
    var now_m = moment(now).format('MM');
    var now_d = moment(now).format('DD');
    var now_h = moment(now).format('hh');
    var now_min = moment(now).format('mm'); 
    var y = moment(date).format('YYYY');
    var m = moment(date).format('MM');
    var d = moment(date).format('DD');
    var h = moment(date).format('hh');
    var min = moment(date).format('mm'); 
    var yy = y - now_y;

    var res = "";
    if (yy > 0){
        if (m == now_m){
            res = "약 "+yy+"년 ";
        }else if (m > now_m){
            var mm = m - now_m;
            res = "약 "+yy+"년 "+mm+"달";
        }else {
            var mm = (12-now_m) +m;
            res = "약 "+(yy-1)+"년 "+mm+"달";
        }
    }else if(m - now_m > 0){
        res = "약 "+(m-now_m)+"달";
    }else if(d - now_d){
        res = "약 "+(d-now_d)+"일";
    }else if(h - now_h > 0){
        res = "약 "+ (h-now_h) +"시간";
    }else {
        res = "약 "+ (min-now_min) +"분";
    }

    return res;
};

export const changeListData = (list) => {
    var sliced = list.slice(1,list.length-1);
    var changed = sliced.replace(/"/gim, "");
    var completed = changed.replace(/,/gim, ", ");
    return completed;
};

// YYYY/MM/DD HH:MM => "YYYYMMDDHHMM" 
export const cutDateData = (date) => {

    var moment = require('moment');
    
    var a = moment(date).format('YYYY');
    var b = moment(date).format('MM');
    var c = moment(date).format('DD');
    var d =  moment(date).format('HH');
    var e = moment(date).format('mm');
    return a+b+c+d+e;
};

export const changeCreatedDateData = now => {
    var date = new Date();
    var moment = require('moment');
    var now_y = moment(now).format('YYYY');
    var now_m = moment(now).format('MM');
    var now_d = moment(now).format('DD');
    var now_h = moment(now).format('hh');
    var now_min = moment(now).format('mm'); 
    var y = moment(date).format('YYYY');
    var m = moment(date).format('MM');
    var d = moment(date).format('DD');
    var h = moment(date).format('hh');
    var min = moment(date).format('mm'); 
    var yy = now_y - y;

    var res = "";
    if (yy > 0){
        if (m == now_m){
            res = "약 "+yy+"년 ";
        }else if (m > now_m){
            var mm = m - now_m;
            res = "약 "+yy+"년 "+mm+"달";
        }else {
            var mm = (12-now_m) +m;
            res = "약 "+(yy-1)+"년 "+mm+"달";
        }
    }else if(m - now_m > 0){
        res = "약 "+(m-now_m)+"달";
    }else if(d - now_d){
        res = "약 "+(d-now_d)+"일";
    }else if(h - now_h > 0){
        res = "약 "+ (h-now_h) +"시간";
    }else {
        res = "약 "+ (min-now_min) +"분";
    }

    return res;
};

export const _changeType = (type) => {
    let text;

    switch(type){
        case "AllStore":
            text = "ALL"; break;
        case "KrStore":
            text = "KOREAN"; break;
        case "ChStore":
            text = "CHINESE"; break;
        case "JpStore":
            text = "JAPANESE"; break;
        case "WsStore":
            text = "WESTERN"; break;
        case "EtcStore":
            text = "기타"; break;
    }
    return text;
}

export const _changeTypeKorean = (type) => {
    let text;

    switch(type){
        case "KOREAN":
            text = "한식"; break;
        case "CHINESE":
            text = "중식"; break;
        case "JAPANESE":
            text = "일식"; break;
        case "WESTERN":
            text = "양식"; break;
        case "ETC":
            text = "기타"; break;
    }
    return text;
} 

export const _sortLatest = (a) => {
    var list = a.slice();
    list.sort(function (a,b){
        return a.createdDate - b.createdDate;
    });
    return list;
};

export const _sortPopular = (a) => {
    var list = a.slice();
    list.sort(function (a,b){
        return b.auctioneers.length - a.auctioneers.length;
    });
    return list;
};