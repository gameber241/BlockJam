import { _decorator, Component, Node, Vec3 } from 'cc';
import { BLOCK_SIZE } from '../ingame/IngameLogic';
const { ccclass, property } = _decorator;

@ccclass('WallTool')
export class WallTool extends Component {
    col: number = 0
    row: number = 0
    id
    init(id, pos: Vec3, col, row) {
        this.id = id
        this.col = col
        this.row = row
        switch (id) {
            case 1:  //tren
                this.node.setPosition(pos.x, pos.y + BLOCK_SIZE)
                break
            case 2: //duoi
                this.node.setPosition(pos.x, pos.y - BLOCK_SIZE)
                break
            case 4: //trai
                this.node.setPosition(pos.x + BLOCK_SIZE, pos.y)
                break
            case 3: //phai
                this.node.setPosition(pos.x - BLOCK_SIZE, pos.y)
                break
            case 5:
                this.node.setPosition(pos.x - BLOCK_SIZE, pos.y + BLOCK_SIZE)
                break
            case 6:
                this.node.setPosition(pos.x + BLOCK_SIZE, pos.y + BLOCK_SIZE)
                break

            case 7:
                this.node.setPosition(pos.x + BLOCK_SIZE, pos.y - BLOCK_SIZE)
                break

            case 8:
                this.node.setPosition(pos.x - BLOCK_SIZE, pos.y - BLOCK_SIZE)
                break

            case 10:
                this.node.setPosition(pos.x, pos.y)
                break
            case 11:
                this.node.setPosition(pos.x, pos.y)
                break
            case 12:
                this.node.setPosition(pos.x, pos.y)
                break
            case 13:
                this.node.setPosition(pos.x, pos.y)
                break
            case 14:
                this.node.setPosition(pos.x, pos.y)
                break
        }
    }
    GenerateData() {
        return { id: this.id, x: this.col, y: this.row }
    }
}


