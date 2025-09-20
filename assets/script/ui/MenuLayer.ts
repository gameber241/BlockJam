import { _decorator, Component, director, Label, Node, ScrollView, Sprite } from 'cc';
import { BlockJamManager } from '../Manager/BlockJamManager';
import { PoolManager } from '../Manager/PoolManager';
import { ResourcesManager } from '../Manager/ResourcesManager';
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

    @property(Sprite)
    frame: Sprite = null

    @property(Sprite)
    avatar: Sprite = null


    protected onEnable(): void {
        this.UpdateHeartUI()
        this.UpdateCoin()
        director.on("UpDateHeart", this.UpdateHeartUI, this)
        this.rendorLevelPreview()
        this.levelInf.active = false
    }

    UpdateInf() {
        this.frame.spriteFrame = ResourcesManager.getInstance().getSprite("frame" + (BlockJamManager.getInstance().frame + 1))
        this.avatar.spriteFrame = ResourcesManager.getInstance().getSprite("person" + (BlockJamManager.getInstance().avatar + 1))
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
        if (BlockJamManager.getInstance().heartSystem.currentHearts == 0) {
            BlockJamManager.getInstance().ShowREfill()
            
            return
        }
        BlockJamManager.getInstance().PlayGame()
    }

    btnProfile() {
        BlockJamManager.getInstance().ShowProfile()
    }

    btnShowRefillHeart() {
        BlockJamManager.getInstance().ShowREfill()
    }
}


