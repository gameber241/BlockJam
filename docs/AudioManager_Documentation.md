# AudioManager Documentation

## Tổng quan
AudioManager là một hệ thống quản lý âm thanh hoàn chỉnh cho Cocos Creator, được chuyển đổi từ Unity AudioManager.cs. Hệ thống này cung cấp các tính năng:

- Quản lý âm thanh tập trung với Singleton pattern
- Phân loại Sound và Music
- Điều khiển volume độc lập cho Sound và Music
- Lưu trữ settings vào LocalStorage
- PlayOneShot cho sound effects
- Loop music background
- Pause/Resume/Stop controls

## Cấu trúc Classes

### AudioClipType Enum
```typescript
export enum AudioClipType {
    Sound,  // Sound effects (UI, game actions)
    Music,  // Background music
}
```

### Sound Class
```typescript
@ccclass('Sound')
export class Sound {
    @property() name: string = '';
    @property(AudioClip) clip: AudioClip = null;
    @property({ type: AudioClipType }) type: AudioClipType = AudioClipType.Sound;
    @property({ range: [0, 1, 0.01] }) volume: number = 1;
    audioSource: AudioSource = null; // Runtime generated
}
```

### AudioManager Class
Singleton class kế thừa từ `BaseSingleton<AudioManager>`

## Cách sử dụng

### 1. Setup trong Scene

```typescript
// Trong scene, attach AudioManager component
// Set up sounds array trong Inspector
```

### 2. Basic Usage

```typescript
// Lấy instance
const audioManager = AudioManager.getInstance();

// Play sound effect một lần
audioManager.playOneShot('buttonClick');

// Play music với loop
audioManager.play('backgroundMusic', true);

// Stop sound
audioManager.stop('backgroundMusic');
```

### 3. Volume Control

```typescript
// Set music volume (0-1)
AudioManager.MusicVolume = 0.8;

// Set sound effects volume (0-1)  
AudioManager.SoundVolume = 0.5;

// Hoặc thông qua methods
audioManager.setMusicVolume(0.8);
audioManager.setSoundEffectsVolume(0.5);

// Set volume cho sound cụ thể
audioManager.setSoundVolume('buttonClick', 0.3);
```

### 4. Advanced Controls

```typescript
// Pause/Resume
audioManager.pauseAll();
audioManager.resumeAll();
audioManager.pause('backgroundMusic');
audioManager.resume('backgroundMusic');

// Stop controls
audioManager.stopAll();
audioManager.stopAllMusic();
audioManager.stopAllSounds();

// Check if playing
if (audioManager.isPlaying('backgroundMusic')) {
    console.log('Music is playing');
}
```

### 5. Dynamic Sound Management

```typescript
// Thêm sound runtime
audioManager.addSound('newSound', audioClip, AudioClipType.Sound, 0.8);

// Xóa sound
audioManager.removeSound('oldSound');

// Lấy danh sách sounds
const allSounds = audioManager.getAllSounds();
const musicList = audioManager.getAllMusic();
const soundEffects = audioManager.getAllSoundEffects();
```

## Integration Examples

### 1. UI Button Sounds
```typescript
@ccclass('UIButton')
export class UIButton extends Component {
    onButtonClick() {
        AudioManager.getInstance().playOneShot('buttonClick');
        // Handle button logic...
    }
}
```

### 2. Game Events
```typescript
@ccclass('GameLogic')
export class GameLogic extends Component {
    onPlayerWin() {
        AudioManager.getInstance().playOneShot('winSound');
    }
    
    onPlayerLose() {
        AudioManager.getInstance().playOneShot('loseSound');
    }
    
    onCoinCollect() {
        AudioManager.getInstance().playOneShot('coinCollect');
    }
}
```

### 3. Scene Management
```typescript
@ccclass('SceneManager')
export class SceneManager extends Component {
    loadMenuScene() {
        const audioManager = AudioManager.getInstance();
        audioManager.stopAll();
        audioManager.play('menuMusic', true);
    }
    
    loadGameScene() {
        const audioManager = AudioManager.getInstance();
        audioManager.stop('menuMusic');
        audioManager.play('gameMusic', true);
    }
}
```

