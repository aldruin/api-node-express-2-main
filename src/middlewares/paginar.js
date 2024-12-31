/* eslint-disable no-unused-vars */
import RequisicaoIncorreta from "../erros/RequisicaoIncorreta.js";

async function paginar(req, res, next) {
  try {
    let { limite = 5, pagina = 1, ordenacao = "_id:-1" } = req.query;

    //separando a string ordenacao por : para que identifique as duas posições, _id e -1
    let [campoOrdenacao, ordem] = ordenacao.split(":");
    //garantindo que valores sejam numeros
    limite = parseInt(limite);
    pagina = parseInt(pagina);
    ordem = parseInt(ordem);

    const resultado = req.resultado;

    if (limite > 0 && pagina > 0) {
      const resultadoPaginado = await resultado.find()
        //sort para ordenação
        //skip para paginação, formula matematica numero da pagina -1 * limite, ex se for pagina 2, 2-1 = 1 * 5 = pular 5 livros e ir pagina 2
        .sort({ [campoOrdenacao]: ordem })
        .skip((pagina - 1) * limite)
        .limit(limite)
        .exec();

      res.status(200).json(resultadoPaginado);
    } else {
      next(new RequisicaoIncorreta());
    }
  } catch (erro) {
    next(erro);
  }
}

export default paginar;