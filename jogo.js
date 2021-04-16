const sprites = new Image();
sprites.src = './sprites.png';

var frames = 0;

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

var somDeColisao = new Audio();
somDeColisao.src = './efeitos-sonoros/hit.wav';

function colisao(bird, chao){
    if ((bird >= chao - flappyBird.altura) || (bird < 1)){
        return true;
    } else {
        return false;
    }
}

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
    pula(){
        flappyBird.velocidade = - flappyBird.pulo;
    },
    atualiza: function(){
        if (colisao(flappyBird.yDraw, chao.yDraw)){
             somDeColisao.play();
             mudaParaTela(telas.fimDeJogo);
             console.log("ydraw " + flappyBird.yDraw);
             console.log("velocidade " + flappyBird.velocidade);
             return;
        };
        flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade; 
        flappyBird.yDraw = flappyBird.yDraw + flappyBird.velocidade;
        
        flappyBird.movimentoDasAsas();
        
    },
    movimentoDasAsas: function(){
        let intervaloDeFrames = 13;
        let bateAsas = frames % intervaloDeFrames;
        console.log(bateAsas);

        if (bateAsas == 0){
            if (flappyBird.spriteY == 0){
                flappyBird.spriteY = 26;
                console.log(flappyBird.spriteY);    
            } else {
                if (flappyBird.spriteY == 26){
                    flappyBird.spriteY = 52; 
                    console.log(flappyBird.spriteY);    
                } else {
                    flappyBird.spriteY = 0;
                    console.log(flappyBird.spriteY);    
                }
            } 
        }
    },
    desenha: function(){
        contexto.drawImage(
            sprites,
            flappyBird.spriteX, flappyBird.spriteY,
            flappyBird.largura, flappyBird.altura,
            flappyBird.xDraw, flappyBird.yDraw,
            flappyBird.largura, flappyBird.altura,
        );
    }
}

const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 111,
    xDraw: 0,
    yDraw: 369,
    atualiza: function(){
        if (chao.xDraw > -112){
            chao.xDraw--;
        } else{
            chao.xDraw = 0;
        }
    },
    desenha: function(){
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

}

const fundo = {
    spriteX: 391,
    spriteY: 0,
    largura: 276,
    altura: 124,
    xDraw: 0,
    yDraw: 245,
    desenha: function(){
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0,0, canvas.width, canvas.height);
        
        contexto.drawImage(
            sprites,
            fundo.spriteX, fundo.spriteY,
            fundo.largura, fundo.altura,
            fundo.xDraw, fundo.yDraw,
            fundo.largura + 45, fundo.altura,
        );
    }

}

const telaDeInicio = {
    spriteX: 134,
    spriteY: 0,
    largura: 175,
    altura: 153,
    xDraw: 73,
    yDraw: 50,
    desenha: function(){
            contexto.drawImage(
            sprites,
            telaDeInicio.spriteX, telaDeInicio.spriteY,
            telaDeInicio.largura, telaDeInicio.altura,
            telaDeInicio.xDraw, telaDeInicio.yDraw,
            telaDeInicio.largura, telaDeInicio.altura,
        );
        flappyBird.movimentoDasAsas();
    }

}

const telaGameOver = {
    spriteX: 134,
    spriteY: 154,
    largura: 227,
    altura: 202,
    xDraw: 47,
    yDraw: 52,
    desenha: function(){
            contexto.drawImage(
            sprites,
            telaGameOver.spriteX, telaGameOver.spriteY,
            telaGameOver.largura, telaGameOver.altura,
            telaGameOver.xDraw, telaGameOver.yDraw,
            telaGameOver.largura, telaGameOver.altura,
        );
    }

}


//
// [TELAS]
//
let telaAtiva = {};
function mudaParaTela(novatela){
    telaAtiva = novatela;
}


const telas = {
    inicio: {
        desenha() {
        fundo.desenha();
        chao.desenha();
        flappyBird.desenha();
        telaDeInicio.desenha();
        
        },
        click(){
            mudaParaTela(telasJogo); 
        },
        atualiza() {
            chao.atualiza();
        }
    },
    fimDeJogo: {
        desenha(){
            fundo.desenha();
            chao.desenha();
            telaGameOver.desenha();
            flappyBird.desenha();
        },
        click(){
            flappyBird.yDraw = 50;
            flappyBird.gravidade = 0.25;
            flappyBird.velocidade = 0;
            flappyBird.pulo = 4.6;
            mudaParaTela(telas.inicio); 
        },
        atualiza() {

        }
    }
}


const telasJogo = {
    desenha(){
        fundo.desenha();
        chao.desenha();
        flappyBird.desenha();
    },
    click(){
        flappyBird.pula();
    },
    atualiza(){
        flappyBird.atualiza();
        chao.atualiza();
    }
}


function loop(){
    telaAtiva.desenha();
    telaAtiva.atualiza();
    frames++;
    requestAnimationFrame(loop);
}

mudaParaTela(telas.inicio);
loop();

var total = 100;
var menos = 10;

function jogar(){
    if(telaAtiva.click) {
       telaAtiva.click();
    }
}

//coment