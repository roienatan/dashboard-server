var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const { DB_URL, DB_NAME } = require('../constants');
const auth = require('../auth');


router.post('/addTask', auth.requiresAdmin, (req, res) => {
    MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        const dbo = db.db(DB_NAME);
        const newTask = { ...req.body, created: Date.now() }
        dbo.collection('tasks').insertOne(newTask, (err, res) => {
            if (err) throw err;
            db.close();
        })
        return res.status(200).json({ message: 'Task added successfully' });
    })
});

router.get('/getAllTasks', auth.requiresAdmin, (req, res) => {
    MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        const dbo = db.db(DB_NAME);
        dbo.collection('tasks').find({}).toArray((err, tasks) => {
            if (err) throw err;
            res.send(tasks);
        })
        db.close();
    })
})

router.patch('/updateTaskPriority/taskId/:taskId/priority/:priority', auth.isAuthenticated, (req, res) => {
    MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        const dbo = db.db(DB_NAME);
        dbo.collection('tasks').updateOne({ '_id': ObjectId(req.params.taskId) }, { $set: { 'priority': req.params.priority } }, (err, res) => {
            if (err) throw err;
            db.close();
        })
        return res.status(200).json({ message: 'Task updated successfully' });
    })
})

router.get('/getUserTasks/userId/:userId', auth.isAuthenticated, (req, res) => {
    MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        const dbo = db.db(DB_NAME);
        dbo.collection('tasks').find({ 'assignTo': req.params.userId }).toArray((err, tasks) => {
            if (err) throw err;
            res.send(tasks);
        })
    })
})

module.exports = router;