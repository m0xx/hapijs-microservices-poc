'use strict';

const Config = require('./../config');
const _ = require('underscore');
const Hapi = require('hapi');
const Boom = require('boom');
const jwt = require('jsonwebtoken');

const SECRET_KEY = Config.get('/services/auth/secretKey');

const server = new Hapi.Server();
server.connection({
    host: Config.get('/services/auth/host'),
    port: Config.get('/services/auth/port')
});

var users = [
    {username: 'max', password: '123'}
]

server.route({
    method: 'POST',
    path:'/api/auth',
    handler: function (request, reply) {
        var user = _.findWhere(users, {username: request.payload.username})

        if(!user || request.payload.password !== user.password)
        {
            console.log('Bad request', request.payload.username)
            return reply(Boom.badRequest('Error login'));
        }

        var options = {
            expiresIn: '2 days'
        }
        var token = jwt.sign({
            username: request.payload.username
        }, SECRET_KEY, options)

            return reply({
                token
            });


    }
});

server.route({
    method: 'POST',
    path:'/api/auth/token/{token}/validate',
    handler: function (request, reply) {
        const token = request.params.token;

        try{
            jwt.verify(token, SECRET_KEY)
        }
        catch(err) {
            return reply(Boom.badRequest('Invalid token'))
        }

        return reply().code(200);
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }

    console.log('Server running at:', server.info.uri);
});