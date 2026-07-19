import { Command } from 'commander';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { writeFile, readFile, appendFile } from 'fs/promises';
import chalk from 'chalk';
import ora from 'ora';

const MOCHA_DS_REPO = 'https://raw.githubusercontent.com/is-suzart/mocha-framework/main/design-system/MochaDS';

const KNOWN_COMPONENTS = [
  'Button', 'TextField', 'Checkbox', 'Switch', 'RadioButton', 'RadioGroup',
  'Select', 'Dropdown', 'Modal', 'Drawer', 'Card', 'Tile', 'Badge', 'Avatar',
  'Tabs', 'Accordion', 'Toast', 'Tooltip', 'ContextMenu', 'Slider', 'PinInput',
  'Table', 'Paginator', 'ProgressBar', 'Stepper', 'Steps', 'Breadcrumb',
  'Tag', 'EmptyState', 'AlertDialog', 'HeroCarousel', 'Separator',
  'CozyList', 'CozyGrid', 'CozySpinner', 'CozySkeleton',
  'HStack', 'VStack', 'Box', 'AdaptiveStack',
  'FadeIn', 'SlideUp', 'ZoomIn',
  'FormController', 'MochaMap', 'FocusRing',
  'LucideIcon', 'Draggable', 'DropZone', 'SortableList',
];

export const addCommand = new Command('add')
  .argument('<component>', 'component name to add')
  .option('--path <path>', 'target directory', 'ui/MochaDS')
  .description('download a Mocha-DS component into your project')
  .action(async (component: string, options: { path: string }) => {
    const spinner = ora();

    const normalized = component.charAt(0).toUpperCase() + component.slice(1);

    if (!KNOWN_COMPONENTS.includes(normalized)) {
      spinner.fail(chalk.red(`Unknown component "${normalized}".`));
      console.log(chalk.dim(`Available: ${KNOWN_COMPONENTS.join(', ')}`));
      process.exit(1);
    }

    const targetDir = join(process.cwd(), options.path);
    mkdirSync(targetDir, { recursive: true });

    const fileName = `${normalized}.qml`;
    const targetFile = join(targetDir, fileName);

    if (existsSync(targetFile)) {
      const { confirm } = await import('@inquirer/prompts');
      const answer = await confirm({
        message: `${fileName} already exists. Overwrite?`,
        default: false,
      });
      if (!answer) {
        console.log(chalk.yellow('Skipped.'));
        process.exit(0);
      }
    }

    spinner.start(`Downloading ${fileName}...`);

    try {
      const response = await fetch(`${MOCHA_DS_REPO}/${fileName}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const content = await response.text();
      await writeFile(targetFile, content, 'utf-8');
      
      const qmldirPath = join(targetDir, 'qmldir');
      let qmldirContent = '';
      if (existsSync(qmldirPath)) {
        qmldirContent = await readFile(qmldirPath, 'utf-8');
      } else {
        qmldirContent = 'module MochaDS\n';
        await writeFile(qmldirPath, qmldirContent, 'utf-8');
      }
      
      const moduleLine = `${normalized} ${fileName}`;
      if (!qmldirContent.includes(moduleLine)) {
        await appendFile(qmldirPath, `\n${moduleLine}`, 'utf-8');
      }

      spinner.succeed(chalk.green(`Added ${fileName} to ${options.path}/`));
    } catch (err) {
      spinner.fail(chalk.red(`Failed to download ${fileName}: ${err}`));
      process.exit(1);
    }
  });
