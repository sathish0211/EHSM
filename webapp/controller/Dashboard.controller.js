sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
    "use strict";

    return Controller.extend("ehsm.controller.Dashboard", {
        onInit: function () {
            // Optional: Fetch real counts from OData if endpoints supported $count or specific aggregates
        },

        onPressProfile: function () {
            this.getRouter().navTo("Profile");
        },

        onPressIncidents: function () {
            this.getRouter().navTo("Incident");
        },

        onPressRisks: function () {
            this.getRouter().navTo("Risk");
        },

        onLogout: function () {
            // Clear session if any
            this.getRouter().navTo("Login");
        },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        onNavBack: function () {
            this.onLogout();
        }
    });
});
