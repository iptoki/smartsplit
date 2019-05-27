//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const lodb = require('lodb');
const db = lodb('db.json');
const should = chai.should();


chai.use(chaiHttp);

// ============== Payments

let Payment = db('payments').value();
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


// =============================== Media Tests
let Media = db('media').value();
describe('Media', () => {
    function getRandomInt(max) {
        return Math.ceil(Math.random() * Math.floor(max));
    }
    let id = getRandomInt(5);
    console.log("Random Media ID: ", id)
    /*
    * Test the /GET route
    */
    describe('/GET media', () => {
        it('it should GET all the media records', (done) => {
            chai.request(server)
                .get('/v1/media')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.above(0);
                done();
                });
        });
    });
    
    /*
    * Test the /GET with ID route
    */
    describe('/GET media with ID', () => {
        it('it should GET media given ID', (done) => {
        chai.request(server)
            .get('/v1/media/' + id)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res.body.should.have.property('mediaId');
                res.body.should.have.property('split');
                res.body.should.have.property('jurisdiction');
                res.body.should.have.property('genre');
                res.body.should.have.property('description');
                res.body.should.have.property('cover');
                res.body.should.have.property('creation-date');
                res.body.should.have.property('publisher');
                res.body.should.have.property('rights-type');
                res.body.should.have.property('title');
                res.body.should.have.property('right-holders');
            done();
            });
        });
    });
    
    /*
    * Test the /POST route
    */
    describe('/POST media', () => {
        it('it should POST media', (done) => {
        let media = [{
            "mediaId": 9,
            "split" : {
            "Drew Miller": 75.0,
            "Andy Wilson": 25.0
            },
            "jurisdiction" : "SOCAN",
            "genre" : "Rock",
            "description" : "The wonderful classic hit song, Love You Baby 2",
            "cover": false,
            "creation-date" : "2019-01-01T15:53:00",
            "publisher" : "sync publishing",
            "rights-type" : {
            "copyright" : true,
            "performance" : true,
            "recording" : true
            },
            "title" : "Love You Baby 2",
            "right-holders" : {
            "Drew Miller": "writer",
            "Andy Wilson": "performer"
            }
        }]
        chai.request(server)
            .post('/v1/media')
            .send(media)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res.body[0].should.have.property('mediaId');
                res.body[0].should.have.property('split');
                res.body[0].should.have.property('jurisdiction');
                res.body[0].should.have.property('genre');
                res.body[0].should.have.property('description');
                res.body[0].should.have.property('cover');
                res.body[0].should.have.property('creation-date');
                res.body[0].should.have.property('publisher');
                res.body[0].should.have.property('rights-type');
                res.body[0].should.have.property('title');
                res.body[0].should.have.property('right-holders');
            done();
            });
        });
    });
    
        /*
        * Test the /PUT route
        */
    describe('/PUT media given ID', () => {
        it('it should PUT media given ID', (done) => {
        let media = [{
            "mediaId": 8,
            "split" : {
            "Drew Miller": 50.0,
            "Andy Wilson": 50.0
            },
            "jurisdiction" : "SOCAN",
            "genre" : "Rock",
            "description" : "The wonderful classic hit song, Love You Baby 2",
            "cover": false,
            "creation-date" : "2019-01-01T15:53:00",
            "publisher" : "sync publishing",
            "rights-type" : {
            "copyright" : true,
            "performance" : true,
            "recording" : true
            },
            "title" : "Love You Baby 2",
            "right-holders" : {
            "Drew Miller": "writer",
            "Andy Wilson": "performer"
            }
        }]
        chai.request(server)
            .put('/v1/media/8')
            .send(media)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res.body.should.have.property('mediaId');
                res.body.should.have.property('split');
                res.body.should.have.property('jurisdiction');
                res.body.should.have.property('genre');
                res.body.should.have.property('description');
                res.body.should.have.property('cover');
                res.body.should.have.property('creation-date');
                res.body.should.have.property('publisher');
                res.body.should.have.property('rights-type');
                res.body.should.have.property('title');
                res.body.should.have.property('right-holders');
            done();
            });
        });
    });
});

// Profiles test
let Profile = db('profiles').value();
//Our parent block
describe('Profile', () => {
    function getRandomInt(max) {
      return Math.ceil(Math.random() * Math.floor(max));
    }
    let id = getRandomInt(5);
    console.log("Random ID: ", id)
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