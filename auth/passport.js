
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require("../schema/members");

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField : 'email'},(email,password,done)=> {
                //match user
                User.findOne({email : email})
                .then((user)=>{
                 if(!user) {
                     return done(null,false,{message : ' The Email is not registered!!!'});
                 }
                 //match pass
                 bcrypt.compare(password,user.password,(err,isMatch)=>{
                     if(err) throw err;

                     if(isMatch) {
                         return done(null,user);
                     } else {
                         return done(null,false,{message : ' Wrong Password!!!'});
                     }
                 })
                })
                .catch((err)=> {console.log(err)})
        })
        
    )

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      }); 
}; 

/*
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Member = require("../schema/members");

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField : 'email'},(email,password,done)=> {
                //match user
                Member.findOne({email : email})
                .then((member)=>{
                 if(!member) {
                     return done(null,false,{message : 'that email is not registered'});
                 }
                 //match pass
                 bcrypt.compare(password,member.password,(err,isMatch)=>{
                     if(err) throw err;

                     if(isMatch) {
                         return done(null,member);
                     } else {
                         return done(null,false,{message : 'pass incorrect'});
                     }
                 })
                })
                .catch((err)=> {console.log(err)})
        })
        
    )
    passport.serializeUser(function(member, done) {
        done(null, member.id);
      });
      
      passport.deserializeUser(function(id, done) {
        Member.findById(id, function(err, member) {
          done(err, member);
        });
      }); 
}; 
*/