import { _decorator, Component, Node } from 'cc';
import { BaseBooster } from './BaseBooster';
import { IngameLogic } from '../ingame/IngameLogic';
const { ccclass, property } = _decorator;

@ccclass('Booster_Rocket')
export class Booster_Rocket extends BaseBooster {

    onclick(): boolean {
        let is = super.onclick()
        if (is == false) return false;
        console.log("denday", is)

        IngameLogic.getInstance().Rocket();
        return true;
    }


}

