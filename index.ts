const spdy = require('spdy');
const fs = require('fs');
const express = require('express');
const session = require('express-session');

const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const User = require('./user').User;
const UserModel = require('./models/user').UserModel;
const IssueModel = require('./models/issue').IssueModel;
const Database = require('sqlite3').Database;
const db = new Database('./db/issues.db');
const userModel = new UserModel(db);
const issueModel = new IssueModel(db);
const helmet = require('helmet');
const morgan = require('morgan');

passport.use(new Strategy((username, password, cb) => {
    userModel.fetchByCredentials(username, password).then((user) => {
        return cb(null, user);
    }, () => {
        cb(null, false);
    });
}));

passport.serializeUser((user, cb) => cb(null, user.id));
passport.deserializeUser((id, cb) => {
    const user = new User(1, 'admin', 'test');
    cb(null, user);
});

const app = express();
var sess = {
  secret: 'secret',
  cookie: {},
  resave: false,
  saveUninitialized: false
};
app.use(session(sess));

app.use(helmet());
const accessLogStream = fs.createWriteStream('logs/access.log', {flags: 'a'});
app.use(morgan('common', {stream: accessLogStream}));
app.set('view engine', 'ejs');
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({extended: true})); 
app.use(require('express-session')({ secret: 'top secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
};

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/list');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/list',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    issueModel.fetchAll().then((issues) => {
      res.render('list', {
        issues: issues
      });
    });
  });

  app.get('/edit',
    require('connect-ensure-login').ensureLoggedIn(),
    (req, res) => {

    });

  app.get('/new',
    require('connect-ensure-login').ensureLoggedIn(),
    (req, res) => {
      userModel.fetchAll().then((users) => {
        res.render('form', {
          users: users,
          states: ['open', 'in progress', 'done'],
          creatorId: req.user.id
        });
      })
    });

  app.post('/issue',
    require('connect-ensure-login').ensureLoggedIn(),
    (req, res) => {

    });

app.get('/remove/:id',
require('connect-ensure-login').ensureLoggedIn(),
(req, res) => {
  issueModel.remove(req.params.id).then(() => {
    res.redirect('/list');
  });
});

app.use(express.static('public'));

spdy.createServer(options, app).listen(8080, () => {
    console.log('Listening to https://localhost:8080');
});