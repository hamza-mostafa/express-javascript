module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '5.0.3',
      skipMD5: true,
    },
    instance: {
      dbName: process.env.TEST_MONGODB_NAME,
    },
    autoStart: false,
  },
};
