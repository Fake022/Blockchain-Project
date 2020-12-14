'use strict';



exports.network_page = function(req, res) {
    let email = req.session.email;
    res.render('node', {user_email: email});
};


exports.get_all_block = function(req, res){
    res.render('', {});
};

exports.add_new_transaction = async function(req, res){
    if (req.body ==! null || req.body ==! undefined ) {
        await models.Transaction.create({
            txNr: req.body.txnr,
            Amount: req.body.amount,
            Fee: req.body.fee,
            From: req.body.from,
            To: req.body.to,
            Signature: req.body.signature
        });
    }
};

exports.personnal_blockchain = function(req, res){
    res.render('personal_blockchain', {});
};

exports.new_transaction = function(req, res) {
    res.render('new_transaction', {});
};

exports.mempool_transaction = function(req, res) {
    res.render('mempool_transaction', {});
};