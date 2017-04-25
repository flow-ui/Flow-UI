/**
 * blank
 */
define(function(require) {
	var $ = require('jquery');
	var com=require('./common');
	//
	var base = require('base');
	var mymenu = com.mymenu;
	var cur = parseInt(base.url.get('active'));
	if(cur){
		mymenu.active(cur);
	}
	

	require('datepicker');
    $('.getdate').datepicker();
    $('.getdate2').datepicker({
    	language: 'zh-CN',
    	autoHide: true
    });
    require('timepicker');
    $('.gettime').timepicker();
    
    $('.getdatetime').datepicker({
        needTime: true,
        format:'yyyy/mth/dd hh:mm:ss'
    }); 

	
});