
const gameInfo = {
    wolf: {body: 0,
        basket: 0},
    eggs: {
        egg1: 0,
        egg2: 0,
        egg3: 0,
        egg4:0
    },
    speed: 3000,
    eggsInterval: 9000,
    brokenEggs: 0,
    score: 0
}

class Game {
    constructor(obj){
        this.speed = obj.speed;
        this.eggsInterval = obj.eggsInterval;
        this.brokenEggs = obj.brokenEggs;
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
        eggs.generateEggs();
    }

    compareEggBusketPositions(eggId){
        const eggPosition = eggs.eggStorage[eggId].class;
        const basketPosition = $('#basket').attr('class');
        console.log(`!!!!!! this.matchDict[eggPosition] = ${this.matchDict[eggPosition]} `);
        console.log(`basketPosition = ${basketPosition}`);
        if (this.matchDict[eggPosition] === basketPosition){
            console.log("Wolf caught the egg!!!!!!");
        } else {
            console.log("One egg is broken");
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
        // console.log(`wolf position: body ${this.body} and basket ${this.basket}`)
        // create a wolf
        $('#wolf').attr('class', this.positionDict.body[this.body]);

        // create a basket:
        $('#basket').attr('class', this.positionDict.basket[[this.body, this.basket]]);

        console.log(`A new wolf img was creater`)
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
            // console.log(`new wolf position: body ${this.body} and basket ${this.basket}`);
        
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
        console.log(`this.eggStorage[eggId].eggClass: ${this.eggStorage[eggId].class}`);
        $('#eggs').append(`
        <div id="${eggId}" class="${eggs.eggStorage[eggId].class}"></div>
        `);
        // assign position 1 ti the egg
        eggs.eggStorage[eggId].position++;
        console.log("egg was created")

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
        console.log(`Egg ${eggId} was moved.`)
    }

    startRollingEgg(eggId){
        this.createAnEgg(eggId);
        const rolling = setInterval(()=> {
            console.log(`===>>> this.eggStorage[eggId].position:  ${this.eggStorage[eggId].position}`)
            console.log(this.eggStorage)
            if (this.eggStorage[eggId].position < 6){
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
            let eggId = "egg"+(id);
            let eggClass = "egg"+randomNum;
            // adding egg Id to properies:
            eggs.eggStorage = {[eggId]: {class: eggClass,
                position: 0}, ...eggs.eggStorage}
            console.log("####################")
            console.log(`egg with ID ${eggId} and class ${eggClass} was generatet`)
            console.log("####################");
            console.log(eggs.eggStorage[eggId]);

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



