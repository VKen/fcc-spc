/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const got = require('got');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB;
const mongo = new MongoClient(CONNECTION_STRING, { useUnifiedTopology: true });
let col;

mongo.connect((err, client) => {
    if (err) {
        console.error('connection error to db');
    } else {
        console.log('db connection successful');
        col = mongo.db().collection('stocks');
    }
});

const get_source = (stock) => `https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`;

async function retrieve_stock(stock, like, ip) {
    let r = await got.get(get_source(stock)).json();
    let update_object = {
        $set: { stock: r.symbol },
        $setOnInsert: { likes_ip: [] },
    };

    if (like) {
        update_object['$addToSet'] = { likes_ip: ip };
        delete update_object.$setOnInsert;
    }

    let r2 = await col.findOneAndUpdate({
        stock: r.symbol,
    },
    update_object,
    {
        returnOriginal: false,
        upsert: true,
        projection: {
            likes_ip: 1,
        }
    });

    if (r2.ok){
        return {
            stock: r.symbol,
            price: r.latestPrice,
            likes: r2.value.likes_ip.length,
        };
    } else {
        throw new Error('Database Error');
    }
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
        let stock = req.query.stock;
        let like = req.query.like;
        if (!stock) {
            return res.status(422).send('no stock selected');
        }

        if (Array.isArray(stock)){
            let promise_list = [];
            stock.forEach((val) => {
                promise_list.push(retrieve_stock(val, like, req.ip));
            });
            try {
                let r = await Promise.all(promise_list);
                // compare likes
                let diff = Math.abs(r[0] - r[1]);
                let r2 = r.map((val, idx) => {
                    const { likes, ...rest } = val;
                    rest['rel_likes'] = val.likes - r[(idx - 1) * (-1)].likes;
                    return rest;
                });
                return res.json({ stockData: r2 });
            } catch (e) {
                return res.status(500).send(e.message);
            }
        } else {
            try {
                let r = await retrieve_stock(stock, like, req.ip);
                return res.json({ stockData: r });
            } catch (e) {
                return res.status(500).send(e.message);
            }
        }
    });
};
