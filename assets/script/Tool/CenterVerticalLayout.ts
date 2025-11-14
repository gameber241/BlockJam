import { _decorator, Component, Node, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CustomVerticalCenter')
export class CustomVerticalCenter extends Component {

    start() {
        this.updateLayout();
    }

    updateLayout() {
        const parent = this.node;
        const items = parent.children.filter(n => n.active);

        if (items.length === 0) return;

        const parentUI = parent.getComponent(UITransform);
        const parentWidth = parentUI.width;
        const parentHeight = parentUI.height;

        // —— CĂN GIỮA THEO TRỤC X ——
        const centerX = parentWidth / 2;

        // —— spacing tự động chia đều chiều cao block ——
        const spacing = parentHeight / (items.length + 1);

        // —— đặt dây theo từng spacing ——
        for (let i = 0; i < items.length; i++) {
            let y = parentHeight - spacing * (i + 1); // anchor 0,0 → gốc dưới trái
            if (y == parentHeight / 2) y += 10
            items[i].setPosition(new Vec3(centerX, y, 0));


        }
    }
}
