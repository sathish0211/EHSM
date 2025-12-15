sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, UIComponent, Filter, FilterOperator, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("ehsm.controller.Risk", {
        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("Risk").attachPatternMatched(this._onRouteMatched, this);
        },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        _onRouteMatched: function () {
            this._loadData();
        },

        _loadData: function () {
            var oModel = this.getOwnerComponent().getModel();
            var oSessionModel = this.getOwnerComponent().getModel("session");
            var sEmpId = oSessionModel ? oSessionModel.getProperty("/EmployeeId") : "00000001";

            var aFilters = [new Filter("EmployeeId", FilterOperator.EQ, sEmpId)];

            var oTable = this.byId("riskTable");
            oTable.setBusy(true);

            var that = this;
            oModel.read("/ZSG_EHSM_RISKSet", {
                filters: aFilters,
                success: function (oData) {
                    oTable.setBusy(false);
                    var oJsonModel = new JSONModel();
                    oJsonModel.setData({ results: oData.results });
                    that.getView().setModel(oJsonModel, "risks");

                    if (!oTable.getBinding("items")) {
                        oTable.bindItems({
                            path: "risks>/results",
                            template: new sap.m.ColumnListItem({
                                cells: [
                                    new sap.m.ObjectIdentifier({ title: "{risks>RiskId}" }),
                                    new sap.m.Text({ text: "{risks>RiskDescription}" }),
                                    new sap.m.Text({ text: "{risks>RiskCategory}" }),
                                    new sap.m.ObjectStatus({ text: "{risks>RiskSeverity}", state: { path: "risks>RiskSeverity", formatter: function (sVal) { return sVal === 'High' ? 'Error' : sVal === 'Medium' ? 'Warning' : 'Success'; } } }),
                                    new sap.m.Text({ text: "{risks>Likelihood}" }),
                                    new sap.m.Text({ text: "{risks>MitigationMeasures}" }),
                                    new sap.m.Text({ text: "{risks>Plant}" })
                                ]
                            })
                        });
                    }
                },
                error: function (oError) {
                    oTable.setBusy(false);
                    MessageToast.show("Failed to load risks");
                }
            });
        },

        onRefresh: function () {
            this._loadData();
        },

        onNavBack: function () {
            this.getRouter().navTo("Dashboard");
        }
    });
});
