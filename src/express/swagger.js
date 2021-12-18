const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/index.helper.js'];

swaggerAutogen(outputFile, endpointsFiles);
