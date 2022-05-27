# Dance Until - Jogo de dança
<img src="https://github.com/aldaircdklein/dance-until/blob/main/mobile/assets/icon.png" style="width: 150px"/>

Dance Until é um jogo de dança onde o objetivo é ver quem consegue dançar e parar na hora certa.
O jogo permiti que diversos jogadores participem em uma rede interna, não necessitando de internet para sua execução.
Para vencer é necessário conseguir controlar seus movimentos até o final da partida, dançando e parando na hora certa.
Preste muita atenção na música, enquanto estiver agitada você deve dançar, quando mudar para uma mais tranquila você deve parar.
Seu smartphone irá indicar se você ganhou ou perdeu!
Esse jogo pode ser jogado em familia, entre amigos, nas festas e eventos e possivelmente ser utilizado para campeonatos com premiações!
Ah e o mais importante, tome cuidado com os outros jogadores próximos, pois eles podem te prejudicar! kkkkkkk

**Como configurar**
```
1 - Abra o terminal do SO
2 - Navegue até a pasta "server"
3 - Execute o comando "yarn" e aguarde até terminar de baixar as despendências
4 - Depois navegue até a pasta "web"
5 - Execute o comando "yarn" e aguarde até terminar de baixar as despendências
```
**Como e executar:**
```
1 - Abra o terminal do SO
2 - Navegue até a pasta "server"
3 - Execute o comando "yarn start"
4 - Abra outro terminal do SO
5 - Navegue até a pasta "web"
6 - Execute o comando "yarn serve"
```
```
Observação: Conecte todos os dispositivos que irão participar na mesma rede wi-fi,
não é necessário que haja acesso a internet!
```
**Como jogar:**
```
1 - Abra o navegador do PC e digite "http://localhost:3000".
2 - Com os aparelhos celulares faça o scanner do QRCode e abra o link no navegador do dispositivo
3 - Clique em "Baixe o apk"
4 - Instale o aplicativo baixado
5 - Abra o aplicativo e faça a leitura do QRCode novamente
6 - Após ter terminado de ler o QRCode com todos os dispositivos clique em "PLAY" no PC
```
**Regras e objetivo do jogo:**
```
1 - Dance enquanto a música agitada tocar
2 - Pare ou se mova muito lentamente enquanto a música lenta tocar
3 - O jogador poderá interferir em outros jogadores
4 - Caso o jogador se mova muito rápido durante a música lenta ele perderá
5 - Caso o jogador não se mova durante a música rápida ele poderá perder
6 - Vence os jogadores que chegarem ao final com a menssagem "você dança muitoooooo!" em seu smartphone
```
**Como funciona:**
```
1 - Os movementos serão monitorados pelo sensor acelerômetro dos celulares do jogadores
2 - A música poderá mudar a cada 30 segundo de forma aleatória
3 - A duração da partida é configurada no PC em minutos, antes do inicio da partida
```
**Como alterar a música:**
```
1 - Baixe a música do seu gosto em formato "mp3"
2 - Para a música rápida altere o nome do arquivo para "music.mp3"
3 - Para a música lenta altere o nome do arquivo para "music2.mp3"
4 - Copie o arquivo, vá até a pasta "web" > "build" > "music"
5 - Exclua o arquivo com mesmo nome e cole o seu
6 - Execute o jogo
```
