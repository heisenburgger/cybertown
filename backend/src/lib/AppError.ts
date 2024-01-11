export class AppError extends Error {
  /* why typescript?
     -> https://github.com/microsoft/TypeScript/issues/13965
  */
  __proto__: Error;
  message: string
  statusCode: number

  constructor(statusCode: number, message: string) {
   const trueProto = new.target.prototype;
    super(message)
    this.statusCode = statusCode
    this.message = message
    this.__proto__ = trueProto;
  }
}

