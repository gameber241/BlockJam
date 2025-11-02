import { _decorator, Component, Node } from 'cc';
import { BaseBooster } from './BaseBooster';
import { BuyBooster } from './BuyBooster';
import { MenuLayer } from '../ui/MenuLayer';
const { ccclass, property } = _decorator;

@ccclass('Booster_Freeze_Menu')
export class Booster_Freeze_Menu extends BaseBooster {
    @property(Node)
    tick: Node = null

    isTick = false
    onclick() {
        if (this.isTick == false) {
            if (this.quantityNB <= 0) {
                BuyBooster.getInstance().Show(this.typeBooster)
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
}

