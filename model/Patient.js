/**
* Glosario:
* MH (Medical History) : Antecedente medico
* Personal Data : Datos Filiatorios
* alive or deceased : vivo o fallecido
* COD (cause of death): Causa de muerte/fallecimiento
* dbt :
* hta : 
* thyroid: tiroides
* others : otros
* murmurs : soplos
* ssn (Social Sec No): DNI
* treatment: Tratamiento
* smoking : Tabaquismo
* leisure : ocio/esparcimiento
* blood pressure: Tensión Sanguínea
* waist: cintura
* weight: peso
* imc (Indice de Masa Corporal)
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	user: String,
	password: String,
	role: String
});

var User = mongoose.model('User', UserSchema);


var patientSchema = new Schema({
	created: Date,
	author: String,
	personalDataMHNum: Number,
	personalDataFname: String,
	personalDataLname: String,
	personalDataSSN: {type: Number, index: true, unique: true},
	personalDataBday: String, //Not using date
	personalDataAge: Number,
	personalDataGender: String,
	personalDataAddress: String,
	personalDataCity: String,
	fatherAlive: Boolean,
	fatherCOD: String,
	fatherDBT: Boolean,
	fatherHTA: Boolean,
	fatherDislipedemia: Boolean,
	fatherThyroid: String,
	fatherChagas: Boolean,
	fatherOthers: String,
	motherAlive: Boolean,
	motherCOD: String,
	motherDBT: Boolean,
	motherHTA: Boolean,
	motherDislipedemia: Boolean,
	motherThyroid: String,
	motherChagas: Boolean,
	motherOthers: String,
	personalMHDBT: Boolean,
	personalMHHTA: Boolean,
	personalMHDislipedemia: Boolean,
	personalMHThyroid: String,
	personalMHChagas: Boolean,
	personalMHArhythmia: Boolean,
	personalMHOthers: String,
	personalMHTreatment: Boolean,
	personalMHTreatdesc: String,
	personalMHSmoking: Boolean,
	personalMHSmokeDay: Number,
	personalMHSmokeYears: Number,
	personalMHSmokeAbstinence: Number,
	glycemiaSched: String,
	glycemiaFasting: Boolean,
	glycemiaVal: Number,
	glycemiaLastmeal: String,
	physicalActRecently: Boolean,
	physicalActRecentlyLeisure: Boolean,
	physicalActRecentlyCompetition: Boolean,
	physicalActRecentlyDesc: String,
	physicalActRecentlyFreq: Number,
	physicalActRecentlyHours: Number,
	physicalActPrevious: Boolean,
	physicalActPreviousLeisure: Boolean,
	physicalActPreviousCompetition: Boolean,
	physicalActPreviousDesc: String,
	physicalActPreviousAgeIni: Number,
	physicalActPreviousAgeEnd: Number,
	physicalActPreviousFreq: Number,
	physicalActPreviousHours: Number,
	vitalSignsPulseFreq: Number,
	vitalSignsPulseRegular: Boolean,
	vitalSignsBloodPressureSistolic: Number,
	vitalSignsBloodPressureDiastolic: Number,
	measuresSizeNum: Number,
	measuresWeight: Number,
	measuresWaist: Number,
	measuresIMC: Number,
	physicalExamInspection: String,
	physicalExamHeartAuscultation: String,
	physicalExamMurmurs: Boolean,
	physicalExamMurmursDesc: String,
	physicalExamPulmonarAuscultation: Boolean, /* Normal | Hallazgo */
	physicalExamPulmonarAuscultationDesc: String
});

var Patient = mongoose.model('Patient', patientSchema);

module.exports.Patient = Patient;
module.exports.User = User;