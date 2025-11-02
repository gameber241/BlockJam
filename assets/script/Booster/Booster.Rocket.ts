import { _decorator, Component, Node } from 'cc';
import { BaseBooster } from './BaseBooster';
import { IngameLogic } from '../ingame/IngameLogic';
const { ccclass, property } = _decorator;

@ccclass('Booster_Rocket')
export class Booster_Rocket extends BaseBooster {

    onclick(): boolean {
        if (super.onclick() == false) return false;
        IngameLogic.getInstance().Rocket();
        return true;
    }


}

