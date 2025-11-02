import { _decorator, Color, Component, Input, instantiate, Label, Node, Prefab, Sprite } from 'cc';
import { Tools } from './Tools';
const { ccclass, property } = _decorator;

export enum Director {
    NONE = 0,
    DOC = 1,
    NGANG = 2.
}

@ccclass('SelecDirector')
export class SelecDirector extends Component {
    @property(Prefab)
    itemIdBlock: Prefab = null

    idSelect


    start() {
        // Loop qua các value của enum (chỉ lấy số, bỏ key string)
        for (const key of Object.keys(Director)) {
            const value = Director[key as keyof typeof Director];
            if (typeof value !== "number") continue;

            const item = instantiate(this.itemIdBlock);
            this.node.addChild(item);
            item.children[0].getComponent(Label).string = key
            // Gán màu cho item


            // Bắt sự kiện click
            item.on(Input.EventType.TOUCH_END, () => {
                if (this.idSelect === value) {
                    this.node.setSiblingIndex(999)
                    this.node.children.forEach(e => e.active = true);
                } else {
                    this.node.children.forEach(e => e.active = false);
                    this.idSelect = value;
                    item.active = true;
                    Tools.getInstance().idDirector = this.idSelect
                }
            }, this);

            // Ẩn tất cả item lúc đầu, chỉ cho item màu NAU hiện
            item.active = (value === Director.NONE);
            if (item.active) {
                this.idSelect = value;
                Tools.getInstance().idDirector = this.idSelect
            }
        }
    }
}


