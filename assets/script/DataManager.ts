import { _decorator, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Component {
    public static getBooster(typeBooster) {
        let data = sys.localStorage.getItem("BOOSTER" + typeBooster)
        return (data == null || data == undefined) ? 0 : Number(data)
    }

    public static SaveBooster(typeBooster, bonus) {
        let data = this.getBooster(typeBooster)
        sys.localStorage.setItem("BOOSTER" + typeBooster, data + bonus)
    }
}

