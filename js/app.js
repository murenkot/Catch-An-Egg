// Initial game setting/object:
const gameInfo = {
    wolf: {body: 0,
        basket: 0},
    speed: 1000,
    eggsInterval: 3000,
    loss: 0,
    score: 0
}

// function to generate a copy of the settings:
function generateNewDataSet()  {
    const gameInfoCopy = Object.assign({}, gameInfo);
    return gameInfoCopy;
}

class Game {
    constructor(obj){
        this.speed = obj.speed;
        this.eggsInterval = obj.eggsInterval;
        this.loss = obj.loss;
        this.score = obj.score;
        this.scoreStorage = {};
        this.matchDict = {
            egg1: 'basket-bot-left',
            egg2: 'basket-top-left',
            egg3: 'basket-bot-right',
            egg4: 'basket-top-right'
        }
    }
    start() {
        const newGameDataSet = Object.assign({}, gameInfo);

        console.log("Game has started");
        console.log(this.speed);
        console.log(this.eggsInterval);
        this.cleanMemory();
        wolf.createWolfImg();
        this.displayScore();
        eggs.generateEggs();
    }

    compareEggBusketPositions(eggId){
        const eggPosition = eggs.eggStorage[eggId].class;
        const basketPosition = $('#basket').attr('class');
        if (this.matchDict[eggPosition] === basketPosition){
            console.log("Wolf caught the egg!!!!!!");
            this.updateScore();
        } else {
            console.log("One egg is broken");
            this.updateBrokenEggs();
        }
    }

    displayScore() {
        if (this.score === 0){
            const template = `
            <ul>
                <li><span></span></li>
                <li><span></span></li>
                <li><span></span></li>
            </ul>
            `
            $('#score').append(template);
        } else {
            const scoreArray = String(this.score).split('');
            const scoreLength = scoreArray.length;
            $('#score ul li').eq(2).attr('class', `n-${scoreArray[scoreLength-1]}`)
            if(scoreLength > 1) {
                $('#score ul li').eq(1).attr('class', `n-${scoreArray[scoreLength-2]}`)
            }
            if (scoreLength > 2) {
                $('#score ul li').eq(0).attr('class', `n-${scoreArray[scoreLength-3]}`)
            }
        }
    }
 
    updateScore(){
        this.score ++;
        this.displayScore();
        this.increaseGameSpead();
    }

    updateBrokenEggs(){
        this.loss ++;
        this.showBrokenEggs()
    }

    showBrokenEggs(){
        const $loss = $('#loss');
        if (this.loss === 1){
            $loss.attr('class', 'one');
        } else if(this.loss === 2){
            $loss.attr('class', 'two');
        } else if (this.loss === 3){
            $loss.attr('class', 'three');
            this.blinkElement();
            setTimeout(()=>{
                this.unblinkElement()
                this.gameOver(); 
   
            }, 2000);

            
        } else {
            console.log(`loss ${this.loss} is not correct`);
        }
    }

    blinkElement() {
        $('#loss').addClass('blink_me');
        $('#score').addClass('blink_me');
    }

    unblinkElement() {
        $('#loss').removeClass('blink_me');
        $('#score').removeClass('blink_me');
    }

    increaseGameSpead() {
        if (this.score%5 === 0){
            this.speed = game.speed * 0.8;
            this.eggsInterval = this.eggsInterval * 0.8;
        }
    }

    gameOver() {
        // alert message "Game is over! Your scrore: ..."
        const saveGame = window.confirm(`Game is over! Your scrore: ${this.score}. Do you want to save it?`);
        this.cleanTheScreen();
        if (saveGame) {
            let playerName = prompt(`What is your name? `);
            this.scoreStorage[playerName]=this.score;
            let db = JSON.parse(window.localStorage.score);
            db[playerName] = this.score;
            window.localStorage.score = JSON.stringify(db);
            console.log(`*******************************===>>>`);
            console.log(JSON.parse(window.localStorage.score));
            this.showRecords();
        }
    }

    showRecords() {

        // first clean ul from DOM if it exists already
        if ($('#score-container ul li').length > 1){
            $('#score-container ul li').remove();
        }

/*         // create a header
        $('#score-container').prepend('<h3>Best Of The Best:</h3>')
 */
        // copy score object:
        let totalScores = JSON.parse(window.localStorage.score);

        // loop through this array 5 times 
        for (let i=0; i<5; i++){
            // let's create an array with all scores from the storage:
            let scoreArray = Object.values(totalScores);
            // max value
            let maxScore = Math.max(...scoreArray);
            // key of this value
            let playerName = Object.keys(totalScores).find(key => totalScores[key]=== maxScore);
            // add this pair to html list
            $('#score-container ul').append(`<li>${playerName}: ${maxScore}</li>`)
            // remove this value from object storage:
            delete totalScores[playerName];
        }
    }

    cleanTheScreen() {
        $('#wolf').attr('class', '');
        $('#basket').attr('class', '');
        $('#score').html('');
        $('#loss').attr('class', '');
        $('#eggs div').remove();
        console.log(`DOM was cleaned`);
        
        
    }

    cleanMemory(){
        // generate a new game data set:
        gameInfoCopy = generateNewDataSet();

        // assign initial values to all game objects attributes
        console.log("Assigning!!!!!!")
        console.log(gameInfoCopy.speed);
        console.log(gameInfoCopy.eggsInterval);
        this.speed = gameInfoCopy.speed;
        this.eggsInterval = gameInfoCopy.eggsInterval;
        this.loss = gameInfoCopy.loss;
        this.score = gameInfoCopy.score;
        wolf.body = gameInfoCopy.wolf.body;
        wolf.basket = gameInfoCopy.wolf.basket;
        eggs.eggStorage = {};
        eggs.id = 0;
        console.log('game memory was cleaned')

    }
    

    

};

