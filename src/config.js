const { PORT, HOST, JOB_INTERVAL } = process.env;

module.exports = Object.freeze({
	server: {
		port: PORT ? parseInt(PORT, 10) : 80,
		host: HOST || "0.0.0.0",
	},

	job: {
		interval: JOB_INTERVAL ? parseInt(JOB_INTERVAL, 10) : 1000,
	},
});
