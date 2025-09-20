import { _decorator, Component, Label, Node } from 'cc';
import { BlockJamManager } from '../Manager/BlockJamManager';
const { ccclass, property } = _decorator;

@ccclass('WinSubHeart')
export class WinSubHeart extends Component {
    @property(Label)
    level: Label = null


    protected onEnable(): void {
        this.level.string = "Level" + BlockJamManager.getInstance().level
    }

    callback = null
    init(callback) {
        this.callback = callback
    }

    btnRetry() {
        if (BlockJamManager.getInstance().heartSystem.currentHearts == 0) {
            BlockJamManager.getInstance().ShowREfill()
            return
        }
        this.callback()
        this.BtnClose()
        BlockJamManager.getInstance().heartSystem.useHeart()
    }

    BtnClose() {
        this.node.active = false
    }
}

