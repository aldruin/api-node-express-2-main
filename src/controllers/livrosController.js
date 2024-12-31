/* eslint-disable no-unused-vars */
import { autores, livros } from "../models/index.js";
import RequisicaoIncorreta from "../erros/RequisicaoIncorreta.js";
import NaoEncontrado from "../erros/NaoEncontrado.js";

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {
      let { limite = 5, pagina = 1, ordenacao = "_id:-1" } = req.query;


      //separando a string ordenacao por : para que identifique as duas posições, _id e -1
      let [campoOrdenacao, ordem] = ordenacao.split(":");
      //garantindo que valores sejam numeros
      limite = parseInt(limite);
      pagina = parseInt(pagina);
      ordem = parseInt(ordem);

      if (limite > 0 && pagina > 0) {
        const livrosResultado = await livros.find()
          //sort para ordenação
          //skip para paginação, formula matematica numero da pagina -1 * limite, ex se for pagina 2, 2-1 = 1 * 5 = pular 5 livros e ir pagina 2
          .sort({ [campoOrdenacao]: ordem })
          .skip((pagina - 1) * limite)
          .limit(limite)
          .populate("autor")
          .exec();

        res.status(200).json(livrosResultado);
      } else {
        next(new RequisicaoIncorreta);
      }


    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultados = await livros.findById(id)
        .populate("autor", "nome")
        .exec();

      if (livroResultados !== null) {
        res.status(200).send(livroResultados);
      } else {
        next(new NaoEncontrado("Id do livro não localizado"));
      }

    } catch (erro) {
      next(erro);
    }
  };

  static cadastrarLivro = async (req, res, next) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (erro) {
      next(erro);
    }
  };

  static atualizarLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const resultado = await livros.findByIdAndUpdate(id, { $set: req.body });

      if (resultado !== null) {
        res.status(200).send({ message: "Livro atualizado com sucesso" });
      } else {
        next(new NaoEncontrado("Id do livro não localizado"));
      }

    } catch (erro) {
      next(erro);
    }
  };

  static excluirLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const resultado = await livros.findByIdAndDelete(id);

      if (resultado !== null) {
        res.status(200).send({ message: "Livro removido com sucesso" });
      } else {
        next(new NaoEncontrado("Id do livro não localizado"));
      }

    } catch (erro) {
      next(erro);
    }
  };

  // static listarLivroPorEditora = async (req, res, next) => {
  //   try {
  //     const editora = req.query.editora;

  //     const livrosResultado = await livros.find({ "editora": editora });

  //     res.status(200).send(livrosResultado);
  //   } catch (erro) {
  //     next(erro);
  //   }
  // };

  static listarLivroPorFiltro = async (req, res, next) => {
    try {
      const { editora, titulo, minPaginas, maxPaginas, nomeAutor } = req.query;

      const busca = {};

      // Filtrar por editora (case insensitive)
      if (editora) busca.editora = { $regex: editora, $options: "i" };

      // Filtrar por título (case insensitive)
      if (titulo) busca.titulo = { $regex: titulo, $options: "i" };

      // Filtrar por número de páginas (intervalo)
      if (minPaginas || maxPaginas) {
        busca.numeroPaginas = {};
        if (minPaginas) busca.numeroPaginas.$gte = (minPaginas);

        if (maxPaginas) busca.numeroPaginas.$lte = (maxPaginas);
      }

      if (nomeAutor) {
        const autor = await autores.findOne({ nome: { $regex: nomeAutor, $options: "i" } });

        if (autor == null) {
          return res.status(200).send([]);
        }

        busca.autor = autor._id;
      }

      console.log(busca);
      const livrosResultado = await livros
        .find(busca)
        //populate para exibir nome do autor e atributos junto com o id do autor na propriedade livros
        .populate("autor");

      res.status(200).send(livrosResultado);
    } catch (erro) {
      next(erro);
    }
  };



}

export default LivroController;