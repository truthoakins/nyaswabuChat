const express = require('express');
const router = express.Router();
const bcrypt  = require('bcrypt');
const Member = require("../schema/members.js")

  // GET DATA FOR USERS - REGISTER
  router.get('/register', (req,res)=>{
    res.render('register', {title:'Register'});
  })
  
  // POST DATA FOR USERS - REGISTER
  router.post('/register', (req,res)=>{
    const {name,email, password, password2} = req.body;
    
    if(!name || !email || !password || !password2) {      
       req.flash('error_msg','Please fill in all fields!')
       res.redirect('/register')
    }
    //check if match
    if(password !== password2) {
       req.flash('error_msg','Passwords Dont Match!')
        res.redirect('/register');
    }
    //check if password is more than 6 characters
    if(password.length < 6 ) {
        req.flash('error_msg','password should be atleast 6 characters!')
        res.redirect('/register');
    }
    //check if email exists in the system  
       Member.findOne({email : email}).exec((err,member)=>{
        if(member) {  
        req.flash('error_msg','email is already registered!')
        res.redirect('/register');
            
           } else {
             //validation passed
            const newMember = new Member({
                name : name,
                email : email,
                password : password
            });
            bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash(newMember.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newMember.password = hash;
                    //save user
                    newMember.save()
                    .then((value)=>{
                       // console.log(value)
                        req.flash('success_msg','You are now registered!')
                    res.redirect('/');
                    })
                    .catch(value=> console.log(value));
                      
                }));
          }
        })
  })

  module.exports  = router;