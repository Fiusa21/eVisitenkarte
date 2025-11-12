const session = require('express-session');
const express = require('express');
const app = express();
const Keycloak = require('keycloak-connect');

//IMPORTANT FROM DOCUMENTATION:
/*MemoryStore, is purposely not designed for a production environment.
It will leak memory under most conditions, does not scale past a single process,
and is meant for debugging and developing.*/

//ALSO BE AWARE: VALID REDIRECT URL IS CURRENTLY '*' WHICH SHOULD LATER BE SPECIFIED
//SINCE IT IS A SECURITY FLAW
//using wildcard is easier for develop and testing purposes

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

app.use( keycloak.middleware() );

//simple autehntification testing

app.get('/', keycloak.protect(), (req, res, next) => {
    res.json({status: 'ok'})
})


app.listen(3000, function() {
    console.log('App listening on port 3000');
});


