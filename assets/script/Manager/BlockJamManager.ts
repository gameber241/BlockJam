import { _decorator, Component, Node, sys } from 'cc';
import { ResourcesManager } from './ResourcesManager';
import { BaseSingleton } from '../Base/BaseSingleton';
import { MenuLayer } from '../ui/MenuLayer';
import { PoolManager } from './PoolManager';
import { HeartSystem } from '../ui/HeartSystem';
import { WinSubHeart } from '../ingame/WinSubHeart';
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
        this.heartSystem = new HeartSystem()
        this.LoadingUI.active = true
        this.LobbyUI.active = false
        await ResourcesManager.getInstance().loadAllResources()
        this.restore()
        this.ShowLobby()
        this.GetAccount()

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
        console.log(_data)
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
        let profile = PoolManager.getInstance().getNode("Profile", this.LobbyUI[2])
    }

    save() {
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
        console.log(_data)
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

    ShowREfill() {
        let popup = PoolManager.getInstance().getNode("PopupRefillHeart", this.LobbyUI.children[2])
    }

    ShowWinSubHeart(callback) {
        let popup = PoolManager.getInstance().getNode("WillSubHeart", this.LobbyUI.children[2])
        popup.getComponent(WinSubHeart).init(callback)
    }
}


