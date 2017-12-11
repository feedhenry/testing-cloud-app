var expect = require('chai').expect;
var fh = require('fh-mbaas-api');
var fs = require('fs');
var dummyjson = require('dummy-json');
var Promise = require('bluebird');
var _ = require("underscore");

var type = 'test-collection';
var userTemplate = fs.readFileSync('templates/user.hbs', {encoding: 'utf8'});
var user1 = JSON.parse(dummyjson.parse(userTemplate));
var user2 = JSON.parse(dummyjson.parse(userTemplate));
var user3 = JSON.parse(dummyjson.parse(userTemplate));
var user1Guid = null;

function dbListPromisified(type, restrictions) {
  return new Promise(function(resolve, reject){
    var params = {
      "act": "list",
      "type": type
    };

    if (restrictions && typeof restrictions === "function") {
      restrictions = null;
    } else if (restrictions) {
      params = _.extend(params, restrictions);
    }
    fh.db(params, function (error, data) {
      if (error){
        reject(error);
      }
      else {
        resolve(data);
      }
    });
  });
}

describe('Database API', function() {

  it('should delete all entities', function(done) {
    fh.db({
      'act': 'deleteall',
      'type': type
    }, function(err, data) {
      try {
        expect(err).to.not.exist;
        expect(data.status).to.equal('ok');
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should list empty collection', function(done) {
    fh.db({
      'act': 'list',
      'type': type
    }, function(err, data) {
      try {
        expect(err).to.not.exist;
        expect(data.count).to.equal(0);
        expect(data.list).to.be.empty;
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should create entity', function(done) {
    fh.db({
      'act': 'create',
      'type': type,
      'fields': user1
    }, function(err, data) {
      try {
        expect(err).to.not.exist;
        expect(data.guid).to.be.a('string');
        expect(data.guid).to.have.length.above(20);
        user1Guid = data.guid;
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should read entity', function(done) {
    fh.db({
      'act': 'read',
      'type': type,
      'guid': user1Guid
    }, function(err, data) {
      try {
        expect(err).to.not.exist;
        expect(data.type).to.equal(type);
        expect(data.guid).to.equal(user1Guid);
        expect(data.fields.user.email).to.equal(user1.user.email);
        expect(data.fields.user.address).to.equal(user1.user.address);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should create multiple entities', function(done) {
    user2.a = 2;
    user3.a = 1;
    fh.db({
      'act': 'create',
      'type': type,
      'fields': [user2, user3]
    }, function(err, data) {
      try {
        expect(err).to.not.exist;
        expect(data.Status).to.equal('OK');
        expect(data.Count).to.equal(2);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should list all entities', function(done) {
    fh.db({
      'act': 'list',
      'type': type
    }, function(err, data) {
      try {
        expect(err).to.not.exist;
        expect(data.count).to.equal(3);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should update entity', function(done) {
    user1.user.email = 'foo@bar.com';
    fh.db({
      'act': 'update',
      'type': type,
      'guid': user1Guid,
      'fields': user1
    }, function(err, data) {
      try {
        expect(err).to.not.exist;
        expect(data.type).to.equal(type);
        expect(data.guid).to.equal(user1Guid);
        expect(data.fields.user.email).to.equal('foo@bar.com');
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should delete entity', function(done) {
    fh.db({
      'act': 'delete',
      'type': type,
      'guid': user1Guid
    }, function(err, data) {
      try {
        expect(err).to.not.exist;
        fh.db({
          'act': 'list',
          'type': type
        }, function(err, data) {
          try {
            expect(err).to.not.exist;
            expect(data.count).to.equal(2);
            done();
          } catch (e) {
            done(e);
          }
        });
      } catch (e) {
        done(e);
      }
    });
  });

  it('should create index', function(done) {
    fh.db({
      'act': 'index',
      'type': type,
      'index': {
        'location': '2D',
        'user.name': 'ASC',
        'price': 'DESC'
      }
    }, function(err, data) {
      try {
        expect(err).to.not.exist;
        expect(data.status).to.eql('OK');
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  /* Advanced listing - restrictions
   {"eq": { "a": 1 }}       data.count === 1 ? "SUCCESS!!!!!" : "--------FAILURE--------"
   {"ne": { "a": 1 }}       data.count === 1 ? "SUCCESS!!!!!" : "--------FAILURE--------";
   {"lt": { "a": 2 }}       data.count === 1 ? "SUCCESS!!!!!" : "--------FAILURE--------"
   {"le": { "a": 2 }}       data.count === 2 ? "SUCCESS!!!!!" : "--------FAILURE--------";
   {"gt": { "a": 1 }}       data.count === 1 ? "SUCCESS!!!!!" : "--------FAILURE--------"
   {"ge": { "a": 1 }}       data.count === 2 ? "SUCCESS!!!!!" : "--------FAILURE--------";
   {"in": { "a": [1] }}     data.count === 1 ? "SUCCESS!!!!!" : "--------FAILURE--------"
   {"sort": { "a": -1 }}    data.list[0].fields.a === 2 ? "SUCCESS!!!!!" : "--------FAILURE--------"
   {"skip": 0, "limit": 1}  data.count === 1 ? "SUCCESS!!!!!" : "--------FAILURE--------"
   */

  it('advanced listing - Equals 1', function (done) {
    dbListPromisified(type, {"eq": { "a": 1 }})
      .then(function(data) {
        expect(data.count).to.equal(1);
        done();
      }).catch(function (err) {
        done(err);
    });
  });

  it('advanced listing - Not equals 1', function (done) {
    dbListPromisified(type, {"ne": { "a": 1 }})
      .then(function(data) {
        expect(data.count).to.equal(1);
        done();
      }).catch(function (err) {
        done(err);
    });
  });

  it('advanced listing - Less than 2', function (done) {
    dbListPromisified(type, {"lt": { "a": 2 }})
      .then(function(data) {
        expect(data.count).to.equal(1);
        done();
      }).catch(function (err) {
        done(err);
    });
  });

  it('advanced listing - Less or equals 2', function (done) {
    dbListPromisified(type, {"le": { "a": 2 }})
      .then(function(data) {
        expect(data.count).to.equal(2);
        done();
      }).catch(function (err) {
        done(err);
    });
  });

  it('advanced listing - Greater than 1', function (done) {
    dbListPromisified(type, {"gt": { "a": 1 }})
      .then(function(data) {
        expect(data.count).to.equal(1);
        done();
      }).catch(function (err) {
        done(err);
    });
  });

  it('advanced listing - Greater or equals 1', function (done) {
    dbListPromisified(type, {"ge": { "a": 1 }})
      .then(function(data) {
        expect(data.count).to.equal(2);
        done();
      }).catch(function (err) {
        done(err);
    });
  });

  it('advanced listing - Is in array [1]', function (done) {
    dbListPromisified(type, {"in": { "a": [1] }})
      .then(function(data) {
        expect(data.count).to.equal(1);
        done();
      }).catch(function (err) {
        done(err);
    });
  });

  it('advanced listing - Sort from max to min', function (done) {
    dbListPromisified(type, {"sort": { "a": -1 }})
      .then(function(data) {
        expect(data.list[0].fields.a).to.equal(2);
        done();
      }).catch(function (err) {
        done(err);
    });
  });

  it('advanced listing - Skip first', function (done) {
    dbListPromisified(type, {"skip": 0, "limit": 1})
      .then(function(data) {
        expect(data.count).to.equal(1);
        done();
      }).catch(function (err) {
        done(err);
    });
  });

});
