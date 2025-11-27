import { _decorator, Component, Node, Sprite, UITransform, Vec2, Size, Label, Vec3, instantiate } from 'cc';
import { ResourcesManager } from '../Manager/ResourcesManager';
import { Tools } from './Tools';
import { BLOCK_SIZE } from '../ingame/IngameLogic';
import { PoolManager } from '../Manager/PoolManager';
import { DataManager } from '../DataManager';
import { CustomVerticalCenter } from './CenterVerticalLayout';
const { ccclass, property } = _decorator;

@ccclass('BlockTool')
export class BlockTool extends Component {
    @property(Sprite)
    icon: Sprite = null

    @property(Node)
    mask: Node = null

    @property(Node)
    dirNode: Node

    @property(Node)
    listColor: Node

    @property(Label)
    freezeLb: Label

    @property(Node)
    star: Node

    @property(Node)
    key: Node = null

    @property(Sprite)
    lock: Sprite = null


    @property(Node)
    lockLb: Node = null

    @property(Node)
    wireNode: Node = null

    col: number = 0
    row: number = 0
    idBlock = 0
    idColor = 0
    director = 0
    idColorSub = 0
    ice = 0
    isKey = false
    isDrag = false
    numberLock = 0
    corlorWire = []
    isStar = false
    dragIndex: number
    init(col, row, idBlock, idColor, director, idColorSub, ice, isKey, isDrag, numberLock, colorWire, isStar, dragIndex) {
        this.director = director
        this.idBlock = idBlock
        this.col = col
        this.row = row
        this.idColor = idColor
        this.idColorSub = idColorSub
        this.initSprite()
        this.initDir()
        this.initListColor(idColorSub == 0 ? [] : [idColorSub])
        this.ice = ice
        this.initIce(this.ice)
        this.isKey = isKey
        this.isDrag = isDrag
        this.numberLock = numberLock
        this.corlorWire = colorWire
        this.isStar = isStar
        if (isStar == true) {
            this.initStar()
        }
        else {
            this.star.active = false
        }
        if (numberLock > 0) {
            this.initLock()
        }
        else {
            this.lock.node.active = false
        }
        if (isKey == true) {
            this.key.active = true
            this.initKey()
        }
        else {
            this.key.active = false
        }
        this.scheduleOnce(() => {
            if (this.corlorWire.length > 0) {
                this.initWires()
            }
        }, 0.16)

        this.dragIndex = dragIndex

    }


    initWires() {
        let shape = this.getBlockShape()

        this.corlorWire.forEach(e => {
            let item = PoolManager.getInstance().getNode('WireBlock', this.wireNode)
            ResourcesManager.getInstance().setSprite("wire_" + e, item.getComponent(Sprite));
            item.name = "wire_" + e
        })

        this.wireNode.getComponent(CustomVerticalCenter).updateLayout()
        this.scheduleOnce(() => {
            for (let i = 0; i < shape.length; i++) {
                let hol = 0
                let margin = 0
                for (let j = 0; j < shape[i].length; j++) {
                    if (shape[i][j] == 0) {
                        margin += 100
                        continue
                    }
                    hol += 1


                }
                if (hol == 0) continue
                this.wireNode.children.forEach(e => {
                    // let pos = new Vec3(j * 100 + 100 / 2, )
                    // console.log(pos)
                    let y = i * 100 + 100 / 2
                    // icon.setPosition()
                    if (y + 50 >= e.position.y && e.position.y >= y - 50) {
                        let x = hol * 100 / 2
                        e.setPosition(x + margin, e.position.y)
                        e.getComponent(UITransform).setContentSize(new Size(100 * hol, 10))
                    }


                })
            }
        })
    }

    initKey() {
        let nodeTransform = this.node.getComponent(UITransform)
        let dirTransform = this.key.getComponent(UITransform)
        switch (this.idBlock) {
            case 1: case 2: case 3: case 4: case 5:
            case 18: case 19: case 20: case 21: case 23: case 22:
                this.key.setPosition((nodeTransform.width - dirTransform.width) / 2, (nodeTransform.height - dirTransform.height) / 2);
                break;

            case 7: case 9: case 13: case 14: case 17:
                this.key.setPosition((nodeTransform.width - dirTransform.width - BLOCK_SIZE) / 2, this.key.position.y);
                break;

            case 6: case 8: case 12: case 15: case 16:
                this.key.setPosition((nodeTransform.width - dirTransform.width + BLOCK_SIZE) / 2, this.key.position.y);
                break;

            case 11:
                this.key.setPosition((nodeTransform.width - dirTransform.width - BLOCK_SIZE * 2) / 2, this.key.position.y);
                break;

            case 10:
                this.key.setPosition((nodeTransform.width - dirTransform.width + BLOCK_SIZE * 2) / 2, this.dirNode.position.y);
                break;
        }
    }


