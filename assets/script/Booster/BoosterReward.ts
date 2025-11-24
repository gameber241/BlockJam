const BOOSTER_TYPE = {
    TIMER : 0,
    ROCKET : 1,
    HAMMER : 2,
    MAGNET : 3,
}

const rewartdBooster = {
    10 :{
        type: BOOSTER_TYPE.TIMER,
        quantity: 1
    },
    20 :{
        type: BOOSTER_TYPE.ROCKET,
        quantity: 1
    },
    30 :{
        type: BOOSTER_TYPE.HAMMER,
        quantity: 1
    },
    40 :{
        type: BOOSTER_TYPE.MAGNET,
        quantity: 1
    },

    50 : {
        type: BOOSTER_TYPE.TIMER,
        quantity: 2
    },
    60 :{
        type: BOOSTER_TYPE.ROCKET,
        quantity: 2
    },
    70 :{
        type: BOOSTER_TYPE.HAMMER,
        quantity: 2
    },
    80 :{
        type: BOOSTER_TYPE.MAGNET,
        quantity: 2
    },
    90 :{
        type: BOOSTER_TYPE.TIMER,
        quantity: 3
    },
    100 :{
        type: BOOSTER_TYPE.ROCKET,
        quantity: 3
    },
    110 :{
        type: BOOSTER_TYPE.HAMMER,
        quantity: 3
    },
    120 :{
        type: BOOSTER_TYPE.MAGNET,
        quantity: 3
    },
}

