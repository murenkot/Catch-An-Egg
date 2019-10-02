
const gameInfo = {
    wolf: {body: 0,
        basket: 0},
    eggs: {
        egg1: 0,
        egg2: 0,
        egg3: 0,
        egg4:0
    },
    speed: 1000,
    eggsInterval: 3000,
    loss: 0,
    score: 0
}

class Game {
    constructor(obj){
        this.speed = obj.speed;
        this.eggsInterval = obj.eggsInterval;
        this.loss = obj.loss;
        this.score = obj.score;
        this.matchDict = {
            egg1: 'basket-bot-left',
            egg2: 'basket-top-left',
            egg3: 'basket-bot-right',
            egg4: 'basket-top-right'
        }
    }
     start() {
        console.log("Game has started");
        wolf.createWolfImg();
        this.showScore();
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

    showScore() {
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
            console.log(`scoreArray: ${scoreArray}`)
            console.log(`scoreLength: ${scoreLength}`)
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
        this.showScore();
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
        } else {
            console.log(`loss ${this.loss} is not correct`);
        }
    }

    
}

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
        this.egg1 = obj.egg1;
        this.egg2 = obj.egg2;
        this.egg3 = obj.egg3;
        this.egg4 = obj.egg4;
        this.eggDict = {
            1: "egg1",
            2: "egg2",
            3: "egg3",
            4: "egg4"
        };
        this.eggStorage = {}
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
        console.log(`element ${eggId} is removed from DOM`);
        // delete this.eggStorage[eggId];
    }

    moveAnEgg(eggId) {
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
       
        $(`#${eggId}`).css('top', top);
        $(`#${eggId}`).css('left', left);
        $(`#${eggId}`).css('-webkit-transform', `rotate(${degree}deg)`);
        // console.log(`Egg ${eggId} was moved.`)
    }

    startRollingEgg(eggId){
        this.createAnEgg(eggId);
        const rolling = setInterval(()=> {
            if (this.eggStorage[eggId].position < 5){
                this.eggStorage[eggId].position ++;
                this.moveAnEgg(eggId);
            } else {
                // check the position of basket at this moment
                game.compareEggBusketPositions(eggId)
                clearInterval(rolling);
                this.removeAnEgg(eggId)
            }
        }, game.speed)
    }
    
    // generates an egg number (from 1 to 4) with interva = game.interval + egg unique ID to track each egg
    generateEggs(){
        var id = 0;
        const eggFactory = setInterval(()=>{
            // here we get a random number fron 1 to 4 that deffines the corner the eggs starts moving from
            
            let randomNum = Math.floor(Math.random() * Math.floor(4))+1;
            id ++;
            
            // Each egg has unique ID, type (corner/track), and position on its track [from 0 to 5]
            let eggId = "egg-"+(id);
            let eggClass = "egg"+randomNum;
            // adding egg Id to properies:
            eggs.eggStorage = {[eggId]: {class: eggClass,
                position: 0}, ...eggs.eggStorage}
            eggs.startRollingEgg(eggId);
        }, game.eggsInterval)
    }
}


const wolf = new Wolf(gameInfo.wolf);
const game = new Game(gameInfo)
const eggs = new Eggs(gameInfo.eggs)


// listen to <Start a game> botton to start a game:
$('#start').on('click', game.start.bind(game));

// listen to keyboard:
$('html').on('keydown', wolf.setPositionKeys.bind(wolf));



