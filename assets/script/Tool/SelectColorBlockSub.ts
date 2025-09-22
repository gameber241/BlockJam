import { _decorator, Color, Component, Input, instantiate, Label, Node, Prefab, Sprite } from 'cc';
import { Tools } from './Tools';
const { ccclass, property } = _decorator;

export enum COLORSUB {
    NONE = 0,
    NAU = 1,
    XANH_DUONG_DAM = 2,
    XANH_LA_DAM = 3,
    XANH_DUONG_NHAT = 4,
    XANH_LA_NHAT = 5,
    CAM = 6,
    HONG = 7,
    TIM = 8,
    DO = 9,
    VANG = 10
}

@ccclass('SelectColorBlockSub')
export class SelectColorBlockSub extends Component {
    @property(Prefab)
    itemIdBlock: Prefab = null

    idSelect
    COLOR_MAP: Record<COLORSUB, Color> = {
        [COLORSUB.NONE]: new Color(163, 163, 163),
        [COLORSUB.NAU]: new Color(139, 69, 19),         // Nâu
        [COLORSUB.XANH_DUONG_DAM]: new Color(0, 0, 139),// Xanh dương đậm
        [COLORSUB.XANH_LA_DAM]: new Color(0, 100, 0),   // Xanh lá đậm
        [COLORSUB.XANH_DUONG_NHAT]: new Color(135, 206, 250), // Xanh dương nhạt
        [COLORSUB.XANH_LA_NHAT]: new Color(144, 238, 144),    // Xanh lá nhạt
        [COLORSUB.CAM]: new Color(255, 165, 0),         // Cam
        [COLORSUB.HONG]: new Color(255, 182, 193),      // Hồng
        [COLORSUB.TIM]: new Color(128, 0, 128),         // Tím
        [COLORSUB.DO]: new Color(220, 20, 60),          // Đỏ
        [COLORSUB.VANG]: new Color(255, 215, 0)         // Vàng
    };

    start() {
        // Loop qua các value của enum (chỉ lấy số, bỏ key string)
        for (const key of Object.keys(COLORSUB)) {
            const value = COLORSUB[key as keyof typeof COLORSUB];
            if (typeof value !== "number") continue;

            const item = instantiate(this.itemIdBlock);
            this.node.addChild(item);

            // Gán màu cho item
                item.getComponent(Sprite)!.color = this.COLOR_MAP[value as COLORSUB];

            // Bắt sự kiện click
            item.on(Input.EventType.TOUCH_END, () => {
                if (this.idSelect === value) {
                    this.node.setSiblingIndex(999)
                    this.node.children.forEach(e => e.active = true);
                } else {
                    this.node.children.forEach(e => e.active = false);
                    this.idSelect = value;
                    item.active = true;
                    Tools.getInstance().idColorSub = this.idSelect
                }
            }, this);

            // Ẩn tất cả item lúc đầu, chỉ cho item màu NAU hiện
            item.active = (value === COLORSUB.NONE);
            if (item.active) {
                this.idSelect = value;
                Tools.getInstance().idColorSub = this.idSelect
            }
        }
    }
}


