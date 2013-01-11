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
/*var DataBase = require("./model/Patient");*/


/* DB Start with DAO */
/*var DAOimpl = function(url,dbname,dbuser,dbpass){

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
*/
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
				return done(null,{user:username});
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
		res.render('form-query.jade', {username:req.user, Patients: docs });
	});
	
	
});
app.post('/form-query',ensureLoggedIn('/login'),function(req,res){
	DataBase.Patient.find({}, function (err,docs){
		if(err)
			console.log(err);
		console.log('Docs = ', JSON.stringify(docs));
		res.render('form-query.jade', {username:req.user, Patients: docs });
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
	
	var patient = new DataBase.Patient({
		created: new Date(),
		author: null,
		personalDataMHNum: req.body.personalDataMHNum,
		personalDataFname: req.body.personalDataFname,
		personalDataLname: req.body.personalDataLname,
		personalDataSSN: req.body.personalDataSSN,
		personalDataBday: req.body.personalDataBday,
		personalDataAge: req.body.personalDataAge,
		personalDataGender: req.body.personalDataGender,
		personalDataAddress: req.body.personalDataAddress,
		personalDataCity: req.body.personalDataCity,
		fatherAlive: (req.body.fatherAlive == 'true')?true:false,
		fatherCOD: req.body.fatherCOD,
		fatherDBT: (req.body.fatherDBT == 'on')?true:false,
		fatherHTA: (req.body.fatherHTA == 'on')?true:false,
		fatherDislipedemia: (req.body.fatherDislipedemia == 'on')?true:false,
		fatherThyroid: (req.body.fatherThyroid == 'on')?true:false,
		fatherChagas: (req.body.fatherChagas == 'on')?true:false,
		fatherOthers: req.body.fatherOthers,
		motherAlive: (req.body.motherAlive == 'true')?true:false,
		motherCOD: req.body.motherCOD,
		motherDBT: (req.body.motherDBT == 'on')?true:false,
		motherHTA: (req.body.motherHTA == 'on')?true:false,
		motherDislipedemia: (req.body.motherDislipedemia == 'on')?true:false,
		motherThyroid: (req.body.motherThyroid == 'on')?true:false,
		motherChagas: (req.body.motherChagas == 'on')?true:false,
		motherOthers: req.body.motherOthers,
		personalMHDBT: (req.body.personalMHDBT == 'on')?true:false,
		personalMHHTA: (req.body.personalMHHTA == 'on')?true:false,
		personalMHDislipedemia: (req.body.personalMHDislipedemia == 'on')?true:false,
		personalMHThyroid: (req.body.personalMHThyroid == 'on')?true:false,
		personalMHChagas: (req.body.personalMHChagas == 'on')?true:false,
		personalMHArhythmia: (req.body.personalMHArhythmia == 'on')?true:false,
		personalMHOthers: req.body.personalMHOthers,
		personalMHTreatment: (req.body.personalMHTreatment == 'on')?true:false,
		personalMHTreatdesc: req.body.personalMHTreatdesc,
		personalMHSmoking: (req.body.personalMHSmoking == 'on')?true:false,
		personalMHSmokeDay: req.body.personalMHSmokeDay,
		personalMHSmokeYears: req.body.personalMHSmokeYears,
		personalMHSmokeAbstinence: req.body.personalMHSmokeAbstinence,
		glycemiaSched: req.body.glycemiaSched,
		glycemiaFasting: (req.body.glycemiaFasting == 'on')?true:false,
		glycemiaVal: req.body.glycemiaVal,
		glycemiaLastmeal: req.body.glycemiaLastmeal,
		physicalActRecently: (req.body.physicalActRecently == 'on')?true:false,
		physicalActRecentlyLeisure: req.body.physicalActRecentlyLeisure,
		physicalActRecentlyCompetition: req.body.physicalActRecentlyCompetition,
		physicalActRecentlyDesc: req.body.physicalActRecentlyDesc,
		physicalActRecentlyFreq: req.body.physicalActRecentlyFreq,
		physicalActRecentlyHours: req.body.physicalActRecentlyHours,
		physicalActPrevious: (req.body.physicalActPrevious == 'on')?true:false,
		physicalActPreviousLeisure: req.body.physicalActPreviousLeisure,
		physicalActPreviousCompetition: req.body.physicalActPreviousCompetition,
		physicalActPreviousDesc: req.body.physicalActPreviousDesc,
		physicalActPreviousAgeIni: req.body.physicalActPreviousAgeIni,
		physicalActPreviousAgeEnd: req.body.physicalActPreviousAgeEnd,
		physicalActPreviousFreq: req.body.physicalActPreviousFreq,
		physicalActPreviousHours: req.body.physicalActPreviousHours,
		vitalSignsPulse: (req.body.vitalSignsPulse == 'on')?true:false,
		vitalSignsPulseFreq: req.body.vitalSignsPulseFreq,
		vitalSignsPulseRegular: req.body.vitalSignsPulseRegular,
		vitalSignsBloodPressureSistolic: req.body.vitalSignsBloodPressureSistolic,
		vitalSignsBloodPressureDiastolic: req.body.vitalSignsBloodPressureDiastolic,
		measuresSizeNum: req.body.measuresSizeNum,
		measuresWeight: req.body.measuresWeight,
		measuresWaist: req.body.measuresWaist,
		measuresIMC: req.body.measuresIMC,
		physicalExamInspection: req.body.physicalExamInspection,
		physicalExamHeartAuscultation: req.body.physicalExamHeartAuscultation,
		physicalExamMurmurs: (req.body.physicalExamMurmurs == 'on')?true:false,
		physicalExamMurmursDesc: req.body.physicalExamMurmursDesc,
		physicalExamPulmonarAuscultation: (req.body.physicalExamPulmonarAuscultation == 'on')?true:false, /* Normal | Hallazgo */
		physicalExamPulmonarAuscultationDesc: req.body.physicalExamPulmonarAuscultationDesc
	});
	patient.save();
	res.render('form-input.jade', {username:req.user, messages: "Paciente guardado con éxito"});
});