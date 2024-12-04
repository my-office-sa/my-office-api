import cors from "cors";
import express from "express";
import UsuariosController from "./controllers/UsuariosController.js";
import AutenticacaoController from "./controllers/AutenticacaoController.js";
import SalasController from "./controllers/SalasController.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const _usuariosController = new UsuariosController();
const _autenticacaoController = new AutenticacaoController();
const _salasController = new SalasController();

// rotas públicas
app.post("/login", _autenticacaoController.login);
app.post("/usuarios", _usuariosController.adicionar);
app.get("/salas", _salasController.listar);

// Midleware de verificação de usuário logado
app.use((req, resp, next) => {
  const usuarioLogado = req.headers["x-usuario"];
  if (!usuarioLogado) {
    resp.status(401).send();
    return;
  }
  next();
});

// rotas privadas
//usuarios
app.get("/usuarios", _usuariosController.listar);
app.put("/usuarios", _usuariosController.atualizar);
app.delete("/usuarios/:id", _usuariosController.excluir);
//salas
app.get("/minhas-salas", _salasController.listarMinhasSalas);
app.post("/salas", _salasController.adicionar);
app.put("/salas", _salasController.atualizar);
app.delete("/salas/:id", _salasController.excluir);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API está rodando na porta ${port}`);
});
