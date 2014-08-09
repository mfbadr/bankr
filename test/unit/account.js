/* jshint expr: true */
/* global describe, it */
'use strict';

var expect    = require('chai').expect;
var Account   = require('../../app/models/account');
//var dbConnect = require('../../app/lib/mongodb');
//var Mongo     = require('mongodb');
//var cp        = require('child_process');
//var db        = 'tm-test';

describe('Account', function(){
  describe('constructor', function(){
    it('should accept an object and create an account with proper attributes', function(){
      var o = {name:'bob smith', photo:'google.com/picture.jpg', type:'Checking', color:'#FF4136', pin:'1990', deposit:'500'};
      var a = new Account(o);
      expect(a).to.be.instanceof(Account);
      expect(a.date).to.respondTo('getDay');
      expect(a.name).to.equal('bob smith');
      expect(a.photo).to.equal('google.com/picture.jpg');
      expect(a.type).to.equal('Checking');
      expect(a.color).to.equal('#FF4136');
      expect(a.pin).to.equal('1990');
      expect(a.balance).to.equal(500);
      expect(a.transfers).to.have.length(0);
      expect(a.transfers).to.be.instanceof(Array);
      expect(a.transactions).to.have.length(0);
      expect(a.transactions).to.be.instanceof(Array);
    });
  });
});
