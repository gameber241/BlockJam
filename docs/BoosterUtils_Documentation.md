# Booster Utils - Hướng dẫn sử dụng

## Tổng quan

`BoosterUtils` là class quản lý hệ thống booster và reward trong game, bao gồm:
- ✅ Kiểm tra và nhận thưởng khi vượt qua level chia hết cho 10
- ✅ Quản lý support booster cho mỗi level
- ✅ Quản lý inventory booster của người chơi
- ✅ Tự động lưu dữ liệu vào localStorage

## Cấu trúc dữ liệu

### 1. BOOSTER_TYPE
```typescript
const BOOSTER_TYPE = {
    TIMER: 0,   // Booster thêm thời gian
    ROCKET: 1,  // Booster rocket
    HAMMER: 2,  // Booster hammer
    MAGNET: 3   // Booster magnet
}
```

### 2. Level Reward
- Level **% 10 == 0** (10, 20, 30, ...) có thưởng
- Mỗi level chỉ nhận thưởng 1 lần
- Thưởng được lưu vào inventory

### 3. Support Booster
- Mỗi level có danh sách support booster riêng
- Là vật phẩm tiêu hao khi sử dụng
- Người chơi có thể dùng booster trong inventory để hỗ trợ vượt level

## API Reference

### 1. Kiểm tra và nhận thưởng level

#### `checkLevelReward(level: number): LevelReward | null`
Kiểm tra level có thưởng chưa nhận không.

```typescript
import { BoosterUtils } from "./BoosterUtils";

const reward = BoosterUtils.checkLevelReward(10);
if (reward) {
    console.log(`Type: ${reward.type}, Quantity: ${reward.quantity}`);
}
// Output: Type: 0, Quantity: 1 (1 Timer booster)
```

#### `claimLevelReward(level: number): boolean`
Nhận thưởng level và cập nhật inventory.

```typescript
const success = BoosterUtils.claimLevelReward(10);
if (success) {
    console.log("Đã nhận thưởng!");
}
```

### 2. Quản lý Support Booster

#### `getLevelSupportBoosters(level: number): LevelSupportBooster[]`
Lấy danh sách support booster của level.

```typescript
const boosters = BoosterUtils.getLevelSupportBoosters(15);
// Trả về: [
//   { type: 1, quantity: 1 },  // Rocket
//   { type: 0, quantity: 0 }   // Timer
// ]
```

### 3. Quản lý Inventory

#### `getBoosterInventory(): PlayerBoosterInventory`
Lấy toàn bộ inventory của người chơi.

```typescript
const inventory = BoosterUtils.getBoosterInventory();
console.log(inventory);
// Output: { 0: 5, 1: 3, 2: 2, 3: 1 }
// Timer: 5, Rocket: 3, Hammer: 2, Magnet: 1
```

#### `getBoosterCount(boosterType: number): number`
Lấy số lượng booster cụ thể.

```typescript
import { BOOSTER_TYPE } from "./BoosterReward";

const timerCount = BoosterUtils.getBoosterCount(BOOSTER_TYPE.TIMER);
console.log(`You have ${timerCount} Timer boosters`);
```

#### `useBooster(boosterType: number, quantity: number = 1): boolean`
Sử dụng booster (trừ vào inventory).

```typescript
// Sử dụng 1 Timer booster
const success = BoosterUtils.useBooster(BOOSTER_TYPE.TIMER, 1);
if (success) {
    console.log("Booster activated!");
} else {
    console.log("Not enough booster!");
}
```

#### `addBooster(boosterType: number, quantity: number): void`
Thêm booster vào inventory (mua, nhận thưởng).

```typescript
// Thêm 3 Rocket booster
BoosterUtils.addBooster(BOOSTER_TYPE.ROCKET, 3);
```

### 4. Quản lý Level

#### `getCurrentLevel(): number`
Lấy level hiện tại của người chơi.

```typescript
const level = BoosterUtils.getCurrentLevel();
console.log(`Current level: ${level}`);
```

#### `saveCurrentLevel(level: number): void`
Lưu level hiện tại.

```typescript
BoosterUtils.saveCurrentLevel(15);
```

#### `onLevelComplete(completedLevel: number)`
Xử lý tổng hợp khi hoàn thành level.

```typescript
const result = BoosterUtils.onLevelComplete(10);

if (result.hasReward && result.reward) {
    console.log("Level reward:", result.reward);
    // Hiển thị popup nhận thưởng
}

console.log("Next level support boosters:", result.supportBoosters);
```

