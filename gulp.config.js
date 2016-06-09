module.exports = function() {
	var app	 = './src/app/';
	var appJS = app + 'js/';
	var temp = './.tmp/';

	// this object has all our configuration settings
	var config = {
		/* file paths */
		app: app,
		appJS: appJS,
		css: temp + 'styles.css',
		index: app + 'index.html',
		js: [
			appJS + '**/*.module.js',
			appJS + '**/*.js',
			'!' + appJS + '**/*.spec.js'
		],
		sass : app + 'scss/styles.scss',
		temp: temp,

		/* Bower and NPM locations */
		bower: {
			json: require('./bower.json'),
			directory: './bower_components',
			ignorePath: '../..'
		}
	}

	config.getWiredepOptions = function(){
		return options = {
			bowerJson: config.bower.json,
			directory: config.bower.directory,
			ignorePath: config.bower.ignorePath
		};
	};

	return config;
};