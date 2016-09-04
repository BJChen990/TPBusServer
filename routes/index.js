var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/estimate', function(req, res) {
    fs.readFile('data/GetEstimateTime.json', function(err, data) {
        if (err) {
            console.log(err.message);
            return res.render('index', { title: 'Express' });
        }

        res.send(JSON.stringify(data));
    });
});

router.get('/route', function(req, res) {
    fs.readFile('data/GetRoute.json', function(err, data) {
        if (err) {
            console.log(err.message);
            return res.render('index', { title: 'Express' });
        }

        res.send(JSON.stringify(data));
    });
});

router.get('/stop', function(req, res) {
    fs.readFile('data/GetSTOP.json', function(err, data) {
        if (err) {
            console.log(err.message);
            return res.render('index', { title: 'Express' });
        }

        res.send(JSON.stringify(data));
    });
});

router.get('/pathDetail', function(req, res) {
    fs.readFile('data/GetPathDetail.json', function(err, data) {
        if (err) {
            console.log(err.message);
            return res.render('index', { title: 'Express' });
        }

        res.send(JSON.stringify(data));
    });
});

module.exports = router;
