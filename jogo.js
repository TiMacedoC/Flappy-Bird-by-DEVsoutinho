const sprites = new Image();
sprites.src = './sprites.png';

var frames = 0;

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

var sounds= {
    somDeColisao: new Audio("./efeitos-sonoros/hit.wav"),
    somDePulo: new Audio('./efeitos-sonoros/pulo.wav')
}

function colisao(bird, chao){
    if ((bird >= chao - flappyBird.altura) || (bird < 1)){
        return true;
    } else {
        return false;
    }
}

function frameTime(interval){
    let intervaloDeFrames = interval;
    var setFrameInterval = frames % intervaloDeFrames;
    return setFrameInterval;
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
        sounds.somDePulo.play();
    },
    atualiza: function(){
        if (colisao(flappyBird.yDraw, chao.yDraw)){
            sounds.somDeColisao.play();
            mudaParaTela(telas.fimDeJogo);
            return;
        };
        flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade; 
        flappyBird.yDraw = flappyBird.yDraw + flappyBird.velocidade;
        
        flappyBird.movimentoDasAsas();
        
    },
    movimentoDasAsas: function(){
        let bateAsas = frameTime(13);

        if (bateAsas == 0){
            if (flappyBird.spriteY == 0){
                flappyBird.spriteY = 26;
            } else {
                if (flappyBird.spriteY == 26){
                    flappyBird.spriteY = 52; 
                } else {
                    flappyBird.spriteY = 0;
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

    const canos = {
    largura: 52,
    altura: 400,
    chao:{
        spriteX: 0,
        spriteY: 169,
    },
    ceu:{
        spriteX: 52,
        spriteY: 169,
    },
    espaco: 80,
    drawCanos: [],
    atualiza: function(){
        // para mudar a velocidade dos canos basta alterar o valor passado para a função FrameTime
        // Quanto maior o valor, mais lento o cano anda;
        let checkFrame = frameTime(1);
            if (checkFrame == 0){
                canos.drawCanos.forEach(function(draw){
                draw.x--
                });
            }
        // define a frequencia com que os canos aparecerão na tela
        let checkFrame2 = frameTime(100);
            if (checkFrame2 == 0){
                canos.drawCanos.push({
                x:canvas.width,
                //aqui é definida a altura do cano max:-360 e min: -145
                y: Math.floor(Math.random() * (-355 - -145 + 1) ) - 145
                })
            };
        // limpa o array para otimizar a memoria mantem sempre 5 canos na memoria
            if (canos.drawCanos.length > 5){    
            canos.drawCanos.shift();
            console.log(canos.drawCanos.length);
        };
            
    },
    desenha: function(){
        canos.drawCanos.forEach(function(draw){
        
        
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
    }
    };
    

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
        flappyBird.desenha();
        telaDeInicio.desenha();
        chao.desenha();
        
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
            canos.drawCanos.splice(0,canos.drawCanos.length);
            mudaParaTela(telas.inicio); 
        },
        atualiza() {

        }
    }
}


const telasJogo = {
    desenha(){
        fundo.desenha();
        canos.desenha();
        flappyBird.desenha();
        chao.desenha();
    },
    click(){
        flappyBird.pula();
    },
    atualiza(){
        flappyBird.atualiza();
        canos.atualiza();
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

// atualizado 16/04 parei no video 05 no minuto 13