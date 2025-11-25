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


    public static getBoosterSupport() {
        let data = sys.localStorage.getItem("BOOSTER_SUPPORT")
        return (data == null || data == undefined) ? {} : JSON.parse(data)
    }

    public static SaveBoosterSupport(typeBooster, level, bonus) {
        let data = this.getBoosterSupport()
        if (data[level] == null) {
            data[level] = {}

        }
        if (data[level][typeBooster] == null) {
            data[level][typeBooster] = 0
        }
        data[level][typeBooster] += bonus
        sys.localStorage.setItem("BOOSTER_SUPPORT", JSON.stringify(data))
    }


    public static isSaveBoosterSupport() {
        let data = sys.localStorage.getItem("IS_SAVE")
        return (data == null || data == undefined) ? false : true


    }
}

