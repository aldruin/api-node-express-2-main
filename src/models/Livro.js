/* eslint-disable no-unused-vars */
import mongoose from "mongoose";
import autopopulate from "mongoose-autopopulate";

const livroSchema = new mongoose.Schema(
  {
    id: { type: String },
    titulo: {
      type: String,
      required: [true, "O titulo do livro é obrigatório"]
    },
    autor: {
      // exemplo de autor como atributo
      type: mongoose.Schema.Types.ObjectId,
      ref: "autores",
      required: [true, "O autor é obrigatório"],
      autopopulate: { select: "nome" }
    },
    editora: {
      type: String,
      required: [true, "A editora é obrigatória"],
      //exemplo de validação usando enum
      enum: {
        values: ["Casa do cócido", "Alura"],
        message: "A editora {VALUE} não é um valor permitido"
      }
    },
    numeroPaginas: {
      type: Number,
      //exemplo de validação personalizada
      // validate: {
      //   validator: (valor) => {
      //     return valor >= 10 && valor <= 5000;
      //   },
      //   message: "O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}"
      // },

      //exemplo de validação usando min e max (int)
      min: [10, "O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}"],
      max: [5000, "O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}"]
    }
  }
);

livroSchema.plugin(autopopulate);
const livros = mongoose.model("livros", livroSchema);

export default livros;