import {mask} from 'jq-modal';

import loginTpl from '../template/login.html';

class TestService{

    constructor(){
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