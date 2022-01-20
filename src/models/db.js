const Sequelize = require("sequelize");
<<<<<<< HEAD
const sequelize = new Sequelize("qual_e_a_boa", "root", "kbbtyh2532", {
=======
const sequelize = new Sequelize("qual_e_a_boa", "user", "senha", {
>>>>>>> 2c331f566cc4411305b3d1d9353396fea9e97341
    host: "localhost",
    dialect: "mysql"
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}