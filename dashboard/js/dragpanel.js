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
	

                            
    require('drag-panel');
    $('#wrapper').dragPanel({
        ondrag: function(newSort) {
            console.log(newSort);
        }
    });
                            
                        
	
});