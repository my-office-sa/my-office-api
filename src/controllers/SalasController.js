import ConexaoMySql from "../database/ConexaoMySql.js";

class SalasController {
  async adicionar(req, resp) {
    try {
      const usuarioLogado = req.headers["x-usuario"];

      const novaSala = req.body;

      if (
        !novaSala.cep ||
        !novaSala.estado ||
        !novaSala.cidade ||
        !novaSala.bairro ||
        !novaSala.rua ||
        !novaSala.numero ||
        !novaSala.preco ||
        !novaSala.capacidade ||
        !novaSala.descricao ||
        !novaSala.imagem
      ) {
        resp.status(400).send("Preencha todos os campos obrigatórios.");
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const comandoSql =
        "INSERT INTO sala (cep, estado, cidade, bairro, rua, numero, preco, capacidade, descricao, imagem, usuario_id,latitude,longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)";

      const [resultado] = await conexao.execute(comandoSql, [
        novaSala.cep,
        novaSala.estado,
        novaSala.cidade,
        novaSala.bairro,
        novaSala.rua,
        novaSala.numero,
        novaSala.preco,
        novaSala.capacidade,
        novaSala.descricao,
        novaSala.imagem,
        usuarioLogado,
        novaSala.latitude || null,
        novaSala.longitude || null,
      ]);

      resp.send(resultado);
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  async listar(req, resp) {
    try {
      const conexao = await new ConexaoMySql().getConexao();
      const comandoSql = "SELECT * FROM sala ";

      const [resultado] = await conexao.execute(comandoSql);
      resp.send(
        resultado.map((u) => {
          delete u.usuario_id;
          return u;
        })
      );
    } catch (error) {
      resp.status(500).send(error);
    }
  }
  async listarMinhasSalas(req, resp) {
    try {
      const usuarioLogado = req.headers["x-usuario"];
      const conexao = await new ConexaoMySql().getConexao();
      const comandoSql = "SELECT * FROM sala WHERE usuario_id = ?";

      const [resultado] = await conexao.execute(comandoSql, [usuarioLogado]);
      resp.send(resultado);
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  async atualizar(req, resp) {
    try {
      const editarSala = req.body;

      if (
        !editarSala.cep ||
        !editarSala.estado ||
        !editarSala.cidade ||
        !editarSala.bairro ||
        !editarSala.rua ||
        !editarSala.numero ||
        !editarSala.preco ||
        !editarSala.capacidade ||
        !editarSala.descricao ||
        !editarSala.imagem
      ) {
        resp.status(400).send("Nem um valor pode ser em branco");
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const comandoSql =
        "UPDATE sala SET cep = ?, estado = ?, cidade = ?, bairro = ?, rua = ?, numero = ?, preco = ?, capadidade =?, descricao = ? , imagem = ?, latitude = ?, longitude = ? WHERE id_sala = ?";

      const [resultado] = await conexao.execute(comandoSql, [
        editarSala.cep,
        editarSala.estado,
        editarSala.cidade,
        editarSala.bairro,
        editarSala.rua,
        editarSala.numero,
        editarSala.preco,
        editarSala.capacidade,
        editarSala.descricao,
        editarSala.imagem,
        editarSala.latitude || null,
        editarSala.longitude || null,
      ]);

      resp.send(resultado);
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  async excluir(req, resp) {
    try {
      const conexao = await new ConexaoMySql().getConexao();

      const comandoSql = "DELETE FROM sala WHERE id_sala = ?";
      const [resultado] = await conexao.execute(comandoSql, [+req.params.id]);

      resp.send(resultado);
    } catch (error) {
      resp.status(500).send(error);
    }
  }
}

export default SalasController;
