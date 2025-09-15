import { _decorator, Component, director, Label, Node, ScrollView } from 'cc';
import { BlockJamManager } from '../Manager/BlockJamManager';
import { PoolManager } from '../Manager/PoolManager';
const { ccclass, property } = _decorator;

@ccclass('MenuLayer')
export class MenuLayer extends Component {
    @property(Node)
    levelPreivews: Node = null

    @property(Label)
    timeAddHeart: Label = null

    @property(Label)
    numberCoin: Label = null

    @property(Label)
    numberHeart: Label = null


    @property(Node)
    uiShop: Node = null

    @property(Node)
    uiSetting: Node = null

    @property(Node)
    levelInf: Node = null

    @property(ScrollView)
    scrollLevel: ScrollView = null

    @property(Label)
    titleLevelInf: Label = null

    protected onEnable(): void {
        this.UpdateHeartUI()
        this.UpdateCoin()
        director.on("UpDateHeart", this.UpdateHeartUI, this)
        this.rendorLevelPreview()
        this.levelInf.active = false
    }

    protected onDisable(): void {
        director.off("UpDateHeart", this.UpdateHeartUI, this)
    }

    UpdateHeartUI() {
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
        this.levelPreivews.children.forEach((levelNode, i) => {
            console.log(levelNode)
            const label = levelNode.getChildByName('Label').getComponent(Label)
            label.string = `${BlockJamManager.getInstance().level + i}`
        })
    }

    BtnLevelCurent() {
        // 
        this.levelInf.active = true
        this.titleLevelInf.string = "LEVEL " + "\n" + BlockJamManager.getInstance().level
    }


    shop = null
    BtnShop() {
        if (this.shop == null) {
            this.shop = PoolManager.getInstance().getNode("Shop", this.uiShop)
        }
        this.uiShop.active = true
        this.scrollLevel.node.active = false
        this.uiSetting.active = false
    }

    setting = null
    BtnSetting() {
        if (this.setting == null) {
            this.setting = PoolManager.getInstance().getNode("Setting", this.uiSetting)
        }
        this.uiSetting.active = true
        this.uiShop.active = false
        this.scrollLevel.node.active = false
    }


    BtnLevel() {
        this.uiShop.active = false
        this.uiSetting.active = false
        this.scrollLevel.node.active = true
    }



    BtnHideLevelInf() {
        this.levelInf.active = false
    }


    BtnPlayGame() {
        BlockJamManager.getInstance().PlayGame()
    }
}


