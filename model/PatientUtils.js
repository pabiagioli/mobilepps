var mongoose = require('mongoose'),
	Patient = require('./Patient');

var makeModel = function (patient,dto){

	patient.created = patient.created;
	patient.author = patient.author;
	patient.personalDataMHNum = dto.personalDataMHNum;
	patient.personalDataFname = dto.personalDataFname;
	patient.personalDataLname = dto.personalDataLname;
	patient.personalDataSSN = dto.personalDataSSN;
	patient.personalDataBday = dto.personalDataBday;
	patient.personalDataAge = dto.personalDataAge;
	patient.personalDataGender = dto.personalDataGender;
	patient.personalDataAddress = dto.personalDataAddress;
	patient.personalDataCity = dto.personalDataCity;
	patient.fatherAlive = (dto.fatherAlive == 'true')?true:false;
	patient.fatherCOD = dto.fatherCOD;
	patient.fatherDBT = (dto.fatherDBT != undefined )?true:false;
	patient.fatherHTA = (dto.fatherHTA != undefined )?true:false;
	patient.fatherDislipedemia = (dto.fatherDislipedemia != undefined )?true:false;
	patient.fatherThyroid = dto.fatherThyroid
	patient.fatherChagas = (dto.fatherChagas != undefined )?true:false;
	patient.fatherOthers = dto.fatherOthers;
	patient.motherAlive = (dto.motherAlive == 'true')?true:false;
	patient.motherCOD = dto.motherCOD;
	patient.motherDBT = (dto.motherDBT != undefined )?true:false;
	patient.motherHTA = (dto.motherHTA != undefined )?true:false;
	patient.motherDislipedemia = (dto.motherDislipedemia != undefined )?true:false;
	patient.motherThyroid = dto.motherThyroid
	patient.motherChagas = (dto.motherChagas == 'on')?true:false;
	patient.motherOthers = dto.motherOthers;
	patient.personalMHDBT = (dto.personalMHDBT != undefined )?true:false;
	patient.personalMHHTA = (dto.personalMHHTA != undefined )?true:false;
	patient.personalMHDislipedemia = (dto.personalMHDislipedemia != undefined )?true:false;
	patient.personalMHThyroid = dto.personalMHThyroid
	patient.personalMHChagas = (dto.personalMHChagas != undefined )?true:false;
	patient.personalMHArhythmia = (dto.personalMHArhythmia != undefined )?true:false;
	patient.personalMHOthers = dto.personalMHOthers;
	patient.personalMHTreatment = (dto.personalMHTreatment == 'on')?true:false;
	patient.personalMHTreatdesc = dto.personalMHTreatDesc;
	patient.personalMHSmoking = (dto.personalMHSmoking == 'on')?true:false;
	patient.personalMHSmokeDay = dto.personalMHSmokeDay;
	patient.personalMHSmokeYears = dto.personalMHSmokeYears;
	patient.personalMHSmokeAbstinence = dto.personalMHSmokeAbstinence;
	patient.glycemiaSched = dto.glycemiaSched;
	patient.glycemiaFasting = (dto.glycemiaFasting == 'on')?true:false;
	patient.glycemiaVal = dto.glycemiaVal;
	patient.glycemiaLastmeal = dto.glycemiaLastmeal;
	patient.physicalActRecently = (dto.physicalActRecently == 'on')?true:false;
	patient.physicalActRecentlyLeisure = dto.physicalActRecentlyLeisure;
	patient.physicalActRecentlyCompetition = dto.physicalActRecentlyCompetition;
	patient.physicalActRecentlyDesc = dto.physicalActRecentlyDesc;
	patient.physicalActRecentlyFreq = dto.physicalActRecentlyFreq;
	patient.physicalActRecentlyHours = dto.physicalActRecentlyHours;
	patient.physicalActPrevious = (dto.physicalActPrevious == 'on')?true:false;
	patient.physicalActPreviousLeisure = dto.physicalActPreviousLeisure;
	patient.physicalActPreviousCompetition = dto.physicalActPreviousCompetition;
	patient.physicalActPreviousDesc = dto.physicalActPreviousDesc;
	patient.physicalActPreviousAgeIni = dto.physicalActPreviousAgeIni;
	patient.physicalActPreviousAgeEnd = dto.physicalActPreviousAgeEnd;
	patient.physicalActPreviousFreq = dto.physicalActPreviousFreq;
	patient.physicalActPreviousHours = dto.physicalActPreviousHours;
	patient.vitalSignsPulse = (dto.vitalSignsPulse == 'on')?true:false;
	patient.vitalSignsPulseFreq = dto.vitalSignsPulseFreq;
	patient.vitalSignsPulseRegular = dto.vitalSignsPulseRegular;
	patient.vitalSignsBloodPressureSistolic = dto.vitalSignsBloodPressureSistolic;
	patient.vitalSignsBloodPressureDiastolic = dto.vitalSignsBloodPressureDiastolic;
	patient.measuresSizeNum = dto.measuresSizeNum;
	patient.measuresWeight = dto.measuresWeight;
	patient.measuresWaist = dto.measuresWaist;
	patient.measuresIMC = dto.measuresIMC;
	patient.physicalExamInspection = dto.physicalExamInspection;
	patient.physicalExamHeartAuscultation = dto.physicalExamHeartAuscultation;
	patient.physicalExamMurmurs = (dto.physicalExamMurmurs == 'on')?true:false;
	patient.physicalExamMurmursDesc = dto.physicalExamMurmursDesc;
	patient.physicalExamPulmonarAuscultation = (dto.physicalExamPulmonarAuscultation == 'on')?true:false; /* Normal | Hallazgo */
	patient.physicalExamPulmonarAuscultationDesc = dto.physicalExamPulmonarAuscultationDesc;

	return patient;
}

