import { _decorator, Asset, AudioClip, Component, JsonAsset, Node, Prefab, resources, SpriteFrame, TextAsset } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;

@ccclass('ResourcesManager')
export class ResourcesManager extends BaseSingleton<ResourcesManager> {
    private clipMap: Record<string, AudioClip> = {};
    private spriteMap: Record<string, SpriteFrame> = {};
    private jsonMap: Record<string, any> = {};
    private txtMap: Record<string, string> = {};

    public async loadAllResources() {
        return new Promise<void>((resolve, reject) => {
            resources.loadDir(
                "", // load tất cả trong resources/
                (finished: number, total: number) => {
                    const percent = (finished / total * 100).toFixed(2);
                },
                (err, assets: Asset[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    for (let i = 0; i < assets.length; i++) {
                        const asset = assets[i];

                        if (asset instanceof AudioClip) {
                            if (!this.clipMap[asset.name]) {
                                this.clipMap[asset.name] = asset;
                            }
                        }
                        else if (asset instanceof Prefab) {
                            PoolManager.getInstance().setPrefab(asset.name, asset);
                        }
                        else if (asset instanceof SpriteFrame) {
                            if (!this.spriteMap[asset.name]) {
                                this.spriteMap[asset.name] = asset;
                            }
                        }
                        else if (asset instanceof JsonAsset) {
                            if (!this.jsonMap[asset.name]) {
                                this.jsonMap[asset.name] = asset.json;
                            }
                        }
                        else if (asset instanceof TextAsset) {
                            const text = asset.text;
                            const textArr = text.split(/[(\r\n)\r\n]+/);
                            for (let j = 0; j < textArr.length; j++) {
                                const level = j + 1;
                                this.txtMap[`word_${level}`] = textArr[j];
                            }
                        }
                    }

                    resolve();
                }
            );
        });
    }


    public getSprite(name) {
        return this.spriteMap[name]
    }



}


