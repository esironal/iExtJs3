/*
 * Application entry file 
 */

Ext.ns("App");

App.init = function() {
	Ext.QuickTips.init();
	Ext.Msg.minWidth = 300;
	App.LoginWin.show();
};

Ext.onReady(App.init);
