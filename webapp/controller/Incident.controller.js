sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, UIComponent, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("ehsm.controller.Incident", {
        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("Incident").attachPatternMatched(this._onRouteMatched, this);
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

            // UI Filters
            var sQuery = this.byId("searchField").getValue();
            if (sQuery) {
                aFilters.push(new Filter("IncidentDescription", FilterOperator.Contains, sQuery));
            }

            var sStatus = this.byId("selectStatus").getSelectedKey();
            if (sStatus) {
                aFilters.push(new Filter("IncidentStatus", FilterOperator.EQ, sStatus));
            }

            var sPriority = this.byId("selectPriority").getSelectedKey();
            if (sPriority) {
                aFilters.push(new Filter("IncidentPriority", FilterOperator.EQ, sPriority));
            }

            var oTable = this.byId("incidentTable");
            oTable.setBusy(true);

            // Backend sends duplicate keys in __metadata, so we must use JSONModel to avoid UI5 merging everything into one row
            var that = this;
            oModel.read("/ZSG_EHSM_INCIDENTSet", {
                filters: aFilters,
                success: function (oData) {
                    oTable.setBusy(false);
                    var oJsonModel = new sap.ui.model.json.JSONModel();
                    oJsonModel.setData({ results: oData.results });
                    that.getView().setModel(oJsonModel, "incidents");

                    // Bind if not bound
                    if (!oTable.getBinding("items")) {
                        oTable.bindItems({
                            path: "incidents>/results",
                            template: new sap.m.ColumnListItem({
                                cells: [
                                    new sap.m.ObjectIdentifier({ title: "{incidents>IncidentId}" }),
                                    new sap.m.Text({ text: "{incidents>IncidentDescription}" }),
                                    new sap.m.Text({ text: "{incidents>IncidentCategory}" }),
                                    new sap.m.ObjectStatus({ text: "{incidents>IncidentPriority}", state: { path: "incidents>IncidentPriority", formatter: function (sVal) { return sVal === 'High' ? 'Error' : sVal === 'Medium' ? 'Warning' : 'Success'; } } }),
                                    new sap.m.ObjectStatus({ text: "{incidents>IncidentStatus}", state: { path: "incidents>IncidentStatus", formatter: function (sVal) { return sVal === 'New' ? 'Error' : sVal === 'In Progress' ? 'Warning' : 'Success'; } } }),
                                    new sap.m.Text({ text: { path: "incidents>IncidentDate", type: "sap.ui.model.type.Date", formatOptions: { style: "medium" } } }),
                                    new sap.m.Text({ text: "{incidents>Plant}" })
                                ]
                            })
                        });
                    }
                },
                error: function (oError) {
                    oTable.setBusy(false);
                    sap.m.MessageToast.show("Failed to load incidents");
                }
            });
        },

        onRefresh: function () {
            this._loadData();
        },

        onSearch: function () {
            this._loadData();
        },

        onFilterSelect: function () {
            this._loadData();
        },

        onNavBack: function () {
            this.getRouter().navTo("Dashboard");
        }
    });
});
