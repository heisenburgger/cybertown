import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRoomStore } from "@/stores"
import { Mail, Settings as SettingsIcon, LayoutGrid } from 'lucide-react'
import { WidgetTab } from '@/types'
import { cn } from "@/lib/utils"

export function RoomSidebar() {
  const setWidgetTab = useRoomStore(state => state.setWidgetTab)
  const setWidgetMode = useRoomStore(state => state.setWidgetMode)
  const setUnreadMessagesFor = useRoomStore(state => state.setUnreadMessagesFor)
  const unreadMessages = useRoomStore(state => state.unreadMessages.widgetCollapsed)

  const tabs = [
    { Icon: Mail, value: "messages" },
    { Icon: LayoutGrid, value: "apps" },
    { Icon: SettingsIcon, value: "settings" },
  ] as const

  function openWidget(tab: WidgetTab) {
    setWidgetTab(tab)
    setUnreadMessagesFor('widgetCollapsed', 0)
    setWidgetMode('expanded')
  }

  return (
    <div className="border-l flex flex-col gap-8 py-8 items-center">
      {tabs.map(tab => {
        const { Icon } = tab
        return (
          <TooltipProvider key={tab.value}>
            <Tooltip>
              <TooltipTrigger className="relative" onClick={() => openWidget(tab.value)}>
                <Icon strokeWidth="1" />
                {tab.value === 'messages' && unreadMessages > 0 && <span className={cn("absolute -bottom-2 -right-2 rounded-full bg-[#f23f42] h-4 w-4 text-[10px] flex items-center justify-center font-semibold", {
                  'h-[16px] w-[22px] text-[9px]': unreadMessages >= 10,
                  'w-[26px]': unreadMessages >= 100
                })}>{unreadMessages >= 100 ? `99+` : unreadMessages}</span>}
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="capitalize">{tab.value}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}
    </div>
  )
}
