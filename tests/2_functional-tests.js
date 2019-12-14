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

      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          assert.property(res.body, 'stock');
          assert.property(res.body, 'price');
          assert.property(res.body, 'likes');
          assert.equal(res.body.stock, 'GOOG');
          assert.isNumber(res.body.price, 'price is a number');
          assert.isNumber(res.body.likes, 'likes is a number');
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
          assert.property(res.body, 'stock');
          assert.property(res.body, 'price');
          assert.property(res.body, 'likes');
          assert.equal(res.body.stock, 'GOOG');
          assert.isNumber(res.body.price, 'price is a number');
          assert.isAtLeast(res.body.likes, 1, 'likes is at least 1');
          done();
        });
      });

      test('1 stock with like again (ensure likes arent double counted)', function(done) {

      });

      test('2 stocks', function(done) {

      });

      test('2 stocks with like', function(done) {

      });

    });

});
