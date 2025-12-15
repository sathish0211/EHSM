sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("ehsm.controller.Login", {
        onInit: function () {
        },

        onLogin: function () {
            var sEmpId = this.getView().byId("inpEmpId").getValue();
            var sPassword = this.getView().byId("inpPass").getValue();

            if (!sEmpId || !sPassword) {
                MessageToast.show("Please enter both Employee ID and Password");
                return;
            }

            // OData Call
            // EntitySet: ZSG_EHSM_LOGINSet
            // Key: EmployeeId='{EMP_ID}',Password='{PASSWORD}'

            var oModel = this.getOwnerComponent().getModel();
            var sPath = "/ZSG_EHSM_LOGINSet(EmployeeId='" + sEmpId + "',Password='" + sPassword + "')";

            var that = this;
            this.getView().setBusy(true);

            oModel.read(sPath, {
                success: function (oData) {
                    that.getView().setBusy(false);
                    if (oData.Status === "Success") {
                        MessageToast.show("Login Successful");
                        // Store session content if needed, e.g. in a global model
                        var oSessionModel = new JSONModel({
                            EmployeeId: oData.EmployeeId,
                            FirstName: oData.FirstName, // Assuming profile data might return or just ID
                            LoggedIn: true
                        });
                        that.getOwnerComponent().setModel(oSessionModel, "session");

                        // Navigate
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                        oRouter.navTo("Dashboard");
                    } else {
                        MessageBox.error("Invalid Employee ID or Password");
                    }
                },
                error: function (oError) {
                    that.getView().setBusy(false);
                    try {
                        var oBody = JSON.parse(oError.responseText);
                        MessageBox.error(oBody.error.message.value);
                    } catch (e) {
                        MessageBox.error("Login failed. Please check network connection or credentials.");
                    }
                }
            });
        }
    });
});
