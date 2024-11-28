import ConexaoMySql from "../database/ConexaoMySql.js";

class UsuariosController {
  async adicionar(req, resp) {
    try {
      const novoUsuario = req.body;

      if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.senha ||!novoUsuario.celular) {
        resp
          .status(400)
          .send("Os campos nome, email, celular e senha são obrigatórios.");
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const comandoSql =
        "INSERT INTO usuarios (nome, email, celular, senha) VALUES (?, ?, ?, md5(?))";

      const [resultado] = await conexao.execute(comandoSql, [
        novoUsuario.nome,
        novoUsuario.email,
        novoUsuario.celular,
        novoUsuario.senha,
      ]);

      resp.send(resultado);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        resp.status(400).send("Email já cadastrado.");
        return;
      }
      resp.status(500).send(error);
    }
  }

  async listar(req, resp) {
    try {
      const usuarioLogado = req.headers["x-usuario"];
      console.log(usuarioLogado);

      const conexao = await new ConexaoMySql().getConexao();
      const comandoSql = "SELECT * FROM usuario WHERE nome LIKE ?";

      const filtro = req.query.filtro || "";
      const [resultado] = await conexao.execute(comandoSql, [`%${filtro}%`]);
      resp.send(
        resultado.map((u) => {
          delete u.senha;
          return u;
        })
      );
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  async atualizar(req, resp) {
    try {
      const usuarioEditar = req.body;

      if (!usuarioEditar.id || !usuarioEditar.nome ||!usuarioEditar.celular || !usuarioEditar.email) {
        resp.status(400).send("Os campos id, nome, celular e email são obrigatórios.");
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const comandoSql =
        "UPDATE usuario SET nome = ?, email = ?, celular = ?, foto = ? WHERE id_usuario = ?";

      const [resultado] = await conexao.execute(comandoSql, [
        usuarioEditar.nome,
        usuarioEditar.email,
        usuarioEditar.celular,
        usuarioEditar.foto || null,
        usuarioEditar.id,
      ]);

      resp.send(resultado);
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  async excluir(req, resp) {
    try {
      const conexao = await new ConexaoMySql().getConexao();

      const comandoSql = "DELETE FROM usuario WHERE id_usuario = ?";
      const [resultado] = await conexao.execute(comandoSql, [+req.params.id]);

      resp.send(resultado);
    } catch (error) {
      resp.status(500).send(error);
    }
  }
}

export default UsuariosController;
