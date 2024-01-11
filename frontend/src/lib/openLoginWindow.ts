import { config } from "@/config";
import { api } from "./api"
import { UserDispatch, loginUser } from "@/context/UserContext";

const WINDOW_FEATURES = "toolbar=no, menubar=no, width=600, height=700, top=100, left=100"

class Popup {
  popupWindow: Window | null = null
  previousURL: string | null = null
  // I know this is a shitty thing to do, but pls gimme a break (edit: I think this is neat)
  userDispatch: UserDispatch | null = null

  // opens the popup window
  open = (url: string, name: string, userDispatch: UserDispatch) => {
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
    this.userDispatch = userDispatch
  }

  // listens for incoming message after the popup
  // redirected to "auth-redirect" route
  listen = async(e: MessageEvent) => {
    if (e.origin !== config.baseURL) {
      return
    }
    const user = await api.whoAmI()
    if(this.userDispatch) {
      loginUser(user, this.userDispatch)
    }
  }
}

// singleton (i know big words)
export const authPopup = new Popup()
