var express = require('express');
var router = express.Router();
const auth = require('../auth');
const { DB_URL, DB_NAME } = require('../constants');
var MongoClient = require('mongodb').MongoClient;

router.get('/login/username/:username/password/:password', (req, res) => {

    MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        const dbo = db.db(DB_NAME);
        dbo.collection('users').find({ 'username': req.params.username }).toArray((err, user) => {
            if (err) throw err;
            const { username, password, ...userDetails } = user[0];
            if (req.params.password === password) {
                const token = userDetails.privileges === 'admin' ? auth.generateAdminToken(userDetails._id) : auth.generateUserToken(userDetails._id);
                return res.status(200).json({ token: token, userDetails});
            }
            else return res.status(401).json({ message: 'Invalid username or password' });
        })
        db.close();  
    })
})

module.exports = router;