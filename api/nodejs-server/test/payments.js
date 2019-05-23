//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const lodb = require('lodb');
const db = lodb('db.json');
const should = chai.should();

let Payment = db('payments').value();


chai.use(chaiHttp);
//Our parent block
describe('Payment', () => {
  function getRandomInt(max) {
    return Math.ceil(Math.random() * Math.floor(max));
  }
  let id = getRandomInt(5);
  console.log("Random Payment ID: ", id)
  /*
  * Test the /GET route
  */
  describe('/GET payments', () => {
      it('it should GET all the payments', (done) => {
        chai.request(server)
            .get('/v1/payments')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.above(0);
              done();
            });
      });
  });
  /*
  * Test the /GET ID route 
  */
  describe('/GET payment ID', () => {
    it('it should GET a payment given ID', (done) => {
    chai.request(server)
        .get('/v1/payments/' + id)
        .end((err, res) => {
              res.should.have.status(200);
              res.should.be.a('object');
              res.body.should.have.property('id');
              res.body.should.have.property('amount');
              res.body.should.have.property('transaction-id');
              res.body.should.have.property('transaction-hash');
          done();
        });
    });
  });


  /*
  * Test the /POST route
  */
  describe('/POST payment', () => {
    it('it should POST a payment', (done) => {
      let payment = {
        "id": 4,
        "amount": 10000,
        "transaction-id": "44441111",
        "transaction-hash": "0x48a4c5ff945f8f1c0d0218466886d1e860c78cb625a2a4860e1efaf3a7c33b0c"
      }
    chai.request(server)
        .post('/v1/payments')
        .send(payment)
        .end((err, res) => {
              res.should.have.status(200);
              res.should.be.a('object');
              res.body.should.have.property('id');
              res.body.should.have.property('amount');
              res.body.should.have.property('transaction-id');
              res.body.should.have.property('transaction-hash');
          done();
        });
    });
  });
});