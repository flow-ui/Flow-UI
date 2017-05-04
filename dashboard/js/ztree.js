/**
 * blank
 */
define(function(require) {
	var $ = require('jquery');
	var com = require('./common');
	//
	var box = require('box');
	require('zTree');
	var zNodes = [{
		name: "test1",
		open: true,
		children: [{
			name: "test1_1"
		}, {
			name: "test1_2"
		}]
	}, {
		name: "test2",
		open: true,
		children: [{
			name: "test2_1"
		}, {
			name: "test2_2"
		}]
	}];
	//基本
	$.fn.zTree.init($("#tree1"), {}, zNodes);
	//多选
	$.fn.zTree.init($("#tree2"), {
		check:{
			enable: true
		}
	}, zNodes);
	//单选
	$.fn.zTree.init($("#tree4"), {
		check:{
			enable: true,
			chkStyle: 'radio'
		}
	}, zNodes);
	//增删改查
	var tree3 = $.fn.zTree.init($("#tree3"), {
		async: {
			enable: true,
			url: 'http://rapapi.org/mockjsdata/9195/tree/getNode',
			autoParam: ["id=treeId"],
			dataType: 'json',
			otherParam: {},
			dataFilter: function(treeId, parentNode, res){
				if(res.status==='Y'){
					return res.data;
				}
				console.warn('异步数据异常！', res);
				return [];
			}
		},
		view:{
			showIcon: false,
			showLine: false
		},
		callback: {
			beforeRename: function(){
				//return false;
			}
		}
	});
	//增删改方法
	$('.tree3-add').on('click', function(){
		var baseNode = tree3.getSelectedNodes()[0] || null;
		tree3.addNodes(baseNode, -1, {name:"newNode1"});
	});
	$('.tree3-del').on('click', function(){
		var baseNode = tree3.getSelectedNodes();
		if(!baseNode.length){
			return box.msg('请选择要删除的节点!',{
				delay: 2000,
				color:'warning'
			});
		}
		$.each(baseNode, function(i, e){
			tree3.removeNode(e);
		});
	});
	$('.tree3-edi').on('click', function(){
		var baseNode = tree3.getSelectedNodes();
		if(!baseNode.length){
			return box.msg('请选择要编辑的节点!',{
				delay: 2000,
				color:'warning'
			});
		}
		tree3.editName(baseNode[0]);
	});

});