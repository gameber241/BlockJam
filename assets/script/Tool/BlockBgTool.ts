import { _decorator, Color, Component, Input, Node, Sprite, UIOpacity } from 'cc';
import { Tools } from './Tools';
import { COLORblOCK } from './SelectColorBlock';
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
        if (Tools.getInstance().isChooseEmpltyWall == true) {
            if (Tools.getInstance().board[this.row][this.col] == 0) {
                Tools.getInstance().board[this.row][this.col] = 1
                this.node.getComponent(Sprite).color = Color.WHITE
            }
            else {
                Tools.getInstance().board[this.row][this.col] = 0
                this.node.getComponent(Sprite).color = Color.BLUE
            }
        }
        else {
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




    }
    update(deltaTime: number) {

    }
}


