const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },

    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

const playerSide = {
    player1: "player-cards",
    player1BOX: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBOX: document.querySelector("#computer-cards"),
}

const pathImage = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImage}dragon.png`, 
        winOf: [1],
        LoseOf: [2],
    },

    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImage}magician.png`, 
        winOf: [2],
        LoseOf: [0],
    },

    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImage}exodia.png`, 
        winOf: [0],
        LoseOf: [1],
    }
];

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(randomIdCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", randomIdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSide.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(randomIdCard);
        });
    
        cardImage.addEventListener("click", () => {
            setCardsFiled(cardImage.getAttribute("data-id"));
        });
    }    

    return cardImage;
}

async function setCardsFiled(cardId){
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";

    state.cardSprites.avatar.src = "";

    // Verifique se os elementos fieldCards têm um atributo src
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawButton(text){
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";

    // Adicionar um listener para iniciar um novo duelo
    state.actions.button.addEventListener('click', init);
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];

    if(playerCard.winOf.includes(computerCardId)){
        duelResults = "Vitória";
        await playAudio("win");
        state.score.playerScore++;
    }
    
    else if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "Derrota";
        await playAudio("lose");

        state.score.computerScore++;
    }

    return duelResults;
}

async function removeAllCardsImages(){
   let {computerBOX, player1BOX} = playerSide;
   let imgElements = computerBOX.querySelectorAll("img");
   imgElements.forEach((img) => img.remove());

   imgElements = player1BOX.querySelectorAll("img");
   imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atribute: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function updateScore() {
    state.score.scoreBox.innerText = `Player: ${state.score.playerScore} | Computer: ${state.score.computerScore}`;
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}


function init(){
    state.actions.button.style.display = "none"; // Ocultar botão
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    drawCards(5, playerSide.player1);
    drawCards(5, playerSide.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();
