'use strict';

function Account(o){
  this.name = o.name;
  this.date = new Date();
  this.photo = o.photo;
  this.type = o.type;
  this.color = o.color;
  this.pin = o.pin;
  this.balance = o.deposit * 1;
  this.transfers = [];
  this.transactions = [];
}

Account.prototype.transaction = function(o){
  if( o.pin !== this.pin){
    return 'Incorrect PIN';
  }

  o.amount = o.amount * 1;

  var newTrans = {};
  newTrans.type = o.type;
  newTrans.amount = o.amount;
  newTrans.date = new Date();
  newTrans.id = this.transactions.length + 1;
  newTrans.fee = 0;

  this.balance += (o.type === 'deposit') ? newTrans.amount : -newTrans.amount;

  if(this.balance <= 0){
    newTrans.fee = 50;
  }

  this.balance -= newTrans.fee;
  
  this.transactions.push(newTrans);
};

//Amount.prototype.transfer({from:mongoid, to:mongoid, amount  }
//

module.exports = Account;
