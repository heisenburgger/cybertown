import { useRoomStore } from "@/stores"
import { ChevronRight, ChevronLeft } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function RoomHeader() {
  const isWidgetExpanded = useRoomStore(state => state.widgetMode === 'expanded')
  const setWidgetMode = useRoomStore(state => state.setWidgetMode)

  function handleWidgetExpansion() {
    setWidgetMode(isWidgetExpanded ? 'collapsed' : 'expanded')
  }

  return (
    <div className="p-4 flex flex-1 w-full">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="ml-auto p-0.5 border full flex items-center justify-center" onClick={handleWidgetExpansion}>
            {isWidgetExpanded ? <ChevronRight strokeWidth="1" /> : <ChevronLeft strokeWidth="1" />}
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{isWidgetExpanded ? 'Close' : 'Open'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
