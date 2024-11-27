import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  port: process.env.MYSQL_HOST || "3306",
  user: process.env.MYSQL_HOST || "root",
  password: process.env.MYSQL_HOST || "senai",
  database: process.env.MYSQL_HOST || "aulas_api_senai",
};

class ConexaoMySql {
  async getConexao() {
    if (!ConexaoMySql.conexao) {
      ConexaoMySql.conexao = await mysql.createConnection(dbConfig);
    }
    return ConexaoMySql.conexao;
  }
}
export default ConexaoMySql;
