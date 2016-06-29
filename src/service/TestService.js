import {mask} from 'jq-modal';

import loginTpl from '../template/login.html';
//如果要调用Handlebars其他方法，如registerHelper，则需要手动引入
import Handlebars from 'handlebars/runtime';

class TestService{

    constructor(){

        Handlebars.registerHelper("debug", function(optionalValue) {
            console.log("Current Context");
            console.log("====================");
            console.log(this);
            if (optionalValue) {
                console.log("Value");
                console.log("====================");
                console.log(optionalValue);
            }
        });
        this.showDialog();

        $('#showMask').on('click',()=>{$('#login').mask()});
    }

    showDialog(){
        $('#login').html(loginTpl({
            title:'登陆',
            content:'请登录',
            footer:''
        })).mask();

    }
}

export default  TestService;