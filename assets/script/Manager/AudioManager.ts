import { _decorator, Component, AudioClip, AudioSource, sys, log, Node, Enum } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';

const { ccclass, property } = _decorator;

/**
 * Enum để phân loại loại âm thanh
 */
export enum AudioClipType {
    Sound = 0,
    Music = 1,
}

// Register enum với Cocos Creator để hiển thị dropdown
Enum(AudioClipType);

/**
 * Interface định nghĩa một sound item
 */
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

    // AudioSource sẽ được tạo runtime
    audioSource: AudioSource = null;
}

@ccclass('AudioManager')
export class AudioManager extends BaseSingleton<AudioManager> {

    @property([Sound])
    sounds: Sound[] = [];

    @property(AudioClip)
    lobbyMusic: AudioClip = null;

    @property(AudioClip)
    gameMusic: AudioClip = null;

    @property(AudioClip)
    collectBooster: AudioClip = null;

    @property(AudioClip)
    confirm: AudioClip = null;

    @property(AudioClip)
    win: AudioClip = null;

    @property(AudioClip)
    lose: AudioClip = null;

    @property(AudioClip)
    timer: AudioClip = null;

    @property(AudioClip)
    rocketMove: AudioClip = null;

    @property(AudioClip)
    rocketHit: AudioClip = null;

    @property(AudioClip)
    hammerMove: AudioClip = null;

    @property(AudioClip)
    hammerHit: AudioClip = null;

    @property(AudioClip)
    magnet: AudioClip = null;

    @property(AudioClip)
    blockExit: AudioClip = null;

    @property(AudioClip)
    iceBroken: AudioClip = null;

    private playOneShotAudioSource: AudioSource = null;

    // Static properties cho volume settings
    public static get MusicVolume(): number {
        return 1 - parseFloat(sys.localStorage.getItem("MusicVolume") || "0");
    }

    public static set MusicVolume(value: number) {
        sys.localStorage.setItem("MusicVolume", (1 - value).toString());
    }

    public static get SoundVolume(): number {
        return 1 - parseFloat(sys.localStorage.getItem("SoundVolume") || "0");
    }

    public static set SoundVolume(value: number) {
        sys.localStorage.setItem("SoundVolume", (1 - value).toString());
    }

    protected onLoad(): void {
        super.onLoad();
        this.initPlayOneShotAudioSource();
    }

    protected onDestroy(): void {
        super.onDestroy();
        // Cleanup all audio sources
        this.sounds.forEach(sound => {
            if (sound.audioSource) {
                sound.audioSource.destroy();
            }
        });
    }

    public playLobbyMusic(): void {
        this.playClip(this.lobbyMusic, true);
    }



    public playGameMusic(): void {
        this.playClip(this.gameMusic, true);
    }

    playCollectBooster(): void {
        this.playOneShotClip(this.collectBooster);
    }

    playConfirm(): void {
        this.playOneShotClip(this.confirm);
    }

    playWin(): void {
        this.playOneShotClip(this.win);
    }

    playLose(): void {
        this.playOneShotClip(this.lose);
    }

    playTimer(): void {
        this.playOneShotClip(this.timer);
    }

    playRocketMove(): void {
        this.playOneShotClip(this.rocketMove);
    }

    playRocketHit(): void {
        this.playOneShotClip(this.rocketHit);
    }

    playHammerMove(): void {
        this.playOneShotClip(this.hammerMove);
    }

    playHammerHit(): void {
        this.playOneShotClip(this.hammerHit);
    }

    playMagnet(): void {
        this.playOneShotClip(this.magnet);
    }

    playBlockExit(): void {
        this.playOneShotClip(this.blockExit);
    }

    playIceBroken(): void {
        this.playOneShotClip(this.iceBroken);
    }

    /**
     * Khởi tạo AudioSource cho PlayOneShot
     */
    private initPlayOneShotAudioSource(): void {
        const oneShotNode = new Node('OneShotAudioSource');
        oneShotNode.setParent(this.node);
        this.playOneShotAudioSource = oneShotNode.addComponent(AudioSource);
    }



    /**
     * Phát âm thanh một lần (không loop)
     * @param name Tên của sound hoặc tên của AudioClip
     */
    public playOneShot(name: string): void {
        const sound = this.findSound(name);
        if (!sound) {
            log(`Not Found Sound ${name}`);
            return;
        }
        this.playOneShotClip(sound.clip, sound.volume);
    }

