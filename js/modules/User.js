/*
 * User Management
 */

App.User = function() {
	return {
		// define the variable
		currentFormValues: {},
		
		// initialize
		render: function(id) {
			if(!this.store) {
				this.store = this.getStore();
			}
			if(!this.form) {
				this.form = this.getForm();
			}
			if(!this.win) {
				this.win = this.getWin();
			}
			this.createGrid(id);
		},
		
		// Get store
		getStore: function() {
//			var store = new Ext.data.ArrayStore({
//				fields: ["id", "name", "desc"],
//				data: [
// 					["1", "Super Administrator", "Has System All Permissions"],
// 					["2", "Administrator", "Having partial administrative rights to the system"],
// 					["3", "Site Editing," "Own, Create, Post, Modify, Delete Permissions for Article"]
//				]
//			});
			var store = new Ext.data.JsonStore({
				//store configs
				storeId: "userStore",
				autoLoad :  true , // autoload
				fields: [
					{name: "id"},
					{name: "name"},
					{name: "role"},
					{name: "state"},
					{name: "remark"}
				],
				url: "data/user.json",
				
				//reader configs
				totalProperty: "total",
				root: "rows"
			});
			//store.load();
			return store;
		},
		
		// Create a form
		getForm: function() {
			var form = new Ext.form.FormPanel({
				labelWidth: 40,
				buttonAlign: "center",
				bodyStyle: "padding:10px;",
				frame: true,
				layout: "hbox",
				defaults: {
					layout: "form"
				},
				items: [{
					flex: 1,
					items: [{
						xtype: "hidden",
						name: "id",
						value: ""
					}, {
						xtype: "textfield",
						name: "name",
						fieldLabel :  " Name",
						tabIndex: 1,
						anchor: "98%",
						allowBlank: false
					}, {
						xtype: "combo",
						name: "state",
						fieldLabel :  " Status",
						tabIndex: 3,
						anchor: "98%",
						allowBlank: false,
						mode: "local",
						Store :  new  Ext.data.ArrayStore ({	 // local data source
							autoLoad: true,
							fields: ["val", "txt"],
							data: [
								["0", "启用"],
								["1", "禁用"]
							]
						}),
						valueField: "val",
						displayField: "txt",
						editable : false,
						selectOnFocus: true,
						triggerAction : 'all'
					}]
				}, {
					flex: 1,
					margins: "0 0 0 10",
					items: [{
						xtype: "combo",
						name: "role",
						fieldLabel: "角色",
						tabIndex: 2,
						anchor: "98%",
						allowBlank: false,
						emptyText :  " select role " ,
						Mode :  " local " , // Load with GET
						Store :  new  Ext.data.JsonStore ({	 // remote data source
							autoLoad: true,
							url: "data/role.json",
							root: "rows",
							fields: ["name"]
						}),
						valueField: "name",
						displayField: "name",
						editable : false,
						selectOnFocus: true,
						triggerAction : 'all'
					}, {
						xtype: "textarea",
						name: "remark",
						fieldLabel: "备注",
						tabIndex: 4,
						anchor: "98%"
					}]
				}],
				buttons: [{
					Text :  " OK " ,
					scope: this,
					handler: function() {
						this.submit();
					}
				}, {
					Text :  " Reset " ,
					scope: this,
					handler: function() {
						this.form.getForm().reset();
						this.form.getForm().setValues(this.currentFormValues);
						this.form.getForm().clearInvalid();
					}
				}]
			});
			return form;
		},
		
		// Submit the form
		submit: function() {
			Var fr =  this . form . getForm ();	 // Get BasicForm object
			if(fr.isValid()) {
				var id = fr.findField("id").getValue();
				
				If (id) { // Edit
					var rec = this.store.getById(id);
					rec.set("name", fr.findField("name").getValue());
					rec.set("role", fr.findField("role").getValue());
					rec.set("state", fr.findField("state").getValue());
					rec.set("remark", fr.findField("remark").getValue());
// 					this.store.rejectChanges(); // cancel all changes
					This . store . commitChanges ();	 // commit modified data
				} Else {	 // Add new
					var UserRecord = Ext.data.Record.create([
						{name: "id"},
						{name: "name"},
						{name: "role"},
						{name: "state"},
						{name: "remark"}
					]);
//					var rec = new RoleRecord({
//						id: "4",
// 						name: "Add role,"
// 						desc: "This is a new character for the test"
//					}, id);
					var obj = fr.getValues();
					obj.id = this.store.data.length+1;
					var rec = new UserRecord(obj, obj.id);
					this.store.add(rec);
				}
				
				this.win.hide();
//				this.store.reload();
			}
		},
		
	    // Create a window
	    getWin: function() {
	    	var win = new Ext.Window({
	    		width: 600,
	    		height: 250,
	    		title: "",
	    		plain: true,
	    		resizable: false,
	    		frame: true,
	    		closeAction: "hide",
	    		border: false,
	    		modal: true,
	    		layout: "fit",
	    		items: [this.form],
	    		listeners: {
	    			scope: this,
	    			render: function(fp) {
	    				this.form.form.waitMsgTarget = fp.getEl();
	    			},
	    			show: function() {
	    				this.form.form.setValues(this.currentFormValues);
	    				this.form.form.clearInvalid();
	    			}
	    		}
	    	});
	    	return win;
	    },
		
		// Create Grid
		createGrid: function(id) {
			var panel = Ext.getCmp(id);
			panel.body.dom.innerHTML = "";
			var sm = new Ext.grid.CheckboxSelectionModel();
			
			this.grid = new Ext.grid.GridPanel({
				tbar : [{
					Text :  " New " ,
					iconCls: "x-btn-add",
					scope: this,
					handler: this.add
				}, "-", {
					Text :  " edit " ,
					iconCls: "x-btn-edit",
					scope: this,
					handler: this.edit
				}, "-", {
					Text :  " Delete " ,
					iconCls: "x-btn-del",
					scope: this,
					handler: this.del
				}, "->", {
					xtype: "textfield",
					emptyText :  " Please enter keyword "
				}, {
					xtype: "button",
					Text :  " Query " ,
					iconCls: "x-btn-search",
					scope: this,
					handler: this.search
				}],
				bbar: new Ext.PagingToolbar({
					store: this.store,
					pageSize: 20,
					displayInfo: true
				}),
				
				store: this.store,
				sm: sm,
				columns: [sm, {
					header: "姓名",
					width: 100,
					sortable: true,
					dataIndex: "name"
				}, {
					header: "角色",
					width: 100,
					sortable: true,
					dataIndex: "role"
				}, {
					header: "状态",
					width: 100,
					sortable: true,
					dataIndex: "state",
					renderer: function(val) {
						if(val=="0" || val=="启用") {
							return "<span style='color:green;'>启用</span>";
						}else if(val=="1" || val=="禁用") {
							return "<span style='color:red;'>禁用</span>";
						}
						return val;
					}
				}, {
					header: "备注",
					width: 300,
					sortable: false,
					dataIndex: "remark"
				}],
				
				border: false,
				viewConfig: {
					forceFit: true
				}
			});
			panel.add(this.grid);
		},
		
		// Query
		search: function() {
			//console.log("Search ...");
			this.store.reload();
		},
		
		// Add
		add: function() {
			This . win . setTitle ( " new user " );
			Ext.apply(this.currentFormValues, {
				id: "",
				name: "",
				role: "",
				state: "0",
				remark: ""
			});
			this.win.show();
		},
		
		// edit
		edit: function() {
			if(this.grid.getSelectionModel().hasSelection()) {
				This . win . setTitle ( " edit user " );
				var rec = this.grid.getSelectionModel().getSelected();
				Ext.apply(this.currentFormValues, {
					id: rec.data.id,
					name: rec.data.name,
					role: rec.data.role,
					state: rec.data.state,
					remark: rec.data.remark
				});
//				this.form.getForm().loadRecord(rec);
				this.win.show();
			}else {
				Ext . Msg . alert ( " Messages " , " Please select the user to edit! " );
			}
		},
		
		// Delete
		del: function() {
			if(this.grid.getSelectionModel().hasSelection()) {
				var st = this.store;
				var recs = this.grid.getSelectionModel().getSelections();
				var names = "";
				for(var i=0;i<recs.length;i++) {
					names += recs[i].data.name+"<br />";
				}
				Ext . Msg . confirm ( " confirm " , " confirm to delete the following user?<br /> " + names, function ( btn ) {
					if(btn=="yes") {
						St . remove (recs); // front desk delete
						//st.reload();
					}
				});
			}else {
				Ext . Msg . alert ( " Message " , " Please select the user to delete! " );
			}
		}
	}
}();
