exports.home_controller = function(req,res){
    let siddu = "Not good";
    let email = req.session.email;
    res.render('index', {user_email: email});
};