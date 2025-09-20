import { _decorator, Component, director, Label, Node } from 'cc';
import { BlockJamManager } from './BlockJamManager';
const { ccclass, property } = _decorator;

@ccclass('PopupRefillYoutLife')
export class PopupRefillYoutLife extends Component {
    @property(Label)
    heart: Label = null

    @property(Label)
    time: Label = null

    protected onEnable(): void {
        this.UpdateHeartUI()
        director.on("UpDateHeart", this.UpdateHeartUI, this)
    }

    protected onDestroy(): void {
        director.off("UpDateHeart", this.UpdateHeartUI, this)
    }

    UpdateHeartUI() {
        if (BlockJamManager.getInstance().heartSystem.currentHearts >= BlockJamManager.getInstance().heartSystem.maxHearts) {
            this.time.string = "FULL"
        }
        else {
            this.time.string = BlockJamManager.getInstance().heartSystem.getTimeStringToNextHeart()
        }

        this.heart.string = BlockJamManager.getInstance().heartSystem.getHearts().toString()
    }
    BtnREfill() {
        if (BlockJamManager.getInstance().heartSystem.currentHearts < BlockJamManager.getInstance().heartSystem.maxHearts) {
            if (BlockJamManager.getInstance().coin > 900) {
                BlockJamManager.getInstance().updateScore(-900)
                BlockJamManager.getInstance().heartSystem.addHeart(1)
                this.node.destroy()
            }
        }
    }

    BtnClose() {
        this.node.destroy()
    }
}


