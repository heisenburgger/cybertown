import Picker from '@emoji-mart/react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SmilePlus } from 'lucide-react'

type Props = {
  onSelect: (emoji: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

export function EmojiPicker(props: Props) {
  const { onSelect, open, setOpen } = props

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="self-end">
        <SmilePlus strokeWidth="1" className="ml-auto" size="18" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 mr-4">
        <Picker onEmojiSelect={(e: any) => {
          onSelect(e.id)
        }} previewPosition="none" />
      </PopoverContent>
    </Popover>
  )
}