var makeDTO = function (patient){
	var result = {};

	result.personalDataMHNum = patient.personalDataMHNum;
	result.personalDataFname = patient.personalDataFname;
	result.personalDataLname = patient.personalDataLname;
	result.personalDataSSN = patient.personalDataSSN;
	result.personalDataBday = patient.personalDataBday;
	result.personalDataAge = patient.personalDataAge;
	result.personalDataGender = patient.personalDataGender;
	result.personalDataAddress = patient.personalDataAddress;
	result.personalDataCity = patient.personalDataCity;
	result.fatherAlive = (patient.fatherAlive == true)?'true':'false';
	result.fatherCOD = patient.fatherCOD;
	result.fatherDBT = patient.fatherDBT;
	result.fatherHTA = patient.fatherHTA;
	result.fatherDislipedemia = patient.fatherDislipedemia;
	result.fatherThyroid = patient.fatherThyroid;
	result.fatherChagas = patient.fatherChagas;
	result.fatherOthers = patient.fatherOthers;
	result.motherAlive = (patient.motherAlive == true)?'true':'false';
	result.motherCOD = patient.motherCOD;
	result.motherDBT = patient.motherDBT;
	result.motherHTA = patient.motherHTA;
	result.motherDislipedemia = patient.motherDislipedemia;
	result.motherThyroid = patient.motherThyroid
	result.motherChagas = patient.motherChagas;
	result.motherOthers = patient.motherOthers;
	result.personalMHDBT = patient.personalMHDBT;
	result.personalMHHTA = patient.personalMHHTA;
	result.personalMHDislipedemia = patient.personalMHDislipedemia;
	result.personalMHThyroid = patient.personalMHThyroid;
	result.personalMHChagas = patient.personalMHChagas;
	result.personalMHArhythmia = (patient.personalMHArhythmia == true)?'on':'off';
	result.personalMHOthers = patient.personalMHOthers;
	result.personalMHTreatment = (patient.personalMHTreatment == true)?'on':'off';
	result.personalMHTreatDesc = patient.personalMHTreatdesc;
	result.personalMHSmoking = (patient.personalMHSmoking == true)?'on':'off';
	result.personalMHSmokeDay = patient.personalMHSmokeDay;
	result.personalMHSmokeYears = patient.personalMHSmokeYears;
	result.personalMHSmokeAbstinence = patient.personalMHSmokeAbstinence;
	result.glycemiaSched = patient.glycemiaSched;
	result.glycemiaFasting = (patient.glycemiaFasting == true)?'on':'off';
	result.glycemiaVal = patient.glycemiaVal;
	result.glycemiaLastmeal = patient.glycemiaLastmeal;
	result.physicalActRecently = (patient.physicalActRecently == true)?'on':'off';
	result.physicalActRecentlyLeisure = patient.physicalActRecentlyLeisure;
	result.physicalActRecentlyCompetition = patient.physicalActRecentlyCompetition;
	result.physicalActRecentlyDesc = patient.physicalActRecentlyDesc;
	result.physicalActRecentlyFreq = patient.physicalActRecentlyFreq;
	result.physicalActRecentlyHours = patient.physicalActRecentlyHours;
	result.physicalActPrevious = (patient.physicalActPrevious == true)?'on':'off';
	result.physicalActPreviousLeisure = patient.physicalActPreviousLeisure;
	result.physicalActPreviousCompetition = patient.physicalActPreviousCompetition;
	result.physicalActPreviousDesc = patient.physicalActPreviousDesc;
	result.physicalActPreviousAgeIni = patient.physicalActPreviousAgeIni;
	result.physicalActPreviousAgeEnd = patient.physicalActPreviousAgeEnd;
	result.physicalActPreviousFreq = patient.physicalActPreviousFreq;
	result.physicalActPreviousHours = patient.physicalActPreviousHours;
	result.vitalSignsPulse = (patient.vitalSignsPulse == true)?'on':'off';
	result.vitalSignsPulseFreq = patient.vitalSignsPulseFreq;
	result.vitalSignsPulseRegular = patient.vitalSignsPulseRegular;
	result.vitalSignsBloodPressureSistolic = patient.vitalSignsBloodPressureSistolic;
	result.vitalSignsBloodPressureDiastolic = patient.vitalSignsBloodPressureDiastolic;
	result.measuresSizeNum = patient.measuresSizeNum;
	result.measuresWeight = patient.measuresWeight;
	result.measuresWaist = patient.measuresWaist;
	result.measuresIMC = patient.measuresIMC;
	result.physicalExamInspection = patient.physicalExamInspection;
	result.physicalExamHeartAuscultation = patient.physicalExamHeartAuscultation;
	result.physicalExamMurmurs = (patient.physicalExamMurmurs == true)?'on':'off';
	result.physicalExamMurmursDesc = patient.physicalExamMurmursDesc;
	result.physicalExamPulmonarAuscultation = (patient.physicalExamPulmonarAuscultation == true)?'on':'off'; /* Normal | Hallazgo */
	result.physicalExamPulmonarAuscultationDesc = patient.physicalExamPulmonarAuscultationDesc;

	return result;
}
module.exports.makeModel = makeModel;
module.exports.makeDTO = makeDTO;