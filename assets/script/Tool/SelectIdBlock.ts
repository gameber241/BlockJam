import { _decorator, Component, Input, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { Tools } from './Tools';
import { ResourcesManager } from '../Manager/ResourcesManager';
const { ccclass, property } = _decorator;

@ccclass('SelectIdBlock')
export class SelectIdBlock extends Component {
    @property(Prefab)
    itemIdBlock: Prefab = null

    idSelect

    protected start(): void {

    }

    init() {
        for (let i = 0; i < 23; i++) {
            let item = instantiate((this.itemIdBlock))
            this.node.addChild(item)
            item.children[0].getComponent(Sprite).spriteFrame = ResourcesManager.getInstance().getSprite(`block_1_${i + 1}`)
            item.on(Input.EventType.TOUCH_END, () => {

                if (this.idSelect == i + 1) {
                    this.node.setSiblingIndex(999)
                    this.node.children.forEach(e => {
                        e.active = true
                    })
                }
                else {
                    this.node.children.forEach(e => {
                        e.active = false
                    })
                    this.idSelect = i + 1
                    item.active = true
                    Tools.getInstance().idBlock = this.idSelect
                }

            }, this)

            item.active = false
            if (i == 0) {
                item.active = true
                this.idSelect = i + 1
                Tools.getInstance().idBlock = this.idSelect

            }

        }
    }
}


