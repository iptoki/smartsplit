//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const lodb = require('lodb');
const db = lodb('db.json');
const should = chai.should();

let Media = db('media').value();


chai.use(chaiHttp);
//Our parent block
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
