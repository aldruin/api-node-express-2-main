/* eslint-disable no-unused-vars */
import NaoEncontrado from "../erros/NaoEncontrado.js";
//importando autores do index para passar pelo validadorGlobal
import { autores } from "../models/index.js";

class AutorController {

  static listarAutores = async (req, res, next) => {
    try {
      const autoresResultado = autores.find();

      req.resultado = autoresResultado;

      next(); // chama o próximo middleware registrado na rota, que terá acesso à req.resultado

    } catch (erro) {
      next(erro);
    }
  };

  static listarAutorPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const autorResultado = await autores.findById(id);

      if (autorResultado !== null) {
        res.status(200).send(autorResultado);
      } else {
        next(new NaoEncontrado("Id do autor não localizado"));
      }
    } catch (erro) {
      next(erro);
    }
  };


  static cadastrarAutor = async (req, res, next) => {
    try {
      let autor = new autores(req.body);

      const autorResultado = await autor.save();

      res.status(201).send(autorResultado.toJSON());
    } catch (erro) {
      next(erro);
    }
  };


  static atualizarAutor = async (req, res, next) => {
    try {
      const id = req.params.id;

      const resultado = await autores.findByIdAndUpdate(id, { $set: req.body });

      if (resultado !== null) {
        res.status(200).send({ message: "Autor atualizado com sucesso" });
      } else {
        next(new NaoEncontrado("Id do autor não localizado"));
      }

    } catch (erro) {
      next(erro);
    }
  };

  static excluirAutor = async (req, res, next) => {
    try {
      const id = req.params.id;

      const autorResultado = await autores.findByIdAndDelete(id);

      if (autorResultado !== null) {
        res.status(200).send({ message: "Autor removido com sucesso" });
      } else {
        next(new NaoEncontrado("Id do autor não localizado"));
      }

    } catch (erro) {
      next(erro);
    }
  };


}

export default AutorController;