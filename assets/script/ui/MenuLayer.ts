import { _decorator, Component, director, Label, Node, ScrollView } from 'cc';
import { BlockJamManager } from '../Manager/BlockJamManager';
const { ccclass, property } = _decorator;

@ccclass('MenuLayer')
export class MenuLayer extends Component {
    @property(ScrollView)
    levelPreivews: ScrollView = null

    @property(Label)
    timeAddHeart: Label = null

    @property(Label)
    numberCoin: Label = null

    @property(Label)
    numberHeart: Label = null
    protected onEnable(): void {
        this.UpdateHeartUI()
        this.UpdateCoin()
        director.on("UpDateHeart", this.UpdateHeartUI, this)
        this.rendorLevelPreview()
    }

    protected onDisable(): void {
        director.off("UpDateHeart", this.UpdateHeartUI, this)
    }

    UpdateHeartUI() {
        console.log("den day")
        if (BlockJamManager.getInstance().heartSystem.currentHearts >= BlockJamManager.getInstance().heartSystem.maxHearts) {
            this.timeAddHeart.string = "FULL"
        }
        else {
            this.timeAddHeart.string = BlockJamManager.getInstance().heartSystem.getTimeStringToNextHeart()
        }

        this.numberHeart.string = BlockJamManager.getInstance().heartSystem.getHearts().toString()
    }

    UpdateCoin() {
        this.numberCoin.string = BlockJamManager.getInstance().coin.toString()
    }



    rendorLevelPreview() {
        this.levelPreivews.content.children.forEach((levelNode, i) => {
            console.log(levelNode)
            const label = levelNode.getChildByName('Label').getComponent(Label)
            label.string = `${BlockJamManager.getInstance().level + i}`
        })
    }

    BtnPlayGame() {
        BlockJamManager.getInstance().PlayGame()
    }
}


