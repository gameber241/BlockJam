import { ReceiveMessageToNative } from "./ReceiveMessageToNative"

declare global {
    interface Window {
        ReceiveMessageToNative: ReceiveMessageToNative
    }
}

export { }
