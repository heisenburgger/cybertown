import { config } from "@/config";

const WINDOW_FEATURES = "toolbar=no, menubar=no, width=600, height=700, top=100, left=100"

type CallbackFn =  (...args: any) => Promise<any>
  
class Popup {
  popupWindow: Window | null = null
  previousURL: string | null = null
  callbacks: CallbackFn[] = []

  // opens the popup window
  open = (url: string, name: string) => {
    window.removeEventListener("message", this.listen)
    if (!this.popupWindow || this.popupWindow.closed) {
      this.popupWindow = window.open(url, name, WINDOW_FEATURES)
    } else if (this.previousURL !== url) {
      this.popupWindow = window.open(url, name, WINDOW_FEATURES)
      this.popupWindow?.focus()
    } else {
      this.popupWindow?.focus()
    }
    window.addEventListener("message", this.listen)
    this.previousURL = url
  }

  // listens for incoming message after the popup
  // redirected to "auth-redirect" route
  listen = async(e: MessageEvent<{ type: string }>) => {
    if (e.origin !== config.baseURL) {
      return
    }
    if(e.data.type === 'REDIRECTED') {
      for(let fn of this.callbacks) {
        await fn()
      }
    }
  }

  appendCallback = (fn: CallbackFn) => {
    this.callbacks.push(fn)
  }
}

export const authPopup = new Popup()
