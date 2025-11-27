import { _decorator, Component, Input, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { Tools } from './Tools';
import { ResourcesManager } from '../Manager/ResourcesManager';
const { ccclass, property } = _decorator;
export enum EXIT {
    EXIT1 = 0,
    EXIT2 = 1,
    EXIT3 = 2,
    EXIT4 = 3
}
@ccclass('SelectIdExit')
export class SelectIdExit extends Component {
    @property(Prefab)
    itemIdBlock: Prefab = null

    idSelect

    protected start(): void {

    }

    init() {
        for (const key of Object.keys(EXIT)) {
            const value = EXIT[key as keyof typeof EXIT];
            if (typeof value !== "number") continue;

            const item = instantiate(this.itemIdBlock);
            this.node.addChild(item);

            // Gán màu cho item
            ResourcesManager.getInstance().setSprite(`exit_${1}_${value}`, item.children[0].getComponent(Sprite));

            // Bắt sự kiện click
            item.on(Input.EventType.TOUCH_END, () => {
                if (this.idSelect === value) {
                    this.node.setSiblingIndex(999)
                    this.node.children.forEach(e => e.active = true);
                } else {
                    this.node.children.forEach(e => e.active = false);
                    this.idSelect = value;
                    item.active = true;
                    Tools.getInstance().idExit = this.idSelect
                }
            }, this);

            // Ẩn tất cả item lúc đầu, chỉ cho item màu NAU hiện
            item.active = (value === EXIT.EXIT1);
            if (item.active) {
                this.idSelect = value;
                Tools.getInstance().idExit = this.idSelect
            }
        }

    }

}


