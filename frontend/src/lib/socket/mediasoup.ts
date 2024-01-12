import { appMediasoup } from "../AppMediasoup";
import { TransportOptions, TransportDirection } from '@/types'

export const mediasoupHandler = {
  transportOptions(data: Record<TransportDirection, TransportOptions>) {
    appMediasoup.createTransports(data)
  }
};
