# Booster Utils - Quick Reference

## 🚀 Import
```typescript
import { BoosterUtils } from './Booster/BoosterUtils';
import { BOOSTER_TYPE } from './Booster/BoosterReward';
```

## 📋 Most Common Use Cases

### 1️⃣ Khi player complete level
```typescript
const result = BoosterUtils.onLevelComplete(completedLevel);

if (result.hasReward && result.reward) {
    // Show reward popup
    showRewardDialog(result.reward);
}
```

### 2️⃣ Nhận thưởng
```typescript
BoosterUtils.claimLevelReward(level);
updateInventoryUI();
```

### 3️⃣ Dùng booster
```typescript
if (BoosterUtils.useBooster(BOOSTER_TYPE.TIMER)) {
    activateTimerEffect();
}
```

### 4️⃣ Mua booster
```typescript
BoosterUtils.addBooster(BOOSTER_TYPE.ROCKET, 3);
```

### 5️⃣ Check số lượng
```typescript
const count = BoosterUtils.getBoosterCount(BOOSTER_TYPE.HAMMER);
```

### 6️⃣ Xem support booster
```typescript
const boosters = BoosterUtils.getLevelSupportBoosters(level);
```

### 7️⃣ Xem trạng thái
```typescript
const status = BoosterUtils.getPlayerStatus();
// { currentLevel, inventory, claimedLevels }
```

### 8️⃣ Update UI
```typescript
const inventory = BoosterUtils.getBoosterInventory();
timerLabel.string = inventory[BOOSTER_TYPE.TIMER].toString();
```

## 🎯 Booster Types
```typescript
BOOSTER_TYPE.TIMER   // 0 - ⏰
BOOSTER_TYPE.ROCKET  // 1 - 🚀
BOOSTER_TYPE.HAMMER  // 2 - 🔨
BOOSTER_TYPE.MAGNET  // 3 - 🧲
```

## 💾 LocalStorage Keys
- `player_reward_status` - Claimed levels
- `player_booster_inventory` - Booster counts
- `player_current_level` - Current level

## ⚠️ Important Notes
1. Level reward chỉ claim được 1 lần
2. Support booster chỉ là data tham khảo
3. Tất cả thay đổi tự động lưu localStorage
4. Check `null` trước khi dùng reward

## 🔧 Debugging
```typescript
// Xem tất cả data
console.log(BoosterUtils.getPlayerStatus());

// Reset để test
BoosterUtils.resetAllData();
```

## 📖 Full Documentation
→ `/docs/BoosterUtils_Documentation.md`
