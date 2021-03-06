const crypto = require('crypto');
// Name	Blanca Dickens
// Username	blanca11@ethereal.email (also works as a real inbound email address)
// Password	D8Cdn3vqrszFcqPDRZ
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')

const {validationResult} = require('express-validator')

const User = require('../models/user');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'blanca11@ethereal.email',
      pass: 'D8Cdn3vqrszFcqPDRZ'
  }
});

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: req.flash('error'),
    validateErrors: [],
    oldInput: {email:'',password:''},
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: false,
    oldInput:{email:"",password:"",confirmPassword:""},
    validateErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage:errors.array()[0].msg,
      oldInput: {email:email,password:password},
      validateErrors: errors.array()
    });
  }

  User.findOne({email: email})
  .then(user => {
    if(!user){
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'Invalid email or password',
        oldInput: {email:email,password:password},
        validateErrors: []
      });
    }
    bcrypt.compare(password, user.password)
    .then(doMatch=>{
      if(doMatch){
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save((err)=>{
          console.log(err)      
          res.redirect('/')
        })
      }
      res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'Invalid email or password',
        oldInput: {email:email,password:password},
        validateErrors: []
      });
    })
    .catch(err=>{
      console.log(err);
      res.redirect('/login')
    })
  })
  .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.password;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log('Hey:')
    console.log(errors.array())
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage:errors.array()[0].msg,
      oldInput:{email:email,password:password,confirmPassword:confirmPassword},
      validateErrors: errors.array()
    });
  }
  bcrypt.hash(password,12)
        .then(hashedPassword=>{
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: {items: []}
          })
        return user.save();
        })
        .then(result =>{
          res.redirect('/login')
          return transporter.sendMail({
            to: email,
            from: 'shop@node-complete.com',
            subject: 'Signup succeeded!',
            html: '<h1>You successfully signed up!<h1>'
          })
        })
        .catch(err => {
          console.log(err)
        })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    //console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req,res,next) => {
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: req.flash('error')
  });
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err,buffer)=>{
    if(err){
      console.log(err)
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex')
    User.findOne({email:req.body.email})
      .then(user=>{
        if(!user){
          req.flash('error', 'No account with that email found')
          return res.redirect('/reset')
        }
        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 3600000
        return user.save()
      })
      .then(result=>{
        res.redirect('/')
        transporter.sendMail({
          to: req.body.email,
          from: 'shop@node-complete.com',
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:8080/reset/${token}">link</a> to set a new password</p>
          `
        })
      })
      .catch(err=>{console.log(err)})
  });
};

exports.getNewPassword = (req,res,next) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user=>{
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: req.flash('error'),
        userId: user._id.toString(),
        passwordToken: token
      });
    }) 
    .catch(err=>{
      console.log(err)
    })
}

exports.postNewPassword = (req,res,next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
    .then(user=>{
      resetUser = user;
      return bcrypt.hash(newPassword,12)
    })
    .then(hashdPassword=>{
      resetUser.password = hashdPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result=>{
      res.redirect('/login')
    })
    .catch(err=>{
      console.log(err)
    })
}