interface KVinterface {
  [key: string]: string;
}

export const textColors: KVinterface = {
  Black: '\x1b[30m',
  Red: '\x1b[31m',
  Green: '\x1b[32m',
  Yellow: '\x1b[33m',
  Blue: '\x1b[34m',
  Magenta: '\x1b[35m',
  Cyan: '\x1b[36m',
  White: '\x1b[37m',
};

export const backgroundColors: KVinterface = {
  Black: '\x1b[40m',
  Red: '\x1b[41m',
  Green: '\x1b[42m',
  Yellow: '\x1b[43m',
  Blue: '\x1b[44m',
  Magenta: '\x1b[45m',
  Cyan: '\x1b[46m',
  White: '\x1b[47m',
};

export const formattingOptions: KVinterface = {
  Reset: '\x1b[0m',
  Bold: '\x1b[1m',
  Italic: '\x1b[3m',
  Underline: '\x1b[4m',
  Blink: '\x1b[5m',
  ReverseVideo: '\x1b[7m',
  Hidden: '\x1b[8m',
};

export const brightColors: KVinterface = {
  Black: '\x1b[90m',
  Red: '\x1b[91m',
  Green: '\x1b[92m',
  Yellow: '\x1b[93m',
  Blue: '\x1b[94m',
  Magenta: '\x1b[95m',
  Cyan: '\x1b[96m',
  White: '\x1b[97m',
};
