import { _decorator, Color, Component, director, Label, Node } from 'cc';
import { BlockJamManager } from '../Manager/BlockJamManager';
import { DataManager } from '../DataManager';
import { BaseSingleton } from '../Base/BaseSingleton';
const { ccclass, property } = _decorator;

@ccclass('BuyBooster')
export class BuyBooster extends BaseSingleton<BuyBooster> {
    @property(Node)
    buyBoosters: Node = null

    @property(Label)
    buyLb: Label = null
    typeBooster

    @property([Number])
    prices: number[] = [200, 400, 600, 900]
    protected start(): void {

    }

    isSuppor = false
    Show(typeBooster, isSupport = false) {
        this.typeBooster = typeBooster
        this.isSuppor = isSupport
        this.node.active = true
        this.buyBoosters.children.forEach(e => e.active = false)
        this.buyBoosters.children[typeBooster].active = true
        let boosterPrice = this.prices[typeBooster]
        this.buyLb.string = boosterPrice.toString()


        if (BlockJamManager.getInstance().coin >= boosterPrice) {
            this.buyLb.color = Color.WHITE
        }
        else {
            this.buyLb.color = Color.RED
        }
    }

    btnBuy() {
        let boosterPrice = this.prices[this.typeBooster];
        if (BlockJamManager.getInstance().coin >= boosterPrice) {
            BlockJamManager.getInstance().updateScore(-boosterPrice)
            if (this.isSuppor == false) {
                DataManager.SaveBooster(this.typeBooster, 1)
                director.emit("UPDATE_BOOSTER")

            }
            else {
                DataManager.SaveBoosterSupport(this.typeBooster, BlockJamManager.getInstance().level, 1)
                director.emit("UPDATE_BOOSTER_SUPPORT")
            }
            this.node.active = false
        }
    }


    btnClose() {
        this.node.active = false
    }
}

