var mongoose = require('mongoose'),
	express = require('express'),
	socketio = require('socket.io'),
	path = require('path'),
	//nodemon = require('nodemon'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
	app = express();

/* My Modules and Classes */
/*var FormLabel = require("./model/Patient");*/


/* DB Start with DAO */
var DAOimpl = function(url,dbname,dbuser,dbpass){

	var connStr ='mongodb://'; 
	
	if(dbuser != null || dbpass != null)
		connStr += dbuser+':'+dbpass+'@'+url+'/'+dbname;
	else
		connStr += url+'/'+dbname;
	
	console.log("Connecting to %s ...\n",connStr);
	
	return mongoose.connect(connStr, function (err) {
		if (err) {
			console.log('Connection to MongoDB error');
			return err;
		}
		console.log("Connection to MongoDB successful");
  		// ok we're set
	});
	
};

var DAO = new DAOimpl('localhost', 'nodepps',null,null);

/* 
******************************
*
* Server and Passport config *
*
******************************
*/
app.configure(function() {
  app.use(express.logger());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.cookieParser());
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'secret' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

passport.serializeUser(function(user, done) {
      done(null, user);
});

passport.deserializeUser(function(obj, done) {
      done(null, obj);
});

passport.use(new LocalStrategy( 
	function(username,password,done){
		if(username == null)
			console.log("error ocurred during auth");

		/*QA.find({}, function(err,docs){
			if (err){
				console.log(err);
			}else{
		*/		
				return done(null,{user:username});
		/*	}
		});*/
		
	}
	));



app.get('/',ensureLoggedIn('/login'), function(req,res){
	/*QA.find({}, function(err,docs){
		if (err){
			console.log(err);
		}else{*/
			res.render('index.jade',{username:req.user/*, qa: docs*/});
		/*}
	});	*/
});

app.post('/',ensureLoggedIn('/login'), function(req,res){
	/*QA.find({}, function(err,docs){
		if (err){
			console.log(err);
		}else{*/
			res.render('index.jade',{username:req.user/*, qa: docs*/});
		/*}
	});*/
});

app.get('/login',function(req,res){
	res.render('login.jade', {username:req.user});
});

app.post('/login', 
	passport.authenticate('local',{ failureRedirect: '/login'}),
	function(req,res){
		res.redirect('/');
});


var server = app.listen(8080);
//console.log('Express server started on %s:%s',server.address().address,server.address().port);

/* Socket io part */
var io = socketio.listen(server);

/**
	For ADMINS
  */
app.get('/admin',function(req,res){
	/*Attendee.find({}, function (err,docs){
		if(err)
			console.log(err);*/
		res.send( JSON.stringify({username:req.user/*, QAs: docs*/}));
	/*});
	*/
});
