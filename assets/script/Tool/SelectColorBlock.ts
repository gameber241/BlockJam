import { _decorator, Color, Component, Input, instantiate, Label, Node, Prefab, Sprite } from 'cc';
import { Tools } from './Tools';
const { ccclass, property } = _decorator;

export enum COLORblOCK {
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

@ccclass('SelectColorBlock')
export class SelectColorBlock extends Component {
    @property(Prefab)
    itemIdBlock: Prefab = null

    idSelect
    COLOR_MAP: Record<COLORblOCK, Color> = {
        [COLORblOCK.NAU]: new Color(139, 69, 19),         // Nâu
        [COLORblOCK.XANH_DUONG_DAM]: new Color(0, 0, 139),// Xanh dương đậm
        [COLORblOCK.XANH_LA_DAM]: new Color(0, 100, 0),   // Xanh lá đậm
        [COLORblOCK.XANH_DUONG_NHAT]: new Color(135, 206, 250), // Xanh dương nhạt
        [COLORblOCK.XANH_LA_NHAT]: new Color(144, 238, 144),    // Xanh lá nhạt
        [COLORblOCK.CAM]: new Color(255, 165, 0),         // Cam
        [COLORblOCK.HONG]: new Color(255, 182, 193),      // Hồng
        [COLORblOCK.TIM]: new Color(128, 0, 128),         // Tím
        [COLORblOCK.DO]: new Color(220, 20, 60),          // Đỏ
        [COLORblOCK.VANG]: new Color(255, 215, 0)         // Vàng
    };

    start() {
        // Loop qua các value của enum (chỉ lấy số, bỏ key string)
        for (const key of Object.keys(COLORblOCK)) {
            const value = COLORblOCK[key as keyof typeof COLORblOCK];
            if (typeof value !== "number") continue;

            const item = instantiate(this.itemIdBlock);
            this.node.addChild(item);

            // Gán màu cho item
            item.getComponent(Sprite)!.color = this.COLOR_MAP[value as COLORblOCK];

            // Bắt sự kiện click
            item.on(Input.EventType.TOUCH_END, () => {
                if (this.idSelect === value) {
                    this.node.setSiblingIndex(999)
                    this.node.children.forEach(e => e.active = true);
                } else {
                    this.node.children.forEach(e => e.active = false);
                    this.idSelect = value;
                    item.active = true;
                    Tools.getInstance().idColor = this.idSelect
                }
            }, this);

            // Ẩn tất cả item lúc đầu, chỉ cho item màu NAU hiện
            item.active = (value === COLORblOCK.NAU);
            if (item.active) {
                this.idSelect = value;
                Tools.getInstance().idColor = this.idSelect
            }
        }
    }
}


