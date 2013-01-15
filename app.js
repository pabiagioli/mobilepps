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
var DataBase = require("./model/Patient");


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
			console.log('Connection to MongoDB error',err);
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
		
		var result = patient;
		var birth = moment(patient.personalDataBday).format("YYYY-MM-DD"); //This works with personalDataBday = Date
		result.personalDataBday = birth; //This doesn't with personalDataBday = Date

		console.log('this is from GET',{username:req.user, patient: result , messages: 'HC creada por '+patient.author});
		res.render('form-input.jade', {username:req.user, patient: result , messages: 'HC creada por '+patient.author});
	});
	
	
});

app.post('/form-query/patient/edit/:ssn',ensureLoggedIn('/login'),function(req,res){
	DataBase.Patient.findOne({personalDataSSN: req.params.ssn}, function (err,patient){
		if(err)
			console.log(err);
		
		res.render('form-input.jade', {username:req.user, patient: patient , messages: 'HC creada por '+patient.author});
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
			
		patient.personalDataMHNum = req.body.personalDataMHNum;
		patient.personalDataFname = req.body.personalDataFname;
		patient.personalDataLname = req.body.personalDataLname;
		patient.personalDataSSN = req.body.personalDataSSN;
		patient.personalDataBday = req.body.personalDataBday;
		patient.personalDataAge = req.body.personalDataAge;
		patient.personalDataGender = req.body.personalDataGender;
		patient.personalDataAddress = req.body.personalDataAddress;
		patient.personalDataCity = req.body.personalDataCity;
		patient.fatherAlive = (req.body.fatherAlive == 'true')?true:false;
		patient.fatherCOD = req.body.fatherCOD;
		patient.fatherDBT = (req.body.fatherDBT == 'on')?true:false;
		patient.fatherHTA = (req.body.fatherHTA == 'on')?true:false;
		patient.fatherDislipedemia = (req.body.fatherDislipedemia == 'on')?true:false;
		patient.fatherThyroid = (req.body.fatherThyroid == 'on')?true:false;
		patient.fatherChagas = (req.body.fatherChagas == 'on')?true:false;
		patient.fatherOthers = req.body.fatherOthers;
		patient.motherAlive = (req.body.motherAlive == 'true')?true:false;
		patient.motherCOD = req.body.motherCOD;
		patient.motherDBT = (req.body.motherDBT == 'on')?true:false;
		patient.motherHTA = (req.body.motherHTA == 'on')?true:false;
		patient.motherDislipedemia = (req.body.motherDislipedemia == 'on')?true:false;
		patient.motherThyroid = (req.body.motherThyroid == 'on')?true:false;
		patient.motherChagas = (req.body.motherChagas == 'on')?true:false;
		patient.motherOthers = req.body.motherOthers;
		patient.personalMHDBT = (req.body.personalMHDBT == 'on')?true:false;
		patient.personalMHHTA = (req.body.personalMHHTA == 'on')?true:false;
		patient.personalMHDislipedemia = (req.body.personalMHDislipedemia == 'on')?true:false;
		patient.personalMHThyroid = (req.body.personalMHThyroid == 'on')?true:false;
		patient.personalMHChagas = (req.body.personalMHChagas == 'on')?true:false;
		patient.personalMHArhythmia = (req.body.personalMHArhythmia == 'on')?true:false;
		patient.personalMHOthers = req.body.personalMHOthers;
		patient.personalMHTreatment = (req.body.personalMHTreatment == 'on')?true:false;
		patient.personalMHTreatdesc = req.body.personalMHTreatdesc;
		patient.personalMHSmoking = (req.body.personalMHSmoking == 'on')?true:false;
		patient.personalMHSmokeDay = req.body.personalMHSmokeDay;
		patient.personalMHSmokeYears = req.body.personalMHSmokeYears;
		patient.personalMHSmokeAbstinence = req.body.personalMHSmokeAbstinence;
		patient.glycemiaSched = req.body.glycemiaSched;
		patient.glycemiaFasting = (req.body.glycemiaFasting == 'on')?true:false;
		patient.glycemiaVal = req.body.glycemiaVal;
		patient.glycemiaLastmeal = req.body.glycemiaLastmeal;
		patient.physicalActRecently = (req.body.physicalActRecently == 'on')?true:false;
		patient.physicalActRecentlyLeisure = req.body.physicalActRecentlyLeisure;
		patient.physicalActRecentlyCompetition = req.body.physicalActRecentlyCompetition;
		patient.physicalActRecentlyDesc = req.body.physicalActRecentlyDesc;
		patient.physicalActRecentlyFreq = req.body.physicalActRecentlyFreq;
		patient.physicalActRecentlyHours = req.body.physicalActRecentlyHours;
		patient.physicalActPrevious = (req.body.physicalActPrevious == 'on')?true:false;
		patient.physicalActPreviousLeisure = req.body.physicalActPreviousLeisure;
		patient.physicalActPreviousCompetition = req.body.physicalActPreviousCompetition;
		patient.physicalActPreviousDesc = req.body.physicalActPreviousDesc;
		patient.physicalActPreviousAgeIni = req.body.physicalActPreviousAgeIni;
		patient.physicalActPreviousAgeEnd = req.body.physicalActPreviousAgeEnd;
		patient.physicalActPreviousFreq = req.body.physicalActPreviousFreq;
		patient.physicalActPreviousHours = req.body.physicalActPreviousHours;
		patient.vitalSignsPulse = (req.body.vitalSignsPulse == 'on')?true:false;
		patient.vitalSignsPulseFreq = req.body.vitalSignsPulseFreq;
		patient.vitalSignsPulseRegular = req.body.vitalSignsPulseRegular;
		patient.vitalSignsBloodPressureSistolic = req.body.vitalSignsBloodPressureSistolic;
		patient.vitalSignsBloodPressureDiastolic = req.body.vitalSignsBloodPressureDiastolic;
		patient.measuresSizeNum = req.body.measuresSizeNum;
		patient.measuresWeight = req.body.measuresWeight;
		patient.measuresWaist = req.body.measuresWaist;
		patient.measuresIMC = req.body.measuresIMC;
		patient.physicalExamInspection = req.body.physicalExamInspection;
		patient.physicalExamHeartAuscultation = req.body.physicalExamHeartAuscultation;
		patient.physicalExamMurmurs = (req.body.physicalExamMurmurs == 'on')?true:false;
		patient.physicalExamMurmursDesc = req.body.physicalExamMurmursDesc;
		patient.physicalExamPulmonarAuscultation = (req.body.physicalExamPulmonarAuscultation == 'on')?true:false; /* Normal | Hallazgo */
		patient.physicalExamPulmonarAuscultationDesc = req.body.physicalExamPulmonarAuscultationDesc;
		patient.save();
			

		
		res.render('form-input.jade', {username:req.user, messages: "Paciente guardado con éxito"});

	});	
	
});