const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
//Create schema
mongoose.connect("mongodb://localhost/message_board");
var Schema = mongoose.Schema;
var MessageSchema = new mongoose.Schema({
    name: {type: String, required: true },
    message: {type: String, required: true},
    comments:[{type: Schema.Types.ObjectId, ref:'Comment'}]
}, {timestamps: true});
// define Comment Schema
var CommentSchema = new mongoose.Schema({
 _message: {type: Schema.Types.ObjectId, ref: 'Message'},
 name: { type: String, required: true },
 comment: {type: String, required: true }
}, {timestamps: true });

// set our models by passing them their respective Schemas
mongoose.model("Message", MessageSchema);
mongoose.model('Comment', CommentSchema);

// store our models in variables
var Message = mongoose.model('Message');
var Comment = mongoose.model('Comment');


app.use(bodyParser.urlencoded({extended: true}));
//setting up ejs and views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//root route
app.get('/', function (req, res) {
    Message.find({}).populate('comments').exec(function (err, messages) {
        // console.log(messages)
                res.render('index', {messages: messages}); //function (err, messages) {
        // if (err) {
        //     console.log("Something wrong with finding animals!");
        // }
        
    })
})
app.post('/createMessage', function(req, res){
    var message = new Message({name: req.body.name,message: req.body.message});
    message.save(function(err){
        if(err){
            console.log("Something went wrong with creating message!");
        }
        else{
            console.log("Successfully added name and message!");
            res.redirect("/")
        }
    })
})
// console.log("helooooooooooo")
// route for getting a particular post and comments
// app.get('/message/:id', function (req, res){
//  Message.findOne({_id: req.params.id}).populate('comments').exec(function(err, message) {
//       res.render('', {message: message});
//         });
// });
// route for creating one comment with the parent post id
app.post('/message/comment/:id', function (req, res){
  Message.findOne({_id: req.params.id}, function(err, message){
         var comment = new Comment({name: req.body.name, comment: req.body.comment});
         comment._message = message._id;
         
         message.comments.push(comment);
         console.log("helooo", comment)
         comment.save(function(err){
                 message.save(function(err){
                       if(err) { 
                           console.log('Error');
                         } 
                       else {
                            res.redirect('/');
                            
                         }
                 });
         });
   });
 });





app.listen(8000, function(){
    console.log("listening on port 8000");
});