    initLock() {
    ResourcesManager.getInstance().setSprite("lock_1" + "_" + this.idBlock, this.lock);
        this.lockLb.getComponent(Label).string = this.numberLock.toString()
        switch (this.idBlock) {
            case 1:
                this.lockLb.setPosition(new Vec3(48, 51, 0))
                break
            case 2:
                this.lockLb.setPosition(new Vec3(152, 46, 0))
                break
            case 3:
                this.lockLb.setPosition(new Vec3(48, 152, 0))
                break
            case 4:
                this.lockLb.setPosition(new Vec3(99, 46, 0))
                break
            case 5:
                this.lockLb.setPosition(new Vec3(48, 103, 0))
                break
            case 6:
                this.lockLb.setPosition(new Vec3(138, 124, 0))
                break
            case 7:
                this.lockLb.setPosition(new Vec3(71, 101, 0))
                break
            case 8:
                this.lockLb.setPosition(new Vec3(101, 49, 0))
                break
            case 9:
                this.lockLb.setPosition(new Vec3(100, 55, 0))
                break
            case 10:
                this.lockLb.setPosition(new Vec3(252, 110, 0))
                break
            case 11:
                this.lockLb.setPosition(new Vec3(84, 138, 0))
                break
            case 12:
                this.lockLb.setPosition(new Vec3(149, 158, 0))
                break
            case 13:
                this.lockLb.setPosition(new Vec3(49, 149, 0))
                break
            case 14:
                this.lockLb.setPosition(new Vec3(44, 166, 0))
                break
            case 15:
                this.lockLb.setPosition(new Vec3(15, 29, 0))
                break
            case 16:
                this.lockLb.setPosition(new Vec3(146, 160, 0))
                break
            case 17:
                this.lockLb.setPosition(new Vec3(51, 145, 0))
                break
            case 18:
                this.lockLb.setPosition(new Vec3(143, 146, 0))
                break
            case 19:
                this.lockLb.setPosition(new Vec3(163, 44, 0))
                break
            case 20:
                this.lockLb.setPosition(new Vec3(150, 150, 0))
                break
            case 21:
                this.lockLb.setPosition(new Vec3(96, 100, 0))
                break
            case 22:
                this.lockLb.setPosition(new Vec3(50, 200, 0))
                break
            case 23:
                this.lockLb.setPosition(new Vec3(203, 48, 0))
                break

        }
    }

    initStar() {
        this.star.active = true
        ResourcesManager.getInstance().setSprite(`block_star_3_${this.idBlock}`, this.star.getComponent(Sprite));
    }
    initListColor(colors: number[]) {
        if (colors.length == 0) return
        colors.forEach((e, index) => {
            let newIcon = PoolManager.getInstance().getNode("blockInner", this.listColor)
            ResourcesManager.getInstance().setSprite(`block_inner_${e}_${this.idBlock}`, newIcon.getComponent(Sprite));
        })
    }

