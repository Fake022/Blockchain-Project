'use strict';

exports.network_page = function(req, res) {
    let email = req.session.email;
    res.render('node', {user_email: email});
};


exports.get_all_block = function(req, res){
    res.render('', {});
};