/* eslint-disable no-unused-vars */
import NaoEncontrado from "../erros/NaoEncontrado.js";

function pageNotFoundHandler(req, res, next) {
  const erro404 = new NaoEncontrado();
  next(erro404);
}

export default pageNotFoundHandler;