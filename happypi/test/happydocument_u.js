'use strict';
/*jslint node: true */
/*jshint expr: true*/

require('app-module-path').addPath(process.env.PWD + '/lib/js');

var chai = require("chai"),
    expect = chai.expect,
    sinon = require("sinon"),
    should = chai.should(),
    proxyquire = require('proxyquire');

chai.should();

var config = require("configger");

describe('happydocument', function() {
    //var happydoc = require("happydocument");
    var request, happydoc;

    before(function() {
        request = sinon.stub();
        happydoc = proxyquire("happydocument", {
            'request': request
        });
    });


    it('should create a happy document with correct properties', function() {
        var happy = new happydoc.happyDocument();
        var sensors = new happydoc.sensorValues(23.1, 43.2, 120.1, 768);

        happy.sensorValues = sensors;

        expect(happy).to.have.property('happystatus');
        expect(happy).to.have.property('timestamp');
        expect(happy).to.have.property('tags');
        expect(happy).to.have.property('sensorValues');

        expect(happy.sensorValues).to.have.property('temperature');
        happy.sensorValues.temperature.should.equal(23.1);
        expect(happy.sensorValues).to.have.property('relativeHumidity');
        happy.sensorValues.relativeHumidity.should.equal(43.2);
        expect(happy.sensorValues).to.have.property('barometricPressure');
        happy.sensorValues.barometricPressure.should.equal(120.1);
        expect(happy.sensorValues).to.have.property('lightLevel');
        happy.sensorValues.lightLevel.should.equal(768);

    });

    it('should send a happy document', function() {
        var happy = new happydoc.happyDocument();
        var sensorValues = new happydoc.sensorValues();

        var sendSpy = sinon.spy(happy, 'sendToHappymeter');
        //        var happySpy = sinon.spy(happy);

        // request.yields(null, {
        //     "statusCode": 200
        // }, null);

        sensorValues = (23.1, 43.2, 120.1, 768);

        happy.happystatus = 'Above';
        happy.timestamp = Date.now();
        happy.tags = "taggingIsOk";
        happy.sensorValues = sensorValues;

        request.post = function() {
            callback(200);
        };

        happy.sendToHappymeter(function callback(responseCode) {
            expect(responseCode).to.equal(201);
            happy.happystatus.should.equal('Above');
        });

        expect(happy.sendToHappymeter.calledOnce).to.be.true;
        expect(sendSpy.calledOnce).to.be.true;

    });

});