    initDir() {
        if (this.director == 0) {
            this.dirNode.active = false
        } else {
            /**
             * Vertical
             */
            const nodeTransform = this.node.getComponent(UITransform)!;
            const dirTransform = this.dirNode.getComponent(UITransform)!;
            const sprite = this.dirNode.getComponent(Sprite)!;
            ResourcesManager.getInstance().setSprite(`PA_Up_Down_1_${this.director}`, sprite);
            if (this.director === 1) {
                this.dirNode.active = true
                this.dirNode.getComponent(UITransform).height = this.node.getComponent(UITransform).height


                // Vertical
                this.dirNode.active = true;

                switch (this.idBlock) {
                    case 1: case 2: case 3: case 4: case 5:
                    case 18: case 19: case 20: case 21: case 23: case 22:
                        this.dirNode.setPosition((nodeTransform.width - dirTransform.width) / 2, this.dirNode.position.y);
                        break;

                    case 7: case 9: case 13: case 14: case 17:
                        this.dirNode.setPosition((nodeTransform.width - dirTransform.width - BLOCK_SIZE) / 2, this.dirNode.position.y);
                        break;

                    case 6: case 8: case 12: case 15: case 16:
                        this.dirNode.setPosition((nodeTransform.width - dirTransform.width + BLOCK_SIZE) / 2, this.dirNode.position.y);
                        break;

                    case 11:
                        this.dirNode.setPosition((nodeTransform.width - dirTransform.width - BLOCK_SIZE * 2) / 2, this.dirNode.position.y);
                        break;

                    case 10:
                        this.dirNode.setPosition((nodeTransform.width - dirTransform.width + BLOCK_SIZE * 2) / 2, this.dirNode.position.y);
                        break;
                }

            } else if (this.director === 2) {
                // Horizontal
                this.dirNode.active = true;
                this.dirNode.getComponent(UITransform).width = this.node.getComponent(UITransform).width
                switch (this.idBlock) {
                    case 1: case 2: case 3: case 4: case 5:
                    case 16: case 17: case 20: case 21: case 23: case 22:
                        this.dirNode.setPosition(this.dirNode.position.x, (nodeTransform.height - dirTransform.height) / 2);
                        break;

                    case 7: case 6: case 18: case 10: case 11:
                        this.dirNode.setPosition(this.dirNode.position.x, (nodeTransform.height - dirTransform.height + BLOCK_SIZE) / 2);
                        break;

                    case 9: case 10: case 16: case 22: case 19:
                        this.dirNode.setPosition(this.dirNode.position.x, (nodeTransform.height - dirTransform.height - BLOCK_SIZE) / 2);
                        break;

                    case 11: case 19: case 14: case 15:
                        this.dirNode.setPosition(this.dirNode.position.x, (nodeTransform.height - dirTransform.height + BLOCK_SIZE * 2) / 2);
                        break;

                    // case 20:
                    //     this.dirNode.setPosition(this.dirNode.position.x, (nodeTransform.height - dirTransform.height - BLOCK_SIZE * 2) / 2);
                    //     break;
                }
            }

            // Set sprite frame

        }
    }

    initSprite() {
        let size = new Size()
        let offSet = new Vec2()
        switch (this.idBlock) {
            case 1:
                size = new Size(100, 100)
                offSet = new Vec2(50, 50)
                break
            case 2:
                size = new Size(300, 100)
                offSet = new Vec2(150, 50)
                break
            case 3:
                size = new Size(100, 300)
                offSet = new Vec2(50, 150)
                break
            case 4:
                size = new Size(200, 100)
                offSet = new Vec2(50, 50)
                break
            case 5:
                size = new Size(100, 200)
                offSet = new Vec2(50, 100)
                break
            case 6:
            case 7:
            case 8:
            case 9:
                size = new Size(200, 200)
                offSet = new Vec2(100, 100)
                break
            case 10:
            case 11:
                size = new Size(300, 200)
                offSet = new Vec2(150, 100)
                break
            case 12:
            case 13:
            case 14:
            case 15:
                size = new Size(200, 300)
                offSet = new Vec2(100, 150)
                break
            case 16:
            case 17:
                size = new Size(200, 300)
                offSet = new Vec2(100, 150)
                break
            case 18:
            case 19:
                size = new Size(300, 200)
                offSet = new Vec2(150, 100)
                break
            case 20:
                size = new Size(300, 300)
                offSet = new Vec2(150, 100)
                break
            case 21:
                size = new Size(200, 200)
                offSet = new Vec2(100, 100)
                break
            case 22:
                size = new Size(100, 400)
                offSet = new Vec2(50, 200)
                break
            case 23:
                size = new Size(400, 100)
                offSet = new Vec2(200, 50)
                break
        }


        this.node.getComponent(UITransform).setContentSize(size)
        // this.icon.getComponent(UITransform).setContentSize(size)
        this.wireNode.getComponent(UITransform).setContentSize(size)

    this.mask.getComponent(UITransform).setContentSize(size)
    ResourcesManager.getInstance().setSprite(`block_${this.idColor}_${this.idBlock}`, this.icon);
    }


    GenerateDataBlock() {

    }

