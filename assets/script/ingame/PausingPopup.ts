import { _decorator, Component, Label, Node } from 'cc';
import { BlockJamManager } from '../Manager/BlockJamManager';
import { IngameLogic } from './IngameLogic';
const { ccclass, property } = _decorator;

@ccclass('PausingPopup')
export class PausingPopup extends Component {
    
    protected onEnable(): void {
        // Dừng timer khi popup hiển thị
        IngameLogic.getInstance().pause();
    }

    /**
     * Nút Resume - Tiếp tục game
     */
    btnResume() {
        // Tiếp tục timer
        IngameLogic.getInstance().resume();
        this.BtnClose();
    }

    /**
     * Nút Home - Về menu (không resume)
     */
    btnHome(){
        IngameLogic.getInstance().BtnHome();
        this.BtnClose();
    }

    /**
     * Nút Retry - Chơi lại (không resume)
     */
    btnRetry() {
        IngameLogic.getInstance().BtnReset();
        this.BtnClose();
    }

    /**
     * Đóng popup
     */
    BtnClose() {
        IngameLogic.getInstance().resume();
        this.node.active = false;
    }
}

