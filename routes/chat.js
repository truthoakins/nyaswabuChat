const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require("../auth/auth.js")
const Chat = require("../schema/chat.js")
const path = require('path')
const multer  = require('multer');
const Member = require("../schema/members.js")
 
//chat get request
router.get('/chat', ensureAuthenticated,(req,res)=>{
  Chat.find({}, function(err, result) {
    if (err) throw err;
    var room='STAR';
    res.render('chat', {title:'chat',layout:'./layouts/chat_layout',user: req.user,room:room, result:result
  });
 });
 
  })

//muler storage
const storage = multer.diskStorage({
  destination: 'public/images/uploads',
  filename: function (req, file, cb) {
    const imageName = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    cb(null, imageName);
  }
})
 
const upload = multer({ 
  storage: storage,
  limits:{fileSize:3100000},
  fileFilter: function(req,file,cb){
    checkFileType(file,cb)
  }
 }).single('profileImage')

 //check image file type
 function checkFileType(file,cb){
   //allowed extensions
   const fileType = /jpeg|png|jpg|svg|gif/;
   //check ext
   const extname = fileType.test(path.extname(file.originalname).toLocaleLowerCase());
   //check mime type
   const mimetype = fileType.test(file.mimetype)
    if(mimetype && extname){
      return cb(null,true)
    }else{
    cb('Error: Images Only')
    }
 }
//upload images post data
router.post('/profile', ensureAuthenticated,function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      // An unknown error occurred when uploading.
      req.flash('error_msg',' Image NOT Uploaded!')
      res.redirect('/chat')
    } else{

      // Everything went fine.
                            //console.log(req.file.filename)
                            //console.log(req.body.email)
      if(req.file == undefined){
        req.flash('error_msg',' No File Selected!')
        res.redirect('/chat')
      }else{
        
      Member.findOneAndUpdate({email:req.body.email}, { profilePic: req.file.filename }, function(err, result) {
        if (err) {
          console.log(err);
          req.flash('error_msg',' Image NOT Uploaded!')
          res.redirect('/chat')
        } else {
          console.log(result);
      req.flash('success_msg',' Image Uploaded!')
      res.redirect('/chat')
        }
      });
      }

    }
  })
})


  module.exports  = router;