### 5. Utility Functions

#### `getBoosterName(boosterType: number): string`
Lấy tên booster từ type.

```typescript
const name = BoosterUtils.getBoosterName(BOOSTER_TYPE.TIMER);
console.log(name); // "Timer"
```

#### `getPlayerStatus()`
Lấy tổng hợp trạng thái người chơi.

```typescript
const status = BoosterUtils.getPlayerStatus();
console.log(status);
// {
//   currentLevel: 15,
//   inventory: { 0: 5, 1: 3, 2: 2, 3: 1 },
//   claimedLevels: [10]
// }
```

#### `resetAllData(): void`
Reset toàn bộ dữ liệu (dùng cho testing).

```typescript
BoosterUtils.resetAllData();
```

## Workflow thực tế

### Khi người chơi hoàn thành level:

```typescript
function onPlayerWinLevel(level: number) {
    // 1. Xử lý hoàn thành level
    const result = BoosterUtils.onLevelComplete(level);
    
    // 2. Kiểm tra thưởng level
    if (result.hasReward && result.reward) {
        // Hiển thị popup reward
        showRewardPopup({
            type: result.reward.type,
            quantity: result.reward.quantity,
            onClaim: () => {
                BoosterUtils.claimLevelReward(level);
            }
        });
    }
    
    // 3. Chuẩn bị level tiếp theo
    prepareLevelUI(level + 1, result.supportBoosters);
}
```

### Khi người chơi muốn dùng booster trong level:

```typescript
function onBoosterButtonClick(boosterType: number) {
    // Kiểm tra số lượng
    const count = BoosterUtils.getBoosterCount(boosterType);
    
    if (count > 0) {
        // Sử dụng booster
        const success = BoosterUtils.useBooster(boosterType, 1);
        if (success) {
            // Kích hoạt hiệu ứng booster trong game
            activateBoosterEffect(boosterType);
        }
    } else {
        // Hiển thị popup mua booster
        showBuyBoosterDialog(boosterType);
    }
}
```

### Khi người chơi mua booster:

```typescript
function onPurchaseBooster(boosterType: number, quantity: number) {
    // 1. Xử lý thanh toán
    // ...payment logic...
    
    // 2. Thêm vào inventory
    BoosterUtils.addBooster(boosterType, quantity);
    
    // 3. Cập nhật UI
    updateBoosterUI();
}
```

## LocalStorage Keys

Dữ liệu được lưu trong localStorage với các key sau:

- `player_reward_status` - Trạng thái nhận thưởng
- `player_booster_inventory` - Inventory booster
- `player_current_level` - Level hiện tại

## Ví dụ đầy đủ

Xem file `BoosterExamples.ts` để có ví dụ chi tiết về:
- ✅ Workflow hoàn chỉnh khi chơi game
- ✅ Cách kiểm tra và nhận thưởng
- ✅ Cách sử dụng support booster
- ✅ Cách quản lý inventory

## Testing

```typescript
// Reset data để test
BoosterUtils.resetAllData();

// Test flow hoàn chỉnh
import { fullGameplayDemo } from "./BoosterExamples";
fullGameplayDemo();
```

## Lưu ý quan trọng

1. ✅ **Tự động lưu**: Mọi thay đổi đều tự động lưu vào localStorage
2. ✅ **Thread-safe**: Các hàm đều static, có thể gọi từ bất kỳ đâu
3. ✅ **Error handling**: Các hàm có kiểm tra lỗi và log console
4. ⚠️ **Level reward**: Chỉ nhận được 1 lần, kiểm tra trước khi hiển thị UI
5. ⚠️ **Support booster**: Là data tham khảo, không ảnh hưởng đến inventory

## Integration với Cocos Creator

```typescript
import { Component, _decorator } from 'cc';
import { BoosterUtils } from './Booster/BoosterUtils';
import { BOOSTER_TYPE } from './Booster/BoosterReward';

const { ccclass } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    
    onLevelComplete(level: number) {
        const result = BoosterUtils.onLevelComplete(level);
        
        if (result.hasReward && result.reward) {
            this.showRewardDialog(result.reward);
        }
        
        this.loadNextLevel(level + 1, result.supportBoosters);
    }
    
    onUseBooster(boosterType: number) {
        if (BoosterUtils.useBooster(boosterType)) {
            this.activateBoosterInGame(boosterType);
        } else {
            this.showNotEnoughBoosterDialog();
        }
    }
}
```
