import { BOOSTER_TYPE, rewartdBooster, suportBooster } from "./BoosterReward";

/**
 * Interface cho dữ liệu reward của level
 */
interface LevelReward {
    type: number;
    quantity: number;
}

/**
 * Interface cho trạng thái nhận thưởng của người chơi
 */
interface PlayerRewardStatus {
    claimedLevels: number[]; // Danh sách level đã nhận thưởng
}

/**
 * Interface cho inventory của người chơi (số lượng booster)
 */
interface PlayerBoosterInventory {
    [BOOSTER_TYPE.TIMER]: number;
    [BOOSTER_TYPE.ROCKET]: number;
    [BOOSTER_TYPE.HAMMER]: number;
    [BOOSTER_TYPE.MAGNET]: number;
}

/**
 * Interface cho support booster của mỗi level
 */
interface LevelSupportBooster {
    type: number;
    quantity: number;
}

// LocalStorage keys
const STORAGE_KEYS = {
    REWARD_STATUS: 'player_reward_status',
    BOOSTER_INVENTORY: 'player_booster_inventory',
    CURRENT_LEVEL: 'player_current_level'
};

/**
 * BoosterUtils - Class quản lý reward và support booster
 */
class BoosterUtils {
    
    /**
     * Lấy trạng thái nhận thưởng từ localStorage
     */
    private static getRewardStatus(): PlayerRewardStatus {
        const data = localStorage.getItem(STORAGE_KEYS.REWARD_STATUS);
        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                console.error('Error parsing reward status:', e);
            }
        }
        return { claimedLevels: [] };
    }

    /**
     * Lưu trạng thái nhận thưởng vào localStorage
     */
    private static saveRewardStatus(status: PlayerRewardStatus): void {
        localStorage.setItem(STORAGE_KEYS.REWARD_STATUS, JSON.stringify(status));
    }

    /**
     * Lấy inventory booster từ localStorage
     */
    public static getBoosterInventory(): PlayerBoosterInventory {
        const data = localStorage.getItem(STORAGE_KEYS.BOOSTER_INVENTORY);
        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                console.error('Error parsing booster inventory:', e);
            }
        }
        // Default inventory
        return {
            [BOOSTER_TYPE.TIMER]: 0,
            [BOOSTER_TYPE.ROCKET]: 0,
            [BOOSTER_TYPE.HAMMER]: 0,
            [BOOSTER_TYPE.MAGNET]: 0
        };
    }

    /**
     * Lưu inventory booster vào localStorage
     */
    private static saveBoosterInventory(inventory: PlayerBoosterInventory): void {
        localStorage.setItem(STORAGE_KEYS.BOOSTER_INVENTORY, JSON.stringify(inventory));
    }

    /**
     * Lấy level hiện tại của người chơi
     */
    public static getCurrentLevel(): number {
        const level = localStorage.getItem(STORAGE_KEYS.CURRENT_LEVEL);
        return level ? parseInt(level) : 1;
    }

    /**
     * Lưu level hiện tại
     */
    public static saveCurrentLevel(level: number): void {
        localStorage.setItem(STORAGE_KEYS.CURRENT_LEVEL, level.toString());
    }

    /**
     * Kiểm tra level có chia hết cho 10 không
     */
    private static isRewardLevel(level: number): boolean {
        return level % 10 === 0;
    }

    /**
     * Kiểm tra level đã nhận thưởng chưa
     */
    private static hasClaimedReward(level: number): boolean {
        const status = this.getRewardStatus();
        return status.claimedLevels.indexOf(level) !== -1;
    }

    /**
     * Kiểm tra vượt qua level % 10 == 0 && chưa nhận thưởng
     * Trả về reward type và quantity
     * @param level - Level vừa vượt qua
     * @returns LevelReward hoặc null nếu không có thưởng
     */
    public static checkLevelReward(level: number): LevelReward | null {
        // Kiểm tra level có chia hết cho 10 không
        if (!this.isRewardLevel(level)) {
            return null;
        }

        // Kiểm tra đã nhận thưởng chưa
        if (this.hasClaimedReward(level)) {
            return null;
        }

        // Lấy thông tin reward từ rewartdBooster
        const reward = rewartdBooster[level];
        if (reward) {
            return {
                type: reward.type,
                quantity: reward.quantity
            };
        }

        return null;
    }

    /**
     * Nhận thưởng level và cập nhật inventory
     * @param level - Level vừa vượt qua
     * @returns true nếu nhận thành công, false nếu không
     */
    public static claimLevelReward(level: number): boolean {
        const reward = this.checkLevelReward(level);
        if (!reward) {
            return false;
        }

        // Cập nhật inventory
        const inventory = this.getBoosterInventory();
        inventory[reward.type] += reward.quantity;
        this.saveBoosterInventory(inventory);

        // Đánh dấu đã nhận thưởng
        const status = this.getRewardStatus();
        if (status.claimedLevels.indexOf(level) === -1) {
            status.claimedLevels.push(level);
            this.saveRewardStatus(status);
        }

        console.log(`Claimed reward for level ${level}: Type ${reward.type}, Quantity ${reward.quantity}`);
        return true;
    }

    /**
     * Lấy support booster của level
     * Trả về danh sách booster hỗ trợ cho level đó
     * @param level - Level cần lấy support booster
     * @returns Mảng LevelSupportBooster hoặc empty array
     */
    public static getLevelSupportBoosters(level: number): LevelSupportBooster[] {
        const boosters = suportBooster[level];
        if (boosters && Array.isArray(boosters)) {
            return boosters;
        }
        return [];
    }

    /**
     * Sử dụng booster (vật phẩm tiêu hao)
     * @param boosterType - Loại booster cần sử dụng
     * @param quantity - Số lượng cần sử dụng (mặc định 1)
     * @returns true nếu sử dụng thành công, false nếu không đủ
     */
    public static useBooster(boosterType: number, quantity: number = 1): boolean {
        const inventory = this.getBoosterInventory();
        
        // Kiểm tra có đủ booster không
        if (inventory[boosterType] < quantity) {
            console.warn(`Not enough booster type ${boosterType}. Have: ${inventory[boosterType]}, Need: ${quantity}`);
            return false;
        }

        // Trừ số lượng
        inventory[boosterType] -= quantity;
        this.saveBoosterInventory(inventory);

        console.log(`Used booster type ${boosterType}, quantity ${quantity}. Remaining: ${inventory[boosterType]}`);
        return true;
    }

    /**
     * Thêm booster vào inventory (mua, nhận thưởng, etc.)
     * @param boosterType - Loại booster
     * @param quantity - Số lượng thêm
     */
    public static addBooster(boosterType: number, quantity: number): void {
        const inventory = this.getBoosterInventory();
        inventory[boosterType] += quantity;
        this.saveBoosterInventory(inventory);

        console.log(`Added booster type ${boosterType}, quantity ${quantity}. Total: ${inventory[boosterType]}`);
    }

    /**
     * Lấy số lượng booster hiện có
     * @param boosterType - Loại booster
     * @returns Số lượng
     */
    public static getBoosterCount(boosterType: number): number {
        const inventory = this.getBoosterInventory();
        return inventory[boosterType] || 0;
    }

    /**
     * Lấy tên booster theo type
     * @param boosterType - Loại booster
     * @returns Tên booster
     */
    public static getBoosterName(boosterType: number): string {
        const names = {
            [BOOSTER_TYPE.TIMER]: 'Timer',
            [BOOSTER_TYPE.ROCKET]: 'Rocket',
            [BOOSTER_TYPE.HAMMER]: 'Hammer',
            [BOOSTER_TYPE.MAGNET]: 'Magnet'
        };
        return names[boosterType] || 'Unknown';
    }

    /**
     * Reset toàn bộ dữ liệu (dùng cho testing hoặc reset game)
     */
    public static resetAllData(): void {
        localStorage.removeItem(STORAGE_KEYS.REWARD_STATUS);
        localStorage.removeItem(STORAGE_KEYS.BOOSTER_INVENTORY);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_LEVEL);
        console.log('All booster data has been reset');
    }

    /**
     * Lấy thông tin tổng hợp về trạng thái người chơi
     */
    public static getPlayerStatus() {
        return {
            currentLevel: this.getCurrentLevel(),
            inventory: this.getBoosterInventory(),
            claimedLevels: this.getRewardStatus().claimedLevels
        };
    }

    /**
     * Kiểm tra và xử lý khi hoàn thành level
     * @param completedLevel - Level vừa hoàn thành
     * @returns Thông tin reward nếu có
     */
    public static onLevelComplete(completedLevel: number): {
        hasReward: boolean;
        reward?: LevelReward;
        supportBoosters: LevelSupportBooster[];
    } {
        // Lưu level hiện tại
        this.saveCurrentLevel(completedLevel + 1);

        // Kiểm tra reward
        const reward = this.checkLevelReward(completedLevel);
        
        // Lấy support booster của level tiếp theo
        const nextLevel = completedLevel + 1;
        const supportBoosters = this.getLevelSupportBoosters(nextLevel);

        return {
            hasReward: reward !== null,
            reward: reward || undefined,
            supportBoosters: supportBoosters
        };
    }
}

export { 
    BoosterUtils, 
    STORAGE_KEYS 
};

export type { 
    LevelReward, 
    PlayerRewardStatus, 
    PlayerBoosterInventory,
    LevelSupportBooster
};
