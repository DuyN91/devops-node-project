const request = require('supertest');
const express = require('express');
const bodyparser = require('body-parser');

//const app = require("../src/server")

const app = express();
const authRouter = express.Router();

app.use(authRouter);
app.use('/user', userRouter);

app.get('/', (req, res) => {
    res.write('Hello world');
    res.status(200).send();
    res.end();
});

app.get('/hello/:name', (req, res) => {
    res.render('hello.ejs', {name: req.params.name});
    res.status(200).send();
});

describe('get homepage', function(){
    it('respond', function(done){
      request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if (err) throw err;
            done()
        });
    });
});

describe('get user page', function(){
    it('respond user', function(done){
      request(app)
        .get('/hello/:name')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if (err) throw err;
            done();
        });
    });
});

authRouter.get('/login', (req, res) => {
    res.render('login.ejs');
    res.status(200).send();
});
  
authRouter.get('/signup', (req, res) => {
    res.render('signup.ejs');
    res.status(200).send();
});

describe('get login page', function(){
    it('respond login', function(done){
      request(authRouter)
        .get('/login')
        .expect(200)
        .end(function(err, res){
            if (err) throw err;
            done();
        });
    });
});

describe('get signup page', function(){
    it('respond signup', function(done){
      request(authRouter)
        .get('/signup')
        .expect(200)
        .end(function(err, res){
            if (err) throw err;
            done();
        });
    });
});