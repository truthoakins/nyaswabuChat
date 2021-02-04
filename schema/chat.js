const mongoose = require('mongoose');

const ChatSchema  = new mongoose.Schema({
   
     name :{
         type : String,
         required : true
     },
    email :{
           type  : String,
           required : true
       } ,
     sms :{
         type : String,
         required : true
     },
     date :{
        type : Date,
        default : Date.now
    }
     },
     { collection: 'chat' }
     );
const Chat = mongoose.model('Chat',ChatSchema);

module.exports = Chat;