/////// CLASS WOLF //////////
class Wolf{
    constructor(obj){
        this.body = obj.body;
        this.basket = obj.basket;
        this.positionDict = {
            body: {
                0: 'wolf-left',
                1: 'wolf-right'
            },
            basket: {
                [[0, 0]]: 'basket-bot-left',
                [[0, 1]]: 'basket-top-left',
                [[1, 0]]: 'basket-bot-right',
                [[1, 1]]: 'basket-top-right'
            }
        }
    }
    // set wolf position based on object stored data:
    createWolfImg(){
        // create a wolf
        $('#wolf').attr('class', this.positionDict.body[this.body]);

        // create a basket:
        $('#basket').attr('class', this.positionDict.basket[[this.body, this.basket]]);

    }
 
    // body position left-right (arrows)
    // basket position - top/down and depends on body position
    setPositionKeys(){
        const key = event.key;
        if (key === 'ArrowRight' || key === 'ArrowLeft' || key === 'ArrowUp' || key === 'ArrowDown'){
            if (key === 'ArrowRight'){
                this.body = 1;
            } else if(key === 'ArrowLeft') {
                this.body = 0;
            } else if(key === 'ArrowUp') {
                this.basket = 1;
            } else if (key === 'ArrowDown') {
                this.basket = 0;
            };        
            wolf.createWolfImg();
        }   
    }
}

/////////// EGGS /////////////////////
class Eggs {
    constructor(obj){
        this.eggDict = {
            1: "egg1",
            2: "egg2",
            3: "egg3",
            4: "egg4"
        };
        this.eggStorage = {}
        this.id = 0;
    }

    createAnEgg(eggId){
        $('#eggs').append(`
        <div id="${eggId}" class="${eggs.eggStorage[eggId].class}"></div>
        `);
        // assign position 1 to the egg
        eggs.eggStorage[eggId].position++;

    }

    removeAnEgg(eggId){
        $(`#${eggId}`).remove();
        delete this.eggStorage[eggId];
    }

    moveAnEgg(eggId) {
        if (game.loss < 3){
            // grab current position of the egg
            let top = Number($(`#${eggId}`).css('top').replace("px", ""));
            let left = Number($(`#${eggId}`).css('left').replace("px", ""));
            let degree = 0;

            // grab a class of the egg:
            let eggClass = $(`#${eggId}`).attr('class');
            if (eggClass === 'egg1' || eggClass === 'egg2'){
                top = top + 10;
                left = left + 15;
                degree = 165;
            } else {
                top = top + 10;
                left = left - 15;
                degree = 300;
            }
            // assign new attributes to the egg
            $(`#${eggId}`).css('top', top);
            $(`#${eggId}`).css('left', left);
            $(`#${eggId}`).css('-webkit-transform', `rotate(${degree}deg)`);
        } else {
            this.removeAnEgg(eggId);
        }
        
    }

    startRollingEgg(eggId){
        // check if the game is not over:
        if (game.loss < 3){
            // create an egg
            this.createAnEgg(eggId);
            // set interval to move an egg with certain speed:
            const rolling = setInterval(()=> {
                // check if the egg is still on the page (not cleaned after the game was over)
                if ($(`#${eggId}`).length != 0){
                    // an egg has max 5 position on the screen - [1, 2, 3, 4, 5]. if egg position is less then 5 we move it to the position +1
                    if (this.eggStorage[eggId].position < 5){
                        this.eggStorage[eggId].position ++;
                        this.moveAnEgg(eggId);
                    } else {
                        // after an egg riched position #5 we check the position of basket at this moment if it matches the egg position
                        game.compareEggBusketPositions(eggId);
                        // after it clean the interval
                        clearInterval(rolling);
                        // and remove the egg
                        this.removeAnEgg(eggId)
                    }
                } 
            }, game.speed)
        }
    }
    
    // generates an egg number (from 1 to 4) with interva = game.interval + egg unique ID to track each egg
    generateEggs(){
        const eggFactory = setInterval(()=>{
            if (game.score % 5 === 0 && game.score !== 0){
                clearInterval(eggFactory);
                this.generateEggs();
            }
            if (game.loss < 3) {
                // here we get a random number fron 1 to 4 that deffines the corner the eggs starts moving from
                let randomNum = Math.floor(Math.random() * Math.floor(4))+1;
                this.id ++;
                // Each egg has unique ID, type (corner/track), and position on its track [from 0 to 5]
                let eggId = "egg-"+(this.id);
                let eggClass = "egg"+randomNum;
                // add egg Id to properies:
                eggs.eggStorage = {[eggId]: {class: eggClass,
                    position: 0}, ...eggs.eggStorage}
                eggs.startRollingEgg(eggId);
            } else {
                eggs.eggStorage = {};
                clearInterval(eggFactory);
            }
        }, game.eggsInterval)
    }
}


gameInfoCopy = generateNewDataSet();


const wolf = new Wolf(gameInfoCopy.wolf);
const game = new Game(gameInfoCopy);
const eggs = new Eggs();


function toggleStatus() {
    $('#score-container').toggleClass('invisible');
}


// build a score table with invisible class as a part of DOM
// game.showRecords()

// listen to <Start a game> botton to start a game:
$('#start').on('click', game.start.bind(game));

// listen to keyboard:
$('html').on('keydown', wolf.setPositionKeys.bind(wolf));

// listen to <Show Scores> button:
$('#show-score').on('click', toggleStatus);



window.localStorage.score = JSON.stringify({
    Jennifer: 350,
    Bob: 22,
    Tonny: 238,
    Jake: 1,
    Anna: 4

});

