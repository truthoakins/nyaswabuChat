const express = require('express');
const router = express.Router();
const passport = require('passport'); 

//login in get for users
router.get('/', (req,res)=>{

  res.render('home', {title:'Home'});
  })
  
    // POST DATA FOR USERS - LOGIN
router.post('/', (req,res)=>{
  passport.authenticate('local',{
successRedirect : '/chat',
failureRedirect : '/',
failureFlash : true,
})(req,res);
})

//LOGOUT ROUTE
router.get('/logout', (req,res)=>{
  req.logout();
  req.flash('success_msg','You are Logged out');
  res.redirect('/');
})
  module.exports  = router;