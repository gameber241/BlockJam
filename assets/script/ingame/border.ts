import { _decorator, Component, Node, Vec3 } from 'cc';
import { BLOCK_SIZE } from './IngameLogic';
const { ccclass, property } = _decorator;

@ccclass('border')
export class border extends Component {

    init(id, pos: Vec3) {
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
            case 13:
                this.node.setPosition(pos.x, pos.y)
                break
            case 12:
                this.node.setPosition(pos.x, pos.y)
                break
            case 14:
                this.node.setPosition(pos.x, pos.y)
                break
        }
    }
}


