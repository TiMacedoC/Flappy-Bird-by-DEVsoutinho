const sprites = new Image();
sprites.src = './sprites.png';

var frames = 0;

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');
contexto.font = '50px serif';

var sounds = {
    somDeColisao: new Audio("./efeitos-sonoros/hit.wav"),
    somDePulo: new Audio('./efeitos-sonoros/pulo.wav')
}

// detecta colisão com o chão
function colisao(bird, chao) {
    if ((bird >= chao - flappyBird.altura) || (bird < 1)) {
        return true;
    } else {
        return false;
    }
}

// detecta colisão com os canos
function temColisaoComOFlappyBird(draw) {
    let canoChaoY = draw.y + canos.altura + canos.espaco;


    if (
        ((flappyBird.xDraw + flappyBird.largura) >= draw.x) &&
        ((flappyBird.yDraw < draw.y + canos.altura) ||
            ((flappyBird.yDraw + flappyBird.altura) > canoChaoY))
    ) {
        return true;
    } else {
        return false
    };
};

// função que define o intervalo em que as coisas vão acontecer. 
// Basta chamar a função passando o intervalo como parâmetro e verificar o retorno
function frameTime(interval) {
    let checkFrame = frames % interval;
    if (checkFrame == 0) {
        return true
    } else { return false };
};

const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 34,
    altura: 24,
    xDraw: 15,
    yDraw: 50,
    gravidade: 0.25,
    velocidade: 0,
    pulo: 4.6,
    pula() {
        flappyBird.velocidade = - flappyBird.pulo;
        sounds.somDePulo.play();
    },
    atualiza: function () {
        if (colisao(flappyBird.yDraw, chao.yDraw)) {
            sounds.somDeColisao.play();
            mudaParaTela(telas.fimDeJogo);
            return;
        };
        flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
        flappyBird.yDraw = flappyBird.yDraw + flappyBird.velocidade;

        flappyBird.movimentoDasAsas();

    },
    movimentoDasAsas: function () {
        if (frameTime(13)) {
            if (flappyBird.spriteY == 0) {
                flappyBird.spriteY = 26;
            } else {
                if (flappyBird.spriteY == 26) {
                    flappyBird.spriteY = 52;
                } else {
                    flappyBird.spriteY = 0;
                }
            }
        }
    },
    desenha: function () {
        contexto.drawImage(
            sprites,
            flappyBird.spriteX, flappyBird.spriteY,
            flappyBird.largura, flappyBird.altura,
            flappyBird.xDraw, flappyBird.yDraw,
            flappyBird.largura, flappyBird.altura,
        );
    }
};

const canos = {
    largura: 52,
    altura: 400,
    chao: {
        spriteX: 0,
        spriteY: 169,
    },
    ceu: {
        spriteX: 52,
        spriteY: 169,
    },
    espaco: 80,

    drawCanos: [],
    atualiza: function () {
        // para mudar a velocidade dos canos basta alterar o valor passado para a função FrameTime
        // Quanto maior o valor, mais lento o cano anda; tem que ser mexido junto com a frequencia
        if (frameTime(1)) {
            canos.drawCanos.forEach(function (draw) {
                draw.x--

                if (temColisaoComOFlappyBird(draw)) {
                    sounds.somDeColisao.play();
                    mudaParaTela(telas.fimDeJogo);
                    return;
                };

                // limpa o array para otimizar a memoria mantem sempre 5 canos na memoria
                if (draw.x + canos.largura <= 0) {
                    canos.drawCanos.shift();
                };
            });
        }
        // define a frequencia com que os canos aparecerão na tela
        if (frameTime(150)) {
            canos.drawCanos.push({
                x: canvas.width,
                //aqui é definida a altura do cano max:-360 e min: -145
                y: Math.floor(Math.random() * (-355 - -145 + 1)) - 145
            })
        };



    },
    desenha: function () {
        canos.drawCanos.forEach(function (draw) {


            contexto.drawImage(
                sprites,
                canos.ceu.spriteX, canos.ceu.spriteY,
                canos.largura, canos.altura,
                draw.x, draw.y,
                canos.largura, canos.altura,
            );

            const canoChaoY = draw.y + canos.altura + canos.espaco;

            contexto.drawImage(
                sprites,
                canos.chao.spriteX, canos.chao.spriteY,
                canos.largura, canos.altura,
                draw.x, canoChaoY,
                canos.largura, canos.altura,
            );
        })
        //canos.atualiza();
    },
};

