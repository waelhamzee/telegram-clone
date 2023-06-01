import {store} from "react-notifications-component";
export class Utilites {
    static getBaseLink(url) {
        if (url) {
            let parts = url.split('://');

            if (parts.length > 1) {
                return parts[0] + '://' + parts[1].split('/')[0] ;
            } else {
                return parts[0].split('/')[0] ;
            }
        }
        return "";
    }
    static showSucessMessage(msg){
        // alert(msg)
        store.addNotification({
            title: "",
            message: msg,
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 2000,
                onScreen: true
            }
        });
    }
    static showCall(msg){
        // alert(msg)
        store.addNotification({
            title: "",
            message: msg,
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 100000,
                onScreen: true
            }
        });
    }
    static showErrorMessage(msg){
        //alert(msg)
        store.addNotification({
            title: "",
            message: msg,
            type: "danger",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 2000,
                onScreen: true
            }
        });
    }

    static showMessage(title,msg){
        //alert(msg)
        store.addNotification({
            title: title,
            message: msg,
            type: "success",
            insert: "bottom",
            container: "bottom-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true,
            }
        });
    }

    static generateSlug= (str) =>{
        if(!str){
            return str;
        }
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to   = "aaaaeeeeiiiioooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    // static getFileBase64(file, cb) {
    //     let reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = function () {
    //         cb(reader.result)
    //     };
    //     reader.onerror = function (error) {
    //         console.log('Error: ', error);
    //     };
    // }
    
    static getFileBase64(file, cb) {
      let reader = new FileReader();
      reader.onloadend = function () {
        var b64 = reader.result.replace(/^data:.+;base64,/, '');
        cb(b64)
      };
      reader.readAsDataURL(file);
    }

    static getInnerLink(url) {
        let baselink= Utilites.getBaseLink(url);
        let res = url.replace(baselink, "");
        if(res.length===0){
            return "/"
        }
        return res;
    }
    static validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    static converttoint(value){
        return parseInt(value);
    }
    static complexpass(password) {
        let regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;
        return regExp.test(password);
    }
    static sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static YouTubeGetID = (url)=>{
        url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
    }

    static toHHMMSS = (secs) => {
        var sec_num = parseInt(secs, 10)
        var hours   = Math.floor(sec_num / 3600)
        var minutes = Math.floor(sec_num / 60) % 60
        var seconds = sec_num % 60
        return [hours,minutes,seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v,i) => v !== "00" || i > 0)
            .join(":")
    }

    static setTimeout(callMethod,seconds =400) {
        setTimeout(() => {
            callMethod();
        }, seconds);
    }
    static iterate(items){
        return items && items.map((item, index) => item.value);

    }
    static find(items,key){
        return items && items.find((item, index) => item.key === key);
    }

    static getLastElementUrl(link){
        return link.match(/([^\/]*)\/*$/)[1];
    }


}
