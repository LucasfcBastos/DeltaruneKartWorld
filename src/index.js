const character1 = {
    name: "Mario",
    speed: 4,
    maneuver: 3,
    power: 3,
    points: 0
}

const character2 = {
    name: "Bowser",
    speed: 5,
    maneuver: 2,
    power: 5,
    points: 0
}

async function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
    let random = Math.floor(Math.random() * 3) + 1
    let result

    switch (true) {
        case random == 1:
            result = "STRAIGHT"
            break;
        case random == 2:
            result = "CURVE"
            break;
        case random == 3:
            result = "CONFRONTATION"
            break;
        default:
            debugger;
    }

    return result;
}

async function logRollResult(character, result, dice, attribute, block) {
    console.log(`${character} '${block}' = ${result} <- [${dice}]1d6 + ${attribute}`);
}

async function playRaceEngine(kart1, kart2) {
    for(let round = 1; round <= 5; round++) {
        
        console.log(`\n==========================\n`);
        
        let block = await getRandomBlock()
        console.log(`Round ${round} = ${block}\n`);
        
        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();
        
        let RoundTotal1 = 0;
        let RoundTotal2 = 0;

        if(block === "STRAIGHT") {
            RoundTotal1 = diceResult1 + kart1.speed
            logRollResult(kart1.name, RoundTotal1, diceResult1, kart1.speed, "Speed");

            RoundTotal2 = diceResult2 + kart2.speed
            logRollResult(kart2.name, RoundTotal2, diceResult2, kart2.speed, "Speed");
        }
        
        if(block === "CURVE") {
            RoundTotal1 = diceResult1 + kart1.maneuver
            logRollResult(kart1.name, RoundTotal1, diceResult1, kart1.maneuver, "Maneuver");

            RoundTotal2 = diceResult2 + kart2.maneuver
            logRollResult(kart2.name, RoundTotal2, diceResult2, kart2.maneuver, "Maneuver");
        }
        
        if(block === "CONFRONTATION") {
            console.log(`both will attack each other`)

            RoundTotal1 = diceResult1 + kart1.power
            logRollResult(kart1.name, RoundTotal1, diceResult1, kart1.power, "Power");

            RoundTotal2 = diceResult2 + kart2.power
            logRollResult(kart2.name, RoundTotal2, diceResult2, kart2.power, "Power");

            if (RoundTotal1 < RoundTotal2 && kart1.points > 0) {
                console.log(`${kart1.name} lost -1 point`)
                kart1.points--
            } else if (RoundTotal1 > RoundTotal2 && kart2.points > 0) {
                console.log(`${kart2.name} lost -1 point`)
                kart2.points--
            } else {
                console.log(`both not lost -1 points`)
            }

            continue
        }

        if (RoundTotal1 > RoundTotal2) {
            console.log(`${kart1.name} won +1 point`)
            kart1.points++
        } else if (RoundTotal1 < RoundTotal2) {
            console.log(`${kart2.name} won +1 point`)
            kart2.points++
        } else {
            console.log(`both get +1 points`)
            kart1.points++
            kart2.points++
        }

    }
}

async function declareWinner(kart1, kart2) {
    
    console.log(`\n==========================\n`);
    
    console.log(`WINNER\n`);
    console.log(`${kart1.name}: ${kart1.points} points`);
    console.log(`${kart2.name}: ${kart2.points} points\n`);

    if (kart1.points > kart2.points) {  
        console.log(`${kart1.name} winner`);
    } else if (kart1.points < kart2.points) {  
        console.log(`${kart2.name} winner`);
    } else {
        console.log("both drew")
    }
}

(async function main() {
    console.log("⬛⬜⬛⬜⬛⬜⬛\n  PRE - RACE\n⬜⬛⬜⬛⬜⬛⬜");
    console.log(`\n${character1.name} versus ${character2.name} dispute...`);

    await playRaceEngine(character1, character2);

    await declareWinner(character1, character2);
})();