# Wall Detection Update Documentation

## Tổng quan
Đã cập nhật `calculateShapeAwareBounds` method trong `block.ts` để kiểm tra cả tường (walls) nằm trong map, không chỉ blocks khác.

## Thay đổi chính

### 1. Thêm Wall Data Storage
**File**: `IngameLogic.ts`

```typescript
// Thêm wall data array
wallData: number[][] = []

// Khởi tạo wall data từ level config
if (levelConfig.border) {
    for (let i = 0; i < levelConfig.border.length; i++) {
        const wall = levelConfig.border[i]
        if (wall.x >= 0 && wall.x < this.colNum && wall.y >= 0 && wall.y < this.rowNum) {
            this.wallData[wall.y][wall.x] = 1
        }
    }
}
```

### 2. Thêm Helper Methods
**File**: `IngameLogic.ts`

```typescript
/**
 * Getter để truy cập wall data
 */
public getWallData(): number[][] {
    return this.wallData;
}

/**
 * Kiểm tra có tường tại vị trí cụ thể
 */
public isWallAt(x: number, y: number): boolean {
    if (y < 0 || y >= this.rowNum || x < 0 || x >= this.colNum) {
        return true; // Coi như có tường nếu ngoài biên
    }
    return this.wallData[y] && this.wallData[y][x] === 1;
}
```

### 3. Cập nhật calculateShapeAwareBounds
**File**: `block.ts`

```typescript
// Kiểm tra tường (walls)
if (IngameLogic.getInstance().isWallAt(checkX, checkY)) {
    return step - 1;
}
```

### 4. Cập nhật canPlaceBlock
**File**: `IngameLogic.ts`

```typescript
// Kiểm tra tường (walls) - luôn block không cho đặt
if (this.isWallAt(checkX, checkY)) {
    return false;
}
```

## Cách hoạt động

### Wall Data Structure
- `wallData: number[][]` - 2D array tương tự `blockLimitData`
- `0` = không có tường (có thể di chuyển)
- `1` = có tường (không thể di chuyển/đặt block)

### Initialization Process
1. **Khởi tạo arrays**: Tạo `wallData[rowNum][colNum]` với default values = 0
2. **Load từ level config**: Đọc `levelConfig.border` và đánh dấu vị trí có wall = 1
3. **Boundary check**: Kiểm tra coordinates trong bounds trước khi set

### Block Movement Logic
Khi block di chuyển, `calculateShapeAwareBounds` sẽ:

1. **Kiểm tra bounds**: Không được vượt quá biên map
2. **Kiểm tra blocks**: Không được đè lên blocks khác (`blockLimitData`)
3. **Kiểm tra walls**: Không được đè lên walls (`wallData`) - **NEW**

### Block Placement Logic
Khi đặt block, `canPlaceBlock` sẽ:

1. **Kiểm tra shape bounds**: Block shape không vượt quá map
2. **Kiểm tra block collision**: Không đè lên blocks khác (trừ vị trí gốc)
3. **Kiểm tra wall collision**: Không đè lên walls - **NEW**

## Benefits

### 1. Realistic Movement
- Blocks không thể "đi qua" walls trong map
- Movement bounds tính đến obstacles thực tế

### 2. Better Gameplay
- Walls trở thành obstacles thực sự
- Strategy gameplay với terrain constraints

### 3. Level Design Flexibility
- Level designers có thể tạo complex layouts với walls
- Walls act as permanent obstacles

## Example Scenarios

### Scenario 1: Block Movement
```
Original bounds: minCol=0, maxCol=5
With wall at (2,y): minCol=0, maxCol=1 (stopped by wall)
```

### Scenario 2: Block Placement
```
Block shape: 2x1
Position: (1,3)
Wall at: (2,3)
Result: Cannot place (wall blocks placement)
```

## Testing Considerations

### Test Cases
1. **Wall at boundary**: Wall ở edge của map
2. **Wall in middle**: Wall ở giữa map
3. **Multiple walls**: Nhiều walls tạo maze-like layout
4. **Complex shapes**: L-shapes, T-shapes với wall obstacles

### Edge Cases
1. **Wall outside bounds**: Không crash khi wall coord invalid
2. **Empty wall array**: Xử lý khi không có walls
3. **All walls**: Map hoàn toàn bị block bởi walls

## Future Enhancements

### Potential Improvements
1. **Wall types**: Different wall types với different behaviors
2. **Dynamic walls**: Walls có thể bị destroy hoặc move
3. **Wall visual feedback**: Highlight walls khi block gần
4. **Performance optimization**: Optimize wall checking cho large maps

### Code Optimization
1. **Caching**: Cache wall positions cho frequent checks
2. **Spatial indexing**: Use quad-tree cho large wall sets
3. **Bitwise operations**: Use bit operations cho wall flags

## Migration Notes

### Backward Compatibility
- Existing levels without walls vẫn hoạt động normal
- `wallData` sẽ là all-zeros cho old levels
- No breaking changes cho existing gameplay

### Version Control
- Changes đã được applied incrementally
- Each method updated independently
- Easy rollback nếu cần thiết