'use strict';
// get the client
const mysql = require('mysql2');

const connect = () => {

// create the connection to database
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
  });
  return connection;
};

const select = (connection, callback, res) => {
  // simple query
  connection.query(
      'SELECT * FROM Kayttajat',
      (err, results, fields) => {
        console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err);
        callback(results, res);
      },
  );
};

const haeKayttajanKuvat = (connection, data, callback) => {
  // simple query
  connection.execute(
      'SELECT * FROM Kuvat WHERE kayttaja = ? ORDER BY Kuvat.aika DESC;',
      data,
      (err, results, fields) => {
        console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err);
        callback(results);
      },
  );
};

const haeKuvat = (connection, callback, res) => {
  // simple query
  connection.execute(
      'SELECT * FROM Kuvat ORDER BY Kuvat.aika DESC;',
      (err, results, fields) => {
        console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err);
        callback(results, res);
      },
  );
};

const haeKommentit = (connection, callback, res) => {
  // simple query
  connection.execute(
      'SELECT * FROM Kommentit',
      (err, results, fields) => {
        console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err);
        callback(results, res);
      },
  );
};

const haeKommentti = (connection, data, callback) => {
  // simple query
  connection.execute(
      'SELECT * FROM Kommentit WHERE k_polku = ? ORDER BY Kommentit.k_aika DESC;',
      data,
      (err, results, fields) => {
        console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err);
        callback(results);
      },
  );
};

const register = (data, connection, callback) => {
  // simple query
  connection.execute(
      'INSERT INTO Kayttajat (enimi, snimi, sposti, knimi, sala) VALUES (?, ?, ?, ?, ?);',
      data,
      (err, results, fields) => {
        console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err);
        callback(results);
      },
  );
};

const insert = (data, connection, callback) => {
  // simple query
  connection.execute(
      'INSERT INTO Kuvat (polku, teksti, kayttaja) VALUES (?, ?, ?);',
      data,
      (err, results, fields) => {
        console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err);
        callback(results);
      },
  );
};

const kommentoiKuvaa = (data, connection, callback) => {
  // simple query
  connection.execute(
      'INSERT INTO Kommentit (k_polku, k_tyyppi, k_teksti) VALUES (?, ?, ?);',
      data,
      (err, results, fields) => {
        console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err);
        callback(results);
      },
  );
};

const login = (data, connection, callback) => {
  // simple query
  connection.execute(
      'SELECT * FROM Kayttajat Where knimi = ? AND sala = ?;',
      data,
      (err, results, fields) => {
        console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err);
        callback(results);
      },
  );
};

const del = (data, connection, callback) => {
  // simple query
  connection.execute(
      'DELETE FROM Kuvat WHERE mID = ?;', // can delete only current user's images
      data,
      (err, results, fields) => {
        console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err);
        callback();
      },
  );
};

module.exports = {
  connect: connect,
  select: select,
  insert: insert,
  register: register,
  login: login,
  haeKayttajanKuvat: haeKayttajanKuvat,
  haeKuvat: haeKuvat,
  del: del,
  kommentoiKuvaa: kommentoiKuvaa,
  haeKommentit: haeKommentit,
  haeKommentti: haeKommentti,
};
