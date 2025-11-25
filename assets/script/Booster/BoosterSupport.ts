import { _decorator, CCInteger, Component, director, Label, Node } from 'cc';
import { IngameLogic } from '../ingame/IngameLogic';
import { BuyBooster } from './BuyBooster';
import { DataManager } from '../DataManager';
import { BlockJamManager } from '../Manager/BlockJamManager';
import { MenuLayer } from '../ui/MenuLayer';
const { ccclass, property } = _decorator;

@ccclass('BoosterSupport')
export class BoosterSupport extends Component {
    @property(Node)
    plusIcon: Node = null
    @property(Node)
    quantity: Node = null

    @property(CCInteger)
    typeBooster: number = 0


    quantityNB = 0
    protected onEnable(): void {
        this.isTick = false
        this.tick.active = false
        this.updateQuantity()
        director.on("UPDATE_BOOSTER_SUPPORT", this.updateQuantity, this)



    }

    @property(Node)
    tick: Node = null

    isTick = false

    onclick(): boolean {
        if (this.isTick == false) {
            if (this.quantityNB <= 0) {
                BuyBooster.getInstance().Show(this.typeBooster, true)
                return
            }
            this.tick.active = true
            this.quantity.active = false
            this.isTick = true
            MenuLayer.getInstance().idBoosters.push(this.typeBooster)
        }
        else {
            this.isTick = false
            this.tick.active = false
            this.quantity.active = true
            let index = MenuLayer.getInstance().idBoosters.findIndex(e => e == this.typeBooster)
            MenuLayer.getInstance().idBoosters.splice(index, 1)
        }

    }

    updateQuantity() {
        // Kiểm tra null để tránh lỗi khi node chưa được gán
        if (!this.plusIcon || !this.quantity) {
            console.warn(`BaseBooster: plusIcon hoặc quantity chưa được gán trong Inspector cho booster type ${this.typeBooster}`);
            return;
        }

        let quantityNb = DataManager.getBoosterSupport()[BlockJamManager.getInstance().level][this.typeBooster]
        console.log(quantityNb)
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
        director.off("UPDATE_BOOSTER_SUPPORT", this.updateQuantity)


    }

    protected onDestroy(): void {

    }
}

