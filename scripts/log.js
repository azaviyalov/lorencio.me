import chalk from "chalk";

export const log = {
  error: (message, detail) => console.error(chalk.red(message), ...(detail ? [detail] : [])),
  info: (message) => console.log(chalk.cyan(message)),
  muted: (message) => console.log(chalk.gray(message)),
  success: (message) => console.log(chalk.green(message)),
};
