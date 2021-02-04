const mongoose = require('mongoose');

const UserSchema  = new mongoose.Schema({
  name :{
      type  : String,
      required : true
  } ,
  email :{
    type  : String,
    required : true
} ,
  profilePic :{
    type  : String,
    default: 'avator.jpg'
} ,
password :{
    type  : String,
    required : true
} 
},
{ collection: 'members' }
);
const User= mongoose.model('User',UserSchema);

module.exports = User;