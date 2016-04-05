'use strict';

const Confidence = require('confidence');

const criteria = {
    env: process.env.NODE_ENV
};

const config = {
    services: {
        web: {
            $filter: 'env',
            production: {
                'host': process.env.WEB_HOST,
                'port': process.env.WEB_PORT
            },
            $default: {
                'host': 'localhost',
                'port': 80
            }
        },
        auth: {
            $filter: 'env',
            production: {
                'host': process.env.AUTH_HOST,
                'port': process.env.AUTH_PORT,
                'secretKey': process.env.AUTH_SECRET
            },
            $default: {
                'host': 'localhost',
                'port': 8000,
                'secretKey': 'secret-key'
            }
        },
        clubs: {
            $filter: 'env',
            production: {
                'host': process.env.CLUBS_HOST,
                'port': process.env.CLUBS_PORT
            },
            $default: {
                'host': 'localhost',
                'port': 8001
            }
        }
    },
};


const store = new Confidence.Store(config);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};