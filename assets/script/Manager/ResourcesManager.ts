import { _decorator, Asset, AudioClip, Component, isValid, JsonAsset, Node, Prefab, resources, Sprite, SpriteFrame, sys, TextAsset } from 'cc';
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
    public readonly loadSpriteProgress = {}
    private hasPreloadedWebSprites = false;

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

    public static get GamePlayLoadingProgress(): number {
        const spriteGroup = this.getInstance().loadSpriteProgress["gameplay"];
        if (!spriteGroup || spriteGroup.total === 0) {
            return 100;
        }
        return Math.min(100, (spriteGroup.process / spriteGroup.total) * 100);
    }

    public static get GamePlayLoadingCompleted(): boolean {
        return this.GamePlayLoadingProgress >= 100 ? true : false;
    }

    public async loadAllResources(onProgress?: (progress: number) => void) {
        // Chỉ preload Json/Text/Prefab theo yêu cầu
    const shouldPreloadSprites = !sys.isNative && !this.isRunningOnLocalhost();
        const spritePhaseWeight = shouldPreloadSprites ? 0.58 : 0;
        let prefabWeight = shouldPreloadSprites ? 0.2 : 0.78;
        const phases: Array<{
            weight: number,
            loader: (notify: (phaseProgress: number) => void) => Promise<void>
        }> = [
                {
                    weight: 0.12,
                    loader: (notify) => this.loadAssetsByType(JsonAsset, (asset) => {
                        if (!this.jsonMap[asset.name]) {
                            this.jsonMap[asset.name] = asset.json;
                        }
                    }, notify)
                },
                {
                    weight: 0.1,
                    loader: (notify) => this.loadAssetsByType(TextAsset, (asset) => {
                        const textArr = asset.text.split(/[(\r\n)\r\n]+/);
                        for (let j = 0; j < textArr.length; j++) {
                            const level = j + 1;
                            this.txtMap[`word_${level}`] = textArr[j];
                        }
                    }, notify)
                },
                {
                    weight: prefabWeight,
                    loader: (notify) => this.loadAssetsByType(Prefab, (asset) => {
                        PoolManager.getInstance().setPrefab(asset.name, asset);
                    }, notify)
                },
                
            ];

        if (shouldPreloadSprites) {
            phases.push({
                weight: spritePhaseWeight,
                loader: (notify) => this.preloadSpriteFramesForWeb(notify)
            });
        }

        let completedWeight = 0;
        const emitProgress = (weightPortion: number) => {
            if (onProgress) {
                onProgress(Math.min(100, weightPortion * 100));
            }
        };

        for (const phase of phases) {
            await phase.loader((phaseProgress) => {
                emitProgress(completedWeight + phase.weight * phaseProgress);
            });
            completedWeight += phase.weight;
            emitProgress(completedWeight);
        }

        emitProgress(1);
    }

    private async loadAssetsByType<T extends Asset>(typeCtor: AssetConstructor<T>, onAssetLoaded: (asset: T) => void, onPhaseProgress?: (progress: number) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            resources.loadDir("", typeCtor,
                (completedCount: number, totalCount: number) => {
                    if (onPhaseProgress && totalCount > 0) {
                        onPhaseProgress(completedCount / totalCount);
                    }
                },
                (err, assets: T[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    assets.forEach(onAssetLoaded);
                    onPhaseProgress && onPhaseProgress(1);
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

    private async preloadSpriteFramesForWeb(onPhaseProgress?: (progress: number) => void): Promise<void> {
        if (this.hasPreloadedWebSprites) {
            onPhaseProgress && onPhaseProgress(1);
            return;
        }

        const totalFolders = this.spritePaths.length;
        let processedFolders = 0;

        for (const folder of this.spritePaths) {
            const dir = `sprites/${folder}`;
            await new Promise<void>((resolve) => {
                resources.loadDir(dir, SpriteFrame,
                    (completedCount: number, totalCount: number) => {
                        if (!onPhaseProgress || totalFolders === 0) {
                            return;
                        }
                        const folderProgress = totalCount > 0 ? completedCount / totalCount : 1;
                        const overallProgress = (processedFolders + folderProgress) / totalFolders;
                        onPhaseProgress(Math.min(1, overallProgress));
                    },
                    (err, assets: SpriteFrame[]) => {
                        if (err) {
                            console.warn(`[ResourcesManager] Failed to preload sprite dir ${dir}`, err);
                        } else {
                            assets.forEach((asset) => {
                                this.spriteMap[asset.name] = asset;
                            });
                        }

                        processedFolders += 1;
                        if (onPhaseProgress && totalFolders > 0) {
                            onPhaseProgress(Math.min(1, processedFolders / totalFolders));
                        }

                        resolve();
                    });
            });
        }

        this.hasPreloadedWebSprites = true;
        onPhaseProgress && onPhaseProgress(1);
    }

    private isRunningOnLocalhost(): boolean {
        if (sys.isNative) {
            return false;
        }

        const hostname: string | undefined = (globalThis as any)?.location?.hostname;
        if (!hostname) {
            return false;
        }

        return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
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

    private initSpriteGroup(groupId: string) {

        if (!this.loadSpriteProgress[groupId]) {
            this.loadSpriteProgress[groupId] = {};
            const spriteGroup = this.loadSpriteProgress[groupId];
            spriteGroup.total = 0;
            spriteGroup.process = 0;
        }
        return this.loadSpriteProgress[groupId];
    }

    public setSprite(name: string, sprite: Sprite, groupId = "default") {

        const spriteGroup = this.initSpriteGroup(groupId);

        if (groupId != "default") {
            spriteGroup.total += 1;
        }
        if (!sprite) {
            console.warn(`[ResourcesManager] setSprite called with invalid target for ${name}`);
            spriteGroup.process += 1;
            return;
        }

        const cached = this.spriteMap[name];
        if (cached) {
            spriteGroup.process += 1;
            if (isValid(sprite.node, true)) {
                sprite.spriteFrame = cached;
                return;
            }
            console.warn(`[ResourcesManager] Target node destroyed before applying cached sprite ${name}`);
            return;
        }

        if (!this.spritePromises[name]) {
            this.spritePromises[name] = this.loadSpriteFrame(name).then((spriteFrame) => {
                spriteGroup.process += 1;
                if (spriteFrame) {
                    this.spriteMap[name] = spriteFrame;
                }
                delete this.spritePromises[name];
                return spriteFrame;
            });
        }

        this.spritePromises[name].then((spriteFrame) => {
            spriteGroup.process += 1;
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


