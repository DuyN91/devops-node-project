import express = require('express');
import { MetricsHandler } from './metrics';
import path = require('path');
import bodyparser = require('body-parser');
import session = require('express-session');
import levelSession = require('level-session-store');
import { UserHandler, User } from './user';
import { stringify } from 'querystring';
import { write } from 'fs';

const dbUser: UserHandler = new UserHandler('./db/users');
const dbMet: MetricsHandler = new MetricsHandler('./db/metrics');
const authRouter = express.Router();
const userRouter = express.Router();
const LevelStore = levelSession(session);
const app = express();
const port: string = process.env.PORT || '8080';

app.use(express.static(path.join(__dirname, "/../public")));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.use(authRouter);
app.use('/user', userRouter)

app.set('views', __dirname + "/../views");
app.set('view engine', 'ejs');

//homepage
app.get('/', (req: any, res: any) => {
    res.write('Hello world');
    res.end();
});

app.get('/hello/:name', (req, res) => {
    res.render('hello.ejs', {name: req.params.name});
});

//access to metrics
app.get('/metrics/:id', (req: any, res: any) => {
    MetricsHandler.get((err: Error | null, result?: any) => {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

app.post('/metrics/:id', (req: any, res: any) => {
    dbMet.save(req.params.id, req.body, (err: Error | null) => {
        if (err) {
            throw err;
        }
        res.status(200).send();
    });
});

//session
app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
}));

//auth
authRouter.get('/login', (req: any, res: any) => {
    res.render('login.ejs');
});
  
authRouter.get('/signup', (req: any, res: any) => {
    res.render('signup.ejs')
});
  
authRouter.get('/logout', (req: any, res: any) => {
    delete req.session.loggedIn;
    delete req.session.user;
    res.redirect('/login');
});

app.post('/login', (req: any, res: any, next: any) => {
    // verify that I does get thre right values from the form
    console.log(req.body.username+' '+req.body.password);
    dbUser.get(req.body.username, (err: Error | null, result?: User) => {
        // verify that I manage to get the right data from the db
        console.log(result?.username+' '+result?.email+' '+result?.getPassword());
        if (err) {
            console.log("error")
            next(err)
        }
        if (result === undefined || result.validatePassword(req.body.password) === false) {
            console.log("error user")
            res.redirect('/login');
        } else {
            req.session.loggedIn = true;
            req.session.user = result;
            console.log(req.body.username);
            res.redirect('/hello/'+req.body.username);
        }
    });
});

// signup implementation
app.post('/signup/newaccount', (req: any, res: any, next: any) => {
    // verify that we get to that point by displaying a console message
    console.log("signup start");
    if (req.body.mail != '' && req.body.username != '' && req.body.password != '') {
        console.log(req.body.mail+' '+req.body.username+' '+req.body.password);
        var user = new User(req.body.mail, req.body.username, req.body.password);
        // check the creation of a user object
        console.log("signup user create");
        // display the user attributes
        console.log(user.username+' '+user.email+' '+user.getPassword());
        dbUser.save(user, (err: Error | null) => {
            if (err) {
                console.log("signup failed")
                throw err;
            }
            console.log("signup done")
        });
    } else {
        res.redirect('/signup');
    }
    res.redirect('/login');
});


userRouter.post('/', (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, function (err: Error | null, result?: User) {
        if (!err || result !== undefined) {
            res.status(409).send("user already exists");
        } else {
            dbUser.save(req.body, function (err: Error | null) {
                if (err) {
                    next(err)
                } else {
                    res.status(201).send("user persisted");
                }
            });
        }
    });
});

userRouter.get('/:username', (req: any, res: any, next: any) => {
    dbUser.get(req.params.username, function (err: Error | null, result?: User) {
        if (err || result === undefined) {
            res.status(404).send("user not found")
        } else {
            res.status(200).json(result)
        }
    });
});

const authCheck = function (req: any, res: any, next: any) {
    if (req.session.loggedIn) {
        next()
    } else {
        res.redirect('/login')
    }
};
  
app.get('/', authCheck, (req: any, res: any) => {
    res.render('index', { name: req.session.username })
});

//server
app.listen(port, (err: Error) => {
    if (err) {
        throw err;
    }
    console.log(`server is listening on port ${port}`);
});