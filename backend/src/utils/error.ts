export class AppError extends Error {
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
