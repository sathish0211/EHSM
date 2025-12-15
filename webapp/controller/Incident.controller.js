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

            // Check if already bound
            if (!oTable.getBinding("items")) {
                oTable.bindItems({
                    path: "/ZSG_EHSM_INCIDENTSet",
                    template: new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.ObjectIdentifier({ title: "{IncidentId}" }),
                            new sap.m.Text({ text: "{IncidentDescription}" }),
                            new sap.m.Text({ text: "{IncidentCategory}" }),
                            new sap.m.ObjectStatus({ text: "{IncidentPriority}", state: { path: "IncidentPriority", formatter: function (sVal) { return sVal === 'High' ? 'Error' : sVal === 'Medium' ? 'Warning' : 'Success'; } } }),
                            new sap.m.ObjectStatus({ text: "{IncidentStatus}", state: { path: "IncidentStatus", formatter: function (sVal) { return sVal === 'New' ? 'Error' : sVal === 'In Progress' ? 'Warning' : 'Success'; } } }),
                            new sap.m.Text({ text: { path: "IncidentDate", type: "sap.ui.model.type.Date", formatOptions: { style: "medium" } } }),
                            new sap.m.Text({ text: "{Plant}" })
                        ]
                    }),
                    filters: aFilters
                });
            } else {
                oTable.getBinding("items").filter(aFilters);
            }
        },

        onRefresh: function () {
            var oTable = this.byId("incidentTable");
            if (oTable.getBinding("items")) {
                oTable.getBinding("items").refresh(true);
            }
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
