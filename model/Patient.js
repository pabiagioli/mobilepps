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
*/

var personalDataSchema = new Schema({
	fname: String,
	lname: String,
	age: Number,
	gender: String,
	address: String,
	city: String
});

var PersonalData = mongoose.model('PersonalData', personalDataSchema);

var parentMH = new Schema({
	alive: Boolean,
	/*deceased: Boolean,*/
	cod: String,
	dbt: Boolean,
	hta: Boolean,
	dislipedemia: Boolean,
	thyroid: String,
	chagas: Boolean,
	others: String
});

var ParentMH = mongoose.model('ParentMH',parentMH);

var personalMHschema = new Schema({
	dbt: Boolean,
	hta: Boolean,
	dislipedemia: Boolean,
	thyroid: String,
	chagas: Boolean,
	arhythmia: Boolean,
	otros: String,
	treatment: Boolean,
	treatdesc: String,
	tabaquism: Boolean,
	cigDay: Number,
	years: Number,
	abstinence: Number
});

var PersonalMH = mongoose.model('PersonalMH', personalMHschema);

var physicalActivitySchema = new Schema({
	leisure: Boolean,
	competition: Boolean,
	name: String,
	freq: Number,
	hours: Number
});

var personalFitnessSchema = new Schema({
	now:[physicalActivitySchema],
	previous:[physicalActivitySchema]
});

var PersonalFitness = mongoose.model('PersonalFitness', personalFitnessSchema);

var vitalSignsSchema = new Schema({
	pulseFreq: Number,
	regular: Boolean,
	sistolic: Number,
	diastolic: Number
});

var anthropometricMeassuresSchema = new Schema({
	size: Number,
	weight: Number,
	weist: Number,
});

var hearingSchema = new Schema({
	r1hiperfon: Boolean,
	r1hipofon: Boolean,
	r1normofon: Boolean,
	r2hiperfon: Boolean,
	r2hipofon: Boolean,
	r2normofon: Boolean,
	desdoblado: Boolean,
	dynamic: Boolean,
	fixed: Boolean,
	soplos: Boolean,
	others: String,
	pulmonarhearingNormal: Boolean,
	pulmonarFinding: String
});

glicemiaArtherialPressure new Schema({
	description: String
});