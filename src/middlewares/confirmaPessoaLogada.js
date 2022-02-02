//verifica que tipo de usuario esta logado
function verificaPessoaLogada (req, res, next) {
    if (!req.session.dadosLogin) {
        return res.redirect("/login");
    } else if (req.session.dadosLogin != "undefined" && req.session.dadosLogin.tipoDeConta == 1) {
        //a conta de estabelecimento não pode ter acesso a rota então quando tenta entrar ela é redirecionada pro perfil
        return res.redirect("/usuarioEstabelecimento");
    }

    return next();
}

module.exports = verificaPessoaLogada;