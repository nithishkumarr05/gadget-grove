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

// Validation middleware
const validateForm = [
    check('firstname').isLength({ min: 2 }).withMessage('First Name must be at least 2 characters long'),
    check('lastname').isLength({ min: 2 }).withMessage('Last Name must be at least 2 characters long'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('conformpassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
];

app.post('/sign_up', validateForm, function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // If there are validation errors, send them to the client
        return res.status(400).json({ errors: errors.array() });
    }

    var Firstname = req.body.firstname;
    var Lastname = req.body.lastname;
    var Email = req.body.email;
    var Password = req.body.password;
    var Conformpassword = req.body.conformpassword;

    var data = {
        "firstname": Firstname,
        "lastname": Lastname,
        "email": Email,
        "password": Password,
        "Conformpassword": Conformpassword,
    }

    db.collection('login').insertOne(data, function (err, collection) {
        if (err) throw err;
        console.log("Record inserted Successfully");
    });

    return res.redirect('./loginsuc.html');
})

app.listen(5500);
console.log("server listening at port 5500");