    /**
     * Phát AudioClip một lần
     * @param clip AudioClip để phát
     */
    public playOneShotClip(clip: AudioClip, volume: number = 1): void {
        if (!clip || !this.playOneShotAudioSource) {
            return;
        }

        this.playOneShotAudioSource.volume = AudioManager.SoundVolume * volume;
        this.playOneShotAudioSource.playOneShot(clip);
    }

    /**
     * Phát âm thanh với khả năng loop
     * @param name Tên của sound
     * @param loop Có loop không
     */
    public play(name: string, loop: boolean = false): void {
        const sound = this.findSound(name);
        if (!sound) {
            log(`Not Found Sound ${name}`);
            return;
        }

        this.playSound(sound, loop);
    }

    /**
     * Phát AudioClip với khả năng loop
     * @param clip AudioClip để phát
     * @param loop Có loop không
     */
    public playClip(clip: AudioClip, loop: boolean = false): void {
        if (!clip) {
            return;
        }

        let sound = this.sounds.find(s => s.clip === clip);
        if (!sound) {
            // Tạo sound mới nếu chưa có
            sound = new Sound();
            sound.clip = clip;
            sound.name = clip.name;
            sound.volume = 1;
            sound.type = loop ? AudioClipType.Music : AudioClipType.Sound;
            this.sounds.push(sound);
        }

        this.playSound(sound, loop);
    }

    /**
     * Phát sound với AudioSource
     * @param sound Sound object
     * @param loop Có loop không
     */
    private playSound(sound: Sound, loop: boolean): void {
        if (!sound.audioSource) {
            const audioNode = new Node(`AudioSource_${sound.name}`);
            audioNode.setParent(this.node);
            sound.audioSource = audioNode.addComponent(AudioSource);
        }

        this.setVolume(sound);
        sound.audioSource.clip = sound.clip;
        sound.audioSource.loop = loop;
        sound.audioSource.play();
    }

    /**
     * Set volume cho sound dựa trên type và setting
     * @param sound Sound object
     */
    private setVolume(sound: Sound): void {
        if (!sound.audioSource) {
            return;
        }

        const globalVolume = sound.type === AudioClipType.Music 
            ? AudioManager.MusicVolume 
            : AudioManager.SoundVolume;
        
        const finalVolume = globalVolume * sound.volume;
        sound.audioSource.volume = finalVolume;
        
        // Mute if volume is 0
        if (finalVolume === 0) {
            sound.audioSource.enabled = false;
        } else {
            sound.audioSource.enabled = true;
        }
    }

    /**
     * Dừng phát âm thanh
     * @param name Tên của sound
     */
    public stop(name: string): void {
        const sound = this.findSound(name);
        if (!sound) {
            log(`Not Found Sound ${name}`);
            return;
        }

        if (sound.audioSource) {
            sound.audioSource.stop();
        }
    }

    /**
     * Dừng tất cả âm thanh
     */
    public stopAll(): void {
        this.sounds.forEach(sound => {
            if (sound.audioSource) {
                sound.audioSource.stop();
            }
        });

        if (this.playOneShotAudioSource) {
            this.playOneShotAudioSource.stop();
        }
    }

    /**
     * Dừng tất cả music
     */
    public stopAllMusic(): void {
        this.sounds
            .filter(sound => sound.type === AudioClipType.Music)
            .forEach(sound => {
                if (sound.audioSource) {
                    sound.audioSource.stop();
                }
            });
    }

    /**
     * Dừng tất cả sound effects
     */
    public stopAllSounds(): void {
        this.sounds
            .filter(sound => sound.type === AudioClipType.Sound)
            .forEach(sound => {
                if (sound.audioSource) {
                    sound.audioSource.stop();
                }
            });
    }

    /**
     * Pause âm thanh
     * @param name Tên của sound
     */
    public pause(name: string): void {
        const sound = this.findSound(name);
        if (!sound || !sound.audioSource) {
            return;
        }

        sound.audioSource.pause();
    }

