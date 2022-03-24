require('dotenv').config();
const express = require('express');
const path = require('path');
require('./database/connection.js');
const hbs = require('hbs');
const Register = require('./models/registers');
const bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser')

const app = express();
const port = 2000;

//built in middleware
const static_path = path.join(__dirname, '../public');
const template_path = path.join(__dirname, '../templates/views');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
// to set the views engine
app.set('view engine', 'hbs');
app.set('views', template_path);
// hbs.registerPartials(partials_path)

// console.log(process.env.SECRET_KEY);

// handling get request
app.get('/secret', (req, res) => {
  res.render('secret');
});
app.get('/register', (req, res) => {
  res.render('register');
});
app.get('/login', (req, res) => {
  res.render('login');
});

// handling post request
app.post('/register', async (req, res) => {
  try {
    const password = req.body.password;
    const conpassword = req.body.confirmpassword;

    if (password === conpassword) {
      const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        age: req.body.age,
        password: password,
        confirmpassword: conpassword,
      });

      // calling token
      console.log('the success part ' + registerEmployee);
      const token = await registerEmployee.generateAuthToken();
      console.log('the token part ' + token);

    // data storing in cookie in register part
      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 30000),
        httpOnly: true,
      });
      // console.log(cookie);

      const registered = await registerEmployee.save();
      console.log('the registered part ' + registered);
      res.status(201).send(registered);
    } else {
      res.send('Password and confirm password does not match');
    }
  } catch (error) {
    res.status(400).send(error);
    console.log('the error part ');
  }
});

// login handling
app.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userEmail = await Register.findOne({ email: email });

    const isMatch = bcrypt.compare(password, userEmail.password);

    const token = await userEmail.generateAuthToken();
    console.log('the token part ' + token);

    // data storing in cookie in login part
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + 30000),
      httpOnly: true,
      // secure: true,
    });
    console.log(`this is the cookie: ${res.cookie.jwt}`);

    if (isMatch) {
      res.status(201).send(userEmail);
    } else {
      res.send('Invalid password');
    }
  } catch (error) {
    res.status(400).send('Invalid email or password');
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
