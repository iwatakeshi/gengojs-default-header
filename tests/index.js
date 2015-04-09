/*global describe, it*/
var assert = require('chai').assert;
var Core = require('gengojs-core');
var header = require('../');
var wrappify = require('gengojs-wrappify/harmony');

describe('Header', function() {
  'use strict';
  describe('load plugins', function() {
    it('should exist', function() {
      var gengo = new Core({}, header());
      gengo.plugins.headers.forEach(function(plugin) {
        assert.isDefined(plugin);
        assert.strictEqual(plugin.package.type, 'header');
        assert.strictEqual(plugin.package.name, 'gengojs-default-header');
      });
    });
  });
  describe('koa', function() {
    var gengo = new Core({}, header());
    var koa = require('koa');
    var app = koa();
    app.use(wrappify(gengo).koa());
    var request = require('supertest');
    it('should have the api exposed internally', function() {
      request(app.listen()).get('/').end(function() {
        assert.isDefined(gengo.header);
        assert.isDefined(gengo.header.getLocale);
      });
    });
  });

  describe('express', function() {
    var gengo = new Core({}, header());
    var express = require('express');
    var app = express();
    var request = require('supertest');
    app.use(wrappify(gengo).express());
    it('should have the api exposed internally', function() {
      request(app).get('/').end(function() {
        assert.isDefined(gengo.header);
        assert.isDefined(gengo.header.getLocale);
      });
    });
  });

  describe('hapi', function() {
    var gengo = new Core({}, header());
    var hapi = require('hapi');
    var server = new hapi.Server();
    server.connection({
      port: 3000
    });
    server.register(wrappify(gengo).hapi(), function() {});
    it('should have the api exposed internally', function() {
      server.inject('/', function() {
        assert.isDefined(gengo.header);
        assert.isDefined(gengo.header.getLocale);
      });
    });
  });

});