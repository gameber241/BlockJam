export const LeveConfig = [
    { // level 1
        "rowNum": 5,
        "colNum": 4,
        "board": [
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
        ],

        "border": [ // 1 : top , 2 bot, 3 trai, 4 phai, 5 g TrTr, 6: g TrPh, 7 DPh, 8 DuTr
            { id: 2, x: 3, y: 0 },


            { id: 1, x: 0, y: 4 },

            { id: 3, x: 0, y: 0 },
            { id: 3, x: 0, y: 1 },
            { id: 3, x: 0, y: 2 },
            { id: 3, x: 0, y: 3 },
            { id: 3, x: 0, y: 4 },

            { id: 4, x: 3, y: 0 },
            { id: 4, x: 3, y: 1 },
            { id: 4, x: 3, y: 2 },
            { id: 4, x: 3, y: 3 },
            { id: 4, x: 3, y: 4 },

            { id: 5, x: 0, y: 4 },
            { id: 6, x: 3, y: 4 },
            { id: 7, x: 3, y: 0 },
            { id: 8, x: 0, y: 0 },
        ],

        "blocks": [  //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
            {
                "typeIndex": 21,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 1,
            },
            {
                "typeIndex": 21,
                "colorIndex": 4,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 2,
                "y": 2,
            },


        ],  //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
        "exits": [   // 0 : phai, 1: trai, 2 xuong, 3 len
            {
                "typeIndex": 2,
                "colorIndex": 8,
                "x": 0,
                "y": 0,
                "size": 3
            },
            {
                "typeIndex": 3,
                "colorIndex": 4,
                "x": 1,
                "y": 4,
                "size": 3
            },

        ]
    },
    { // level2
        "rowNum": 5,
        "colNum": 5,
        "board": [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
        ],
        "border": [ // 1 : top , 2 bot, 3 trai, 4 phai, 5 g TrTr, 6: g TrPh, 7 DPh, 8 DuTr
            { id: 2, x: 3, y: 0 },
            { id: 2, x: 4, y: 0 },

            { id: 1, x: 0, y: 4 },
            { id: 1, x: 1, y: 4 },


            { id: 3, x: 0, y: 0 },
            { id: 3, x: 0, y: 1 },
            { id: 3, x: 0, y: 2 },
            { id: 3, x: 0, y: 3 },
            { id: 3, x: 0, y: 4 },

            { id: 4, x: 4, y: 0 },
            { id: 4, x: 4, y: 1 },
            { id: 4, x: 4, y: 2 },
            { id: 4, x: 4, y: 3 },
            { id: 4, x: 4, y: 4 },

            { id: 5, x: 0, y: 4 },
            { id: 6, x: 4, y: 4 },
            { id: 7, x: 4, y: 0 },
            { id: 8, x: 0, y: 0 },
        ],

        "blocks": [  //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
            {
                "typeIndex": 3,
                "colorIndex": 5,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 1,
                "y": 1,
            },
            {
                "typeIndex": 3,
                "colorIndex": 6,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 1,
            },


        ],  //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
        "exits": [   // 0 : phai, 1: trai, 2 xuong, 3 len
            {
                "typeIndex": 2,
                "colorIndex": 6,
                "x": 0,
                "y": 0,
                "size": 3
            },
            {
                "typeIndex": 3,
                "colorIndex": 5,
                "x": 2,
                "y": 4,
                "size": 3
            },

        ]
    },

    { // level 3
        "rowNum": 6,
        "colNum": 5,
        "board": [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
        ],
        "border": [ // 1 : top , 2 bot, 3 trai, 4 phai, 5 g TrTr, 6: g TrPh, 7 DPh, 8 DuTr
            { id: 2, x: 0, y: 0 },
            { id: 2, x: 1, y: 0 },
            { id: 2, x: 2, y: 0 },



            { id: 1, x: 2, y: 5 },
            { id: 1, x: 3, y: 5 },
            { id: 1, x: 4, y: 5 },

            { id: 3, x: 0, y: 0 },
            { id: 3, x: 0, y: 1 },
            { id: 3, x: 0, y: 4 },
            { id: 3, x: 0, y: 5 },

            { id: 4, x: 4, y: 0 },
            { id: 4, x: 4, y: 1 },
            { id: 4, x: 4, y: 4 },
            { id: 4, x: 4, y: 5 },

            { id: 5, x: 0, y: 5 },
            { id: 6, x: 4, y: 5 },
            { id: 7, x: 4, y: 0 },
            { id: 8, x: 0, y: 0 },
        ],

        "blocks": [  //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
            {
                "typeIndex": 5,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 2,
                "y": 2,
            },
            {
                "typeIndex": 12,
                "colorIndex": 10,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 2,
                "y": 1,
            },


        ], //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
        "exits": [   // 0 : phai, 1: trai, 2 xuong, 3 len
            {
                "typeIndex": 1,
                "colorIndex": 9,
                "x": 0,
                "y": 2,
                "size": 2
            },
            {
                "typeIndex": 0,
                "colorIndex": 9,
                "x": 4,
                "y": 2,
                "size": 2
            },
            {
                "typeIndex": 2,
                "colorIndex": 10,
                "x": 3,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 3,
                "colorIndex": 4,
                "x": 0,
                "y": 5,
                "size": 2
            },

        ]
    },


    { // level 4
        "rowNum": 6,
        "colNum": 5,
        "board": [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
        ],
        "border": [ // 1 : top , 2 bot, 3 trai, 4 phai, 5 g TrTr, 6: g TrPh, 7 DPh, 8 DuTr
            { id: 2, x: 0, y: 0 },
            { id: 2, x: 1, y: 0 },
            { id: 2, x: 2, y: 0 },



            { id: 1, x: 2, y: 5 },
            { id: 1, x: 3, y: 5 },
            { id: 1, x: 4, y: 5 },

            { id: 3, x: 0, y: 0 },
            { id: 3, x: 0, y: 1 },
            { id: 3, x: 0, y: 2 },
            { id: 3, x: 0, y: 3 },

            { id: 4, x: 4, y: 2 },
            { id: 4, x: 4, y: 3 },
            { id: 4, x: 4, y: 4 },
            { id: 4, x: 4, y: 5 },

            { id: 5, x: 0, y: 5 },
            { id: 6, x: 4, y: 5 },
            { id: 7, x: 4, y: 0 },
            { id: 8, x: 0, y: 0 },
        ],

        "blocks": [  //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
            {
                "typeIndex": 21,
                "colorIndex": 2,
                "iceNumber": 0,
                "colorList": [],
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
            {
                "typeIndex": 21,
                "colorIndex": 10,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 1,
            },

        ], //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
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
                "typeIndex": 2,
                "colorIndex": 2,
                "x": 3,
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

        ]
    },

    { // level 5
        "rowNum": 6,
        "colNum": 5,
        "board": [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
        ],
        "border": [ // 1 : top , 2 bot, 3 trai, 4 phai, 5 g TrTr, 6: g TrPh, 7 DPh, 8 DuTr
            { id: 2, x: 0, y: 0 },
            { id: 2, x: 4, y: 0 },

            { id: 1, x: 2, y: 5 },


            { id: 3, x: 0, y: 2 },
            { id: 3, x: 0, y: 3 },
            { id: 3, x: 0, y: 4 },
            { id: 3, x: 0, y: 5 },

            { id: 4, x: 4, y: 2 },
            { id: 4, x: 4, y: 3 },
            { id: 4, x: 4, y: 4 },
            { id: 4, x: 4, y: 5 },

            { id: 5, x: 0, y: 5 },
            { id: 6, x: 4, y: 5 },
            { id: 7, x: 4, y: 0 },
            { id: 8, x: 0, y: 0 },
        ],

        "blocks": [  //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
            {
                "typeIndex": 21,
                "colorIndex": 5,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 2,
            },
            {
                "typeIndex": 21,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 2,
            },
            {
                "typeIndex": 2,
                "colorIndex": 6,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 1,
                "y": 1,
            },
            {
                "typeIndex": 2,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 1,
                "y": 0,
            },
            {
                "typeIndex": 3,
                "colorIndex": 4,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 2,
                "y": 3,
            },

        ], //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
        "exits": [   // 0 : phai, 1: trai, 2 xuong, 3 len
            {
                "typeIndex": 1,
                "colorIndex": 6,
                "x": 0,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 0,
                "colorIndex": 9,
                "x": 4,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 2,
                "colorIndex": 4,
                "x": 1,
                "y": 0,
                "size": 3
            },
            {
                "typeIndex": 3,
                "colorIndex": 8,
                "x": 0,
                "y": 5,
                "size": 2
            },
            {
                "typeIndex": 3,
                "colorIndex": 5,
                "x": 3,
                "y": 5,
                "size": 2
            },
        ]
    },
    { // level 6
        "rowNum": 6,
        "colNum": 6,
        "board": [
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
        ],
        "border": [ // 1 : top , 2 bot, 3 trai, 4 phai, 5 g TrTr, 6: g TrPh, 7 DPh, 8 DuTr
            { id: 2, x: 2, y: 0 },
            { id: 2, x: 3, y: 0 },


            { id: 3, x: 0, y: 0 },
            { id: 3, x: 0, y: 1 },
            { id: 3, x: 0, y: 4 },
            { id: 3, x: 0, y: 5 },

            { id: 4, x: 5, y: 0 },
            { id: 4, x: 5, y: 1 },
            { id: 4, x: 5, y: 4 },
            { id: 4, x: 5, y: 5 },

            { id: 5, x: 0, y: 5 },
            { id: 6, x: 5, y: 5 },
            { id: 7, x: 5, y: 0 },
            { id: 8, x: 0, y: 0 },
        ],

        "blocks": [  //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
            {
                "typeIndex": 5,
                "colorIndex": 10,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 2,
            },
            {
                "typeIndex": 5,
                "colorIndex": 2,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 5,
                "y": 2,
            },
            {
                "typeIndex": 2,
                "colorIndex": 3,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 1,
                "y": 2,
            },
            {
                "typeIndex": 2,
                "colorIndex": 5,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 2,
                "y": 3,
            },
            {
                "typeIndex": 2,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 4,
            },
            {
                "typeIndex": 2,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 4,
            },

            {
                "typeIndex": 9,
                "colorIndex": 2,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 1,
                "y": 0,
            },
            {
                "typeIndex": 6,
                "colorIndex": 10,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 0,
            },

        ], //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
        "exits": [   // 0 : phai, 1: trai, 2 xuong, 3 len
            {
                "typeIndex": 1,
                "colorIndex": 3,
                "x": 0,
                "y": 2,
                "size": 2
            },
            {
                "typeIndex": 0,
                "colorIndex": 5,
                "x": 5,
                "y": 2,
                "size": 2
            },
            {
                "typeIndex": 2,
                "colorIndex": 2,
                "x": 0,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 2,
                "colorIndex": 10,
                "x": 4,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 3,
                "colorIndex": 8,
                "x": 0,
                "y": 5,
                "size": 3
            },
            {
                "typeIndex": 3,
                "colorIndex": 9,
                "x": 3,
                "y": 5,
                "size": 3
            },
        ]
    },
    { // level 7
        "rowNum": 7,
        "colNum": 5,
        "board": [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
        ],
        "border": [ // 1 : top , 2 bot, 3 trai, 4 phai, 5 g TrTr, 6: g TrPh, 7 DPh, 8 DuTr
            { id: 5, x: 0, y: 6 },
            { id: 6, x: 4, y: 6 },
            { id: 7, x: 4, y: 0 },
            { id: 8, x: 0, y: 0 },
        ],

        "blocks": [  //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
            {
                "typeIndex": 1,
                "colorIndex": 4,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 1,
            },
            {
                "typeIndex": 21,
                "colorIndex": 6,
                "iceNumber": 0,
                "colorList": [],
                "dir": 2,
                "x": 1,
                "y": 1,
            },
            {
                "typeIndex": 8,
                "colorIndex": 2,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 2,
                "y": 0,
            },
            {
                "typeIndex": 5,
                "colorIndex": 7,
                "iceNumber": 0,
                "colorList": [],
                "dir": 1,
                "x": 0,
                "y": 3,
            },

            {
                "typeIndex": 14,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 1,
                "x": 1,
                "y": 3,
            },
            {
                "typeIndex": 1,
                "colorIndex": 6,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 2,
                "y": 4,
            },

            {
                "typeIndex": 4,
                "colorIndex": 2,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 2,
                "y": 3,
            },
            {
                "typeIndex": 1,
                "colorIndex": 2,
                "iceNumber": 0,
                "colorList": [],
                "dir": 2,
                "x": 1,
                "y": 6,
            },

            {
                "typeIndex": 4,
                "colorIndex": 10,
                "iceNumber": 0,
                "colorList": [],
                "dir": 2,
                "x": 2,
                "y": 6,
            },


            {
                "typeIndex": 3,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 1,
                "x": 4,
                "y": 4,
            },

        ], //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
        "exits": [   // 0 : phai, 1: trai, 2 xuong, 3 len
            {
                "typeIndex": 1,
                "colorIndex": 6,
                "x": 0,
                "y": 0,
                "size": 3
            },
            {
                "typeIndex": 1,
                "colorIndex": 4,
                "x": 0,
                "y": 3,
                "size": 3
            },
            {
                "typeIndex": 1,
                "colorIndex": 2,
                "x": 0,
                "y": 6,
                "size": 1
            },


            {
                "typeIndex": 0,
                "colorIndex": 2,
                "x": 4,
                "y": 0,
                "size": 3
            },
            {
                "typeIndex": 0,
                "colorIndex": 6,
                "x": 4,
                "y": 3,
                "size": 3
            },
            {
                "typeIndex": 0,
                "colorIndex": 10,
                "x": 4,
                "y": 6,
                "size": 1
            },


            {
                "typeIndex": 2,
                "colorIndex": 8,
                "x": 0,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 2,
                "colorIndex": 9,
                "x": 2,
                "y": 0,
                "size": 3
            },
            {
                "typeIndex": 3,
                "colorIndex": 7,
                "x": 0,
                "y": 6,
                "size": 1
            },
            {
                "typeIndex": 3,
                "colorIndex": 8,
                "x": 1,
                "y": 6,
                "size": 2
            },
            {
                "typeIndex": 3,
                "colorIndex": 4,
                "x": 3,
                "y": 6,
                "size": 2
            },
        ]
    },
    { // level 8
        "rowNum": 7,
        "colNum": 5,
        "board": [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
        ],
        "border": [ // 1 : top , 2 bot, 3 trai, 4 phai, 5 g TrTr, 6: g TrPh, 7 DPh, 8 DuTr
            { id: 1, x: 0, y: 6 },
            { id: 1, x: 4, y: 6 },

            { id: 2, x: 0, y: 0 },
            { id: 2, x: 4, y: 0 },

            { id: 3, x: 0, y: 0 },
            { id: 3, x: 0, y: 1 },
            { id: 3, x: 0, y: 2 },

            { id: 4, x: 4, y: 0 },
            { id: 4, x: 4, y: 1 },
            { id: 4, x: 4, y: 5 },
            { id: 4, x: 4, y: 6 },



            { id: 5, x: 0, y: 6 },
            { id: 6, x: 4, y: 6 },
            { id: 7, x: 4, y: 0 },
            { id: 8, x: 0, y: 0 },
        ],

        "blocks": [  //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
            {
                "typeIndex": 1,
                "colorIndex": 6,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 0,
            },
            {
                "typeIndex": 9,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 1,
                "x": 1,
                "y": 0,
            },
            {
                "typeIndex": 4,
                "colorIndex": 10,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 2,
                "y": 1,
            },
            {
                "typeIndex": 12,
                "colorIndex": 4,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 0,
            },

            {
                "typeIndex": 1,
                "colorIndex": 4,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 2,
            },

            {
                "typeIndex": 4,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 2,
                "x": 1,
                "y": 2,
            },
            {
                "typeIndex": 1,
                "colorIndex": 5,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 2,
            },

            {
                "typeIndex": 4,
                "colorIndex": 5,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 3,
            },
            {
                "typeIndex": 1,
                "colorIndex": 10,
                "iceNumber": 0,
                "colorList": [],
                "dir": 2,
                "x": 2,
                "y": 3,
            },

            {
                "typeIndex": 5,
                "colorIndex": 6,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 4,
            },
            {
                "typeIndex": 1,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 1,
                "x": 1,
                "y": 4,
            },
            {
                "typeIndex": 1,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 1,
                "y": 5,
            },
            {
                "typeIndex": 1,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 2,
                "y": 6,
            },
            {
                "typeIndex": 4,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 2,
                "x": 3,
                "y": 6,
            },

        ], //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
        "exits": [   // 0 : phai, 1: trai, 2 xuong, 3 len
            {
                "typeIndex": 0,
                "colorIndex": 9,
                "x": 4,
                "y": 2,
                "size": 1
            },
            {
                "typeIndex": 0,
                "colorIndex": 10,
                "x": 4,
                "y": 3,
                "size": 1
            },
            {
                "typeIndex": 0,
                "colorIndex": 5,
                "x": 4,
                "y": 4,
                "size": 1
            },

            {
                "typeIndex": 1,
                "colorIndex": 4,
                "x": 0,
                "y": 3,
                "size": 3
            },
            {
                "typeIndex": 1,
                "colorIndex": 9,
                "x": 0,
                "y": 6,
                "size": 1
            },
            {
                "typeIndex": 2,
                "colorIndex": 6,
                "x": 1,
                "y": 0,
                "size": 3
            },
            {
                "typeIndex": 3,
                "colorIndex": 8,
                "x": 0,
                "y": 6,
                "size": 3
            },

        ]
    },
    { // level 9
        "rowNum": 6,
        "colNum": 6,
        "board": [
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 0]
        ],
        "border": [ // 1 : top , 2 bot, 3 trai, 4 phai, 5 g TrTr, 6: g TrPh, 7 DPh, 8 DuTr
            { id: 2, x: 2, y: 0 },
            { id: 2, x: 3, y: 0 },

            { id: 3, x: 0, y: 1 },
            { id: 3, x: 0, y: 4 },
            { id: 3, x: 0, y: 5 },

            { id: 4, x: 5, y: 1 },
            { id: 4, x: 5, y: 4 },
            { id: 4, x: 5, y: 5 },

            { id: 5, x: 0, y: 5 },
            { id: 6, x: 5, y: 5 },
            { id: 7, x: 4, y: 0 },
            { id: 8, x: 1, y: 0 },

            { id: 8, x: 0, y: 1 },
            { id: 7, x: 5, y: 1 },
            { id: 13, x: 5, y: 0 },
            { id: 14, x: 0, y: 0 },
        ],

        "blocks": [  //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
            {
                "typeIndex": 2,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 1,
                "y": 0,
            },
            {
                "typeIndex": 2,
                "colorIndex": 3,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 1,
                "y": 2,
            },
            {
                "typeIndex": 2,
                "colorIndex": 5,
                "iceNumber": 0,
                "colorList": [],
                "dir": 2,
                "x": 1,
                "y": 3,
            },
            {
                "typeIndex": 2,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 5,
            },


            {
                "typeIndex": 3,
                "colorIndex": 10,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 1,
            },
            {
                "typeIndex": 5,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 4,
                "y": 0,
            },

            {
                "typeIndex": 5,
                "colorIndex": 2,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 4,
                "y": 2,
            },
            {
                "typeIndex": 5,
                "colorIndex": 2,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 5,
                "y": 3,
            },
            {
                "typeIndex": 6,
                "colorIndex": 5,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 1,
                "y": 4,
            },

        ], //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
        "exits": [   // 0 : phai, 1: trai, 2 xuong, 3 len
            {
                "typeIndex": 0,
                "colorIndex": 5,
                "x": 5,
                "y": 2,
                "size": 2
            },
            {
                "typeIndex": 1,
                "colorIndex": 3,
                "x": 0,
                "y": 2,
                "size": 2
            },
            {
                "typeIndex": 2,
                "colorIndex": 2,
                "x": 1,
                "y": 0,
                "size": 1
            },
            {
                "typeIndex": 2,
                "colorIndex": 10,
                "x": 4,
                "y": 0,
                "size": 1
            },
            {
                "typeIndex": 3,
                "colorIndex": 8,
                "x": 0,
                "y": 5,
                "size": 3
            },
            {
                "typeIndex": 3,
                "colorIndex": 9,
                "x": 3,
                "y": 5,
                "size": 3
            },
        ]
    },
    { // level 10
        "rowNum": 7,
        "colNum": 3,
        "board": [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],

        ],
        "border": [ // 1 : top , 2 bot, 3 trai, 4 phai, 5 g TrTr, 6: g TrPh, 7 DPh, 8 DuTr
            { id: 1, x: 0, y: 6 },
            { id: 1, x: 1, y: 6 },
            { id: 1, x: 2, y: 6 },

            { id: 2, x: 0, y: 0 },
            { id: 2, x: 1, y: 0 },
            { id: 2, x: 2, y: 0 },

            { id: 3, x: 0, y: 0 },
            { id: 3, x: 0, y: 4 },
            { id: 3, x: 0, y: 5 },
            { id: 3, x: 0, y: 6 },


            { id: 4, x: 2, y: 0 },
            { id: 4, x: 2, y: 1 },
            { id: 4, x: 2, y: 2 },
            { id: 4, x: 2, y: 6 },

            { id: 5, x: 0, y: 6 },
            { id: 6, x: 2, y: 6 },
            { id: 7, x: 2, y: 0 },
            { id: 8, x: 0, y: 0 },

        ],

        "blocks": [  //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
            {
                "typeIndex": 2,
                "colorIndex": 7,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 1
            },
            {
                "typeIndex": 2,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 2
            },
            {
                "typeIndex": 2,
                "colorIndex": 2,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 3
            },
            {
                "typeIndex": 2,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 4
            },
            {
                "typeIndex": 2,
                "colorIndex": 10,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 5
            },
            {
                "typeIndex": 2,
                "colorIndex": 4,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 6
            },


        ], //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
        "exits": [   // 0 : phai, 1: trai, 2 xuong, 3 len
            {
                "typeIndex": 1,
                "colorIndex": 4,
                "x": 0,
                "y": 1,
                "size": 1
            },
            {
                "typeIndex": 1,
                "colorIndex": 10,
                "x": 0,
                "y": 2,
                "size": 1
            },
            {
                "typeIndex": 1,
                "colorIndex": 8,
                "x": 0,
                "y": 3,
                "size": 1
            },

            {
                "typeIndex": 0,
                "colorIndex": 9,
                "x": 2,
                "y": 3,
                "size": 1
            },
            {
                "typeIndex": 0,
                "colorIndex": 2,
                "x": 2,
                "y": 4,
                "size": 1
            },
            {
                "typeIndex": 0,
                "colorIndex": 7,
                "x": 2,
                "y": 5,
                "size": 1
            },
        ]
    },
    { // level 11
        "rowNum": 10,
        "colNum": 7,
        "board": [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
        ],
        "border": [ // 1 : top , 2 bot, 3 trai, 4 phai, 5 g TrTr, 6: g TrPh, 7 DPh, 8 DuTr
            { id: 1, x: 0, y: 9 },
            { id: 1, x: 1, y: 9 },
            { id: 1, x: 5, y: 9 },
            { id: 1, x: 6, y: 9 },

            { id: 2, x: 0, y: 0 },
            { id: 2, x: 1, y: 0 },
            { id: 2, x: 5, y: 0 },
            { id: 2, x: 6, y: 0 },

            { id: 3, x: 0, y: 2 },
            { id: 3, x: 0, y: 3 },
            { id: 3, x: 0, y: 6 },
            { id: 3, x: 0, y: 7 },


            { id: 4, x: 6, y: 2 },
            { id: 4, x: 6, y: 3 },
            { id: 4, x: 6, y: 6 },
            { id: 4, x: 6, y: 7 },

            { id: 5, x: 0, y: 9 },
            { id: 6, x: 6, y: 9 },
            { id: 7, x: 6, y: 0 },
            { id: 8, x: 0, y: 0 },



            { id: 10, x: 2, y: 2 },
            { id: 10, x: 3, y: 2 },
            { id: 10, x: 4, y: 2 },
            { id: 10, x: 2, y: 3 },
            { id: 10, x: 3, y: 3 },
            { id: 10, x: 4, y: 3 },


            { id: 10, x: 2, y: 6 },
            { id: 10, x: 3, y: 6 },
            { id: 10, x: 4, y: 6 },
            { id: 10, x: 2, y: 7 },
            { id: 10, x: 3, y: 7 },
            { id: 10, x: 4, y: 7 },

        ],

        "blocks": [  //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
            {
                "typeIndex": 6,
                "colorIndex": 4,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 0
            },
            {
                "typeIndex": 18,
                "colorIndex": 6,
                "iceNumber": 0,
                "colorList": [],
                "dir": 2,
                "x": 2,
                "y": 0
            },
            {
                "typeIndex": 7,
                "colorIndex": 3,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 5,
                "y": 0
            },
            {
                "typeIndex": 5,
                "colorIndex": 2,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 3
            },
            {
                "typeIndex": 5,
                "colorIndex": 3,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 5
            },


            {
                "typeIndex": 5,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 6,
                "y": 3
            },
            {
                "typeIndex": 5,
                "colorIndex": 2,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 6,
                "y": 5
            },
            {
                "typeIndex": 21,
                "colorIndex": 6,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 1,
                "y": 4
            },
            {
                "typeIndex": 21,
                "colorIndex": 10,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 4,
                "y": 4
            },
            {
                "typeIndex": 1,
                "colorIndex": 2,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 5
            },
            {
                "typeIndex": 1,
                "colorIndex": 3,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 4
            },

            {
                "typeIndex": 8,
                "colorIndex": 4,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 8
            },

            {
                "typeIndex": 9,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 5,
                "y": 8
            },

            {
                "typeIndex": 4,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 2,
                "x": 2,
                "y": 9
            },

            {
                "typeIndex": 4,
                "colorIndex": 10,
                "iceNumber": 0,
                "colorList": [],
                "dir": 2,
                "x": 3,
                "y": 8
            },

        ], //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
        "exits": [   // 0 : phai, 1: trai, 2 xuong, 3 len
            {
                "typeIndex": 0,
                "colorIndex": 6,
                "x": 6,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 0,
                "colorIndex": 4,
                "x": 6,
                "y": 4,
                "size": 2
            },
            {
                "typeIndex": 0,
                "colorIndex": 10,
                "x": 6,
                "y": 8,
                "size": 2
            },


            {
                "typeIndex": 1,
                "colorIndex": 6,
                "x": 0,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 1,
                "colorIndex": 9,
                "x": 0,
                "y": 4,
                "size": 2
            },
            {
                "typeIndex": 1,
                "colorIndex": 8,
                "x": 0,
                "y": 8,
                "size": 2
            },
            {
                "typeIndex": 2,
                "colorIndex": 3,
                "x": 2,
                "y": 0,
                "size": 3
            },
            {
                "typeIndex": 3,
                "colorIndex": 2,
                "x": 2,
                "y": 9,
                "size": 3
            },
        ]
    },
    //#region  lv12
    { // level 12
        "rowNum": 7,
        "colNum": 5,
        "board": [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
        ],
        "border": [ // 1 : top , 2 bot, 3 trai, 4 phai, 5 g TrTr, 6: g TrPh, 7 DPh, 8 DuTr
            { id: 1, x: 2, y: 6 },

            { id: 2, x: 2, y: 0 },

            { id: 3, x: 0, y: 2 },
            { id: 3, x: 0, y: 3 },
            { id: 3, x: 0, y: 4 },

            { id: 4, x: 4, y: 2 },
            { id: 4, x: 4, y: 3 },
            { id: 4, x: 4, y: 4 },

            { id: 5, x: 0, y: 6 },
            { id: 6, x: 4, y: 6 },
            { id: 7, x: 4, y: 0 },
            { id: 8, x: 0, y: 0 },

        ],

        "blocks": [  //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
            {
                "typeIndex": 3,
                "colorIndex": 4,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 0
            },
            {
                "typeIndex": 1,
                "colorIndex": 4,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 3
            },
            {
                "typeIndex": 4,
                "colorIndex": 6,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 1,
                "y": 0
            },
            {
                "typeIndex": 7,
                "colorIndex": 5,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 1,
                "y": 1
            },
            {
                "typeIndex": 5,
                "colorIndex": 5,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 1,
                "y": 3
            },
            {
                "typeIndex": 4,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 5
            },
            {
                "typeIndex": 1,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 2,
                "y": 3
            },
            {
                "typeIndex": 3,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 2,
                "y": 4
            },
            {
                "typeIndex": 6,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 0
            },
            {
                "typeIndex": 1,
                "colorIndex": 5,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 2
            },
            {
                "typeIndex": 21,
                "colorIndex": 5,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 3
            },
            {
                "typeIndex": 4,
                "colorIndex": 4,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 5
            },

        ], //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
        "exits": [   // 0 : phai, 1: trai, 2 xuong, 3 len
            {
                "typeIndex": 0,
                "colorIndex": 6,
                "x": 4,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 0,
                "colorIndex": 9,
                "x": 4,
                "y": 5,
                "size": 2
            },

            {
                "typeIndex": 1,
                "colorIndex": 8,
                "x": 0,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 1,
                "colorIndex": 8,
                "x": 0,
                "y": 5,
                "size": 2
            },
            {
                "typeIndex": 2,
                "colorIndex": 5,
                "x": 0,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 2,
                "colorIndex": 8,
                "x": 3,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 3,
                "colorIndex": 4,
                "x": 0,
                "y": 6,
                "size": 2
            },
            {
                "typeIndex": 3,
                "colorIndex": 5,
                "x": 3,
                "y": 6,
                "size": 2
            },
        ]
    },
    //#region  lv13
    { // level 13
        "rowNum": 7,
        "colNum": 7,
        "board": [
            [1, 1, 1, 1, 1, 1,],
            [1, 1, 1, 1, 1, 1,],
            [1, 1, 1, 1, 1, 1,],
            [1, 1, 1, 1, 1, 1,],
            [1, 1, 1, 1, 1, 1,],
            [1, 1, 1, 1, 1, 1,],
            [1, 1, 1, 1, 1, 1,],
        ],
        "border": [ // 1 : top , 2 bot, 3 trai, 4 phai, 5 g TrTr, 6: g TrPh, 7 DPh, 8 DuTr
            { id: 5, x: 0, y: 6 },
            { id: 6, x: 6, y: 6 },
            { id: 7, x: 6, y: 0 },
            { id: 8, x: 0, y: 0 },

        ],

        "blocks": [  //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
            {
                "typeIndex": 4,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 0
            },

            {
                "typeIndex": 4,
                "colorIndex": 2,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 4,
                "y": 0
            },

            {
                "typeIndex": 3,
                "colorIndex": 2,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 1,
                "y": 1
            },
            {
                "typeIndex": 1,
                "colorIndex": 6,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 2,
                "y": 1
            },
            {
                "typeIndex": 1,
                "colorIndex": 6,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 5,
                "y": 1
            },
            {
                "typeIndex": 6,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 2,
                "y": 1
            },
            {
                "typeIndex": 4,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 4,
                "y": 2
            },
            {
                "typeIndex": 6,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 5,
                "y": 2
            },
            {
                "typeIndex": 7,
                "colorIndex": 4,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 3
            },
            {
                "typeIndex": 5,
                "colorIndex": 5,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 2,
                "y": 3
            },
            {
                "typeIndex": 1,
                "colorIndex": 10,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 3
            },
            {
                "typeIndex": 3,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 4,
                "y": 3
            },
            {
                "typeIndex": 7,
                "colorIndex": 2,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 5,
                "y": 4
            },
            {
                "typeIndex": 5,
                "colorIndex": 4,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 4
            },
            {
                "typeIndex": 4,
                "colorIndex": 5,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 1,
                "y": 5
            },
            {
                "typeIndex": 7,
                "colorIndex": 6,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 5
            },
        ], //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
        "exits": [   // 0 : phai, 1: trai, 2 xuong, 3 len
            {
                "typeIndex": 0,
                "colorIndex": 5,
                "x": 6,
                "y": 0,
                "size": 3
            },
            {
                "typeIndex": 0,
                "colorIndex": 8,
                "x": 6,
                "y": 3,
                "size": 1
            },
            {
                "typeIndex": 0,
                "colorIndex": 9,
                "x": 6,
                "y": 4,
                "size": 2
            },
            {
                "typeIndex": 0,
                "colorIndex": 10,
                "x": 6,
                "y": 6,
                "size": 1
            },

            {
                "typeIndex": 1,
                "colorIndex": 6,
                "x": 0,
                "y": 0,
                "size": 2
            },

            {
                "typeIndex": 1,
                "colorIndex": 9,
                "x": 0,
                "y": 2,
                "size": 2
            },
            {
                "typeIndex": 1,
                "colorIndex": 2,
                "x": 0,
                "y": 4,
                "size": 3
            },

            {
                "typeIndex": 2,
                "colorIndex": 8,
                "x": 0,
                "y": 0,
                "size": 1
            },
            {
                "typeIndex": 2,
                "colorIndex": 4,
                "x": 1,
                "y": 0,
                "size": 3
            },
            {
                "typeIndex": 2,
                "colorIndex": 9,
                "x": 4,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 2,
                "colorIndex": 8,
                "x": 6,
                "y": 0,
                "size": 1
            },

            {
                "typeIndex": 3,
                "colorIndex": 5,
                "x": 0,
                "y": 6,
                "size": 3
            },

            {
                "typeIndex": 3,
                "colorIndex": 6,
                "x": 3,
                "y": 6,
                "size": 2
            },

            {
                "typeIndex": 3,
                "colorIndex": 5,
                "x": 5,
                "y": 6,
                "size": 2
            },
        ]
    },
    //#region  lv14
    { // level 14
        "rowNum": 6,
        "colNum": 6,
        "board": [
            [1, 1, 1, 1, 1, 1,],
            [1, 1, 1, 1, 1, 1,],
            [1, 1, 1, 1, 1, 1,],
            [1, 1, 1, 1, 1, 1,],
            [1, 1, 1, 1, 1, 1,],
            [1, 1, 1, 1, 1, 1,],
        ],
        "border": [ // 1 : top , 2 bot, 3 trai, 4 phai, 5 g TrTr, 6: g TrPh, 7 DPh, 8 DuTr
            { id: 1, x: 0, y: 5 },
            { id: 1, x: 1, y: 5 },
            { id: 1, x: 2, y: 5 },

            { id: 3, x: 0, y: 0 },
            { id: 3, x: 0, y: 2 },
            { id: 3, x: 0, y: 3 },
            { id: 3, x: 0, y: 4 },
            { id: 3, x: 0, y: 5 },

            { id: 4, x: 5, y: 0 },
            { id: 4, x: 5, y: 1 },
            { id: 4, x: 5, y: 2 },



            { id: 5, x: 0, y: 5 },
            { id: 6, x: 5, y: 5 },
            { id: 7, x: 5, y: 0 },
            { id: 8, x: 0, y: 0 },

        ],

        "blocks": [  //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
            {
                "typeIndex": 4,
                "colorIndex": 4,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 0
            },
            {
                "typeIndex": 3,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 1
            },
            {
                "typeIndex": 2,
                "colorIndex": 6,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 0
            },
            {
                "typeIndex": 8,
                "colorIndex": 3,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 1
            },
            {
                "typeIndex": 1,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 5,
                "y": 1
            },
            {
                "typeIndex": 5,
                "colorIndex": 3,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 5,
                "y": 2
            },
            {
                "typeIndex": 5,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 5,
                "y": 4
            },
            {
                "typeIndex": 3,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 4,
                "y": 3
            },
            {
                "typeIndex": 2,
                "colorIndex": 10,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 1,
                "y": 3
            },
            {
                "typeIndex": 21,
                "colorIndex": 10,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 4
            },
            {
                "typeIndex": 21,
                "colorIndex": 4,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 2,
                "y": 4
            },

        ], //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
        "exits": [   // 0 : phai, 1: trai, 2 xuong, 3 len
            {
                "typeIndex": 0,
                "colorIndex": 8,
                "x": 5,
                "y": 3,
                "size": 3
            },



            {
                "typeIndex": 1,
                "colorIndex": 6,
                "x": 0,
                "y": 1,
                "size": 1
            },

            {
                "typeIndex": 2,
                "colorIndex": 3,
                "x": 0,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 2,
                "colorIndex": 9,
                "x": 2,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 2,
                "colorIndex": 4,
                "x": 4,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 3,
                "colorIndex": 10,
                "x": 3,
                "y": 5,
                "size": 3
            },
        ]
    },
    { // level 14
        "rowNum": 6,
        "colNum": 6,
        "board": [
            [1, 1, 1, 1, 1, 1,],
            [1, 1, 1, 1, 1, 1,],
            [1, 1, 1, 1, 1, 1,],
            [1, 1, 1, 1, 1, 1,],
            [1, 1, 1, 1, 1, 1,],
            [1, 1, 1, 1, 1, 1,],
        ],
        "border": [ // 1 : top , 2 bot, 3 trai, 4 phai, 5 g TrTr, 6: g TrPh, 7 DPh, 8 DuTr
            { id: 1, x: 0, y: 5 },
            { id: 1, x: 1, y: 5 },
            { id: 1, x: 2, y: 5 },

            { id: 3, x: 0, y: 0 },
            { id: 3, x: 0, y: 2 },
            { id: 3, x: 0, y: 3 },
            { id: 3, x: 0, y: 4 },
            { id: 3, x: 0, y: 5 },

            { id: 4, x: 5, y: 0 },
            { id: 4, x: 5, y: 1 },
            { id: 4, x: 5, y: 2 },



            { id: 5, x: 0, y: 5 },
            { id: 6, x: 5, y: 5 },
            { id: 7, x: 5, y: 0 },
            { id: 8, x: 0, y: 0 },

        ],

        "blocks": [  //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
            {
                "typeIndex": 4,
                "colorIndex": 4,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 0
            },
            {
                "typeIndex": 3,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 1
            },
            {
                "typeIndex": 2,
                "colorIndex": 6,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 0
            },
            {
                "typeIndex": 8,
                "colorIndex": 3,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 3,
                "y": 1
            },
            {
                "typeIndex": 1,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 5,
                "y": 1
            },
            {
                "typeIndex": 5,
                "colorIndex": 3,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 5,
                "y": 2
            },
            {
                "typeIndex": 5,
                "colorIndex": 9,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 5,
                "y": 4
            },
            {
                "typeIndex": 3,
                "colorIndex": 8,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 4,
                "y": 3
            },
            {
                "typeIndex": 2,
                "colorIndex": 10,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 1,
                "y": 3
            },
            {
                "typeIndex": 21,
                "colorIndex": 10,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 0,
                "y": 4
            },
            {
                "typeIndex": 21,
                "colorIndex": 4,
                "iceNumber": 0,
                "colorList": [],
                "dir": 0,
                "x": 2,
                "y": 4
            },

        ], //1: nau, 2: xanh duong dam, 3: xanh la dam, 4 xanh duong nhat, 5 xanh la nhat, 6 cam , 7: hong, 8: tim, 9: do , 10: vang
        "exits": [   // 0 : phai, 1: trai, 2 xuong, 3 len
            {
                "typeIndex": 0,
                "colorIndex": 8,
                "x": 5,
                "y": 3,
                "size": 3
            },



            {
                "typeIndex": 1,
                "colorIndex": 6,
                "x": 0,
                "y": 1,
                "size": 1
            },

            {
                "typeIndex": 2,
                "colorIndex": 3,
                "x": 0,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 2,
                "colorIndex": 9,
                "x": 2,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 2,
                "colorIndex": 4,
                "x": 4,
                "y": 0,
                "size": 2
            },
            {
                "typeIndex": 3,
                "colorIndex": 10,
                "x": 3,
                "y": 5,
                "size": 3
            },
        ]
    },
]

