function User(req, res, next) {
    console.log("Ok done! go ahead");
    next();
};

module.exports = User;