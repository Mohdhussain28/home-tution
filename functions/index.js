const admin = require("firebase-admin");
// var serviceAccount = require("./serviceAccountAstrader.json");

admin.initializeApp({});

module.exports = {
    v1: require("./v1"),
};
