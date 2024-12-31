/* eslint-disable no-unused-vars */
import express from "express";
import db from "./config/dbConnect.js";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import pageNotFoundHandler from "./middlewares/pageNotFoundHandler.js";

db.on("error", console.log.bind(console, "Erro de conexão"));
db.once("open", () => {
  console.log("conexão com o banco feita com sucesso");
});

const app = express();
app.use(express.json());
routes(app);

app.use(pageNotFoundHandler);

//registra o middleware para tratamento de erros
app.use(errorHandler);

export default app;