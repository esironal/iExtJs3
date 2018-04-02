/*
 * User login
 */

Ext.ns("App");

App.LoginWin = function() {
	return {
		show: function() {
			if(!this.win) {
				this.win = this.getWin();
			}
			this.win.show();
		},
		
		getWin: function() {
			var form = this.getForm();
			var win = new Ext.Window({
				Title :  " User login " ,
				width: 400,
				height: 250,
				plain: true,
				resizable: false,
				closable: false,
				//draggable: true,
				//frame: true,
				layout: "fit",
				border: false,
				modal: true,
				items: [form]
			});
			this.form = form;
			return win;
		},
		
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
					xtype: "displayfield",
					hideLabel: true,
					html: "<img src='img/logo.png' class='login-logo' />"
				}, {
					name: "username",
					fieldLabel :  " username " ,
					value: "Neo"
				}, {
					inputType: "password",
					name: "password",
					fieldLabel: "password",
					value: "123456"
				}],
				buttons: [{
					Text :  " Login " ,
					scope: this,
					handler: function() {
						this.submit();
					}
				}, {
					Text :  " Reset " ,
					scope: this,
					handler: function() {
						this.form.getForm().reset();
					}
				}]
			});
			return form;
		},
		
		submit: function() {
			if(this.form.getForm().isValid()) {
				window.location.href = "main.html";
			}
		}
	};
}();