    /**
     * Resume âm thanh
     * @param name Tên của sound
     */
    public resume(name: string): void {
        const sound = this.findSound(name);
        if (!sound || !sound.audioSource) {
            return;
        }

        // In Cocos Creator, we need to play again after pause
        sound.audioSource.play();
    }

    /**
     * Pause tất cả âm thanh
     */
    public pauseAll(): void {
        this.sounds.forEach(sound => {
            if (sound.audioSource) {
                sound.audioSource.pause();
            }
        });
    }

    /**
     * Resume tất cả âm thanh
     */
    public resumeAll(): void {
        this.sounds.forEach(sound => {
            if (sound.audioSource) {
                sound.audioSource.play();
            }
        });
    }

    /**
     * Kiểm tra âm thanh có đang phát không
     * @param name Tên của sound
     * @returns true nếu đang phát
     */
    public isPlaying(name: string): boolean {
        const sound = this.findSound(name);
        if (!sound || !sound.audioSource) {
            return false;
        }

        return sound.audioSource.playing;
    }

    /**
     * Set volume cho một sound cụ thể
     * @param name Tên của sound
     * @param volume Volume (0-1)
     */
    public setSoundVolume(name: string, volume: number): void {
        const sound = this.findSound(name);
        if (!sound) {
            return;
        }

        sound.volume = Math.max(0, Math.min(1, volume));
        this.setVolume(sound);
    }

    /**
     * Set volume cho tất cả music
     * @param volume Volume (0-1)
     */
    public setMusicVolume(volume: number): void {
        AudioManager.MusicVolume = Math.max(0, Math.min(1, volume));
        this.updateAllVolumes();
    }

    /**
     * Set volume cho tất cả sound effects
     * @param volume Volume (0-1)
     */
    public setSoundEffectsVolume(volume: number): void {
        AudioManager.SoundVolume = Math.max(0, Math.min(1, volume));
        this.updateAllVolumes();
    }

    /**
     * Cập nhật volume cho tất cả sounds
     */
    private updateAllVolumes(): void {
        this.sounds.forEach(sound => {
            if (sound.audioSource) {
                this.setVolume(sound);
            }
        });
    }

    /**
     * Tìm sound theo tên
     * @param name Tên sound hoặc tên AudioClip
     * @returns Sound object hoặc null
     */
    private findSound(name: string): Sound | null {
        return this.sounds.find(s => 
            s.name === name || 
            (s.name === "" && s.clip && s.clip.name === name)
        ) || null;
    }

    /**
     * Thêm sound mới vào danh sách
     * @param name Tên sound
     * @param clip AudioClip
     * @param type Loại âm thanh
     * @param volume Volume mặc định
     */
    public addSound(name: string, clip: AudioClip, type: AudioClipType = AudioClipType.Sound, volume: number = 1): void {
        const existingSound = this.findSound(name);
        if (existingSound) {
            log(`Sound with name ${name} already exists`);
            return;
        }

        const newSound = new Sound();
        newSound.name = name;
        newSound.clip = clip;
        newSound.type = type;
        newSound.volume = volume;
        
        this.sounds.push(newSound);
    }

    /**
     * Xóa sound khỏi danh sách
     * @param name Tên sound
     */
    public removeSound(name: string): void {
        const soundIndex = this.sounds.findIndex(s => 
            s.name === name || 
            (s.name === "" && s.clip && s.clip.name === name)
        );

        if (soundIndex >= 0) {
            const sound = this.sounds[soundIndex];
            if (sound.audioSource) {
                sound.audioSource.stop();
                sound.audioSource.destroy();
            }
            this.sounds.splice(soundIndex, 1);
        }
    }

    /**
     * Lấy danh sách tất cả sounds
     */
    public getAllSounds(): Sound[] {
        return [...this.sounds];
    }

    /**
     * Lấy danh sách music
     */
    public getAllMusic(): Sound[] {
        return this.sounds.filter(s => s.type === AudioClipType.Music);
    }

    /**
     * Lấy danh sách sound effects
     */
    public getAllSoundEffects(): Sound[] {
        return this.sounds.filter(s => s.type === AudioClipType.Sound);
    }

    // Các phương thức tiện ích để Inspector tự động update tên
    public onInspectorChanged(): void {
        this.sounds.forEach(sound => {
            if (sound.name === "" && sound.clip) {
                sound.name = sound.clip.name;
            }
        });
    }
}