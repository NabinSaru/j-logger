export interface LogTypes {
  [key: string]: (req: Request, res: Response) => string;
}

export interface CallbackFunction<T = any> {
  (...args: T[]): void;
}