    onClick() {
        Tools.getInstance().blocSelect = this.node
    }
    initIce(iceNumber) {
        if (iceNumber == 0) return
        this.freezeLb.node.active = true
        this.freezeLb.string = iceNumber
        this.freezeLb.node.position = new Vec3(this.node.getComponent(UITransform).width / 2, this.node.getComponent(UITransform).height / 2)
    let newIcon = instantiate(this.icon.node)
    this.listColor.addChild(newIcon)
    ResourcesManager.getInstance().setSprite(`block_11_${this.idBlock}`, newIcon.getComponent(Sprite));
        // this.freeNode = newIcon
        let nodeTransform = this.node.getComponent(UITransform)
        let dirTransform = this.freezeLb.node.getComponent(UITransform)
        switch (this.idBlock) {
            case 1: case 2: case 3: case 4: case 5:
            case 18: case 19: case 20: case 21: case 23: case 22:
                this.freezeLb.node.setPosition((nodeTransform.width - dirTransform.width) / 2, (nodeTransform.height - dirTransform.height) / 2);
                break;

            case 7: case 9: case 13: case 14: case 17:
                this.freezeLb.node.setPosition((nodeTransform.width - dirTransform.width - BLOCK_SIZE) / 2, this.freezeLb.node.position.y);
                break;

            case 6: case 8: case 12: case 15: case 16:
                this.freezeLb.node.setPosition((nodeTransform.width - dirTransform.width + BLOCK_SIZE) / 2, this.freezeLb.node.position.y);
                break;

            case 11:
                this.freezeLb.node.setPosition((nodeTransform.width - dirTransform.width - BLOCK_SIZE * 2) / 2, this.freezeLb.node.position.y);
                break;

            case 10:
                this.freezeLb.node.setPosition((nodeTransform.width - dirTransform.width + BLOCK_SIZE * 2) / 2, this.dirNode.position.y);
                break;
        }
    }

    GenerateData() {
        return {
            "typeIndex": this.idBlock,
            "colorIndex": this.idColor,
            "iceNumber": this.ice,
            "colorList": this.idColorSub == 0 ? [] : [this.idColorSub],
            "dir": this.director,
            "x": this.col,
            "y": this.row,
            "isKey": this.isKey,
            "isDrag": this.isDrag,
            "lockNumber": this.numberLock,
            "colorWire": this.corlorWire,
            "isStar": this.isStar
        }
    }


    public getBlockShape(): number[][] {
        switch (this.idBlock) {
            case 1: // Block 1x1
                return [
                    [1]
                ];
            case 2:
                return [
                    [1, 1, 1]
                ];
            case 3:
                return [
                    [1],
                    [1],
                    [1]
                ];
            case 4:
                return [
                    [1, 1]
                ];
            case 5:
                return [
                    [1],
                    [1]
                ];
            case 6:
                return [
                    [0, 1],
                    [1, 1]
                ];
            case 7:
                return [
                    [1, 0],
                    [1, 1]
                ];
            case 8:
                return [
                    [1, 1],
                    [0, 1]
                ];
            case 9:
                return [
                    [1, 1],
                    [1, 0]
                ];
            case 10:
                return [
                    [0, 0, 1],
                    [1, 1, 1]
                ]
            case 11:
                return [
                    [1, 0, 0],
                    [1, 1, 1]
                ]
            case 12:
                return [
                    [1, 1],
                    [0, 1],
                    [0, 1]
                ]
            case 13:
                return [
                    [1, 1],
                    [1, 0],
                    [1, 0]
                ]
            case 14:
                return [
                    [1, 0],
                    [1, 0],
                    [1, 1]
                ]
            case 15:
                return [
                    [0, 1],
                    [0, 1],
                    [1, 1]
                ]
            case 16:
                return [
                    [0, 1],
                    [1, 1],
                    [0, 1]
                ]
            case 17:
                return [
                    [1, 0],
                    [1, 1],
                    [1, 0]
                ]
            case 18:
                return [
                    [0, 1, 0],
                    [1, 1, 1]
                ]
            case 19:
                return [
                    [1, 1, 1],
                    [0, 1, 0]
                ]
            case 20:
                return [
                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 1, 0]
                ];
            case 21:
                return [
                    [1, 1],
                    [1, 1],

                ];
            case 22:
                return [
                    [1],
                    [1],
                    [1],
                    [1]
                ];
            case 23:
                return [
                    [1, 1, 1, 1]
                ];
        }
    }
}


