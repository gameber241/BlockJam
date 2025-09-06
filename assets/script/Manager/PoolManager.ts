import { _decorator, Component, instantiate, Node, NodePool, Prefab, Vec3 } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';
const { ccclass, property } = _decorator;

@ccclass('PoolManager')
export class PoolManager extends BaseSingleton<PoolManager> {
    private _dictPool: Record<string, NodePool> = {};
    private _dictPrefab: Record<string, Prefab | Node> = {};

    public copyNode(copynode: Node, parent?: Node | null): Node {
        let name = copynode.name;
        this._dictPrefab[name] = copynode;
        let node: Node | null = null;

        if (this._dictPool.hasOwnProperty(name)) {
            let pool = this._dictPool[name];
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = instantiate(copynode);
            }
        } else {
            let pool = new NodePool();
            this._dictPool[name] = pool;
            node = instantiate(copynode);
        }

        if (parent) {
            node.parent = parent;
            node.active = true;
        }
        return node;
    }


    public getNode(prefab: Prefab | string, parent?: Node, pos?: Vec3): Node | null {
        let tempPre: Prefab | Node | null = null;
        let name: string;

        if (typeof prefab === 'string') {
            tempPre = this._dictPrefab[prefab];
            name = prefab;
            if (!tempPre) {
                return null;
            }
        } else {
            tempPre = prefab;
            name = prefab.name; // 3.x dùng .name, không còn .data.name
        }

        let node: Node | null = null;
        if (this._dictPool.hasOwnProperty(name)) {
            let pool = this._dictPool[name];
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = instantiate(tempPre as Prefab);
            }
        } else {
            let pool = new NodePool();
            this._dictPool[name] = pool;
            node = instantiate(tempPre as Prefab);
        }

        if (parent) {
            node.parent = parent;
            node.active = true;
            if (pos) node.setPosition(pos);
        }
        return node;
    }

    
    public putNode(node: Node | null, isActive = false) {
        if (!node) return;

        let name = node.name;
        let pool: NodePool | null = null;

        if (this._dictPool.hasOwnProperty(name)) {
            pool = this._dictPool[name];
        } else {
            pool = new NodePool();
            this._dictPool[name] = pool;
        }

        node.active = isActive;
        pool.put(node);
    }

    public clearPool(name: string) {
        if (this._dictPool.hasOwnProperty(name)) {
            let pool = this._dictPool[name];
            pool.clear();
        }
    }

    public setPrefab(name: string, prefab: Prefab): void {
        this._dictPrefab[name] = prefab;
    }

    public getPrefab(name: string): Prefab | Node {
        return this._dictPrefab[name];
    }
}


