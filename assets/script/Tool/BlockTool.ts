import { _decorator, Component, Node, Sprite, UITransform, Vec2, Size, Label, Vec3, instantiate } from 'cc';
import { ResourcesManager } from '../Manager/ResourcesManager';
import { Tools } from './Tools';
import { BLOCK_SIZE } from '../ingame/IngameLogic';
import { PoolManager } from '../Manager/PoolManager';
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


    col: number = 0
    row: number = 0
    idBlock = 0
    idColor = 0
    director = 0
    idColorSub
    ice = 0
    init(col, row, idBlock, idColor, director, idColorSub, ice) {
        console.log(col, row, idBlock, idColor, director)
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
    }
    initListColor(colors: number[]) {
        if (colors.length == 0) return
        colors.forEach((e, index) => {
            let newIcon = PoolManager.getInstance().getNode("blockInner", this.listColor)
            newIcon.getComponent(Sprite).spriteFrame = ResourcesManager.getInstance().getSprite(`block_inner_${e}_${this.idBlock}`)
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
            sprite.spriteFrame = ResourcesManager.getInstance().getSprite(`PA_Up_Down_1_${this.director}`);
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

        this.mask.getComponent(UITransform).setContentSize(size)
        this.icon.getComponent(Sprite).spriteFrame = ResourcesManager.getInstance().getSprite(`block_${this.idColor}_${this.idBlock}`)
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
        newIcon.getComponent(Sprite).spriteFrame = ResourcesManager.getInstance().getSprite(`block_11_${this.idBlock}`)
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
}


