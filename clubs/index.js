'use strict';

const Config = require('./../config');
const _ = require('underscore');
const Hapi = require('hapi');
const Boom = require('boom');
const Wreck = require('wreck')

const AUTH_SERVICE_URL = 'http://' + Config.get('/services/auth/host') + ':' + Config.get('/services/auth/port');


const server = new Hapi.Server();
server.connection({
    host: Config.get('/services/clubs/host'),
    port: Config.get('/services/clubs/port')
});

server.route({
    method: 'GET',
    path:'/api/clubs',
    handler: function (request, reply) {
        return reply([
            {name: 'Augusta National'},
            {name: 'Pine Valley'}
        ])
    }
});

server.ext('onRequest', function (request, reply) {
    var token = request.headers.authorization;

    console.log(_.keys(request.headers).join(', '))
    if(!token)
        return reply(Boom.unauthorized('Missing token'))

    Wreck.post(AUTH_SERVICE_URL + '/api/auth/token/' + token + '/validate', function (err, res, payload) {
        console.log(res.statusCode)
        /* do stuff */

        if(res.statusCode !== 200)
            return reply(Boom.unauthorized('Invalid token'))

        return reply.continue();
    });
});

server.start((err) => {
    if (err) {
        throw err;
    }

    console.log('Server running at:', server.info.uri);
});