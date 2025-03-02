
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sessionPath = path.join(__dirname, 'MysticSession');

console.log(chalk.yellow('Cleaning up old session files...'));

try {
  if (fs.existsSync(sessionPath)) {
    const files = fs.readdirSync(sessionPath);
    
    // Delete all session files
    for (const file of files) {
      fs.unlinkSync(path.join(sessionPath, file));
      console.log(chalk.green(`Deleted: ${file}`));
    }
    
    console.log(chalk.green.bold('✅ Session cleanup completed successfully!'));
    console.log(chalk.yellow('You can now restart the bot to create a new session.'));
  } else {
    console.log(chalk.red('Session folder not found!'));
  }
} catch (error) {
  console.error(chalk.red('Error during cleanup:'), error);
}
