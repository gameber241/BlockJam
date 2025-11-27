import { _decorator, Component, Input, Node, Sprite } from 'cc';
import { ResourcesManager } from '../Manager/ResourcesManager';
import { ProfileManager } from './ProfileManager';
const { ccclass, property } = _decorator;

@ccclass('FrameProfile')
export class FrameProfile extends Component {
    @property(Sprite)
    icon: Sprite = null

    id: number = 0
    init(id) {
        this.id = id
        //let sp = ResourcesManager.getInstance().getSprite("frame" + (id + 1))
        //this.icon.spriteFrame = sp

        ResourcesManager.getInstance().setSprite("frame" + (id + 1), this.icon);

        this.node.on(Input.EventType.TOUCH_END, () => {
            ProfileManager.getInstance().changeFrame(this.id)
        }, this)
    }
}


