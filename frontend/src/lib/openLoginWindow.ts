import { config } from "@/config";
import { api } from "./api"
import { UserDispatch, loginUser } from "@/context/UserContext";

const WINDOW_FEATURES = "toolbar=no, menubar=no, width=600, height=700, top=100, left=100"

let popupWindow: Window | null = null
let previousURL: string | null = null
// I know this is a shitty thing to do, but pls gimme a break
let userDispatch: UserDispatch | null = null

async function receiveMessage(e: MessageEvent) {
  if (e.origin !== config.baseURL) {
    return
  }
  const user = await api.whoAmI()
  if(userDispatch) {
    loginUser(user, userDispatch)
  }
}

export function openLoginWindow(url: string, name: string, dispatch: UserDispatch) {
  window.removeEventListener("message", receiveMessage)
  if (!popupWindow || popupWindow.closed) {
    popupWindow = window.open(url, name, WINDOW_FEATURES)
  } else if (previousURL !== url) {
    popupWindow = window.open(url, name, WINDOW_FEATURES)
    popupWindow?.focus()
  } else {
    popupWindow?.focus()
  }
  window.addEventListener("message", receiveMessage)
  previousURL = url
  userDispatch = dispatch
}
