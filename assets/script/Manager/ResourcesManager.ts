import { _decorator, Asset, AudioClip, Component, isValid, JsonAsset, Node, Prefab, resources, Sprite, SpriteFrame, TextAsset } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;

type AssetConstructor<T extends Asset> = new (...args: any[]) => T;

@ccclass('ResourcesManager')
export class ResourcesManager extends BaseSingleton<ResourcesManager> {
    private clipMap: Record<string, AudioClip> = {};
    private spriteMap: Record<string, SpriteFrame> = {};
    private spritePromises: Record<string, Promise<SpriteFrame | null>> = {};
    private jsonMap: Record<string, any> = {};
    private txtMap: Record<string, string> = {};

    private readonly spritePaths: string[] = [
        "fish",
        "block_inner",
        "block_star",
        "block",
        "exit",
        "wall",
        "wire",
        "lock",
        "PA",
        "frame",
        "person",
    ]

    public async loadAllResources(onProgress?: (progress: number) => void) {
        // Chỉ preload Json/Text/Prefab theo yêu cầu
        const phases: Array<{
            weight: number,
            loader: () => Promise<void>
        }> = [
                {
                    weight: 0.35,
                    loader: () => this.loadAssetsByType(JsonAsset, (asset) => {
                        if (!this.jsonMap[asset.name]) {
                            this.jsonMap[asset.name] = asset.json;
                        }
                    })
                },
                {
                    weight: 0.35,
                    loader: () => this.loadAssetsByType(TextAsset, (asset) => {
                        const textArr = asset.text.split(/[(\r\n)\r\n]+/);
                        for (let j = 0; j < textArr.length; j++) {
                            const level = j + 1;
                            this.txtMap[`word_${level}`] = textArr[j];
                        }
                    })
                },
                {
                    weight: 0.30,
                    loader: () => this.loadAssetsByType(Prefab, (asset) => {
                        PoolManager.getInstance().setPrefab(asset.name, asset);
                    })
                }
            ];

        let completedWeight = 0;

        for (const phase of phases) {
            await phase.loader();
            completedWeight += phase.weight;
            if (onProgress) {
                onProgress(completedWeight * 100);
            }
        }

        if (onProgress) {
            onProgress(100);
        }
    }

    private async loadAssetsByType<T extends Asset>(typeCtor: AssetConstructor<T>, onAssetLoaded: (asset: T) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            resources.loadDir("", typeCtor, (err, assets: T[]) => {
                if (err) {
                    reject(err);
                    return;
                }

                assets.forEach(onAssetLoaded);
                resolve();
            });
        });
    }


    private resolveSpriteBasePath(name: string) {
        for (let i = 0; i < this.spritePaths.length; i++) {
            let path = this.spritePaths[i];
            if (name.includes(path)) {
                return `sprites/${path}/${name}`;
            }
        }
        return undefined;

    }

    public getSprite(name: string) {
        const cached = this.spriteMap[name];
        if (cached) return cached

        this.loadSpriteFrame(name).then((spriteFrame) => {
            if (spriteFrame) {
                this.spriteMap[name] = spriteFrame;
            }
        });

        return null;
    }


    public setSprite(name: string, sprite: Sprite) {
        if (!sprite) {
            console.warn(`[ResourcesManager] setSprite called with invalid target for ${name}`);
            return;
        }

        const cached = this.spriteMap[name];
        if (cached) {
            if (isValid(sprite.node, true)) {
                sprite.spriteFrame = cached;
                return;
            }
            console.warn(`[ResourcesManager] Target node destroyed before applying cached sprite ${name}`);
            return;
        }

        if (!this.spritePromises[name]) {
            this.spritePromises[name] = this.loadSpriteFrame(name).then((spriteFrame) => {
                if (spriteFrame) {
                    this.spriteMap[name] = spriteFrame;
                }
                delete this.spritePromises[name];
                return spriteFrame;
            });
        }

        this.spritePromises[name].then((spriteFrame) => {
            if (!spriteFrame) {
                console.warn(`[ResourcesManager] Failed to set sprite ${name}`);
                return;
            }
            if (!isValid(sprite.node, true)) {
                console.warn(`[ResourcesManager] Target node destroyed before sprite ${name} finished loading`);
                return;
            }
            sprite.spriteFrame = spriteFrame;
        });
    }

    private async loadSpriteFrame(name: string): Promise<SpriteFrame | null> {
        const basePath = this.resolveSpriteBasePath(name);
        if (!basePath) {
            console.warn(`[ResourcesManager] Cannot resolve sprite path for ${name}`);
            return null;
        }

        const candidates = [`${basePath}/spriteFrame`, basePath];

        for (const path of candidates) {
            const spriteFrame = await new Promise<SpriteFrame | null>((resolve) => {
                resources.load(path, SpriteFrame, (err, sprite) => {
                    if (err || !sprite) {
                        resolve(null);
                        return;
                    }
                    resolve(sprite);
                });
            });

            if (spriteFrame) {
                console.log(`[ResourcesManager] Loaded sprite ${name} from ${path}`);
                return spriteFrame;
            }
        }

        console.warn(`[ResourcesManager] Unable to load sprite ${name}`);
        return null;
    }

    /**
     * Load audio runtime bằng callback
     */
    public loadAudioRuntime(path: string, onLoaded?: (clip: AudioClip | null) => void) {
        if (this.clipMap[path]) {
            onLoaded && onLoaded(this.clipMap[path]);
            return;
        }

        resources.load(path, AudioClip, (err, clip) => {
            if (err || !clip) {
                console.warn(`[ResourcesManager] Failed to load audio: ${path}`, err);
                onLoaded && onLoaded(null);
                return;
            }

            this.clipMap[path] = clip;
            onLoaded && onLoaded(clip);
        });
    }



}


