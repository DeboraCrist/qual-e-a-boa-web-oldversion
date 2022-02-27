const validaIdade = (anoDeNascimento) => {
    var d = new Date,
        ano_atual = d.getFullYear(),
        mes_atual = d.getMonth() + 1,
        dia_atual = d.getDate(),

        anoDeNasc = anoDeNascimento.slice(0, 4);
        mesDeNascimento = anoDeNascimento.slice(8, 10);
        diaDeNascimento = anoDeNascimento.slice(5, 7);

        quantos_anos = ano_atual - anoDeNasc;

    if (mes_atual <mesDeNascimento || mes_atual ==mesDeNascimento && dia_atual < diaDeNascimento) {
        quantos_anos--;
    }

    document.getElementById("idade").value = quantos_anos < 0 ? 0 : quantos_anos;
}