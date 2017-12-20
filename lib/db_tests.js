var expect = require('chai').expect;
var fh = require('fh-mbaas-api');
var fs = require('fs');
var dummyjson = require('dummy-json');
var _ = require("underscore");

var type = 'test-collection';
var userTemplate = fs.readFileSync('templates/user.hbs', {encoding: 'utf8'});
var user1 = JSON.parse(dummyjson.parse(userTemplate));
var user2 = JSON.parse(dummyjson.parse(userTemplate));
var user3 = JSON.parse(dummyjson.parse(userTemplate));
var user1Guid = null;

function dbListPromisified(type, restrictions) {
  return new Promise(function(resolve, reject) {
    var params = {
      "act": "list",
      "type": type
    };

    if (restrictions && typeof restrictions !== "function") {
      params = _.extend(params, restrictions);
    }
    fh.db(params, function(error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

describe('Database API', function() {
  const AdvancedListingResults = {
    equalTo: 1,
    notEqualTo: 1,
    lessThan: 1,
    lessOrEqual: 2,
    greaterThan: 1,
    greaterOrEqual: 2,
    inArray: 1,
    sortMaxToMin: 2,
    skipFirst: 1
  };

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

  it('should filter using equal-to condition', function (done) {
    dbListPromisified(type, {"eq": { "a": 1 }})
      .then(function(data) {
        expect(data.count).to.equal(AdvancedListingResults.equalTo);
        done();
      }).catch(function(err) {
        done(err);
      });
  });

  it('should filter using not equal-to condition', function (done) {
    dbListPromisified(type, {"ne": { "a": 1 }})
      .then(function(data) {
        expect(data.count).to.equal(AdvancedListingResults.notEqualTo);
        done();
      }).catch(function(err) {
        done(err);
      });
  });

  it('should filter using less-than condition', function (done) {
    dbListPromisified(type, {"lt": { "a": 2 }})
      .then(function(data) {
        expect(data.count).to.equal(AdvancedListingResults.lessThan);
        done();
      }).catch(function(err) {
        done(err);
      });
  });

  it('should filter using less-or-equal-to condition', function (done) {
    dbListPromisified(type, {"le": { "a": 2 }})
      .then(function(data) {
        expect(data.count).to.equal(AdvancedListingResults.lessOrEqual);
        done();
      }).catch(function(err) {
        done(err);
      });
  });

  it('should filter using greater-than condition', function (done) {
    dbListPromisified(type, {"gt": { "a": 1 }})
      .then(function(data) {
        expect(data.count).to.equal(AdvancedListingResults.greaterThan);
        done();
      }).catch(function(err) {
        done(err);
      });
  });

  it('should filter using greater-or-equal-to condition', function (done) {
    dbListPromisified(type, {"ge": { "a": 1 }})
      .then(function(data) {
        expect(data.count).to.equal(AdvancedListingResults.greaterOrEqual);
        done();
      }).catch(function(err) {
        done(err);
      });
  });

  it('should filter using Is in array condition', function (done) {
    dbListPromisified(type, {"in": { "a": [1] }})
      .then(function(data) {
        expect(data.count).to.equal(AdvancedListingResults.inArray);
        done();
      }).catch(function(err) {
        done(err);
      });
  });

  it('should filter using Sort from max to min condition', function (done) {
    dbListPromisified(type, {"sort": { "a": -1 }})
      .then(function(data) {
        expect(data.list[0].fields.a).to.equal(AdvancedListingResults.sortMaxToMin);
        done();
      }).catch(function(err) {
        done(err);
      });
  });

  it('should filter using Skip condition', function(done) {
    dbListPromisified(type, {"skip": 0, "limit": 1})
      .then(function(data) {
        expect(data.count).to.equal(AdvancedListingResults.skipFirst);
        done();
      }).catch(function(err) {
        done(err);
      });
  });

});
