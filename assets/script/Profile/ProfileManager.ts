import { _decorator, Component, EditBox, Label, Node, Sprite } from 'cc';
import { PoolManager } from '../Manager/PoolManager';
import { FrameAvatarProfile } from './FrameAvatarProfile';
import { FrameProfile } from './FrameProfile';
import { ResourcesManager } from '../Manager/ResourcesManager';
import { BlockJamManager } from '../Manager/BlockJamManager';
import { BaseSingleton } from '../Base/BaseSingleton';
const { ccclass, property } = _decorator;

@ccclass('ProfileManager')
export class ProfileManager extends BaseSingleton<ProfileManager> {
    @property(Node)
    listAvatar: Node = null

    @property(Node)
    listFrame: Node = null

    @property(Sprite)
    frame: Sprite = null

    @property(Sprite)
    avatar: Sprite = null

    @property(EditBox)
    nameUser: EditBox = null

    btnEdit() {
        this.nameUser.focus()
    }


    protected onEnable(): void {
        ResourcesManager.getInstance().setSprite("frame" + (BlockJamManager.getInstance().frame + 1), this.frame)
        ResourcesManager.getInstance().setSprite("person" + (BlockJamManager.getInstance().avatar + 1), this.avatar)
        this.nameUser.string = BlockJamManager.getInstance().nameUser
        this.btnAvatar()

    }

    editName() {
        BlockJamManager.getInstance().nameUser = this.nameUser.string
        BlockJamManager.getInstance().saveAccount()
    }

    changeAvatar(id) {
        ResourcesManager.getInstance().setSprite("person" + (id + 1), this.avatar)
        BlockJamManager.getInstance().avatar = id
        BlockJamManager.getInstance().saveAccount()

    }

    changeFrame(id) {
        BlockJamManager.getInstance().frame = id
        ResourcesManager.getInstance().setSprite("frame" + (id + 1), this.frame)
        BlockJamManager.getInstance().saveAccount()

    }
    btnAvatar() {
        this.listAvatar.destroyAllChildren()
        this.listFrame.destroyAllChildren()

        for (let i = 0; i < 9; i++) {
            let avatar = PoolManager.getInstance().getNode("frameAvatarProfile", this.listFrame)
            avatar.getComponent(FrameAvatarProfile).init(i)
        }
    }


    btnFrame() {
        this.listAvatar.destroyAllChildren()
        this.listFrame.destroyAllChildren()
        for (let i = 0; i < 8; i++) {
            let avatar = PoolManager.getInstance().getNode("frameProfile", this.listFrame)
            avatar.getComponent(FrameProfile).init(i)
        }
    }

    btnClose() {
        this.node.destroy()
    }
}


