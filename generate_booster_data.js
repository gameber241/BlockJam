const BOOSTER_TYPE = {
    TIMER: 0,
    ROCKET: 1,
    HAMMER: 2,
    MAGNET: 3,
};

function getRandomBoosters(count) {
    const types = [BOOSTER_TYPE.TIMER, BOOSTER_TYPE.ROCKET, BOOSTER_TYPE.HAMMER, BOOSTER_TYPE.MAGNET];
    const shuffled = types.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function getRandomQuantity(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const suportBooster = {};

// Levels 1-10: Only timer and rocket, quantity 0
for (let i = 1; i <= 10; i++) {
    suportBooster[i] = [
        { type: BOOSTER_TYPE.TIMER, quantity: 0 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 0 },
    ];
}

// Levels 11-40: Random 2 out of 4 booster types, quantity random 0-2
for (let i = 11; i <= 40; i++) {
    const types = getRandomBoosters(2);
    suportBooster[i] = types.map(type => ({
        type: type,
        quantity: getRandomQuantity(0, 2)
    }));
}

// Levels 41-100: Random 2 out of 4 booster types, quantity random 1-3
for (let i = 41; i <= 100; i++) {
    const types = getRandomBoosters(2);
    suportBooster[i] = types.map(type => ({
        type: type,
        quantity: getRandomQuantity(1, 3)
    }));
}

// Format output as TypeScript code
console.log('const suportBooster = {');
Object.keys(suportBooster).forEach((level, index) => {
    const isLast = index === Object.keys(suportBooster).length - 1;
    console.log(`    ${level} :`);
    console.log('    [');
    suportBooster[level].forEach((booster, bIndex) => {
        const comma = bIndex < suportBooster[level].length - 1 ? ',' : '';
        console.log(`        { type: BOOSTER_TYPE.${Object.keys(BOOSTER_TYPE)[booster.type]}, quantity: ${booster.quantity} }${comma}`);
    });
    console.log(`    ]${isLast ? '' : ','}`);
});
console.log('}');
