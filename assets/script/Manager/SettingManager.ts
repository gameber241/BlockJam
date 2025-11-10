import { _decorator, Component, Node, Slider, Sprite } from 'cc';
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


    BtnPolicy() {

    }

    BtnRestore() {

    }

    BtnSupport() {
        
    }
}

