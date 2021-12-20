const Sequelize = require("sequelize");
const sequelize = new Sequelize("qual_e_a_boa", "root", "senha do seu mysql", {
    host: "localhost",
    dialect: "mysql"
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}