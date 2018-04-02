
/*
 * Department management
 */

App.Department = function() {
	return {
		// initialize
		render: function(id) {
			if(!this.departmentWin) {
				this.departmentWin = this.getDepartmentWin();
			}
			if(!this.employeeStore) {
				this.employeeStore = this.getEmployeeStore();
			}
			if(!this.employeeGrid) {
				this.employeeGrid = this.getEmployeeGrid();
			}
			if(!this.employeeWin) {
				this.employeeWin = this.getEmployeeWin();
			}
			this.createTree(id);
		}, 
		
		// Create TreePanel
		createTree: function(id) {
			var panel = Ext.getCmp(id);
			panel.body.dom.innerHTML = "";
			
			this.tree = new Ext.tree.TreePanel({
				border: false,
				useArrows: true,
				autoScroll: true,
//				enableDD: true,
//				dropConfig: {
//					ddGroup: "TreeDD" 
//				},
				
				//auto create TreeLoader
				root: {
					nodeType: "async",
					draggable: false,
					id: "topicRoot"
				},
				rootVisible: false,
				requestMethod: "GET",
				dataUrl: "data/department.json",
				tbar: ["->", {
					iconCls: "x-btn-refresh",
					tooltip: "刷新",
					scope: this,
					handler: this.refresh
				}],
				bbar : [{
					text: "保存",
					iconCls: "x-btn-save",
					scope: this
				}, "-", {
					text: "取消",
					iconCls: "x-btn-warning",
					scope: this
				}],
				contextMenu: new Ext.menu.Menu({
					minWidth: 120,
					items: [{
						Text :  " Add department " ,
						itemId: "addBtn",
						iconCls: "x-btn-add",
						scope: this,
						handler: this.addDepartment
					}, {
						Text :  " Add Employee " ,
						itemId: "selBtn",
						iconCls: "x-btn-file-search",
						scope: this,
						handler: this.addEmployee
					}, "-", {
						text: "上移",
						iconCls: "x-btn-up",
						scope: this,
						handler: this.moveUp
					}, {
						Text :  " move down " ,
						iconCls: "x-btn-down",
						scope: this,
						handler: this.moveDown
					}, "-", {
						Text :  " edit " ,
						itemId: "editBtn",
						iconCls: "x-btn-edit"
					}, {
						Text :  " Delete " ,
						iconCls: "x-btn-del",
						scope: this,
						handler: this.delNode
					}]
				}),
				listeners: {
					click: function(n) {
//						n.select();
//						console.log(n.attributes.text);
					},
					contextmenu: function(node, ev) {
						node.select();
						var t =  node . attributes . type ;
						var cm = node.getOwnerTree().contextMenu;
						var addBtn = cm.getComponent("addBtn");
						var selBtn = cm.getComponent("selBtn");
						var editBtn = cm.getComponent("editBtn");
						if(node.isLeaf()) {
							addBtn.hide();
							selBtn.hide();
							editBtn.hide();
						}else {
							if(t=="1") {
								addBtn.show();
								selBtn.hide();
								editBtn.show();
							}else if(t=="2") {
								addBtn.hide();
								selBtn.show();
								editBtn.show();
							}
						}
						cm.contextNode = node;
						cm . showAt ( ev . getXY ());
					}
				}
			});
			this.tree.expandAll();
			panel.add(this.tree);
		},
		
		// Refresh the entire tree
		refresh: function() {
			this.tree.root.reload();
			this.tree.expandAll();
		},
		
		// Add department
		addDepartment: function() {
			this.departmentWin.show();
		},
		
		// Add employee
		addEmployee: function() {
			this.employeeWin.show();
		},
		
		// Get departmentWin
		getDepartmentWin: function() {
			var win = new Ext.Window({
				width: 600,
	    		height: 250,
	    		Title :  " Add Department " ,
	    		plain: true,
	    		resizable: false,
	    		frame: true,
	    		closeAction: "hide",
	    		border: false,
	    		modal: true,
	    		layout: "fit",
	    		items: [{
					xtype: "form",
					labelWidth: 60,
					bodyStyle: "padding:10px;",
    				tbar: ["->", {
    					xtype: "button",
    					text: "保存",
    					iconCls: "x-btn-save"
    				}],
					items: [{
						xtype: "textfield",
						name: "topicName",
						fieldLabel :  " Department Name " ,
						tabIndex: 1,
						anchor: "99%",
						allowBlank: false
					}]
				}]
			});
			return win;
		},
		
		// Get employeeGrid
		getEmployeeGrid: function() {
			var sm = new Ext.grid.CheckboxSelectionModel();
			var grid = new Ext.grid.GridPanel({
				tbar : [{
					xtype: "textfield",
					emptyText :  " English name "
				}, {
					xtype: "textfield",
					emptyText :  " Chinese name " ,
					style: "margin-left:5px;"
				}, {
					Text :  " Query " ,
					iconCls: "x-btn-search",
					scope: this
				}, "->", {
					text: "保存",
					iconCls: "x-btn-save",
					scope: this
				}],
				bbar: new Ext.PagingToolbar({
					store: this.employeeStore,
					pageSize: 20,
					displayInfo: true
				}),
				store: this.employeeStore,
				sm: sm,
				columns: [sm, {
					Header :  " Employee ID " ,
					width: 100,
					sortable: true,
					dataIndex: "code"
				}, {
					header: "英文名",
					width: 100,
					sortable: true,
					dataIndex: "nameEn"
				}, {
					header: "中文名",
					width: 100,
					sortable: true,
					dataIndex: "nameZh"
				}],
				viewConfig: {
					forceFit: true
				}
			});
			return grid;
		},
	
		// Get employeeStore
		getEmployeeStore: function() {
			var store = new Ext.data.ArrayStore({
				fields: ["code", "nameEn", "nameZh"],
				data: [
					["001", "Jacky", "张三"],
					["002", "Paul", "李四"],
					["003", "Tom", "王五"]
				]
			});
			return store;
		},
	
		// Get employeeWin
		getEmployeeWin: function() {
			var win = new Ext.Window({
				width: 600,
	    		height: 400,
	    		Title :  " Add Employee " ,
	    		plain: true,
	    		resizable: false,
	    		frame: true,
	    		closeAction: "hide",
	    		border: false,
	    		modal: true,
	    		layout: "fit",
	    		items: [this.employeeGrid]
			});
			return win;
		},
	
		// Move up
		moveUp: function(item) {
			var ctNode = item.parentMenu.contextNode;
			if(!ctNode.isFirst()) {
				var byNode =  ctNode . parentNode ;
				var prevNode = ctNode.previousSibling;
				parNode.insertBefore(ctNode, prevNode);
			}
		},
		
		// down
		moveDown: function(item) {
			var ctNode = item.parentMenu.contextNode;
			if(!ctNode.isLast()) {
				var byNode =  ctNode . parentNode ;
				was nextNode =  ctNode . nextSibling ;
				parNode.insertBefore(nextNode, ctNode);
			}
		},
		
		// Delete node
		delNode: function(item) {
			var ctNode = item.parentMenu.contextNode;
			if(ctNode.isLeaf()) {
				Ext . Msg . confirm ( " Confirm " , " Confirm to delete this child node?<br /> " + ctNode . attributes . text , function ( btn ) {
					if(btn=="yes") {
						ctNode.remove();
					}
				});
			}else {
				Ext . Msg . confirm ( " confirm " , " confirm to delete the parent node (including its children)? <br /> " + ctNode . attributes . Text , function ( btn ) {
					if(btn=="yes") {
						ctNode.remove();
					}
				});
			}
		}
	};
}();
