const { exec } = require('child_process');
const path = require('path');
const os = require('os');

const personagem1 = {
    nome: "Kris",
    lutar: 2,
    agir: 3,
    sorte: 1,
    salvar: 4,
    defender: 0,
    pontos: 0,
    imagem: '../docs/Kris_Winner.png'
}

const personagem2 = {
    nome: "Susie",
    lutar: 4,
    agir: 1,
    sorte: 2,
    salvar: 0,
    defender: 3,
    pontos: 0,
    imagem: '../docs/Susie_Winner.png'
}

const personagem3 = {
    nome: "Ralsei",
    lutar: 0,
    agir: 2,
    sorte: 1,
    salvar: 3,
    defender: 4,
    pontos: 0,
    imagem: '../docs/Ralsei_Winner.png'
}

const personagem4 = {
    nome: "Noelle",
    lutar: 1,
    agir: 4,
    sorte: 0,
    salvar: 2,
    defender: 3,
    pontos: 0,
    imagem: '../docs/Noelle_Winner.png'
}

const personagem5 = {
    nome: "Bardly",
    lutar: 3,
    agir: 2,
    sorte: 4,
    salvar: 1,
    defender: 0,
    pontos: 0,
    imagem: '../docs/BardLy_Winner.png'
}

const personagens = [personagem1, personagem2, personagem3, personagem4, personagem5];

async function roleDado() {
    return Math.floor(Math.random() * 6) + 1;
}

async function randomizarBloco() {
    let random = Math.floor(Math.random() * 4) + 1
    let result

    switch (true) {
        case random == 1:
            result = "RETA"
            break;
        case random == 2:
            result = "CURVA"
            break;
        case random == 3:
            result = "CONFRONTO"
            break;
        case random == 4:
            result = "UP BOX"
            break;
        default:
            debugger;
    }

    return result;
}

async function pegarItemBau(personagem, adiversario, valor) {

    switch (true) {
        case valor == 1 || valor == 2:
            console.log(`\n${personagem.nome} pegou o OVO\nNada acontece`);
            break;
        case valor == 3 || valor == 4:
            console.log(`\n${personagem.nome} pegou o CAUDA DE JAVIL\n${personagem.nome} recebe +1 em LUTA e DEFESA`);
            personagem.lutar++
            personagem.defender++
            break;
        case valor == 5 || valor == 6:
            if (adiversario.pontos > 0) {
                console.log(`\n${personagem.nome} pegou o NEGOCIADOR\n${personagem.nome} rouba 1 ponto de ${adiversario.nome}`);
                personagem.pontos++
                adiversario.pontos--
            } else {
                console.log(`\n${personagem.nome} pegou o NEGOCIADOR\n${personagem.nome} tenta rouba 1 ponto de ${adiversario.nome}\nEntretanto ${adiversario.nome} não tem pontos para ser roubado`);
            }
            break;
        case valor == 7 || valor == 8:
            if (adiversario.pontos > 0) {
                console.log(`\n${personagem.nome} pegou o MACHADO DA JUSTIÇA\n${adiversario.nome} recebe -1 ponto`);
                adiversario.pontos--
            } else {
                console.log(`\n${personagem.nome} pegou o MACHADO DA JUSTIÇA\nEntretanto desiste de atacar o ${adiversario.nome} por pena`);
            }
            break;
        case valor == 9 || valor == 10:
            console.log(`\n${personagem.nome} pegou o CRISTAL DA SOMBRA\n${personagem.nome} recebe +1 ponto`);
            personagem.pontos++
            break;
        default:
            debugger;
    }

}

async function exibirResultados(jogador, acao, resultado, dado, atributo) {
    console.log(`${jogador} '${acao}' = ${resultado} <- [${dado}]1d6 + ${atributo}`);
}

