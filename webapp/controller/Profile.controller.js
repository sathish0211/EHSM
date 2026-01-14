// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/core/UIComponent"
// ], function (Controller, UIComponent) {
//     "use strict";

//     return Controller.extend("ehsm.controller.Profile", {
//         onInit: function () {
//             var oRouter = this.getRouter();
//             oRouter.getRoute("Profile").attachPatternMatched(this._onObjectMatched, this);
//         },

//         getRouter: function () {
//             return UIComponent.getRouterFor(this);
//         },

//         _onObjectMatched: function (oEvent) {
//             // In a real scenario, we get the ID from the session model we set in Login
//             var oSessionModel = this.getOwnerComponent().getModel("session");
//             var sEmpId = oSessionModel ? oSessionModel.getProperty("/EmployeeId") : "";

//             if (!sEmpId) {
//                 // Fallback for testing purely this view or if reload happens
//                 sEmpId = "00000001";
//             }

//             this.getView().bindElement({
//                 path: "/ZSG_EHSM_PROFILESet('" + sEmpId + "')"
//             });
//         },

//         onNavBack: function () {
//             this.getRouter().navTo("Dashboard");
//         }
//     });
// });
