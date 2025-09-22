import { _decorator, Component, Node, Size, Sprite, UITransform, v3, Vec3 } from 'cc';
import { BLOCK_SIZE } from '../ingame/IngameLogic';
import { ResourcesManager } from '../Manager/ResourcesManager';
const { ccclass, property } = _decorator;

@ccclass('ExitTool')
export class ExitTool extends Component {
    id; col; row; size; color
    init(id, col, row, size, color) {
        this.size = size
        this.id = id
        this.col = col
        this.row = row
        let sizeNode = new Size()
        let pos = new Vec3()
        let sizeColliderNode = new Size()
        let posCollider = new Vec3()
        let sizeCollider = new Size()
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
                sizeColliderNode = new Size(sizeNode.width - 20, BLOCK_SIZE)
                posCollider = v3(10, 0)
                sizeCollider = new Size(sizeNode.width - 20, BLOCK_SIZE)
                break;
        }

        this.node.getComponent(UITransform).setContentSize(sizeNode)
        this.node.setPosition(pos)


        this.node.getComponent(Sprite).spriteFrame = ResourcesManager.getInstance().getSprite(`exit_${color}_${this.id}`)

    }
}


