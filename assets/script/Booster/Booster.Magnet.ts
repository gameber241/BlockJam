import { _decorator, Component, Node } from 'cc';
import { BaseBooster } from './BaseBooster';
import { IngameLogic } from '../ingame/IngameLogic';
const { ccclass, property } = _decorator;

@ccclass('Booster_Magnet')
export class Booster_Magnet extends BaseBooster {
    onclick(): void {
        super.onclick();
        IngameLogic.getInstance().Magnet()
    }

}

