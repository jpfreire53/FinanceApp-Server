require("dotenv").config();

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

const database = require("./src/database/Database");
const routes = require("./src/routes/routes");

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(routes);

database.syncDatabase();

let port = 8080;
app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`)
})