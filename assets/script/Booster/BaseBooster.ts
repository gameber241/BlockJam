import { _decorator, CCInteger, Component, director, Input, Label, Node, sys } from 'cc';
import { IngameLogic } from '../ingame/IngameLogic';
import { DataManager } from '../DataManager';
import { BuyBooster } from './BuyBooster';
import { BlockJamManager } from '../Manager/BlockJamManager';
import { AudioManager } from '../Manager/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('BaseBooster')
export class BaseBooster extends Component {
    @property(Node)
    plusIcon: Node = null
    @property(Node)
    quantity: Node = null

    @property(CCInteger)
    typeBooster: number = 0


    quantityNB = 0
    protected onEnable(): void {
        this.node.setPosition(this.node.position.x, 0, 0)

        this.updateQuantity()
        director.on("UPDATE_BOOSTER", this.updateQuantity, this)



    }


    onclick() {
        AudioManager.getInstance().playButtonClickPop();
        if (IngameLogic.getInstance().isUseTool == true) return false
        if (this.quantityNB <= 0) {
            BuyBooster.getInstance().Show(this.typeBooster)
            return false
        }
        IngameLogic.getInstance().isUseTool = true
        DataManager.SaveBooster(this.typeBooster, -1)
        this.node.setPosition(this.node.position.x, 20, 0)
        director.emit("UPDATE_BOOSTER")
        return true

    }

    updateQuantity() {
        // Kiểm tra null để tránh lỗi khi node chưa được gán
        if (!this.plusIcon || !this.quantity) {
            console.warn(`BaseBooster: plusIcon hoặc quantity chưa được gán trong Inspector cho booster type ${this.typeBooster}`);
            return;
        }

        let quantityNb = DataManager.getBooster(this.typeBooster)
        this.quantityNB = quantityNb
        if (quantityNb > 0) {
            this.plusIcon.active = false
            this.quantity.active = true

            const label = this.quantity.getComponent(Label);
            if (label) {
                label.string = quantityNb.toString();
            }
        }
        else {
            this.plusIcon.active = true
            this.quantity.active = false
        }

    }

    protected onDisable(): void {
        director.off("UPDATE_BOOSTER", this.updateQuantity)


    }

    protected onDestroy(): void {

    }

}

