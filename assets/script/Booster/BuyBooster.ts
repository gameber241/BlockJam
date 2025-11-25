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
    protected start(): void {

    }

    isSuppor = false
    Show(typeBooster, isSupport = false) {
        this.typeBooster = typeBooster
        this.isSuppor = isSupport
        this.node.active = true
        this.buyBoosters.children.forEach(e => e.active = false)
        this.buyBoosters.children[typeBooster].active = true


        if (BlockJamManager.getInstance().coin >= 900) {
            this.buyLb.color = Color.WHITE
        }
        else {
            this.buyLb.color = Color.RED
        }
    }

    btnBuy() {
        if (BlockJamManager.getInstance().coin >= 900) {
            BlockJamManager.getInstance().updateScore(-900)
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

