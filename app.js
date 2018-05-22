var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
const { check, validationResult } = require('express-validator/check');
var mongojs = require('mongojs')
var db = mongojs('learn', ['users'])
var ObjectId = mongojs.ObjectId;
var app = express();

/*
var logger = function(req, res, next){
	console.log('Logging...');
	next();
}

app.use(logger);
*/

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

//global vars
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
});

// var users = [
// 	{
// 		id: 1,
// 		fname: 'John',
// 		lname: 'Doe',
// 		email: 'jdoe@email.com'
// 	},
// 	{
// 		id: 2,
// 		fname: 'Bob',
// 		lname: 'Boy',
// 		email: 'bb@email.com'
// 	},	
// 	{
// 		id: 3,
// 		fname: 'Jill',
// 		lname: 'Jackson',
// 		email: 'jj@email.com'
// 	}
// ]
var users = [];

app.get('/', function(req, res){
	db.users.find(function (err, docs) {
		users = docs;
		// console.log(users);
		res.render('index', {
			title: "Customers",
			users: docs
		});
	});

});

app.post('/userz/update', [

	check('fname').isLength({ min: 5}),
	check('email', 'Invalid Email').isEmail(),
	check('lname').isLength({ min: 3})

], function(req, res){
	console.log("updating...");
	var data = req.body;
	db.users.update({_id: ObjectId(data.id)}, {fname:data.fname, lname:data.lname, email:data.email}, function(err, result){
		if(err){
			console.log(err);
		}
		res.redirect('/');
	})

});

app.post('/users/add', [

	check('fname').isLength({ min: 5}),
	check('email', 'Invalid Email').isEmail(),
	check('lname').isLength({ min: 3})

], (req, res) => {

	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		res.render('index', {
			title: "Users",
			users: users,
			errors: errors.array()
		});
		console.log(errors.array());
		// return res.status(422).json({errors: errors.array() });
	}
	else{

		var newUser = {
			fname: req.body.fname,
			lname: req.body.lname,
			email: req.body.email
		}

		db.users.insert(newUser, (err, result) => {
			if(err){
				console.log(err);
			}
			res.redirect('/');
		})

	}
});

app.get('/user/:id', function(req, res){
	var id = req.params.id;
	db.users.findOne({_id: ObjectId(id)}, function (err, docs) {
		res.send(docs);
	})
});

app.delete('/users/delete/:id', (req, res) => {
	console.log(req.params.id);	
	db.users.remove({_id: ObjectId(req.params.id)}, function(err){
		if(err){
			console.log(err);
		}
		else{
			console.log('success');
		}
	});
});

app.listen(3000, function(){
	console.log('Server started on port 3000...');
})