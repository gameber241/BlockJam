import { _decorator, Component, Node } from 'cc';
import { BaseBooster } from './BaseBooster';
import { IngameLogic } from '../ingame/IngameLogic';
const { ccclass, property } = _decorator;

@ccclass('Booster_Freeze')
export class Booster_Freeze extends BaseBooster {
    onclick(): boolean {
        if (super.onclick() == false) return false;
        IngameLogic.getInstance().FreezeBooster();
        return true;
    }

}

