/*
 * name: table.js
 * version: v1.1.0
 * update: add methods
 * date: 2017-03-23
 */
 //TODO edit状态插值
define('table', function(require, exports, module) {
	"use strict";
	seajs.importStyle('', module.uri);
	require('dropdown');
	var $ = require('jquery'),
		base = require('base'),
		def = {
			el: null,
			data: null,
			column: null, // title,key,render,width,align,hook,ellipsis,editable,sortable,filterMethod,
			striped: false,
			bordered: false,
			condensed: false,
			hover: true,
			width: 0,
			height: 0,
			index: false,
			multi: false,
			noDataText: "暂无数据",
			noFilterText: '暂无筛选结果',
			highlight: false,
			page: null,
			onSelect: null // index, row, [all]
		},
		deepcopy = function(source) {
			var sourceCopy = source instanceof Array ? [] : {};
			for (var item in source) {
				sourceCopy[item] = typeof source[item] === 'object' ? deepcopy(source[item]) : source[item];
			}
			return sourceCopy;
		},
		Table = function(config) {
			var opt = $.extend({}, def, config || {}),
				$this = $(opt.el).eq(0);
			if (!$this.length) {
				return null;
			}

			if (isNaN(parseFloat(opt.width)) || !parseFloat(opt.width)) {
				opt.width = $this.width();
			}
			//索引列
			if (opt.index) {
				opt.column.unshift({
					type: 'index',
					width: 60,
					align: 'center',
					fixed: opt.index === 'fixed'
				});
			}
			//勾选列
			if (opt.multi) {
				opt.column.unshift({
					type: 'selection',
					width: 60,
					align: 'center',
					fixed: opt.multi === 'fixed'
				});
			}
			var indexKey = 'index-' + base.getUUID();

			//生成单元格
			var getTd = function(rowIndex, rowData, col) {
				var tdStyler;
				var isDirty;
				var oriValue = opt.oData[rowData[indexKey]][col.key];
				var thisColClass = ['row' + rowIndex + '-' + (col.key || '')];
				//数据脏检查
				if (rowData[col.key] !== void(0) && (oriValue !== rowData[col.key])) {
					//console.log(oriValue, rowData[col.key]);
					isDirty = true;
				}
				switch (col.align) {
					case 'center':
						thisColClass.push('tc');
						break;
					case 'right':
						thisColClass.push('tr');
						break;
					default:
						thisColClass.push('tl');
				}
				if (col.hook && col.hook.split) {
					thisColClass.push(col.hook);
				}
				if (isDirty) {
					thisColClass.push('table-cell-dirty');
				}
				if (col.editable) {
					thisColClass.push('table-cell-editable');
				}
				if (typeof col.styler === 'function') {
					tdStyler = col.styler(rowData[col.key]) || '';
				}
				var thisColTag = '<td class="' + thisColClass.join(' ') + '"' + (tdStyler ? (' style="' + tdStyler + '"') : '') + '><div class="table-cell">';
				switch (col.type) {
					case 'index':
						thisColTag += ((parseInt(rowIndex) + 1) + '</td>');
						break;
					case 'selection':
						thisColTag += '<label class="checkbox checkbox-inline"><input type="checkbox" class="table-choose-input"></label></td>';
						break;
					default:
						var thisTagCont;
						var renderTagId = 'renderTagId-' + base.getUUID();
						var tdEntity = {
							set: function(key, newValue) {
								if (key && key.split) {
									rowData[key] = newValue;
									var targetCol;
									$.each(opt.column, function(i, e) {
										if (e.key === key) {
											targetCol = e;
											return false;
										}
									});
									if (targetCol) {
										var targetTd = getTd(rowIndex, rowData, targetCol);
										$this.find('.row' + rowIndex + '-' + key).replaceWith(inject(targetTd));
									}
									return rowData;
								}
							},
							toggle: function(key, newValue) {
								if (this['backup-' + key] === void 0) {
									this['backup-' + key] = opt.oData[rowData[indexKey]][key];
									if (this['backup-' + key] !== void 0 && (this['backup-' + key] !== newValue)) {
										this.set(key, newValue);
									}
								} else {
									this.set(key, this['backup-' + key]);
									delete this['backup-' + key];
								}
							},
							get: function(full) {
								if (full) {
									return rowData;
								} else {
									return rowData[col.key];
								}
							},
							edit: function($dom) {
								var editCb;
								if (isEditing) {
									return null;
								}
								if (typeof $dom === 'function') {
									editCb = $dom;
									$dom = null;
								}
								if (!$dom || !$dom.length) {
									$dom = $this.find('.row' + rowIndex + '-' + (col.key || ''));
								}
								if ($dom.length) {
									isEditing = true;
									//api操作不可编辑单元格
									$dom.addClass('table-cell-editable');
									var that = this;
									var oldValue = opt.oData[rowData[indexKey]][col.key];
									var nowText = this.get();
									var inputHTML;
									if (typeof oldValue === 'number') {
										inputHTML = '<input type="number" class="form-control table-cell-editer" value="' + nowText + '" >';
									} else {
										inputHTML = '<textarea class="form-control table-cell-editer">' + nowText + '</textarea>';
									}
									var $input = $(inputHTML).on('blur', function() {
										var newValue = $(this).val();
										if (typeof oldValue === 'number') {
											newValue = isNaN(parseFloat(newValue)) ? 0 : parseFloat(newValue);
										}
										var newRow = that.set(col.key, newValue);
										isEditing = false;
										if (oldValue !== newValue) {
											changes.update.push({
												index: rowData[indexKey],
												row: newRow,
												origin: opt.data[rowData[indexKey]]
											});
											if (typeof col.editable === 'function') {
												col.editable(rowData[indexKey], col.key, newValue);
											}
											if (typeof editCb === 'function') {
												editCb(rowData[indexKey], col.key, newValue);
											}
										}
									});
									$dom.append($input);
									$input.focus();
								} else {
									console.warn('entity.edit()找不到当前TD单元格！', $dom);
								}
							}
						};
						opt.renderCollection = opt.renderCollection || [];
						if (typeof col.render === 'function') {
							try {
								opt.renderCollection.push({
									id: renderTagId,
									el: col.render(rowData[col.key], rowData, rowIndex, tdEntity),
									entity: tdEntity
								});
							} catch (e) {
								console.warn(col.key + ' => render() run error：', e.message);
							}
							thisTagCont = '<div id="' + renderTagId + '"></div>';
						} else {
							opt.renderCollection.push({
								id: renderTagId,
								el: (col.ellipsis ? '<div class="el" style="width:' + (col.thisColWidth - 36) + 'px">' + rowData[col.key] + '</div>' : ((rowData[col.key]) === null || rowData[col.key] === void(0)) ? opt.noDataText : rowData[col.key]),
								entity: tdEntity
							});
							thisTagCont = '<div id="' + renderTagId + '"></div>';
							//thisTagCont = (col.ellipsis ? '<div class="el" style="width:' + (col.thisColWidth - 36) + 'px">' + rowData[col.key] + '</div>' : ((rowData[col.key]) === null || rowData[col.key] === void(0)) ? opt.noDataText : rowData[col.key]);
						}
						thisColTag += (thisTagCont + '</div></td>');
				}
				return thisColTag;
			};
			//生成表格主体
			var getBody = function(tData, opt) {
				var tbodyCont = '';
				$.each(tData, function(rowIndex, rowData) {
					var tdcont = '';
					if (rowData.split) {
						tdcont += ('<td>' + rowData + '</td>');
					} else if ($.isPlainObject(rowData)) {
						$.each(opt.column, function(colIndex, colData) {
							tdcont += getTd(rowIndex, rowData, colData);
						});
					}
					var thisdata = '<tr data-index="' + rowData[indexKey] + '">';
					thisdata += tdcont;
					thisdata += '</tr>';
					tbodyCont += thisdata;
				});
				return tbodyCont;
			};
			//排序方法
			var sortBy = function(key, method, methodThirdArgument) {
				var sortKey = [],
					sortData = [];
				$.each(opt.oData, function(i, e) {
					sortKey.push(e[key]);
				});
				if (!sortKey.length) {
					return console.warn('sortBy():can`t find property ' + key + ' from data');
				}
				if (typeof method === 'function') {
					sortKey.sort(function(a, b) {
						return method(a, b, methodThirdArgument);
					});
				} else {
					sortKey.sort();
					if (methodThirdArgument === 'desc') {
						sortKey.reverse();
					}
				}
				$.each(sortKey, function(i, k) {
					$.each(opt.oData, function(i, obj) {
						if (obj[key] === k) {
							sortData.push(obj);
						}
					});
				});
				return sortData;
			};
			var render = function(tData, opt, part) {
				if (!$.isArray(tData) || !tData.length || !$.isArray(opt.column) || !opt.column.length) {
					return console.warn('table: data or column配置有误！');
				}
				var colgroup = '<colgroup>';
				var theadCont = '<thead><tr>';
				var totalWidth = opt.width;
				var tableWidth = 0;
				var otherParts = opt.column.length;
				//收集注入元素
				opt.renderCollection = opt.renderCollection || [];
				var fixedIndex, fixedWidth = 0;
				$.each(opt.column, function(i, col) {
					//预计算列宽
					col.width = isNaN(parseFloat(col.width)) ? 0 : parseFloat(col.width);
					if (col.width) {
						totalWidth -= col.width;
						otherParts -= 1;
					}
					//fixed列位置
					if (col.fixed) {
						fixedIndex = i;
					}
				});
				opt.fixedIndex = fixedIndex;
				$.each(opt.column, function(i, col) {
					var thisColWidth = col.width;
					var thisColClass = [];
					if (!thisColWidth) {
						thisColWidth = Math.max(Math.floor(totalWidth / otherParts), 60 + (col.sortable || $.isArray(col.filterMethod) ? 40 : 0));
					}
					if (fixedIndex !== void(0) && fixedIndex >= i) {
						fixedWidth += thisColWidth;
					}
					tableWidth += thisColWidth;
					switch (col.align) {
						case 'center':
							thisColClass.push('tc');
							break;
						case 'right':
							thisColClass.push('tr');
							break;
						default:
							thisColClass.push('tl');
					}
					col.thisColWidth = thisColWidth;
					var thisColTag = '<th' + (' class="' + thisColClass.join(' ') + '">');
					colgroup += ('<col width="' + thisColWidth + '"></col>');
					switch (col.type) {
						case 'index':
							theadCont += (thisColTag + '#</th>');
							break;
						case 'selection':
							theadCont += (thisColTag + '<label class="checkbox checkbox-inline"><input type="checkbox" class="table-choose-all"></label></th>');
							break;
						default:
							var thisTagCont = '<div class="table-cell">';
							if (col.sortable || $.isArray(col.filterMethod)) {
								var renderTagId = 'sortTagId-' + base.getUUID();
								var $el = $('<div></div>');
								//排序
								if (col.sortable) {
									$el.append($('<span class="table-sort"><i class="ion table-sort-up">&#xe618;</i><i class="ion table-sort-down">&#xe612;</i></span>')
										.on('click', '.ion', function() {
											var sortData;
											if ($(this).hasClass('on')) {
												$(this).removeClass('on');
												sortData = opt.oData;
											} else {
												$(this).addClass('on').siblings('.on').removeClass('on');
												if ($(this).hasClass('table-sort-up')) {
													sortData = sortBy(col.key, col.sortable, 'asc');
												} else if ($(this).hasClass('table-sort-down')) {
													sortData = sortBy(col.key, col.sortable, 'desc');
												}
											}
											if (opt.page && opt.page.pageSize) {
												opt.holdStatus = true;
												generate(sortData, opt, 'body');
											} else {
												render(sortData, opt, 'body');
											}
										}));
								}
								//筛选
								if ($.isArray(col.filterMethod)) {
									var dropData = [{
										item: '全部'
									}];
									$.each(col.filterMethod, function(i, filterMethod) {
										if (filterMethod.label && filterMethod.label.split) {
											dropData.push({
												item: filterMethod.label,
												methodIndex: i
											});
										}
									});
									$el.append($('<span class="table-filter"><i class="ion">&#xe64d;</i></span>').dropdown({
										items: dropData,
										trigger: 'click',
										onclick: function(item, isCurrent) {
											if (isCurrent) {
												return null;
											}
											var filterData;
											if (item.methodIndex === void(0)) {
												filterData = opt.oData;
											} else if (typeof col.filterMethod[item.methodIndex].filter === 'function') {
												filterData = $.map(opt.oData, function(val, i) {
													if (col.filterMethod[item.methodIndex].filter(val[col.key])) {
														return val;
													}
												});
											}
											if (!filterData.length) {
												filterData = [opt.noFilterText];
											}
											opt.holdStatus = true;
											return generate(filterData, opt, 'body');
										}
									}));
								}
								opt.renderCollection.push({
									id: renderTagId,
									el: $el.children('span').unwrap()
								});
								thisTagCont += (col.title || "#") + '<textarea style="display:none" id="' + renderTagId + '"></textarea>';
							} else {
								thisTagCont += (col.title || "#");
							}
							theadCont += (thisColTag + thisTagCont + '</div></th>');
					}
				});
				var tbodyCont = getBody(tData, opt);
				if (part === 'body') {
					//body局部更新
					var tbodyUpdate = inject(tbodyCont);
					if (opt.fixedIndex !== void(0)) {
						var tbodyUpdateFixed = tbodyUpdate.clone(true);
						tbodyUpdateFixed.each(function(row, tr) {
							$(tr).find('td').each(function(i, td) {
								if (i > opt.fixedIndex) {
									$(td).html('-').attr('class', 'tofixed');
								}
							});
						});
						tbodyUpdate.each(function(row, tr) {
							$(tr).find('td').each(function(i, td) {
								if (i <= opt.fixedIndex) {
									$(td).html('-').attr('class', 'tofixed');
								}
							});
						});
						$this.find('.table-fixed .table-body tbody').html(tbodyUpdateFixed);
					}
					$this.data('data', tData).find('.table-wrapper>.table-body tbody').html(tbodyUpdate);
					return syncStatus();
				}
				var html = '<div class="table-wrapper' + (tableWidth > totalWidth ? ' table-scroll-x' : '') + '" style="width:' + opt.width + 'px">';
				var thead = '<div class="table-header" style="width:' + tableWidth + 'px"><table class="table">';
				theadCont += '</tr></thead>';
				colgroup += '</colgroup>';
				thead += colgroup;
				thead += theadCont;
				thead += '</table></div>';
				var tbody = '<div class="table-body" style="width:' + tableWidth + 'px"><table class="table' + (opt.hover ? ' table-hover' : '') + (opt.condensed ? ' table-condensed' : '') + (opt.bordered ? ' table-bordered' : '') + (opt.striped ? ' table-striped' : '') + '" style="width:' + tableWidth + 'px">';
				tbody += colgroup;
				tbody += ('<tbody>' + tbodyCont + '</tbody>');
				tbody += '</table></div>';
				html += thead;
				html += tbody;
				if (fixedWidth) {
					var tfixed = '';
					tfixed = '<div class="table-fixed" style="width:' + fixedWidth + 'px">';
					tfixed += thead;
					tfixed += tbody;
					tfixed += '</div>';
					html += tfixed;
				}
				html += '</div>';
				return $this.data('data', tData).html(inject(html, true));
			};
			var inject = function(html, isInit) {
				var tableObj = $(html);
				var $fixed = tableObj.children('.table-fixed');
				if (isInit) {
					//初始化高度
					if (opt.height && !isNaN(parseFloat(opt.height))) {
						var trueHeight;
						tableObj.height(opt.height);
						trueHeight = tableObj.height();
						tableObj.find('.table-body').height(trueHeight - 43);
					}
					//初始化滚动同步
					if ($fixed.length) {
						tableObj.on('scroll', function(e) {
							$fixed.css('left', $(this).scrollLeft());
						}).children('.table-body').on('scroll', function() {
							$fixed.children('.table-body').scrollTop($(this).scrollTop());
						});
						if (opt.hover) {
							tableObj.children('.table-body').on('mouseenter', 'tr', function() {
								$fixed.find('.table-body tr').eq($(this).index()).addClass('table-tr-hover');
							}).on('mouseleave', 'tr', function() {
								$fixed.find('.table-body tr').eq($(this).index()).removeClass('table-tr-hover');
							});
							$fixed.children('.table-body').on('mouseenter', 'tr', function() {
								tableObj.find('.table-body tr').eq($(this).index()).addClass('table-tr-hover');
							}).on('mouseleave', 'tr', function() {
								tableObj.find('.table-body tr').eq($(this).index()).removeClass('table-tr-hover');
							});
						}
					}
				}
				if (opt.fixedIndex !== void(0) && $fixed.length) {
					$fixed.find('.table-body tr').each(function(row, tr) {
						$(tr).find('td').each(function(i, td) {
							if (i > opt.fixedIndex) {
								$(td).html('-').removeAttr('class');
							}
						});
					});
					tableObj.children('.table-body tr').each(function(row, tr) {
						$(tr).find('td').each(function(i, td) {
							if (i <= opt.fixedIndex) {
								$(td).html('-').removeAttr('class');
							}
						});
					});
				}
				$.each(opt.renderCollection, function(i, renderObj) {
					if (renderObj.entity) {
						tableObj.find('#' + renderObj.id).parents('td').data('entity', renderObj.entity);
					}
					tableObj.find('#' + renderObj.id).replaceWith(renderObj.el);
				});
				delete opt.renderCollection;
				return tableObj;
			};
			//收集选中项
			var multiCollection = [];
			//同步勾选状态
			var syncStatus = function() {
				$this.find('.table-body').each(function(tindex, table) {
					$(table).find('tr').each(function(i, tr) {
						var isIn = false;
						$.each(multiCollection, function(i, choosen) {
							if ($(tr).data('index') === choosen[indexKey]) {
								isIn = true;
								return false;
							}
						});
						$(tr).find('.table-choose-input').prop('checked', isIn);
						if (opt.highlight) {
							if (isIn) {
								$(tr).addClass('table-highlight');
							} else {
								$(tr).removeClass('table-highlight');
							}
						}
					});
				});
				if (opt.multi) {
					var isAllCheck = true;
					$.each($this.data('data'), function(si, row) {
						var isMatch;
						$.each(multiCollection, function(ri, select) {
							if (select[indexKey] === row[indexKey]) {
								isMatch = true;
								return false;
							}
						});
						if (!isMatch) {
							isAllCheck = false;
							return false;
						}
					});
					$this.find('.table-header .table-choose-all').prop('checked', isAllCheck);
				}
			};
			var selectRow = function(index, isSelect) {
				if(index === void 0){
					return null;
				}
				if (index >= opt.oData.length) {
					return console.warn('selectRow(): index 超出当前数据范围！');
				}
				var row = opt.oData[index][indexKey];
				if (opt.multi) {
					var alreadyIn;
					$.each(multiCollection, function(i, c) {
						if (c[indexKey] === row) {
							if (isSelect) {
								alreadyIn = true;
								return false;
							} else {
								multiCollection.splice(i, 1);
								return false;
							}
						}
					});
					if (isSelect && !alreadyIn) {
						multiCollection.push(opt.oData[row]);
					}
					if (typeof opt.onSelect === 'function') {
						opt.onSelect(row, opt.oData[row], multiCollection);
					}
				} else {
					if (multiCollection.length && (row === multiCollection[0][indexKey])) {
						multiCollection = [];
					} else {
						multiCollection = [opt.oData[row]];
						if (typeof opt.onSelect === 'function') {
							opt.onSelect(row, opt.oData[row], multiCollection);
						}
					}
				}
				syncStatus();
			};
			var selectAll = function(flag) {
				if (flag === false || (flag !== true && multiCollection.length === $this.data('data').length)) {
					multiCollection = [];
				} else {
					multiCollection = deepcopy($this.data('data'));
				}
				if (typeof opt.onSelect === 'function') {
					opt.onSelect('all', null, multiCollection);
				}
				syncStatus();
			};
			var isEditing; //编辑状态锁
			var tPager; //page对象
			var generate = function(data, opt, part) {
				var tData = deepcopy(data);
				isEditing = false;
				//生成索引
				$.each(tData, function(rowIndex, rowData) {
					if (rowData[indexKey] === void 0) {
						rowData[indexKey] = parseInt(rowIndex);
					}
				});
				//备份原始数据
				if (opt.holdStatus) {
					delete opt.holdStatus;
				} else {
					opt.oData = tData;
					multiCollection = [];
				}
				if (opt.page && opt.page.pageSize) {
					//数据分页
					var tDataGroup = [];
					var pageTemp = [];
					var showNum = Math.min(opt.page.pageSize, tData.length);
					$.each(tData, function(i, e) {
						if (i % showNum === 0) {
							if (pageTemp.length) {
								tDataGroup.push(deepcopy(pageTemp));
								pageTemp = [];
							}
						}
						pageTemp.push(e);
					});
					if (pageTemp.length) {
						tDataGroup.push(deepcopy(pageTemp));
						pageTemp = null;
					}

					tData = tDataGroup[0];
					require.async('page', function(Page) {
						var pageEl;
						if (opt.page.el && $(opt.page.el).length) {
							pageEl = $(opt.page.el);
						} else if (!$('#' + indexKey).length) {
							pageEl = $('<div id="' + indexKey + '"></div>');
							$this.after(pageEl);
						} else {
							pageEl = $('#' + indexKey);
						}
						tPager = Page({
							el: pageEl,
							total: tDataGroup.length,
							onChange: function(pagenumber) {
								tData = tDataGroup[pagenumber - 1];
								render(tData, opt, 'body');
								if (typeof opt.page.onChange === 'function') {
									opt.page.onChange(pagenumber);
								}
							}
						});
					});
				}

				render(tData, opt, part);

				if (!$this.data('table-events')) {
					$this.data('table-events', true);
					//绑定事件
					$this.on('click', 'td.table-cell-editable', function(e) {
						e.stopPropagation();
						var entity = $(this).data('entity');
						entity.edit($(this));
					}).on('click', '.table-choose-input', function(e) {
						e.stopPropagation();
						selectRow($(this).parents('tr').data('index'), $(this).prop('checked'));
					});
					if (opt.multi) {
						$this.on('click', '.table-choose-all', selectAll);
					} else {
						$this.on('click', '.table-body tr', function() {
							selectRow($(this).data('index'));
						});
					}
				}
			};
			generate(opt.data, opt);
			var changes = {
				add: [],
				update: [],
				delete: []
			};
			return {
				data: function(data) {
					if (data && $.isArray(data)) {
						generate(data, opt, 'body');
					} else {
						return opt.oData;
					}
				},
				column: function(column) {
					if (column && $.isArray(column)) {
						opt.column = column;
						render(opt.oData, opt);
					} else {
						return opt.column;
					}
				},
				getPager: function() {
					return tPager;
				},
				size: function(sizeConf) {
					if ($.isPlainObject(sizeConf)) {
						opt.width = sizeConf.width || opt.width;
						opt.height = sizeConf.height || opt.height;
						return render(opt.oData, opt);
					} else {
						return {
							width: opt.width,
							height: opt.height
						};
					}
				},
				reload: function() {
					generate(opt.data, opt);
				},
				getRows: function() {
					return $this.data('data');
				},
				getSelected: function() {
					return multiCollection;
				},
				scrollTo: function(index) {
					if (index === void 0 || index >= $this.data('data').length) {
						index = $this.data('data').length - 1;
					}
					var sth = $this.find('.table-wrapper>.table-body').find('tr').eq(index - 1).offset().top - $this.find('.table-wrapper>.table-body').offset().top;
					$this.find('.table-wrapper>.table-body').scrollTop(sth);
				},
				highlightRow: function(index) {
					if(index === void 0){
						return null;
					}
					if (index >= $this.data('data').length) {
						index = $this.data('data').length - 1;
					}
					$this.find('.table-body').each(function(i, e) {
						$(e).find('tr').eq(index - 1).addClass('table-highlight');
					});
				},
				selectAll: function() {
					return selectAll(true);
				},
				unselectAll: function() {
					return selectAll(false);
				},
				selectRow: function(index) {
					return selectRow(index, true);
				},
				unselectRow: function(index) {
					return selectRow(index, false);
				},
				getEntity: function(index, key) {
					if (index === void 0 || !key) {
						return console.warn('getEntity(): 参数不完整！');
					}
					if (index >= $this.data('data').length) {
						return console.warn('getEntity(): index 超出当前数据范围！');
					}
					var $td = $this.find('.row' + index + '-' + key);
					if(!$td.length){
						return console.warn('getEntity(): 无法获取指定单元格');
					}
					return $td.data('entity');
				},
				updateRow: function(index, row) {
					var cData = deepcopy(opt.oData);
					if (index >= cData.length) {
						return console.warn('updateRow(): index 超出当前数据范围！');
					}
					var oRow = cData[index];
					var newRow = $.extend({}, oRow, row || {});
					cData[newRow[indexKey]] = newRow;
					changes.update.push({
						index: newRow[indexKey],
						row: newRow,
						origin: opt.data[newRow[indexKey]]
					});
					return generate(cData, opt);
				},
				appendRow: function(row) {
					if ($.isPlainObject(row)) {
						var cData = deepcopy(opt.oData);
						row[indexKey] = cData.length;
						cData.push(row);
						changes.add.push({
							index: cData.length,
							row: row
						});
						return generate(cData, opt);
					}
				},
				insertRow: function(start, row) {
					if (typeof start === 'number' && $.isPlainObject(row)) {
						var cData = deepcopy(opt.oData);
						if (start >= cData.length) {
							return this.appendRow(row);
						}
						cData.splice(start, 0, row);
						for (var i = start; i < cData.length; i++) {
							cData[i][indexKey] = i;
						}
						changes.add.push({
							index: start,
							row: row
						});
						return generate(cData, opt);
					}
				},
				deleteRow: function(index) {
					if (index >= $this.data('data').length) {
						return console.warn('deleteRow(): index 超出当前数据范围！');
					}
					var cData = deepcopy(opt.oData);
					var delRow = cData.splice(index, 1);
					for (var i = index; i < cData.length; i++) {
						cData[i][indexKey] = i;
					}
					changes.delete.push({
						index: index,
						row: delRow[0]
					});
					return generate(cData, opt);
				},
				getChanges: function(type) {
					return changes[type] || changes;
				},
				sort: function(key, method) {
					if (key && key.split) {
						var sortedData = sortBy(key, method);
						if (opt.page && opt.page.pageSize) {
							opt.holdStatus = true;
							generate(sortedData, opt, 'body');
						} else {
							render(sortedData, opt, 'body');
						}
					}
				}
			};
		};

	$.fn.table = function(config) {
		return Table($.extend(config || {}, {
			el: this
		}));
	};
	module.exports = Table;
});