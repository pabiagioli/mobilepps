var mongoose = require("mongoose");

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
