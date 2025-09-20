import { _decorator, Component, Input, Node, Sprite } from 'cc';
import { PoolManager } from '../Manager/PoolManager';
import { ResourcesManager } from '../Manager/ResourcesManager';
import { ProfileManager } from './ProfileManager';
const { ccclass, property } = _decorator;

@ccclass('FrameAvatarProfile')
export class FrameAvatarProfile extends Component {
    @property(Sprite)
    icon: Sprite = null

    id: number = 0
    init(id) {
        this.id = id
        let sp = ResourcesManager.getInstance().getSprite("person" + (id + 1))
        this.icon.spriteFrame = sp

        this.node.on(Input.EventType.TOUCH_END, () => {
            ProfileManager.getInstance().changeAvatar(this.id)
        }, this)
    }
}


