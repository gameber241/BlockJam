import { _decorator, Component, Node, Slider, Sprite, sys } from 'cc';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SettingManager')
export class SettingManager extends Component {
    @property(Slider)
    sliderMusic: Slider = null

    @property(Sprite)
    fillMusic: Sprite = null

    @property(Slider)
    sliderSound: Slider = null

    @property(Sprite)
    fillSound: Sprite = null

    policyUrl: string = "https://085448438cavvsaa.blogspot.com/2025/10/we-are-committed-to-safeguarding-your.html"
    supportUrl: string = "https://085448438cavvsaa.blogspot.com/2025/10/we-are-committed-to-safeguarding-your.html"


    onEnable() {
        this.sliderMusic.progress = this.fillMusic.fillRange = AudioManager.MusicVolume / 1
        this.sliderSound.progress = this.fillSound.fillRange = AudioManager.SoundVolume / 1

    }


    SetSliderMusic() {
        this.fillMusic.fillRange = this.sliderMusic.progress
        AudioManager.MusicVolume = this.sliderMusic.progress
    }

    SetSliderSound() {
        this.fillSound.fillRange = this.sliderSound.progress
        AudioManager.SoundVolume = this.sliderSound.progress
    }

    private openExternalUrl(url: string) {
        if (!url) {
            return;
        }

        if (sys && typeof sys.openURL === 'function') {
            sys.openURL(url);
            return;
        }

        if (typeof window !== 'undefined' && typeof window.open === 'function') {
            window.open(url, "_blank");
        }
    }

    BtnPolicy() {
        AudioManager.getInstance().playButtonClickPop();
        this.openExternalUrl(this.policyUrl);
    }

    BtnRestore() {
        AudioManager.getInstance().playButtonClickPop();
    }

    BtnSupport() {
        AudioManager.getInstance().playButtonClickPop();
        this.openExternalUrl(this.supportUrl);
    }
}

