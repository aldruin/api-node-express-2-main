import mongoose from "mongoose";
//exemplo de validação global, erros em campos em branco de propriedades do tipo String
mongoose.Schema.Types.String.set("validate", {
  validator: (valor) => valor.trim() !== "",
  message: ({ path }) => `O campo ${path} foi fornecido em branco.`
});