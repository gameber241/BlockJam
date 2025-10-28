import { _decorator, Component, Input, Node } from 'cc';
import { IngameLogic } from '../ingame/IngameLogic';
const { ccclass, property } = _decorator;

@ccclass('BaseBooster')
export class BaseBooster extends Component {
    protected start(): void {
        // this.node.on(Input.EventType.TOUCH_END, this.onclick, this)
    }


    onclick() {
        if (IngameLogic.getInstance().isUseTool == true) return
        IngameLogic.getInstance().isUseTool = true
    }
}

