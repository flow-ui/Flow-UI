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
	

	var Select = require('select');
    var dataAjax = [{
        "option": "济南",
        "value": "jinan"
    }, {
        "option": "烟台",
        "value": "yantai",
        "selected": true
    }, {
        "option": "青岛",
        "value": "qingdao"
    }];

    var select1 = $('.demo-fromdom').select({
        onChange: function(value, text) {
            console.log('select1值更新为', value);
        }
    });

    var select2 = $('.demo-multi').select({
    	data: dataAjax,
    	multi: true
    });

    var select3 = $('.demo-insert').select({
        filterable: true,
        data: dataAjax,
        onChange: function(val, txt) {
            console.log('select3选中了' + txt);
        }
    });

    var select4 = Select({
        el:'.demo-cascader',
        data: [{
            "option": "山东",
            "value": "shandong",
            "children": [{
                "option": "济南",
                "value": "jinan"
            }, {
                "option": "烟台",
                "value": "yantai",
                "children": [{
                    "option": '莱山',
                    "value": 'laishan'
                }, {
                    "option": '芝罘',
                    "value": 'zhifu'
                }, {
                    "option": '开发区',
                    "value": 'kaifaqu'
                }, {
                    "option": '福山',
                    "value": 'fushan'
                }, {
                    "option": '牟平',
                    "value": 'muping'
                }]
            }, {
                "option": "青岛",
                "value": "qingdao",
                "children": [{
                    "option": '崂山',
                    "value": 'laoshan'
                }, {
                    "option": '四方',
                    "value": 'sifang'
                }]
            }]
        },{
            "option": "江苏",
            "value": "jiangsu",
            "children": [{
                "option": "浙江",
                "value": "zhejiang"
            },{
                "option": "杭州",
                "value": "hangzhou"
            },{
                "option": "南京",
                "value": "nanjing"
            }]
        }],
        onChange: function(value, text) {
            console.log(value, text);
        }
    });

});