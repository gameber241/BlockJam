import { _decorator, Color, Component, director, Label, Node } from 'cc';
import { BlockJamManager } from '../Manager/BlockJamManager';
import { DataManager } from '../DataManager';
const { ccclass, property } = _decorator;

@ccclass('BuyBooster')
export class BuyBooster extends Component {
    @property(Node)
    buyBoosters: Node = null

    @property(Label)
    buyLb: Label = null
    typeBooster
    Show(typeBooster) {
        this.typeBooster = typeBooster
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
            DataManager.SaveBooster(this.typeBooster, 1)
            director.emit("UPDATE_BOOSTER")
            this.node.active = false
        }
    }


    btnClose() {
        this.node.active = false
    }
}

