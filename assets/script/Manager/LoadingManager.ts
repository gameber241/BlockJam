import { _decorator, Component, Label, Node, Sprite, SpriteFrame, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingManager')
export class LoadingManager extends Component {
    @property(Label)
    loadingLb: Label = null

    @property(Sprite)
    loadingProgress: Sprite = null


    start() {
        let progress = { value: 0 }; // biến dùng để tween

        tween(progress)
            .to(15, { value: 100 }, { // chạy trong 15 giây
                onUpdate: (target: { value: number }) => {
                    this.loadingLb.string = `${Math.floor(target.value)}%`;
                }
            })
            .start();
            
        tween(this.loadingProgress).to(15, { fillRange: 1 }).start()

    }

}


