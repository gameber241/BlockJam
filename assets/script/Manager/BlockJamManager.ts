import { _decorator, Component, Node, sys } from 'cc';
import { ResourcesManager } from './ResourcesManager';
import { BaseSingleton } from '../Base/BaseSingleton';
import { MenuLayer } from '../ui/MenuLayer';
import { PoolManager } from './PoolManager';
import { HeartSystem } from '../ui/HeartSystem';
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

    level: number = 15

    protected async start() {
        this.heartSystem = new HeartSystem()
        this.LoadingUI.active = true
        this.LobbyUI.active = false
        await ResourcesManager.getInstance().loadAllResources()
        this.restore()
        this.ShowLobby()

    }


    ShowLobby() {
        this.LobbyUI.active = true
        this.LoadingUI.active = false
        this.ShowMenuLayer()

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
        // const _data = sys.localStorage.getItem(STORAGE_KEY) as any
        // if (_data) {
        //     const data = JSON.parse(_data)
        //     if (data) {
        //         this.level = typeof data.level == 'number' ? data.level : 1
        //         this.coin = typeof data.score == 'number' ? data.score : 0
        //     }
        // }
        // else {
        //     this.level = 1
        //     this.coin = 0
        // }
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
        this.LobbyUI.children[1].active = true
        this.LobbyUI.children[0].active = false
        let gameplay = PoolManager.getInstance().getNode("Gameplay", this.LobbyUI.children[1])


    }



}


