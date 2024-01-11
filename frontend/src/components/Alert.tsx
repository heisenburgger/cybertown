import * as RAlertDialog from '@radix-ui/react-alert-dialog'
import React from 'react'

type Props = {
  children: React.ReactNode
  title: string
  description: string
  onCancel: () => void
  onOk: () => void
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function Alert(props: Props) {
  const { children, title, description, onOk, onCancel, open, setOpen } = props

  return (
    <RAlertDialog.Root open={open} onOpenChange={setOpen}>
      {children}
      <RAlertDialog.Portal>
        <RAlertDialog.Overlay className="fixed inset-0 bg-[#7F5AF010]" />
        <RAlertDialog.Content className="fixed inset-0 flex items-center justify-center w-screen">
          <div className="bg-[#111113B2] rounded-lg p-4 max-w-screen-sm mx-2">
            <RAlertDialog.Title className="text-lg mb-3">
              {title}
            </RAlertDialog.Title>
            <RAlertDialog.Description className="text-[#F1F7FEB2] pb-8">
              {description}
            </RAlertDialog.Description>
            <div className="mt-auto flex flex-col md:flex-row gap-3">
              <RAlertDialog.AlertDialogCancel>
              </RAlertDialog.AlertDialogCancel>
              <button className="md:ml-auto border border-[#1B1D1E] px-8 py-2 rounded-lg" onClick={onCancel}>Cancel</button>
              <button className="bg-[#7F5AF0] px-8 py-2 rounded-lg" onClick={onOk}>Log Out</button>
            </div>
          </div>
        </RAlertDialog.Content>
      </RAlertDialog.Portal>
    </RAlertDialog.Root>
  )
}
