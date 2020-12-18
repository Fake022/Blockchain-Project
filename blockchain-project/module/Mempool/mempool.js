'use strict';
var models = require('../../models');

class Transaction {
    constructor(txNr, Amount, Fee, From, To, Signature) {
        this.txNr = txNr;
        this.Amount = Amount;
        this.Fee = Fee;
        this.From = From;
        this.To = To;
        this.Signature = Signature;
    }
}

module.exports = class Mempool {
    constructor() {
        var transactions = this.init();
        if (typeof transactions !== 'undefined' && transactions.length > 0) {
            transactions.forEach(transaction => {
                this.list = [new Transaction(transaction.txNr, transaction.Amount, transaction.Fee, transaction.From, transaction.To, transaction.Signature)];
            });
        }
    }

    async init() {
       var list = await models.Transaction.findAll();
        return list;
    }

    updateNode() {
        var response = "";
        var transactions = this.init();
        if (this.list.length  < transactions.length) {
            transactions.forEach(transaction => {
                this.list = [new Transaction(transaction.txNr, transaction.Amount, transaction.Fee, transaction.From, transaction.To, transaction.Signature)];
            });
            response = "updated"
            return response;
        }
        response = "samelist";
        return response;
    }

    getAllList() {
        return this.list;
    }
}