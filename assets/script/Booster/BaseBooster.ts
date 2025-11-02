import { _decorator, CCInteger, Component, director, Input, Label, Node, sys } from 'cc';
import { IngameLogic } from '../ingame/IngameLogic';
import { DataManager } from '../DataManager';
import { BuyBooster } from './BuyBooster';
const { ccclass, property } = _decorator;

@ccclass('BaseBooster')
export class BaseBooster extends Component {
    btnAdd: Node = null
    quantity: Node = null

    @property(CCInteger)
    typeBooster: number = 0


    quantityNB = 0
    protected onEnable(): void {
        this.btnAdd = this.node.getChildByName("add")
        this.quantity = this.node.getChildByName("quantity")

        this.updateQuantity()
        director.on("UPDATE_BOOSTER", this.updateQuantity, this)



    }


    onclick() {
        if (IngameLogic.getInstance().isUseTool == true) return false
        if (this.quantityNB <= 0) {
            BuyBooster.getInstance().Show(this.typeBooster)
            return false
        }
        IngameLogic.getInstance().isUseTool = true
        DataManager.SaveBooster(this.typeBooster, -1)
        director.emit("UPDATE_BOOSTER")
        return true

    }

    updateQuantity() {
        let quantityNb = DataManager.getBooster(this.typeBooster)
        this.quantityNB = quantityNb
        if (quantityNb > 0) {
            this.btnAdd.active = false
            this.quantity.active = true
            this.quantity.getComponent(Label).string = quantityNb.toString()
        }
        else {
            this.btnAdd.active = true
            this.quantity.active = false
        }

    }

    protected onDisable(): void {
        director.off("UPDATE_BOOSTER", this.updateQuantity)


    }

    protected onDestroy(): void {

    }

}

