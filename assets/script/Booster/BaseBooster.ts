import { _decorator, CCInteger, Component, director, Input, Label, Node, sys } from 'cc';
import { IngameLogic } from '../ingame/IngameLogic';
import { DataManager } from '../DataManager';
const { ccclass, property } = _decorator;

@ccclass('BaseBooster')
export class BaseBooster extends Component {
    btnAdd: Node = null
    quantity: Node = null

    @property(CCInteger)
    typeBooster: number = 0


    quantityNB = 0
    protected start(): void {
        this.btnAdd = this.node.getChildByName("add")
        this.quantity == this.node.getChildByName("quantity")
        // this.node.on(Input.EventType.TOUCH_END, this.onclick, this)
        this.updateQuantity()
        director.on("UPDATE_BOOSTER", this.updateQuantity)



    }


    onclick() {
        if (this.quantityNB <= 0) {
            IngameLogic.getInstance().buyBooster.Show(this.typeBooster)
            return
        }
        if (IngameLogic.getInstance().isUseTool == true) return
        IngameLogic.getInstance().isUseTool = true
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

    protected onDestroy(): void {
        director.off("UPDATE_BOOSTER", this.updateQuantity)

    }

}

