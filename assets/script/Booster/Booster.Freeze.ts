import { _decorator, Component, Node } from 'cc';
import { BaseBooster } from './BaseBooster';
import { IngameLogic } from '../ingame/IngameLogic';
const { ccclass, property } = _decorator;

@ccclass('Booster_Freeze')
export class Booster_Freeze extends BaseBooster {
    onclick(): void {
        super.onclick();
        IngameLogic.getInstance().FreezeBooster()
    }
}

