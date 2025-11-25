import { _decorator, Component, director, Node, sys } from 'cc';
import { ResourcesManager } from './ResourcesManager';
import { BaseSingleton } from '../Base/BaseSingleton';
import { MenuLayer } from '../ui/MenuLayer';
import { PoolManager } from './PoolManager';
import { HeartSystem } from '../ui/HeartSystem';
import { WinSubHeart } from '../ingame/WinSubHeart';
import { PopupRefillYoutLife } from './PopupRefillYoutLife';
import { IAPManager } from './IAPManager';
import { AudioManager } from './AudioManager';
import { LoadingManager } from './LoadingManager';
import { ReceiveMessageToNative } from '../ReceiveMessageToNative';
import { DataManager } from '../DataManager';
import { suportBooster } from '../Booster/BoosterReward';
const { ccclass, property } = _decorator;
const STORAGE_KEY = 'CC2_BLOCK_JAM'
@ccclass('BlockJamManager')
export class BlockJamManager extends BaseSingleton<BlockJamManager> {
    @property(Node)
    LoadingUI: Node = null

    @property(Node)
    LobbyUI: Node = null

    heartSystem = new HeartSystem();

    menuLayer: MenuLayer = null

    coin: number = 0

    hear: number = 0

    level: number = 1

    avatar: number = 0
    frame: number = 0
    nameUser: string = ""

    protected async start() {
        // Fix window type để tránh lỗi TypeScript
        (window as any).ReceiveMessageToNative = new ReceiveMessageToNative();

        // Listen purchase event từ ReceiveMessageToNative
        director.on("PURCHASE_SUCCESS", this.onPurchaseSuccess, this);
        this.SaveBoosterSupport()
        this.heartSystem = new HeartSystem()
        this.LoadingUI.active = true
        this.LobbyUI.active = false

        // Lấy LoadingManager component từ LoadingUI
        const loadingManager = this.LoadingUI.getComponent(LoadingManager);

        // Reset và bắt đầu loading từ 0%
        if (loadingManager) {
            loadingManager.reset();
        }

        // Load tất cả assets với callback progress thật
        await ResourcesManager.getInstance().loadAllResources((progress: number) => {
            if (loadingManager) {
                loadingManager.updateProgress(progress);
            }
        });

        // Đảm bảo loading đạt 100% và chờ một chút cho animation hoàn thành
        if (loadingManager) {
            loadingManager.updateProgress(100);
            // Chờ 0.5 giây để người dùng thấy 100%
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Initialize Managers
        IAPManager.getInstance();
        AudioManager.getInstance();

        this.restore()
        this.ShowLobby()
        this.GetAccount()

    }

    SaveBoosterSupport() {
        if (DataManager.isSaveBoosterSupport() == false) {
            sys.localStorage.setItem("IS_SAVE", "11");
            for (const key in suportBooster) {
                console.log(key)
                const value = suportBooster[key];
                for (let i = 0; i < value.length; i++) {
                    DataManager.SaveBoosterSupport(value[i].type, key, value[i].quantity)
                }

            }
        }
    }

    /**
     * Xử lý khi mua hàng thành công
     */
    private onPurchaseSuccess(coins: number) {
        this.updateScore(coins);
    }

    protected onDestroy() {
        director.off("PURCHASE_SUCCESS", this.onPurchaseSuccess, this);
        super.onDestroy();
    }


    ShowLobby() {
        this.LobbyUI.active = true
        this.LoadingUI.active = false
        this.ShowMenuLayer()

    }

    UpdateLevel() {
        this.level += 1
        this.save()
    }

    GetAccount() {
        const _data = sys.localStorage.getItem("ACCOUNT") as any
        if (_data) {
            const data = JSON.parse(_data)
            if (data) {
                this.avatar = typeof data.avatar == 'number' ? data.avatar : 1
                this.frame = typeof data.frame == 'number' ? data.frame : 0
                this.nameUser = typeof data.frame == 'string' ? data.name : "Player0123"
            }
        }
        else {
            this.avatar = 0
            this.frame = 0
            this.nameUser = "Player0123"
            this.saveAccount()
            this.ShowProfile()
        }

        this.menuLayer?.UpdateInf()
    }

    saveAccount() {
        sys.localStorage.setItem("ACCOUNT", JSON.stringify({
            avatar: this.avatar,
            frame: this.frame,
            name: this.nameUser
        }))

        if (this.menuLayer) {
            this.menuLayer.UpdateInf()
        }
    }

    ShowProfile() {
        let profile = PoolManager.getInstance().getNode("Profile", this.LobbyUI.children[2])
    }

    save() {
        director.emit("UPDATE_ACCOUNT")
        sys.localStorage.setItem(STORAGE_KEY, JSON.stringify({
            // isSoundOn: this.isSoundOn,
            // isMusicOn: this.isMusicOn,
            level: this.level,
            coin: this.coin
        }))
    }

    /**
     * Khôi phục dữ liệu game từ localStorage
     */
    restore() {
        const _data = sys.localStorage.getItem(STORAGE_KEY) as any
        if (_data) {
            const data = JSON.parse(_data)
            if (data) {
                this.level = typeof data.level == 'number' ? data.level : 1
                this.coin = typeof data.coin == 'number' ? data.coin : 0
            }
        }
        else {
            this.level = 1
            this.coin = 0

            this.save()
        }
    }

    updateScore(scorePlush) {
        this.coin += scorePlush
        this.save()
    }

    ShowMenuLayer() {
        this.LobbyUI.children[1].active = false
        this.LobbyUI.children[0].active = true
        if (this.menuLayer == null) {
            let menuLayer = PoolManager.getInstance().getNode("MenuLayer", this.LobbyUI.children[0])
            this.menuLayer = menuLayer.getComponent(MenuLayer)
        }
        else {
            this.menuLayer.node.active = true
        }
    }


    PlayGame() {
        if (this.heartSystem.getHearts() > 0) {
            this.heartSystem.useHeart()
            this.LobbyUI.children[1].active = true
            this.LobbyUI.children[0].active = false
            let gameplay = PoolManager.getInstance().getNode("Gameplay", this.LobbyUI.children[1])
        }

    }

    BackToMenu() {
        this.ShowLobby()

    }

    ShowREfill(callbacnk) {
        let popup = PoolManager.getInstance().getNode("PopupRefillHeart", this.LobbyUI.children[2])
        popup.getComponent(PopupRefillYoutLife).init(callbacnk)
    }

    ShowWinSubHeart(callback) {
        let popup = PoolManager.getInstance().getNode("WillSubHeart", this.LobbyUI.children[2])
        popup.getComponent(WinSubHeart).init(callback)
    }

    ShowPausingPopup() {
        let popup = PoolManager.getInstance().getNode("PausePopup", this.LobbyUI.children[2])
        // Popup sẽ tự động pause timer trong onEnable()
    }
}


