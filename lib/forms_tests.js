// TODO:
// test $FH.FORMS.GETPOPULATEDFORMLIST - https://issues.jboss.org/browse/RHMAP-16402
// test $FH.FORMS.GETSUBMISSIONSTATUS - https://issues.jboss.org/browse/RHMAP-16816
// test $FH.FORMS.SUBMITFORMFILE - https://issues.jboss.org/browse/RHMAP-15426
// test $FH.FORMS.CREATESUBMISSIONMODEL - https://issues.jboss.org/browse/RHMAP-15617
// test invalid submission (also if the event is triggered)
// test CSV is correct - https://issues.jboss.org/browse/RHMAP-17057

var expect = require('chai').expect;
var fh = require('fh-mbaas-api');
var path = require('path');
var fs = require('fs');
var events = require('events');
var async = require('async');

describe('Forms API', function() {

  var formId;
  var definitions;
  var formDefinition;
  var submissionData;
  var submissionIdEvent;
  var submissionEvent;
  var completeEvent;
  var submissionEventListener;
  var listenerRegistered;

  before(function() {
    var defPath = path.resolve('/tmp/bodytmp.json');
    definitions = JSON.parse(fs.readFileSync(defPath, 'utf8'));
  });

  it('should get forms', function(done) {
    fh.forms.getForms({}, function(err, data) {
      expect(err).to.not.exist;
      expect(data).to.be.an('object');
      expect(data.forms).to.be.an('Array');
      expect(data.forms.length).to.equal(1);
      expect(data.forms[0]).to.be.an('object');
      expect(data.forms[0].name).to.equal(definitions.form.name);
      expect(data.forms[0].createdBy).to.equal(definitions.form.createdBy);
      expect(data.forms[0]._id).to.equal(definitions.form._id);
      formId = data.forms[0]._id;
      done();
    });
  });

  it('should get form', function(done) {
    fh.forms.getForm({ _id: formId }, function(err, data) {
      expect(err).to.not.exist;
      expect(data.name).to.equal(definitions.form.name);
      expect(data.createdBy).to.equal(definitions.form.createdBy);
      expect(data._id).to.equal(definitions.form._id);
      expect(data.pages.length).to.equal(definitions.form.pages.length);
      expect(data.pages[0].fields.length).to.equal(definitions.form.pages[0].fields.length);
      formDefinition = data;
      done();
    });
  });

  // https://issues.jboss.org/browse/RHMAP-16402
  // it('should get populated form list', function(done) {
  //   fh.forms.getPopulatedFormList({ formids: [formId] }, function(err, data) {
  //     try {
  //       expect(data).to.be.an('Array');
  //       expect(data.length).to.equal(1);
  //       expect(data[0]).to.eql(formDefinition);
  //       done();
  //     } catch (e) {
  //       done(e);
  //     }
  //   });
  // });

  it('should get theme', function(done) {
    fh.forms.getTheme({}, function(err, data) {
      expect(err).to.not.exist;
      expect(data).to.be.an('object');
      expect(data.name).to.equal(definitions.theme.name);
      expect(data.createdBy).to.equal(definitions.theme.createdBy);
      expect(data._id).to.equal(definitions.theme._id);
      done();
    });
  });

  it('should get app client config', function(done) {
    fh.forms.getAppClientConfig({}, function(err, data) {
      expect(err).to.not.exist;
      expect(data).to.be.an('object');
      done();
    });
  });

  it('should get no submissions', getSubmissions);

  it('should pass submission test', function(done) {
    async.series([
      registerEventListener,
      submitFormData,
      completeSubmission,
      getSubmissions,
      deregisterEventListener,
      submitFormData
    ], done);
  });

  it('should export csv', function(done) {
    var queryParams = {
      projectId: definitions.projectId,
      submissionId: submissionData.submissionId,
      formId: [definitions.form._id],
      fieldHeader: definitions.form.pages[0].fields[0].name
    };

    fh.forms.exportCSV(queryParams, done);
  });

  it('should export pdf', function(done) {
    var params = {
      submissionId: submissionData.submissionId
    };

    fh.forms.exportSinglePDF(params, done);
  });

  // https://issues.jboss.org/browse/RHMAP-16816
  // it('should get submission status');

  // https://issues.jboss.org/browse/RHMAP-15426
  // it('should submit file');

  // https://issues.jboss.org/browse/RHMAP-15617
  // it('should create submission model');

  // TODO: test submission validation error

  function registerEventListener(done) {
    submissionEventListener = new events.EventEmitter();

    submissionEventListener.on('submissionStarted', function(params) {
      if (!listenerRegistered) {
        expect.fail();
      }

      expect(params.submissionId).to.exist;
      expect(params.submissionStartedTimestamp).to.exist;
      submissionIdEvent = params.submissionId;
      submissionEvent = true;
    });

    submissionEventListener.on('submissionComplete', function(params) {
      if (!listenerRegistered) {
        expect.fail();
      }

      expect(params.submissionId).to.exist;
      expect(params.submissionCompletedTimestamp).to.exist;
      expect(params.submissionId).to.equal(submissionData.submissionId);
      completeEvent = true;
    });

    submissionEventListener.on('submissionError', function(error) {
      expect(error).to.not.exist;
      expect.fail();
    });

    fh.forms.registerListener(submissionEventListener, function(err) {
      expect(err).to.not.exist;
      listenerRegistered = true;
      done();
    });
  }

  function deregisterEventListener(done) {
    fh.forms.deregisterListener(submissionEventListener, function(err) {
        expect(err).to.not.exist;
        listenerRegistered = false;
        done();
    });
  }

  function submitFormData(done) {
    const fieldEntry = {
      fieldId: definitions.form.pages[0].fields[0]._id,
      fieldValues: ['test']
    };
    const submission = {
      "timezoneOffset": -60,  // https://issues.jboss.org/browse/RHMAP-15423
      "formId": definitions.form._id,
      "deviceFormTimestamp": 1496909713881,
      "appId": definitions.clientApp.guid,
      "deviceIPAddress": "192.168.0.1",
      "comments": [],
      "formFields": [fieldEntry],
      "deviceId": "A200CC72B96946148950EC1EB0FE688B"
    };
    var options = {
      submission: submission,
      appClientId: definitions.clientApp.guid
    };
    fh.forms.submitFormData(options, function(err, data) {
      expect(err).to.not.exist;
      expect(data.submissionId).to.exist;
      if (listenerRegistered) {
        expect(data.submissionId).to.equal(submissionIdEvent);
        submissionData = data;
      }
      done();
    });
  }

  function getSubmissions(done) {
    fh.forms.getSubmissions({ formId: [formId] }, function(err, data) {
      expect(err).to.not.exist;
      expect(data).to.be.an('object');
      expect(data.submissions.submissions).to.be.an('Array');
      if (submissionData) {
        expect(data.submissions.submissions.length).to.equal(1);
        expect(data.submissions.submissions[0]._id).to.equal(submissionData.submissionId);
      } else {
        expect(data.submissions.submissions.length).to.equal(0);
      }
      done();
    });
  }

  function completeSubmission(done) {
    fh.forms.completeSubmission({
      submission: {
        submissionId: submissionData.submissionId
      }
    }, function(err, data) {
      expect(err).to.not.exist;
      expect(data).to.be.an('object');
      expect(data.status).to.equal('complete');
      expect(submissionEvent).to.be.true;
      expect(completeEvent).to.be.true;

      done();
    });
  }

});