const suportBooster = {
    1 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 0 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 0 }
    ],
    2 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 0 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 0 }
    ],
    3 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 0 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 0 }
    ],
    4 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 0 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 0 }
    ],
    5 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 0 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 0 }
    ],
    6 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 0 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 0 }
    ],
    7 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 0 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 0 }
    ],
    8 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 0 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 0 }
    ],
    9 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 0 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 0 }
    ],
    10 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 0 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 0 }
    ],
    11 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 1 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 0 }
    ],
    12 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 2 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 2 }
    ],
    13 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 2 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 0 }
    ],
    14 :
    [
        { type: BOOSTER_TYPE.HAMMER, quantity: 2 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 2 }
    ],
    15 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 1 },
        { type: BOOSTER_TYPE.TIMER, quantity: 0 }
    ],
    16 :
    [
        { type: BOOSTER_TYPE.HAMMER, quantity: 1 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 2 }
    ],
    17 :
    [
        { type: BOOSTER_TYPE.HAMMER, quantity: 0 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 0 }
    ],
    18 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 1 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 2 }
    ],
    19 :
    [
        { type: BOOSTER_TYPE.HAMMER, quantity: 0 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 0 }
    ],
    20 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 2 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 2 }
    ],
    21 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 2 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 0 }
    ],
    22 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 0 },
        { type: BOOSTER_TYPE.MAGNET, quantity: 1 }
    ],
    23 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 1 },
        { type: BOOSTER_TYPE.MAGNET, quantity: 1 }
    ],
    24 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 2 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 2 }
    ],
    25 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 1 },
        { type: BOOSTER_TYPE.TIMER, quantity: 1 }
    ],
    26 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 0 },
        { type: BOOSTER_TYPE.TIMER, quantity: 1 }
    ],
    27 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 2 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 1 }
    ],
    28 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 0 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 0 }
    ],
    29 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 1 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 2 }
    ],
    30 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 0 },
        { type: BOOSTER_TYPE.MAGNET, quantity: 0 }
    ],
    31 :
    [
        { type: BOOSTER_TYPE.HAMMER, quantity: 1 },
        { type: BOOSTER_TYPE.MAGNET, quantity: 1 }
    ],
    32 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 1 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 1 }
    ],
    33 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 0 },
        { type: BOOSTER_TYPE.TIMER, quantity: 1 }
    ],
    34 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 1 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 1 }
    ],
    35 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 0 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 2 }
    ],
    36 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 1 },
        { type: BOOSTER_TYPE.TIMER, quantity: 1 }
    ],
    37 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 1 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 1 }
    ],
    38 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 1 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 2 }
    ],
    39 :
    [
        { type: BOOSTER_TYPE.HAMMER, quantity: 0 },
        { type: BOOSTER_TYPE.TIMER, quantity: 0 }
    ],
    40 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 0 },
        { type: BOOSTER_TYPE.MAGNET, quantity: 2 }
    ],
    41 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 2 },
        { type: BOOSTER_TYPE.MAGNET, quantity: 3 }
    ],
    42 :
    [
        { type: BOOSTER_TYPE.HAMMER, quantity: 1 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 1 }
    ],
    43 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 3 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 2 }
    ],
    44 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 1 },
        { type: BOOSTER_TYPE.TIMER, quantity: 2 }
    ],
    45 :
    [
        { type: BOOSTER_TYPE.HAMMER, quantity: 3 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 3 }
    ],
    46 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 2 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 3 }
    ],
    47 :
    [
        { type: BOOSTER_TYPE.HAMMER, quantity: 3 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 2 }
    ],
    48 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 2 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 3 }
    ],
    49 :
    [
        { type: BOOSTER_TYPE.HAMMER, quantity: 3 },
        { type: BOOSTER_TYPE.MAGNET, quantity: 1 }
    ],
    50 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 1 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 1 }
    ],
    51 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 1 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 2 }
    ],
    52 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 2 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 1 }
    ],
    53 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 2 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 2 }
    ],
    54 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 2 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 1 }
    ],
    55 :
    [
        { type: BOOSTER_TYPE.HAMMER, quantity: 3 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 3 }
    ],
    56 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 3 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 2 }
    ],
    57 :
    [
        { type: BOOSTER_TYPE.HAMMER, quantity: 3 },
        { type: BOOSTER_TYPE.TIMER, quantity: 1 }
    ],
    58 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 2 },
        { type: BOOSTER_TYPE.TIMER, quantity: 1 }
    ],
    59 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 1 },
        { type: BOOSTER_TYPE.TIMER, quantity: 1 }
    ],
    60 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 2 },
        { type: BOOSTER_TYPE.TIMER, quantity: 1 }
    ],
    61 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 3 },
        { type: BOOSTER_TYPE.TIMER, quantity: 1 }
    ],
    62 :
    [
        { type: BOOSTER_TYPE.HAMMER, quantity: 1 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 1 }
    ],
    63 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 1 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 1 }
    ],
    64 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 1 },
        { type: BOOSTER_TYPE.TIMER, quantity: 3 }
    ],
    65 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 3 },
        { type: BOOSTER_TYPE.TIMER, quantity: 2 }
    ],
    66 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 3 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 2 }
    ],
    67 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 3 },
        { type: BOOSTER_TYPE.MAGNET, quantity: 1 }
    ],
    68 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 2 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 3 }
    ],
    69 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 1 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 3 }
    ],
    70 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 1 },
        { type: BOOSTER_TYPE.TIMER, quantity: 2 }
    ],
    71 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 1 },
        { type: BOOSTER_TYPE.MAGNET, quantity: 1 }
    ],
    72 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 2 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 1 }
    ],
    73 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 3 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 2 }
    ],
    74 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 1 },
        { type: BOOSTER_TYPE.MAGNET, quantity: 1 }
    ],
    75 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 2 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 3 }
    ],
    76 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 2 },
        { type: BOOSTER_TYPE.MAGNET, quantity: 1 }
    ],
    77 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 3 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 1 }
    ],
    78 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 1 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 2 }
    ],
    79 :
    [
        { type: BOOSTER_TYPE.HAMMER, quantity: 3 },
        { type: BOOSTER_TYPE.MAGNET, quantity: 1 }
    ],
    80 :
    [
        { type: BOOSTER_TYPE.HAMMER, quantity: 1 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 1 }
    ],
    81 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 3 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 3 }
    ],
    82 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 3 },
        { type: BOOSTER_TYPE.MAGNET, quantity: 3 }
    ],
    83 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 3 },
        { type: BOOSTER_TYPE.TIMER, quantity: 3 }
    ],
    84 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 3 },
        { type: BOOSTER_TYPE.TIMER, quantity: 3 }
    ],
    85 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 2 },
        { type: BOOSTER_TYPE.TIMER, quantity: 1 }
    ],
    86 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 3 },
        { type: BOOSTER_TYPE.TIMER, quantity: 3 }
    ],
    87 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 3 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 2 }
    ],
    88 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 3 },
        { type: BOOSTER_TYPE.TIMER, quantity: 3 }
    ],
    89 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 2 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 3 }
    ],
    90 :
    [
        { type: BOOSTER_TYPE.HAMMER, quantity: 2 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 1 }
    ],
    91 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 2 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 2 }
    ],
    92 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 2 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 1 }
    ],
    93 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 2 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 2 }
    ],
    94 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 3 },
        { type: BOOSTER_TYPE.TIMER, quantity: 1 }
    ],
    95 :
    [
        { type: BOOSTER_TYPE.HAMMER, quantity: 1 },
        { type: BOOSTER_TYPE.MAGNET, quantity: 1 }
    ],
    96 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 2 },
        { type: BOOSTER_TYPE.TIMER, quantity: 3 }
    ],
    97 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 2 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 3 }
    ],
    98 :
    [
        { type: BOOSTER_TYPE.TIMER, quantity: 1 },
        { type: BOOSTER_TYPE.ROCKET, quantity: 1 }
    ],
    99 :
    [
        { type: BOOSTER_TYPE.ROCKET, quantity: 3 },
        { type: BOOSTER_TYPE.TIMER, quantity: 3 }
    ],
    100 :
    [
        { type: BOOSTER_TYPE.MAGNET, quantity: 2 },
        { type: BOOSTER_TYPE.HAMMER, quantity: 1 }
    ]
}

export { BOOSTER_TYPE, rewartdBooster, suportBooster }