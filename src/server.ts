import express = require('express');
import { MetricsHandler } from './metrics';
import path = require('path');
import bodyparser = require('body-parser');
import session = require('express-session');
import levelSession = require('level-session-store');
import { UserHandler, User } from './user';

const dbUser: UserHandler = new UserHandler('./db/users');
const authRouter = express.Router();
const LevelStore = levelSession(session);
const app = express();
const port: string = process.env.PORT || '8080';

app.use(express.static(path.join(__dirname, "/../public")));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());

app.set('views', __dirname + "/../views");
app.set('view engine', 'ejs');

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics');

app.get('/', (req: any, res: any) => {
    res.write('Hello world');
    res.end();
});

app.get('/hello/:name', (req, res) => {
    res.render('hello.ejs', {name: req.params.name});
});

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
    dbUser.get(req.body.username, (err: Error | null, result?: User) => {
        if (err) next(err)
        if (result === undefined || !result.validatePassword(req.body.password)) {
            res.redirect('/login');
        } else {
            req.session.loggedIn = true;
            req.session.user = result;
            res.redirect('/');
        }
    });
});
  
app.use(authRouter)

const userRouter = express.Router()

userRouter.post('/', (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, function (err: Error | null, result?: User) {
        if (!err || result !== undefined) {
        res.status(409).send("user already exists")
        } else {
            dbUser.save(req.body, function (err: Error | null) {
                if (err) next(err)
                else res.status(201).send("user persisted")
            });
        }
    });
});

userRouter.get('/:username', (req: any, res: any, next: any) => {
    dbUser.get(req.params.username, function (err: Error | null, result?: User) {
        if (err || result === undefined) {
            res.status(404).send("user not found")
        } else res.status(200).json(result)
    });
});

app.use('/user', userRouter)

const authCheck = function (req: any, res: any, next: any) {
    if (req.session.loggedIn) {
        next()
    } else res.redirect('/login')
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