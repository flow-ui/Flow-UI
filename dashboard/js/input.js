/**
 * blank
 */
define(function(require) {
	var $ = require('jquery');
	var com=require('./common');
	//
	
	require('input');                  
    var myinput = $('.input1').input({
        buttons: [
            {
                text: '确定',
                click:function(val, text){
                    console.log('val:',val);
                    console.log('text:',text);
                }
            },
            {
                text: '清除',
                click:function(val, text){
                    myinput.clear();
                }
            }
        ],
        val:'100',
        holder: '输入金额',
        errormsg: '请输入整数!',
        datatype:'n',
        render:function(val){
            return '$'+val;
        },
        onChange: function(val){
            console.log('change to',val);
        }
    });

    var readable = true;
    $('.setreadonly').on('click',function(){
        readable = !readable;
        myinput.readonly(readable);
    });

	
});