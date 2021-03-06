Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
	launch: function() {
		
		// Program Risk Log
		var project_oid = '/project/40886178637';
		
		Ext.create('Rally.data.wsapi.Store', {
			model: 'userstory',
			autoLoad: true,
			context: {
				project: project_oid,
				projectScopeDown: true,
				projectScopeUp: false
			},
			listeners: {
				load: this._onDataLoaded,
				scope: this
			},
			fetch: ['FormattedID', 'Name', 'Owner', 'c_RiskLikelihood', 'c_RiskImpact', 'c_RiskStatus', 'CreationDate']
		});
	},

	_onDataLoaded: function(store, data) {
		
		function formatDate(dateString) {
			if(!dateString) { return ''; }
			thisYear = dateString.getFullYear();
			thisMonth = ("0" + (dateString.getMonth() + 1)).slice(-2);
			thisDay = ("0" + dateString.getDate()).slice(-2);

			thisDate = thisMonth + "/" + thisDay + "/" + thisYear;
			return(thisDate);
		}
		
		var records = _.map(data, function(record) {
			//// Perform custom actions with the data here'
			// if ('' !== record.get('c_RiskLikelihood')){
				// var regExp = /\(([^)]+)\)/;
				// var likelymatches = regExp.exec(record.get('c_RiskLikelihood'));
				// var likely = Ext.num(likelymatches[1]);
				// var impactmatches = regExp.exec(record.get('c_RiskImpact'));
				// var impact = Ext.num(impactmatches[1]);
				//// Calculations, etc.
				// return Ext.apply({
					// Exposure: Ext.num(likely * impact)
				// }, record.getData());
			// }else{
				// return Ext.apply({
					// Exposure: 0
				// }, record.getData());
			// }
		});

		function sean(record) {
			if ('' !== record.get('c_RiskLikelihood')){
				var regExp = /\(([^)]+)\)/;
				var likelymatches = regExp.exec(record.get('c_RiskLikelihood'));
				var likely = Ext.num(likelymatches[1]);
				var impactmatches = regExp.exec(record.get('c_RiskImpact'));
				var impact = Ext.num(impactmatches[1]);
				return (Ext.num(likely * impact));
				//Calculations, etc.
				// return Ext.apply({
					// Exposure: Ext.num(likely * impact)
				// }, record.getData());
			}else{
				return 0;
				// return Ext.apply({
					// Exposure: 0
				// }, record.getData());
			}
		}

		if (!this.down('#risks')) {
		
			this.add({
				xtype: 'rallygrid',
				id: 'risks',
				width: '99%',
				showPagingToolbar: true,
				enableEditing: true,
				// enableBulkEdit: true,
				// store: Ext.create('Rally.data.custom.Store', {
					// data: records
				// }),
				store: store,
				listeners: {
					load: this._onGridLoaded,
					scope: this
				},
				columnCfgs: [
					{
						xtype: 'templatecolumn',
						text: 'ID',
						dataIndex: 'FormattedID',
						// width: 30,
						tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')
					},
					{
						text: 'Name',
						dataIndex: 'Name',
						width: 400,
						flex: 1
					},
					{
						text: 'Owner',
						dataIndex: 'Owner',
						renderer: function(value) {
							if(!value){
								return '';
							}else{
								return value._refObjectName;
							}
						}
					},	
					{
						text: 'Risk Likelihood',
						dataIndex: 'c_RiskLikelihood'
					},
					{
						text: 'Risk Impact',
						dataIndex: 'c_RiskImpact'
					},
					{
						text: 'Exposure (L * I)',
						// doSort: function(state) {
							// console.log("SORTING");
						// },
						renderer: function(value,meta,record) {
							return sean(record);
						}
					},
					{
						text: 'Risk Status',
						dataIndex: 'c_RiskStatus'
					},
					{
						text: 'Creation Date',
						dataIndex: 'CreationDate',
						renderer: function(value) {
							return formatDate(value);
						}
					}
				]
			});
		
		}
	},
	
	_onGridLoaded: function(){
		console.log("LOADED GRID");
	}
});
