'use strict';
require('dotenv').config();
const express = require('express');
const db = require('../JSquadvanha/modules/database');
//const resize = require('../projektiv2-master/modules/resize');
const bodyParser = require('body-parser');
const passport = require('passport');
const multer = require('multer');
const upload = multer({dest: 'public/uploads/'});
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');

// const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// parse application/json
app.use(bodyParser.json());

// enable cookies to send userID to client
app.use(cookieParser());

// database connection
const connection = db.connect();

// login with passport
passport.serializeUser((user, done) => {
  console.log('serialize:', user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.send('{"error": "Not logged in!"}');
  }
};

app.use(session({
  secret: 'keyboard LOL cat',
  resave: true,
  saveUninitialized: true,
  cookie: {secure: false},
}));

passport.use(new LocalStrategy(
    (username, password, done) => {
      console.log('Here we go: ' + username);
      let res = null;

      const doLogin = (username, password) => {
        return new Promise((resolve, reject) => {
          db.login([username, password], connection, (result) => {
            // bcrypt.compare(password, result[0].sala, function(err, result) {
            // res == true
            console.log('tulos', result);
            if (result.length > 0) {
              resolve(result);
            } else {
              reject();
            }
          });
        });
        //     });
      };

      return doLogin(username, password).then((result) => {
        if (result.length < 1) {
          console.log('undone');
          return done(null, false);
        } else {
          console.log('done');
          result[0].sala = ''; // remove password from user's data
          return done(null, result[0]); // result[0] is user's data, accessible as req.user
        }
      }).catch(() => {
        return done(null, false);
      });
    },
));

app.use(passport.initialize());
app.use(passport.session());

//db.select(connection, (results) => {
//  console.log(results);
//});

const insertToDB = (data, res, next) => {
  db.register(data, connection, () => {
    next();
  });
};

const insertkuvaToDB = (data, res, next) => {
  db.insert(data, connection, () => {
    next();
  });
};

const insertkommenttiToDB = (data, res, next) => {
  db.kommentoiKuvaa(data, connection, () => {
    next();
  });
};

const selectAll = (req, next) => {
  db.select(connection, (results) => {
    req.custom = results;
    next();
  });
};

const cb = (result, res) => {
  console.log(result);
  res.send(result);
};

app.use(express.static('public'));

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) { // if login not happening
      return res.redirect('/index.html');
    }
    req.logIn(user, function(err) {
      // send userID as cookie:
      res.cookie('userID', req.user.uID);
      if (err) {
        return next(err);
      }
      return res.redirect('/profiili.html'); // if login succesful
    });
  })(req, res, next);
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('./index.html');
});

// rekisteröinti
app.use('/register', (req, res, next) => {
  const data = [
    req.body.enimi,
    req.body.snimi,
    req.body.sposti,
    req.body.username,
    req.body.password,
    /*req.file.filename,
    req.file.filename + '_thumb'*/
  ];
  console.log('selaimesta', req.body);
  insertToDB(data, res, () => {
    next();
  });
});

app.post('/register', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) { // if login not happening
      return res.redirect('/register.html');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/profiili.html'); // if login succesful
    });
  })(req, res, next);
});

// respond to post and save file
app.post('/upload', upload.single('kuva'), (req, res, next) => {
  next();
});

app.use('/upload', (req, res, next) => {
  console.log('juuseri', req.user);
  const data = [
    req.file.filename,
    req.body.teksti,
    req.user.uID,
  ];
  insertkuvaToDB(data, res, () => {
    next();
  });
});

// get updated data form database and send to client
app.use('/upload', (req, res) => {
  res.redirect('/profiili.html');
});

app.post('/kommentoi', (req, res, next) => {
  console.log('juuseri', req.user);
  const data = [
    req.body.mID,
    req.user.uID,
    req.body.k_teksti,
  ];
  insertkommenttiToDB(data, connection, () => {
    res.redirect('index.html');
  });
});

app.get('/kommentit', (req, res) => {
  db.haeKommentit(connection, cb, res);
});

app.get('/kommentit/:id', (req, res) => {
  const id = req.params.id;
  db.haeKommentti(connection, [id], (result) => {
    res.send(result);
  });
});

app.get('/images', (req, res) => {
  db.haeKuvat(connection, cb, res);
});

app.get('/images/:id', (req, res) => {

  let id = req.params.id;
  if (id === 'x') {
    id = req.user.uID;
  }

  db.haeKayttajanKuvat(connection, [id], (result) => {
    res.send(result);
  });
});

app.patch('/images', (req, res) => {
  console.log('body', req.body);
  const update = db.update(req.body, connection);
  console.log('update', update);
  res.send('{"status": "OK"}');
});

app.delete('/images/:mID', (req, res) => {
  const mID = [req.params.mID];
  db.del(mID, connection, () => {
    res.redirect('profiili.html');
  });
});

app.listen(8000);