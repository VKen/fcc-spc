/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite('GET /api/stock-prices => stockData object', function() {
      let like, rel_likes = {};

      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          assert.isObject(res.body);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.isNumber(res.body.stockData.price, 'price is a number');
          assert.isNumber(res.body.stockData.likes, 'likes is a number');
          done();
        });
      });

      test('1 stock with like', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({
            stock: 'goog',
            like: true,
        })
        .end(function(err, res){
          assert.isObject(res.body);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.isNumber(res.body.stockData.price, 'price is a number');
          assert.isAtLeast(res.body.stockData.likes, 1, 'likes is at least 1');
          like = res.body.stockData.likes;
          done();
        });
      });

      test('1 stock with like again (ensure likes arent double counted)', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({
            stock: 'goog',
            like: true,
        })
        .end(function(err, res){
          assert.isObject(res.body);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.isNumber(res.body.stockData.price, 'price is a number');
          assert.isNumber(res.body.stockData.likes, 'likes is a number');
          assert.equal(res.body.stockData.likes, like, 'likes should not increase from same ip "like" request');
          done();
        });
      });

      test('2 stocks', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({
            stock: ['goog', 'msft'],
        })
        .end(function(err, res){
          assert.isObject(res.body);
          assert.property(res.body, 'stockData');
          assert.isArray(res.body.stockData);
          assert.property(res.body.stockData[0], 'stock');
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[0], 'rel_likes');
          assert.property(res.body.stockData[1], 'stock');
          assert.property(res.body.stockData[1], 'price');
          assert.property(res.body.stockData[1], 'rel_likes');
          assert.include(['GOOG', 'MSFT'], res.body.stockData[0].stock, 'one of "GOOG" or "MSFT"');
          assert.include(['GOOG', 'MSFT'], res.body.stockData[1].stock, 'one of "GOOG" or "MSFT"');
          assert.isNumber(res.body.stockData[0].price, 'price is a number');
          assert.isNumber(res.body.stockData[0].rel_likes, 'likes is a number');
          assert.isNumber(res.body.stockData[1].price, 'price is a number');
          assert.isNumber(res.body.stockData[1].rel_likes, 'likes is a number');
          rel_likes[res.body.stockData[0].stock] = res.body.stockData[0].rel_likes;
          rel_likes[res.body.stockData[1].stock] = res.body.stockData[1].rel_likes;
          done();
        });

      });

      test('2 stocks with like', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({
            stock: ['goog', 'msft'],
            like: true,
        })
        .end(function(err, res){
          assert.isObject(res.body);
          assert.property(res.body, 'stockData');
          assert.isArray(res.body.stockData);
          assert.property(res.body.stockData[0], 'stock');
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[0], 'rel_likes');
          assert.property(res.body.stockData[1], 'stock');
          assert.property(res.body.stockData[1], 'price');
          assert.property(res.body.stockData[1], 'rel_likes');
          assert.include(['GOOG', 'MSFT'], res.body.stockData[0].stock, 'one of "GOOG" or "MSFT"');
          assert.include(['GOOG', 'MSFT'], res.body.stockData[1].stock, 'one of "GOOG" or "MSFT"');
          assert.isNumber(res.body.stockData[0].price, 'price is a number');
          assert.isNumber(res.body.stockData[0].rel_likes, 'likes is a number');
          assert.isNumber(res.body.stockData[1].price, 'price is a number');
          assert.isNumber(res.body.stockData[1].rel_likes, 'likes is a number');
          assert.equal(res.body.stockData[0].rel_likes, rel_likes[res.body.stockData[0].stock], "rel_likes should remain unchanged from both addition of likes count");
          assert.equal(res.body.stockData[1].rel_likes, rel_likes[res.body.stockData[1].stock], "rel_likes should remain unchanged from both addition of likes count");
          done();
        });

      });

    });

});
