import { _decorator, Component, Label, Node, Sprite, SpriteFrame, tween, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingManager')
export class LoadingManager extends Component {
    @property(Label)
    loadingLb: Label = null

    @property(Sprite)
    loadingProgress: Sprite = null

    private currentProgress: number = 0;
    private displayProgress: number = 0;
    private progressTween: Tween<any> = null;

    start() {
        // Khởi tạo với 0%
        this.updateProgress(0);
    }

    /**
     * Cập nhật tiến độ loading dựa trên tiến độ thật từ asset loading
     * @param progress tiến độ từ 0 đến 100
     */
    public updateProgress(progress: number) {
        this.currentProgress = Math.min(100, Math.max(0, progress));
        
        // Dừng tween cũ nếu có
        if (this.progressTween) {
            this.progressTween.stop();
        }
        
        // Tạo object để tween
        const progressObj = { value: this.displayProgress };
        
        // Tween mượt từ tiến độ hiện tại đến tiến độ mới
        this.progressTween = tween(progressObj)
            .to(0.3, { value: this.currentProgress }, {
                onUpdate: () => {
                    this.displayProgress = progressObj.value;
                    
                    // Cập nhật text
                    this.loadingLb.string = `${Math.floor(this.displayProgress)}%`;
                    
                    // Cập nhật thanh progress
                    const fillRange = this.displayProgress / 100;
                    if (this.loadingProgress) {
                        this.loadingProgress.fillRange = fillRange;
                    }
                }
            })
            .start();
    }

    /**
     * Lấy tiến độ hiện tại
     */
    public getCurrentProgress(): number {
        return this.currentProgress;
    }

    /**
     * Reset tiến độ về 0
     */
    public reset() {
        if (this.progressTween) {
            this.progressTween.stop();
        }
        this.currentProgress = 0;
        this.displayProgress = 0;
        this.loadingLb.string = "0%";
        if (this.loadingProgress) {
            this.loadingProgress.fillRange = 0;
        }
    }

}


