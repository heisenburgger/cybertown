import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { WidgetTab, useRoomStore } from "@/stores"

import { Mail, Settings as SettingsIcon, LayoutGrid } from 'lucide-react'

export function RoomSidebar() {
  const setWidgetTab = useRoomStore(state => state.setWidgetTab)
  const setWidgetExpansion = useRoomStore(state => state.setWidgetExpansion)

  const tabs = [
    { Icon: Mail, value: "messages" },
    { Icon: LayoutGrid, value: "apps" },
    { Icon: SettingsIcon, value: "settings" },
  ] as const

  function openWidget(tab: WidgetTab) {
    setWidgetTab(tab)
    setWidgetExpansion(true)
  }

  return (
    <div className="border-l flex flex-col gap-8 py-8 items-center">
      {tabs.map(tab => {
        const { Icon } = tab
        return (
          <TooltipProvider key={tab.value}>
            <Tooltip>
              <TooltipTrigger onClick={() => openWidget(tab.value)}>
                <Icon strokeWidth="1" />
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
