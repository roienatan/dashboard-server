var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const { DB_URL, DB_NAME } = require('../constants');
const auth = require('../auth');

// add timestamp
router.post('/addTask', auth.isAuthenticated, (req, res) => {
    MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        const dbo = db.db(DB_NAME);
        dbo.collection('tasks').insertOne(req.body, (err, res) => {
            if (err) throw err;
            db.close();
        })
        return res.status(200).json({ message: 'Task added successfully' });
    })
});

router.get('./getTasksByUserId/userId/:userId', (req, res) => {

})

router.get('./getAllTasks', (req, res) => {

})

module.exports = router;