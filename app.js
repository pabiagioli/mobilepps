var mongoose = require('mongoose'),
	express = require('express'),
	socketio = require('socket.io'),
	path = require('path'),
	//nodemon = require('nodemon'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
	moment = require('moment'),
	app = express();

/* My Modules and Classes */
var DataBase = require("./model/Patient"),
	DAO = require("./model/DAO"),
	PatientUtils = require("./model/PatientUtils");

/* DB Start with DAO */
//DAO.init();

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

		/*Users.find({}, function(err,docs){
			if (err){
				console.log(err);
			}else{
		*/		
				if(username == 'mo2013')
					return done(null,{user:username});
				else
					return done(null, false, { message: 'Incorrect username.' });
		/*	}
		});*/
		
	}
	));



app.get('/',ensureLoggedIn('/login'), function(req,res){
	/*Users.find({}, function(err,docs){
		if (err){
			console.log(err);
		}else{*/
			res.render('index.jade',{username:req.user/*, Users: docs*/});
		/*}
	});	*/
});

app.post('/',ensureLoggedIn('/login'), function(req,res){
	/*Users.find({}, function(err,docs){
		if (err){
			console.log(err);
		}else{*/
			res.render('index.jade',{username:req.user/*, Users: docs*/});
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

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/form-input',ensureLoggedIn('/login'),function(req,res){
	if(req.messages == null)
		req.messages = 'Completa el Formulario'
	res.render('form-input.jade', {username:req.user, messages: req.messages});
});

app.post('/form-input',ensureLoggedIn('/login'),function(req,res){
	if(req.messages == null)
		req.messages = 'Completa el Formulario'
	res.render('form-input.jade', {username:req.user, messages: req.messages});
});

app.get('/form-query',ensureLoggedIn('/login'),function(req,res){
	DataBase.Patient.find({}, function (err,docs){
		if(err)
			console.log(err);
		console.log('Docs = ', JSON.stringify(docs));
		res.render('form-query.jade', {username:req.user, Patients: docs, messages: "Ingresa un Nombre o Apellido"});
	});
	
	
});
app.post('/form-query',ensureLoggedIn('/login'),function(req,res){
	DataBase.Patient.find({}, function (err,docs){
		if(err)
			console.log(err);
		console.log('Docs = ', JSON.stringify(docs));
		res.render('form-query.jade', {username:req.user, Patients: docs , messages: "Ingresa un Nombre o Apellido"});
	});
	
	
});

app.get('/form-query/patient/delete/:ssn',ensureLoggedIn('/login'),function(req,res){
	DataBase.Patient.findOne({personalDataSSN: req.params.ssn}, function (err,patient){
		if(err)
			console.log(err);
		console.log('Docs = ', JSON.stringify(patient));
		patient.remove();
		//res.render('form-query.jade', {username:req.user, Patients: docs });
		res.redirect('/form-query');
	});
	
	
});

app.get('/form-query/patient/edit/:ssn',ensureLoggedIn('/login'),function(req,res){
	DataBase.Patient.findOne({personalDataSSN: req.params.ssn}, function (err,patient){
		if(err)
			console.log(err);
		
		var resultDTO = {};
		//result.personalDataBday = moment(patient.personalDataBday).format("YYYY-MM-DD");
		resultDTO = PatientUtils.makeDTO(patient);
		console.log('this is from GET',{username:req.user, patient: resultDTO , messages: 'HC creada por '+patient.author});
		res.render('form-input.jade', {username:req.user, patient: resultDTO , messages: 'HC creada por '+patient.author});
	});
	
	
});

app.post('/form-query/patient/edit/:ssn',ensureLoggedIn('/login'),function(req,res){
	DataBase.Patient.findOne({personalDataSSN: req.params.ssn}, function (err,patient){
		if(err)
			console.log(err);
		//patient.personalDataBday = moment(patient.personalDataBday).format("YYYY-MM-DD");
		var resultDTO = PatientUtils.makeDTO(patient);
		res.render('form-input.jade', {username:req.user, patient: resultDTO , messages: 'HC creada por '+patient.author});
	});
	
	
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
		res.send( JSON.stringify({username:req.user/*, Users: docs*/}));
	/*});
	*/
});

app.post('/form-process',ensureLoggedIn('/login'),function(req,res){

	DataBase.Patient.findOne({personalDataSSN: req.body.personalDataSSN}, function (err,patient){
		if(err)
			console.log(err);
		console.log("entré al callback");
		if(patient == null){
			console.log("tuve que crear uno");
			patient = new DataBase.Patient();
			patient.created = new Date();
			patient.author = req.user.user;
		}
		
		patient = PatientUtils.makeModel(patient,req.body);	
		
		patient.save();
			

		
		res.render('form-input.jade', {username:req.user, messages: "Paciente guardado con éxito"});

	});	
	
});