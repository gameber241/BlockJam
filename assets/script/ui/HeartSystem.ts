import { director, sys } from "cc";

export class HeartSystem {
    public maxHearts: number = 7;
    private minHearts: number = 0;
    private regenTime: number = 10; // 10 phút = 600 giây
    public currentHearts: number = 1
    private lastUpdate: number = Date.now();

    private storageKey: string = "HEART_SYSTEM";

    private intervalId: any = null; // quản lý interval

    constructor() {
        this.loadData();
        this.updateHearts();
        this.checkInterval();
    }

    public getHearts(): number {
        this.updateHearts();
        return this.currentHearts;
    }

    public useHeart(): boolean {
        this.updateHearts();
        if (this.currentHearts > this.minHearts) {
            this.currentHearts--;
            this.lastUpdate = Date.now();
            this.saveData();
            this.checkInterval(); // bật interval nếu cần
            return true;
        }
        return false;
    }

    public addHeart(amount: number) {
        this.updateHearts();
        this.currentHearts = Math.min(this.maxHearts, this.currentHearts + amount);
        this.saveData();
        this.checkInterval(); // có thể tắt interval nếu full tim
    }

    public getTimeToNextHeart(): number {
        this.updateHearts();
        if (this.currentHearts >= this.maxHearts) return 0;
        const now = Date.now();
        const elapsed = Math.floor((now - this.lastUpdate) / 1000);
        return Math.max(0, this.regenTime - elapsed);
    }

    // ====== PRIVATE ======

    private updateHearts() {
        if (this.currentHearts >= this.maxHearts) {
            // Đang full tim -> reset lại mốc, không cần tính countdown
            this.lastUpdate = Date.now();
            this.saveData();
            return;
        }

        const now = Date.now();
        const elapsed = Math.floor((now - this.lastUpdate) / 1000);

        if (elapsed >= this.regenTime) {
            // Hồi được bao nhiêu tim
            const heartsToAdd = Math.floor(elapsed / this.regenTime);
            this.currentHearts = Math.min(this.maxHearts, this.currentHearts + heartsToAdd);

            // Chỉ cập nhật lastUpdate khi thực sự có tim được cộng
            if (heartsToAdd > 0) {
                const leftover = elapsed % this.regenTime;
                this.lastUpdate = now - leftover * 1000;
            }

            this.saveData()
        }
    }

    private saveData() {
        const data = {
            currentHearts: this.currentHearts,
            lastUpdate: this.lastUpdate
        };
        sys.localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    private loadData() {
        const raw = sys.localStorage.getItem(this.storageKey);
        if (raw) {
            try {
                const data = JSON.parse(raw);
                this.currentHearts = data.currentHearts ?? this.maxHearts;
                this.lastUpdate = data.lastUpdate ?? Date.now();
            } catch (e) {
                console.warn("Lỗi parse dữ liệu tim:", e);
            }
        }
    }

    // Quản lý interval tự động
    private checkInterval() {

        if (this.currentHearts >= this.maxHearts) {
            // đã full tim -> tắt interval

            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        } else {
            // chưa full tim -> bật interval
            if (!this.intervalId) {
                this.intervalId = setInterval(() => {
                    director.emit("UpDateHeart")
                    this.updateHearts();

                    if (this.currentHearts >= this.maxHearts) {
                        this.checkInterval(); // tắt interval khi full
                    }
                }, 1000); // update mỗi giây
            }
        }
    }


    private pad(num: number): string {
        return num < 10 ? "0" + num : "" + num;
    }

    public getTimeStringToNextHeart(): string {
        const sec = this.getTimeToNextHeart();
        if (sec <= 0) return "00:00";
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${this.pad(minutes)}:${this.pad(seconds)}`;
    }

}
