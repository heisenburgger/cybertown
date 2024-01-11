import { z } from 'zod'
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { SocketRoom } from '@/types'

type Props = {
  welcomeMessage: string
  room: SocketRoom
}

const updateWelcomeMessageSchema = z.object({
  welcomeMessage: z.string().optional()
})


export function WelcomeMessage(props: Props) {
  const { welcomeMessage } = props
  const loading = false

  const form = useForm<z.infer<typeof updateWelcomeMessageSchema>>({
    resolver: zodResolver(updateWelcomeMessageSchema),
    values: {
      welcomeMessage
    }
  })

  async function onSubmit(values: z.infer<typeof updateWelcomeMessageSchema>) {
    console.log("values:", values)
  }

  return (
    <div className="mt-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="welcomeMessage"
            render={({ field }) => {
              return <FormItem>
                <FormLabel>Welcome Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Type welcome message here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            }}
          />
          <Button disabled={loading} type="submit" className="self-end px-4 py-1 h-auto">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <span>Submit</span>
          </Button>
        </form>
      </Form>
    </div>
  )
}
