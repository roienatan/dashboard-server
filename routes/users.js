var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const { DB_URL, DB_NAME } = require('../constants');
const auth = require('../auth');

router.get('/getUsers', (req, res) => {
  MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, db) => {
    if (err) throw err;
    const dbo = db.db(DB_NAME);
    dbo.collection('users').find({}).toArray((err, users) => {
      if(err) throw err;
      res.send(users);
    })
    db.close();
  })
})


router.post('/addUser', auth.isAuthenticated, (req, res) => {
  MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, db) => {
    if (err) throw err;
    const dbo = db.db(DB_NAME);
    dbo.collection('users').insertOne(req.body, (err, res) => {
      if(err) throw err;
      db.close();
    })
    return res.status(200).json({ message: 'User added successfully' });
  })
});



module.exports = router;
