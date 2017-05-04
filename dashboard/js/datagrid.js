/**
 * blank
 */
define(function(require) {
	var $ = require('jquery');
	var com = require('./common');
	//


	var Table = require('table');
	var demoData = [{
		key1: "data1",
		key2: "data2",
		key3: "data3"
	}, {
		key1: "data1",
		key2: "data2",
		key3: "data3"
	}, {
		key1: "data1",
		key2: "data2",
		key3: "data3"
	}, {
		key1: "data1",
		key2: "data2",
		key3: "data3"
	}];
	var demoColumn = [{
		title: "第一列",
		key: 'key1'
	}, {
		title: "第二列",
		key: 'key2'
	}, {
		title: "第三列",
		key: 'key3'
	}];
	//demo 1
	Table({
		el: '.grid1',
		data: demoData,
		column: demoColumn
	});
	//demo2
	demoColumn[0].width = 100;
	Table({
		el: '.grid2',
		data: demoData,
		column: demoColumn,
		bordered: true
	});

	//demo3
	//列配置
	var myColumn = [{
		title: '产品',
		key: 'product',
		width: 125,
		sort: {
			mehtod: true,
			handle: function(key, type) {
				tab3LoadData.data.sort = type;
				tab3LoadData.data.key = key;
				datagrid.load(tab3LoadData);
			}
		},
		validateMethod: function(value) {
			if (value && value.split && value.length < 10) {
				return true;
			}
			require.async('notice', function(Notice) {
				Notice({
					title: '请输入长度小于10的字符串！',
					color: 'warning',
					delay: 2000
				});
			});
		},
		editable: function(rowIndex, key, value) {
			console.log(rowIndex, key, value);
		}
	}, {
		title: '制造商',
		key: 'manufacturer',
		filters: [{
			label: '全部',
			handle: function() {
				tab3LoadData.data.filter = '';
				datagrid.load(tab3LoadData);
			}
		}, {
			label: '三星',
			handle: function() {
				tab3LoadData.data.filter = 'Samsung';
				datagrid.load(tab3LoadData);
			}
		}, {
			label: '苹果',
			handle: function() {
				tab3LoadData.data.filter = 'Apple';
				datagrid.load(tab3LoadData);
			}
		}, {
			label: '诺基亚',
			handle: function() {
				tab3LoadData.data.filter = 'Nokia';
				datagrid.load(tab3LoadData);
			}
		}]
	}, {
		title: '价格',
		key: 'price',
		width: 100,
		styler: function(value) {
			if (value > 3000) {
				return "font-weight:700;color:#000";
			}
		}
	}, {
		title: '库存',
		key: 'storage',
		align: 'center',
		styler: function(value) {
			if (value < 100) {
				return "color: red";
			}
		}
	}, {
		title: '类型',
		key: 'type',
		render: function(value, rowData, index, entity) {
			var inputArray = [{
				type: "A",
				name: '直板'
			}, {
				type: "B",
				name: '翻盖'
			}, {
				type: "C",
				name: '滑盖'
			}];
			var inputName = '';
			$.each(inputArray, function(i, e) {
				if (e.type === value) {
					inputName = e.name;
					return false;
				}
			});
			return inputName;
		}
	}, {
		title: '体积（mm）',
		width: 200,
		render: function(value, rowData, index) {
			var size = rowData.size;
			if (size) {
				return [size.length, size.width, size.height].join(' x ');
			}
		}
	}, {
		title: 'comment',
		key: 'comment',
		width: 200
	}];
	//加载配置
	var tab3LoadData = {
		url: 'https://o14ufxb92.qnssl.com/phone.json',
		data: {
			page_size: 10,
			page_index: 1
		}
	};
	//调用Table
	var datagrid = Table({
		el: '.grid3',
		load: tab3LoadData,
		column: myColumn,
		multi: true,
		height: 400,
		onReady: function(res) {
			require.async('page', function() {
				$('.tab3-page').page({
					total: res.totalPage || 12, //模拟数据没有totalPage属性，暂时写死
					current: tab3LoadData.data.page_index,
					onChange: function(page) {
						tab3LoadData.data.page_index = page;
						datagrid.load(tab3LoadData);
					}
				});
			});
		}
	});
	//增删改事件
	var box = require('box');
	require('validform');

	var formTemplate = $('#formTemplate').text();
	var etpl = require('etpl');
	var formRender = etpl.compile(formTemplate);
	$('.tab3-add').on('click', function() {
		var html = formRender({});
		var boxHandle = box.open(html, {
			width: 600,
			onshow: function($box) {
				$box.find('.formTemplate').Validform({
					ajaxPost: true,
					tipSweep: true,
					url: 'http://rapapi.org/mockjsdata/9195/common/getYes/',
					data: {
						method: 'add'
					},
					callback: function(res) {
						box.hide(boxHandle);
						if (res.status === 'Y') {
							$.box.msg(res.msg || '添加数据成功，即将重载数据！', {
								color: 'success',
								delay: 2000,
								onclose: function() {
									//重载表格数据
									datagrid.reload();
								}
							});
						} else {
							$.box.msg(res.msg || '操作失败！', {
								color: 'danger'
							});
						}
					}
				});
				//下拉
				require.async('select', function() {
					var _checked = $box.find('.phoneTypeSelect').attr('value');
					var _optionData = [{
						value: "A",
						option: '直板'
					}, {
						value: "B",
						option: '翻盖'
					}, {
						value: "C",
						option: '滑盖'
					}];
					$.each(_optionData, function(i, e) {
						if (e.value === _checked) {
							e.selected = true;
							return false;
						}
					});
					$box.find('.phoneTypeSelect').select({
						data: _optionData
					});
				});
				//开关
				require.async('switch', function() {
					$box.find('.flow-ui-switch').switch();
				});
			}
		});
	});
	//删除
	$('.tab3-del').on('click', function() {
		var _selected = datagrid.getSelected();
		if (!_selected.length) {
			return null;
		}
		var confirmHandle = box.confirm('确定删除这 ' + _selected.length + ' 项？', function() {
			box.hide(confirmHandle);
			$.ajax({
				url: 'http://rapapi.org/mockjsdata/9195/common/getYes/',
				data: {
					method: 'delete',
					pro: _selected
				},
				success: function(res) {
					if (res.status === 'Y') {
						box.msg(res.msg || '删除成功！', {
							color: 'success',
							delay: 2000,
							onclose: function() {
								datagrid.reload();
							}
						});
					} else {
						box.msg(res.msg || '操作失败！', {
							color: 'danger',
							delay: 2000
						});
					}
				}
			});
		});

	});
	//编辑
	$('.tab3-edi').on('click', function() {
		var _selected = datagrid.getSelected();
		if (!_selected.length) {
			return null;
		}
		var html = formRender(_selected[0]);
		var boxHandle = box.open(html, {
			width: 600,
			onshow: function($box) {
				$box.find('.formTemplate').Validform({
					ajaxPost: true,
					tipSweep: true,
					data: {
						method: 'modify'
					},
					url: 'http://rapapi.org/mockjsdata/9195/common/getYes/',
					callback: function(res) {
						box.hide(boxHandle);
						if (res.status === 'Y') {
							$.box.msg(res.msg || '修改成功！', {
								color: 'success',
								delay: 2000,
								onclose: function() {
									//重载表格数据
									datagrid.reload();
								}
							});
						} else {
							$.box.msg(res.msg || '操作失败！', {
								color: 'danger'
							});
						}
					}
				});
				//下拉
				require.async('select', function() {
					var _checked = $box.find('.phoneTypeSelect').attr('value');
					var _optionData = [{
						value: "A",
						option: '直板'
					}, {
						value: "B",
						option: '翻盖'
					}, {
						value: "C",
						option: '滑盖'
					}];
					$.each(_optionData, function(i, e) {
						if (e.value === _checked) {
							e.selected = true;
							return false;
						}
					});
					$box.find('.phoneTypeSelect').select({
						data: _optionData
					});
				});
				//开关
				require.async('switch', function() {
					$box.find('.flow-ui-switch').switch();
				});
			}
		});
	});
	//demo4
	//列配置
	var myColumn4 = [{
		title: '产品',
		key: 'product',
		width: 125
	}, {
		title: '制造商',
		key: 'manufacturer',
		width: 125
	}, {
		title: '价格',
		key: 'price',
		width: 100,
		styler: function(value) {
			if (value > 3000) {
				return "font-weight:700;color:#000";
			}
		}
	}, {
		title: '库存',
		key: 'storage',
		align: 'center',
		styler: function(value) {
			if (value < 100) {
				return "color: red";
			}
		}
	}, {
		title: '体积（mm）',
		width: 200,
		render: function(value, rowData, index) {
			var size = rowData.size;
			if (size) {
				return [size.length, size.width, size.height].join(' x ');
			}
		}
	}];
	//主表加载配置
	var tab4LoadData = {
		url: 'https://o14ufxb92.qnssl.com/phone.json',
		data: {
			page_size: 10,
			page_index: 1
		}
	};
	//从表列数据
	var myColumn4Sub = [{
		title: '用户名称',
		key: 'name'
	},{
		title: '用户角色',
		key: 'role'
	}];
	//从表加载配置
	var tab4SubData = {
		url: 'http://rapapi.org/mockjsdata/1101/member/list/sub/',
		data: {
			page_size: 10,
			page_index: 1
		},
		dataParser: function(res){
			return res.data;
		}
	};
	//调用Table
	var datagrid4 = Table({
		el: '.grid4',
		load: tab4LoadData,
		column: myColumn4,
		multi: true,
		height: 400,
		onSelect: function(index, row, rowArray, isSelect) {
			if(isSelect){
				var _pro = row.product;
				//从表弹窗
				tab4SubData.data.pro = _pro;
				var tab4subboxHandle = box.open('<div class="card card-bordered"><div class="card-head"><div class="card-title">操作</div><div class="card-extra"><span class="btn btn-sm btn-success">增加</span> <span class="btn btn-sm btn-danger">删除</span> <span class="btn btn-sm btn-warning">修改</span></div></div><div class="tab4sub card-body">加载中...</div><div class="tab4-sub-page tc card-foot"></div></div>',{
					title: '从属：'+_pro,
					width: 600,
					onshow: function($box){
						//加载从表Table数据
						var tabgrid4sub = Table({
							el: $box.find('.tab4sub'),
							load: tab4SubData,
							column: myColumn4Sub,
							multi: true,
							height: 400,
							onReady: function(res) {
								require.async('page', function() {
									$box.find('.tab4-sub-page').page({
										total: res.count ? Math.ceil(res.count/tab4SubData.data.page_size) : 12, //模拟数据没有count属性，暂时写死
										current: tab4SubData.data.page_index,
										onChange: function(page) {
											tab4SubData.data.page_index = page;
											tabgrid4sub.load(tab4SubData);
										}
									});
								});
								//Table实例化完成后调整从表弹窗尺寸
								box.setSize(tab4subboxHandle);
							}
						});
					}
				});
			}
		},
		onReady: function(res) {
			require.async('page', function() {
				$('.tab4-page').page({
					total: res.count ? Math.ceil(res.count/tab4LoadData.data.page_size) : 12, //模拟数据没有count属性，暂时写死
					current: tab4LoadData.data.page_index,
					onChange: function(page) {
						tab4LoadData.data.page_index = page;
						datagrid.load(tab4LoadData);
					}
				});
			});
		}
	});

});