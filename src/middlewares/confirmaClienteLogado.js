function verificaUsuarioLogado(req, res, next) {
    if (!req.session.dadosLogin) {
        return res.redirect("/login");
    }

    return next()
}

module.exports = verificaUsuarioLogado;