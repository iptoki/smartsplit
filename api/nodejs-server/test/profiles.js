//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const lodb = require('lodb');
const db = lodb('db.json');
const should = chai.should();

let Profile = db('profiles').value();


chai.use(chaiHttp);
//Our parent block
describe('Profile', () => {
  function getRandomInt(max) {
    return Math.ceil(Math.random() * Math.floor(max));
  }
  let id = getRandomInt(5);
  console.log("Random Profile ID: ", id)
  /*
  * Test the /GET route
  */
  describe('/GET profiles', () => {
      it('it should GET all the profiles', (done) => {
        chai.request(server)
            .get('/v1/profiles')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.above(0);
              done();
            });
      });
  });

  // Test GET profile id route
  describe('/GET profile given ID', () => {
    it('it should GET the profile given random ID', (done) => {
      chai.request(server)
          .get('/v1/profiles/' + id)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.a('object');
            res.body.should.have.property('id');
            res.body.should.have.property('ipi');
            res.body.should.have.property('role');
            res.body.should.have.property('wallet');
            res.body.should.have.property('media');
            res.body.should.have.property('first-name');
            res.body.should.have.property('email');
            res.body.should.have.property('last-name');
            done();
          });
      });
  });

  /*
  * Test the /POST route
  */
  describe('/POST profile', () => {
    it('it should POST a profile ', (done) => {
      let profile = {
        "id": 9,
        "ipi": "99999999",
        "role": "writer",
        "wallet": "0xaa87ae15f4be97e2739c9069ddef674f907d27a8",
        "media": [
          1,
          2,
          3,
          8
        ],
        "first-name": "Jill",
        "email": "jsparrow@example.com",
        "last-name": "Sparrow"
      }
    chai.request(server)
        .post('/v1/profiles')
        .send(profile)
        .end((err, res) => {
              res.should.have.status(200);
              res.should.be.a('object');
              res.body.should.have.property('id');
              res.body.should.have.property('ipi');
              res.body.should.have.property('role');
              res.body.should.have.property('wallet');
              res.body.should.have.property('media');
              res.body.should.have.property('first-name');
              res.body.should.have.property('email');
              res.body.should.have.property('last-name');
          done();
        });
    });
    it('it should not POST a profile without wallet field', (done) => {
        let profile = {
          "id": 8,
          "ipi": "12348888",
          "role": "writer",
          "media": [
            1,
            2,
            3,
            4
          ],
          "first-name": "Jim",
          "email": "jsparrow@example.com",
          "last-name": "Sparrow"
        }
      chai.request(server)
          .post('/v1/profiles')
          .send(profile)
          .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res.body.should.have.property('wallet');
            done();
          });
    });
});
});


// // Auth

// {
//   "apiKey": "123456789123456789",
//   "username": "john",
//   "password": "12345678"
// }