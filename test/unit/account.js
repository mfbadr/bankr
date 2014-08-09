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
      //console.log(a.date);
    });
  });
  describe('#transaction', function(){
    it('should add to balance and add a new transaction object to transactions array', function(){
      var o = {name:'bob smith', photo:'google.com/picture.jpg', type:'Checking', color:'#FF4136', pin:'1990', deposit:'500'};
      var a = new Account(o);
      a.transaction('deposit', '500');
      expect(a.transactions).to.have.length(1);
      expect(a.transactions[0].type).to.equal('deposit');
      expect(a.transactions[0].id).to.equal(1);
      expect(a.transactions[0].date).to.respondTo('getDay');
      expect(a.transactions[0].amount).to.equal(500);
      expect(a.transactions[0].fee).to.equal(0);
      expect(a.balance).to.equal(1000);
    });
    it('should charge a $50 fee if withdrawal amt > balance', function(){
      var o = {name:'bob smith', photo:'google.com/picture.jpg', type:'Checking', color:'#FF4136', pin:'1990', deposit:'50'};
      var a = new Account(o);
      a.transaction('withdraw', '500');
      expect(a.transactions).to.have.length(1);
      expect(a.transactions[0].type).to.equal('withdraw');
      expect(a.transactions[0].id).to.equal(1);
      expect(a.transactions[0].date).to.respondTo('getDay');
      expect(a.transactions[0].amount).to.equal(500);
      expect(a.transactions[0].fee).to.equal(50);
      //console.log(a.transactions[0]);
      expect(a.balance).to.equal(-500);
    });
  });
});
