sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, UIComponent, Filter, FilterOperator) {
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
            var oSessionModel = this.getOwnerComponent().getModel("session");
            var sEmpId = oSessionModel ? oSessionModel.getProperty("/EmployeeId") : "00000001";

            var aFilters = [new Filter("EmployeeId", FilterOperator.EQ, sEmpId)];

            var oTable = this.byId("riskTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },

        onNavBack: function () {
            this.getRouter().navTo("Dashboard");
        }
    });
});