### 4. Settings Panel
```typescript
@ccclass('SettingsPanel')
export class SettingsPanel extends Component {
    @property(Slider) musicSlider: Slider = null;
    @property(Slider) soundSlider: Slider = null;
    
    start() {
        // Load current volumes
        this.musicSlider.progress = AudioManager.MusicVolume;
        this.soundSlider.progress = AudioManager.SoundVolume;
        
        // Setup callbacks
        this.musicSlider.node.on('slide', this.onMusicVolumeChanged, this);
        this.soundSlider.node.on('slide', this.onSoundVolumeChanged, this);
    }
    
    onMusicVolumeChanged(slider: Slider) {
        AudioManager.getInstance().setMusicVolume(slider.progress);
    }
    
    onSoundVolumeChanged(slider: Slider) {
        AudioManager.getInstance().setSoundEffectsVolume(slider.progress);
    }
}
```

## Best Practices

### 1. Sound Naming
- Sử dụng tên rõ ràng và consistent
- Prefix theo category: `ui_buttonClick`, `game_coinCollect`
- Avoid spaces, use camelCase hoặc underscores

### 2. Performance
- Sử dụng `playOneShot()` cho sounds ngắn, thường xuyên
- Sử dụng `play()` cho sounds cần control (pause/resume)
- Cleanup sounds không dùng với `removeSound()`

### 3. Volume Management
- Luôn cung cấp volume slider trong settings
- Save/restore volume preferences
- Separate controls cho Music và Sound Effects

### 4. Audio Clip Setup
- Compress audio appropriately cho mobile
- Use appropriate sample rates (22kHz for sounds, 44kHz cho music)
- Organize clips trong folders theo category

## Inspector Setup

### AudioManager Component
1. Attach AudioManager component vào một GameObject persistent
2. Setup sounds array trong Inspector:
   - Name: Tên để reference trong code
   - Clip: AudioClip asset
   - Type: Sound hoặc Music
   - Volume: Base volume (0-1)

### Sound Configuration Example
```
sounds[0]:
  name: "buttonClick"
  clip: button_click.mp3
  type: Sound
  volume: 1.0

sounds[1]:
  name: "backgroundMusic"
  clip: bgm_menu.mp3
  type: Music
  volume: 0.8

sounds[2]:
  name: "coinCollect"
  clip: coin_collect.wav
  type: Sound
  volume: 0.7
```

## Error Handling

AudioManager xử lý các trường hợp lỗi thường gặp:
- Sound không tồn tại → Log warning, không crash
- AudioClip null → Skip playback
- AudioSource không tạo được → Retry hoặc fallback

## Mobile Considerations

### Performance
- Limit số lượng AudioSources đồng thời
- Use object pooling cho frequently used sounds
- Preload critical audio clips

### Platform Differences
- iOS: Audio có thể bị mute bởi silent switch
- Android: Various audio focus behaviors
- Both: Handle app pause/resume events

## Debug và Troubleshooting

### Common Issues
1. **Sound không phát**: Check AudioClip assignment và tên
2. **Volume không work**: Verify AudioSource setup
3. **Performance issues**: Monitor AudioSource count

### Debug Methods
```typescript
// Check if sound exists
const sound = audioManager.findSound('buttonClick');
console.log('Sound found:', sound);

// Check all sounds
console.log('All sounds:', audioManager.getAllSounds());

// Check if playing
console.log('Is playing:', audioManager.isPlaying('backgroundMusic'));
```

## Migration từ Unity

Differences từ Unity AudioManager:
- Không có `AudioMixerGroup` → Sử dụng volume control
- `PlayOneShot` behavior tương tự
- Volume settings được save vào LocalStorage thay vì PlayerPrefs
- AudioSource được tạo runtime thay vì serialize

## Future Enhancements

Có thể mở rộng thêm:
- Audio fade in/out effects
- 3D spatial audio support  
- Audio compression/decompression
- Dynamic loading/unloading
- Audio streaming cho large files
- Integration với Cocos Analytics