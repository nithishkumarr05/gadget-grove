var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

mongoose.connect('mongodb://localhost:27017/gfg');
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function (callback) {
    console.log("connection succeeded");
})

var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));


const validateForm = [
    check('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    check('num').isMobilePhone().withMessage('Invalid mobile number'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('pin').isLength({ min: 6, max: 6 }).isNumeric().withMessage('Invalid pincode'),
];

app.post('/sign_up', validateForm, function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    var Name = req.body.name;
    var Number = req.body.num;
    var address = req.body.add;
    var email = req.body.email;
    var storage = req.body.sto;
    var model = req.body.mod;
    var color = req.body.col;
    var Pincode = req.body.pin;

    var data = {
        "name": Name,
        "num": Number,
        "add": address,
        "email": email,
        "sto": storage,
        "mod": model,
        "col": color,
        "pin": Pincode,
    }

    db.collection('Orders').insertOne(data, function (err, collection) {
        if (err) throw err;
        console.log("Record inserted Successfully");
    });
    return res.redirect('./success.html');
})

app.listen(8000);
console.log("server listening at port 3000");
