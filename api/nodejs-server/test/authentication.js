//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const lodb = require('lodb');
const db = lodb('db.json');
const should = chai.should();

let Authentication = db('authentication').value();


// // Auth

// {
//   "apiKey": "123456789123456789",
//   "username": "john",
//   "password": "12345678"
// }