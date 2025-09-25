import { _decorator, Component, Input, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { Tools } from './Tools';
import { ResourcesManager } from '../Manager/ResourcesManager';
const { ccclass, property } = _decorator;
export enum Wall {
    WAll_1 = 1,
    WAll_2 = 2,
    WAll_3 = 3,
    WAll_4 = 4,
    WAll_5 = 5,
    WAll_6 = 6,
    WAll_7 = 7,
    WAll_8 = 8,
    WAll_9 = 9,
    WAll_10 = 10,
    WAll_11 = 11,
    WAll_12 = 12,
    WAll_13 = 13,
    WAll_14 = 14,

}
@ccclass('SelectIdWall')
export class SelectIdWall extends Component {
    @property(Prefab)
    itemIdBlock: Prefab = null

    idSelect

    protected start(): void {

    }

    init() {
        for (const key of Object.keys(Wall)) {
            const value = Wall[key as keyof typeof Wall];
            if (typeof value !== "number") continue;

            const item = instantiate(this.itemIdBlock);
            this.node.addChild(item);

            // Gán màu cho item
            item.children[0].getComponent(Sprite).spriteFrame = ResourcesManager.getInstance().getSprite("wall_" + value)

            // Bắt sự kiện click
            item.on(Input.EventType.TOUCH_END, () => {
                if (this.idSelect === value) {
                    this.node.setSiblingIndex(999)
                    this.node.children.forEach(e => e.active = true);
                } else {
                    this.node.children.forEach(e => e.active = false);
                    this.idSelect = value;
                    item.active = true;
                    Tools.getInstance().idWall = this.idSelect
                }
            }, this);

            // Ẩn tất cả item lúc đầu, chỉ cho item màu NAU hiện
            item.active = (value === Wall.WAll_1);
            if (item.active) {
                this.idSelect = value;
                Tools.getInstance().idWall = this.idSelect
            }
        }

    }

}


