"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_graphql_1 = __importDefault(require("express-graphql"));
var schema_1 = require("./schema/schema");
var app = express_1.default();
app.use('/graphql', express_graphql_1.default({
    graphiql: true,
    schema: schema_1.schema
}));
app.listen(4000, function () { return console.log("Listening on port 4000"); });
