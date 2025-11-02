# AudioClipType Dropdown Setup Guide

## Tổng quan
Hướng dẫn cách setup dropdown cho AudioClipType enum trong Cocos Creator Inspector.

## Setup AudioClipType Dropdown

### 1. Enum Definition
```typescript
// Định nghĩa enum với explicit values
export enum AudioClipType {
    Sound = 0,
    Music = 1,
}

// Register với Cocos Creator
Enum(AudioClipType);
```

### 2. Property Decorator Usage

#### Basic Dropdown
```typescript
@property({ 
    type: Enum(AudioClipType),
    displayName: "Audio Type" 
})
audioType: AudioClipType = AudioClipType.Sound;
```

#### Dropdown với Tooltip
```typescript
@property({ 
    type: Enum(AudioClipType),
    displayName: "Clip Type",
    tooltip: "Chọn loại âm thanh: Sound cho hiệu ứng, Music cho nhạc nền"
})
clipType: AudioClipType = AudioClipType.Sound;
```

#### Array của Enum Dropdown
```typescript
@property({
    type: [Enum(AudioClipType)],
    displayName: "Audio Types"
})
audioTypes: AudioClipType[] = [];
```

### 3. Trong Sound Class
```typescript
@ccclass('Sound')
export class Sound {
    @property()
    name: string = '';

    @property(AudioClip)
    clip: AudioClip = null;

    @property({ 
        type: Enum(AudioClipType),
        displayName: "Audio Type" 
    })
    type: AudioClipType = AudioClipType.Sound;

    @property({ range: [0, 1, 0.01] })
    volume: number = 1;
}
```

## Cách sử dụng trong Inspector

### Inspector View
Khi setup đúng, trong Inspector bạn sẽ thấy:
- **Audio Type**: Dropdown với options "Sound" và "Music"
- Click vào dropdown sẽ hiển thị danh sách options
- Chọn option sẽ update value

### Runtime Usage
```typescript
// Check type
if (sound.type === AudioClipType.Sound) {
    console.log("This is a sound effect");
}

if (sound.type === AudioClipType.Music) {
    console.log("This is background music");
}

// Get type name as string
const typeName = AudioClipType[sound.type]; // "Sound" hoặc "Music"

// Set type programmatically
sound.type = AudioClipType.Music;
```

## Advanced Setup

### Custom Enum với nhiều options
```typescript
export enum AudioCategory {
    UI_Sound = 0,
    Game_Sound = 1,
    Background_Music = 2,
    Ambient_Sound = 3,
    Voice = 4
}

Enum(AudioCategory);

@property({ 
    type: Enum(AudioCategory),
    displayName: "Audio Category" 
})
category: AudioCategory = AudioCategory.UI_Sound;
```

### Conditional Properties
```typescript
@property({ 
    type: Enum(AudioClipType),
    displayName: "Audio Type" 
})
audioType: AudioClipType = AudioClipType.Sound;

@property({
    visible: function() { return this.audioType === AudioClipType.Music; },
    displayName: "Loop Music"
})
loopMusic: boolean = true;
```

## Troubleshooting

### Common Issues

1. **Dropdown không hiện**: 
   - Đảm bảo đã import `Enum` từ 'cc'
   - Đảm bảo đã call `Enum(AudioClipType)` sau khi define enum

2. **Options không đúng**:
   - Kiểm tra enum values (nên dùng explicit numbers)
   - Đảm bảo enum đã được export

3. **Type errors**:
   - Kiểm tra cú pháp `type: Enum(AudioClipType)`
   - Đảm bảo import đúng enum từ file khác

### Debug
```typescript
// Log enum values
console.log('AudioClipType enum:', AudioClipType);
console.log('Sound value:', AudioClipType.Sound);
console.log('Music value:', AudioClipType.Music);

// Check property value
console.log('Current type:', this.audioType);
console.log('Type name:', AudioClipType[this.audioType]);
```

## Best Practices

### 1. Enum Naming
- Sử dụng PascalCase cho enum name: `AudioClipType`
- Sử dụng PascalCase cho enum values: `Sound`, `Music`
- Explicit values cho stability: `Sound = 0, Music = 1`

### 2. Property Setup
- Luôn có `displayName` cho user-friendly names
- Sử dụng `tooltip` để giải thích ý nghĩa
- Set default value hợp lý

### 3. Code Organization
- Định nghĩa enum ở top của file
- Group related enums together
- Export enums để reuse

### 4. Documentation
- Comment giải thích ý nghĩa của từng enum value
- Document expected behavior cho từng type
- Provide usage examples

## Example Component

Xem file `AudioTypeExample.ts` để có complete example về cách sử dụng AudioClipType dropdown trong various scenarios.