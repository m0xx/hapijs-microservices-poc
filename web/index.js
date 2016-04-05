'use strict';

const Config = require('./../config');
const _ = require('underscore');
const Hapi = require('hapi');
const Boom = require('boom');
const Wreck = require('wreck')

const AUTH_SERVICE_URL = 'http://' + Config.get('/services/auth/host') + ':' + Config.get('/services/auth/port');
const CLUB_SERVICE_URL = 'http://' + Config.get('/services/clubs/host') + ':' + Config.get('/services/clubs/port');

const server = new Hapi.Server();
server.connection({
    host: Config.get('/services/web/host'),
    port: Config.get('/services/web/port')
});

server.register(require('inert'), (err) => {
    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: __dirname + '/public',
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/generate-token',
        handler: function(request, reply) {
            Wreck.post(AUTH_SERVICE_URL + '/api/auth', {payload: JSON.stringify(request.payload), json: true}, function (err, res, payload) {
                if(res.statusCode !== 200)
                    return reply(Boom.badRequest('Invalid credentials'))

                return reply({
                    token: payload.token
                }).code(200);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/clubs',
        handler: function(request, reply) {
            Wreck.get(CLUB_SERVICE_URL + '/api/clubs', {headers: {authorization: request.headers.authorization}}, function (err, res, payload) {
                if(res.statusCode !== 200)
                    return reply(Boom.badRequest('Invalid token'))

                return reply(payload).code(200);
            });
        }
    });

    server.start((err) => {
    if (err) {
        throw err;
    }

    console.log('Server running at:', server.info.uri);
});
})

