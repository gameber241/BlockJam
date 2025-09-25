import { _decorator, Component, Node, Size, Sprite, UITransform, v3, Vec3 } from 'cc';
import { BLOCK_SIZE } from '../ingame/IngameLogic';
import { ResourcesManager } from '../Manager/ResourcesManager';
const { ccclass, property } = _decorator;

@ccclass('ExitTool')
export class ExitTool extends Component {
    id; col; row; size; color; isStar
    init(id, col, row, size, color, isStar) {
        this.isStar = isStar
        this.size = size
        this.id = id
        this.col = col
        this.row = row
        let sizeNode = new Size()
        let pos = new Vec3()
        this.color = color

        switch (id) {
            case 0: // phai
                sizeNode = new Size(BLOCK_SIZE / 2, BLOCK_SIZE * this.size)
                pos = v3(this.node.position.x + BLOCK_SIZE, this.node.position.y)

                break;
            case 1: // trai
                sizeNode = new Size(BLOCK_SIZE / 2, BLOCK_SIZE * this.size)
                pos = v3(this.node.position.x - BLOCK_SIZE / 2, this.node.position.y)

                break;
            case 3: // up
                sizeNode = new Size(BLOCK_SIZE * this.size, BLOCK_SIZE / 2)
                pos = v3(this.node.position.x, this.node.position.y + BLOCK_SIZE)

                break;
            case 2: // down
                sizeNode = new Size(BLOCK_SIZE * this.size, BLOCK_SIZE / 2)
                pos = v3(this.node.position.x, this.node.position.y - BLOCK_SIZE / 2)
                break;
        }
        this.node.getComponent(Sprite).spriteFrame = ResourcesManager.getInstance().getSprite(`exit_${color}_${this.id}`)
        this.node.getComponent(UITransform).setContentSize(sizeNode)
        this.node.setPosition(pos)
    }


    GenerateData() {
        return {
            "typeIndex": this.id,
            "colorIndex": this.color,
            "x": this.col,
            "y": this.row,
            "size": this.size,
            "isStar": this.isStar
        }
    }
}


