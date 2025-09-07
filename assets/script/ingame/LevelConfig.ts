export const LeveConfig = [
    {
        "rowNum": 6,
        "colNum": 5,
        "border": [


            { id: 1, x: 2, y: 5 },
            { id: 1, x: 3, y: 5 },
            { id: 1, x: 4, y: 5 },

            { id: 4, x: 4, y: 5 },
            { id: 4, x: 4, y: 4 },
            { id: 4, x: 4, y: 3 },
            { id: 4, x: 4, y: 2 },


            { id: 2, x: 0, y: 0 },
            { id: 2, x: 1, y: 0 },
            { id: 2, x: 2, y: 0 },


            { id: 3, x: 0, y: 0 },
            { id: 3, x: 0, y: 1 },
            { id: 3, x: 0, y: 2 },
            { id: 3, x: 0, y: 3 },

 
            { id: 5, x: 0, y: 5 },
            { id: 6, x: 4, y: 5 },
            { id: 7, x: 4, y: 0 },
            { id: 8, x: 0, y: 0 },
        ],

        "blocks": [
            {
                "typeIndex": 7,
                "colorIndex": 2,
                "iceNumber": 0,
                "colorList": [3, 4, 5],
                "dir": 0,
                "x": 0,
                "y": 3,
            },

            {
                "typeIndex": 5,
                "colorIndex": 6,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 2,
                "y": 2,
            },
        ],
        "exits": [   // 0 : phai, 1: trai, 2 xuong, 3 len
            {
                "typeIndex": 1,
                "colorIndex": 6,
                "x": 0,
                "y": 4,
                "size": 2
            },

            {
                "typeIndex": 0,
                "colorIndex": 6,
                "x": 4,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 3,
                "colorIndex": 10,
                "x": 0,
                "y": 5,
                "size": 2
            },
            {
                "typeIndex": 2,
                "colorIndex": 2,
                "x": 3,
                "y": 0,
                "size": 2
            },
        ]
    }
]

