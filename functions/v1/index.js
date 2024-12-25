const admin = require('firebase-admin')
const functions = require("firebase-functions");

// Third Party Libraries
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/hii", async (req, res) => {
    res.status(200).send("Assalamu alaikum")
})

app.use('/teacher', require('./routes/teacherRoute'))

// const Port = process.env.PORT || 3000
// app.listen(Port, () => {
//     console.log(`Server host on ${Port}`)
// })

module.exports = functions.https.onRequest(app)