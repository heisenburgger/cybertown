import { Response, Request, NextFunction  } from 'express'
import { config } from '..'

export function cors(req: Request, res: Response, next: NextFunction) {
  for(let origin of config.allowedOrigins) {
    if(origin === req.get('Origin')) {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      if(req.method === 'OPTIONS' && req.get('Access-Control-Request-Method')) {
        res.setHeader('Access-Control-Allow-Methods', 'POST,DELETE,UPDATE')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        res.send('OK')
        return
      }
    }
  }
  next()
}