async function jogoMotores(kart1, kart2) {

    // variaveis dos tipos de pistas na corrida
    let blocos = []
    
    for(let i = 1; i <= 6; i++) {

        // memoriza a pista
        let pista = await randomizarBloco()

        // armazena a pista na corrida
        blocos.push(pista);        

    }

    for(let volta = 1; volta <= 3; volta++) {
        for(let i = 0; i <= 5; i++) {

            console.log(`\n==========================\n\n${volta}º volta, na pista ${blocos[i]}\n`);

            let resultadoDado1 = await roleDado();
            let resultadoDado2 = await roleDado();

            let totalRound1 = 0;
            let totalRound2 = 0;

            if(blocos[i] === "RETA") {

                totalRound1 = resultadoDado1 + kart1.agir
                exibirResultados(kart1.nome, "agir", totalRound1, resultadoDado1, kart1.agir)
                totalRound2 = resultadoDado2 + kart2.agir
                exibirResultados(kart2.nome, "agir", totalRound2, resultadoDado2, kart2.agir)

                if (totalRound1 > totalRound2) {
                    console.log(`\n${kart1.nome} assuma a liderança \n${kart1.nome} recebe +1 ponto`)
                    kart1.pontos++
                } else if (totalRound1 < totalRound2) {
                    console.log(`\n${kart2.nome} assuma a liderança \n${kart2.nome} recebe +1 ponto`)
                    kart2.pontos++
                } else {
                    console.log(`\n${kart1.nome} e ${kart2.nome} mantem a velocidade\nNinguém recebe pontos`)
                }

            } else if(blocos[i] === "CURVA") {

                totalRound1 = resultadoDado1 + kart1.salvar
                exibirResultados(kart1.nome, "salvar", totalRound1, resultadoDado1, kart1.salvar)
                totalRound2 = resultadoDado2 + kart2.salvar
                exibirResultados(kart2.nome, "salvar", totalRound2, resultadoDado2, kart2.salvar)

                if (totalRound1 >= 5 && totalRound2 >= 5) {
                    console.log(`\n${kart1.nome} e ${kart2.nome} poupa na curva\nAmbos recebem +1 ponto`)
                    kart1.pontos++
                    kart2.pontos++
                } else if (totalRound1 >= 5 || totalRound2 >= 5) {
                    if (totalRound1 >= 5) {
                        console.log(`\n${kart1.nome} poupa tempo\n${kart1.nome} recebe +1 ponto`)
                        kart1.pontos++
                    } else if (totalRound2 >= 5) {
                        console.log(`\n${kart2.nome} poupa tempo\n${kart2.nome} recebe +1 ponto`)
                        kart2.pontos++
                    }
                } else {
                    console.log(`\n${kart1.nome} e ${kart2.nome} não pouparam\nAmbos não recebem ponto`)
                }

            } else if(blocos[i] === "CONFRONTO") {

                if (kart1.pontos > kart2.pontos) {

                    console.log(`${kart2.nome} vai atacar ${kart1.nome}\n`)

                    totalRound1 = resultadoDado1 + kart1.defender
                    exibirResultados(kart1.nome, "defender", totalRound1, resultadoDado1, kart1.defender)
                    totalRound2 = resultadoDado2 + kart2.lutar
                    exibirResultados(kart2.nome, "lutar", totalRound2, resultadoDado2, kart2.lutar)

                    if (kart1.pontos > 0 && totalRound1 < totalRound2) {
                        console.log(`\n${kart2.nome} acerta um ataque em ${kart1.nome}\n${kart1.nome} recebe -1 ponto`)
                        kart1.pontos--
                    } else if (kart1.pontos > 0 && totalRound1 > totalRound2) {
                        console.log(`\n${kart1.nome} defende o ataque de ${kart2.nome}\n${kart1.nome} não recebe -1 ponto`)
                    }

                } else if (kart1.pontos < kart2.pontos) {

                    console.log(`${kart1.nome} vai atacar ${kart2.nome}\n`)

                    totalRound1 = resultadoDado1 + kart1.lutar
                    exibirResultados(kart1.nome, "lutar", totalRound1, resultadoDado1, kart1.lutar)
                    totalRound2 = resultadoDado2 + kart2.defender
                    exibirResultados(kart2.nome, "defender", totalRound2, resultadoDado2, kart2.defender)

                    if (kart2.pontos > 0 && totalRound2 <= totalRound1) {
                        console.log(`\n${kart1.nome} acerta um ataque em ${kart2.nome}\n${kart2.nome} recebe -1 ponto`)
                        kart2.pontos--
                    } else {
                        console.log(`\n${kart2.nome} defende o ataque de ${kart1.nome}\n${kart2.nome} não recebe -1 ponto`)
                    }

                } else {

                    console.log(`ambos vão se atacar\n`)

                    totalRound1 = resultadoDado1 + kart1.lutar
                    exibirResultados(kart1.nome, "lutar", totalRound1, resultadoDado1, kart1.lutar)
                    totalRound2 = resultadoDado2 + kart2.lutar
                    exibirResultados(kart2.nome, "lutar", totalRound2, resultadoDado2, kart2.lutar)

                    if (totalRound1 > totalRound2) {
                        console.log(`\n${kart1.nome} acerta um ataque em ${kart2.nome}`)
                        if (kart2.pontos > 0) {
                            console.log(`${kart2.nome} recebe -1 ponto e ${kart1.nome} recebe +1 ponto`)
                            kart1.pontos++
                            kart2.pontos--
                            continue
                        }
                        console.log(`${kart1.nome} recebe +1 ponto`)
                        kart1.pontos++
                    } else if (totalRound1 < totalRound2) {
                        console.log(`\n${kart2.nome} acerta um ataque em ${kart1.nome}`)
                        if (kart1.pontos > 0) {
                            console.log(`${kart1.nome} recebe -1 ponto e ${kart2.nome} recebe +1 ponto`)
                            kart1.pontos--
                            kart2.pontos++
                            continue
                        }
                        console.log(`${kart2.nome} recebe +1 ponto`)
                        kart2.pontos++
                    } else {
                        console.log(`\n${kart1.nome} acerta um ataque em ${kart2.nome}\nEntretanto ${kart2.nome} acerta um ataque em ${kart1.nome}`)
                        if (kart1.pontos > 0) {
                            console.log(`${kart1.nome} e ${kart2.nome} recebe -1 ponto`)
                            kart1.pontos--
                            kart2.pontos--
                            continue
                        }
                        console.log(`Ambos mantem a verlocidade`)
                    }

                }

            } else if(blocos[i] === "UP BOX") {
                let random = Math.floor(Math.random() * 4)

                if (random == 0) {

                    console.log(`Ninguém consegui pegar o baú`)

                } else if (random == 1) {

                    console.log(`${kart1.nome} consegui pegar um baú\n`)

                    totalRound1 = resultadoDado1 + kart1.sorte
                    exibirResultados(kart1.nome, "sorte", totalRound1, resultadoDado1, kart1.sorte)

                    pegarItemBau(kart1, kart2, totalRound1)

                } else if (random == 2) {

                    console.log(`${kart2.nome} consegui pegar um baú\n`)

                    totalRound2 = resultadoDado2 + kart2.sorte
                    exibirResultados(kart2.nome, "sorte", totalRound2, resultadoDado2, kart2.sorte)

                    pegarItemBau(kart2, kart1, totalRound2)

                } else if (random == 3) {

                    console.log(`${kart1.nome} e ${kart2.nome} conseguem pegar um baú cada`)

                    totalRound1 = resultadoDado1 + kart1.sorte
                    exibirResultados(kart1.nome, "sorte", totalRound1, resultadoDado1, kart1.sorte)
                    totalRound2 = resultadoDado2 + kart2.sorte
                    exibirResultados(kart2.nome, "sorte", totalRound2, resultadoDado2, kart2.sorte)
                    
                    pegarItemBau(kart1, kart2, totalRound1)
                    pegarItemBau(kart2, kart1, totalRound2)

                }
            }

        }
        
        console.log(`\n==========================\n\n${volta}º VOLTA COMPLETA`);

    }
}

