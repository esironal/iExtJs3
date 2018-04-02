/*
 * Role Management
 */

App.Role = function() {
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
				storeId: "roleStore",
				autoLoad: true,
				fields: [
					{name: "id"},
					{name: "name"},
					{name: "desc"}
				],
				url: "data/role.json",
				
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
				labelWidth: 70,
				buttonAlign: "center",
				bodyStyle: "padding:10px;",
				frame: true,
				defaultType: "textfield",
				defaults: {
					allowBlank: false,
					anchor: "98%",
					enableKeyEvents: false
				},
				items: [{
					xtype: "hidden",
					name: "id",
					value: ""
				}, {
					name: "name",
					fieldLabel :  " Role Name "
				}, {
					name: "desc",
					xtype: "textarea",
					fieldLabel: "描述"
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
					rec.set("desc", fr.findField("desc").getValue());
// 					this.store.rejectChanges(); // cancel all changes
					This . store . commitChanges ();	 // commit modified data
				} Else {	 // Add new
					var RoleRecord = Ext.data.Record.create([
						{name: "id"},
						{name: "name"},
						{name: "desc"}
					]);
//					var rec = new RoleRecord({
//						id: "4",
// 						name: "Add role,"
// 						desc: "This is a new character for the test"
//					}, id);
					var obj = fr.getValues();
					obj.id = this.store.data.length+1;
					var rec =  new  RoleRecord (obj, obj . a );
					this.store.add(rec);
				}
				
				this.win.hide();
//				this.store.reload();
			}
		},
		
	    // Create a window
	    getWin: function() {
	    	var win = new Ext.Window({
	    		width: 400,
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
					header: "编号",
					width: 100,
					sortable: true,
					dataIndex: "id"
				}, {
					Header :  " role name " ,
					width: 200,
					sortable: true,
					dataIndex: "name"
				}, {
					header: "描述",
					width: 300,
					sortable: false,
					dataIndex: "desc"
				}],
				
				border: false,
				viewConfig: {
					forceFit: true
				},
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
			This . win . setTitle ( " add role " );
			Ext.apply(this.currentFormValues, {
				id: "",
				name: "",
				desc: ""
			});
			this.win.show();
		},
		
		// edit
		edit: function() {
			if(this.grid.getSelectionModel().hasSelection()) {
				This . win . setTitle ( " edit role " );
				var rec = this.grid.getSelectionModel().getSelected();
				Ext.apply(this.currentFormValues, {
					id: rec.data.id,
					name: rec.data.name,
					desc: rec.data.desc
				});
//				this.form.getForm().loadRecord(rec);
				this.win.show();
			}else {
				Ext . Msg . alert ( " Message " , " Please select the character you want to edit! " );
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
				Ext . Msg . confirm ( " confirm " , " confirm to delete the following roles?<br /> " + names, function ( btn ) {
					if(btn=="yes") {
						St . remove (recs); // front desk delete
						//st.reload();
					}
				});
			}else {
				Ext . Msg . alert ( " Messages " , " Please select the characters to be deleted! " );
			}
		}
	}
}();
