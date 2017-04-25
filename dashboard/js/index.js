/**
 * index
 */
define(function(require) {
	var $ = require('jquery');
	var com = require('./common');
	var mymenu = com.mymenu;
	mymenu.active(1);

	var echarts = require('echarts');
	var myChart1 = echarts.init(document.getElementById('index-charts'));

	var xAxisData = [];
	var data1 = [];
	var data2 = [];
	for (var i = 0; i < 100; i++) {
		xAxisData.push('类目' + i);
		data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
		data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
	}
	var option = {
		title: {
			text: '柱状图动画延迟'
		},
		legend: {
			data: ['bar', 'bar2'],
			align: 'left'
		},
		toolbox: {
			// y: 'bottom',
			feature: {
				magicType: {
					type: ['stack', 'tiled']
				},
				dataView: {},
				saveAsImage: {
					pixelRatio: 2
				}
			}
		},
		tooltip: {},
		xAxis: {
			data: xAxisData,
			silent: false,
			splitLine: {
				show: false
			}
		},
		yAxis: {},
		series: [{
			name: 'bar',
			type: 'bar',
			data: data1,
			animationDelay: function(idx) {
				return idx * 10;
			}
		}, {
			name: 'bar2',
			type: 'bar',
			data: data2,
			animationDelay: function(idx) {
				return idx * 10 + 100;
			}
		}],
		animationEasing: 'elasticOut',
		animationDelayUpdate: function(idx) {
			return idx * 5;
		}
	};
	myChart1.setOption(option);
	$('#reset-index-charts').on('click', function() {
		option.series[0].data.reverse();
		myChart1.setOption(option);
	});

	var myChart2 = echarts.init(document.getElementById('index-echarts-2'));
	var option2 = {
		tooltip: {
			formatter: "{a} <br/>{b} : {c}%"
		},
		toolbox: {
			feature: {
				restore: {},
				saveAsImage: {}
			}
		},
		series: [{
			name: '业务指标',
			type: 'gauge',
			detail: {
				formatter: '{value}%',
				textStyle: {
					fontSize: 16
				}
			},
			data: [{
				value: 50,
				name: ''
			}]
		}]
	};
	myChart2.setOption(option2, true);
	setInterval(function() {
		option2.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
		myChart2.setOption(option2, true);
	}, 2000);

	var Table = require('table');
	require('tip');
	//列配置
	var myColumn = [{
		title: 'operation',
		render: function(value, rowData, index, entity) {
			if (rowData.storage > 0) {
				return $('<div class="btn btn-primary btn-sm">折扣</div>').on('click', function(e) {
					e.stopPropagation();
					entity.toggle('price', Math.round(rowData.price * 0.8));
				});
			} else {
				return $('<div class="btn btn-primary btn-sm disabled">无货</div>');
			}
		},
		width: 100,
		fixed: true
	}, {
		title: '图片',
		render: function(value, rowData, index) {
			var smallImg = $('<img src="http://bsdn.org/projects/dorado7/deploy/sample-center/dorado/res/com/bstek/dorado/sample/data/images/' + rowData.product + '-24.png" alt="data.product" style="max-height:28px" />');
			smallImg.tip('<img src="http://bsdn.org/projects/dorado7/deploy/sample-center/dorado/res/com/bstek/dorado/sample/data/images/' + rowData.product + '-128.png" style="width:128px;" />', {
				type: 'content'
			});
			return smallImg;
		}
	}, {
		title: '产品',
		key: 'product',
		width: 125,
		sort: {
			mehtod: true,
			handle: function(key, type) {
				datagrid.load({
					url: 'https://o14ufxb92.qnssl.com/phone.json',
					data: {
						sort: type,
						key: key
					}
				});
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
			mehtod: function(value) {
				return true;
			}
		}, {
			label: '三星',
			mehtod: function(value) {
				return value.indexOf('Samsung') === 0;
			}
		}, {
			label: '苹果',
			mehtod: function(value) {
				return value.indexOf('Apple') === 0;
			}
		}, {
			label: '诺基亚',
			mehtod: function(value) {
				return value.indexOf('Nokia') === 0;
			}
		}],
		editable: function(rowIndex, key, value) {
			console.log(rowIndex, key, value);
		}
	}, {
		title: '价格',
		key: 'price',
		width: 100,
		styler: function(value) {
			if (value > 3000) {
				return "font-weight:700;color:#000";
			}
		},
		editable: function(rowIndex, key, value) {
			console.log(rowIndex, key, value);
		}
	}, {
		title: '库存',
		key: 'storage',
		align: 'center',
		sort: true,
		styler: function(value) {
			if (value < 100) {
				return "color: red";
			}
		}
	}, {
		title: '类型',
		width: 200,
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
			var inputName = "phonetype" + index;
			var typeControl = '<div style="user-select: none;">';
			$.each(inputArray, function(i, e) {
				typeControl += ('<label class="radio radio-inline"><input type="radio" name="' + inputName + '" value="' + e.type + '"' + (e.type === value ? ' checked' : '') + ' />' + e.name + '</label>');
			});
			typeControl += '</div>';

			return $(typeControl).on('change', function() {
				var newValue = $(this).find('input:checked').val();
				entity.set('type', newValue);
			});
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
		width: 200,
		editable: function(rowIndex, key, value) {
			console.log(rowIndex, key, value);
		}
	}];
	//调用Table
	var datagrid = Table({
		el: '#index-table',
		load: {
			url: 'https://o14ufxb92.qnssl.com/phone.json',
			data: {
				id: 123
			}
		},
		column: myColumn
	});

});