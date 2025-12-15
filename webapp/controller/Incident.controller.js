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
            this._applyFilters();
        },

        _applyFilters: function () {
            var oSessionModel = this.getOwnerComponent().getModel("session");
            var sEmpId = oSessionModel ? oSessionModel.getProperty("/EmployeeId") : "00000001"; // Fallback to 00000001

            // Mandatory Filter by EmployeeId
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
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },

        onSearch: function () {
            this._applyFilters();
        },

        onFilterSelect: function () {
            this._applyFilters();
        },

        onNavBack: function () {
            this.getRouter().navTo("Dashboard");
        }
    });
});
