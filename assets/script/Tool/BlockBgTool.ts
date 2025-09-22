import { _decorator, Component, Input, Node } from 'cc';
import { Tools } from './Tools';
const { ccclass, property } = _decorator;

@ccclass('BlockBgTool')
export class BlockBgTool extends Component {
    start() {
        this.node.on(Input.EventType.TOUCH_END, this.onClick, this)
    }


    col: number = 0
    row: number = 0
    isClick = false
    isClickWall = false
    isExit = false
    init(col, row) {
        this.col = col
        this.row = row
    }
    onClick() {
        if (this.isClick == true) {
            Tools.getInstance().colSelect = this.col
            Tools.getInstance().rowSelect = this.row
            Tools.getInstance().CreateBlock()
        }
        else {
            if (this.isClickWall == true) {
                Tools.getInstance().colSelect = this.col
                Tools.getInstance().rowSelect = this.row
                Tools.getInstance().CreateWall()
            }
            else {
                if (this.isExit == true) {
                    Tools.getInstance().colSelect = this.col
                    Tools.getInstance().rowSelect = this.row
                    Tools.getInstance().CreateExit()
                }

            }
        }


    }
    update(deltaTime: number) {

    }
}


