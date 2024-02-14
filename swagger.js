import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./src/routers/users.js"];

swaggerAutogen(outputFile, endpointsFiles);