const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 111,
    xDraw: 0,
    yDraw: 369,
    atualiza: function () {
        if (chao.xDraw > -112) {
            chao.xDraw--;
        } else {
            chao.xDraw = 0;
        }
    },
    desenha: function () {
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            chao.xDraw, chao.yDraw,
            chao.largura, chao.altura,
        );
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            (chao.xDraw + chao.largura), chao.yDraw,
            chao.largura, chao.altura,
        );
    }

};

const fundo = {
    spriteX: 391,
    spriteY: 0,
    largura: 276,
    altura: 124,
    xDraw: 0,
    yDraw: 245,
    desenha: function () {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height);

        contexto.drawImage(
            sprites,
            fundo.spriteX, fundo.spriteY,
            fundo.largura, fundo.altura,
            fundo.xDraw, fundo.yDraw,
            fundo.largura + 45, fundo.altura,
        );
    }

};

const placar = {
    pontos: 0,
    desenha: function () {

        contexto.font = '35px "VT323"';
        contexto.textAlign = 'right';
        contexto.fillStyle = 'white';
        contexto.fillText(placar.pontos, 310, 33);
    },

    atualiza: function () {
        if (frameTime(20)) {
            placar.pontos++;
        };
    }
}

const telaDeInicio = {
    spriteX: 134,
    spriteY: 0,
    largura: 175,
    altura: 153,
    xDraw: 73,
    yDraw: 50,
    desenha: function () {
        contexto.drawImage(
            sprites,
            telaDeInicio.spriteX, telaDeInicio.spriteY,
            telaDeInicio.largura, telaDeInicio.altura,
            telaDeInicio.xDraw, telaDeInicio.yDraw,
            telaDeInicio.largura, telaDeInicio.altura,
        );
        flappyBird.movimentoDasAsas();
    }

};

const telaGameOver = {
    spriteX: 134,
    spriteY: 154,
    largura: 227,
    altura: 202,
    xDraw: 47,
    yDraw: 52,
    desenha: function () {
        contexto.drawImage(
            sprites,
            telaGameOver.spriteX, telaGameOver.spriteY,
            telaGameOver.largura, telaGameOver.altura,
            telaGameOver.xDraw, telaGameOver.yDraw,
            telaGameOver.largura, telaGameOver.altura,
        );
    }

};

//
// [TELAS]
//
let telaAtiva = {};
function mudaParaTela(novatela) {
    telaAtiva = novatela;
}

const telas = {
    inicio: {
        desenha() {
            fundo.desenha();
            flappyBird.desenha();
            telaDeInicio.desenha();
            chao.desenha();
            placar.desenha();
        },
        click() {
            mudaParaTela(telasJogo);
        },
        atualiza() {

            chao.atualiza();
        }
    },
    fimDeJogo: {
        desenha() {
            fundo.desenha();
            canos.desenha();
            chao.desenha();
            telaGameOver.desenha();
            flappyBird.desenha();
            placar.desenha();
        },

        click() {
            flappyBird.yDraw = 50;
            flappyBird.gravidade = 0.25;
            flappyBird.velocidade = 0;
            flappyBird.pulo = 4.6;
            frames = 0;
            placar.pontos = 0;
            canos.drawCanos.splice(0, canos.drawCanos.length);
            mudaParaTela(telas.inicio);

        },
        atualiza() {

        }
    }
}

const telasJogo = {
    desenha() {
        fundo.desenha();
        canos.desenha();
        flappyBird.desenha();
        chao.desenha();
        placar.desenha();
    },
    click() {
        flappyBird.pula();
    },
    atualiza() {
        flappyBird.atualiza();
        canos.atualiza();
        chao.atualiza();
        placar.atualiza();
    }
}

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();
    frames++;
    requestAnimationFrame(loop);
}

mudaParaTela(telas.inicio);
loop();

// pra joga pressionando barra de espaço ou click do mouse 
window.addEventListener('keydown', (e) => {
    if (e.code === "Space") {
        if (telaAtiva.click) {
            telaAtiva.click();
        }
    };
});

window.addEventListener('click', function () {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});