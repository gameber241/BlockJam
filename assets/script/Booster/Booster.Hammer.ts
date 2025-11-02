import { _decorator, Component, Node } from 'cc';
import { BaseBooster } from './BaseBooster';
import { IngameLogic } from '../ingame/IngameLogic';
const { ccclass, property } = _decorator;

@ccclass('Booster_Hammer')
export class Booster_Hammer extends BaseBooster {


    onclick(): boolean {
        if (super.onclick() == false) return false;
        IngameLogic.getInstance().Hammer();
        return true;
    }

}