async function exibirGanhador(url) {
    const imagePath = path.join(__dirname, `${url}`);

    const platform = process.platform;

    if (platform === 'win32') {
        exec(`start "" "${imagePath}"`);
    } else if (platform === 'darwin') {
        exec(`open "${imagePath}"`);
    } else if (platform === 'linux') {
        exec(`xdg-open "${imagePath}"`);
    }
}

async function declararCampiao(kart1, kart2) {
    
    console.log(`\n==========================\n`);
    
    // exibir os pontos
    console.log(`${kart1.nome}: ${kart1.pontos} points`);
    console.log(`${kart2.nome}: ${kart2.pontos} points\n`);

    // se o jogador 1 tiver mais pontos
    if (kart1.pontos > kart2.pontos) {

        console.log(`${kart1.nome} GANHOU, MEUS PARABENS`);
        exibirGanhador(kart1.imagem)

    // se o jogador 2 tiver mais pontos
    } else if (kart1.pontos < kart2.pontos) {

        console.log(`${kart2.nome} GANHOU, MEUS PARABENS`);
        exibirGanhador(kart2.imagem)

    // se o jogadores empatarem
    } else {

        console.log("EMPATE, NÃO HOUVE GANHADORES")

    }
}

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function listarPersonagens() {
    console.log("\nEscolha seu personagem:");
    personagens.forEach((p, i) => {
        console.log(`${i + 1}. ${p.nome}`);
    });
}

function escolherPersonagem(jogador, excluido = null) {
    return new Promise((resolve) => {
        function perguntar() {
            listarPersonagens();
            readline.question(`\n${jogador}, digite o número do personagem: `, (res) => {
                const escolha = parseInt(res) - 1;
                if (
                    escolha >= 0 &&
                    escolha < personagens.length &&
                    personagens[escolha] !== excluido
                ) {
                    resolve(personagens[escolha]);
                } else if (personagens[escolha] === excluido) {
                    console.log("❌ Este personagem já foi escolhido. Escolha outro.");
                    perguntar();
                } else {
                    console.log("❌ Escolha inválida.");
                    perguntar();
                }
            });
        }
        perguntar();
    });
}

(async function main() {
    // texto pré-corrida
    console.log("⬛⬜⬛⬜⬛⬜⬛\n  PRÉ-CORRIDA\n⬜⬛⬜⬛⬜⬛⬜");

    // Etapa de escolha
    const jogador1 = await escolherPersonagem("Jogador 1");
    const jogador2 = await escolherPersonagem("Jogador 2", jogador1);
    
    // texto corrida
    console.log("\n🟥🟥🟥🟩\n CORRIDA\n🟥🟥🟥🟩");

    // texto de inicio de corrida
    console.log(`\n${jogador1.nome} vs ${jogador2.nome} em disputa...`);

    // inicio de corrida
    await jogoMotores(jogador1, jogador2);

    readline.close();
    
    // exibir os ganhadores
    await declararCampiao(jogador1, jogador2);
})();
