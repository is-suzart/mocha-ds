import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  CtpLineChart,
  CtpAreaChart,
  CtpBarChart,
  CtpPieChart,
  CtpRadarChart,
} from './charts';
import {
  Button,
  ButtonVariant,
  ButtonColor,
  ButtonSize,
  ButtonShape,
  ButtonGroup,
  ButtonGroupItem,
  Accordion,
  ButtonGroupOrientation,
  ButtonGroupVariant,
  ButtonGroupSelectionMode,
  Stepper,
  StepItem,
  StepperOrientation,
  StepperVariant,
  Overlay,
  Modal,
  Input,
  Select,
  FormGroup,
  Tabs,
  TabsList,
  TabsTrigger,

  TabsContent,
  TabsVariant,
  TabsOrientation,
  Drawer,
  DrawerPosition,
  DrawerSize,
  DynamicForm,
  FieldSchema,
  MultiSelect,
  TreeSelect,
  TreeNode,
  MultiSelectOption,
  Steps,
  StepsSlider,
  StepsColor,
  StepsVariant,
  ProgressBar,
  ProgressBarSize,
  ProgressBarColor,
  ColorPicker,
  ColorPickerVariant,
  ColorPickerSize,
  FormControlColor,
  FormControlSize,
  FormControlShape,
  Pagination,
  PageSizeSelector,
  Table,
  Column,
  Card,
  CardVariant,
  CardShape,
  CardPadding,
  CardAccentColor,
  CardAccentPosition,
  Tile,
  CatIcon,
  PawIcon,
  YarnIcon,
  CupIcon,
  LaptopIcon,
  FishIcon,
  MouseIcon,
  MoonIcon,
  SunIcon,
  CloudIcon,
  SparklesIcon,
  HomeIcon,
  SettingsIcon,
  UserIcon,
  BellIcon,
  SearchIcon,
  FolderIcon,
  DocumentIcon,
  CodeIcon,
  HeartIcon,
  StarIcon,
  TrashIcon,
  CalendarIcon,
  ChatIcon,
  ShieldIcon,
  InfoIcon,
  CheckIcon,
  AlertIcon,
  HelpIcon,
  ExternalLinkIcon,
  PlugIcon,
  DatabaseIcon,
  NodeIcon,
  WorkflowIcon,
  GlobeIcon,
  SyncIcon,
  PuzzleIcon,
  LinkIcon,
  UnlinkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  MoreVerticalIcon,
  MoreHorizontalIcon,
  MenuIcon,
  CloseIcon,
  PlusIcon,
  MinusIcon,
  EditIcon,
  CopyIcon,
  PasteIcon,
  SaveIcon,
  DownloadIcon,
  UploadIcon,
  FilterIcon,
  SortIcon,
  EyeIcon,
  EyeOffIcon,
  BobaIcon,
  MagicWandIcon,
  GhostIcon,

  Badge,
  BadgeVariant,
  BadgeSize,
  BadgeShape,
  BadgeColor,
  Dropdown,
  Tooltip,
  Placement,
  GridGap,
  GridAlign,
  GridValign,
  ToastColor,
  Grid,
  DatePicker,
  DatePickerMode,
  TextEditor,
  TextEditorColor,
  TextEditorSize,
  Shell,
  ShellLayout,
  Sidebar,
  Skeleton,
  Alert,
  Avatar,
  AvatarGroup,
  Breadcrumb,
  Carousel,
  Toaster,
  toast,
  TreeTable,
  TreeColumn,
} from '@mocha-ds/react';

import {
  DragDropProvider,
  ReorderableTabs,
  ReorderableTable,
  Kanban,
} from '@mocha-ds/react-pro';
import type { ReorderableColumn, KanbanColumn, KanbanItem } from '@mocha-ds/react-pro';
import '@mocha-ds/react-pro/pro.css';

import {
  Employee,
  fetchDataFromServer,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  deleteMultipleEmployees,
  getFullLocalDatabase,
  getFilterMetadata
} from './mockDatabase';

import { initialFilesData, FileNode } from './mockFilesDatabase';



// Definitions for color palette info per theme
interface ColorInfo {
  name: string;
  variable: string;
  hexCodes: {
    macchiato: string;
    mocha: string;
    frappe: string;
    latte: string;
    vercel: string;
    'vercel-light': string;
  };
}

const colors: ColorInfo[] = [
  { name: 'Rosewater', variable: '--ctp-rosewater', hexCodes: { macchiato: '#f4dbd6', mocha: '#f5e0dc', frappe: '#f2d5cf', latte: '#dc8a78', vercel: '#f5e0dc', 'vercel-light': '#dc8a78' } },
  { name: 'Flamingo', variable: '--ctp-flamingo', hexCodes: { macchiato: '#f0c6c6', mocha: '#f2cdcd', frappe: '#eebebe', latte: '#dd7878', vercel: '#f2cdcd', 'vercel-light': '#dd7878' } },
  { name: 'Pink', variable: '--ctp-pink', hexCodes: { macchiato: '#f5bde6', mocha: '#f5c2e7', frappe: '#f4b8e4', latte: '#ea76cb', vercel: '#f5c2e7', 'vercel-light': '#ea76cb' } },
  { name: 'Mauve', variable: '--ctp-mauve', hexCodes: { macchiato: '#c6a0f6', mocha: '#cba6f7', frappe: '#ca9ee6', latte: '#8839ef', vercel: '#cba6f7', 'vercel-light': '#8839ef' } },
  { name: 'Red', variable: '--ctp-red', hexCodes: { macchiato: '#ed8796', mocha: '#f38ba8', frappe: '#e78284', latte: '#d20f39', vercel: '#ee0000', 'vercel-light': '#ee0000' } },
  { name: 'Maroon', variable: '--ctp-maroon', hexCodes: { macchiato: '#ee99a0', mocha: '#eba0ac', frappe: '#ea999c', latte: '#e64553', vercel: '#ee0000', 'vercel-light': '#ee0000' } },
  { name: 'Peach', variable: '--ctp-peach', hexCodes: { macchiato: '#f5a97f', mocha: '#fab387', frappe: '#ef9f76', latte: '#fe640b', vercel: '#f5a623', 'vercel-light': '#f5a623' } },
  { name: 'Yellow', variable: '--ctp-yellow', hexCodes: { macchiato: '#eed49f', mocha: '#f9e2af', frappe: '#e5c890', latte: '#df8e1d', vercel: '#f5a623', 'vercel-light': '#f5a623' } },
  { name: 'Green', variable: '--ctp-green', hexCodes: { macchiato: '#a6da95', mocha: '#a6e3a1', frappe: '#a6d189', latte: '#40a02b', vercel: '#50e3c2', 'vercel-light': '#007a22' } },
  { name: 'Teal', variable: '--ctp-teal', hexCodes: { macchiato: '#8bd5ca', mocha: '#94e2d5', frappe: '#81c8be', latte: '#179287', vercel: '#50e3c2', 'vercel-light': '#007a22' } },
  { name: 'Sky', variable: '--ctp-sky', hexCodes: { macchiato: '#91d7e3', mocha: '#89dceb', frappe: '#99d1db', latte: '#04a5e5', vercel: '#89dceb', 'vercel-light': '#04a5e5' } },
  { name: 'Sapphire', variable: '--ctp-sapphire', hexCodes: { macchiato: '#7dc4e4', mocha: '#74c7ec', frappe: '#85c1dc', latte: '#209fb5', vercel: '#74c7ec', 'vercel-light': '#209fb5' } },
  { name: 'Blue', variable: '--ctp-blue', hexCodes: { macchiato: '#8aadf4', mocha: '#89b4fa', frappe: '#8caaee', latte: '#1e66f5', vercel: '#89b4fa', 'vercel-light': '#1e66f5' } },
  { name: 'Lavender', variable: '--ctp-lavender', hexCodes: { macchiato: '#b7bdf8', mocha: '#b4befe', frappe: '#babbf1', latte: '#7287fd', vercel: '#b4befe', 'vercel-light': '#7287fd' } },
  
  /* Semantic Colors */
  { name: 'Primary', variable: '--ctp-primary', hexCodes: { macchiato: '#c6a0f6', mocha: '#cba6f7', frappe: '#ca9ee6', latte: '#8839ef', vercel: '#ffffff', 'vercel-light': '#000000' } },
  { name: 'Secondary', variable: '--ctp-secondary', hexCodes: { macchiato: '#b7bdf8', mocha: '#b4befe', frappe: '#babbf1', latte: '#7287fd', vercel: '#444444', 'vercel-light': '#999999' } },
  { name: 'Success', variable: '--ctp-success', hexCodes: { macchiato: '#a6da95', mocha: '#a6e3a1', frappe: '#a6d189', latte: '#40a02b', vercel: '#50e3c2', 'vercel-light': '#007a22' } },
  { name: 'Warning', variable: '--ctp-warning', hexCodes: { macchiato: '#eed49f', mocha: '#f9e2af', frappe: '#e5c890', latte: '#df8e1d', vercel: '#f5a623', 'vercel-light': '#f5a623' } },
  { name: 'Danger', variable: '--ctp-danger', hexCodes: { macchiato: '#ed8796', mocha: '#f38ba8', frappe: '#e78284', latte: '#d20f39', vercel: '#ee0000', 'vercel-light': '#ee0000' } },
  { name: 'Info', variable: '--ctp-info', hexCodes: { macchiato: '#91d7e3', mocha: '#89dceb', frappe: '#99d1db', latte: '#04a5e5', vercel: '#50e3c2', 'vercel-light': '#007a22' } },
];

// Simple SVG Icons
const HeartFillIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

// Demo Stepper Steps
const demoSteps: StepItem[] = [
  { label: 'Account', description: 'Configure profile credentials', icon: '👤' },
  { label: 'Address', description: 'Provide delivery destinations', icon: '📍' },
  { label: 'Payment', description: 'Authorize credit card processing', icon: '💳' },
  { label: 'Finish', description: 'Receipt and order verification', icon: '🎉' }
];

const stepContents = [
  { title: '📦 Step 1: Account Information', details: 'Setup your standard developer account. Enter username, email, and configure multi-factor security rules.' },
  { title: '✉️ Step 2: Shipping Destination', details: 'Choose shipping locations. Specify residential addresses, zip codes, and pick logistics service providers.' },
  { title: '💳 Step 3: Payment Method', details: 'Complete transaction securely using global processing. Pay with Credit Card, PayPal, or crypto-assets.' },
  { title: '🎉 Step 4: System Confirmation', details: 'Your order was successfully transmitted. Check registered email for trackable delivery status notifications.' }
];

interface GalleryItem {
  title: string;
  text: string;
  variant: ButtonVariant;
  color: ButtonColor;
  size: ButtonSize;
  shape: ButtonShape;
  isLoading: boolean;
  disabled: boolean;
  leftIcon: boolean;
  rightIcon: boolean;
}

const galleryItems: GalleryItem[] = [
  { title: 'Primary Call-To-Action', text: 'Get Started', variant: 'filled', color: 'mauve', size: 'md', shape: 'rounded', isLoading: false, disabled: false, leftIcon: false, rightIcon: true },
  { title: 'Danger Alert', text: 'Delete Account', variant: 'filled', color: 'red', size: 'md', shape: 'rounded', isLoading: false, disabled: false, leftIcon: true, rightIcon: false },
  { title: 'Pill Accent Outline', text: 'Explore Flavors', variant: 'outline', color: 'blue', size: 'sm', shape: 'pill', isLoading: false, disabled: false, leftIcon: false, rightIcon: false },
  { title: 'Subtle Ghost Info', text: 'Learn More', variant: 'ghost', color: 'lavender', size: 'lg', shape: 'rounded', isLoading: false, disabled: false, leftIcon: false, rightIcon: false },
  { title: 'Loading Feedback', text: 'Uploading Files', variant: 'filled', color: 'green', size: 'md', shape: 'rounded', isLoading: true, disabled: false, leftIcon: false, rightIcon: false },
  { title: 'Disabled State', text: 'Locked Feature', variant: 'tonal', color: 'peach', size: 'md', shape: 'rounded', isLoading: false, disabled: true, leftIcon: false, rightIcon: false }
];

// Initial form schema for Dynamic Forms Showcase
const initialFormSchema: FieldSchema[] = [
  { id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'e.g. John Doe', required: true, width: 50 },
  { id: 'emailAddress', label: 'Email Address', type: 'email', placeholder: 'john@catppuccin.com', required: true, width: 50 },
  { id: 'userRole', label: 'System Role', type: 'select', defaultValue: 'developer', options: [{ label: 'Software Developer', value: 'developer' }, { label: 'Product Manager', value: 'pm' }, { label: 'UX/UI Designer', value: 'designer' }], required: true, width: 33 },
  { id: 'experienceYears', label: 'Years of Experience', type: 'slider', defaultValue: 3, validation: { min: 0, max: 20 }, required: false, width: 50 },
  { id: 'skills', label: 'Preferred Stack Options', type: 'radio', defaultValue: 'react', options: [{ label: 'React.js', value: 'react' }, { label: 'Vue.js', value: 'vue' }, { label: 'Angular.js', value: 'angular' }], required: false, width: 100 },
  { id: 'termsChecked', label: 'Accept Cozy Guidelines', type: 'switch', defaultValue: false, required: true, placeholder: 'Agree to community terms of service', width: 100 },
  { id: 'specialRequests', label: 'Special Workspace Instructions', type: 'textarea', placeholder: 'Any extra hardware details...', required: false, width: 100 }
];

// Advanced selects mock data
const selectTechOptions: MultiSelectOption[] = [
  { label: 'React.js', value: 'react' },
  { label: 'Vue.js', value: 'vue' },
  { label: 'Angular.js', value: 'angular' },
  { label: 'Svelte.js', value: 'svelte' },
  { label: 'Next.js', value: 'next' },
  { label: 'Nuxt.js', value: 'nuxt' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'JavaScript', value: 'js' },
  { label: 'Node.js', value: 'node' },
  { label: 'Rust', value: 'rust' }
];

const selectTreeData: TreeNode[] = [
  {
    label: 'projeto-catppuccin',
    value: 'root',
    children: [
      {
        label: 'apps',
        value: 'apps',
        children: [
          { label: 'showcase', value: 'showcase' },
          { label: 'docs', value: 'docs' }
        ]
      },
      {
        label: 'packages',
        value: 'packages',
        children: [
          { label: 'react', value: 'react-pkg' },
          { label: 'css', value: 'css-pkg' },
          { label: 'vue', value: 'vue-pkg' }
        ]
      },
      {
        label: 'configuracoes',
        value: 'configs',
        children: [
          { label: 'package.json', value: 'package-json' },
          { label: 'tsconfig.json', value: 'tsconfig-json' }
        ]
      },
      { label: 'README.md', value: 'readme' }
    ]
  }
];

const mockPorts = [
  { name: 'VS Code Theme', category: 'Editors', stars: '4.8k', developer: 'Catppuccin Org' },
  { name: 'Neovim Theme', category: 'Editors', stars: '3.5k', developer: 'catppuccin/nvim' },
  { name: 'Alacritty Theme', category: 'Terminals', stars: '1.2k', developer: 'alacritty-theme' },
  { name: 'Kitty Theme', category: 'Terminals', stars: '980', developer: 'kitty-theme' },
  { name: 'Tmux plugin', category: 'Utilities', stars: '1.4k', developer: 'tmux-plugins' },
  { name: 'Discord theme', category: 'Chat', stars: '2.1k', developer: 'discord-css' },
  { name: 'Slack theme', category: 'Chat', stars: '450', developer: 'slack-theme' },
  { name: 'Firefox theme', category: 'Browsers', stars: '1.6k', developer: 'firefox-gnome' },
  { name: 'Chrome theme', category: 'Browsers', stars: '820', developer: 'chrome-theme' },
  { name: 'Spicetify theme', category: 'Music', stars: '1.1k', developer: 'spicetify-themes' },
  { name: 'Windows Terminal theme', category: 'Terminals', stars: '750', developer: 'win-terminal' },
  { name: 'Zsh Syntax Highlighting', category: 'Terminals', stars: '2.3k', developer: 'zsh-users' },
  { name: 'Dunst theme', category: 'Desktop', stars: '310', developer: 'dunst-theme' },
  { name: 'Rofi theme', category: 'Desktop', stars: '640', developer: 'rofi-theme' },
  { name: 'Polybar theme', category: 'Desktop', stars: '520', developer: 'polybar-theme' },
  { name: 'i3wm theme', category: 'Desktop', stars: '890', developer: 'i3-theme' },
  { name: 'Sway theme', category: 'Desktop', stars: '430', developer: 'sway-theme' },
  { name: 'GitHub web theme', category: 'Websites', stars: '2.5k', developer: 'github-userstyles' },
  { name: 'YouTube web theme', category: 'Websites', stars: '1.8k', developer: 'youtube-css' },
  { name: 'Reddit web theme', category: 'Websites', stars: '920', developer: 'reddit-theme' },
  { name: 'Obsidian theme', category: 'Editors', stars: '1.5k', developer: 'obsidian-community' },
  { name: 'Emacs theme', category: 'Editors', stars: '410', developer: 'hl-todo' },
  { name: 'Helix editor theme', category: 'Editors', stars: '830', developer: 'helix-editor' },
  { name: 'GIMP theme', category: 'Creative', stars: '190', developer: 'gimp-theme' },
  { name: 'Inkscape theme', category: 'Creative', stars: '250', developer: 'inkscape-styles' },
  { name: 'Blender theme', category: 'Creative', stars: '670', developer: 'blender-addon' },
  { name: 'Steam skin', category: 'Gaming', stars: '1.3k', developer: 'steam-skin' },
  { name: 'Lutris theme', category: 'Gaming', stars: '320', developer: 'lutris-runners' },
  { name: 'RetroArch assets', category: 'Gaming', stars: '280', developer: 'retroarch-assets' },
  { name: 'KDE Plasma theme', category: 'Desktop', stars: '1.7k', developer: 'kde-plasma-theme' },
  { name: 'GNOME Shell styles', category: 'Desktop', stars: '1.9k', developer: 'gnome-shell-styles' },
  { name: 'GTK Themes pack', category: 'Desktop', stars: '2.2k', developer: 'gtk-themes' },
];

const iconPaths: Record<string, string> = {
  CatIcon: '<path d="M12 21c-4.418 0-8-3.582-8-8 0-1.858.634-3.568 1.7-4.93L4 3l5.07 1.7C10.432 4.066 11.142 4 12 4s1.568.066 2.93.7L20 3l-1.7 5.07C19.366 9.432 20 11.142 20 13c0 4.418-3.582 8-8 8z" />\n  <path d="M8.5 12.5c.3-.3.7-.3 1 0M13.5 12.5c.3-.3.7-.3 1 0" />\n  <path d="M3 13.5h-2M3.5 15.5L1.5 16.5M21 13.5h2M20.5 15.5l2 1" />\n  <path d="M12 14.5a.5.5 0 0 1-.5-.5.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5.5.5 0 0 1-.5.5zm-.5 1c.5 0 1-.5 1-.5s.5.5 1 .5" />',
  PawIcon: '<path d="M12 13c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z" />\n  <path d="M7.5 11c-.83 0-1.5-.67-1.5-1.5S6.67 8 7.5 8 9 8.67 9 9.5 8.33 11 7.5 11z" />\n  <path d="M10.5 7c-.83 0-1.5-.67-1.5-1.5S9.67 4 10.5 4 12 4.67 12 5.5 11.33 7 10.5 7z" />\n  <path d="M13.5 7c-.83 0-1.5-.67-1.5-1.5S12.67 4 13.5 4 15 4.67 15 5.5 14.33 7 13.5 7z" />\n  <path d="M16.5 11c-.83 0-1.5-.67-1.5-1.5S15.67 8 16.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />',
  YarnIcon: '<circle cx="12" cy="11" r="7" />\n  <path d="M5.5 8.5c2.5 1 5.5 1 8-1" />\n  <path d="M6 14c3.5-.5 6-3 8-6" />\n  <path d="M8.5 5.5c1 2.5 1 5.5-1 8" />\n  <path d="M14 6c-.5 3.5-3 6-6 8" />\n  <path d="M16.5 15.5c1.5 1 3 2.5 4.5 1.5s1-3.5-1-4-3 .5-3.5 2.5z" />',
  CupIcon: '<path d="M6 8h12v7c0 2.5-2 4.5-4.5 4.5h-3C8 19.5 6 17.5 6 15V8z" />\n  <path d="M18 11h2.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5H18" />\n  <path d="M4 22h16" />\n  <path d="M8 8l1.5-2.5L11 8M13 8l1.5-2.5L16 8" />\n  <path d="M9.5 12.5c.3-.3.7-.3 1 0M13.5 12.5c.3-.3.7-.3 1 0" />\n  <path d="M12 14.5a.5.5 0 0 1-.5-.5.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5.5.5 0 0 1-.5.5zm-.5 1c.5 0 1-.5 1-.5s.5.5 1 .5" />\n  <path d="M9 3c.3-.6.1-1.3.4-1.8M14 3c.3-.6.1-1.3.4-1.8" />',
  LaptopIcon: '<rect width="16" height="10" x="4" y="6" rx="1.5" ry="1.5" />\n  <path d="M2 18h20v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z" />\n  <path d="M7 6l1.5-2.5L10 6M14 6l1.5-2.5L17 6" />\n  <path d="M9.5 11h.01M14.5 11h.01" />\n  <path d="M11 13.5c.5.5 1.5.5 2 0" />',
  FishIcon: '<path d="M6 12h12M18 12l3-3v6l-3-3zM6 12l-3-3v6l3-3z" />\n  <path d="M9 8v8M12 7v10M15 8v8" />',
  MouseIcon: '<path d="M12 18c3 0 5-2.5 5-5.5C17 9 12 5 12 5S7 9 7 12.5c0 3 2 5.5 5 5.5z" />\n  <path d="M9 8.5c-.8 0-1.5-.7-1.5-1.5S8.2 5.5 9 5.5s1.5.7 1.5 1.5S9.8 8.5 9 8.5z" />\n  <path d="M15 8.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />\n  <path d="M12 18c0 2 1.5 3 3.5 3s3.5-1 4.5-2.5" />',
  MoonIcon: '<path d="M12 3a9 9 0 1 0 9 9 9.75 9.75 0 0 0-.67-3.4 6.75 6.75 0 0 1-11-7.33A9.75 9.75 0 0 0 12 3z" />\n  <path d="M19 3v4M17 5h4" />',
  SunIcon: '<circle cx="12" cy="12" r="4" />\n  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />',
  CloudIcon: '<path d="M12 5a6 6 0 0 0-5.83 4.6A4.5 4.5 0 0 0 2.5 14c0 2.5 2 4.5 4.5 4.5h10a4 4 0 0 0 4-4c0-2.2-1.8-4-4-4h-.2A5.98 5.98 0 0 0 12 5z" />',
  SparklesIcon: '<path d="M10 3c0 3.5-2.5 6-6 6 3.5 0 6 2.5 6 6 0-3.5 2.5-6 6-6-3.5 0-6-2.5-6-6z" />\n  <path d="M19 2c0 2-1.5 3.5-3.5 3.5 2 0 3.5 1.5 3.5 3.5 0-2 1.5-3.5 3.5-3.5-2 0-3.5-1.5-3.5-3.5zM17 15c0 1.5-1 2.5-2.5 2.5 1.5 0 2.5 1 2.5 2.5 0-1.5 1-2.5 2.5-2.5-1.5 0-2.5-1-2.5-2.5z" />',
  HomeIcon: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />\n  <path d="M9 22V12h6v10" />',
  SettingsIcon: '<circle cx="12" cy="12" r="3" />\n  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1-2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />',
  UserIcon: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />\n  <circle cx="12" cy="7" r="4" />',
  BellIcon: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z" />\n  <path d="M13.73 21a2 2 0 0 1-3.46 0" />',
  SearchIcon: '<circle cx="11" cy="11" r="8" />\n  <path d="m21 21-4.3-4.3" />',
  FolderIcon: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />',
  DocumentIcon: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />\n  <path d="M14 2v4a1 1 0 0 0 1 1h4M8 13h8M8 17h8" />',
  CodeIcon: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />',
  HeartIcon: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />',
  StarIcon: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />',
  TrashIcon: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />',
  CalendarIcon: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2" />\n  <path d="M16 2v4M8 2v4M3 10h18" />',
  ChatIcon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />',
  ShieldIcon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />',
  InfoIcon: '<circle cx="12" cy="12" r="10" />\n  <path d="M12 16v-4M12 8h.01" />',
  CheckIcon: '<path d="M20 6 9 17l-5-5" />',
  AlertIcon: '<path d="m12 2 10 18H2L12 2z" />\n  <path d="M12 9v4M12 17h.01" />',
  HelpIcon: '<circle cx="12" cy="12" r="10" />\n  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />',
  ExternalLinkIcon: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />',

  // Batch 2 Connectivity & Data
  PlugIcon: '<path d="M8 9c0-2.2 1.8-4 4-4s4 1.8 4 4v4c0 2.2-1.8 4-4 4s-4-1.8-4-4V9z" />\n  <path d="M10 5V2M14 5V2M12 17v5" />',
  DatabaseIcon: '<ellipse cx="12" cy="5" rx="9" ry="3" />\n  <path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" />',
  NodeIcon: '<circle cx="12" cy="12" r="3" />\n  <circle cx="6" cy="6" r="2" />\n  <circle cx="18" cy="6" r="2" />\n  <circle cx="12" cy="19" r="2" />\n  <path d="M9.9 9.9l-1.8-1.8M14.1 9.9l1.8-1.8M12 15v2" />',
  WorkflowIcon: '<circle cx="4" cy="12" r="2" />\n  <circle cx="12" cy="6" r="2" />\n  <circle cx="12" cy="18" r="2" />\n  <circle cx="20" cy="12" r="2" />\n  <path d="M5.6 10.8l4.8-3.6M5.6 13.2l4.8 3.6M13.6 7.2l4.8 3.6M13.6 16.8l4.8-3.6" />',
  GlobeIcon: '<circle cx="12" cy="12" r="10" />\n  <path d="M2 12h20M12 2v20" />\n  <path d="M12 2c3.5 3 5.5 6.5 5.5 10S15.5 19 12 22M12 2C8.5 5 6.5 8.5 6.5 12S8.5 19 12 22" />',
  SyncIcon: '<path d="M21.5 2v6h-6M2.5 22v-6h6" />\n  <path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.3" />',
  PuzzleIcon: '<path d="M8 14V8a1 1 0 0 1 1-1h2a2 2 0 1 0 4 0h2a1 1 0 0 1 1 1v2a2 2 0 1 0 0 4v2a1 1 0 0 1-1 1h-2a2 2 0 1 1-4 0H9a1 1 0 0 1-1-1v-2a2 2 0 1 1 0-4z" />',
  LinkIcon: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />\n  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />\n  <line x1="8" y1="16" x2="16" y2="8" />',
  UnlinkIcon: '<path d="M18.85 9.14l1.42-1.42a4 4 0 1 0-5.66-5.66l-3.53 3.53a4 4 0 0 0 0 5.66" />\n  <path d="M5.15 14.86l-1.42 1.42a4 4 0 1 0 5.66 5.66l3.53-3.53a4 4 0 0 0 0-5.66" />',

  // Batch 2 Directionals & Layout
  ChevronUpIcon: '<path d="m18 15-6-6-6 6" />',
  ChevronDownIcon: '<path d="m6 9 6 6 6-6" />',
  ChevronLeftIcon: '<path d="m15 18-6-6 6-6" />',
  ChevronRightIcon: '<path d="m9 18 6-6-6-6" />',
  ArrowUpIcon: '<line x1="12" y1="19" x2="12" y2="5" />\n  <polyline points="5 12 12 5 19 12" />',
  ArrowDownIcon: '<line x1="12" y1="5" x2="12" y2="19" />\n  <polyline points="19 12 12 19 5 12" />',
  ArrowLeftIcon: '<line x1="19" y1="12" x2="5" y2="12" />\n  <polyline points="12 19 5 12 12 5" />',
  ArrowRightIcon: '<line x1="5" y1="12" x2="19" y2="12" />\n  <polyline points="12 5 19 12 12 19" />',
  MoreVerticalIcon: '<circle cx="12" cy="12" r="1" fill="currentColor" stroke="currentColor" />\n  <circle cx="12" cy="5" r="1" fill="currentColor" stroke="currentColor" />\n  <circle cx="12" cy="19" r="1" fill="currentColor" stroke="currentColor" />',
  MoreHorizontalIcon: '<circle cx="12" cy="12" r="1" fill="currentColor" stroke="currentColor" />\n  <circle cx="5" cy="12" r="1" fill="currentColor" stroke="currentColor" />\n  <circle cx="19" cy="12" r="1" fill="currentColor" stroke="currentColor" />',
  MenuIcon: '<line x1="4" y1="12" x2="20" y2="12" />\n  <line x1="4" y1="6" x2="20" y2="6" />\n  <line x1="4" y1="18" x2="20" y2="18" />',
  CloseIcon: '<line x1="18" y1="6" x2="6" y2="18" />\n  <line x1="6" y1="6" x2="18" y2="18" />',
  PlusIcon: '<line x1="12" y1="5" x2="12" y2="19" />\n  <line x1="5" y1="12" x2="19" y2="12" />',
  MinusIcon: '<line x1="5" y1="12" x2="19" y2="12" />',

  // Batch 2 CRUD Actions
  EditIcon: '<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />',
  CopyIcon: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />\n  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />',
  PasteIcon: '<rect x="8" y="5" width="8" height="4" rx="1" ry="1" />\n  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />\n  <path d="M9 14h6M9 18h6" />',
  SaveIcon: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />\n  <polyline points="17 21 17 13 7 13 7 21" />\n  <polyline points="7 3 7 8 15 8" />',
  DownloadIcon: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />\n  <polyline points="7 10 12 15 17 10" />\n  <line x1="12" y1="15" x2="12" y2="3" />',
  UploadIcon: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />\n  <polyline points="17 8 12 3 7 8" />\n  <line x1="12" y1="3" x2="12" y2="15" />',
  FilterIcon: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />',
  SortIcon: '<path d="m5 7 3-3 3 3M8 4v16M13 17l3 3 3-3M16 20V4" />',
  EyeIcon: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />\n  <circle cx="12" cy="12" r="3" />',
  EyeOffIcon: '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" \n  <line x1="1" y1="1" x2="23" y2="23" />',

  // Batch 2 Catppuccin Soul
  BobaIcon: '<path d="M6 8.5L8.5 20c0 1.1 1.6 2 3.5 2s3.5-.9 3.5-2L18 8.5" />\n  <path d="M5.5 8.5c0-1.5 3-2.5 6.5-2.5s6.5 1 6.5 2.5z" />\n  <path d="M11 18l3-15h2l-3 15z" />\n  <circle cx="9.5" cy="18.5" r="0.8" fill="currentColor" stroke="currentColor" />\n  <circle cx="14.5" cy="18.5" r="0.8" fill="currentColor" stroke="currentColor" />\n  <circle cx="12" cy="20" r="0.8" fill="currentColor" stroke="currentColor" />\n  <circle cx="11.5" cy="16.5" r="0.8" fill="currentColor" stroke="currentColor" />\n  <circle cx="13.5" cy="16" r="0.8" fill="currentColor" stroke="currentColor" />',
  MagicWandIcon: '<path d="M4 20L16 8" />\n  <path d="M14 10l2-2" />\n  <path d="M19 2c0 1.5-1 2.5-2.5 2.5 1.5 0 2.5 1 2.5 2.5 0-1.5 1-2.5 2.5-2.5-1.5 0-2.5-1-2.5-2.5z" />\n  <path d="M11 4c0 1-.7 1.7-1.7 1.7.9 0 1.7.7 1.7 1.7 0-1 .7-1.7 1.7-1.7-1 0-1.7-.7-1.7-1.7z" />\n  <path d="M20 12c0 1-.7 1.7-1.7 1.7.9 0 1.7.7 1.7 1.7 0-1 .7-1.7 1.7-1.7-1 0-1.7-.7-1.7-1.7z" />',
  GhostIcon: '<path d="M12 2a8 8 0 0 0-8 8v12a1 1 0 0 0 1.6.8l1.4-1 1.4 1a1 1 0 0 0 1.2 0l1.4-1 1.4 1a1 1 0 0 0 1.2 0l1.4-1 1.4 1a1 1 0 0 0 1.6-.8V10a8 8 0 0 0-8-8z" />\n  <circle cx="9.5" cy="11" r="0.8" fill="currentColor" stroke="currentColor" />\n  <circle cx="14.5" cy="11" r="0.8" fill="currentColor" stroke="currentColor" />\n  <path d="M11 14.5c.5.5 1.5.5 2 0" />',
};

const iconList = [
  // Catppuccin
  { name: 'CatIcon', component: CatIcon, category: 'Catppuccin' },
  { name: 'PawIcon', component: PawIcon, category: 'Catppuccin' },
  { name: 'YarnIcon', component: YarnIcon, category: 'Catppuccin' },
  { name: 'CupIcon', component: CupIcon, category: 'Catppuccin' },
  { name: 'LaptopIcon', component: LaptopIcon, category: 'Catppuccin' },
  { name: 'FishIcon', component: FishIcon, category: 'Catppuccin' },
  { name: 'MouseIcon', component: MouseIcon, category: 'Catppuccin' },
  { name: 'BobaIcon', component: BobaIcon, category: 'Catppuccin' },
  { name: 'MagicWandIcon', component: MagicWandIcon, category: 'Catppuccin' },
  { name: 'GhostIcon', component: GhostIcon, category: 'Catppuccin' },

  // Celestial
  { name: 'MoonIcon', component: MoonIcon, category: 'Celestial' },
  { name: 'SunIcon', component: SunIcon, category: 'Celestial' },
  { name: 'CloudIcon', component: CloudIcon, category: 'Celestial' },
  { name: 'SparklesIcon', component: SparklesIcon, category: 'Celestial' },

  // Data & Connections
  { name: 'PlugIcon', component: PlugIcon, category: 'Data & Connections' },
  { name: 'DatabaseIcon', component: DatabaseIcon, category: 'Data & Connections' },
  { name: 'NodeIcon', component: NodeIcon, category: 'Data & Connections' },
  { name: 'WorkflowIcon', component: WorkflowIcon, category: 'Data & Connections' },
  { name: 'GlobeIcon', component: GlobeIcon, category: 'Data & Connections' },
  { name: 'SyncIcon', component: SyncIcon, category: 'Data & Connections' },
  { name: 'PuzzleIcon', component: PuzzleIcon, category: 'Data & Connections' },
  { name: 'LinkIcon', component: LinkIcon, category: 'Data & Connections' },
  { name: 'UnlinkIcon', component: UnlinkIcon, category: 'Data & Connections' },

  // UI & Layout
  { name: 'HomeIcon', component: HomeIcon, category: 'UI & Layout' },
  { name: 'SettingsIcon', component: SettingsIcon, category: 'UI & Layout' },
  { name: 'UserIcon', component: UserIcon, category: 'UI & Layout' },
  { name: 'BellIcon', component: BellIcon, category: 'UI & Layout' },
  { name: 'SearchIcon', component: SearchIcon, category: 'UI & Layout' },
  { name: 'FolderIcon', component: FolderIcon, category: 'UI & Layout' },
  { name: 'DocumentIcon', component: DocumentIcon, category: 'UI & Layout' },
  { name: 'CodeIcon', component: CodeIcon, category: 'UI & Layout' },
  { name: 'HeartIcon', component: HeartIcon, category: 'UI & Layout' },
  { name: 'StarIcon', component: StarIcon, category: 'UI & Layout' },
  { name: 'TrashIcon', component: TrashIcon, category: 'UI & Layout' },
  { name: 'CalendarIcon', component: CalendarIcon, category: 'UI & Layout' },
  { name: 'ChatIcon', component: ChatIcon, category: 'UI & Layout' },
  { name: 'ShieldIcon', component: ShieldIcon, category: 'UI & Layout' },
  { name: 'InfoIcon', component: InfoIcon, category: 'UI & Layout' },
  { name: 'CheckIcon', component: CheckIcon, category: 'UI & Layout' },
  { name: 'AlertIcon', component: AlertIcon, category: 'UI & Layout' },
  { name: 'HelpIcon', component: HelpIcon, category: 'UI & Layout' },
  { name: 'ExternalLinkIcon', component: ExternalLinkIcon, category: 'UI & Layout' },
  { name: 'ChevronUpIcon', component: ChevronUpIcon, category: 'UI & Layout' },
  { name: 'ChevronDownIcon', component: ChevronDownIcon, category: 'UI & Layout' },
  { name: 'ChevronLeftIcon', component: ChevronLeftIcon, category: 'UI & Layout' },
  { name: 'ChevronRightIcon', component: ChevronRightIcon, category: 'UI & Layout' },
  { name: 'ArrowUpIcon', component: ArrowUpIcon, category: 'UI & Layout' },
  { name: 'ArrowDownIcon', component: ArrowDownIcon, category: 'UI & Layout' },
  { name: 'ArrowLeftIcon', component: ArrowLeftIcon, category: 'UI & Layout' },
  { name: 'ArrowRightIcon', component: ArrowRightIcon, category: 'UI & Layout' },
  { name: 'MoreVerticalIcon', component: MoreVerticalIcon, category: 'UI & Layout' },
  { name: 'MoreHorizontalIcon', component: MoreHorizontalIcon, category: 'UI & Layout' },
  { name: 'MenuIcon', component: MenuIcon, category: 'UI & Layout' },
  { name: 'CloseIcon', component: CloseIcon, category: 'UI & Layout' },
  { name: 'PlusIcon', component: PlusIcon, category: 'UI & Layout' },
  { name: 'MinusIcon', component: MinusIcon, category: 'UI & Layout' },

  // CRUD Actions
  { name: 'EditIcon', component: EditIcon, category: 'CRUD Actions' },
  { name: 'CopyIcon', component: CopyIcon, category: 'CRUD Actions' },
  { name: 'PasteIcon', component: PasteIcon, category: 'CRUD Actions' },
  { name: 'SaveIcon', component: SaveIcon, category: 'CRUD Actions' },
  { name: 'DownloadIcon', component: DownloadIcon, category: 'CRUD Actions' },
  { name: 'UploadIcon', component: UploadIcon, category: 'CRUD Actions' },
  { name: 'FilterIcon', component: FilterIcon, category: 'CRUD Actions' },
  { name: 'SortIcon', component: SortIcon, category: 'CRUD Actions' },
  { name: 'EyeIcon', component: EyeIcon, category: 'CRUD Actions' },
  { name: 'EyeOffIcon', component: EyeOffIcon, category: 'CRUD Actions' },
];

export default function App() {
  const [theme, setTheme] = useState<'macchiato' | 'mocha' | 'frappe' | 'latte' | 'vercel' | 'vercel-light'>('macchiato');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Navigation: buttons, buttongroup, stepper, modal, tabs, form, steps, progress, drawer, select, colorpicker, table, card, icons
  const [activeComponent, setActiveComponent] = useState<'button' | 'buttongroup' | 'stepper' | 'modal' | 'tabs' | 'form' | 'steps' | 'progress' | 'drawer' | 'select' | 'colorpicker' | 'pagination' | 'table' | 'card' | 'icons' | 'badge' | 'accordion' | 'dropdown' | 'tooltip' | 'grid' | 'typography' | 'texteditor' | 'charts' | 'datepicker' | 'shell' | 'sidebar' | 'skeleton' | 'alert' | 'avatar' | 'breadcrumb' | 'carousel' | 'toast' | 'pro' | 'kanban' | 'template'>('button');

  // --- TEXT EDITOR PLAYGROUND STATES ---
  const [editorColor, setEditorColor] = useState<TextEditorColor>('mauve');
  const [editorSize, setEditorSize] = useState<TextEditorSize>('md');
  const [editorMaxLength, setEditorMaxLength] = useState(0);
  const [editorReadOnly, setEditorReadOnly] = useState(false);
  const [editorContent, setEditorContent] = useState('');



  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showColors, setShowColors] = useState(false);

  // --- TOAST PLAYGROUND STATES ---
  const [toastPosition, setToastPosition] = useState<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'>('bottom-right');
  const [toastFilled, setToastFilled] = useState(false);
  const [toastColor, setToastColor] = useState<ToastColor | ''>('');
  const [toastCustomClass, setToastCustomClass] = useState('');



  // --- BUTTON GROUP PLAYGROUND STATES ---
  const [groupOrientation, setGroupOrientation] = useState<ButtonGroupOrientation>('horizontal');
  const [groupLayoutVariant, setGroupLayoutVariant] = useState<ButtonGroupVariant>('filled');
  const [groupVariant, setGroupVariant] = useState<ButtonVariant>('filled');
  const [groupColor, setGroupColor] = useState<ButtonColor>('mauve');
  const [groupShape, setGroupShape] = useState<ButtonShape>('rounded');
  const [groupCount, setGroupCount] = useState(3);
  const [groupSelectionMode, setGroupSelectionMode] = useState<ButtonGroupSelectionMode>('none');
  const [groupSingleValue, setGroupSingleValue] = useState<string>('opt1');
  const [groupMultiValue, setGroupMultiValue] = useState<string[]>(['opt1', 'opt2']);


  // --- COLOR PICKER PLAYGROUND STATES ---
  const [colorPickerVal, setColorPickerVal] = useState('#cba6f7');
  const [colorPickerVariant, setColorPickerVariant] = useState<ColorPickerVariant>('both');
  const [colorPickerSize, setColorPickerSize] = useState<ColorPickerSize>('md');
  const [colorPickerFlavor, setColorPickerFlavor] = useState<'latte' | 'frappe' | 'macchiato' | 'mocha'>('mocha');
  const [colorPickerShowHexInput, setColorPickerShowHexInput] = useState(true);

  // --- PAGINATION PLAYGROUND STATES ---
  const [paginationPage, setPaginationPage] = useState(1);
  const [paginationLimit, setPaginationLimit] = useState(5);
  const [paginationColor, setPaginationColor] = useState<FormControlColor>('mauve');
  const [paginationSize, setPaginationSize] = useState<FormControlSize>('md');
  const [paginationShape, setPaginationShape] = useState<FormControlShape>('rounded');
  const [paginationShowFirstLast, setPaginationShowFirstLast] = useState(true);
  const [paginationShowPrevNext, setPaginationShowPrevNext] = useState(true);
  const [paginationSiblingCount, setPaginationSiblingCount] = useState(1);
  const [paginationShowPageInput, setPaginationShowPageInput] = useState(true);

  // --- TABLE PLAYGROUND STATES ---
  const [tableSubTab, setTableSubTab] = useState<'standard' | 'tree'>('standard');
  const [treeSearch, setTreeSearch] = useState('');
  const [treeSelectedIds, setTreeSelectedIds] = useState<(string | number)[]>([]);
  const [treeExpandedIds, setTreeExpandedIds] = useState<(string | number)[]>([]);
  const [treeSortField, setTreeSortField] = useState<string>('name');
  const [treeSortOrder, setTreeSortOrder] = useState<'asc' | 'desc' | ''>('asc');
  const [treeColor, setTreeColor] = useState<FormControlColor>('mauve');
  const [treeSize, setTreeSize] = useState<FormControlSize>('md');
  const [treeCascade, setTreeCascade] = useState(true);

  const [tableMode, setTableMode] = useState<'client' | 'server'>('server');
  const [tableData, setTableData] = useState<Employee[]>([]);
  const [tableSearch, setTableSearch] = useState('');
  const [tableStatus, setTableStatus] = useState('All');
  const [tableRole, setTableRole] = useState('All');
  const [tableSortField, setTableSortField] = useState('name');
  const [tableSortOrder, setTableSortOrder] = useState<'asc' | 'desc' | ''>('asc');
  const [tablePage, setTablePage] = useState(1);
  const [tableLimit, setTableLimit] = useState(5);
  const [tableTotalPages, setTableTotalPages] = useState(1);
  const [tableTotalItems, setTableTotalItems] = useState(0);
  const [tableIsLoading, setTableIsLoading] = useState(false);
  const [selectedTableIds, setSelectedTableIds] = useState<(string | number)[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [apiLogs, setApiLogs] = useState<{ id: string; time: string; method: string; url: string; meta: string }[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    id: true,
    name: true,
    email: true,
    role: true,
    department: true,
    status: true,
    salary: true,
    joinedDate: true,
  });
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [tableColor, setTableColor] = useState<FormControlColor>('mauve');
  const [tableSize, setTableSize] = useState<FormControlSize>('md');

  // Pro table demo state
  const demoEmployees: Employee[] = [
    { id: '1', name: 'Alice Silva', email: 'alice@example.com', role: 'Designer', department: 'Design', status: 'Active', salary: 8000, joinedDate: '2023-01-15' },
    { id: '2', name: 'Bruno Costa', email: 'bruno@example.com', role: 'Developer', department: 'Engineering', status: 'Active', salary: 12000, joinedDate: '2022-06-01' },
    { id: '3', name: 'Carla Souza', email: 'carla@example.com', role: 'PM', department: 'Product', status: 'Inactive', salary: 15000, joinedDate: '2021-03-10' },
    { id: '4', name: 'Daniel Oliveira', email: 'daniel@example.com', role: 'Developer', department: 'Engineering', status: 'Pending', salary: 9000, joinedDate: '2024-09-20' },
    { id: '5', name: 'Eduarda Lima', email: 'eduarda@example.com', role: 'Designer', department: 'Design', status: 'Active', salary: 9500, joinedDate: '2023-11-05' },
  ];
  const [proTableData, setProTableData] = useState<Employee[]>(demoEmployees);
  const [proTableColumns, setProTableColumns] = useState<ReorderableColumn<Employee>[]>([
    { key: 'name', header: 'Nome', sortable: true },
    { key: 'email', header: 'E-mail' },
    { key: 'role', header: 'Cargo', sortable: true },
    { key: 'department', header: 'Depto' },
    { key: 'status', header: 'Status', sortable: true },
    { key: 'salary', header: 'Salário', sortable: true, align: 'right' },
  ]);
  const [proTableColumnWidths, setProTableColumnWidths] = useState<Record<string, number>>({});
  const [proSortField, setProSortField] = useState('');
  const [proSortOrder, setProSortOrder] = useState<'asc' | 'desc' | ''>('');
  const [proSelectedIds, setProSelectedIds] = useState<(string | number)[]>([]);

  // Add row form states
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('Software Engineer');
  const [newEmpStatus, setNewEmpStatus] = useState<'Active' | 'Inactive' | 'Pending'>('Active');
  const [newEmpSalary, setNewEmpSalary] = useState('5000');
  const [newEmpJoinedDate, setNewEmpJoinedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Pro Kanban Board states
  const initialKanbanColumns: KanbanColumn[] = [
    { id: 'backlog', title: 'A fazer (Backlog)', color: 'maroon' },
    { id: 'todo', title: 'Pronto para Iniciar (To Do)', color: 'peach' },
    { id: 'in-progress', title: 'Em Progresso (In Progress)', color: 'blue' },
    { id: 'done', title: 'Concluído (Done)', color: 'green' }
  ];
  const initialKanbanItems: KanbanItem[] = [
    { id: 'task-1', columnId: 'done', title: 'Configurar Estrutura Monorepo', description: 'Estruturação do workspace Yarn com pacotes individuais para react, css e showcase.', tags: ['Dev', 'Setup'] },
    { id: 'task-2', columnId: 'done', title: 'Definir Paleta de Cores', description: 'Integração completa com os tons oficiais do Catppuccin (Macchiato/Mocha/Latte).', tags: ['Design'] },
    { id: 'task-3', columnId: 'in-progress', title: 'Implementar Componentes Core', description: 'Desenvolvimento e testes dos botões, inputs, modais e accordion.', tags: ['React', 'Core'] },
    { id: 'task-4', columnId: 'todo', title: 'Redigir Documentação Técnica', description: 'Escrever guias detalhados sobre como consumir os pacotes do design system.', tags: ['Docs'] },
    { id: 'task-5', columnId: 'in-progress', title: 'Criar Componente de Kanban Pro', description: 'Novo componente Kanban com suporte nativo a arrastar e soltar (reordenável).', tags: ['Pro', 'Dev'] },
    { id: 'task-6', columnId: 'backlog', title: 'Testar Acessibilidade Teclado', description: 'Garantir que a reordenação das colunas e cartões atenda aos requisitos WCAG.', tags: ['Acessibilidade'] }
  ];

  const [kanbanColumns] = useState<KanbanColumn[]>(initialKanbanColumns);
  const [kanbanItems, setKanbanItems] = useState<KanbanItem[]>(initialKanbanItems);
  const [kanbanThemeColor, setKanbanThemeColor] = useState<string>('mauve');
  const [activeKanbanTab, setActiveKanbanTab] = useState<'react' | 'vue' | 'angular'>('react');

  // New card form states
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDesc, setNewCardDesc] = useState('');
  const [newCardColumn, setNewCardColumn] = useState('todo');
  const [newCardTags, setNewCardTags] = useState('');

  // --- CODE GENERATORS FOR KANBAN ---
  const getReactKanbanCode = () => {
    return `<span class="hl-tag">&lt;DragDropProvider</span> <span class="hl-attr">apiKey</span>=<span class="hl-str">"sk_live_your_key"</span><span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;Kanban</span>\n    <span class="hl-attr">columns</span>=<span class="hl-str">{columns}</span>\n    <span class="hl-attr">items</span>=<span class="hl-str">{items}</span>\n    <span class="hl-attr">onItemsChange</span>=<span class="hl-str">{(newItems) =&gt; setItems(newItems)}</span>\n    <span class="hl-attr">color</span>=<span class="hl-str">"${kanbanThemeColor}"</span>\n  <span class="hl-tag">/&gt;</span>\n<span class="hl-tag">&lt;/DragDropProvider&gt;</span>`;
  };

  const getVueKanbanCode = () => {
    return `<span class="hl-tag">&lt;CtpDragDropProvider</span> <span class="hl-attr">api-key</span>=<span class="hl-str">"sk_live_your_key"</span><span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;CtpKanban</span>\n    <span class="hl-attr">:columns</span>=<span class="hl-str">"columns"</span>\n    <span class="hl-attr">:items</span>=<span class="hl-str">"items"</span>\n    <span class="hl-attr">@items-change</span>=<span class="hl-str">"onItemsChange"</span>\n    <span class="hl-attr">color</span>=<span class="hl-str">"${kanbanThemeColor}"</span>\n  <span class="hl-tag">/&gt;</span>\n<span class="hl-tag">&lt;/CtpDragDropProvider&gt;</span>`;
  };

  const getAngularKanbanCode = () => {
    return `<span class="hl-tag">&lt;drag-drop-provider</span> <span class="hl-attr">apiKey</span>=<span class="hl-str">"sk_live_your_key"</span><span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;kanban</span>\n    <span class="hl-attr">[columns]</span>=<span class="hl-str">"columns"</span>\n    <span class="hl-attr">[items]</span>=<span class="hl-str">"items"</span>\n    <span class="hl-attr">(itemsChange)</span>=<span class="hl-str">"onItemsChange($event)"</span>\n    <span class="hl-attr">color</span>=<span class="hl-str">"${kanbanThemeColor}"</span>\n  <span class="hl-tag">/&gt;</span>\n<span class="hl-tag">&lt;/drag-drop-provider&gt;</span>`;
  };


  // --- SELECT PLAYGROUND STATES ---
  const [selectAccent, setSelectAccent] = useState<FormControlColor>('mauve');
  const [selectSize, setSelectSize] = useState<FormControlSize>('md');
  const [selectShape, setSelectShape] = useState<FormControlShape>('rounded');
  const [selectSearchable, setSelectSearchable] = useState(true);
  const [selectMultipleTree, setSelectMultipleTree] = useState(false);
  const [selectValueMulti, setSelectValueMulti] = useState<string[]>(['react', 'ts']);
  const [selectValueTreeSingle, setSelectValueTreeSingle] = useState<string>('showcase');
  const [selectValueTreeMulti, setSelectValueTreeMulti] = useState<string[]>(['showcase', 'react-pkg']);

  const getReactSelectCode = () => {
    return `<span class="hl-tag">&lt;MultiSelect</span>\n  <span class="hl-attr">options</span>=<span class="hl-str">{options}</span>\n  <span class="hl-attr">value</span>=<span class="hl-str">{selectedValues}</span>\n  <span class="hl-attr">onChange</span>=<span class="hl-str">{setSelectedValues}</span>\n  <span class="hl-attr">color</span>=<span class="hl-str">"${selectAccent}"</span>\n  <span class="hl-attr">size</span>=<span class="hl-str">"${selectSize}"</span>\n  <span class="hl-attr">shape</span>=<span class="hl-str">"${selectShape}"</span>\n  <span class="hl-attr">searchable</span>=<span class="hl-str">{${selectSearchable}}</span>\n<span class="hl-tag">/&gt;</span>\n\n<span class="hl-tag">&lt;TreeSelect</span>\n  <span class="hl-attr">data</span>=<span class="hl-str">{treeData}</span>\n  <span class="hl-attr">multiple</span>=<span class="hl-str">{${selectMultipleTree}}</span>\n  ${selectMultipleTree ? `<span class="hl-attr">multipleValue</span>=<span class="hl-str">{selectedTreeValues}</span>\n  <span class="hl-attr">onChangeMultiple</span>=<span class="hl-str">{setSelectedTreeValues}</span>` : `<span class="hl-attr">value</span>=<span class="hl-str">{selectedTreeValue}</span>\n  <span class="hl-attr">onChange</span>=<span class="hl-str">{setSelectedTreeValue}</span>`}\n  <span class="hl-attr">color</span>=<span class="hl-str">"${selectAccent}"</span>\n  <span class="hl-attr">size</span>=<span class="hl-str">"${selectSize}"</span>\n  <span class="hl-attr">shape</span>=<span class="hl-str">"${selectShape}"</span>\n<span class="hl-tag">/&gt;</span>`;
  };

  const getVueSelectCode = () => {
    return `<span class="hl-tag">&lt;CtpMultiSelect</span> <span class="hl-attr">:options</span>=<span class="hl-str">"options"</span> <span class="hl-attr">v-model</span>=<span class="hl-str">"selectedValues"</span> <span class="hl-attr">color</span>=<span class="hl-str">"${selectAccent}"</span> <span class="hl-attr">size</span>=<span class="hl-str">"${selectSize}"</span> <span class="hl-attr">shape</span>=<span class="hl-str">"${selectShape}"</span> <span class="hl-tag">/&gt;</span>`;
  };

  const getAngularSelectCode = () => {
    return `<span class="hl-tag">&lt;multi-select</span> <span class="hl-attr">[options]</span>=<span class="hl-str">"options"</span> <span class="hl-attr">[(value)]</span>=<span class="hl-str">"selectedValues"</span> <span class="hl-attr">color</span>=<span class="hl-str">"${selectAccent}"</span> <span class="hl-attr">size</span>=<span class="hl-str">"${selectSize}"</span> <span class="hl-attr">shape</span>=<span class="hl-str">"${selectShape}"</span><span class="hl-tag">&gt;&lt;/multi-select&gt;</span>`;
  };

  // --- DRAWER PLAYGROUND STATES ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerPosition, setDrawerPosition] = useState<DrawerPosition>('right');
  const [drawerSize, setDrawerSize] = useState<DrawerSize>('md');
  const [drawerAccent, setDrawerAccent] = useState<FormControlColor>('mauve');
  const [drawerTitle, setDrawerTitle] = useState('Menu de Ajustes');
  const [drawerCloseOnOverlayClick, setDrawerCloseOnOverlayClick] = useState(true);
  const [drawerCloseOnEsc, setDrawerCloseOnEsc] = useState(true);
  const [drawerShowCloseButton, setDrawerShowCloseButton] = useState(true);
  const [drawerShowFooter, setDrawerShowFooter] = useState(true);

  const getReactDrawerCode = () => {
    const props = [];
    props.push(`isOpen={isDrawerOpen}`);
    props.push(`onClose={() => setIsDrawerOpen(false)}`);
    if (drawerTitle) props.push(`title="${drawerTitle}"`);
    if (drawerPosition !== 'right') props.push(`position="${drawerPosition}"`);
    if (drawerSize !== 'md') props.push(`size="${drawerSize}"`);
    if (drawerAccent !== 'mauve') props.push(`color="${drawerAccent}"`);
    if (!drawerCloseOnOverlayClick) props.push('closeOnOverlayClick={false}');
    if (!drawerCloseOnEsc) props.push('closeOnEsc={false}');
    if (!drawerShowCloseButton) props.push('showCloseButton={false}');

    const propsStr = props.length > 0 ? '\n  ' + props.join('\n  ') : '';

    let footerStr = '';
    if (drawerShowFooter) {
      footerStr = `\n  footer={\n    <>\n      <Button variant="ghost" color="red" onClick={() => setIsDrawerOpen(false)}>Cancelar</Button>\n      <Button variant="filled" color="green" onClick={() => setIsDrawerOpen(false)}>Confirmar</Button>\n    </>\n  }`;
    }

    return `<span class="hl-tag">&lt;Drawer</span>${propsStr ? props.map(p => `\n  <span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('') : ''}${footerStr ? '\n  ' + footerStr.replace(/\n/g, '\n  ') : ''}\n<span class="hl-tag">&gt;</span>\n  <span class="hl-text">&lt;p&gt;Conteúdo do Drawer...&lt;/p&gt;</span>\n<span class="hl-tag">&lt;/Drawer&gt;</span>`;
  };

  const getVueDrawerCode = () => {
    const props = [];
    props.push(`v-model:is-open="isDrawerOpen"`);
    if (drawerTitle) props.push(`title="${drawerTitle}"`);
    if (drawerPosition !== 'right') props.push(`position="${drawerPosition}"`);
    if (drawerSize !== 'md') props.push(`size="${drawerSize}"`);
    if (drawerAccent !== 'mauve') props.push(`color="${drawerAccent}"`);

    const propsStr = props.length > 0 ? '\n  ' + props.join('\n  ') : '';
    const slotFooter = drawerShowFooter ? `\n  <span class="hl-tag">&lt;template</span> <span class="hl-attr">#footer</span><span class="hl-tag">&gt;</span>\n    <span class="hl-tag">&lt;CtpButton</span> <span class="hl-attr">color</span>=<span class="hl-str">"green"</span><span class="hl-tag">&gt;</span>Confirmar<span class="hl-tag">&lt;/CtpButton&gt;</span>\n  <span class="hl-tag">&lt;/template&gt;</span>` : '';

    return `<span class="hl-tag">&lt;CtpDrawer</span>${propsStr ? props.map(p => `\n  <span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('') : ''}\n  <span class="hl-attr">@close</span>=<span class="hl-str">"isDrawerOpen = false"</span>\n<span class="hl-tag">&gt;</span>\n  <span class="hl-text">&lt;p&gt;Conteúdo do Drawer...&lt;/p&gt;</span>${slotFooter}\n<span class="hl-tag">&lt;/CtpDrawer&gt;</span>`;
  };

  const getAngularDrawerCode = () => {
    const props = [];
    props.push(`[isOpen]="isDrawerOpen"`);
    props.push(`(close)="isDrawerOpen = false"`);
    if (drawerTitle) props.push(`title="${drawerTitle}"`);
    if (drawerPosition !== 'right') props.push(`position="${drawerPosition}"`);
    if (drawerSize !== 'md') props.push(`size="${drawerSize}"`);
    if (drawerAccent !== 'mauve') props.push(`color="${drawerAccent}"`);

    const propsStr = props.length > 0 ? '\n  ' + props.join('\n  ') : '';
    const slotFooter = drawerShowFooter ? `\n  <div <span class="hl-attr">footer</span><span class="hl-tag">&gt;</span>\n    <span class="hl-tag">&lt;button</span> <span class="hl-attr">button</span> <span class="hl-attr">color</span>=<span class="hl-str">"green"</span><span class="hl-tag">&gt;</span>Confirmar<span class="hl-tag">&lt;/button&gt;</span>\n  <span class="hl-tag">&lt;/div&gt;</span>` : '';

    return `<span class="hl-tag">&lt;drawer</span>${propsStr ? props.map(p => `\n  <span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('') : ''}\n<span class="hl-tag">&gt;</span>\n  <span class="hl-text">&lt;p&gt;Conteúdo do Drawer...&lt;/p&gt;</span>${slotFooter}\n<span class="hl-tag">&lt;/drawer&gt;</span>`;
  };

  // --- BUTTON PLAYGROUND STATES ---
  const [buttonText, setButtonText] = useState('Click me');
  const [btnVariant, setBtnVariant] = useState<ButtonVariant>('filled');
  const [btnColor, setBtnColor] = useState<ButtonColor>('mauve');
  const [btnSize, setBtnSize] = useState<ButtonSize>('md');
  const [btnShape, setBtnShape] = useState<ButtonShape>('rounded');
  const [btnIsLoading, setBtnIsLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [btnLeftIcon, setBtnLeftIcon] = useState(false);
  const [btnRightIcon, setBtnRightIcon] = useState(false);

  // --- ICONS PLAYGROUND STATES ---
  const [iconSearch, setIconSearch] = useState('');
  const [iconSize, setIconSize] = useState(32);
  const [iconStroke, setIconStroke] = useState(1.5);
  const [iconColor, setIconColor] = useState<string>('mauve');
  const [iconHoverEffect, setIconHoverEffect] = useState<'none' | 'spin' | 'bounce' | 'scale' | 'wiggle' | 'pulse'>('none');
  const [selectedIconName, setSelectedIconName] = useState('CatIcon');

  const getReactIconCode = () => {
    const classProp = iconHoverEffect !== 'none' ? ` className="icon--hover-${iconHoverEffect}"` : '';
    const colorProp = iconColor !== 'text' ? ` color="${iconColor}"` : '';
    return `<span class="hl-tag">&lt;${selectedIconName}</span>\n  <span class="hl-attr">size</span>=<span class="hl-str">{${iconSize}}</span>\n  <span class="hl-attr">strokeWidth</span>=<span class="hl-str">{${iconStroke}}</span>${colorProp}${classProp}\n<span class="hl-tag">/&gt;</span>`;
  };

  const getVueIconCode = () => {
    const classProp = iconHoverEffect !== 'none' ? ` class="icon--hover-${iconHoverEffect}"` : '';
    const colorProp = iconColor !== 'text' ? ` color="${iconColor}"` : '';
    return `<span class="hl-tag">&lt;Ctp${selectedIconName}</span>\n  <span class="hl-attr">:size</span>=<span class="hl-str">"${iconSize}"</span>\n  <span class="hl-attr">:stroke-width</span>=<span class="hl-str">"${iconStroke}"</span>${colorProp}${classProp}\n<span class="hl-tag">/&gt;</span>`;
  };

  const getAngularIconCode = () => {
    const classProp = iconHoverEffect !== 'none' ? ` class="icon--hover-${iconHoverEffect}"` : '';
    const colorProp = iconColor !== 'text' ? ` color="${iconColor}"` : '';
    const kebabName = selectedIconName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    return `<span class="hl-tag">&lt;${kebabName}</span>\n  <span class="hl-attr">[size]</span>=<span class="hl-str">"${iconSize}"</span>\n  <span class="hl-attr">[strokeWidth]</span>=<span class="hl-str">"${iconStroke}"</span>${colorProp}${classProp}\n<span class="hl-tag">&gt;&lt;/${kebabName}&gt;</span>`;
  };

  const getSvgIconCode = () => {
    const strokeClass = iconHoverEffect !== 'none' ? ` icon--hover-${iconHoverEffect}` : '';
    const paths = iconPaths[selectedIconName] || '';
    const colorVal = iconColor === 'text' ? 'currentColor' : `var(--ctp-${iconColor})`;
    return `<span class="hl-tag">&lt;svg</span>\n  <span class="hl-attr">xmlns</span>=<span class="hl-str">"http://www.w3.org/2000/svg"</span>\n  <span class="hl-attr">width</span>=<span class="hl-str">"${iconSize}"</span>\n  <span class="hl-attr">height</span>=<span class="hl-str">"${iconSize}"</span>\n  <span class="hl-attr">viewBox</span>=<span class="hl-str">"0 0 24 24"</span>\n  <span class="hl-attr">fill</span>=<span class="hl-str">"none"</span>\n  <span class="hl-attr">stroke</span>=<span class="hl-str">"${colorVal}"</span>\n  <span class="hl-attr">stroke-width</span>=<span class="hl-str">"${iconStroke}"</span>\n  <span class="hl-attr">stroke-linecap</span>=<span class="hl-str">"round"</span>\n  <span class="hl-attr">stroke-linejoin</span>=<span class="hl-str">"round"</span>\n  <span class="hl-attr">class</span>=<span class="hl-str">"icon${strokeClass}"</span>\n<span class="hl-tag">&gt;</span>\n  ${paths.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '\n  ')}\n<span class="hl-tag">&lt;/svg&gt;</span>`;
  };

  // --- STEPPER PLAYGROUND STATES ---
  const [stepOrientation, setStepOrientation] = useState<StepperOrientation>('horizontal');
  const [stepVariant, setStepVariant] = useState<StepperVariant>('default');
  const [stepColor, setStepColor] = useState<ButtonColor>('mauve');
  const [currentStep, setCurrentStep] = useState(1);
  const prevStepRef = useRef(1);

  // Track previous step to choose correct slide direction class
  useEffect(() => {
    prevStepRef.current = currentStep;
  }, [currentStep]);

  // Adjust current page if limit change makes current page out of bounds
  useEffect(() => {
    const totalPages = Math.ceil(mockPorts.length / paginationLimit);
    if (paginationPage > totalPages) {
      setPaginationPage(Math.max(totalPages, 1));
    }
  }, [paginationLimit, paginationPage]);

  // Code Tab state for code highlights
  const [activeTab, setActiveTab] = useState<'react' | 'vue' | 'angular' | 'svg'>('react');

  // --- MODALS & OVERLAY STATES ---
  const [isOpenSm, setIsOpenSm] = useState(false);
  const [isOpenMd, setIsOpenMd] = useState(false);
  const [isOpenLg, setIsOpenLg] = useState(false);

  // Nested modal sequence states
  const [isOpenNested1, setIsOpenNested1] = useState(false);
  const [isOpenNested2, setIsOpenNested2] = useState(false);
  const [isOpenNested3, setIsOpenNested3] = useState(false);

  // Custom Raw Overlay state
  const [customOverlayOpen, setCustomOverlayOpen] = useState(false);

  // Modal customization options
  const [modalTitle, setModalTitle] = useState('Workspace Settings');
  const [modalHasCloseButton, setModalHasCloseButton] = useState(true);
  const [modalCloseOnEsc, setModalCloseOnEsc] = useState(true);
  const [modalCloseOnOverlay, setModalCloseOnOverlay] = useState(true);
  const [modalHasFooter, setModalHasFooter] = useState(true);

  // --- COMPOUND TABS STATES ---
  const [tabsActiveVal, setTabsActiveVal] = useState('general');
  const [tabsVariant, setTabsVariant] = useState<TabsVariant>('underline');
  const [tabsColor, setTabsColor] = useState<ButtonColor>('mauve');
  const [tabsSize, setTabsSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [tabsOrientation, setTabsOrientation] = useState<TabsOrientation>('horizontal');

  // --- DYNAMIC FORMS STATES ---
  const [formSchema, setFormSchema] = useState<FieldSchema[]>(initialFormSchema);
  const [lastSubmitPayload, setLastSubmitPayload] = useState<Record<string, any> | null>(null);
  const [formConfigSize, setFormConfigSize] = useState<ButtonSize>('md');
  const [formConfigShape, setFormConfigShape] = useState<ButtonShape>('rounded');
  const [formConfigColor, setFormConfigColor] = useState<ButtonColor>('mauve');

  // Form builder configuration modes: 'builder' | 'json'
  const [formBuilderTab, setFormBuilderTab] = useState<'builder' | 'json'>('builder');
  const [jsonText, setJsonText] = useState(() => JSON.stringify(initialFormSchema, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  // States to add a new field to form schema interactively
  const [newFieldId, setNewFieldId] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldSchema['type']>('text');
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldWidth, setNewFieldWidth] = useState<33 | 50 | 100>(100);
  const [newFieldOptionsString, setNewFieldOptionsString] = useState('');

  // --- STEPS & SLIDER STATES ---
  const [stepsCount, setStepsCount] = useState(4);
  const [stepsCurrent, setStepsCurrent] = useState(0);
  const [stepsVariant, setStepsVariant] = useState<StepsVariant>('timeline');
  const [stepsColor, setStepsColor] = useState<StepsColor>('mauve');
  const [stepsOrientation, setStepsOrientation] = useState<'horizontal' | 'vertical'>('horizontal');

  // Checkout Wizard Wizard flow state
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardFlavor, setWizardFlavor] = useState('macchiato');
  const [wizardShippingName, setWizardShippingName] = useState('');
  const [wizardShippingAddress, setWizardShippingAddress] = useState('');
  const [wizardShippingCity, setWizardShippingCity] = useState('');
  const wizardLabels = ['Flavor Selection', 'Delivery Details', 'Receipt Summary'];

  // --- PROGRESS & UTILITIES PLAYGROUND STATES ---
  const [progressVal, setProgressVal] = useState(45);
  const [progressSize, setProgressSize] = useState<ProgressBarSize>('md');
  const [progressColor, setProgressColor] = useState<ProgressBarColor>('mauve');
  const [progressStriped, setProgressStriped] = useState(false);
  const [progressAnimated, setProgressAnimated] = useState(false);
  const [progressIndeterminate, setProgressIndeterminate] = useState(false);
  const [progressShowValue, setProgressShowValue] = useState(true);
  const [progressValPosition, setProgressValPosition] = useState<'inside' | 'outside'>('outside');
  const [progressLabel, setProgressLabel] = useState('Downloading layout packages');

  // Custom scroll hover accent selection
  const [scrollAccent, setScrollAccent] = useState<ProgressBarColor>('mauve');

  // --- CARDS & TILES PLAYGROUND STATES ---
  const [selectedTileId, setSelectedTileId] = useState<string>('t1');
  const [multiSelectedTileIds, setMultiSelectedTileIds] = useState<string[]>(['m1']);
  const [cardVariant, setCardVariant] = useState<CardVariant>('filled');
  const [cardShape, setCardShape] = useState<CardShape>('rounded');
  const [cardPadding, setCardPadding] = useState<CardPadding>('md');
  const [cardAccent, setCardAccent] = useState<CardAccentColor>('mauve');
  const [cardAccentPos, setCardAccentPos] = useState<CardAccentPosition>('top');
  const [cardInteractive, setCardInteractive] = useState<boolean>(true);

  // --- BADGE & TAG PLAYGROUND STATES ---
  const [badgeText, setBadgeText] = useState<string>('New Feature');
  const [badgeVariant, setBadgeVariant] = useState<BadgeVariant>('filled');
  const [badgeSize, setBadgeSize] = useState<BadgeSize>('md');
  const [badgeShape, setBadgeShape] = useState<BadgeShape>('pill');
  const [badgeColor, setBadgeColor] = useState<BadgeColor>('mauve');
  const [badgeHasIcon, setBadgeHasIcon] = useState<boolean>(true);
  const [badgeDismissible, setBadgeDismissible] = useState<boolean>(false);
  const [demoTags, setDemoTags] = useState<string[]>(['TypeScript', 'React', 'Vue', 'Angular', 'CSS', 'Svelte']);

  // --- ACCORDION PLAYGROUND STATES ---
  const [accordionActiveValue, setAccordionActiveValue] = useState<string | string[]>('item-1');
  const [accordionVariant, setAccordionVariant] = useState<'default' | 'split'>('default');
  const [accordionColorMode, setAccordionColorMode] = useState<'none' | 'colored' | 'tonal'>('none');
  const [accordionAccent, setAccordionAccent] = useState<string>('mauve');
  const [accordionAllowMultiple, setAccordionAllowMultiple] = useState(false);

  const handleAccordionMultipleChange = (multiple: boolean) => {
    setAccordionAllowMultiple(multiple);
    if (multiple) {
      setAccordionActiveValue(typeof accordionActiveValue === 'string' ? (accordionActiveValue ? [accordionActiveValue] : []) : (accordionActiveValue || []));
    } else {
      setAccordionActiveValue(Array.isArray(accordionActiveValue) ? (accordionActiveValue[0] || '') : (accordionActiveValue || ''));
    }
  };

  const getReactAccordionCode = () => {
    return `<span class="hl-tag">&lt;Accordion</span>\n  <span class="hl-attr">variant</span>=<span class="hl-str">"${accordionVariant}"</span>${accordionColorMode !== 'none' ? `\n  <span class="hl-attr">colorMode</span>=<span class="hl-str">"${accordionColorMode}"</span>` : ''}\n  <span class="hl-attr">accentColor</span>=<span class="hl-str">"${accordionAccent}"</span>\n  <span class="hl-attr">allowMultiple</span>=<span class="hl-str">{${accordionAllowMultiple}}</span>\n  <span class="hl-attr">value</span>=<span class="hl-str">{activeItems}</span>\n  <span class="hl-attr">onValueChange</span>=<span class="hl-str">{setActiveItems}</span>\n<span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;Accordion.Item</span> <span class="hl-attr">value</span>=<span class="hl-str">"item-1"</span><span class="hl-tag">&gt;</span>\n    <span class="hl-tag">&lt;Accordion.Header&gt;</span>Primeiro Tópico<span class="hl-tag">&lt;/Accordion.Header&gt;</span>\n    <span class="hl-tag">&lt;Accordion.Body&gt;</span>Conteúdo do primeiro tópico...<span class="hl-tag">&lt;/Accordion.Body&gt;</span>\n  <span class="hl-tag">&lt;/Accordion.Item&gt;</span>\n  <span class="hl-tag">&lt;Accordion.Item</span> <span class="hl-attr">value</span>=<span class="hl-str">"item-2"</span><span class="hl-tag">&gt;</span>\n    <span class="hl-tag">&lt;Accordion.Header&gt;</span>Segundo Tópico<span class="hl-tag">&lt;/Accordion.Header&gt;</span>\n    <span class="hl-tag">&lt;Accordion.Body&gt;</span>Conteúdo do segundo tópico...<span class="hl-tag">&lt;/Accordion.Body&gt;</span>\n  <span class="hl-tag">&lt;/Accordion.Item&gt;</span>\n<span class="hl-tag">&lt;/Accordion&gt;</span>`;
  };

  const getVueAccordionCode = () => {
    return `<span class="hl-tag">&lt;Accordion</span>\n  <span class="hl-attr">variant</span>=<span class="hl-str">"${accordionVariant}"</span>${accordionColorMode !== 'none' ? `\n  <span class="hl-attr">color-mode</span>=<span class="hl-str">"${accordionColorMode}"</span>` : ''}\n  <span class="hl-attr">accent-color</span>=<span class="hl-str">"${accordionAccent}"</span>\n  <span class="hl-attr">:allow-multiple</span>=<span class="hl-str">"${accordionAllowMultiple}"</span>\n  <span class="hl-attr">v-model</span>=<span class="hl-str">"activeItems"</span>\n<span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;AccordionItem</span> <span class="hl-attr">value</span>=<span class="hl-str">"item-1"</span> <span class="hl-attr">title</span>=<span class="hl-str">"Primeiro Tópico"</span><span class="hl-tag">&gt;</span>\n    Conteúdo do primeiro tópico...\n  <span class="hl-tag">&lt;/AccordionItem&gt;</span>\n  <span class="hl-tag">&lt;AccordionItem</span> <span class="hl-attr">value</span>=<span class="hl-str">"item-2"</span> <span class="hl-attr">title</span>=<span class="hl-str">"Segundo Tópico"</span><span class="hl-tag">&gt;</span>\n    Conteúdo do segundo tópico...\n  <span class="hl-tag">&lt;/AccordionItem&gt;</span>\n<span class="hl-tag">&lt;/Accordion&gt;</span>`;
  };

  const getAngularAccordionCode = () => {
    return `<span class="hl-tag">&lt;accordion</span>\n  <span class="hl-attr">variant</span>=<span class="hl-str">"${accordionVariant}"</span>${accordionColorMode !== 'none' ? `\n  <span class="hl-attr">colorMode</span>=<span class="hl-str">"${accordionColorMode}"</span>` : ''}\n  <span class="hl-attr">accentColor</span>=<span class="hl-str">"${accordionAccent}"</span>\n  <span class="hl-attr">[allowMultiple]</span>=<span class="hl-str">"${accordionAllowMultiple}"</span>\n  <span class="hl-attr">[(activeValues)]</span>=<span class="hl-str">"activeItems"</span>\n<span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;accordion-item</span> <span class="hl-attr">value</span>=<span class="hl-str">"item-1"</span> <span class="hl-attr">title</span>=<span class="hl-str">"Primeiro Tópico"</span><span class="hl-tag">&gt;</span>\n    Conteúdo do primeiro tópico...\n  <span class="hl-tag">&lt;/accordion-item&gt;</span>\n  <span class="hl-tag">&lt;accordion-item</span> <span class="hl-attr">value</span>=<span class="hl-str">"item-2"</span> <span class="hl-attr">title</span>=<span class="hl-str">"Segundo Tópico"</span><span class="hl-tag">&gt;</span>\n    Conteúdo do segundo tópico...\n  <span class="hl-tag">&lt;/accordion-item&gt;</span>\n<span class="hl-tag">&lt;/accordion&gt;</span>`;
  };

  // --- DROPDOWN PLAYGROUND STATES ---
  const [dropdownPlacement, setDropdownPlacement] = useState<Placement>('bottom-start');
  const [dropdownColor, setDropdownColor] = useState<ButtonColor>('mauve');
  const [dropdownCloseOnItemClick, setDropdownCloseOnItemClick] = useState(true);
  const [dropdownAutoFlip, setDropdownAutoFlip] = useState(true);

  // --- TOOLTIP PLAYGROUND STATES ---
  const [tooltipPlacement, setTooltipPlacement] = useState<Placement>('top');
  const [tooltipColor, setTooltipColor] = useState<ButtonColor | 'dark' | 'light'>('dark');
  const [tooltipDelay, setTooltipDelay] = useState(150);
  const [tooltipAutoFlip, setTooltipAutoFlip] = useState(true);

  // --- GRID PLAYGROUND STATES ---
  const [gridGap, setGridGap] = useState<GridGap>(3);
  const [gridMobile, setGridMobile] = useState(false);
  const [gridMultiline, setGridMultiline] = useState(true);
  const [gridAlign, setGridAlign] = useState<GridAlign>('start');
  const [gridValign, setGridValign] = useState<GridValign>('start');

  // --- DATE PICKER PLAYGROUND STATES ---
  const [dpMode, setDpMode] = useState<DatePickerMode>('single');
  const [dpColor, setDpColor] = useState<FormControlColor>('mauve');
  const [dpDate, setDpDate] = useState<Date | null>(null);
  const [dpRange, setDpRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [dpShowToday, setDpShowToday] = useState(true);
  const [dpDisabled, setDpDisabled] = useState(false);

  // --- SHELL PLAYGROUND STATES ---
  const [shellLayout, setShellLayout] = useState<ShellLayout>('header-first');
  const [shellFullScreen, setShellFullScreen] = useState(false);
  const [shellSidebarCollapsed, setShellSidebarCollapsed] = useState(false);
  const [shellSidebarMini, setShellSidebarMini] = useState(false);
  const [shellSidebarMobileOpen, setShellSidebarMobileOpen] = useState(false);
  const [shellHeaderHeight, setShellHeaderHeight] = useState('60px');
  const [shellSidebarWidth, setShellSidebarWidth] = useState('240px');
  const [shellScrollable, setShellScrollable] = useState(true);

  // --- SIDEBAR PLAYGROUND STATES ---
  const [sbVariant, setSbVariant] = useState<'fixed' | 'floated'>('fixed');
  const [sbCollapsed, setSbCollapsed] = useState(false);
  const [sbExpandOnHover, setSbExpandOnHover] = useState(true);
  const [sbActiveItem, setSbActiveItem] = useState(0);

  const getReactGridCode = () => {
    return `<span class="hl-tag">&lt;Grid</span>\n  <span class="hl-attr">gap</span>=<span class="hl-str">{${gridGap}}</span>\n  <span class="hl-attr">mobile</span>=<span class="hl-str">{${gridMobile}}</span>\n  <span class="hl-attr">multiline</span>=<span class="hl-str">{${gridMultiline}}</span>\n  <span class="hl-attr">align</span>=<span class="hl-str">"${gridAlign}"</span>\n  <span class="hl-attr">valign</span>=<span class="hl-str">"${gridValign}"</span>\n<span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;Grid.Col</span> <span class="hl-attr">span</span>=<span class="hl-str">{12}</span><span class="hl-tag">&gt;</span>Largura total (12/12)<span class="hl-tag">&lt;/Grid.Col&gt;</span>\n  <span class="hl-tag">&lt;Grid.Col</span> <span class="hl-attr">span</span>=<span class="hl-str">{6}</span><span class="hl-tag">&gt;</span>Metade (6/12)<span class="hl-tag">&lt;/Grid.Col&gt;</span>\n  <span class="hl-tag">&lt;Grid.Col</span> <span class="hl-attr">span</span>=<span class="hl-str">{6}</span><span class="hl-tag">&gt;</span>Metade (6/12)<span class="hl-tag">&lt;/Grid.Col&gt;</span>\n  <span class="hl-tag">&lt;Grid.Col</span> <span class="hl-attr">md</span>=<span class="hl-str">{4}</span> <span class="hl-attr">sm</span>=<span class="hl-str">{12}</span><span class="hl-tag">&gt;</span>1/3 no desk, 12/12 no mobile<span class="hl-tag">&lt;/Grid.Col&gt;</span>\n<span class="hl-tag">&lt;/Grid&gt;</span>`;
  };

  const getVueGridCode = () => {
    return `<span class="hl-tag">&lt;CtpGrid</span> <span class="hl-attr">:gap</span>=<span class="hl-str">"${gridGap}"</span> <span class="hl-attr">:mobile</span>=<span class="hl-str">"${gridMobile}"</span> <span class="hl-attr">:multiline</span>=<span class="hl-str">"${gridMultiline}"</span> <span class="hl-attr">align</span>=<span class="hl-str">"${gridAlign}"</span> <span class="hl-attr">valign</span>=<span class="hl-str">"${gridValign}"</span><span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;CtpGridCol</span> <span class="hl-attr">:span</span>=<span class="hl-str">"12"</span><span class="hl-tag">&gt;</span>Largura total (12/12)<span class="hl-tag">&lt;/CtpGridCol&gt;</span>\n  <span class="hl-tag">&lt;CtpGridCol</span> <span class="hl-attr">:span</span>=<span class="hl-str">"6"</span><span class="hl-tag">&gt;</span>Metade (6/12)<span class="hl-tag">&lt;/CtpGridCol&gt;</span>\n  <span class="hl-tag">&lt;CtpGridCol</span> <span class="hl-attr">:span</span>=<span class="hl-str">"6"</span><span class="hl-tag">&gt;</span>Metade (6/12)<span class="hl-tag">&lt;/CtpGridCol&gt;</span>\n<span class="hl-tag">&lt;/CtpGrid&gt;</span>`;
  };

  const getAngularGridCode = () => {
    return `<span class="hl-tag">&lt;grid</span> <span class="hl-attr">[gap]</span>=<span class="hl-str">"${gridGap}"</span> <span class="hl-attr">[mobile]</span>=<span class="hl-str">"${gridMobile}"</span> <span class="hl-attr">[multiline]</span>=<span class="hl-str">"${gridMultiline}"</span> <span class="hl-attr">align</span>=<span class="hl-str">"${gridAlign}"</span> <span class="hl-attr">valign</span>=<span class="hl-str">"${gridValign}"</span><span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;div</span> <span class="hl-attr">ctpGridCol</span> <span class="hl-attr">[span]</span>=<span class="hl-str">"12"</span><span class="hl-tag">&gt;</span>Largura total (12/12)<span class="hl-tag">&lt;/div&gt;</span>\n  <span class="hl-tag">&lt;div</span> <span class="hl-attr">ctpGridCol</span> <span class="hl-attr">[span]</span>=<span class="hl-str">"6"</span><span class="hl-tag">&gt;</span>Metade (6/12)<span class="hl-tag">&lt;/div&gt;</span>\n  <span class="hl-tag">&lt;div</span> <span class="hl-attr">ctpGridCol</span> <span class="hl-attr">[span]</span>=<span class="hl-str">"6"</span><span class="hl-tag">&gt;</span>Metade (6/12)<span class="hl-tag">&lt;/div&gt;</span>\n<span class="hl-tag">&lt;/grid&gt;</span>`;
  };

  const getReactDropdownCode = () => {
    return `<span class="hl-tag">&lt;Dropdown</span>\n  <span class="hl-attr">trigger</span>=<span class="hl-str">{&lt;Button color="${dropdownColor}"&gt;Abrir Menu&lt;/Button&gt;}</span>\n  <span class="hl-attr">placement</span>=<span class="hl-str">"${dropdownPlacement}"</span>\n  <span class="hl-attr">color</span>=<span class="hl-str">"${dropdownColor}"</span>\n  <span class="hl-attr">closeOnItemClick</span>=<span class="hl-str">{${dropdownCloseOnItemClick}}</span>\n  <span class="hl-attr">autoFlip</span>=<span class="hl-str">{${dropdownAutoFlip}}</span>\n<span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;Dropdown.Header&gt;</span>Ações do Usuário<span class="hl-tag">&lt;/Dropdown.Header&gt;</span>\n  <span class="hl-tag">&lt;Dropdown.Item</span> <span class="hl-attr">icon</span>=<span class="hl-str">{&lt;UserIcon /&gt;}</span><span class="hl-tag">&gt;</span>Meu Perfil<span class="hl-tag">&lt;/Dropdown.Item&gt;</span>\n  <span class="hl-tag">&lt;Dropdown.Item</span> <span class="hl-attr">icon</span>=<span class="hl-str">{&lt;SettingsIcon /&gt;}</span><span class="hl-tag">&gt;</span>Configurações<span class="hl-tag">&lt;/Dropdown.Item&gt;</span>\n  <span class="hl-tag">&lt;Dropdown.Divider /&gt;</span>\n  <span class="hl-tag">&lt;Dropdown.Item</span> <span class="hl-attr">danger</span> <span class="hl-attr">icon</span>=<span class="hl-str">{&lt;TrashIcon /&gt;}</span><span class="hl-tag">&gt;</span>Excluir Conta<span class="hl-tag">&lt;/Dropdown.Item&gt;</span>\n<span class="hl-tag">&lt;/Dropdown&gt;</span>`;
  };

  const getVueDropdownCode = () => {
    return `<span class="hl-tag">&lt;CtpDropdown</span> <span class="hl-attr">placement</span>=<span class="hl-str">"${dropdownPlacement}"</span> <span class="hl-attr">color</span>=<span class="hl-str">"${dropdownColor}"</span><span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;template</span> <span class="hl-attr">#trigger</span><span class="hl-tag">&gt;</span>\n    <span class="hl-tag">&lt;CtpButton&gt;</span>Abrir Menu<span class="hl-tag">&lt;/CtpButton&gt;</span>\n  <span class="hl-tag">&lt;/template&gt;</span>\n  <span class="hl-tag">&lt;CtpDropdownHeader&gt;</span>Ações do Usuário<span class="hl-tag">&lt;/CtpDropdownHeader&gt;</span>\n  <span class="hl-tag">&lt;CtpDropdownItem&gt;</span>Meu Perfil<span class="hl-tag">&lt;/CtpDropdownItem&gt;</span>\n  <span class="hl-tag">&lt;CtpDropdownDivider /&gt;</span>\n  <span class="hl-tag">&lt;CtpDropdownItem</span> <span class="hl-attr">danger</span><span class="hl-tag">&gt;</span>Excluir Conta<span class="hl-tag">&lt;/CtpDropdownItem&gt;</span>\n<span class="hl-tag">&lt;/CtpDropdown&gt;</span>`;
  };

  const getAngularDropdownCode = () => {
    return `<span class="hl-tag">&lt;dropdown</span> <span class="hl-attr">placement</span>=<span class="hl-str">"${dropdownPlacement}"</span> <span class="hl-attr">color</span>=<span class="hl-str">"${dropdownColor}"</span><span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;button</span> <span class="hl-attr">button</span> <span class="hl-attr">dropdownTrigger</span><span class="hl-tag">&gt;</span>Abrir Menu<span class="hl-tag">&lt;/button&gt;</span>\n  <span class="hl-tag">&lt;dropdown-header&gt;</span>Ações do Usuário<span class="hl-tag">&lt;/dropdown-header&gt;</span>\n  <span class="hl-tag">&lt;dropdown-item&gt;</span>Meu Perfil<span class="hl-tag">&lt;/dropdown-item&gt;</span>\n  <span class="hl-tag">&lt;dropdown-divider&gt;&lt;/dropdown-divider&gt;</span>\n  <span class="hl-tag">&lt;dropdown-item</span> <span class="hl-attr">[danger]</span>=<span class="hl-str">"true"</span><span class="hl-tag">&gt;</span>Excluir Conta<span class="hl-tag">&lt;/dropdown-item&gt;</span>\n<span class="hl-tag">&lt;/dropdown&gt;</span>`;
  };

  const getReactTooltipCode = () => {
    return `<span class="hl-tag">&lt;Tooltip</span>\n  <span class="hl-attr">content</span>=<span class="hl-str">"Configurações do painel"</span>\n  <span class="hl-attr">placement</span>=<span class="hl-str">"${tooltipPlacement}"</span>\n  <span class="hl-attr">color</span>=<span class="hl-str">"${tooltipColor}"</span>\n  <span class="hl-attr">delay</span>=<span class="hl-str">{${tooltipDelay}}</span>\n  <span class="hl-attr">autoFlip</span>=<span class="hl-str">{${tooltipAutoFlip}}</span>\n<span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;Button&gt;</span>Passar Mouse<span class="hl-tag">&lt;/Button&gt;</span>\n<span class="hl-tag">&lt;/Tooltip&gt;</span>`;
  };

  const getVueTooltipCode = () => {
    return `<span class="hl-tag">&lt;CtpTooltip</span> <span class="hl-attr">content</span>=<span class="hl-str">"Configurações do painel"</span> <span class="hl-attr">placement</span>=<span class="hl-str">"${tooltipPlacement}"</span> <span class="hl-attr">color</span>=<span class="hl-str">"${tooltipColor}"</span><span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;CtpButton&gt;</span>Passar Mouse<span class="hl-tag">&lt;/CtpButton&gt;</span>\n<span class="hl-tag">&lt;/CtpTooltip&gt;</span>`;
  };

  const getAngularTooltipCode = () => {
    return `<span class="hl-tag">&lt;button</span> <span class="hl-attr">button</span> <span class="hl-attr">[ctpTooltip]</span>=<span class="hl-str">"'Configurações do painel'"</span> <span class="hl-attr">tooltipPlacement</span>=<span class="hl-str">"${tooltipPlacement}"</span> <span class="hl-attr">tooltipColor</span>=<span class="hl-str">"${tooltipColor}"</span><span class="hl-tag">&gt;</span>Passar Mouse<span class="hl-tag">&lt;/button&gt;</span>`;
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);


  // --- TABELA DE DADOS - LOGICA ---
  const [tableRefreshTrigger, setTableRefreshTrigger] = useState(0);

  // Reiniciar a página quando filtros mudarem
  useEffect(() => {
    setTablePage(1);
  }, [tableSearch, tableStatus, tableRole]);

  // Efeito principal de carregamento de dados
  useEffect(() => {
    let active = true;

    const fetchWrapper = async () => {
      if (tableMode === 'server') {
        setTableIsLoading(true);
        try {
          const res = await fetchDataFromServer({
            search: tableSearch,
            status: tableStatus,
            role: tableRole,
            sortField: tableSortField,
            sortOrder: tableSortOrder,
            page: tablePage,
            limit: tableLimit
          });
          if (!active) return;

          setTableData(res.data);
          setTableTotalPages(res.pagination.totalPages);
          setTableTotalItems(res.pagination.total);

          // Registrar log da API
          setApiLogs(prev => [
            ...prev,
            {
              id: Math.random().toString(36).substring(2, 9),
              time: res.meta.timestamp,
              method: 'GET',
              url: res.meta.url,
              meta: `200 OK (${res.meta.latency}ms)`
            }
          ].slice(-5));
        } catch (err) {
          console.error(err);
        } finally {
          if (active) setTableIsLoading(false);
        }
      } else {
        setTableIsLoading(true);
        setTimeout(() => {
          if (!active) return;
          const fullData = getFullLocalDatabase();

          // Filtragem local
          const filtered = fullData.filter(item => {
            const matchesSearch = !tableSearch ||
              item.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
              item.email.toLowerCase().includes(tableSearch.toLowerCase()) ||
              item.role.toLowerCase().includes(tableSearch.toLowerCase()) ||
              item.id.toLowerCase().includes(tableSearch.toLowerCase());

            const matchesStatus = tableStatus === 'All' || item.status === tableStatus;
            const matchesRole = tableRole === 'All' || item.role === tableRole;

            return matchesSearch && matchesStatus && matchesRole;
          });

          // Ordenação local
          if (tableSortField && tableSortOrder) {
            filtered.sort((a: any, b: any) => {
              let valA = a[tableSortField];
              let valB = b[tableSortField];
              if (typeof valA === 'string') {
                valA = valA.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                valB = valB.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
              }
              if (valA < valB) return tableSortOrder === 'asc' ? -1 : 1;
              if (valA > valB) return tableSortOrder === 'asc' ? 1 : -1;
              return 0;
            });
          }

          const total = filtered.length;
          const paginated = filtered.slice((tablePage - 1) * tableLimit, tablePage * tableLimit);

          setTableData(paginated);
          setTableTotalPages(Math.ceil(total / tableLimit) || 1);
          setTableTotalItems(total);
          setTableIsLoading(false);
        }, 120);
      }
    };

    fetchWrapper();

    return () => {
      active = false;
    };
  }, [tableMode, tableSearch, tableStatus, tableRole, tableSortField, tableSortOrder, tablePage, tableLimit, tableRefreshTrigger]);

  const handleTableSort = (field: string, order: 'asc' | 'desc' | '') => {
    setTableSortField(field);
    setTableSortOrder(order);
  };

  const handleTableCellEdit = async (rowId: string | number, columnKey: string, newValue: any) => {
    try {
      await updateEmployee(String(rowId), { [columnKey]: newValue });
      setTableRefreshTrigger(prev => prev + 1);
      showToast('Célula atualizada com sucesso!');
    } catch (err: any) {
      showToast(err.message || 'Erro ao editar célula');
    }
  };

  const handleTableDeleteRow = async (rowId: string | number) => {
    await deleteEmployee(String(rowId));
    setSelectedTableIds(prev => prev.filter(id => id !== rowId));
    setTableRefreshTrigger(prev => prev + 1);
    showToast('Funcionário excluído com sucesso!');
  };

  const handleTableDeleteMultiple = async () => {
    await deleteMultipleEmployees(selectedTableIds.map(String));
    setSelectedTableIds([]);
    setTableRefreshTrigger(prev => prev + 1);
    showToast(`${selectedTableIds.length} funcionários excluídos!`);
  };

  const handleTableAddRow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim() || !newEmpEmail.trim()) {
      showToast('Nome e email são obrigatórios!');
      return;
    }
    await addEmployee({
      name: newEmpName,
      email: newEmpEmail,
      role: newEmpRole,
      status: newEmpStatus,
      salary: Number(newEmpSalary),
      joinedDate: newEmpJoinedDate
    });
    setNewEmpName('');
    setNewEmpEmail('');
    setNewEmpRole('Software Engineer');
    setNewEmpStatus('Active');
    setNewEmpSalary('5000');
    setShowAddModal(false);
    setTableRefreshTrigger(prev => prev + 1);
    showToast('Funcionário adicionado com sucesso!');
  };

  const exportTableToCSV = () => {
    const fullData = getFullLocalDatabase();
    const filtered = fullData.filter(item => {
      const matchesSearch = !tableSearch ||
        item.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        item.email.toLowerCase().includes(tableSearch.toLowerCase()) ||
        item.role.toLowerCase().includes(tableSearch.toLowerCase()) ||
        item.id.toLowerCase().includes(tableSearch.toLowerCase());

      const matchesStatus = tableStatus === 'All' || item.status === tableStatus;
      const matchesRole = tableRole === 'All' || item.role === tableRole;

      return matchesSearch && matchesStatus && matchesRole;
    });

    const headers = ['ID', 'Nome', 'Email', 'Cargo', 'Departamento', 'Status', 'Salario', 'Data de Admissao'];
    const csvRows = [headers.join(',')];

    filtered.forEach(item => {
      const values = [
        item.id,
        `"${item.name}"`,
        item.email,
        `"${item.role}"`,
        `"${item.department}"`,
        item.status,
        item.salary,
        item.joinedDate
      ];
      csvRows.push(values.join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `funcionarios_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV exportado!');
  };

  const exportSelectedToCSV = () => {
    const fullData = getFullLocalDatabase();
    const selectedData = fullData.filter(item => selectedTableIds.includes(item.id));
    if (selectedData.length === 0) return;

    const headers = ['ID', 'Nome', 'Email', 'Cargo', 'Departamento', 'Status', 'Salario', 'Data de Admissao'];
    const csvRows = [headers.join(',')];

    selectedData.forEach(item => {
      const values = [
        item.id,
        `"${item.name}"`,
        item.email,
        `"${item.role}"`,
        `"${item.department}"`,
        item.status,
        item.salary,
        item.joinedDate
      ];
      csvRows.push(values.join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `selecionados_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`${selectedData.length} funcionários exportados!`);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`);
  };

  // --- DYNAMIC FORM HANDLERS ---
  const handleAddNewField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldId.trim() || !newFieldLabel.trim()) {
      showToast('Field ID and Label are required!');
      return;
    }

    if (formSchema.some(f => f.id === newFieldId)) {
      showToast('Field ID must be unique!');
      return;
    }

    let parsedOptions: { label: string; value: any }[] | undefined = undefined;
    if ((newFieldType === 'select' || newFieldType === 'radio') && newFieldOptionsString.trim()) {
      parsedOptions = newFieldOptionsString.split(',').map((opt, index) => {
        const parts = opt.split(':');
        const text = parts[0]?.trim() || `Option ${index + 1}`;
        const val = parts[1]?.trim() || text.toLowerCase();
        return { label: text, value: val };
      });
    }

    const field: FieldSchema = {
      id: newFieldId.trim(),
      label: newFieldLabel.trim(),
      type: newFieldType,
      placeholder: newFieldPlaceholder.trim() || undefined,
      required: newFieldRequired,
      width: newFieldWidth,
      options: parsedOptions
    };

    const updatedSchema = [...formSchema, field];
    setFormSchema(updatedSchema);
    setJsonText(JSON.stringify(updatedSchema, null, 2));

    // Reset Builder inputs
    setNewFieldId('');
    setNewFieldLabel('');
    setNewFieldPlaceholder('');
    setNewFieldRequired(false);
    setNewFieldWidth(100);
    setNewFieldOptionsString('');

    showToast('Field added to schema!');
  };

  const handleRemoveField = (id: string) => {
    const updatedSchema = formSchema.filter(f => f.id !== id);
    setFormSchema(updatedSchema);
    setJsonText(JSON.stringify(updatedSchema, null, 2));
    showToast('Field removed from schema.');
  };

  const handleJsonTextChange = (text: string) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        setFormSchema(parsed);
        setJsonError(null);
      } else {
        setJsonError('Schema JSON must be an array of fields.');
      }
    } catch (e: any) {
      setJsonError(e.message || 'Invalid JSON syntax');
    }
  };

  const handleFormSubmit = (payload: Record<string, any>) => {
    setLastSubmitPayload(payload);
    showToast('Form submitted successfully!');
  };

  // --- WIZARD NEXT BUTTON VALIDATION ---
  const isWizardNextDisabled = () => {
    if (wizardStep === 1) {
      return !wizardShippingName.trim() || !wizardShippingAddress.trim() || !wizardShippingCity.trim();
    }
    return false;
  };

  const resetWizard = () => {
    setWizardStep(0);
    setWizardFlavor('macchiato');
    setWizardShippingName('');
    setWizardShippingAddress('');
    setWizardShippingCity('');
  };

  // --- CODE GENERATOR FOR BUTTONS ---
  const getReactBtnCode = () => {
    const props = [];
    if (btnVariant !== 'filled') props.push(`variant="${btnVariant}"`);
    if (btnColor !== 'mauve') props.push(`color="${btnColor}"`);
    if (btnSize !== 'md') props.push(`size="${btnSize}"`);
    if (btnShape !== 'rounded') props.push(`shape="${btnShape}"`);
    if (btnIsLoading) props.push('isLoading');
    if (btnDisabled) props.push('disabled');
    if (btnLeftIcon) props.push('leftIcon={<HeartFillIcon />}');
    if (btnRightIcon) props.push('rightIcon={<ArrowIcon />}');

    const propsStr = props.length > 0 ? '\n  ' + props.join('\n  ') : '';
    return `<span class="hl-tag">&lt;Button</span>${propsStr ? props.map(p => `\n  <span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('') : ''}\n<span class="hl-tag">&gt;</span>\n  ${buttonText}\n<span class="hl-tag">&lt;/Button&gt;</span>`;
  };

  const getVueBtnCode = () => {
    const props = [];
    if (btnVariant !== 'filled') props.push(`variant="${btnVariant}"`);
    if (btnColor !== 'mauve') props.push(`color="${btnColor}"`);
    if (btnSize !== 'md') props.push(`size="${btnSize}"`);
    if (btnShape !== 'rounded') props.push(`shape="${btnShape}"`);
    if (btnIsLoading) props.push(':is-loading="true"');
    if (btnDisabled) props.push(':disabled="true"');

    const iconTemplates = [];
    if (btnLeftIcon) iconTemplates.push('    <span class="hl-tag">&lt;template</span> <span class="hl-attr">#leftIcon</span><span class="hl-tag">&gt;</span><span class="hl-tag">&lt;HeartIcon</span> <span class="hl-tag">/&gt;</span><span class="hl-tag">&lt;/template&gt;</span>');
    if (btnRightIcon) iconTemplates.push('    <span class="hl-tag">&lt;template</span> <span class="hl-attr">#rightIcon</span><span class="hl-tag">&gt;</span><span class="hl-tag">&lt;ArrowIcon</span> <span class="hl-tag">/&gt;</span><span class="hl-tag">&lt;/template&gt;</span>');

    const slotsStr = iconTemplates.length > 0 ? `\n${iconTemplates.join('\n')}\n  ` : ` ${buttonText} `;
    const propsStr = props.length > 0 ? '\n  ' + props.join('\n  ') : '';

    return `<span class="hl-tag">&lt;CtpButton</span>${propsStr ? props.map(p => `\n  <span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('') : ''}\n<span class="hl-tag">&gt;</span>${btnLeftIcon || btnRightIcon ? `\n  ${buttonText}\n` : ''}${slotsStr}<span class="hl-tag">&lt;/CtpButton&gt;</span>`;
  };

  const getAngularBtnCode = () => {
    const props = [];
    if (btnVariant !== 'filled') props.push(`variant="${btnVariant}"`);
    if (btnColor !== 'mauve') props.push(`color="${btnColor}"`);
    if (btnSize !== 'md') props.push(`size="${btnSize}"`);
    if (btnShape !== 'rounded') props.push(`shape="${btnShape}"`);
    if (btnIsLoading) props.push('[isLoading]="true"');
    if (btnDisabled) props.push('[disabled]="true"');

    const iconElements = [];
    if (btnLeftIcon) iconElements.push('  <span class="hl-tag">&lt;span</span> <span class="hl-attr">leftIcon</span><span class="hl-tag">&gt;</span>❤️<span class="hl-tag">&lt;/span&gt;</span>');
    if (btnRightIcon) iconElements.push('  <span class="hl-tag">&lt;span</span> <span class="hl-attr">rightIcon</span><span class="hl-tag">&gt;</span>➡️<span class="hl-tag">&lt;/span&gt;</span>');

    const contentStr = iconElements.length > 0 ? `\n${iconElements.join('\n')}\n  ${buttonText}\n` : ` ${buttonText} `;
    const propsStr = props.length > 0 ? '\n  ' + props.join('\n  ') : '';

    return `<span class="hl-tag">&lt;button</span>${propsStr ? props.map(p => `\n  <span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('') : ''}\n<span class="hl-tag">&gt;</span>${contentStr}<span class="hl-tag">&lt;/button&gt;</span>`;
  };

  // --- CODE GENERATOR FOR BUTTON GROUPS ---
  const getReactButtonGroupCode = () => {
    const props = [];
    if (groupOrientation !== 'horizontal') props.push(`orientation="${groupOrientation}"`);
    if (groupLayoutVariant !== 'filled') props.push(`variant="${groupLayoutVariant}"`);
    if (groupShape !== 'rounded') props.push(`shape="${groupShape}"`);
    if (groupSelectionMode !== 'none') {
      props.push(`selectionMode="${groupSelectionMode}"`);
      if (groupSelectionMode === 'single') {
        props.push(`value={selectedValue}`);
        props.push(`onChange={setSelectedValue}`);
      } else {
        props.push(`value={selectedValues}`);
        props.push(`onChange={setSelectedValues}`);
      }
    }

    const btnProps = [];
    if (groupVariant !== 'filled') btnProps.push(`variant="${groupVariant}"`);
    if (groupColor !== 'mauve') btnProps.push(`color="${groupColor}"`);
    if (groupShape !== 'rounded') btnProps.push(`shape="${groupShape}"`);

    let buttonsMarkup = '';
    for (let i = 1; i <= groupCount; i++) {
      const valStr = groupSelectionMode !== 'none' ? ` value="opt${i}"` : '';
      buttonsMarkup += `\n  <span class="hl-tag">&lt;Button</span>${valStr}${btnProps.map(p => ` <span class="hl-attr">${p.split('=')[0]}</span>=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>`).join('')}<span class="hl-tag">&gt;</span>Option ${i}<span class="hl-tag">&lt;/Button&gt;</span>`;
    }

    const propsStr = props.length > 0 ? '\n  ' + props.join('\n  ') : '';
    return `<span class="hl-tag">&lt;ButtonGroup</span>${propsStr ? props.map(p => `\n  <span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('') : ''}\n<span class="hl-tag">&gt;</span>${buttonsMarkup}\n<span class="hl-tag">&lt;/ButtonGroup&gt;</span>`;
  };

  const getVueButtonGroupCode = () => {
    const props = [];
    if (groupOrientation !== 'horizontal') props.push(`orientation="${groupOrientation}"`);
    if (groupLayoutVariant !== 'filled') props.push(`variant="${groupLayoutVariant}"`);
    if (groupShape !== 'rounded') props.push(`shape="${groupShape}"`);
    if (groupSelectionMode !== 'none') {
      props.push(`selectionMode="${groupSelectionMode}"`);
      props.push(`v-model="value"`);
    }

    const btnProps = [];
    if (groupVariant !== 'filled') btnProps.push(`variant="${groupVariant}"`);
    if (groupColor !== 'mauve') btnProps.push(`color="${groupColor}"`);
    if (groupShape !== 'rounded') btnProps.push(`shape="${groupShape}"`);

    let buttonsMarkup = '';
    for (let i = 1; i <= groupCount; i++) {
      const valStr = groupSelectionMode !== 'none' ? ` value="opt${i}"` : '';
      buttonsMarkup += `\n  <span class="hl-tag">&lt;CtpButton</span>${valStr}${btnProps.map(p => ` <span class="hl-attr">${p.split('=')[0]}</span>=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>`).join('')}<span class="hl-tag">&gt;</span>Option ${i}<span class="hl-tag">&lt;/CtpButton&gt;</span>`;
    }

    const propsStr = props.length > 0 ? '\n  ' + props.join('\n  ') : '';
    return `<span class="hl-tag">&lt;CtpButtonGroup</span>${propsStr ? props.map(p => `\n  <span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('') : ''}\n<span class="hl-tag">&gt;</span>${buttonsMarkup}\n<span class="hl-tag">&lt;/CtpButtonGroup&gt;</span>`;
  };

  const getAngularButtonGroupCode = () => {
    const props = [];
    if (groupOrientation !== 'horizontal') props.push(`orientation="${groupOrientation}"`);
    if (groupLayoutVariant !== 'filled') props.push(`variant="${groupLayoutVariant}"`);
    if (groupShape !== 'rounded') props.push(`shape="${groupShape}"`);
    if (groupSelectionMode !== 'none') {
      props.push(`selectionMode="${groupSelectionMode}"`);
      props.push(`[(value)]="value"`);
    }

    const btnProps = [];
    if (groupVariant !== 'filled') btnProps.push(`variant="${groupVariant}"`);
    if (groupColor !== 'mauve') btnProps.push(`color="${groupColor}"`);
    if (groupShape !== 'rounded') btnProps.push(`shape="${groupShape}"`);

    let buttonsMarkup = '';
    for (let i = 1; i <= groupCount; i++) {
      const valStr = groupSelectionMode !== 'none' ? ` value="opt${i}"` : '';
      buttonsMarkup += `\n  <span class="hl-tag">&lt;button</span>${valStr}${btnProps.map(p => ` <span class="hl-attr">${p.split('=')[0]}</span>=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>`).join('')}<span class="hl-tag">&gt;</span>Option ${i}<span class="hl-tag">&lt;/button&gt;</span>`;
    }

    const propsStr = props.length > 0 ? '\n  ' + props.join('\n  ') : '';
    return `<span class="hl-tag">&lt;button-group</span>${propsStr ? props.map(p => `\n  <span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('') : ''}\n<span class="hl-tag">&gt;</span>${buttonsMarkup}\n<span class="hl-tag">&lt;/button-group&gt;</span>`;
  };

  // --- CODE GENERATORS FOR STEPPER ---
  const getReactStepCode = () => {
    return `<span class="hl-tag">&lt;Stepper</span>\n  <span class="hl-attr">steps</span>=<span class="hl-str">{demoSteps}</span>\n  <span class="hl-attr">currentStep</span>=<span class="hl-str">{${currentStep}}</span>\n  <span class="hl-attr">orientation</span>=<span class="hl-str">"${stepOrientation}"</span>\n  <span class="hl-attr">variant</span>=<span class="hl-str">"${stepVariant}"</span>\n  <span class="hl-attr">color</span>=<span class="hl-str">"${stepColor}"</span>\n<span class="hl-tag">/&gt;</span>`;
  };

  const getVueStepCode = () => {
    return `<span class="hl-tag">&lt;CtpStepper</span>\n  <span class="hl-attr">:steps</span>=<span class="hl-str">"demoSteps"</span>\n  <span class="hl-attr">:current-step</span>=<span class="hl-str">"${currentStep}"</span>\n  <span class="hl-attr">orientation</span>=<span class="hl-str">"${stepOrientation}"</span>\n  <span class="hl-attr">variant</span>=<span class="hl-str">"${stepVariant}"</span>\n  <span class="hl-attr">color</span>=<span class="hl-str">"${stepColor}"</span>\n<span class="hl-tag">/&gt;</span>`;
  };

  const getAngularStepCode = () => {
    return `<span class="hl-tag">&lt;stepper</span>\n  <span class="hl-attr">[steps]</span>=<span class="hl-str">"demoSteps"</span>\n  <span class="hl-attr">[currentStep]</span>=<span class="hl-str">"${currentStep}"</span>\n  <span class="hl-attr">orientation</span>=<span class="hl-str">"${stepOrientation}"</span>\n  <span class="hl-attr">variant</span>=<span class="hl-str">"${stepVariant}"</span>\n  <span class="hl-attr">color</span>=<span class="hl-str">"${stepColor}"</span>\n<span class="hl-tag">&gt;&lt;/stepper&gt;</span>`;
  };

  // --- CODE GENERATOR FOR STEPS ---
  const getReactStepsCode = () => {
    const props = [`stepsCount={${stepsCount}}`, `currentStep={${stepsCurrent}}`];
    if (stepsVariant !== 'timeline') props.push(`variant="${stepsVariant}"`);
    if (stepsColor !== 'mauve') props.push(`color="${stepsColor}"`);
    if (stepsOrientation !== 'horizontal') props.push(`orientation="${stepsOrientation}"`);
    return `<span class="hl-tag">&lt;Steps</span>\n  ${props.map(p => `<span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('\n  ')}\n<span class="hl-tag">/&gt;</span>`;
  };

  const getVueStepsCode = () => {
    const props = [`:steps-count="${stepsCount}"`, `:current-step="${stepsCurrent}"`];
    if (stepsVariant !== 'timeline') props.push(`variant="${stepsVariant}"`);
    if (stepsColor !== 'mauve') props.push(`color="${stepsColor}"`);
    if (stepsOrientation !== 'horizontal') props.push(`orientation="${stepsOrientation}"`);
    return `<span class="hl-tag">&lt;CtpSteps</span>\n  ${props.map(p => `<span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('\n  ')}\n<span class="hl-tag">/&gt;</span>`;
  };

  const getAngularStepsCode = () => {
    const props = [`[stepsCount]="${stepsCount}"`, `[currentStep]="${stepsCurrent}"`];
    if (stepsVariant !== 'timeline') props.push(`variant="${stepsVariant}"`);
    if (stepsColor !== 'mauve') props.push(`color="${stepsColor}"`);
    if (stepsOrientation !== 'horizontal') props.push(`orientation="${stepsOrientation}"`);
    return `<span class="hl-tag">&lt;steps</span>\n  ${props.map(p => `<span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('\n  ')}\n<span class="hl-tag">&gt;&lt;/steps&gt;</span>`;
  };

  // --- CODE GENERATOR FOR PROGRESS BAR ---
  const getReactProgressCode = () => {
    const props = [];
    if (!progressIndeterminate) props.push(`value={${progressVal}}`);
    if (progressSize !== 'md') props.push(`size="${progressSize}"`);
    if (progressColor !== 'mauve') props.push(`color="${progressColor}"`);
    if (progressStriped) props.push('striped');
    if (progressAnimated) props.push('animated');
    if (progressIndeterminate) props.push('indeterminate');
    if (progressShowValue) props.push('showValue');
    if (progressShowValue && progressValPosition !== 'outside') props.push(`valuePosition="${progressValPosition}"`);
    if (progressLabel) props.push(`label="${progressLabel}"`);

    return `<span class="hl-tag">&lt;ProgressBar</span>\n  ${props.map(p => `<span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('\n  ')}\n<span class="hl-tag">/&gt;</span>`;
  };

  const getVueProgressCode = () => {
    const props = [];
    if (!progressIndeterminate) props.push(`:value="${progressVal}"`);
    if (progressSize !== 'md') props.push(`size="${progressSize}"`);
    if (progressColor !== 'mauve') props.push(`color="${progressColor}"`);
    if (progressStriped) props.push(':striped="true"');
    if (progressAnimated) props.push(':animated="true"');
    if (progressIndeterminate) props.push(':indeterminate="true"');
    if (progressShowValue) props.push(':show-value="true"');
    if (progressShowValue && progressValPosition !== 'outside') props.push(`value-position="${progressValPosition}"`);
    if (progressLabel) props.push(`label="${progressLabel}"`);

    return `<span class="hl-tag">&lt;CtpProgressBar</span>\n  ${props.map(p => `<span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('\n  ')}\n<span class="hl-tag">/&gt;</span>`;
  };

  const getAngularProgressCode = () => {
    const props = [];
    if (!progressIndeterminate) props.push(`[value]="${progressVal}"`);
    if (progressSize !== 'md') props.push(`size="${progressSize}"`);
    if (progressColor !== 'mauve') props.push(`color="${progressColor}"`);
    if (progressStriped) props.push('[striped]="true"');
    if (progressAnimated) props.push('[animated]="true"');
    if (progressIndeterminate) props.push('[indeterminate]="true"');
    if (progressShowValue) props.push('[showValue]="true"');
    if (progressShowValue && progressValPosition !== 'outside') props.push(`valuePosition="${progressValPosition}"`);
    if (progressLabel) props.push(`label="${progressLabel}"`);

    return `<span class="hl-tag">&lt;progressbar</span>\n  ${props.map(p => `<span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('\n  ')}\n<span class="hl-tag">&gt;&lt;/progressbar&gt;</span>`;
  };

  // --- CODE GENERATORS FOR COLOR PICKER ---
  const getReactColorPickerCode = () => {
    const props = [];
    props.push(`value="${colorPickerVal}"`);
    props.push(`onChange={(val) => setValue(val)}`);
    if (colorPickerFlavor !== 'mocha') props.push(`flavor="${colorPickerFlavor}"`);
    if (colorPickerVariant !== 'both') props.push(`variant="${colorPickerVariant}"`);
    if (colorPickerSize !== 'md') props.push(`size="${colorPickerSize}"`);
    if (!colorPickerShowHexInput) props.push('showHexInput={false}');
    const propsStr = props.length > 0 ? '\n  ' + props.join('\n  ') : '';
    return `<span class="hl-tag">&lt;ColorPicker</span>${propsStr ? props.map(p => `\n  <span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('') : ''}\n<span class="hl-tag">/&gt;</span>`;
  };

  const getVueColorPickerCode = () => {
    const props = [];
    props.push(`v-model:value="color"`);
    if (colorPickerFlavor !== 'mocha') props.push(`flavor="${colorPickerFlavor}"`);
    if (colorPickerVariant !== 'both') props.push(`variant="${colorPickerVariant}"`);
    if (colorPickerSize !== 'md') props.push(`size="${colorPickerSize}"`);
    if (!colorPickerShowHexInput) props.push(':show-hex-input="false"');
    const propsStr = props.length > 0 ? '\n  ' + props.join('\n  ') : '';
    return `<span class="hl-tag">&lt;CtpColorPicker</span>${propsStr ? props.map(p => `\n  <span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('') : ''}\n<span class="hl-tag">/&gt;</span>`;
  };

  const getAngularColorPickerCode = () => {
    const props = [];
    props.push(`[value]="color"`);
    props.push(`(change)="color = $event"`);
    if (colorPickerFlavor !== 'mocha') props.push(`flavor="${colorPickerFlavor}"`);
    if (colorPickerVariant !== 'both') props.push(`variant="${colorPickerVariant}"`);
    if (colorPickerSize !== 'md') props.push(`size="${colorPickerSize}"`);
    if (!colorPickerShowHexInput) props.push('[showHexInput]="false"');
    const propsStr = props.length > 0 ? '\n  ' + props.join('\n  ') : '';
    return `<span class="hl-tag">&lt;color-picker</span>${propsStr ? props.map(p => `\n  <span class="hl-attr">${p.split('=')[0]}</span>${p.includes('=') ? `=<span class="hl-str">${p.substring(p.indexOf('=') + 1)}</span>` : ''}`).join('') : ''}\n<span class="hl-tag">&gt;&lt;/color-picker&gt;</span>`;
  };

  // --- CODE GENERATORS FOR PAGINATION ---
  const getReactPaginationCode = () => {
    return `<span class="hl-tag">&lt;Pagination</span>
  <span class="hl-attr">currentPage</span>=<span class="hl-str">{page}</span>
  <span class="hl-attr">totalPages</span>=<span class="hl-str">{totalPages}</span>
  <span class="hl-attr">onPageChange</span>=<span class="hl-str">{setPage}</span>
  <span class="hl-attr">size</span>=<span class="hl-str">"${paginationSize}"</span>
  <span class="hl-attr">shape</span>=<span class="hl-str">"${paginationShape}"</span>
  <span class="hl-attr">color</span>=<span class="hl-str">"${paginationColor}"</span>
  <span class="hl-attr">siblingCount</span>=<span class="hl-str">{${paginationSiblingCount}}</span>
  <span class="hl-attr">showFirstLast</span>=<span class="hl-str">{${paginationShowFirstLast}}</span>
  <span class="hl-attr">showPrevNext</span>=<span class="hl-str">{${paginationShowPrevNext}}</span>
  <span class="hl-attr">showPageInput</span>=<span class="hl-str">{${paginationShowPageInput}}</span>
<span class="hl-tag">/&gt;</span>

<span class="hl-tag">&lt;PageSizeSelector</span>
  <span class="hl-attr">pageSize</span>=<span class="hl-str">{limit}</span>
  <span class="hl-attr">onPageSizeChange</span>=<span class="hl-str">{setLimit}</span>
  <span class="hl-attr">size</span>=<span class="hl-str">"${paginationSize}"</span>
  <span class="hl-attr">shape</span>=<span class="hl-str">"${paginationShape}"</span>
  <span class="hl-attr">color</span>=<span class="hl-str">"${paginationColor}"</span>
<span class="hl-tag">/&gt;</span>`;
  };

  const getVuePaginationCode = () => {
    return `<span class="hl-tag">&lt;CtpPagination</span>
  <span class="hl-attr">:current-page</span>=<span class="hl-str">"page"</span>
  <span class="hl-attr">:total-pages</span>=<span class="hl-str">"totalPages"</span>
  <span class="hl-attr">@update:currentPage</span>=<span class="hl-str">"page = $event"</span>
  <span class="hl-attr">size</span>=<span class="hl-str">"${paginationSize}"</span>
  <span class="hl-attr">shape</span>=<span class="hl-str">"${paginationShape}"</span>
  <span class="hl-attr">color</span>=<span class="hl-str">"${paginationColor}"</span>
  <span class="hl-attr">:show-page-input</span>=<span class="hl-str">"${paginationShowPageInput}"</span>
<span class="hl-tag">/&gt;</span>

<span class="hl-tag">&lt;CtpPageSizeSelector</span>
  <span class="hl-attr">:page-size</span>=<span class="hl-str">"limit"</span>
  <span class="hl-attr">@update:pageSize</span>=<span class="hl-str">"limit = $event"</span>
  <span class="hl-attr">size</span>=<span class="hl-str">"${paginationSize}"</span>
  <span class="hl-attr">shape</span>=<span class="hl-str">"${paginationShape}"</span>
  <span class="hl-attr">color</span>=<span class="hl-str">"${paginationColor}"</span>
<span class="hl-tag">/&gt;</span>`;
  };

  const getAngularPaginationCode = () => {
    return `<span class="hl-tag">&lt;pagination</span>
  <span class="hl-attr">[currentPage]</span>=<span class="hl-str">"page"</span>
  <span class="hl-attr">[totalPages]</span>=<span class="hl-str">"totalPages"</span>
  <span class="hl-attr">(pageChange)</span>=<span class="hl-str">"page = $event"</span>
  <span class="hl-attr">size</span>=<span class="hl-str">"${paginationSize}"</span>
  <span class="hl-attr">shape</span>=<span class="hl-str">"${paginationShape}"</span>
  <span class="hl-attr">color</span>=<span class="hl-str">"${paginationColor}"</span>
  <span class="hl-attr">[showPageInput]</span>=<span class="hl-str">"${paginationShowPageInput}"</span>
<span class="hl-tag">&gt;&lt;/pagination&gt;</span>

<span class="hl-tag">&lt;page-size-selector</span>
  <span class="hl-attr">[pageSize]</span>=<span class="hl-str">"limit"</span>
  <span class="hl-attr">(pageSizeChange)</span>=<span class="hl-str">"limit = $event"</span>
  <span class="hl-attr">size</span>=<span class="hl-str">"${paginationSize}"</span>
  <span class="hl-attr">shape</span>=<span class="hl-str">"${paginationShape}"</span>
  <span class="hl-attr">color</span>=<span class="hl-str">"${paginationColor}"</span>
<span class="hl-tag">&gt;&lt;/page-size-selector&gt;</span>`;
  };

  const getReactBadgeCode = () => {
    return `<span class="hl-tag">&lt;Badge</span>
  <span class="hl-attr">variant</span>=<span class="hl-str">"${badgeVariant}"</span>
  <span class="hl-attr">size</span>=<span class="hl-str">"${badgeSize}"</span>
  <span class="hl-attr">shape</span>=<span class="hl-str">"${badgeShape}"</span>
  <span class="hl-attr">color</span>=<span class="hl-str">"${badgeColor}"</span>
  ${badgeHasIcon ? '<span class="hl-attr">icon</span>=<span class="hl-str">{&lt;SparklesIcon /&gt;}</span>' : ''}
  ${badgeDismissible ? '<span class="hl-attr">isDismissible</span>=<span class="hl-str">{true}</span>\n  <span class="hl-attr">onDismiss</span>=<span class="hl-str">{handleDismiss}</span>' : ''}
<span class="hl-tag">&gt;</span>
  <span class="hl-text">${badgeText}</span>
<span class="hl-tag">&lt;/Badge&gt;</span>`;
  };

  const getVueBadgeCode = () => {
    return `<span class="hl-tag">&lt;CtpBadge</span>
  <span class="hl-attr">variant</span>=<span class="hl-str">"${badgeVariant}"</span>
  <span class="hl-attr">size</span>=<span class="hl-str">"${badgeSize}"</span>
  <span class="hl-attr">shape</span>=<span class="hl-str">"${badgeShape}"</span>
  <span class="hl-attr">color</span>=<span class="hl-str">"${badgeColor}"</span>
  ${badgeDismissible ? '<span class="hl-attr">:isDismissible</span>=<span class="hl-str">"true"</span>\n  <span class="hl-attr">@dismiss</span>=<span class="hl-str">"handleDismiss"</span>' : ''}
<span class="hl-tag">&gt;</span>
  ${badgeHasIcon ? '<span class="hl-tag">&lt;template</span> <span class="hl-attr">#icon</span><span class="hl-tag">&gt;</span>✨<span class="hl-tag">&lt;/template&gt;</span>\n  ' : ''}<span class="hl-text">${badgeText}</span>
<span class="hl-tag">&lt;/CtpBadge&gt;</span>`;
  };

  const getAngularBadgeCode = () => {
    return `<span class="hl-tag">&lt;badge</span>
  <span class="hl-attr">variant</span>=<span class="hl-str">"${badgeVariant}"</span>
  <span class="hl-attr">size</span>=<span class="hl-str">"${badgeSize}"</span>
  <span class="hl-attr">shape</span>=<span class="hl-str">"${badgeShape}"</span>
  <span class="hl-attr">color</span>=<span class="hl-str">"${badgeColor}"</span>
  ${badgeHasIcon ? '<span class="hl-attr">[hasIcon]</span>=<span class="hl-str">"true"</span>' : ''}
  ${badgeDismissible ? '<span class="hl-attr">[isDismissible]</span>=<span class="hl-str">"true"</span>\n  <span class="hl-attr">(dismiss)</span>=<span class="hl-str">"handleDismiss($event)"</span>' : ''}
<span class="hl-tag">&gt;</span>
  ${badgeHasIcon ? '<span class="hl-tag">&lt;span</span> <span class="hl-attr">icon</span><span class="hl-tag">&gt;</span>✨<span class="hl-tag">&lt;/span&gt;</span>\n  ' : ''}<span class="hl-text">${badgeText}</span>
<span class="hl-tag">&lt;/badge&gt;</span>`;
  };

  const getReactCardCode = () => {
    return `<span class="hl-tag">&lt;Card</span> <span class="hl-attr">variant</span>=<span class="hl-str">"filled"</span> <span class="hl-attr">accentColor</span>=<span class="hl-str">"mauve"</span> <span class="hl-attr">accentPosition</span>=<span class="hl-str">"top"</span> <span class="hl-attr">isInteractive</span>=<span class="hl-str">{true}</span><span class="hl-tag">&gt;</span>
  <span class="hl-tag">&lt;Card.Header</span> <span class="hl-attr">title</span>=<span class="hl-str">"Card Title"</span> <span class="hl-attr">subtitle</span>=<span class="hl-str">"Card Subtitle"</span> <span class="hl-tag">/&gt;</span>
  <span class="hl-tag">&lt;Card.Body&gt;</span>
    <span class="hl-text">Card Content...</span>
  <span class="hl-tag">&lt;/Card.Body&gt;</span>
  <span class="hl-tag">&lt;Card.Footer&gt;</span>
    <span class="hl-tag">&lt;Button&gt;</span>Action<span class="hl-tag">&lt;/Button&gt;</span>
  <span class="hl-tag">&lt;/Card.Footer&gt;</span>
<span class="hl-tag">&lt;/Card&gt;</span>

<span class="hl-tag">&lt;Tile</span> <span class="hl-attr">variant</span>=<span class="hl-str">"tonal"</span> <span class="hl-attr">color</span>=<span class="hl-str">"peach"</span> <span class="hl-attr">indicator</span>=<span class="hl-str">"left"</span> <span class="hl-attr">title</span>=<span class="hl-str">"System Load"</span> <span class="hl-attr">subtitle</span>=<span class="hl-str">"Operational"</span> <span class="hl-tag">/&gt;</span>`;
  };

  const getVueCardCode = () => {
    return `<span class="hl-tag">&lt;CtpCard</span> <span class="hl-attr">variant</span>=<span class="hl-str">"filled"</span> <span class="hl-attr">accentColor</span>=<span class="hl-str">"mauve"</span> <span class="hl-attr">accentPosition</span>=<span class="hl-str">"top"</span> <span class="hl-attr">:isInteractive</span>=<span class="hl-str">"true"</span> <span class="hl-attr">title</span>=<span class="hl-str">"Card Title"</span> <span class="hl-attr">subtitle</span>=<span class="hl-str">"Card Subtitle"</span><span class="hl-tag">&gt;</span>
  <span class="hl-text">Card Content...</span>
  <span class="hl-tag">&lt;template</span> <span class="hl-attr">#footer</span><span class="hl-tag">&gt;</span>
    <span class="hl-tag">&lt;CtpButton&gt;</span>Action<span class="hl-tag">&lt;/CtpButton&gt;</span>
  <span class="hl-tag">&lt;/template&gt;</span>
<span class="hl-tag">&lt;/CtpCard&gt;</span>

<span class="hl-tag">&lt;CtpTile</span> <span class="hl-attr">variant</span>=<span class="hl-str">"tonal"</span> <span class="hl-attr">color</span>=<span class="hl-str">"peach"</span> <span class="hl-attr">indicator</span>=<span class="hl-str">"left"</span> <span class="hl-attr">title</span>=<span class="hl-str">"System Load"</span> <span class="hl-attr">subtitle</span>=<span class="hl-str">"Operational"</span> <span class="hl-tag">/&gt;</span>`;
  };

  const getAngularCardCode = () => {
    return `<span class="hl-tag">&lt;card</span> <span class="hl-attr">variant</span>=<span class="hl-str">"filled"</span> <span class="hl-attr">[accentColor]</span>=<span class="hl-str">"'mauve'"</span> <span class="hl-attr">accentPosition</span>=<span class="hl-str">"top"</span> <span class="hl-attr">[isInteractive]</span>=<span class="hl-str">"true"</span><span class="hl-tag">&gt;</span>
  <span class="hl-tag">&lt;card-header</span> <span class="hl-attr">title</span>=<span class="hl-str">"Card Title"</span> <span class="hl-attr">subtitle</span>=<span class="hl-str">"Card Subtitle"</span><span class="hl-tag">&gt;&lt;/card-header&gt;</span>
  <span class="hl-tag">&lt;card-body&gt;</span>
    <span class="hl-text">Card Content...</span>
  <span class="hl-tag">&lt;/card-body&gt;</span>
  <span class="hl-tag">&lt;card-footer&gt;</span>
    <span class="hl-tag">&lt;button</span> <span class="hl-attr">button</span><span class="hl-tag">&gt;</span>Action<span class="hl-tag">&lt;/button&gt;</span>
  <span class="hl-tag">&lt;/card-footer&gt;</span>
<span class="hl-tag">&lt;/card&gt;</span>

<span class="hl-tag">&lt;tile</span> <span class="hl-attr">variant</span>=<span class="hl-str">"tonal"</span> <span class="hl-attr">color</span>=<span class="hl-str">"peach"</span> <span class="hl-attr">indicator</span>=<span class="hl-str">"left"</span> <span class="hl-attr">title</span>=<span class="hl-str">"System Load"</span> <span class="hl-attr">subtitle</span>=<span class="hl-str">"Operational"</span><span class="hl-tag">&gt;&lt;/tile&gt;</span>`;
  };

  const getReactTableCode = () => {
    return `<span class="hl-tag">&lt;Table</span>
  <span class="hl-attr">data</span>=<span class="hl-str">{employees}</span>
  <span class="hl-attr">columns</span>=<span class="hl-str">{columns}</span>
  <span class="hl-attr">rowKey</span>=<span class="hl-str">{(row) =&gt; row.id}</span>
  <span class="hl-attr">sortField</span>=<span class="hl-str">"{sortField}"</span>
  <span class="hl-attr">sortOrder</span>=<span class="hl-str">"{sortOrder}"</span>
  <span class="hl-attr">onSort</span>=<span class="hl-str">{handleSort}</span>
  <span class="hl-attr">selectedRowIds</span>=<span class="hl-str">{selectedIds}</span>
  <span class="hl-attr">onSelectionChange</span>=<span class="hl-str">{setSelectedIds}</span>
  <span class="hl-attr">onCellEdit</span>=<span class="hl-str">{handleCellEdit}</span>
  <span class="hl-attr">isLoading</span>=<span class="hl-str">{isLoading}</span>
  <span class="hl-attr">size</span>=<span class="hl-str">"${tableSize}"</span>
  <span class="hl-attr">color</span>=<span class="hl-str">"${tableColor}"</span>
<span class="hl-tag">/&gt;</span>`;
  };

  const getVueTableCode = () => {
    return `<span class="hl-tag">&lt;CtpTable</span>
  <span class="hl-attr">:data</span>=<span class="hl-str">"employees"</span>
  <span class="hl-attr">:columns</span>=<span class="hl-str">"columns"</span>
  <span class="hl-attr">row-key</span>=<span class="hl-str">"id"</span>
  <span class="hl-attr">v-model:sort-field</span>=<span class="hl-str">"sortField"</span>
  <span class="hl-attr">v-model:sort-order</span>=<span class="hl-str">"sortOrder"</span>
  <span class="hl-attr">v-model:selected-row-ids</span>=<span class="hl-str">"selectedIds"</span>
  <span class="hl-attr">@cell-edit</span>=<span class="hl-str">"handleCellEdit"</span>
  <span class="hl-attr">:is-loading</span>=<span class="hl-str">"isLoading"</span>
  <span class="hl-attr">size</span>=<span class="hl-str">"${tableSize}"</span>
  <span class="hl-attr">color</span>=<span class="hl-str">"${tableColor}"</span>
<span class="hl-tag">/&gt;</span>`;
  };

  const getAngularTableCode = () => {
    return `<span class="hl-tag">&lt;table</span>
  <span class="hl-attr">[data]</span>=<span class="hl-str">"employees"</span>
  <span class="hl-attr">[columns]</span>=<span class="hl-str">"columns"</span>
  <span class="hl-attr">[rowKey]</span>=<span class="hl-str">"id"</span>
  <span class="hl-attr">[(sortField)]</span>=<span class="hl-str">"sortField"</span>
  <span class="hl-attr">[(sortOrder)]</span>=<span class="hl-str">"sortOrder"</span>
  <span class="hl-attr">[selectedRowIds]</span>=<span class="hl-str">"selectedIds"</span>
  <span class="hl-attr">(cellEdit)</span>=<span class="hl-str">"handleCellEdit($event)"</span>
  <span class="hl-attr">[isLoading]</span>=<span class="hl-str">"isLoading"</span>
  <span class="hl-attr">size</span>=<span class="hl-str">"${tableSize}"</span>
  <span class="hl-attr">color</span>=<span class="hl-str">"${tableColor}"</span>
<span class="hl-tag">&gt;&lt;/table&gt;</span>`;
  };

  const getRawTextCode = () => {
    let activeText = '';
    if (activeComponent === 'button') {
      activeText = activeTab === 'react' ? getReactBtnCode() : activeTab === 'vue' ? getVueBtnCode() : getAngularBtnCode();
    } else if (activeComponent === 'buttongroup') {
      activeText = activeTab === 'react' ? getReactButtonGroupCode() : activeTab === 'vue' ? getVueButtonGroupCode() : getAngularButtonGroupCode();
    } else if (activeComponent === 'stepper') {
      activeText = activeTab === 'react' ? getReactStepCode() : activeTab === 'vue' ? getVueStepCode() : getAngularStepCode();
    } else if (activeComponent === 'steps') {
      activeText = activeTab === 'react' ? getReactStepsCode() : activeTab === 'vue' ? getVueStepsCode() : getAngularStepsCode();
    } else if (activeComponent === 'progress') {
      activeText = activeTab === 'react' ? getReactProgressCode() : activeTab === 'vue' ? getVueProgressCode() : getAngularProgressCode();
    } else if (activeComponent === 'drawer') {
      activeText = activeTab === 'react' ? getReactDrawerCode() : activeTab === 'vue' ? getVueDrawerCode() : getAngularDrawerCode();
    } else if (activeComponent === 'select') {
      activeText = activeTab === 'react' ? getReactSelectCode() : activeTab === 'vue' ? getVueSelectCode() : getAngularSelectCode();
    } else if (activeComponent === 'colorpicker') {
      activeText = activeTab === 'react' ? getReactColorPickerCode() : activeTab === 'vue' ? getVueColorPickerCode() : getAngularColorPickerCode();
    } else if (activeComponent === 'pagination') {
      activeText = activeTab === 'react' ? getReactPaginationCode() : activeTab === 'vue' ? getVuePaginationCode() : getAngularPaginationCode();
    } else if (activeComponent === 'table') {
      activeText = activeTab === 'react' ? getReactTableCode() : activeTab === 'vue' ? getVueTableCode() : getAngularTableCode();
    } else if (activeComponent === 'card') {
      activeText = activeTab === 'react' ? getReactCardCode() : activeTab === 'vue' ? getVueCardCode() : getAngularCardCode();
    } else if (activeComponent === 'badge') {
      activeText = activeTab === 'react' ? getReactBadgeCode() : activeTab === 'vue' ? getVueBadgeCode() : getAngularBadgeCode();
    } else if (activeComponent === 'accordion') {
      activeText = activeTab === 'react' ? getReactAccordionCode() : activeTab === 'vue' ? getVueAccordionCode() : getAngularAccordionCode();
    } else if (activeComponent === 'dropdown') {
      activeText = activeTab === 'react' ? getReactDropdownCode() : activeTab === 'vue' ? getVueDropdownCode() : getAngularDropdownCode();
    } else if (activeComponent === 'tooltip') {
      activeText = activeTab === 'react' ? getReactTooltipCode() : activeTab === 'vue' ? getVueTooltipCode() : getAngularTooltipCode();
    } else if (activeComponent === 'grid') {
      activeText = activeTab === 'react' ? getReactGridCode() : activeTab === 'vue' ? getVueGridCode() : getAngularGridCode();
    }
    return activeText.replace(/<[^>]*>/g, '');


  };

  const handleGalleryClick = (item: GalleryItem) => {
    setButtonText(item.text);
    setBtnVariant(item.variant);
    setBtnColor(item.color);
    setBtnSize(item.size);
    setBtnShape(item.shape);
    setBtnIsLoading(item.isLoading);
    setBtnDisabled(item.disabled);
    setBtnLeftIcon(item.leftIcon);
    setBtnRightIcon(item.rightIcon);
  };

  // Determine slide direction for active step card animation
  const slideClass = currentStep >= prevStepRef.current
    ? 'stepper-panel--slide-in-right'
    : 'stepper-panel--slide-in-left';

  // Compute z-indices currently on stack
  const openStack = [];
  if (isOpenSm) openStack.push({ name: 'Small Modal', size: 'sm' });
  if (isOpenMd) openStack.push({ name: 'Medium Modal', size: 'md' });
  if (isOpenLg) openStack.push({ name: 'Large Modal', size: 'lg' });
  if (isOpenNested1) openStack.push({ name: 'Layer 1 Modal', size: 'lg' });
  if (isOpenNested2) openStack.push({ name: 'Layer 2 Modal', size: 'md' });
  if (isOpenNested3) openStack.push({ name: 'Layer 3 Modal', size: 'sm' });
  // --- TREE TABLE SHOWCASE MEMOS ---
  const treeStats = useMemo(() => {
    let foldersCount = 0;
    let filesCount = 0;
    let totalSize = 0;

    const calculate = (nodes: FileNode[]) => {
      nodes.forEach(node => {
        if (node.type === 'Diretório') {
          foldersCount++;
        } else {
          filesCount++;
        }
        totalSize += node.sizeBytes;
        const children = node.children;
        if (Array.isArray(children)) {
          calculate(children);
        }
      });
    };
    calculate(initialFilesData);

    return {
      foldersCount,
      filesCount,
      totalSize: totalSize > 1024 * 1024
        ? `${(totalSize / (1024 * 1024)).toFixed(1)} MB`
        : `${(totalSize / 1024).toFixed(1)} KB`,
    };
  }, []);

  const treeColumns = useMemo<TreeColumn<FileNode>[]>(() => [
    {
      key: 'name',
      header: 'Nome',
      sortable: true,
      render: (row: FileNode, value: any, _depth: number, isExpanded: boolean, _hasChildren: boolean) => {
        let icon = '📄';
        if (row.type === 'Diretório') {
          icon = isExpanded ? '📂' : '📁';
        } else if (row.type === 'PDF') {
          icon = '📕';
        } else if (row.type.includes('Imagem')) {
          icon = '🖼️';
        } else if (row.type.includes('Configuração') || row.type.includes('JSON')) {
          icon = '⚙️';
        } else if (row.type.includes('Word')) {
          icon = '📘';
        } else if (row.type.includes('TypeScript') || row.type.includes('React')) {
          icon = '⚛️';
        } else if (row.type.includes('Markdown')) {
          icon = '📝';
        } else if (row.type.includes('Vídeo')) {
          icon = '🎥';
        } else if (row.type.includes('Planilha')) {
          icon = '📊';
        } else if (row.type.includes('Oculto') || row.type.includes('git')) {
          icon = '🔧';
        }
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1.1rem' }}>{icon}</span>
            <span style={{ fontWeight: row.type === 'Diretório' ? 600 : 400 }}>{value}</span>
          </span>
        );
      }
    },
    {
      key: 'type',
      header: 'Tipo',
      render: (row: FileNode, value: any) => (
        <span
          style={{
            fontSize: '0.85rem',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: row.type === 'Diretório' ? 'var(--ctp-surface1)' : 'var(--ctp-surface0)',
            color: row.type === 'Diretório' ? 'var(--ctp-teal)' : 'var(--ctp-text)',
          }}
        >
          {value}
        </span>
      )
    },
    {
      key: 'size',
      header: 'Tamanho',
      sortable: true,
      align: 'right',
      sortValue: (row: FileNode) => row.sizeBytes,
      render: (_row: FileNode, value: any) => (
        <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--ctp-subtext1)' }}>
          {value}
        </span>
      )
    },
    {
      key: 'updatedAt',
      header: 'Última Modificação',
      sortable: true,
      align: 'center',
      render: (_row: FileNode, value: any) => {
        if (!value) return '-';
        return (
          <span style={{ color: 'var(--ctp-subtext0)', fontSize: '0.85rem' }}>
            {new Date(value).toLocaleDateString('pt-BR')}
          </span>
        );
      }
    }
  ], []);

  if (shellFullScreen) {
    return (
      <Shell
        layout={shellLayout}
        fullScreen={true}
        sidebarCollapsed={shellSidebarCollapsed}
        sidebarMini={shellSidebarMini}
        sidebarMobileOpen={shellSidebarMobileOpen}
        onBackdropClick={() => setShellSidebarMobileOpen(false)}
        headerHeight={shellHeaderHeight}
        sidebarWidth={shellSidebarWidth}
      >
        {/* Header */}
        {shellLayout !== 'custom' && (
          <Shell.Header style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShellSidebarMobileOpen(!shellSidebarMobileOpen)}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '32px', height: '32px', border: 'none', borderRadius: '6px',
                  backgroundColor: 'var(--ctp-surface0)', color: 'var(--ctp-text)',
                  cursor: 'pointer', fontSize: '1.1rem'
                }}
                className="d--none d--inline-flex-mobile"
              >
                ☰
              </button>
              <span style={{ fontSize: '1.25rem' }}>🐱</span>
              <span style={{ fontWeight: 800, letterSpacing: '0.02em' }}>Catppuccin Fullscreen Shell</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => {
                  setShellFullScreen(false);
                  setShellSidebarMobileOpen(false);
                }}
                style={{
                  padding: '0.4rem 0.8rem', borderRadius: '6px',
                  border: '1px solid var(--ctp-red)',
                  backgroundColor: 'var(--ctp-red)',
                  color: 'var(--ctp-base)',
                  cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem',
                  fontFamily: 'var(--ctp-font-family)'
                }}
              >
                Exit Full Screen
              </button>
            </div>
          </Shell.Header>
        )}

        {/* Sidebar */}
        {shellLayout !== 'simple' && shellLayout !== 'custom' && (
          <Shell.Sidebar style={{ padding: shellSidebarMini ? '1rem 0.5rem' : '1.5rem 1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { icon: '🏠', label: 'Dashboard' },
                { icon: '📊', label: 'Analytics' },
                { icon: '👥', label: 'Team Members' },
                { icon: '⚙️', label: 'Settings' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    backgroundColor: idx === 0 ? 'var(--ctp-surface0)' : 'transparent',
                    color: idx === 0 ? 'var(--ctp-mauve)' : 'var(--ctp-text)',
                    fontWeight: idx === 0 ? 'bold' : 'normal',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    justifyContent: shellSidebarMini ? 'center' : 'flex-start'
                  }}
                  title={item.label}
                >
                  <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                  {!shellSidebarMini && <span>{item.label}</span>}
                </div>
              ))}
            </div>
          </Shell.Sidebar>
        )}

        {/* Main */}
        <Shell.Main>
          <Shell.Content scrollable={shellScrollable} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
              {/* Top Welcome Title */}
              <div>
                <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Bem-vindo ao Modo Tela Cheia!</h3>
                <p style={{ margin: '8px 0 0', fontSize: '0.95rem', color: 'var(--ctp-subtext0)' }}>
                  O Shell ocupa todo o viewport e bloqueia a rolagem do corpo da página. Apenas esta área de conteúdo rola de forma independente.
                </p>
              </div>

              {/* Side-by-side Page Columns using Grid component */}
              <Grid>
                <Grid.Col md={6} sm={12}>
                  <div style={{
                    padding: '2rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--ctp-mantle)',
                    border: '1px solid var(--ctp-surface0)',
                    height: '100%'
                  }}>
                    <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: 700 }}>Coluna da Esquerda</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ctp-subtext1)', lineHeight: 1.5 }}>
                      Este painel representa uma página ou bloco principal de conteúdo. O Shell gerencia automaticamente o recuo e o alinhamento.
                    </p>
                  </div>
                </Grid.Col>
                <Grid.Col md={6} sm={12}>
                  <div style={{
                    padding: '2rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--ctp-mantle)',
                    border: '1px solid var(--ctp-surface0)',
                    height: '100%'
                  }}>
                    <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: 700 }}>Coluna da Direita</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ctp-subtext1)', lineHeight: 1.5 }}>
                      Esta é a segunda coluna, demonstrando o comportamento lado a lado do Grid integrado ao Shell. Redimensione ou alterne layouts.
                    </p>
                  </div>
                </Grid.Col>
              </Grid>

              {/* Extra paragraph to show scroll lock */}
              {shellScrollable && (
                <div style={{
                  padding: '2rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--ctp-crust)',
                  fontSize: '0.9rem',
                  color: 'var(--ctp-subtext1)',
                  lineHeight: 1.6
                }}>
                  <h5 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700 }}>Teste de Rolagem Localizada (Overflow Scroll)</h5>
                  <p style={{ margin: '0 0 1rem 0' }}>
                    O contêiner de conteúdo possui rolagem independente. Veja que o cabeçalho e a barra lateral permanecem fixados enquanto você rola este texto longo:
                  </p>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <p key={i} style={{ margin: '0 0 0.75rem 0' }}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec feugiat lectus. Ut et lorem ex. In elementum arcu at lacus rutrum, ut dictum purus dictum. Curabitur vitae sem sed ante hendrerit laoreet. Morbi dictum ligula at nisl pretium pretium. Quisque eget elit ut lorem accumsan dictum sed nec elit.
                    </p>
                  ))}
                </div>
              )}
            </div>
          </Shell.Content>
        </Shell.Main>
      </Shell>
    );
  }

  return (
    <div className="showcase-layout">
      {/* Toast Alert */}
      {toastMessage && <div className="copy-toast">{toastMessage}</div>}

      {/* Mobile Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Navigation */}
      <aside className={`showcase-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo-section">
          <span className="sidebar-logo">🐱</span>
          <div>
            <h1 className="sidebar-title">Catppuccin DS</h1>
            <div className="sidebar-subtitle">Cozy design components</div>
          </div>
        </div>

        {/* Theme Selector inside sidebar */}
        <div className="sidebar-theme-wrapper">
          <div className="theme-selector">
            {(['latte', 'frappe', 'macchiato', 'mocha', 'vercel', 'vercel-light'] as const).map((t) => (
              <button
                key={t}
                className={`theme-btn ${theme === t ? 'active' : ''}`}
                onClick={() => {
                  setTheme(t);
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Navigation categories */}
        <div className="sidebar-nav-group">
          <div className="sidebar-group-title">Inputs & Forms</div>
          <div className="sidebar-nav-list">
            <button
              className={`sidebar-nav-item ${activeComponent === 'button' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('button'); setIsSidebarOpen(false); }}
            >
              🔘 Buttons
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'buttongroup' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('buttongroup'); setIsSidebarOpen(false); }}
            >
              🗂️ Button Groups
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'select' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('select'); setIsSidebarOpen(false); }}
            >
              🔍 Advanced Selects
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'colorpicker' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('colorpicker'); setIsSidebarOpen(false); }}
            >
              🎨 Color Picker
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'form' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('form'); setIsSidebarOpen(false); }}
            >
              ⚡ Dynamic Forms
            </button>
          </div>
        </div>

        <div className="sidebar-nav-group">
          <div className="sidebar-group-title">Layout & Overlays</div>
          <div className="sidebar-nav-list">
            <button
              className={`sidebar-nav-item ${activeComponent === 'tabs' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('tabs'); setIsSidebarOpen(false); }}
            >
              🗂️ Compound Tabs
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'modal' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('modal'); setIsSidebarOpen(false); }}
            >
              📦 Modals & Overlay
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'drawer' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('drawer'); setIsSidebarOpen(false); }}
            >
              🚪 Drawer Panel
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'dropdown' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('dropdown'); setIsSidebarOpen(false); }}
            >
              ▾ Dropdown Portal
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'tooltip' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('tooltip'); setIsSidebarOpen(false); }}
            >
              💬 Tooltip Portal
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'grid' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('grid'); setIsSidebarOpen(false); }}
            >
              📦 Flexbox Grid
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'datepicker' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('datepicker'); setIsSidebarOpen(false); }}
            >
              📅 Date Picker
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'shell' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('shell'); setIsSidebarOpen(false); }}
            >
              💻 Layout Shell
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'sidebar' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('sidebar'); setIsSidebarOpen(false); }}
            >
              🚪 Rich Sidebar
            </button>
          </div>
        </div>

        <div className="sidebar-nav-group">
          <div className="sidebar-group-title">Data & Feedback</div>
          <div className="sidebar-nav-list">
            <button
              className={`sidebar-nav-item ${activeComponent === 'stepper' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('stepper'); setIsSidebarOpen(false); }}
            >
              🚥 Steppers
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'steps' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('steps'); setIsSidebarOpen(false); }}
            >
              📈 Steps & Slider
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'progress' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('progress'); setIsSidebarOpen(false); }}
            >
              📊 Progress & Scroll
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'pagination' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('pagination'); setIsSidebarOpen(false); }}
            >
              📄 Pagination & Limit
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'table' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('table'); setIsSidebarOpen(false); }}
            >
              📊 Data Table
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'card' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('card'); setIsSidebarOpen(false); }}
            >
              🎴 Cards & Tiles
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'icons' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('icons'); setIsSidebarOpen(false); }}
            >
              ✨ Icons Pack
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'badge' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('badge'); setIsSidebarOpen(false); }}
            >
              📇 Badges & Tags
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'accordion' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('accordion'); setIsSidebarOpen(false); }}
            >
              🪗 Accordion & Collapse
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'typography' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('typography'); setIsSidebarOpen(false); }}
            >
              🔤 Typography Helpers
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'texteditor' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('texteditor'); setIsSidebarOpen(false); }}
            >
              ✍️ Text Editor
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'charts' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('charts'); setIsSidebarOpen(false); }}
            >
              📊 Charts
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'skeleton' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('skeleton'); setIsSidebarOpen(false); }}
            >
              💀 Skeleton
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'alert' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('alert'); setIsSidebarOpen(false); }}
            >
              ⚠️ Alert
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'avatar' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('avatar'); setIsSidebarOpen(false); }}
            >
              👤 Avatar
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'breadcrumb' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('breadcrumb'); setIsSidebarOpen(false); }}
            >
              🍞 Breadcrumbs
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'carousel' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('carousel'); setIsSidebarOpen(false); }}
            >
              🎠 Carousel
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'toast' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('toast'); setIsSidebarOpen(false); }}
            >
              🍞 Toast
            </button>
          </div>
        </div>

        <div className="sidebar-nav-group">
          <div className="sidebar-group-title">Pro Features</div>
          <div className="sidebar-nav-list">
            <button
              className={`sidebar-nav-item ${activeComponent === 'pro' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('pro'); setIsSidebarOpen(false); }}
            >
              ⚡ Reorderable Tabs & Table
            </button>
            <button
              className={`sidebar-nav-item ${activeComponent === 'kanban' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('kanban'); setIsSidebarOpen(false); }}
            >
              📋 Kanban Board
            </button>
          </div>
        </div>

        <div className="sidebar-nav-group">
          <div className="sidebar-group-title">Example</div>
          <div className="sidebar-nav-list">
            <button
              className={`sidebar-nav-item ${activeComponent === 'template' ? 'active' : ''}`}
              onClick={() => { setActiveComponent('template'); setIsSidebarOpen(false); }}
            >
              📄 Example Page
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Layout */}
      <main className="showcase-main">
        {/* Mobile Header Bar */}
        <header className="mobile-nav-header">
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            ☰
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>🐱</span>
            <span style={{ fontWeight: 700, color: 'var(--ctp-text)' }}>Catppuccin DS</span>
          </div>
          <div style={{ width: '24px' }} />
        </header>

        <div className="showcase-content">
          {/* Header Area in main content panel */}
          <header className="showcase-header">
            <div>
              <h1 className="header-title" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
                {activeComponent === 'button' && '🔘 Button Component'}
                {activeComponent === 'buttongroup' && '🗂️ Button Group Component'}
                {activeComponent === 'stepper' && '🚥 Stepper Component'}
                {activeComponent === 'modal' && '📦 Modal & Overlay Component'}
                {activeComponent === 'tabs' && '🗂️ Compound Tabs Component'}
                {activeComponent === 'form' && '⚡ Dynamic Forms Component'}
                {activeComponent === 'steps' && '📈 Steps & Slider Component'}
                {activeComponent === 'progress' && '📊 Progress & Scrollbar Component'}
                {activeComponent === 'drawer' && '🚪 Drawer Panel Component'}
                {activeComponent === 'select' && '🔍 Advanced Select Components'}
                {activeComponent === 'colorpicker' && '🎨 Color Picker Component'}
                {activeComponent === 'pagination' && '📄 Pagination & Page Size'}
                {activeComponent === 'table' && '📊 Data Table Dinâmica'}
                {activeComponent === 'card' && '🎴 Cards & Tiles Components'}
                {activeComponent === 'icons' && '✨ Icons Pack'}
                {activeComponent === 'badge' && '📇 Badges & Tags Components'}
                {activeComponent === 'accordion' && '🪗 Accordion & Collapse'}
                {activeComponent === 'dropdown' && '▾ Dropdown Portal Component'}
                {activeComponent === 'tooltip' && '💬 Tooltip Portal Component'}
                {activeComponent === 'grid' && '📦 Flexbox Grid System'}
                {activeComponent === 'datepicker' && '📅 Date Picker Component'}
                {activeComponent === 'shell' && '💻 Layout Shell Component'}
                {activeComponent === 'sidebar' && '🚪 Rich Sidebar Component'}
                {activeComponent === 'typography' && '🔤 Typography Helpers'}
                {activeComponent === 'charts' && '📊 Charts'}
                {activeComponent === 'skeleton' && '💀 Skeleton'}
                {activeComponent === 'alert' && '⚠️ Alert'}
                {activeComponent === 'avatar' && '👤 Avatar'}
                {activeComponent === 'breadcrumb' && '🍞 Breadcrumbs'}
                {activeComponent === 'carousel' && '🎠 Carousel'}
                {activeComponent === 'toast' && '🍞 Toast'}
              </h1>
              <div className="header-subtitle" style={{ fontSize: '0.85rem' }}>
                {activeComponent === 'button' && 'Configure and preview cozy interactive buttons.'}
                {activeComponent === 'buttongroup' && 'Combine multiple buttons in clean unified groups.'}
                {activeComponent === 'stepper' && 'Track progress through sequential multi-step processes.'}
                {activeComponent === 'modal' && 'Accessible overlays with custom layers and stack visualizer.'}
                {activeComponent === 'tabs' && 'Compound tab layouts with flexible orientations and variants.'}
                {activeComponent === 'form' && 'Dynamic schema-driven forms with JSON validation.'}
                {activeComponent === 'steps' && 'Advanced stepper components and interactive sliders.'}
                {activeComponent === 'progress' && 'Beautiful progress indicators and customizable scrollbar accents.'}
                {activeComponent === 'drawer' && 'Off-canvas sliding drawer sheets for side configurations.'}
                {activeComponent === 'select' && 'Searchable multiple options and hierarchical tree dropdown selection.'}
                {activeComponent === 'colorpicker' && 'Choose color values using preset grids or canvas color picking.'}
                {activeComponent === 'pagination' && 'Split database results and manage active records limit per page.'}
                {activeComponent === 'table' && 'Rich grid control featuring sorting, pagination, and API audit logs.'}
                {activeComponent === 'card' && 'Content-rich responsive container tiles with premium interactive hover effects.'}
                {activeComponent === 'icons' && 'Vibrant line-art vector icon collection with hover animations.'}
                {activeComponent === 'badge' && 'Highlight properties and tags with rounded status labels.'}
                {activeComponent === 'accordion' && 'Clean collapsible sections with single or multi-reveal modes.'}
                {activeComponent === 'dropdown' && 'Portal-rendered context menus that float outside overflow constraints.'}
                {activeComponent === 'tooltip' && 'Cozy accessible informational tooltips overlaying on hover/focus.'}
                {activeComponent === 'grid' && 'Bulma-inspired responsive layout grids using standard BEM conventions.'}
                {activeComponent === 'datepicker' && 'Calendar popover via Portal with range selection and Catppuccin accent colors.'}
                {activeComponent === 'shell' && 'Highly flexible application shell layouts supporting fixed/scrolling content and sidebars.'}
                {activeComponent === 'sidebar' && 'BEM-styled compound sidebar with fixed/floated modes, collapse state, and expand-on-hover overlay.'}
                {activeComponent === 'typography' && 'BEM-styled font scales, weights, colors, and beautiful gradient headers.'}
                {activeComponent === 'charts' && 'Beautiful data visualizations fully themed with the Catppuccin flavor palette.'}
                {activeComponent === 'skeleton' && 'Animated loading placeholders for improved perceived performance.'}
                {activeComponent === 'alert' && 'Contextual banner alerts for success, error, warning, and info.'}
                {activeComponent === 'avatar' && 'User profile images with fallback initials and stacked groups.'}
                {activeComponent === 'breadcrumb' && 'Structural navigation for deep page hierarchies.'}
                {activeComponent === 'carousel' && 'Horizontal slider for images, cards, or testimonials.'}
                {activeComponent === 'toast' && 'Temporary notification popups for feedback and actions.'}

              </div>
            </div>

            {/* Collapsible Palette Trigger Button */}
            <button
              type="button"
              className={`palette-toggle-btn ${showColors ? 'expanded' : ''}`}
              onClick={() => setShowColors(!showColors)}
            >
              <span>🎨</span> {showColors ? 'Hide Palette' : 'Show Colors'}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </header>

          {/* Collapsible Palette Section */}
          <div className={`palette-collapsible ${showColors ? 'expanded' : ''}`}>
            <div className="palette-grid" style={{ marginBottom: '1rem' }}>
              {colors.map((c) => {
                const hex = c.hexCodes[theme];
                return (
                  <div
                    key={c.name}
                    className="color-card"
                    onClick={() => copyToClipboard(hex, `${c.name} hex`)}
                    title="Click to copy color code"
                  >
                    <div
                      className="color-chip"
                      style={{ backgroundColor: `var(${c.variable})` }}
                    />
                    <span className="color-name">{c.name}</span>
                    <span className="color-hex">{hex}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BUTTON SHOWCASE TAB */}
          {activeComponent === 'button' && (
            <>
              <section>
                <h2 className="section-title">
                  <span>⚡</span> Button Playground
                </h2>
                <div className="playground-section">
                  {/* Settings Panel */}
                  <div className="playground-card">
                    <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Component Configuration</h3>

                    <div className="control-grid">
                      <div className="control-group control-group--full">
                        <label htmlFor="btn-label">Button Label</label>
                        <input
                          id="btn-label"
                          type="text"
                          value={buttonText}
                          onChange={(e) => setButtonText(e.target.value)}
                        />
                      </div>

                      <div className="control-group">
                        <label htmlFor="btn-variant">Variant</label>
                        <select
                          id="btn-variant"
                          value={btnVariant}
                          onChange={(e) => setBtnVariant(e.target.value as ButtonVariant)}
                        >
                          <option value="filled">Filled</option>
                          <option value="tonal">Tonal</option>
                          <option value="outline">Outline</option>
                          <option value="ghost">Ghost</option>
                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="btn-color">Accent Color</label>
                        <select
                          id="btn-color"
                          value={btnColor}
                          onChange={(e) => setBtnColor(e.target.value as ButtonColor)}
                        >
                          {colors.map((c) => (
                            <option key={c.name} value={c.name.toLowerCase()}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="btn-size">Size</label>
                        <select
                          id="btn-size"
                          value={btnSize}
                          onChange={(e) => setBtnSize(e.target.value as ButtonSize)}
                        >
                          <option value="sm">Small (sm)</option>
                          <option value="md">Medium (md)</option>
                          <option value="lg">Large (lg)</option>
                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="btn-shape">Shape</label>
                        <select
                          id="btn-shape"
                          value={btnShape}
                          onChange={(e) => setBtnShape(e.target.value as ButtonShape)}
                        >
                          <option value="square">Square</option>
                          <option value="rounded">Rounded</option>
                          <option value="pill">Pill</option>

                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label>States & Accessories</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={btnLeftIcon}
                            onChange={(e) => setBtnLeftIcon(e.target.checked)}
                          />
                          Left Icon
                        </label>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={btnRightIcon}
                            onChange={(e) => setBtnRightIcon(e.target.checked)}
                          />
                          Right Icon
                        </label>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={btnIsLoading}
                            onChange={(e) => setBtnIsLoading(e.target.checked)}
                          />
                          Loading State
                        </label>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={btnDisabled}
                            onChange={(e) => setBtnDisabled(e.target.checked)}
                          />
                          Disabled
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Render and Code Panel */}
                  <div className="playground-card playground-card--preview">
                    <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Component Preview</h3>

                    <div className="preview-canvas">
                      <Button
                        variant={btnVariant}
                        color={btnColor}
                        size={btnSize}
                        shape={btnShape}
                        isLoading={btnIsLoading}
                        disabled={btnDisabled}
                        leftIcon={btnLeftIcon ? <HeartFillIcon /> : undefined}
                        rightIcon={btnRightIcon ? <ArrowIcon /> : undefined}
                      >
                        {buttonText}
                      </Button>
                    </div>

                    <div>
                      <div className="tabs-header">
                        {(['react', 'vue', 'angular'] as const).map((tab) => (
                          <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </button>
                        ))}
                      </div>

                      <div className="code-container">
                        <button
                          className="code-copy-btn"
                          onClick={() => copyToClipboard(getRawTextCode(), `${activeTab} snippet`)}
                        >
                          Copy Code
                        </button>
                        <pre className="code-block">
                          <code
                            dangerouslySetInnerHTML={{
                              __html: activeTab === 'react'
                                ? getReactBtnCode()
                                : activeTab === 'vue'
                                  ? getVueBtnCode()
                                  : getAngularBtnCode()
                            }}
                          />
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Button Gallery */}
              <section style={{ marginBottom: '3rem' }}>
                <h2 className="section-title">
                  <span>📚</span> Preconfigured Gallery
                </h2>
                <div className="gallery-grid">
                  {galleryItems.map((item) => (
                    <div
                      key={item.title}
                      className="gallery-card"
                      onClick={() => handleGalleryClick(item)}
                    >
                      <span className="gallery-card-title">{item.title}</span>
                      <Button
                        variant={item.variant}
                        color={item.color}
                        size={item.size}
                        shape={item.shape}
                        isLoading={item.isLoading}
                        disabled={item.disabled}
                        leftIcon={item.leftIcon ? <HeartFillIcon /> : undefined}
                        rightIcon={item.rightIcon ? <ArrowIcon /> : undefined}
                      >
                        {item.text}
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* BUTTON GROUP SHOWCASE TAB */}
          {activeComponent === 'buttongroup' && (
            <>
              <section>
                <h2 className="section-title">
                  <span>🗂️</span> Button Group Playground
                </h2>
                <div className="playground-section">
                  {/* Settings Panel */}
                  <div className="playground-card">
                    <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Group Configuration</h3>

                    <div className="control-grid">
                      <div className="control-group">
                        <label htmlFor="group-orientation">Orientation</label>
                        <select
                          id="group-orientation"
                          value={groupOrientation}
                          onChange={(e) => setGroupOrientation(e.target.value as ButtonGroupOrientation)}
                        >
                          <option value="horizontal">Horizontal</option>
                          <option value="vertical">Vertical</option>
                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="group-count">Number of Buttons</label>
                        <select
                          id="group-count"
                          value={groupCount}
                          onChange={(e) => setGroupCount(Number(e.target.value))}
                        >
                          <option value={2}>2 Buttons</option>
                          <option value={3}>3 Buttons</option>
                          <option value={4}>4 Buttons</option>
                          <option value={5}>5 Buttons</option>
                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="group-variant">Buttons Variant</label>
                        <select
                          id="group-variant"
                          value={groupVariant}
                          onChange={(e) => setGroupVariant(e.target.value as ButtonVariant)}
                        >
                          <option value="filled">Filled</option>
                          <option value="tonal">Tonal</option>
                          <option value="outline">Outline</option>
                          <option value="ghost">Ghost</option>
                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="group-color">Accent Color</label>
                        <select
                          id="group-color"
                          value={groupColor}
                          onChange={(e) => setGroupColor(e.target.value as ButtonColor)}
                        >
                          {colors.map((c) => (
                            <option key={c.name} value={c.name.toLowerCase()}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="group-shape">Buttons Shape</label>
                        <select
                          id="group-shape"
                          value={groupShape}
                          onChange={(e) => setGroupShape(e.target.value as ButtonShape)}
                        >
                          <option value="square">Square</option>
                          <option value="rounded">Rounded</option>
                          <option value="pill">Pill</option>

                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="group-layout-variant">Group Style</label>
                        <select
                          id="group-layout-variant"
                          value={groupLayoutVariant}
                          onChange={(e) => setGroupLayoutVariant(e.target.value as ButtonGroupVariant)}
                        >
                          <option value="filled">Filled</option>
                          <option value="outline">Outline</option>
                          <option value="ghost">Ghost</option>
                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="group-selection-mode">Selection Mode</label>
                        <select
                          id="group-selection-mode"
                          value={groupSelectionMode}
                          onChange={(e) => setGroupSelectionMode(e.target.value as ButtonGroupSelectionMode)}
                        >
                          <option value="none">None (Standard Group)</option>
                          <option value="single">Single Select (Radio Group)</option>
                          <option value="multiple">Multiple Select (Checkbox Group)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Preview and Code Panel */}
                  <div className="playground-card playground-card--preview">
                    <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Group Preview</h3>

                    <div className="preview-canvas" style={{ padding: '2.5rem', minHeight: '220px', flexDirection: 'column', gap: '1.5rem' }}>
                      <ButtonGroup
                        variant={groupLayoutVariant}
                        shape={groupShape}
                        orientation={groupOrientation}
                        selectionMode={groupSelectionMode}
                        value={groupSelectionMode === 'single' ? groupSingleValue : groupMultiValue}
                        onChange={(val) => {
                          if (groupSelectionMode === 'single') {
                            setGroupSingleValue(val);
                          } else {
                            setGroupMultiValue(val);
                          }
                        }}
                      >
                        {Array.from({ length: groupCount }).map((_, index) => (
                          <ButtonGroupItem
                            key={index}
                            value={`opt${index + 1}`}
                            variant={groupVariant}
                            color={groupColor}
                            shape={groupShape}
                          >
                            Option {index + 1}
                          </ButtonGroupItem>
                        ))}
                      </ButtonGroup>

                      {groupSelectionMode !== 'none' && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--ctp-subtext0)', fontFamily: 'monospace' }}>
                          Selected Value: {groupSelectionMode === 'single' ? groupSingleValue : JSON.stringify(groupMultiValue)}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="tabs-header">
                        {(['react', 'vue', 'angular'] as const).map((tab) => (
                          <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </button>
                        ))}
                      </div>

                      <div className="code-container">
                        <button
                          className="code-copy-btn"
                          onClick={() => copyToClipboard(getRawTextCode(), `${activeTab} snippet`)}
                        >
                          Copy Code
                        </button>
                        <pre className="code-block">
                          <code
                            dangerouslySetInnerHTML={{
                              __html: activeTab === 'react'
                                ? getReactButtonGroupCode()
                                : activeTab === 'vue'
                                  ? getVueButtonGroupCode()
                                  : getAngularButtonGroupCode()
                            }}
                          />
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* STEPPER SHOWCASE TAB */}
          {activeComponent === 'stepper' && (
            <section>
              <h2 className="section-title">
                <span>🚥</span> Stepper Playground
              </h2>
              <div className="playground-section">
                {/* Stepper Configuration */}
                {/* Stepper Configuration */}
                <div className="playground-card" style={{ gap: '1.2rem' }}>
                  <h3 style={{ margin: '0', fontSize: '1.2rem', color: `var(--ctp-${stepColor})` }}>Stepper Configuration</h3>

                  <div className="control-grid">
                    <div className="control-group">
                      <label htmlFor="step-orientation">Orientation</label>
                      <select
                        id="step-orientation"
                        value={stepOrientation}
                        onChange={(e) => setStepOrientation(e.target.value as StepperOrientation)}
                      >
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                      </select>
                    </div>

                    <div className="control-group">
                      <label htmlFor="step-variant">Node Style</label>
                      <select
                        id="step-variant"
                        value={stepVariant}
                        onChange={(e) => setStepVariant(e.target.value as StepperVariant)}
                      >
                        <option value="default">Numeric Numbers</option>
                        <option value="dots">Minimal Dots</option>
                        <option value="icon">Node Icons</option>
                        <option value="labeled-icon">Labeled Icons</option>
                      </select>
                    </div>

                    <div className="control-group">
                      <label htmlFor="step-color">Active Accent Color</label>
                      <select
                        id="step-color"
                        value={stepColor}
                        onChange={(e) => setStepColor(e.target.value as ButtonColor)}
                      >
                        {colors.map((c) => (
                          <option key={c.name} value={c.name.toLowerCase()}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="control-group">
                      <label htmlFor="step-slider">Current Step: {currentStep + 1}</label>
                      <input
                        id="step-slider"
                        type="range"
                        min="0"
                        max="3"
                        value={currentStep}
                        onChange={(e) => setCurrentStep(Number(e.target.value))}
                        style={{ cursor: 'pointer', accentColor: `var(--ctp-${stepColor})` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Preview and Code Snippets */}
                <div className="playground-card playground-card--preview">
                  <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Component Preview</h3>

                  <div className="preview-canvas" style={{ padding: '2rem', minHeight: '340px', flexDirection: 'column', gap: '1.5rem', justifyContent: 'space-between' }}>
                    <Stepper
                      steps={demoSteps}
                      currentStep={currentStep}
                      orientation={stepOrientation}
                      variant={stepVariant}
                      color={stepColor}
                    />

                    {/* Animated Simulated Screen Content */}
                    <div className="stepper-container" style={{ width: '100%' }}>
                      <div
                        key={currentStep}
                        className={`playground-card ${slideClass}`}
                        style={{
                          margin: 0,
                          minHeight: '120px',
                          justifyContent: 'center',
                          backgroundColor: 'var(--ctp-crust)',
                          borderStyle: 'dashed',
                          padding: '1.25rem',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                      >
                        <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: `var(--ctp-${stepColor})` }}>
                          {stepContents[currentStep].title}
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)', lineHeight: '1.4' }}>
                          {stepContents[currentStep].details}
                        </p>
                      </div>
                    </div>

                    {/* Stepper Navigation Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', width: '100%' }}>
                      <Button
                        variant="outline"
                        color={stepColor}
                        disabled={currentStep === 0}
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        style={{ flex: 1 }}
                      >
                        Back
                      </Button>
                      <Button
                        variant="filled"
                        color={stepColor}
                        disabled={currentStep === 3}
                        onClick={() => setCurrentStep(prev => prev + 1)}
                        style={{ flex: 1 }}
                      >
                        Next Step
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="tabs-header">
                      <button className="tab-btn active">React Code</button>
                    </div>

                    <div className="code-container">
                      <pre className="code-block">
                        <code>{`// App.tsx\n<Stepper\n  steps={demoSteps}\n  currentStep={${currentStep}}\n  orientation="${stepOrientation}"\n  variant="${stepVariant}"\n  color="${stepColor}"\n/>`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* MODALS & OVERLAY SHOWCASE TAB */}
          {activeComponent === 'modal' && (
            <section>
              <h2 className="section-title">
                <span>📦</span> Overlays & Modals Stacking
              </h2>
              <div className="playground-section">
                {/* Modal Activation Dashboard */}
                <div className="playground-card" style={{ gap: '1.2rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Overlay Control Board</h3>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    <Button variant="filled" color="blue" onClick={() => setIsOpenSm(true)}>
                      Open Small Modal
                    </Button>
                    <Button variant="filled" color="mauve" onClick={() => setIsOpenMd(true)}>
                      Open Medium Modal
                    </Button>
                    <Button variant="filled" color="lavender" onClick={() => setIsOpenLg(true)}>
                      Open Large Modal
                    </Button>
                    <Button variant="tonal" color="pink" onClick={() => setCustomOverlayOpen(true)}>
                      Open Custom Overlay
                    </Button>
                  </div>

                  <div style={{ borderTop: '1px solid var(--ctp-surface0)', paddingTop: '1.2rem', marginTop: '0.5rem' }}>
                    <h4 style={{ margin: '0 0 12px 0' }}>Multi-level Modals Stacking</h4>
                    <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--ctp-subtext1)', lineHeight: '1.4' }}>
                      Open nested overlays to observe z-index stacking. Each subsequent overlay increments its z-index relative to the parent.
                    </p>
                    <Button variant="filled" color="red" onClick={() => setIsOpenNested1(true)}>
                      Launch Nesting Sequence
                    </Button>
                  </div>

                  {/* Stacking stack visualizer */}
                  <div className="stacking-visualizer">
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Active Overlay Stack Visualizer</h3>
                    {openStack.length === 0 ? (
                      <p style={{ color: 'var(--ctp-subtext0)', margin: 0, fontSize: '0.9rem', fontStyle: 'italic' }}>
                        No active overlays open. Click any buttons above to push overlays onto the stack.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '8px' }}>
                        {openStack.map((item, index) => (
                          <div
                            key={item.name}
                            className="stack-item-indicator"
                            style={{
                              backgroundColor: 'var(--ctp-surface0)',
                              borderColor: 'var(--ctp-mauve)',
                              color: 'var(--ctp-text)',
                              borderLeftWidth: '4px',
                              borderLeftStyle: 'solid'
                            }}
                          >
                            <span>{item.name} ({item.size})</span>
                            <span className="badge-zindex">z-index: {1001 + index}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Options Configuration */}
                <div className="playground-card" style={{ gap: '1.2rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Modal Attribute Customizer</h3>

                  <div className="control-group">
                    <label htmlFor="modal-title-input">Header Title Text</label>
                    <input
                      id="modal-title-input"
                      type="text"
                      value={modalTitle}
                      onChange={(e) => setModalTitle(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={modalHasCloseButton}
                        onChange={(e) => setModalHasCloseButton(e.target.checked)}
                      />
                      Show Close Button in Header
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={modalCloseOnOverlay}
                        onChange={(e) => setModalCloseOnOverlay(e.target.checked)}
                      />
                      Dismiss on Backdrop / Overlay Click
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={modalCloseOnEsc}
                        onChange={(e) => setModalCloseOnEsc(e.target.checked)}
                      />
                      Dismiss on ESC Key Press
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={modalHasFooter}
                        onChange={(e) => setModalHasFooter(e.target.checked)}
                      />
                      Include Standard Action Footer
                    </label>
                  </div>
                </div>
              </div>

              {/* RENDER MODAL INSTANCES */}

              {/* 1. Small Modal */}
              <Modal
                isOpen={isOpenSm}
                onClose={() => setIsOpenSm(false)}
                size="sm"
                title={modalTitle || undefined}
                showCloseButton={modalHasCloseButton}
                closeOnOverlayClick={modalCloseOnOverlay}
                closeOnEsc={modalCloseOnEsc}
                footer={modalHasFooter ? (
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
                    <Button variant="ghost" color="lavender" onClick={() => setIsOpenSm(false)}>Cancel</Button>
                    <Button variant="filled" color="mauve" onClick={() => setIsOpenSm(false)}>Save Changes</Button>
                  </div>
                ) : undefined}
              >
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                  This is a <strong>Small (sm)</strong> Catppuccin modal. Small modals are optimized for brief confirmation dialogs, quick warnings, or system notifications.
                </p>
              </Modal>

              {/* 2. Medium Modal */}
              <Modal
                isOpen={isOpenMd}
                onClose={() => setIsOpenMd(false)}
                size="md"
                title={modalTitle || undefined}
                showCloseButton={modalHasCloseButton}
                closeOnOverlayClick={modalCloseOnOverlay}
                closeOnEsc={modalCloseOnEsc}
                footer={modalHasFooter ? (
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
                    <Button variant="ghost" color="lavender" onClick={() => setIsOpenMd(false)}>Cancel</Button>
                    <Button variant="filled" color="mauve" onClick={() => setIsOpenMd(false)}>Proceed</Button>
                  </div>
                ) : undefined}
              >
                <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  This is a <strong>Medium (md)</strong> standard modal. Great for configuration dialogs, small forms, or details displays.
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Supports click overlay and keyboard escape hooks.
                </p>
              </Modal>

              {/* 3. Large Modal */}
              <Modal
                isOpen={isOpenLg}
                onClose={() => setIsOpenLg(false)}
                size="lg"
                title={modalTitle || undefined}
                showCloseButton={modalHasCloseButton}
                closeOnOverlayClick={modalCloseOnOverlay}
                closeOnEsc={modalCloseOnEsc}
                footer={modalHasFooter ? (
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
                    <Button variant="ghost" color="lavender" onClick={() => setIsOpenLg(false)}>Close</Button>
                    <Button variant="filled" color="mauve" onClick={() => setIsOpenLg(false)}>Save Changes</Button>
                  </div>
                ) : undefined}
              >
                <h4 style={{ margin: '0 0 10px 0' }}>Spacious Canvas</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Large (lg) modals offer a wider viewport to present complex structures: charts, table lists, logs, or multi-step wizard layouts.
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Try opening another overlay without closing this one to test the active layering!
                </p>
              </Modal>

              {/* 4. Nesting Sequence Modals */}

              {/* Layer 1: Large Modal */}
              <Modal
                isOpen={isOpenNested1}
                onClose={() => setIsOpenNested1(false)}
                size="lg"
                title="Layer 1: Stack Base"
                footer={
                  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <Button variant="ghost" color="lavender" onClick={() => setIsOpenNested1(false)}>Close</Button>
                  </div>
                }
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ margin: 0, lineHeight: 1.5 }}>
                    You have initialized the stacking hierarchy. Current overlay count is <strong>1</strong>.
                  </p>
                  <div style={{ backgroundColor: 'var(--ctp-crust)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--ctp-surface0)' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--ctp-subtext0)' }}>Active Overlay Stack:</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: 'var(--ctp-surface0)', borderRadius: '4px', fontSize: '0.82rem' }}>
                        <span>Layer 1 (This Modal)</span>
                        <span style={{ fontFamily: 'monospace', color: 'var(--ctp-mauve)' }}>z-index: 1001</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="filled" color="mauve" onClick={() => setIsOpenNested2(true)}>
                    Push Layer 2 Modal
                  </Button>
                </div>
              </Modal>

              {/* Layer 2: Medium Modal */}
              <Modal
                isOpen={isOpenNested2}
                onClose={() => setIsOpenNested2(false)}
                size="md"
                title="Layer 2: Second Story"
                footer={
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
                    <Button variant="ghost" color="lavender" onClick={() => setIsOpenNested2(false)}>Go Back</Button>
                    <Button variant="filled" color="red" onClick={() => { setIsOpenNested2(false); setIsOpenNested1(false); }}>Close All</Button>
                  </div>
                }
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ margin: 0, lineHeight: 1.5 }}>
                    Nice! This overlay rests directly above Layer 1. Note how the z-index auto-stacks.
                  </p>
                  <div style={{ backgroundColor: 'var(--ctp-crust)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--ctp-surface0)' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--ctp-subtext0)' }}>Active Overlay Stack:</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: 'var(--ctp-surface0)', borderRadius: '4px', fontSize: '0.82rem' }}>
                        <span>Layer 2 (This Modal)</span>
                        <span style={{ fontFamily: 'monospace', color: 'var(--ctp-mauve)' }}>z-index: 1002</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: 'var(--ctp-surface0)', borderRadius: '4px', fontSize: '0.82rem', opacity: 0.6 }}>
                        <span>Layer 1 Modal</span>
                        <span style={{ fontFamily: 'monospace' }}>z-index: 1001</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="filled" color="blue" onClick={() => setIsOpenNested3(true)}>
                    Push Layer 3 Modal
                  </Button>
                </div>
              </Modal>

              {/* Layer 3: Small Modal */}
              <Modal
                isOpen={isOpenNested3}
                onClose={() => setIsOpenNested3(false)}
                size="sm"
                title="Layer 3: Top Pinnacle"
                footer={
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
                    <Button variant="ghost" color="lavender" onClick={() => setIsOpenNested3(false)}>Close Layer 3</Button>
                    <Button variant="filled" color="red" onClick={() => { setIsOpenNested3(false); setIsOpenNested2(false); setIsOpenNested1(false); }}>Close All</Button>
                  </div>
                }
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ margin: 0, lineHeight: 1.5 }}>
                    You have reached the maximum nest level in this demonstration!
                  </p>
                  <div style={{ backgroundColor: 'var(--ctp-crust)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--ctp-surface0)' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--ctp-subtext0)' }}>Active Overlay Stack:</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: 'var(--ctp-surface0)', borderRadius: '4px', fontSize: '0.82rem' }}>
                        <span>Layer 3 (This Modal)</span>
                        <span style={{ fontFamily: 'monospace', color: 'var(--ctp-mauve)' }}>z-index: 1003</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: 'var(--ctp-surface0)', borderRadius: '4px', fontSize: '0.82rem', opacity: 0.6 }}>
                        <span>Layer 2 Modal</span>
                        <span style={{ fontFamily: 'monospace' }}>z-index: 1002</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: 'var(--ctp-surface0)', borderRadius: '4px', fontSize: '0.82rem', opacity: 0.4 }}>
                        <span>Layer 1 Modal</span>
                        <span style={{ fontFamily: 'monospace' }}>z-index: 1001</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>

              {/* 5. Custom Raw Overlay */}
              <Overlay isOpen={customOverlayOpen} onClose={() => setCustomOverlayOpen(false)}>
                <div className="custom-overlay-card">
                  <h3 style={{ margin: '0 0 10px 0', color: 'var(--ctp-pink)' }}>✨ Raw Custom Overlay ✨</h3>
                  <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--ctp-subtext1)' }}>
                    This card is rendered directly within the raw <code>Overlay</code> portal, skipping the preconfigured <code>Modal</code> container entirely.
                  </p>
                  <p style={{ margin: '0 0 24px 0', fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--ctp-subtext1)' }}>
                    Excellent for building non-standard overlay layouts: fullscreen main menus, custom widgets, drawer systems, or dialogs.
                  </p>
                  <Button variant="filled" color="pink" onClick={() => setCustomOverlayOpen(false)}>
                    Dismiss Overlay
                  </Button>
                </div>
              </Overlay>
            </section>
          )}

          {/* COMPOUND TABS SHOWCASE TAB */}
          {activeComponent === 'tabs' && (
            <section>
              <h2 className="section-title">
                <span>🗂️</span> Compound Tabs Layouts
              </h2>

              <div className="playground-section">
                {/* Tabs config controls */}
                <div className="playground-card" style={{ gap: '1.2rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Tabs Styling Settings</h3>

                  <div className="control-grid">
                    <div className="control-group">
                      <label htmlFor="tabs-variant-select">Visual Style</label>
                      <select
                        id="tabs-variant-select"
                        value={tabsVariant}
                        onChange={(e) => setTabsVariant(e.target.value as TabsVariant)}
                      >
                        <option value="default">Default Panel</option>
                        <option value="underline">Underline Accent</option>
                        <option value="pills">Pills Box</option>
                        <option value="segmented">Segmented Block</option>
                      </select>
                    </div>

                    <div className="control-group">
                      <label htmlFor="tabs-color-select">Color Accent</label>
                      <select
                        id="tabs-color-select"
                        value={tabsColor}
                        onChange={(e) => setTabsColor(e.target.value as ButtonColor)}
                      >
                        {colors.map((c) => (
                          <option key={c.name} value={c.name.toLowerCase()}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="control-group">
                      <label htmlFor="tabs-size-select">Component Size</label>
                      <select
                        id="tabs-size-select"
                        value={tabsSize}
                        onChange={(e) => setTabsSize(e.target.value as any)}
                      >
                        <option value="sm">Small (sm)</option>
                        <option value="md">Medium (md)</option>
                        <option value="lg">Large (lg)</option>
                      </select>
                    </div>

                    <div className="control-group">
                      <label htmlFor="tabs-orient-select">Orientation</label>
                      <select
                        id="tabs-orient-select"
                        value={tabsOrientation}
                        onChange={(e) => setTabsOrientation(e.target.value as TabsOrientation)}
                      >
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Live Tabs Render Preview */}
                <div className="playground-card playground-card--preview">
                  <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Component Preview</h3>

                  <div className="preview-canvas" style={{ padding: '2rem', minHeight: '260px', alignItems: 'stretch', justifyContent: 'stretch' }}>
                    <Tabs
                      value={tabsActiveVal}
                      onValueChange={setTabsActiveVal}
                      variant={tabsVariant}
                      color={tabsColor}
                      size={tabsSize}
                      orientation={tabsOrientation}
                      style={{ width: '100%', gap: '16px' }}
                    >
                      <TabsList>
                        <TabsTrigger value="general">⚙️ General</TabsTrigger>
                        <TabsTrigger value="themes">🎨 Themes</TabsTrigger>
                        <TabsTrigger value="advanced">🚀 Advanced</TabsTrigger>
                      </TabsList>

                      <div style={{
                        padding: '1.2rem',
                        flexGrow: 1,
                        backgroundColor: 'var(--ctp-mantle)',
                        borderRadius: '12px',
                        border: '1px solid var(--ctp-surface0)',
                        minHeight: '120px'
                      }}>
                        <TabsContent value="general">
                          <h4 style={{ margin: '0 0 8px 0', color: `var(--ctp-${tabsColor})` }}>General Settings</h4>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)', lineHeight: '1.4' }}>
                            Configure default behaviors, workspace paths, and automatic backup routines. Optimization triggers run periodically.
                          </p>
                        </TabsContent>

                        <TabsContent value="themes">
                          <h4 style={{ margin: '0 0 8px 0', color: `var(--ctp-${tabsColor})` }}>Theme Selector</h4>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)', lineHeight: '1.4' }}>
                            Swap active palettes between light and dark variants. Choose dynamic HSL variables matching Catppuccin flavors.
                          </p>
                        </TabsContent>

                        <TabsContent value="advanced">
                          <h4 style={{ margin: '0 0 8px 0', color: `var(--ctp-${tabsColor})` }}>Advanced Options</h4>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)', lineHeight: '1.4' }}>
                            Inspect background worker threads, allocate memory sizes, and enable experimental hardware CSS transitions.
                          </p>
                        </TabsContent>
                      </div>
                    </Tabs>
                  </div>

                  <div>
                    <pre className="code-block" style={{ fontSize: '0.8rem' }}>
                      <code>{`// React compound Tabs usage\n<Tabs value="${tabsActiveVal}" variant="${tabsVariant}" color="${tabsColor}" size="${tabsSize}" orientation="${tabsOrientation}">\n  <TabsList>\n    <TabsTrigger value="general">⚙️ General</TabsTrigger>\n    <TabsTrigger value="themes">🎨 Themes</TabsTrigger>\n    <TabsTrigger value="advanced">🚀 Advanced</TabsTrigger>\n  </TabsList>\n  <TabsContent value="general">...</TabsContent>\n</Tabs>`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* PRO FEATURES */}
          {activeComponent === 'pro' && (
            <section>
              <h2 className="section-title">
                <span>⚡</span> Pro: Reorderable Tabs & Table
              </h2>

              <div className="playground-section">
                <div className="playground-card playground-card--preview">
                  <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>
                    Drag to reorder tabs
                  </h3>

                  <div className="preview-canvas" style={{ padding: '2rem', minHeight: '260px', alignItems: 'stretch', justifyContent: 'stretch' }}>
                    <DragDropProvider apiKey="dev">
                      <ReorderableTabs
                        defaultValue="projects"
                        color="mauve"
                        variant="pills"
                        onOrderChange={(newOrder) => console.log('New tab order:', newOrder)}
                      >
                        <ReorderableTabs.List>
                          <ReorderableTabs.Trigger value="projects">
                            📁 Projects
                          </ReorderableTabs.Trigger>
                          <ReorderableTabs.Trigger value="settings">
                            ⚙️ Settings
                          </ReorderableTabs.Trigger>
                          <ReorderableTabs.Trigger value="activity">
                            📊 Activity
                          </ReorderableTabs.Trigger>
                          <ReorderableTabs.Trigger value="team">
                            👥 Team
                          </ReorderableTabs.Trigger>
                        </ReorderableTabs.List>

                        <div style={{
                          padding: '1.2rem',
                          flexGrow: 1,
                          backgroundColor: 'var(--ctp-mantle)',
                          borderRadius: '12px',
                          border: '1px solid var(--ctp-surface0)',
                          minHeight: '120px'
                        }}>
                          <ReorderableTabs.Content value="projects">
                            <h4 style={{ margin: '0 0 8px 0', color: 'var(--ctp-mauve)' }}>Projects</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)' }}>
                              Drag the tab handles to reorder your workspace projects.
                            </p>
                          </ReorderableTabs.Content>
                          <ReorderableTabs.Content value="settings">
                            <h4 style={{ margin: '0 0 8px 0', color: 'var(--ctp-mauve)' }}>Settings</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)' }}>
                              Pro feature: reorder tabs by dragging them.
                            </p>
                          </ReorderableTabs.Content>
                          <ReorderableTabs.Content value="activity">
                            <h4 style={{ margin: '0 0 8px 0', color: 'var(--ctp-mauve)' }}>Activity</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)' }}>
                              Monitor recent activity across your projects.
                            </p>
                          </ReorderableTabs.Content>
                          <ReorderableTabs.Content value="team">
                            <h4 style={{ margin: '0 0 8px 0', color: 'var(--ctp-mauve)' }}>Team</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)' }}>
                              Manage team members and permissions.
                            </p>
                          </ReorderableTabs.Content>
                        </div>
                      </ReorderableTabs>
                    </DragDropProvider>
                  </div>

                  <div>
                    <pre className="code-block" style={{ fontSize: '0.8rem' }}>
                      <code>{`// Pro: draggable reorderable tabs
import { DragDropProvider, ReorderableTabs } from '@mocha-ds/react-pro';

<DragDropProvider apiKey="sk_live_your_key">
  <ReorderableTabs defaultValue="projects" color="mauve" variant="pills">
    <ReorderableTabs.List>
      <ReorderableTabs.Trigger value="projects">📁 Projects</ReorderableTabs.Trigger>
      <ReorderableTabs.Trigger value="settings">⚙️ Settings</ReorderableTabs.Trigger>
    </ReorderableTabs.List>
    <ReorderableTabs.Content value="projects">...</ReorderableTabs.Content>
    <ReorderableTabs.Content value="settings">...</ReorderableTabs.Content>
  </ReorderableTabs>
</DragDropProvider>`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <hr style={{ margin: '2.5rem 0', border: 'none', borderTop: '1px solid var(--ctp-surface1)' }} />

              <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>
                Reorderable Table (column reorder, row reorder, column resize)
              </h3>

              <div className="playground-section">
                <div className="playground-card playground-card--preview">
                  <div className="preview-canvas" style={{ padding: '1.5rem', minHeight: '320px', alignItems: 'stretch', justifyContent: 'stretch' }}>
                    <DragDropProvider apiKey="dev">
                      <ReorderableTable<Employee>
                        data={proTableData}
                        columns={proTableColumns}
                        rowKey={(r) => r.id}
                        onRowOrderChange={(newData) => setProTableData(newData)}
                        onColumnOrderChange={(newCols) => setProTableColumns(newCols)}
                        onColumnResize={(key, w) => setProTableColumnWidths((prev) => ({ ...prev, [key]: w }))}
                        columnWidths={proTableColumnWidths}
                        sortField={proSortField}
                        sortOrder={proSortOrder}
                        onSort={(field, order) => { setProSortField(field); setProSortOrder(order); }}
                        selectedRowIds={proSelectedIds}
                        onSelectionChange={setProSelectedIds}
                        size="md"
                        color="mauve"
                      />
                    </DragDropProvider>
                  </div>

                  <div>
                    <pre className="code-block" style={{ fontSize: '0.8rem' }}>
                      <code>{`// Pro: draggable reorderable table
import { DragDropProvider, ReorderableTable } from '@mocha-ds/react-pro';

<DragDropProvider apiKey="sk_live_your_key">
  <ReorderableTable
    data={data}
    columns={columns}
    rowKey={(r) => r.id}
    onRowOrderChange={(newData) => setData(newData)}
    onColumnOrderChange={(newCols) => setColumns(newCols)}
    onColumnResize={(key, w) => setWidths(prev => ({...prev, [key]: w}))}
    columnWidths={widths}
    sortField={sortField}
    sortOrder={sortOrder}
    onSort={(field, order) => setSort(field, order)}
    selectedRowIds={selectedIds}
    onSelectionChange={setSelectedIds}
  />
</DragDropProvider>`}</code>
                    </pre>
                  </div>
                </div>
              </div>

            </section>
          )}

          {/* KANBAN BOARD SHOWCASE TAB */}
          {activeComponent === 'kanban' && (
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 className="section-title" style={{ margin: 0 }}>
                  <span>📋</span> Pro: Quadro Kanban Reordenável (Kanban Board)
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--ctp-subtext0)' }}>Cor Temática:</span>
                  <Select
                    value={kanbanThemeColor}
                    onChange={(e) => setKanbanThemeColor(e.target.value)}
                    size="sm"
                    color="mauve"
                    style={{ minWidth: '120px' }}
                  >
                    <option value="rosewater">Rosewater</option>
                    <option value="flamingo">Flamingo</option>
                    <option value="pink">Pink</option>
                    <option value="mauve">Mauve</option>
                    <option value="red">Red</option>
                    <option value="maroon">Maroon</option>
                    <option value="peach">Peach</option>
                    <option value="yellow">Yellow</option>
                    <option value="green">Green</option>
                    <option value="teal">Teal</option>
                    <option value="sky">Sky</option>
                    <option value="sapphire">Sapphire</option>
                    <option value="blue">Blue</option>
                    <option value="lavender">Lavender</option>
                  </Select>
                </div>
              </div>

              {/* Add New Task Card Form */}
              <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid var(--ctp-surface0)' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: 'var(--ctp-subtext1)' }}>🆕 Adicionar Novo Cartão de Tarefa</h4>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 200px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ctp-subtext0)' }}>Título da Tarefa</label>
                    <Input
                      type="text"
                      placeholder="e.g. Implementar testes unitários"
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      size="sm"
                      color="mauve"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '2 1 300px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ctp-subtext0)' }}>Descrição da Tarefa</label>
                    <Input
                      type="text"
                      placeholder="e.g. Cobertura de testes nos fluxos drag-and-drop..."
                      value={newCardDesc}
                      onChange={(e) => setNewCardDesc(e.target.value)}
                      size="sm"
                      color="mauve"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 150px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ctp-subtext0)' }}>Coluna Inicial</label>
                    <Select
                      value={newCardColumn}
                      onChange={(e) => setNewCardColumn(e.target.value)}
                      size="sm"
                      color="mauve"
                    >
                      {kanbanColumns.map(col => (
                        <option key={col.id} value={col.id}>{col.title}</option>
                      ))}
                    </Select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 150px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ctp-subtext0)' }}>Tags (separadas por vírgula)</label>
                    <Input
                      type="text"
                      placeholder="e.g. Dev, Testes"
                      value={newCardTags}
                      onChange={(e) => setNewCardTags(e.target.value)}
                      size="sm"
                      color="mauve"
                    />
                  </div>
                  <button
                    type="button"
                    className={`btn btn--filled btn--sm btn--${kanbanThemeColor}`}
                    onClick={() => {
                      if (!newCardTitle.trim()) return;
                      const newCard: KanbanItem = {
                        id: `task-${Date.now()}`,
                        columnId: newCardColumn,
                        title: newCardTitle,
                        description: newCardDesc || undefined,
                        tags: newCardTags ? newCardTags.split(',').map(t => t.trim()).filter(Boolean) : []
                      };
                      setKanbanItems(prev => [...prev, newCard]);
                      setNewCardTitle('');
                      setNewCardDesc('');
                      setNewCardTags('');
                      showToast("Novo cartão adicionado com sucesso!");
                    }}
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Kanban Playground area */}
              <div className="playground-section">
                <div className="playground-card playground-card--preview" style={{ padding: '0.25rem' }}>
                  <div className="preview-canvas" style={{ padding: '1.25rem', minHeight: '520px', alignItems: 'stretch', justifyContent: 'stretch', backgroundColor: 'var(--ctp-crust)', borderRadius: '12px' }}>
                    <DragDropProvider apiKey="dev">
                      <Kanban
                        columns={kanbanColumns}
                        items={kanbanItems}
                        onItemsChange={(newItems) => setKanbanItems(newItems)}
                        color={kanbanThemeColor}
                        onItemClick={(item) => showToast(`Tarefa selecionada: "${item.title}"`)}
                      />
                    </DragDropProvider>
                  </div>

                  <div style={{ padding: '1rem' }}>
                    <div className="tabs-header" style={{ marginBottom: '1rem' }}>
                      {(['react', 'vue', 'angular'] as const).map((tab) => (
                        <button
                          key={tab}
                          className={`tab-btn ${activeKanbanTab === tab ? 'active' : ''}`}
                          onClick={() => setActiveKanbanTab(tab)}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>
                    <pre className="code-block" style={{ fontSize: '0.8rem' }}>
                      <code dangerouslySetInnerHTML={{
                        __html: activeKanbanTab === 'react' ? getReactKanbanCode() : activeKanbanTab === 'vue' ? getVueKanbanCode() : getAngularKanbanCode()
                      }} />
                    </pre>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* DYNAMIC FORMS SHOWCASE TAB */}
          {activeComponent === 'form' && (
            <section>
              <h2 className="section-title">
                <span>⚡</span> Dynamic Form Builder & Renderer
              </h2>

              <div className="forms-playground-grid">
                {/* Left Column: Schema Builder & JSON Editor */}
                <div className="playground-card" style={{ gap: '1rem' }}>
                  <div className="builder-tabs">
                    <button
                      className={`builder-tab-btn ${formBuilderTab === 'builder' ? 'active' : ''}`}
                      onClick={() => setFormBuilderTab('builder')}
                    >
                      🛠️ Schema Field Builder
                    </button>
                    <button
                      className={`builder-tab-btn ${formBuilderTab === 'json' ? 'active' : ''}`}
                      onClick={() => setFormBuilderTab('json')}
                    >
                      📄 Edit Schema JSON
                    </button>
                  </div>

                  {formBuilderTab === 'builder' ? (
                    <div>
                      <h4 style={{ margin: '0 0 10px 0' }}>Fields List</h4>
                      <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '4px' }}>
                        {formSchema.map((field) => (
                          <div key={field.id} className="field-list-item">
                            <div className="field-list-details">
                              <span className="field-list-name">{field.label} ({field.id})</span>
                              <span className="field-list-meta">
                                Type: {field.type} • Width: {field.width}% {field.required ? '• Required' : ''}
                              </span>
                            </div>
                            <button
                              style={{ background: 'none', border: 'none', color: 'var(--ctp-red)', cursor: 'pointer', fontSize: '1.1rem' }}
                              onClick={() => handleRemoveField(field.id)}
                              title="Remove field"
                            >
                              🗑️
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add New Field interactive form */}
                      <form onSubmit={handleAddNewField} className="builder-card-action">
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem' }}>Add New Schema Field</h4>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                          <div className="control-group">
                            <label style={{ fontSize: '0.78rem' }}>Unique ID</label>
                            <input
                              type="text"
                              value={newFieldId}
                              onChange={(e) => setNewFieldId(e.target.value.replace(/\s+/g, ''))}
                              placeholder="e.g. userAge"
                              required
                              style={{ padding: '8px', fontSize: '0.85rem' }}
                            />
                          </div>

                          <div className="control-group">
                            <label style={{ fontSize: '0.78rem' }}>Label Text</label>
                            <input
                              type="text"
                              value={newFieldLabel}
                              onChange={(e) => setNewFieldLabel(e.target.value)}
                              placeholder="e.g. Enter your age"
                              required
                              style={{ padding: '8px', fontSize: '0.85rem' }}
                            />
                          </div>

                          <div className="control-group">
                            <label style={{ fontSize: '0.78rem' }}>Control Type</label>
                            <select
                              value={newFieldType}
                              onChange={(e) => setNewFieldType(e.target.value as any)}
                              style={{ padding: '8px', fontSize: '0.85rem' }}
                            >
                              <option value="text">Text Input</option>
                              <option value="number">Number Input</option>
                              <option value="email">Email Input</option>
                              <option value="select">Dropdown Select</option>
                              <option value="radio">Radio Options</option>
                              <option value="checkbox">Single Checkbox</option>
                              <option value="switch">Switch Toggle</option>
                              <option value="slider">Range Slider</option>
                              <option value="textarea">Textarea Box</option>
                            </select>
                          </div>

                          <div className="control-group">
                            <label style={{ fontSize: '0.78rem' }}>Column Width</label>
                            <select
                              value={newFieldWidth}
                              onChange={(e) => setNewFieldWidth(Number(e.target.value) as any)}
                              style={{ padding: '8px', fontSize: '0.85rem' }}
                            >
                              <option value="100">Full (100%)</option>
                              <option value="50">Half (50%)</option>
                              <option value="33">Third (33%)</option>
                            </select>
                          </div>

                          <div className="control-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ fontSize: '0.78rem' }}>Placeholder / Helper Description</label>
                            <input
                              type="text"
                              value={newFieldPlaceholder}
                              onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                              placeholder="e.g. Minimum 18 years old"
                              style={{ padding: '8px', fontSize: '0.85rem' }}
                            />
                          </div>

                          {['select', 'radio'].includes(newFieldType) && (
                            <div className="control-group" style={{ gridColumn: 'span 2' }}>
                              <label style={{ fontSize: '0.78rem' }}>Options (Comma-separated name:value)</label>
                              <input
                                type="text"
                                value={newFieldOptionsString}
                                onChange={(e) => setNewFieldOptionsString(e.target.value)}
                                placeholder="e.g. Yes:yes, No:no, Maybe:maybe"
                                required
                                style={{ padding: '8px', fontSize: '0.85rem' }}
                              />
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label className="checkbox-label" style={{ fontSize: '0.8rem' }}>
                            <input
                              type="checkbox"
                              checked={newFieldRequired}
                              onChange={(e) => setNewFieldRequired(e.target.checked)}
                            />
                            Mark Required
                          </label>

                          <Button type="submit" variant="tonal" color="mauve" size="sm">
                            ➕ Add Field
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label htmlFor="schema-json-editor">FieldSchema Schema Configuration Array</label>
                      <textarea
                        id="schema-json-editor"
                        className="schema-json-textarea"
                        value={jsonText}
                        onChange={(e) => handleJsonTextChange(e.target.value)}
                      />
                      {jsonError && <div className="schema-error-banner">⚠️ JSON Parse Error: {jsonError}</div>}
                    </div>
                  )}
                </div>

                {/* Right Column: Live Form Renderer Preview & Submission Values */}
                <div className="playground-card" style={{ gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--ctp-surface0)', paddingBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Renderer Canvas</h3>

                    {/* Visual Customizer */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <select
                        value={formConfigSize}
                        onChange={(e) => setFormConfigSize(e.target.value as any)}
                        style={{ padding: '6px 8px', borderRadius: '6px', fontSize: '0.75rem' }}
                        title="Form Fields Size"
                      >
                        <option value="sm">Small</option>
                        <option value="md">Medium</option>
                        <option value="lg">Large</option>
                      </select>

                      <select
                        value={formConfigShape}
                        onChange={(e) => setFormConfigShape(e.target.value as any)}
                        style={{ padding: '6px 8px', borderRadius: '6px', fontSize: '0.75rem' }}
                        title="Form Fields Shape"
                      >
                        <option value="square">Square</option>
                        <option value="rounded">Rounded</option>
                        <option value="pill">Pill</option>
                      </select>

                      <select
                        value={formConfigColor}
                        onChange={(e) => setFormConfigColor(e.target.value as any)}
                        style={{ padding: '6px 8px', borderRadius: '6px', fontSize: '0.75rem' }}
                        title="Form Color Accent"
                      >
                        {colors.map(c => (
                          <option key={c.name} value={c.name.toLowerCase()}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* RENDER ACTIVE DYNAMIC FORM */}
                  <div style={{ backgroundColor: 'var(--ctp-crust)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--ctp-surface0)' }}>
                    {formSchema.length === 0 ? (
                      <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--ctp-subtext0)', fontSize: '0.9rem', textAlign: 'center' }}>
                        Form is empty. Add fields to schema to start.
                      </p>
                    ) : (
                      <DynamicForm
                        schema={formSchema}
                        onSubmit={handleFormSubmit}
                        submitButtonText="Register Cozy Account"
                        submitButtonColor={formConfigColor}
                        submitButtonSize={formConfigSize}
                        submitButtonShape={formConfigShape}
                        size={formConfigSize}
                        shape={formConfigShape}
                        color={formConfigColor}
                      />
                    )}
                  </div>

                  {/* Success submission values */}
                  {lastSubmitPayload && (
                    <div className="payload-canvas">
                      <h4 style={{ margin: '0 0 10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>✅ Last Submission Received</span>
                        <button
                          style={{ background: 'none', border: 'none', color: 'var(--ctp-subtext0)', cursor: 'pointer', fontSize: '0.8rem' }}
                          onClick={() => setLastSubmitPayload(null)}
                        >
                          Clear
                        </button>
                      </h4>
                      <pre className="code-block" style={{ fontSize: '0.8rem', color: 'var(--ctp-green)' }}>
                        <code>{JSON.stringify(lastSubmitPayload, null, 2)}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* STEPS & SLIDER TRANSITION SHOWCASE TAB */}
          {activeComponent === 'steps' && (
            <section>
              <h2 className="section-title">
                <span>📈</span> Steps Stepper & Slider Layouts
              </h2>

              <div className="playground-section">
                {/* Steps configuration */}
                <div className="playground-card" style={{ gap: '1.2rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Steps Configuration</h3>

                  <div className="control-grid">
                    <div className="control-group">
                      <label htmlFor="steps-variant-select">Visual Theme</label>
                      <select
                        id="steps-variant-select"
                        value={stepsVariant}
                        onChange={(e) => setStepsVariant(e.target.value as StepsVariant)}
                      >
                        <option value="timeline">Timeline Track Connector</option>
                        <option value="carousel">Carousel Pill Expansion</option>
                      </select>
                    </div>

                    <div className="control-group">
                      <label htmlFor="steps-orient-select">Orientation</label>
                      <select
                        id="steps-orient-select"
                        value={stepsOrientation}
                        onChange={(e) => setStepsOrientation(e.target.value as any)}
                        disabled={stepsVariant === 'carousel'}
                      >
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                      </select>
                    </div>

                    <div className="control-group">
                      <label htmlFor="steps-color-select">Color Accent</label>
                      <select
                        id="steps-color-select"
                        value={stepsColor}
                        onChange={(e) => setStepsColor(e.target.value as StepsColor)}
                      >
                        {colors.map((c) => (
                          <option key={c.name} value={c.name.toLowerCase()}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="control-group">
                      <label>Step Count</label>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setStepsCount(c => {
                              const next = Math.max(3, c - 1);
                              setStepsCurrent(s => Math.min(next - 1, s));
                              return next;
                            });
                          }}
                        >
                          -
                        </Button>
                        <div style={{ flexGrow: 1, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold' }}>
                          {stepsCount}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setStepsCount(c => Math.min(8, c + 1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="control-group">
                      <label htmlFor="steps-slider-selector">Current step index</label>
                      <input
                        id="steps-slider-selector"
                        type="range"
                        min="0"
                        max={stepsCount - 1}
                        value={stepsCurrent}
                        onChange={(e) => setStepsCurrent(Number(e.target.value))}
                        style={{ cursor: 'pointer', accentColor: `var(--ctp-${stepsColor})` }}
                      />
                    </div>
                  </div>

                  {/* Standard display indicator component */}
                  <div style={{ background: 'var(--ctp-crust)', borderRadius: '12px', border: '1px dashed var(--ctp-surface1)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--ctp-subtext0)', fontWeight: 600 }}>Standard Stepper Indicator (Linked Callback):</span>
                    <Steps
                      currentStep={stepsCurrent}
                      stepsCount={stepsCount}
                      variant={stepsVariant}
                      color={stepsColor}
                      orientation={stepsOrientation}
                      labels={stepsVariant === 'timeline' ? Array.from({ length: stepsCount }).map((_, i) => `Node ${i + 1}`) : undefined}
                      onChangeStep={setStepsCurrent}
                    />
                  </div>

                  {/* Steps control buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <Button
                      variant="outline"
                      color={stepsColor}
                      disabled={stepsCurrent === 0}
                      onClick={() => setStepsCurrent(s => Math.max(0, s - 1))}
                      style={{ flex: 1 }}
                    >
                      Previous Dot
                    </Button>
                    <Button
                      variant="filled"
                      color={stepsColor}
                      disabled={stepsCurrent === stepsCount - 1}
                      onClick={() => setStepsCurrent(s => Math.min(stepsCount - 1, s + 1))}
                      style={{ flex: 1 }}
                    >
                      Next Dot
                    </Button>
                  </div>
                </div>

                {/* Preview and Code Snippets */}
                <div className="playground-card playground-card--preview">
                  <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Component Preview</h3>

                  <div className="preview-canvas" style={{ padding: '1.5rem', minHeight: '180px', flexDirection: 'column' }}>
                    <Steps
                      currentStep={stepsCurrent}
                      stepsCount={stepsCount}
                      variant={stepsVariant}
                      color={stepsColor}
                      orientation={stepsOrientation}
                      labels={stepsVariant === 'timeline' ? Array.from({ length: stepsCount }).map((_, i) => `Step ${i + 1}`) : undefined}
                      onChangeStep={setStepsCurrent}
                    />
                  </div>

                  <div>
                    <div className="tabs-header">
                      {(['react', 'vue', 'angular'] as const).map((tab) => (
                        <button
                          key={tab}
                          className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>

                    <div className="code-container">
                      <button
                        className="code-copy-btn"
                        onClick={() => copyToClipboard(getRawTextCode(), `${activeTab} snippet`)}
                      >
                        Copy Code
                      </button>
                      <pre className="code-block">
                        <code
                          dangerouslySetInnerHTML={{
                            __html: activeTab === 'react'
                              ? getReactStepsCode()
                              : activeTab === 'vue'
                                ? getVueStepsCode()
                                : getAngularStepsCode()
                          }}
                        />
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* HIGH FIDELITY WIZARD INTEGRATION FLOW */}
              <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ margin: '0 0 1.2rem 0' }}>✨ High-Fidelity Checkout Wizard & Slide Transition Showcase ✨</h3>

                <div style={{
                  background: 'var(--ctp-mantle)',
                  borderRadius: '16px',
                  border: '1px solid color-mix(in srgb, var(--ctp-text) 8%, transparent)',
                  maxWidth: '620px',
                  margin: '0 auto',
                  overflow: 'hidden',
                  boxShadow: 'var(--ctp-shadow-lg)'
                }}>

                  {/* Wizard progress stepper header */}
                  <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--ctp-surface0)', backgroundColor: 'var(--ctp-crust)' }}>
                    <Steps
                      currentStep={wizardStep}
                      stepsCount={3}
                      variant="timeline"
                      color={stepsColor}
                      labels={wizardLabels}
                      onChangeStep={setWizardStep}
                    />
                  </div>

                  {/* Slider wrapper container */}
                  <div style={{ padding: '2rem', minHeight: '260px' }}>
                    <StepsSlider currentStep={wizardStep}>

                      {/* Step 1: Selection */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h4 style={{ margin: 0 }}>Step 1: Choose Your Flavor</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)' }}>
                          Select which cozy Catppuccin flavor theme is deployed onto your dashboard framework.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
                          {(['mocha', 'macchiato', 'frappe', 'latte'] as const).map(fl => (
                            <div
                              key={fl}
                              onClick={() => setWizardFlavor(fl)}
                              style={{
                                padding: '12px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--ctp-crust)',
                                border: `2px solid ${wizardFlavor === fl ? `var(--ctp-${stepsColor})` : 'transparent'}`,
                                cursor: 'pointer',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                transition: 'var(--ctp-transition)'
                              }}
                            >
                              {fl.charAt(0).toUpperCase() + fl.slice(1)}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Step 2: Shipping */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <h4 style={{ margin: 0 }}>Step 2: Shipping & Delivery Destinations</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)' }}>
                          Fill in shipping address attributes to complete standard order transmission.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                          <div className="control-group">
                            <label style={{ fontSize: '0.78rem' }}>Recipient Name</label>
                            <input
                              type="text"
                              value={wizardShippingName}
                              onChange={(e) => setWizardShippingName(e.target.value)}
                              placeholder="e.g. John Doe"
                              style={{ padding: '8px', fontSize: '0.85rem' }}
                            />
                          </div>
                          <div className="control-group">
                            <label style={{ fontSize: '0.78rem' }}>Street Address</label>
                            <input
                              type="text"
                              value={wizardShippingAddress}
                              onChange={(e) => setWizardShippingAddress(e.target.value)}
                              placeholder="e.g. 123 Cozy Avenue"
                              style={{ padding: '8px', fontSize: '0.85rem' }}
                            />
                          </div>
                          <div className="control-group">
                            <label style={{ fontSize: '0.78rem' }}>City / Region</label>
                            <input
                              type="text"
                              value={wizardShippingCity}
                              onChange={(e) => setWizardShippingCity(e.target.value)}
                              placeholder="e.g. San Francisco"
                              style={{ padding: '8px', fontSize: '0.85rem' }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Step 3: Success Confirmation */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
                        <div style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          backgroundColor: 'color-mix(in srgb, var(--ctp-green) 12%, transparent)',
                          color: 'var(--ctp-green)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem'
                        }}>
                          ✓
                        </div>
                        <h4 style={{ margin: 0, color: 'var(--ctp-green)' }}>Order Transmitted Successfully!</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ctp-subtext1)', lineHeight: 1.5 }}>
                          Thank you for choosing Catppuccin! Your theme setup files have been packaged and prepared for shipping.
                        </p>
                        <div style={{
                          backgroundColor: 'var(--ctp-crust)',
                          width: '100%',
                          borderRadius: '8px',
                          padding: '12px',
                          border: '1px solid var(--ctp-surface0)',
                          fontSize: '0.82rem',
                          textAlign: 'left',
                          marginTop: '8px'
                        }}>
                          <div><strong>Flavor selected:</strong> {wizardFlavor}</div>
                          <div><strong>Deliver to:</strong> {wizardShippingName}</div>
                          <div><strong>Address:</strong> {wizardShippingAddress}, {wizardShippingCity}</div>
                        </div>
                      </div>

                    </StepsSlider>
                  </div>

                  {/* Wizard Control footer action buttons */}
                  <div style={{
                    padding: '1.2rem 1.5rem',
                    borderTop: '1px solid var(--ctp-surface0)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--ctp-crust)',
                    gap: '12px'
                  }}>
                    {wizardStep < 2 ? (
                      <>
                        <Button
                          variant="outline"
                          disabled={wizardStep === 0}
                          onClick={() => setWizardStep(s => Math.max(0, s - 1))}
                        >
                          Back
                        </Button>
                        <Button
                          variant="filled"
                          color={stepsColor}
                          disabled={isWizardNextDisabled()}
                          onClick={() => setWizardStep(s => Math.min(2, s + 1))}
                        >
                          {wizardStep === 1 ? 'Place Order' : 'Next Step'}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="tonal"
                        color={stepsColor}
                        onClick={resetWizard}
                        style={{ width: '100%' }}
                      >
                        Restart Checkout Wizard
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* PROGRESS BAR & SCROLLBAR TAB */}
          {activeComponent === 'progress' && (
            <section>
              <h2 className="section-title">
                <span>📈</span> Progress Bar & Scrollbar Utilities
              </h2>

              <div className="playground-section">
                {/* Progress Config */}
                <div className="playground-card" style={{ gap: '1.2rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Progress Bar Configuration</h3>

                  <div className="control-grid">
                    <div className="control-group control-group--full">
                      <label htmlFor="progress-label-input">Label Text</label>
                      <input
                        id="progress-label-input"
                        type="text"
                        value={progressLabel}
                        onChange={(e) => setProgressLabel(e.target.value)}
                      />
                    </div>

                    <div className="control-group">
                      <label htmlFor="progress-color-select">Color Accent</label>
                      <select
                        id="progress-color-select"
                        value={progressColor}
                        onChange={(e) => setProgressColor(e.target.value as ProgressBarColor)}
                      >
                        {colors.map((c) => (
                          <option key={c.name} value={c.name.toLowerCase()}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="control-group">
                      <label htmlFor="progress-size-select">Size Height</label>
                      <select
                        id="progress-size-select"
                        value={progressSize}
                        onChange={(e) => setProgressSize(e.target.value as ProgressBarSize)}
                      >
                        <option value="sm">Small (sm, 6px)</option>
                        <option value="md">Medium (md, 10px)</option>
                        <option value="lg">Large (lg, 16px)</option>
                      </select>
                    </div>

                    <div className="control-group">
                      <label htmlFor="progress-val-input">Progress Value: {progressVal}%</label>
                      <input
                        id="progress-val-input"
                        type="range"
                        min="0"
                        max="100"
                        value={progressVal}
                        onChange={(e) => setProgressVal(Number(e.target.value))}
                        disabled={progressIndeterminate}
                        style={{ cursor: 'pointer', accentColor: `var(--ctp-${progressColor})` }}
                      />
                    </div>

                    <div className="control-group">
                      <label htmlFor="progress-position-select">Value Position</label>
                      <select
                        id="progress-position-select"
                        value={progressValPosition}
                        onChange={(e) => setProgressValPosition(e.target.value as any)}
                        disabled={!progressShowValue || progressSize !== 'lg'}
                      >
                        <option value="outside">Outside (above bar)</option>
                        <option value="inside">Inside (centered, LG height only)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={progressIndeterminate}
                        onChange={(e) => setProgressIndeterminate(e.target.checked)}
                      />
                      Indeterminate Loop Loading
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={progressStriped}
                        onChange={(e) => setProgressStriped(e.target.checked)}
                      />
                      Striped Diagonal Texture
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={progressAnimated}
                        onChange={(e) => setProgressAnimated(e.target.checked)}
                        disabled={!progressStriped}
                      />
                      Animate Stripe Movement
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={progressShowValue}
                        onChange={(e) => setProgressShowValue(e.target.checked)}
                        disabled={progressIndeterminate}
                      />
                      Show Value Percentage Text
                    </label>
                  </div>
                </div>

                {/* Progress Preview Canvas */}
                <div className="playground-card playground-card--preview">
                  <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Component Preview</h3>

                  <div className="preview-canvas" style={{ padding: '2rem', minHeight: '160px' }}>
                    <div style={{ width: '100%' }}>
                      <ProgressBar
                        value={progressVal}
                        size={progressSize}
                        color={progressColor}
                        striped={progressStriped}
                        animated={progressAnimated}
                        indeterminate={progressIndeterminate}
                        showValue={progressShowValue}
                        valuePosition={progressValPosition}
                        label={progressLabel || undefined}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="tabs-header">
                      {(['react', 'vue', 'angular'] as const).map((tab) => (
                        <button
                          key={tab}
                          className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>

                    <div className="code-container">
                      <button
                        className="code-copy-btn"
                        onClick={() => copyToClipboard(getRawTextCode(), `${activeTab} snippet`)}
                      >
                        Copy Code
                      </button>
                      <pre className="code-block">
                        <code
                          dangerouslySetInnerHTML={{
                            __html: activeTab === 'react'
                              ? getReactProgressCode()
                              : activeTab === 'vue'
                                ? getVueProgressCode()
                                : getAngularProgressCode()
                          }}
                        />
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* SCROLLBAR COMPARISON SHOWCASE */}
              <div style={{ marginTop: '2.5rem', marginBottom: '3rem' }}>
                <h3 style={{ margin: '0 0 0.8rem 0' }}>✨ Custom Scrollbar Utility vs Browser Default Scrollbar ✨</h3>
                <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: 'var(--ctp-subtext0)' }}>
                  Compare standard browser scrollbars with the customized, premium, color-mix hoverable <code>.scrollbar</code> utility.
                </p>

                {/* Scroll color selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--ctp-mantle)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--ctp-surface0)', marginBottom: '1.5rem' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.88rem' }}>Scroll Thumb Hover Accent:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setScrollAccent(c.name.toLowerCase() as any)}
                        style={{
                          background: `var(${c.variable})`,
                          border: `2px solid ${scrollAccent === c.name.toLowerCase() ? 'var(--ctp-text)' : 'transparent'}`,
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          boxShadow: 'var(--ctp-shadow-sm)',
                          transition: 'transform 0.15s ease'
                        }}
                        title={`Highlight in ${c.name} on hover`}
                      />
                    ))}
                  </div>
                  <span style={{ textTransform: 'capitalize', fontSize: '0.85rem', fontWeight: 'bold', color: `var(--ctp-${scrollAccent})` }}>
                    {scrollAccent}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                  {/* Box 1: Browser Default */}
                  <div className="playground-card" style={{ gap: '1rem', padding: '1.5rem' }}>
                    <h4 style={{ margin: 0, color: 'var(--ctp-subtext1)' }}>🚫 Default Browser Scrollbar</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--ctp-subtext0)' }}>
                      Stiff edges, default system colors, lacks design system coordination.
                    </p>
                    <div style={{
                      height: '240px',
                      overflowY: 'scroll',
                      backgroundColor: 'var(--ctp-crust)',
                      borderRadius: '8px',
                      padding: '12px',
                      border: '1px solid var(--ctp-surface0)',
                      lineHeight: '1.6',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre'
                    }}>
                      {Array.from({ length: 25 }).map((_, i) => `[SYS_DEFAULT_LOG_LINE_${i + 1}]: Loading asset catalog... done!\n[SYS_DEFAULT_LOG_LINE_${i + 1}]: Allocating buffer page cache...\n[SYS_DEFAULT_LOG_LINE_${i + 1}]: Initializing theme variables... done!\n`).join('')}
                    </div>
                  </div>

                  {/* Box 2: Custom Catppuccin Scroll */}
                  <div className="playground-card" style={{ gap: '1rem', padding: '1.5rem' }}>
                    <h4 style={{ margin: 0, color: `var(--ctp-${scrollAccent})` }}>✨ Catppuccin Scrollbar (<code>.scrollbar</code>)</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--ctp-subtext0)' }}>
                      Rounded shape, thin width, mantle background integration, hover highlights.
                    </p>
                    <div className={`scrollbar scrollbar--${scrollAccent}`} style={{
                      height: '240px',
                      overflowY: 'scroll',
                      backgroundColor: 'var(--ctp-crust)',
                      borderRadius: '8px',
                      padding: '12px',
                      border: '1px solid var(--ctp-surface0)',
                      lineHeight: '1.6',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre'
                    }}>
                      {Array.from({ length: 25 }).map((_, i) => {
                        const lineStr = `[CTP_ACCENT_LOG_LINE_${i + 1}]: Loading asset catalog... done!\n[CTP_ACCENT_LOG_LINE_${i + 1}]: Allocating buffer page cache...\n[CTP_ACCENT_LOG_LINE_${i + 1}]: Initializing theme variables... done!\n`;
                        return lineStr;
                      }).join('')}
                    </div>
                  </div>

                </div>
              </div>
            </section>
          )}

          {activeComponent === 'drawer' && (
            <>
              {/* Drawer Component Showcase */}
              <section>
                <h2 className="section-title">
                  <span>🚪</span> Retractable Drawer Panel Showcase
                </h2>
                <div className="playground-section">
                  {/* Settings Panel */}
                  <div className="playground-card" style={{ height: 'fit-content' }}>
                    <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem', color: 'var(--ctp-mauve)' }}>Drawer Configuration</h3>

                    <div className="control-grid">
                      <div className="control-group">
                        <label htmlFor="drawer-position-select">Slide Position</label>
                        <select
                          id="drawer-position-select"
                          value={drawerPosition}
                          onChange={(e) => setDrawerPosition(e.target.value as DrawerPosition)}
                        >
                          <option value="right">Right (Direita)</option>
                          <option value="left">Left (Esquerda)</option>
                          <option value="top">Top (Topo)</option>
                          <option value="bottom">Bottom (Base)</option>
                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="drawer-size-select">Drawer Size</label>
                        <select
                          id="drawer-size-select"
                          value={drawerSize}
                          onChange={(e) => setDrawerSize(e.target.value as DrawerSize)}
                        >
                          <option value="sm">Small (sm)</option>
                          <option value="md">Medium (md)</option>
                          <option value="lg">Large (lg)</option>
                          <option value="full">Full Screen (full)</option>
                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="drawer-accent-select">Accent Color</label>
                        <select
                          id="drawer-accent-select"
                          value={drawerAccent}
                          onChange={(e) => setDrawerAccent(e.target.value as FormControlColor)}
                        >
                          {colors.map((c) => (
                            <option key={c.name} value={c.name.toLowerCase()}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="drawer-title-input">Header Title</label>
                        <input
                          id="drawer-title-input"
                          type="text"
                          value={drawerTitle}
                          onChange={(e) => setDrawerTitle(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: '12px', borderTop: '1px solid var(--ctp-surface0)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label>Toggles & Overlay Behaviors</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={drawerCloseOnOverlayClick}
                            onChange={(e) => setDrawerCloseOnOverlayClick(e.target.checked)}
                          />
                          Close on backdrop click
                        </label>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={drawerCloseOnEsc}
                            onChange={(e) => setDrawerCloseOnEsc(e.target.checked)}
                          />
                          Close on ESC key press
                        </label>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={drawerShowCloseButton}
                            onChange={(e) => setDrawerShowCloseButton(e.target.checked)}
                          />
                          Show close cross button
                        </label>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={drawerShowFooter}
                            onChange={(e) => setDrawerShowFooter(e.target.checked)}
                          />
                          Show footer actions
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Action Preview and Snippet area */}
                  <div className="playground-card playground-card--preview">
                    <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Component Trigger Preview</h3>

                    <div className="preview-canvas" style={{ minHeight: '180px', flexDirection: 'column', gap: '12px' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--ctp-subtext0)', textAlign: 'center' }}>
                        Clique no botão abaixo para abrir o Drawer com as configurações atuais.
                      </span>
                      <Button
                        variant="filled"
                        color={drawerAccent}
                        onClick={() => setIsDrawerOpen(true)}
                      >
                        Abrir Painel Lateral (Drawer)
                      </Button>
                    </div>

                    <div>
                      <div className="tabs-header">
                        {(['react', 'vue', 'angular'] as const).map((tab) => (
                          <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </button>
                        ))}
                      </div>

                      <div className="code-container">
                        <button
                          className="code-copy-btn"
                          onClick={() => {
                            const code = activeTab === 'react' ? getReactDrawerCode() : activeTab === 'vue' ? getVueDrawerCode() : getAngularDrawerCode();
                            const plainText = code.replace(/<[^>]*>/g, '');
                            copyToClipboard(plainText, `${activeTab} drawer snippet`);
                          }}
                        >
                          Copy Code
                        </button>
                        <pre className="code-block">
                          <code
                            dangerouslySetInnerHTML={{
                              __html: activeTab === 'react'
                                ? getReactDrawerCode()
                                : activeTab === 'vue'
                                  ? getVueDrawerCode()
                                  : getAngularDrawerCode()
                            }}
                          />
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Drawer Instance Component */}
                <Drawer
                  isOpen={isDrawerOpen}
                  onClose={() => setIsDrawerOpen(false)}
                  title={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🚪 {drawerTitle}
                    </span>
                  }
                  position={drawerPosition}
                  size={drawerSize}
                  color={drawerAccent}
                  closeOnOverlayClick={drawerCloseOnOverlayClick}
                  closeOnEsc={drawerCloseOnEsc}
                  showCloseButton={drawerShowCloseButton}
                  footer={
                    drawerShowFooter ? (
                      <>
                        <Button variant="ghost" color="red" onClick={() => setIsDrawerOpen(false)}>
                          Cancelar
                        </Button>
                        <Button variant="filled" color="green" onClick={() => setIsDrawerOpen(false)}>
                          Salvar Ajustes
                        </Button>
                      </>
                    ) : undefined
                  }
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <p style={{ margin: 0 }}>
                      Este é o painel lateral deslizante do sistema de design Catppuccin, posicionado no lado <strong>{drawerPosition}</strong>.
                    </p>
                    <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--ctp-crust)', border: '1px solid var(--ctp-surface0)' }}>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: `var(--ctp-${drawerAccent})` }}>Guia de Customização</h4>
                      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', lineHeight: '1.5' }}>
                        <li>Experimente mudar o slide para Top ou Bottom.</li>
                        <li>O corpo principal aceita scroll vertical caso a capacidade estoure.</li>
                        <li>Utiliza foco travado por acessibilidade.</li>
                      </ul>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label htmlFor="drawer-demo-name" style={{ fontSize: '0.8rem' }}>Nome de Usuário</label>
                      <input
                        id="drawer-demo-name"
                        type="text"
                        defaultValue="Miau da Silva"
                        style={{ backgroundColor: 'var(--ctp-base)', border: '1px solid var(--ctp-surface1)' }}
                      />
                    </div>
                  </div>
                </Drawer>
              </section>
            </>
          )}

          {activeComponent === 'select' && (
            <>
              {/* Advanced Selects Showcase */}
              <section>
                <h2 className="section-title">
                  <span>🔍</span> Advanced Select Components
                </h2>
                <div className="playground-section">
                  {/* Settings Panel */}
                  <div className="playground-card" style={{ height: 'fit-content' }}>
                    <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem', color: 'var(--ctp-mauve)' }}>Select Configuration</h3>

                    <div className="control-grid">
                      <div className="control-group">
                        <label htmlFor="select-accent-picker">Accent Flavor</label>
                        <select
                          id="select-accent-picker"
                          value={selectAccent}
                          onChange={(e) => setSelectAccent(e.target.value as FormControlColor)}
                        >
                          {colors.map((c) => (
                            <option key={c.name} value={c.name.toLowerCase()}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="select-size-picker">Controls Size</label>
                        <select
                          id="select-size-picker"
                          value={selectSize}
                          onChange={(e) => setSelectSize(e.target.value as FormControlSize)}
                        >
                          <option value="sm">Small (sm)</option>
                          <option value="md">Medium (md)</option>
                          <option value="lg">Large (lg)</option>
                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="select-shape-picker">Controls Shape</label>
                        <select
                          id="select-shape-picker"
                          value={selectShape}
                          onChange={(e) => setSelectShape(e.target.value as FormControlShape)}
                        >
                          <option value="square">Square</option>
                          <option value="rounded">Rounded</option>
                          <option value="pill">Pill</option>

                        </select>
                      </div>

                      <div className="control-group">
                        <label className="checkbox-label" style={{ marginTop: '22px' }}>
                          <input
                            type="checkbox"
                            checked={selectSearchable}
                            onChange={(e) => setSelectSearchable(e.target.checked)}
                          />
                          Enable MultiSelect Search
                        </label>
                      </div>
                    </div>

                    <div style={{ marginTop: '12px', borderTop: '1px solid var(--ctp-surface0)', paddingTop: '12px' }}>
                      <label>TreeSelect Behaviors</label>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={selectMultipleTree}
                            onChange={(e) => {
                              setSelectMultipleTree(e.target.checked);
                              setSelectValueTreeSingle('');
                              setSelectValueTreeMulti(['showcase']);
                            }}
                          />
                          Enable Tree Multiple Selection
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Previews and Code snippets */}
                  <div className="playground-card playground-card--preview">
                    <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Component Canvas Previews</h3>

                    <div className="preview-canvas" style={{ minHeight: '260px', flexDirection: 'column', gap: '20px', padding: '1.5rem', justifyContent: 'flex-start', alignItems: 'stretch' }}>

                      {/* 1. MultiSelect Canvas */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--ctp-subtext0)', fontWeight: 600 }}>MultiSelect Dropdown (Tags + Filtro):</span>
                        <MultiSelect
                          options={selectTechOptions}
                          value={selectValueMulti}
                          onChange={setSelectValueMulti}
                          color={selectAccent}
                          size={selectSize}
                          shape={selectShape}
                          searchable={selectSearchable}
                          placeholder="Escolha tecnologias..."
                        />
                      </div>

                      {/* 2. TreeSelect Canvas */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--ctp-subtext0)', fontWeight: 600 }}>TreeSelect Dropdown (Pastas Colapsáveis):</span>
                        <TreeSelect
                          data={selectTreeData}
                          multiple={selectMultipleTree}
                          value={selectValueTreeSingle}
                          onChange={setSelectValueTreeSingle}
                          multipleValue={selectValueTreeMulti}
                          onChangeMultiple={setSelectValueTreeMulti}
                          color={selectAccent}
                          size={selectSize}
                          shape={selectShape}
                          placeholder="Escolha arquivos..."
                        />
                      </div>

                    </div>

                    <div>
                      <div className="tabs-header">
                        {(['react', 'vue', 'angular'] as const).map((tab) => (
                          <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </button>
                        ))}
                      </div>

                      <div className="code-container">
                        <button
                          className="code-copy-btn"
                          onClick={() => {
                            const code = activeTab === 'react' ? getReactSelectCode() : activeTab === 'vue' ? getVueSelectCode() : getAngularSelectCode();
                            const plainText = code.replace(/<[^>]*>/g, '');
                            copyToClipboard(plainText, `${activeTab} select snippet`);
                          }}
                        >
                          Copy Code
                        </button>
                        <pre className="code-block">
                          <code
                            dangerouslySetInnerHTML={{
                              __html: activeTab === 'react'
                                ? getReactSelectCode()
                                : activeTab === 'vue'
                                  ? getVueSelectCode()
                                  : getAngularSelectCode()
                            }}
                          />
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selection data logs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                  <div className="payload-canvas">
                    <h4 style={{ margin: '0 0 8px 0', color: `var(--ctp-${selectAccent})` }}>MultiSelect Selected Keys</h4>
                    <pre className="code-block" style={{ margin: 0, padding: '10px' }}>
                      <code style={{ color: 'var(--ctp-green)' }}>{JSON.stringify(selectValueMulti, null, 2)}</code>
                    </pre>
                  </div>

                  <div className="payload-canvas">
                    <h4 style={{ margin: '0 0 8px 0', color: `var(--ctp-${selectAccent})` }}>TreeSelect Selected Keys</h4>
                    <pre className="code-block" style={{ margin: 0, padding: '10px' }}>
                      <code style={{ color: 'var(--ctp-green)' }}>
                        {selectMultipleTree ? JSON.stringify(selectValueTreeMulti, null, 2) : JSON.stringify(selectValueTreeSingle, null, 2)}
                      </code>
                    </pre>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeComponent === 'colorpicker' && (
            <>
              {/* Color Picker Showcase */}
              <section>
                <h2 className="section-title">
                  <span>🎨</span> Color Picker Component
                </h2>
                <div className="playground-section">
                  {/* Settings Panel */}
                  <div className="playground-card" style={{ height: 'fit-content' }}>
                    <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem', color: 'var(--ctp-mauve)' }}>ColorPicker Settings</h3>

                    <div className="control-grid">
                      <div className="control-group">
                        <label htmlFor="cp-variant-select">Picker Variant</label>
                        <select
                          id="cp-variant-select"
                          value={colorPickerVariant}
                          onChange={(e) => setColorPickerVariant(e.target.value as ColorPickerVariant)}
                        >
                          <option value="both">Both (Swatches + Custom)</option>
                          <option value="swatches">Swatches Only</option>
                          <option value="custom">Custom Spectrum Only</option>
                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="cp-size-select">Component Size</label>
                        <select
                          id="cp-size-select"
                          value={colorPickerSize}
                          onChange={(e) => setColorPickerSize(e.target.value as ColorPickerSize)}
                        >
                          <option value="sm">Small (sm)</option>
                          <option value="md">Medium (md)</option>
                          <option value="lg">Large (lg)</option>
                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="cp-flavor-select">Accent Palette Flavor</label>
                        <select
                          id="cp-flavor-select"
                          value={colorPickerFlavor}
                          onChange={(e) => setColorPickerFlavor(e.target.value as any)}
                        >
                          <option value="latte">Latte (Light)</option>
                          <option value="frappe">Frappé (Low Contrast Dark)</option>
                          <option value="macchiato">Macchiato (Cozy Dark)</option>
                          <option value="mocha">Mocha (Classic Dark)</option>
                        </select>
                      </div>

                      <div className="control-group" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <label className="checkbox-label" style={{ marginTop: '22px' }}>
                          <input
                            type="checkbox"
                            checked={colorPickerShowHexInput}
                            onChange={(e) => setColorPickerShowHexInput(e.target.checked)}
                          />
                          Show HEX text input
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Canvas & Live Code */}
                  <div className="playground-card playground-card--preview">
                    <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Interactive Canvas</h3>

                    <div className="preview-canvas" style={{ minHeight: '160px', flexDirection: 'column', gap: '20px', padding: '2rem' }}>
                      <ColorPicker
                        value={colorPickerVal}
                        onChange={setColorPickerVal}
                        flavor={colorPickerFlavor}
                        variant={colorPickerVariant}
                        size={colorPickerSize}
                        showHexInput={colorPickerShowHexInput}
                      />

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--ctp-subtext0)' }}>Current Selected Value:</span>
                        <strong style={{ fontFamily: 'monospace', color: colorPickerVal, textShadow: '0 0 8px rgba(0,0,0,0.2)' }}>
                          {colorPickerVal.toUpperCase()}
                        </strong>
                      </div>
                    </div>

                    <div>
                      <div className="tabs-header">
                        {(['react', 'vue', 'angular'] as const).map((tab) => (
                          <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </button>
                        ))}
                      </div>

                      <div className="code-container">
                        <button
                          className="code-copy-btn"
                          onClick={() => {
                            const code = activeTab === 'react' ? getReactColorPickerCode() : activeTab === 'vue' ? getVueColorPickerCode() : getAngularColorPickerCode();
                            const plainText = code.replace(/<[^>]*>/g, '');
                            copyToClipboard(plainText, `${activeTab} colorpicker snippet`);
                          }}
                        >
                          Copy Code
                        </button>
                        <pre className="code-block">
                          <code
                            dangerouslySetInnerHTML={{
                              __html: activeTab === 'react'
                                ? getReactColorPickerCode()
                                : activeTab === 'vue'
                                  ? getVueColorPickerCode()
                                  : getAngularColorPickerCode()
                            }}
                          />
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Theme customizer demonstration card */}
                <div style={{ marginTop: '2rem' }}>
                  <h3 className="section-subtitle" style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--ctp-text)' }}>
                    🎨 Dynamic Card Customization Demo
                  </h3>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '2rem'
                  }}>
                    <div style={{
                      padding: '2rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--ctp-mantle)',
                      border: `2px solid ${colorPickerVal}`,
                      boxShadow: `0 8px 32px -4px ${colorPickerVal}15, 0 0 16px ${colorPickerVal}10`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.2rem',
                      transition: 'all 0.3s ease'
                    }}>
                      <h4 style={{ margin: 0, fontSize: '1.25rem', color: colorPickerVal }}>
                        Live Customized Preview
                      </h4>
                      <p style={{ margin: 0, color: 'var(--ctp-subtext0)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        Selecting a color in the picker above automatically injects the hex code into this card's styling. The border color, shadows, heading, and button below are all reactive to your choice.
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: colorPickerVal,
                          border: '2px solid var(--ctp-crust)',
                          boxShadow: 'var(--ctp-shadow-sm)'
                        }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--ctp-subtext1)', fontFamily: 'monospace' }}>
                          Accent color: {colorPickerVal.toUpperCase()}
                        </span>
                      </div>

                      <div style={{ marginTop: '0.5rem' }}>
                        <button
                          type="button"
                          style={{
                            padding: '10px 20px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: colorPickerVal,
                            color: 'var(--ctp-base)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease, opacity 0.2s ease',
                            boxShadow: `0 4px 12px ${colorPickerVal}30`
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                          onClick={() => showToast(`Clicked button with accent color: ${colorPickerVal}`)}
                        >
                          Accent Primary Button
                        </button>
                      </div>
                    </div>

                    <div style={{
                      padding: '2rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--ctp-mantle)',
                      border: '1px solid var(--ctp-surface0)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: 'var(--ctp-text)' }}>
                          How it works
                        </h4>
                        <p style={{ margin: 0, color: 'var(--ctp-subtext0)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                          In React, you bind state to the value and handle updates with onChange:
                        </p>
                        <pre className="code-block" style={{ marginTop: '0.8rem', padding: '10px', fontSize: '0.8rem' }}>
                          <code style={{ color: 'var(--ctp-mauve)' }}>
                            {`const [color, setColor] = useState("#cba6f7");\n\nreturn (\n  <ColorPicker\n    value={color}\n    onChange={setColor}\n  />\n);`}
                          </code>
                        </pre>
                      </div>

                      <div style={{ borderTop: '1px solid var(--ctp-surface0)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--ctp-subtext1)' }}>Need custom palettes?</span>
                        <a href="https://github.com/catppuccin/catppuccin" target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--ctp-blue)', textDecoration: 'none', fontWeight: 600 }}>Catppuccin GitHub →</a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeComponent === 'pagination' && (
            <>
              <section>
                <h2 className="section-title">
                  <span>📄</span> Pagination & Page Size Selector
                </h2>
                <div className="playground-section">
                  {/* Settings Panel */}
                  <div className="playground-card" style={{ height: 'fit-content' }}>
                    <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem', color: 'var(--ctp-mauve)' }}>Pagination Settings</h3>

                    <div className="control-grid">
                      <div className="control-group">
                        <label htmlFor="pag-color-select">Accent Color Accent</label>
                        <select
                          id="pag-color-select"
                          value={paginationColor}
                          onChange={(e) => setPaginationColor(e.target.value as FormControlColor)}
                        >
                          <option value="mauve">Mauve</option>
                          <option value="rosewater">Rosewater</option>
                          <option value="flamingo">Flamingo</option>
                          <option value="pink">Pink</option>
                          <option value="red">Red</option>
                          <option value="maroon">Maroon</option>
                          <option value="peach">Peach</option>
                          <option value="yellow">Yellow</option>
                          <option value="green">Green</option>
                          <option value="teal">Teal</option>
                          <option value="sky">Sky</option>
                          <option value="sapphire">Sapphire</option>
                          <option value="blue">Blue</option>
                          <option value="lavender">Lavender</option>
                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="pag-size-select">Component Size</label>
                        <select
                          id="pag-size-select"
                          value={paginationSize}
                          onChange={(e) => setPaginationSize(e.target.value as FormControlSize)}
                        >
                          <option value="sm">Small (sm)</option>
                          <option value="md">Medium (md)</option>
                          <option value="lg">Large (lg)</option>
                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="pag-shape-select">Button Shape</label>
                        <select
                          id="pag-shape-select"
                          value={paginationShape}
                          onChange={(e) => setPaginationShape(e.target.value as FormControlShape)}
                        >
                          <option value="square">Square</option>
                          <option value="rounded">Rounded</option>
                          <option value="pill">Pill</option>

                        </select>
                      </div>

                      <div className="control-group">
                        <label htmlFor="pag-sibling-select">Sibling Pages Count</label>
                        <select
                          id="pag-sibling-select"
                          value={paginationSiblingCount}
                          onChange={(e) => setPaginationSiblingCount(Number(e.target.value))}
                        >
                          <option value="1">1 page sibling</option>
                          <option value="2">2 page siblings</option>
                          <option value="3">3 page siblings</option>
                        </select>
                      </div>

                      <div className="control-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={paginationShowFirstLast}
                            onChange={(e) => setPaginationShowFirstLast(e.target.checked)}
                          />
                          Show First/Last buttons
                        </label>
                        <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={paginationShowPrevNext}
                            onChange={(e) => setPaginationShowPrevNext(e.target.checked)}
                          />
                          Show Prev/Next buttons
                        </label>
                        <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={paginationShowPageInput}
                            onChange={(e) => setPaginationShowPageInput(e.target.checked)}
                          />
                          Show manual page input
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Canvas & Live Code */}
                  <div className="playground-card playground-card--preview">
                    <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.2rem' }}>Interactive Demo</h3>

                    <div className="preview-canvas" style={{ minHeight: '380px', flexDirection: 'column', gap: '20px', padding: '1.5rem', justifyContent: 'space-between', backgroundColor: 'var(--ctp-crust)', borderRadius: '8px' }}>

                      {/* paginated items display */}
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--ctp-surface1)', paddingBottom: '0.5rem' }}>
                          <h4 style={{ margin: 0, color: `var(--ctp-${paginationColor})` }}>Catppuccin Ecosystem Ports</h4>
                          <span style={{ fontSize: '0.85rem', color: 'var(--ctp-subtext1)' }}>
                            Mostrando {Math.min((paginationPage - 1) * paginationLimit + 1, mockPorts.length)} - {Math.min(paginationPage * paginationLimit, mockPorts.length)} de {mockPorts.length}
                          </span>
                        </div>

                        <div style={{ display: 'grid', gap: '10px' }}>
                          {mockPorts.slice((paginationPage - 1) * paginationLimit, paginationPage * paginationLimit).map((port, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)' }}>
                              <div>
                                <div style={{ fontWeight: 600, color: 'var(--ctp-text)' }}>{port.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--ctp-overlay1)' }}>Developer: {port.developer}</div>
                              </div>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--ctp-surface1)', color: `var(--ctp-${paginationColor})` }}>{port.category}</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--ctp-yellow)' }}>⭐ {port.stars}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sliced pagination controls */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderTop: '1px solid var(--ctp-surface1)', paddingTop: '1rem' }}>
                        <PageSizeSelector
                          pageSize={paginationLimit}
                          onPageSizeChange={setPaginationLimit}
                          size={paginationSize}
                          shape={paginationShape}
                          color={paginationColor}
                        />

                        <Pagination
                          currentPage={paginationPage}
                          totalPages={Math.ceil(mockPorts.length / paginationLimit)}
                          onPageChange={setPaginationPage}
                          siblingCount={paginationSiblingCount}
                          size={paginationSize}
                          shape={paginationShape}
                          color={paginationColor}
                          showFirstLast={paginationShowFirstLast}
                          showPrevNext={paginationShowPrevNext}
                          showPageInput={paginationShowPageInput}
                        />
                      </div>
                    </div>

                    {/* Code snippets block */}
                    <div style={{ marginTop: '1.5rem' }}>
                      <div className="tabs-header">
                        {(['react', 'vue', 'angular'] as const).map((tab) => (
                          <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </button>
                        ))}
                      </div>

                      <div className="code-container">
                        <button
                          className="code-copy-btn"
                          onClick={() => {
                            const code = activeTab === 'react' ? getReactPaginationCode() : activeTab === 'vue' ? getVuePaginationCode() : getAngularPaginationCode();
                            const plainText = code.replace(/<[^>]*>/g, '');
                            copyToClipboard(plainText, `${activeTab} pagination snippet`);
                          }}
                        >
                          Copy Code
                        </button>
                        <pre className="code-block">
                          <code
                            dangerouslySetInnerHTML={{
                              __html: activeTab === 'react'
                                ? getReactPaginationCode()
                                : activeTab === 'vue'
                                  ? getVuePaginationCode()
                                  : getAngularPaginationCode()
                            }}
                          />
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Split layout usage guide */}
                <div style={{ marginTop: '2rem' }}>
                  <h3 className="section-subtitle" style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--ctp-text)' }}>
                    📖 Modular Split Usage Layout
                  </h3>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '2rem'
                  }}>
                    <div style={{
                      padding: '1.5rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--ctp-mantle)',
                      border: '1px solid var(--ctp-surface0)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--ctp-teal)' }}>
                        Why modular separate components?
                      </h4>
                      <p style={{ margin: 0, color: 'var(--ctp-subtext0)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                        Rather than forcing developers into a single monolithic block, keeping <code>Pagination</code> and <code>PageSizeSelector</code> separate guarantees ultimate layout control.
                      </p>
                      <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--ctp-subtext1)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                        <li>Position rows selector in the top-right and numbers on the bottom-right</li>
                        <li>Align them side-by-side or stack them vertically on mobile</li>
                        <li>Omit the selector entirely for static infinite-scroll or fixed layouts</li>
                        <li>Customize labels, icons, borders, shapes, sizes, and accent colors independently</li>
                      </ul>
                    </div>

                    <div style={{
                      padding: '1.5rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--ctp-mantle)',
                      border: '1px solid var(--ctp-surface0)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--ctp-text)' }}>
                          Ellipsis Boundary Folding Algorithm
                        </h4>
                        <p style={{ margin: 0, color: 'var(--ctp-subtext0)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                          The pagination component includes smart collapsing logic. On larger datasets, the hook truncates intermediate elements, ensuring rendering stays compact and does not wrap or look messy:
                        </p>
                        <div style={{ marginTop: '10px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--ctp-surface1)', color: 'var(--ctp-text)' }}>1</span>
                          <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--ctp-surface1)', color: 'var(--ctp-overlay1)' }}>...</span>
                          <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--ctp-surface1)', color: 'var(--ctp-text)' }}>4</span>
                          <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: `var(--ctp-${paginationColor})`, color: 'var(--ctp-base)', fontWeight: 600 }}>5</span>
                          <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--ctp-surface1)', color: 'var(--ctp-text)' }}>6</span>
                          <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--ctp-surface1)', color: 'var(--ctp-overlay1)' }}>...</span>
                          <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--ctp-surface1)', color: 'var(--ctp-text)' }}>12</span>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid var(--ctp-surface0)', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--ctp-subtext1)' }}>Keyboard friendly</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--ctp-green)' }}>✓ Accessible HTML5 standards</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeComponent === 'table' && (
            <>
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 className="section-title" style={{ margin: 0 }}>
                    {tableSubTab === 'standard' ? (
                      <><span>📊</span> Data Table Dinâmica (Data Grid)</>
                    ) : (
                      <><span>🌲</span> Tabela de Árvore Ordenável (TreeTable)</>
                    )}
                  </h2>

                  <ButtonGroup
                    selectionMode="single"
                    value={tableSubTab}
                    onChange={(val) => {
                      if (val) setTableSubTab(val as 'standard' | 'tree');
                    }}
                  >
                    <ButtonGroupItem value="standard" size="sm" variant={tableSubTab === 'standard' ? 'filled' : 'ghost'} color={tableColor}>
                      📊 Tabela Padrão
                    </ButtonGroupItem>
                    <ButtonGroupItem value="tree" size="sm" variant={tableSubTab === 'tree' ? 'filled' : 'ghost'} color={tableColor}>
                      🌲 Tabela de Árvore
                    </ButtonGroupItem>
                  </ButtonGroup>
                </div>

                <p style={{ color: 'var(--ctp-subtext0)', margin: '-1rem 0 1.5rem 0', fontSize: '0.95rem' }}>
                  {tableSubTab === 'standard' ? (
                    'Um componente de Grid altamente dinâmico com modos Client-side e Server-side, paginação e ordenação controladas, edição inline e visualizador de logs de API.'
                  ) : (
                    'Um componente para visualização hierárquica (Tree Table) com ordenação recursiva de irmãos, seleção em cascata bidirecional e conectores visuais de profundidade.'
                  )}
                </p>
              </section>

              {tableSubTab === 'standard' ? (
                <>
                  <section>
                    {/* Metrics Bar */}
                <div className="metrics-grid" style={{ marginBottom: '1.5rem' }}>
                  <div className="metric-card glass-panel">
                    <div className="metric-info">
                      <span className="metric-title">Total Funcionários</span>
                      <span className="metric-value">{tableTotalItems}</span>
                      <span className="metric-sub">Base de dados ativa</span>
                    </div>
                    <div className="metric-icon-box">👥</div>
                  </div>
                  <div className="metric-card glass-panel">
                    <div className="metric-info">
                      <span className="metric-title">Média Salarial</span>
                      <span className="metric-value">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(
                          tableData.length > 0
                            ? tableData.reduce((acc, curr) => acc + curr.salary, 0) / tableData.length
                            : 0
                        )}
                      </span>
                      <span className="metric-sub">Conjunto carregado</span>
                    </div>
                    <div className="metric-icon-box">💰</div>
                  </div>
                  <div className="metric-card glass-panel">
                    <div className="metric-info">
                      <span className="metric-title">Ativos / Inativos</span>
                      <span className="metric-value">
                        {tableData.filter(e => e.status === 'Active').length} / {tableData.filter(e => e.status === 'Inactive').length}
                      </span>
                      <span className="metric-sub">Status dos carregados</span>
                    </div>
                    <div className="metric-icon-box">⚡</div>
                  </div>
                  <div className="metric-card glass-panel">
                    <div className="metric-info">
                      <span className="metric-title">Itens Selecionados</span>
                      <span className="metric-value">{selectedTableIds.length}</span>
                      <span className="metric-sub">Ações em lote disponíveis</span>
                    </div>
                    <div className="metric-icon-box">✓</div>
                  </div>
                </div>

                <div className="playground-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Controls and Filters Area */}
                  <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      {/* Mode switch */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ctp-text)' }}>Modo:</span>
                        <ButtonGroup
                          selectionMode="single"
                          value={tableMode}
                          onChange={(val) => {
                            if (val) {
                              setTableMode(val as 'client' | 'server');
                              setSelectedTableIds([]);
                            }
                          }}
                          orientation="horizontal"
                        >
                          <ButtonGroupItem value="client" variant={tableMode === 'client' ? 'filled' : 'ghost'} color={tableColor} size="sm">
                            Client-side
                          </ButtonGroupItem>
                          <ButtonGroupItem value="server" variant={tableMode === 'server' ? 'filled' : 'ghost'} color={tableColor} size="sm">
                            Server-side
                          </ButtonGroupItem>
                        </ButtonGroup>
                      </div>

                      {/* Design Settings */}
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <Select
                          value={tableColor}
                          onChange={(e) => setTableColor(e.target.value as FormControlColor)}
                          size="sm"
                          color={tableColor}
                          style={{ minWidth: '120px' }}
                        >
                          <option value="mauve">Mauve</option>
                          <option value="blue">Blue</option>
                          <option value="green">Green</option>
                          <option value="red">Red</option>
                          <option value="yellow">Yellow</option>
                          <option value="pink">Pink</option>
                          <option value="teal">Teal</option>
                        </Select>

                        <Select
                          value={tableSize}
                          onChange={(e) => setTableSize(e.target.value as FormControlSize)}
                          size="sm"
                          color={tableColor}
                          style={{ minWidth: '130px' }}
                        >
                          <option value="sm">Pequeno (sm)</option>
                          <option value="md">Médio (md)</option>
                          <option value="lg">Grande (lg)</option>
                        </Select>

                        <Button
                          type="button"
                          variant="tonal"
                          color={tableColor}
                          size="sm"
                          leftIcon={<EyeIcon size={14} />}
                          onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                          style={{ position: 'relative' }}
                        >
                          Colunas
                          {showColumnDropdown && (
                            <div className="popover-menu" style={{ top: '100%', right: 0, marginTop: '0.5rem', textAlign: 'left' }}>
                              <div className="popover-header">Exibir Colunas</div>
                              {Object.keys(visibleColumns).map(colKey => (
                                <label key={colKey} className="column-checkbox-label" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="checkbox"
                                    className="table-checkbox"
                                    style={{ marginRight: '8px' }}
                                    checked={visibleColumns[colKey]}
                                    onChange={(e) => setVisibleColumns({ ...visibleColumns, [colKey]: e.target.checked })}
                                  />
                                  {colKey === 'id' ? 'ID' :
                                    colKey === 'name' ? 'Nome' :
                                      colKey === 'email' ? 'E-mail' :
                                        colKey === 'role' ? 'Cargo' :
                                          colKey === 'department' ? 'Departamento' :
                                            colKey === 'status' ? 'Status' :
                                              colKey === 'salary' ? 'Salário' :
                                                colKey === 'joinedDate' ? 'Admissão' : colKey}
                                </label>
                              ))}
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Table Toolbar & Content Container */}
                  <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Search & Filters */}
                    <div className="filter-bar">
                      <div className="filters-left" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div className="search-input-wrapper">
                          <span className="search-icon">
                            <SearchIcon size={14} />
                          </span>
                          <Input
                            type="text"
                            placeholder="Buscar funcionário..."
                            className="search-input"
                            value={tableSearch}
                            onChange={(e) => setTableSearch(e.target.value)}
                            size={tableSize}
                            color={tableColor}
                          />
                        </div>

                        <Select
                          value={tableStatus}
                          onChange={(e) => setTableStatus(e.target.value)}
                          size={tableSize}
                          color={tableColor}
                          style={{ width: '160px' }}
                        >
                          <option value="All">Todos os Status</option>
                          <option value="Active">Ativos</option>
                          <option value="Inactive">Inativos</option>
                          <option value="Pending">Pendentes</option>
                        </Select>

                        <Select
                          value={tableRole}
                          onChange={(e) => setTableRole(e.target.value)}
                          size={tableSize}
                          color={tableColor}
                          style={{ width: '160px' }}
                        >
                          <option value="All">Todos os Cargos</option>
                          {getFilterMetadata().roles.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </Select>
                      </div>

                      <div className="filters-right" style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          type="button"
                          variant="tonal"
                          color={tableColor}
                          size={tableSize}
                          leftIcon={<DownloadIcon size={14} />}
                          onClick={exportTableToCSV}
                        >
                          Exportar CSV
                        </Button>
                        <Button
                          type="button"
                          variant="filled"
                          color={tableColor}
                          size={tableSize}
                          leftIcon={<PlusIcon size={14} />}
                          onClick={() => setShowAddModal(true)}
                        >
                          Novo Funcionário
                        </Button>
                      </div>
                    </div>

                    {/* Bulk Actions Inline Bar (Dribbble-inspired, above the header) */}
                    {selectedTableIds.length > 0 && (
                      <div className="bulk-actions-inline">
                        <div className="bulk-actions-inline-left">
                          <span className="bulk-actions-inline-arrow">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 14 4 9 9 4" />
                              <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
                            </svg>
                          </span>
                          <span>{selectedTableIds.length} selecionados</span>
                        </div>
                        <div className="bulk-actions-inline-right">
                          <button
                            type="button"
                            className="bulk-actions-btn"
                            onClick={() => showToast("Dica: Dê um duplo clique nas células de Cargo ou Salário dos funcionários para editar!")}
                            title="Dica de Edição"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="bulk-actions-btn"
                            onClick={exportSelectedToCSV}
                            title="Exportar Selecionados para CSV"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="bulk-actions-btn bulk-actions-btn--danger"
                            onClick={handleTableDeleteMultiple}
                            title="Excluir Selecionados"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="bulk-actions-btn"
                            onClick={() => setSelectedTableIds([])}
                            title="Cancelar Seleção"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* The Table Wrapper */}
                    <div className="table-wrapper">
                      <Table<Employee>
                        data={tableData}
                        columns={([
                          { key: 'id', header: 'ID', sortable: true },
                          { key: 'name', header: 'Nome', sortable: true },
                          { key: 'email', header: 'E-mail', sortable: true },
                          { key: 'role', header: 'Cargo', sortable: true, editable: true },
                          { key: 'department', header: 'Departamento' },
                          {
                            key: 'status',
                            header: 'Status',
                            sortable: true,
                            render: (_: Employee, value: any) => {
                              const badgeClass = `table-badge table-badge--${value.toLowerCase()}`;
                              const label = value === 'Active' ? 'Ativo' : value === 'Inactive' ? 'Inativo' : 'Pendente';
                              return (
                                <span className={badgeClass}>
                                  <span className="badge-dot" />
                                  {label}
                                </span>
                              );
                            }
                          },
                          {
                            key: 'salary',
                            header: 'Salário',
                            sortable: true,
                            editable: true,
                            align: 'right' as const,
                            render: (_: Employee, value: any) => {
                              return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(value));
                            }
                          },
                          {
                            key: 'joinedDate',
                            header: 'Admissão',
                            sortable: true,
                            render: (_: Employee, value: any) => {
                              const parts = String(value).split('-');
                              return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : String(value);
                            }
                          },
                          {
                            key: 'actions',
                            header: 'Ações',
                            align: 'center' as const,
                            render: (row: Employee) => (
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                <button
                                  type="button"
                                  className="table-action-btn"
                                  onClick={() => {
                                    showToast("Dica: Dê um duplo clique nas células de Cargo ou Salário para editar!");
                                  }}
                                  title="Editar cargo ou salário (clique duplo nas células)"
                                >
                                  <EditIcon size={14} />
                                </button>
                                <button
                                  type="button"
                                  className="table-action-btn table-action-btn--danger"
                                  onClick={() => handleTableDeleteRow(row.id)}
                                  title="Excluir funcionário"
                                >
                                  <TrashIcon size={14} />
                                </button>
                              </div>
                            )
                          }
                        ] as Column<Employee>[]).filter(col => col.key === 'actions' || visibleColumns[col.key])}
                        rowKey={(row) => row.id}
                        sortField={tableSortField}
                        sortOrder={tableSortOrder}
                        onSort={handleTableSort}
                        selectedRowIds={selectedTableIds}
                        onSelectionChange={setSelectedTableIds}
                        onCellEdit={handleTableCellEdit}
                        isLoading={tableIsLoading}
                        size={tableSize}
                        color={tableColor}
                        emptyState="Nenhum funcionário encontrado com os filtros ativos."
                      />
                    </div>

                    {/* Table Footer with custom layout of Pagination controls */}
                    <div className="pagination-bar" style={{ borderTop: '1px solid var(--ctp-surface2)' }}>
                      <div className="pagination-left">
                        <PageSizeSelector
                          pageSize={tableLimit}
                          onPageSizeChange={setTableLimit}
                          size={tableSize}
                          color={tableColor}
                        />
                        <span style={{ fontSize: '0.85rem', color: 'var(--ctp-subtext1)' }}>
                          Total de registros: <strong>{tableTotalItems}</strong>
                        </span>
                      </div>

                      <Pagination
                        currentPage={tablePage}
                        totalPages={tableTotalPages}
                        onPageChange={setTablePage}
                        size={tableSize}
                        color={tableColor}
                        showFirstLast={true}
                        showPrevNext={true}
                      />
                    </div>
                  </div>

                  {/* API Inspector Logs Console */}
                  <div className="api-inspector">
                    <div className="inspector-header">
                      <div className="inspector-title">
                        <span className={`status-dot ${tableIsLoading ? 'loading' : ''}`} />
                        API REQUEST INSPECTOR {tableMode === 'client' ? '(In-Memory Local Mode)' : '(Simulated HTTP REST)'}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--ctp-overlay1)' }}>Apenas requisições GET do servidor mock</span>
                    </div>
                    <div className="inspector-body">
                      {tableMode === 'client' ? (
                        <div style={{ color: 'var(--ctp-overlay1)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                          Operações realizadas em memória no cliente. Nenhuma chamada de API efetuada.
                        </div>
                      ) : apiLogs.length === 0 ? (
                        <div style={{ color: 'var(--ctp-overlay1)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                          Nenhuma requisição registrada ainda. Altere filtros ou mude de página.
                        </div>
                      ) : (
                        apiLogs.map(log => (
                          <div key={log.id} className="log-entry">
                            <span className="log-time">[{log.time}]</span>
                            <span className="log-method">{log.method}</span>
                            <span className="log-url">{log.url}</span>
                            <span className="log-meta">{log.meta}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Playground Code Display */}
                  <div>
                    <div className="tabs-header">
                      {(['react', 'vue', 'angular'] as const).map((tab) => (
                        <button
                          key={tab}
                          className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>

                    <div className="code-container">
                      <button
                        className="code-copy-btn"
                        onClick={() => {
                          const code = activeTab === 'react' ? getReactTableCode() : activeTab === 'vue' ? getVueTableCode() : getAngularTableCode();
                          const plainText = code.replace(/<[^>]*>/g, '');
                          copyToClipboard(plainText, `${activeTab} table snippet`);
                        }}
                      >
                        Copy Code
                      </button>
                      <pre className="code-block">
                        <code
                          dangerouslySetInnerHTML={{
                            __html: activeTab === 'react'
                              ? getReactTableCode()
                              : activeTab === 'vue'
                                ? getVueTableCode()
                                : getAngularTableCode()
                          }}
                        />
                      </pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* Add Employee Modal */}
              <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                size="md"
                title="Cadastrar Novo Funcionário"
                footer={
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
                    <Button variant="ghost" color="lavender" onClick={() => setShowAddModal(false)}>Cancelar</Button>
                    <Button variant="filled" color="green" onClick={handleTableAddRow}>Cadastrar</Button>
                  </div>
                }
              >
                <form onSubmit={handleTableAddRow} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
                  <FormGroup label="Nome Completo" required>
                    <Input
                      type="text"
                      placeholder="Ex: Ana Maria Silva"
                      value={newEmpName}
                      onChange={(e) => setNewEmpName(e.target.value)}
                      required
                    />
                  </FormGroup>

                  <FormGroup label="E-mail" required>
                    <Input
                      type="email"
                      placeholder="Ex: ana.silva@empresa.com"
                      value={newEmpEmail}
                      onChange={(e) => setNewEmpEmail(e.target.value)}
                      required
                    />
                  </FormGroup>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormGroup label="Cargo">
                      <Select
                        value={newEmpRole}
                        onChange={(e) => setNewEmpRole(e.target.value)}
                      >
                        {getFilterMetadata().roles.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </Select>
                    </FormGroup>

                    <FormGroup label="Status">
                      <Select
                        value={newEmpStatus}
                        onChange={(e) => setNewEmpStatus(e.target.value as any)}
                      >
                        <option value="Active">Ativo</option>
                        <option value="Inactive">Inativo</option>
                        <option value="Pending">Pendente</option>
                      </Select>
                    </FormGroup>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormGroup label="Salário Mensal (R$)">
                      <Input
                        type="number"
                        min="1000"
                        placeholder="Ex: 5000"
                        value={newEmpSalary}
                        onChange={(e) => setNewEmpSalary(e.target.value)}
                      />
                    </FormGroup>

                    <FormGroup label="Data de Admissão">
                      <Input
                        type="date"
                        value={newEmpJoinedDate}
                        onChange={(e) => setNewEmpJoinedDate(e.target.value)}
                      />
                    </FormGroup>
                  </div>
                </form>
              </Modal>
            </>
          ) : (
            <>
              {/* Tree Table Metrics Bar */}
              <div className="metrics-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="metric-card glass-panel">
                  <div className="metric-info">
                    <span className="metric-title">Total Pastas</span>
                    <span className="metric-value">{treeStats.foldersCount}</span>
                    <span className="metric-sub">Diretórios no total</span>
                  </div>
                  <div className="metric-icon-box">📁</div>
                </div>
                <div className="metric-card glass-panel">
                  <div className="metric-info">
                    <span className="metric-title">Total Arquivos</span>
                    <span className="metric-value">{treeStats.filesCount}</span>
                    <span className="metric-sub">Arquivos nas subpastas</span>
                  </div>
                  <div className="metric-icon-box">📄</div>
                </div>
                <div className="metric-card glass-panel">
                  <div className="metric-info">
                    <span className="metric-title">Tamanho Total</span>
                    <span className="metric-value">{treeStats.totalSize}</span>
                    <span className="metric-sub">Espaço em disco</span>
                  </div>
                  <div className="metric-icon-box">💾</div>
                </div>
                <div className="metric-card glass-panel">
                  <div className="metric-info">
                    <span className="metric-title">Itens Selecionados</span>
                    <span className="metric-value">{treeSelectedIds.length}</span>
                    <span className="metric-sub">Seleção em cascata ativa</span>
                  </div>
                  <div className="metric-icon-box">✓</div>
                </div>
              </div>

              <div className="playground-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Controls and Filters Area */}
                <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    {/* Left quick actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Button
                        type="button"
                        variant="tonal"
                        color={treeColor}
                        size="sm"
                        onClick={() => {
                          const allIds: (string | number)[] = [];
                          const addIds = (nodes: FileNode[]) => {
                            nodes.forEach(node => {
                              if (node.children && node.children.length > 0) {
                                allIds.push(node.id);
                                addIds(node.children);
                              }
                            });
                          };
                          addIds(initialFilesData);
                          setTreeExpandedIds(allIds);
                        }}
                      >
                        📂 Expandir Tudo
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        color={treeColor}
                        size="sm"
                        onClick={() => setTreeExpandedIds([])}
                      >
                        📁 Colapsar Tudo
                      </Button>
                    </div>

                    {/* Design Settings */}
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--ctp-text)' }}>
                        <input
                          type="checkbox"
                          className="table-checkbox"
                          checked={treeCascade}
                          onChange={(e) => setTreeCascade(e.target.checked)}
                        />
                        Seleção em Cascata
                      </label>

                      <Select
                        value={treeColor}
                        onChange={(e) => setTreeColor(e.target.value as FormControlColor)}
                        size="sm"
                        color={treeColor}
                        style={{ minWidth: '120px' }}
                      >
                        <option value="mauve">Mauve</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="red">Red</option>
                        <option value="yellow">Yellow</option>
                        <option value="pink">Pink</option>
                        <option value="teal">Teal</option>
                      </Select>

                      <Select
                        value={treeSize}
                        onChange={(e) => setTreeSize(e.target.value as FormControlSize)}
                        size="sm"
                        color={treeColor}
                        style={{ minWidth: '130px' }}
                      >
                        <option value="sm">Pequeno (sm)</option>
                        <option value="md">Médio (md)</option>
                        <option value="lg">Grande (lg)</option>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* TreeTable Content Container */}
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Search & Filters */}
                  <div className="filter-bar" style={{ borderBottom: '1px solid var(--ctp-surface0)', padding: '1rem' }}>
                    <div className="filters-left" style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
                      <div className="search-input-wrapper" style={{ width: '100%', maxWidth: '400px' }}>
                        <span className="search-icon">
                          <SearchIcon size={14} />
                        </span>
                        <Input
                          type="text"
                          placeholder="Buscar pasta ou arquivo..."
                          className="search-input"
                          value={treeSearch}
                          onChange={(e) => setTreeSearch(e.target.value)}
                          size={treeSize}
                          color={treeColor}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tree Table component */}
                  <div style={{ padding: '1rem' }}>
                    <TreeTable<FileNode>
                      data={initialFilesData}
                      columns={treeColumns}
                      rowKey={(row) => row.id}
                      childrenKey="children"
                      sortField={treeSortField}
                      sortOrder={treeSortOrder}
                      onSort={(field, order) => {
                        setTreeSortField(field);
                        setTreeSortOrder(order);
                      }}
                      expandedRowIds={treeExpandedIds}
                      onExpandedRowsChange={setTreeExpandedIds}
                      selectedRowIds={treeSelectedIds}
                      onSelectionChange={setTreeSelectedIds}
                      cascadeSelection={treeCascade}
                      size={treeSize}
                      color={treeColor}
                      globalFilter={treeSearch}
                      globalFilterFields={['name', 'type', 'size']}
                    />
                  </div>
                </div>
              </div>

              {/* Developer Code Documentation */}
              <div style={{ marginTop: '2rem' }}>
                <h3 className="section-subtitle" style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--ctp-text)' }}>
                  📖 Exemplo de Uso do Componente
                </h3>

                <pre className="code-block" style={{ fontSize: '0.85rem' }}>
                  <code>{`import { TreeTable, TreeColumn } from '@mocha-ds/react';

const columns: TreeColumn<FileNode>[] = [
  {
    key: 'name',
    header: 'Nome',
    sortable: true,
    render: (row, value, depth, isExpanded, hasChildren) => (
      <span>{row.type === 'Diretório' ? '📁' : '📄'} {value}</span>
    )
  },
  {
    key: 'size',
    header: 'Tamanho',
    sortable: true,
    align: 'right',
    sortValue: (row) => row.sizeBytes // Ordenação numérica por bytes!
  }
];

<TreeTable
  data={data}
  columns={columns}
  rowKey={(row) => row.id}
  childrenKey="children"
  cascadeSelection={true}
  size="md"
  color="mauve"
  globalFilter={searchQuery}
  globalFilterFields={['name', 'type']}
/>`}</code>
                </pre>
              </div>
            </>
          )}
        </>
      )}

          {activeComponent === 'card' && (
            <>
              <section>
                <h2 className="section-title">
                  <span>🎴</span> Card Components Showcase
                </h2>

                <div className="playground-section">
                  {/* Left Column: Visual demo */}
                  <div className="demo-stage">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>

                      {/* Subsection A: Card Variants */}
                      <div>
                        <h3 className="stage-title">Card Variants</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                          <Card variant="filled" padding="md">
                            <Card.Header title="Filled Variant" subtitle="Default cozy backdrop" />
                            <Card.Body>
                              This card has a solid background with a very subtle border and standard shadow.
                            </Card.Body>
                          </Card>
                          <Card variant="elevated" padding="md">
                            <Card.Header title="Elevated Variant" subtitle="Floating layer feel" />
                            <Card.Body>
                              This card utilizes a larger, softer box shadow to feel physically raised above the canvas.
                            </Card.Body>
                          </Card>
                          <Card variant="outline" padding="md">
                            <Card.Header title="Outline Variant" subtitle="Minimalist container" />
                            <Card.Body>
                              This card has a transparent background and a thin solid border outlining its edges.
                            </Card.Body>
                          </Card>
                          <Card variant="flat" padding="md">
                            <Card.Header title="Flat Variant" subtitle="No borders or shadows" />
                            <Card.Body>
                              This card sits flat on the page with a subtle surface background, no border, and no shadow.
                            </Card.Body>
                          </Card>
                        </div>
                      </div>

                      {/* Subsection B: Accent Colored & Interactive Cards */}
                      <div>
                        <h3 className="stage-title">Accents & Colored Background Cards</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                          <Card accentColor="mauve" accentPosition="top" isInteractive padding="md">
                            <Card.Header title="Top Accent Mauve" subtitle="Hover to lift" />
                            <Card.Body>
                              Hovering on this interactive card scales it up gently and highlights the border with the Mauve color.
                            </Card.Body>
                          </Card>
                          <Card accentColor="peach" accentPosition="left" isInteractive padding="md">
                            <Card.Header title="Left Accent Peach" subtitle="Sidebar colored line" />
                            <Card.Body>
                              A thick Peach color bar on the left edge. Great for emphasizing card status or categories.
                            </Card.Body>
                          </Card>
                          <Card variant="colored" accentColor="lavender" isInteractive padding="md">
                            <Card.Header title="Colored Background" subtitle="Lavender Flavor" />
                            <Card.Body>
                              This card has the entire background colored using a Catppuccin accent color. Content colors contrast automatically.
                            </Card.Body>
                          </Card>
                        </div>
                      </div>

                      {/* Subsection C: Rich Content Blog/Profile Card */}
                      <div>
                        <h3 className="stage-title">Rich Content Card</h3>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Card variant="elevated" isInteractive={cardInteractive} accentColor={cardAccent} accentPosition={cardAccentPos} shape={cardShape} padding={cardPadding} style={{ maxWidth: '440px', width: '100%' }}>
                            <Card.Header
                              title="Catppuccin Palettes"
                              subtitle="By CozyDevelopers • 4 hours ago"
                              avatar={
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--ctp-mauve)', color: 'var(--ctp-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                  CD
                                </div>
                              }
                              actions={
                                <button className="modal__close-btn" style={{ padding: '4px' }} title="Options">
                                  💬
                                </button>
                              }
                            />
                            <Card.Media style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--ctp-mauve), var(--ctp-blue))' }}>
                              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--ctp-base)' }}>Visual Banner Area</span>
                            </Card.Media>
                            <Card.Body>
                              <p style={{ margin: 0 }}>
                                Catppuccin is a community-driven, pastel theme designed to be easy on the eyes. It comes in four beautiful flavors: Latte, Frappé, Macchiato, and Mocha.
                              </p>
                            </Card.Body>
                            <Card.Footer>
                              <Button variant="ghost" color="lavender" size="sm">Share</Button>
                              <Button variant="filled" color="mauve" size="sm">Explore</Button>
                            </Card.Footer>
                          </Card>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Right Column: Interactive settings playground */}
                  <div className="playground-controls">
                    <h3 className="controls-title">Interactive Card Builder</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                      <FormGroup label="Card Variant">
                        <Select value={cardVariant} onChange={(e) => setCardVariant(e.target.value as any)}>
                          <option value="filled">Filled (Default)</option>
                          <option value="elevated">Elevated</option>
                          <option value="outline">Outline</option>
                          <option value="flat">Flat</option>
                          <option value="colored">Colored Background</option>
                        </Select>
                      </FormGroup>

                      <FormGroup label="Border Radius Shape">
                        <Select value={cardShape} onChange={(e) => setCardShape(e.target.value as any)}>
                          <option value="square">Square (0px)</option>
                          <option value="rounded">Rounded (12px)</option>
                          <option value="pill">Pill (24px)</option>

                        </Select>
                      </FormGroup>

                      <FormGroup label="Body Padding">
                        <Select value={cardPadding} onChange={(e) => setCardPadding(e.target.value as any)}>
                          <option value="none">None</option>
                          <option value="sm">Small (12px)</option>
                          <option value="md">Medium (20px)</option>
                          <option value="lg">Large (32px)</option>
                        </Select>
                      </FormGroup>

                      <FormGroup label="Accent Color">
                        <Select value={cardAccent} onChange={(e) => setCardAccent(e.target.value as any)}>
                          {colors.map(c => (
                            <option key={c.variable} value={c.name.toLowerCase()}>{c.name}</option>
                          ))}
                        </Select>
                      </FormGroup>

                      <FormGroup label="Accent Position">
                        <Select value={cardAccentPos} onChange={(e) => setCardAccentPos(e.target.value as any)}>
                          <option value="none">None</option>
                          <option value="top">Top Bar</option>
                          <option value="left">Left Bar</option>
                        </Select>
                      </FormGroup>

                      <FormGroup label="Interaction Hover Effect">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={cardInteractive} onChange={(e) => setCardInteractive(e.target.checked)} />
                          <span>Enable Hover Animation</span>
                        </label>
                      </FormGroup>

                    </div>
                  </div>
                </div>
              </section>

              <section style={{ marginTop: '3rem' }}>
                <h2 className="section-title">
                  <span>🏁</span> Tile Components Showcase
                </h2>

                <div className="playground-section">
                  {/* Left Column: Visual demo */}
                  <div className="demo-stage">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>

                      {/* Subsection A: Tile Sizes and Shapes */}
                      <div>
                        <h3 className="stage-title">Sizes & Shapes</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'center' }}>
                            <Tile size="sm" shape="square" title="Small Square" subtitle="8px padding" icon="⚙️" />
                            <Tile size="md" shape="rounded" title="Medium Rounded" subtitle="14px padding" icon="🚀" />
                            <Tile size="lg" shape="pill" title="Large Pill" subtitle="20px padding" icon="💎" />
                          </div>
                        </div>
                      </div>

                      {/* Subsection B: Orientations */}
                      <div>
                        <h3 className="stage-title">Layout Orientations</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                          <Tile orientation="horizontal" title="Horizontal Layout" subtitle="Icon on left, meta on right" icon="⚡" meta="Ctrl+S" />
                          <Tile orientation="vertical" title="Vertical Layout" subtitle="Stack elements aligned left" icon="📅" meta="Amanhã" />
                          <Tile orientation="vertical-center" title="Centered Layout" subtitle="Aligned at the center" icon="🔔" meta="2 novos" />
                        </div>
                      </div>

                      {/* Subsection C: Status indicators and variants */}
                      <div>
                        <h3 className="stage-title">Tonal Backgrounds, Indicators & Colored Backgrounds</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                          <Tile variant="tonal" color="green" indicator="left" icon="✅" title="Concluído" subtitle="Build passou sem avisos" />
                          <Tile variant="tonal" color="yellow" indicator="top" icon="⚠️" title="Atenção" subtitle="Uso de CPU elevado" />
                          <Tile variant="colored" color="mauve" icon="🔮" title="Colored Tile" subtitle="Mauve flavor bg" />
                          <Tile variant="colored" color="peach" icon="🍑" title="Colored Tile" subtitle="Peach flavor bg" />
                          <Tile variant="tonal" color="red" indicator="right" icon="❌" title="Falha" subtitle="14 testes falharam" />
                          <Tile variant="tonal" color="blue" indicator="bottom" icon="ℹ️" title="Informações" subtitle="Versão 1.4.0 activa" />
                        </div>
                      </div>

                      {/* Subsection D: Single & Multi Selection Checklist */}
                      <div>
                        <h3 className="stage-title">Interactive Choice Selection</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                          <div>
                            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--ctp-subtext0)' }}>Radio Selection (Single)</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              <Tile
                                isInteractive
                                isSelected={selectedTileId === 't1'}
                                onClick={() => setSelectedTileId('t1')}
                                title="Plano Padrão"
                                subtitle="10 GB de armazenamento rápido"
                                meta="R$ 15/mês"
                                icon={selectedTileId === 't1' ? '🟢' : '⚪'}
                              />
                              <Tile
                                isInteractive
                                isSelected={selectedTileId === 't2'}
                                onClick={() => setSelectedTileId('t2')}
                                title="Plano Profissional"
                                subtitle="100 GB de armazenamento + CDN"
                                meta="R$ 49/mês"
                                icon={selectedTileId === 't2' ? '🟢' : '⚪'}
                              />
                            </div>
                          </div>

                          <div>
                            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--ctp-subtext0)' }}>Checkbox Selection (Multiple)</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {['m1', 'm2'].map((id, index) => {
                                const isSelected = multiSelectedTileIds.includes(id);
                                const toggleSelect = () => {
                                  setMultiSelectedTileIds(prev =>
                                    isSelected ? prev.filter(i => i !== id) : [...prev, id]
                                  );
                                };
                                return (
                                  <Tile
                                    key={id}
                                    isInteractive
                                    isSelected={isSelected}
                                    onClick={toggleSelect}
                                    title={index === 0 ? "Backup Diário" : "Suporte VIP 24h"}
                                    subtitle={index === 0 ? "Envios agendados automáticos" : "Atendimento imediato"}
                                    meta={index === 0 ? "+ R$ 10" : "+ R$ 25"}
                                    icon={isSelected ? '☑️' : '⏹️'}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Subsection E: Stats Grid (Dashboard Mockup) */}
                      <div>
                        <h3 className="stage-title">Metrics Dashboard Layout</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                          <Tile variant="elevated" color="mauve" indicator="left" orientation="vertical" title="R$ 14.230" subtitle="Receita Mensal" icon="💰" />
                          <Tile variant="elevated" color="sky" indicator="left" orientation="vertical" title="24.5k" subtitle="Visitas Únicas" icon="👥" />
                          <Tile variant="elevated" color="green" indicator="left" orientation="vertical" title="99.98%" subtitle="Uptime API" icon="📈" />
                          <Tile variant="elevated" color="red" indicator="left" orientation="vertical" title="3" subtitle="Erros Pendentes" icon="🐞" />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Right Column: Details */}
                  <div className="playground-controls">
                    <h3 className="controls-title">Card & Tile Features</h3>
                    <div style={{ color: 'var(--ctp-subtext0)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      <p style={{ marginTop: 0 }}>
                        <strong>Cards</strong> are designed for grouped content containing complex data layouts (images, header actions, body texts, action footers).
                      </p>
                      <p>
                        <strong>Tiles</strong> are compact, single-purpose blocks ideal for dashboard metrics grids, interactive item checklist choices, or horizontal list selections.
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', border: '1px solid var(--ctp-surface1)', borderRadius: '8px', backgroundColor: 'var(--ctp-mantle)', marginTop: '1rem' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--ctp-mauve)' }}>Atributos Suportados:</div>
                        <div>• 14 cores do Catppuccin</div>
                        <div>• Variantes de elevação e tonalidades</div>
                        <div>• Layouts horizontal e vertical</div>
                        <div>• Bordas indicativas direcionais</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Playground Code Display */}
                <div style={{ marginTop: '2rem' }}>
                  <div className="tabs-header">
                    {(['react', 'vue', 'angular'] as const).map((tab) => (
                      <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="code-container">
                    <button
                      className="code-copy-btn"
                      onClick={() => {
                        const code = activeTab === 'react' ? getReactCardCode() : activeTab === 'vue' ? getVueCardCode() : getAngularCardCode();
                        const plainText = code.replace(/<[^>]*>/g, '');
                        copyToClipboard(plainText, `${activeTab} card snippet`);
                      }}
                    >
                      Copy Code
                    </button>
                    <pre className="code-block">
                      <code
                        dangerouslySetInnerHTML={{
                          __html: activeTab === 'react'
                            ? getReactCardCode()
                            : activeTab === 'vue'
                              ? getVueCardCode()
                              : getAngularCardCode()
                        }}
                      />
                    </pre>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeComponent === 'icons' && (
            <>
              <section>
                <h2 className="section-title">
                  <span>✨</span> Catppuccin SVG Icons Pack
                </h2>

                <div className="playground-section">
                  {/* Left Column: Icons Grid */}
                  <div className="demo-stage" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                    {/* Search Input */}
                    <div style={{ width: '100%' }}>
                      <input
                        type="text"
                        className="input"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          border: '1px solid var(--ctp-surface1)',
                          backgroundColor: 'var(--ctp-base)',
                          color: 'var(--ctp-text)',
                          outline: 'none',
                        }}
                        placeholder="Search icons (e.g. Cat, Home, Settings)..."
                        value={iconSearch}
                        onChange={(e) => setIconSearch(e.target.value)}
                      />
                    </div>

                    {/* Categories Grid */}
                    {['Catppuccin', 'Celestial', 'Data & Connections', 'UI & Layout', 'CRUD Actions'].map((category) => {
                      const filtered = iconList.filter(
                        (icon) =>
                          icon.category === category &&
                          icon.name.toLowerCase().includes(iconSearch.toLowerCase())
                      );

                      if (filtered.length === 0) return null;

                      return (
                        <div key={category} style={{ width: '100%' }}>
                          <h3 className="stage-title" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ctp-surface0)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--ctp-mauve)' }}>
                            {category} Icons
                            <span style={{ fontSize: '0.8rem', color: 'var(--ctp-subtext0)', fontWeight: 'normal', marginLeft: 'auto' }}>
                              {filtered.length} icons
                            </span>
                          </h3>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem' }}>
                            {filtered.map((item) => {
                              const IconComponent = item.component;
                              const isSelected = selectedIconName === item.name;
                              const className = iconHoverEffect !== 'none' ? `icon--hover-${iconHoverEffect}` : '';

                              return (
                                <button
                                  key={item.name}
                                  onClick={() => setSelectedIconName(item.name)}
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '1rem 0.5rem',
                                    borderRadius: '8px',
                                    border: isSelected ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)',
                                    backgroundColor: isSelected ? 'var(--ctp-surface0)' : 'var(--ctp-mantle)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    outline: 'none',
                                    color: isSelected ? 'var(--ctp-mauve)' : 'var(--ctp-text)',
                                  }}
                                  className="icon-grid-btn"
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px' }}>
                                    <IconComponent
                                      size={iconSize}
                                      color={iconColor}
                                      strokeWidth={iconStroke}
                                      className={className}
                                    />
                                  </div>
                                  <span style={{ fontSize: '0.75rem', wordBreak: 'break-all', textAlign: 'center' }}>
                                    {item.name}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column: Customizer Controls */}
                  <div className="playground-controls">
                    <h3 className="controls-title">Icon Customizer</h3>

                    <div className="control-group">
                      <label className="control-label">Stroke Width ({iconStroke.toFixed(1)}px)</label>
                      <input
                        type="range"
                        min="1.0"
                        max="3.0"
                        step="0.5"
                        value={iconStroke}
                        onChange={(e) => setIconStroke(parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--ctp-mauve)', cursor: 'pointer' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--ctp-subtext0)', marginTop: '4px' }}>
                        <span>1.0 (Lightest)</span>
                        <span>3.0 (Bold)</span>
                      </div>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.25rem' }}>
                      <label className="control-label">Size ({iconSize}px)</label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {[16, 24, 32, 48, 64].map((size) => (
                          <button
                            key={size}
                            onClick={() => setIconSize(size)}
                            style={{
                              flex: 1,
                              padding: '0.3rem 0',
                              fontSize: '0.8rem',
                              borderRadius: '6px',
                              border: iconSize === size ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)',
                              backgroundColor: iconSize === size ? 'var(--ctp-mauve)' : 'transparent',
                              color: iconSize === size ? 'var(--ctp-base)' : 'var(--ctp-text)',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                            }}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.25rem' }}>
                      <label className="control-label">Color Theme</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
                        <button
                          onClick={() => setIconColor('text')}
                          title="Default Text Color"
                          style={{
                            height: '24px',
                            borderRadius: '4px',
                            border: iconColor === 'text' ? '2px solid white' : '1px solid var(--ctp-surface1)',
                            backgroundColor: 'var(--ctp-text)',
                            cursor: 'pointer',
                          }}
                        />
                        {['rosewater', 'flamingo', 'pink', 'mauve', 'red', 'peach', 'yellow', 'green', 'teal', 'blue', 'sky', 'lavender', 'sapphire', 'maroon'].map((c) => (
                          <button
                            key={c}
                            onClick={() => setIconColor(c)}
                            title={c.charAt(0).toUpperCase() + c.slice(1)}
                            style={{
                              height: '24px',
                              borderRadius: '4px',
                              border: iconColor === c ? '2px solid white' : '1px solid var(--ctp-surface1)',
                              backgroundColor: `var(--ctp-${c})`,
                              cursor: 'pointer',
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.25rem' }}>
                      <label className="control-label">Hover Animation Effect</label>
                      <select
                        value={iconHoverEffect}
                        onChange={(e) => setIconHoverEffect(e.target.value as any)}
                        className="input"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--ctp-surface1)', backgroundColor: 'var(--ctp-base)', color: 'var(--ctp-text)', cursor: 'pointer' }}
                      >
                        <option value="none">None (Static)</option>
                        <option value="spin">Spin (Settings)</option>
                        <option value="bounce">Bounce Up (Bell/Home)</option>
                        <option value="scale">Scale Up (Heart/Star)</option>
                        <option value="wiggle">Wiggle (Fish/Chat)</option>
                        <option value="pulse">Pulse Loop (Continuous)</option>
                      </select>
                    </div>

                    <div style={{ marginTop: '1.5rem', padding: '12px', border: '1px solid var(--ctp-surface1)', borderRadius: '8px', backgroundColor: 'var(--ctp-mantle)', color: 'var(--ctp-subtext0)', fontSize: '0.8rem', lineHeight: '1.4' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--ctp-mauve)', marginBottom: '4px' }}>Developer Info:</div>
                      Our icons are pure vector SVGs. They scale beautifully to any size without losing crispness and respond instantly to Catppuccin color accents.
                    </div>
                  </div>
                </div>

                {/* Playground Code Display */}
                <div style={{ marginTop: '2rem' }}>
                  <div className="tabs-header" style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--ctp-surface1)', paddingBottom: '1px' }}>
                    {['react', 'vue', 'angular', 'svg'].map((tab) => (
                      <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => {
                          setActiveTab(tab as any);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          border: 'none',
                          background: 'none',
                          color: activeTab === tab ? 'var(--ctp-mauve)' : 'var(--ctp-subtext0)',
                          borderBottom: activeTab === tab ? '2px solid var(--ctp-mauve)' : 'none',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: activeTab === tab ? 'bold' : 'normal',
                        }}
                      >
                        {tab === 'svg' ? 'SVG Raw XML' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="code-container" style={{ position: 'relative', marginTop: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                      className="code-copy-btn"
                      onClick={() => {
                        const code = activeTab === 'react'
                          ? getReactIconCode()
                          : activeTab === 'vue'
                            ? getVueIconCode()
                            : activeTab === 'angular'
                              ? getAngularIconCode()
                              : getSvgIconCode();
                        const plainText = code.replace(/<[^>]*>/g, '');
                        copyToClipboard(plainText, `${activeTab} icon snippet`);
                      }}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        padding: '0.3rem 0.6rem',
                        fontSize: '0.8rem',
                        borderRadius: '4px',
                        border: '1px solid var(--ctp-surface1)',
                        backgroundColor: 'var(--ctp-surface0)',
                        color: 'var(--ctp-text)',
                        cursor: 'pointer',
                      }}
                    >
                      Copy Code
                    </button>
                    <pre className="code-block" style={{ margin: 0, padding: '1rem', overflowX: 'auto', backgroundColor: 'var(--ctp-mantle)', borderRadius: '8px' }}>
                      <code
                        dangerouslySetInnerHTML={{
                          __html: activeTab === 'react'
                            ? getReactIconCode()
                            : activeTab === 'vue'
                              ? getVueIconCode()
                              : activeTab === 'angular'
                                ? getAngularIconCode()
                                : getSvgIconCode()
                        }}
                      />
                    </pre>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeComponent === 'badge' && (
            <>
              <section>
                <h2 className="section-title">
                  <span>📇</span> Badges & Tags Component
                </h2>

                <div className="playground-section">
                  {/* Left Column: Visual demo */}
                  <div className="demo-stage">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>

                      {/* Subsection A: Badge Variants */}
                      <div>
                        <h3 className="stage-title">Badge Variants</h3>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          <Badge variant="filled" color="mauve">Filled (Default)</Badge>
                          <Badge variant="tonal" color="mauve">Tonal Tint</Badge>
                          <Badge variant="outline" color="mauve">Outline Border</Badge>
                          <Badge variant="flat">Flat Surface</Badge>
                        </div>
                      </div>

                      {/* Subsection B: Shapes and Sizes */}
                      <div>
                        <h3 className="stage-title">Shapes & Sizes</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--ctp-subtext0)' }}>Pill Shape (Default)</span>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <Badge size="sm" shape="pill" color="blue">Small</Badge>
                                <Badge size="md" shape="pill" color="blue">Medium</Badge>
                                <Badge size="lg" shape="pill" color="blue">Large</Badge>
                              </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--ctp-subtext0)' }}>Rounded Shape (4px)</span>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <Badge size="sm" shape="rounded" color="peach">Small</Badge>
                                <Badge size="md" shape="rounded" color="peach">Medium</Badge>
                                <Badge size="lg" shape="rounded" color="peach">Large</Badge>
                              </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--ctp-subtext0)' }}>Square Shape (0px)</span>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <Badge size="sm" shape="square" color="green">Small</Badge>
                                <Badge size="md" shape="square" color="green">Medium</Badge>
                                <Badge size="lg" shape="square" color="green">Large</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Subsection C: Palette Showcase */}
                      <div>
                        <h3 className="stage-title">Palette Color Choices</h3>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {(['rosewater', 'flamingo', 'pink', 'mauve', 'red', 'maroon', 'peach', 'yellow', 'green', 'teal', 'sky', 'sapphire', 'blue', 'lavender'] as const).map(color => (
                            <Badge key={color} variant="tonal" color={color} shape="pill">
                              {color.charAt(0).toUpperCase() + color.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Subsection D: Dismissible / Closable Tags */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <h3 className="stage-title" style={{ margin: 0 }}>Closable Tags Cloud</h3>
                          {demoTags.length < 6 && (
                            <Button variant="ghost" color="mauve" size="sm" onClick={() => setDemoTags(['TypeScript', 'React', 'Vue', 'Angular', 'CSS', 'Svelte'])}>
                              Reset Tags
                            </Button>
                          )}
                        </div>
                        {demoTags.length === 0 ? (
                          <div style={{ padding: '16px', border: '1px dashed var(--ctp-surface2)', borderRadius: '8px', textAlign: 'center', color: 'var(--ctp-subtext0)', fontSize: '0.9rem' }}>
                            All tags dismissed. Click "Reset Tags" to load again.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {demoTags.map(tag => (
                              <Badge
                                key={tag}
                                variant="tonal"
                                color="lavender"
                                isDismissible
                                onDismiss={() => setDemoTags(prev => prev.filter(t => t !== tag))}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Subsection E: Real-world status tags mockup */}
                      <div>
                        <h3 className="stage-title">Real-world Status Mockups</h3>
                        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: '1px solid var(--ctp-surface0)', borderRadius: '8px', backgroundColor: 'var(--ctp-surface0)' }}>
                            <span style={{ fontWeight: '500' }}>Task Compile Script</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <Badge variant="filled" color="green" icon="✓">Successful</Badge>
                              <Badge variant="tonal" color="mauve">v1.2.0</Badge>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: '1px solid var(--ctp-surface0)', borderRadius: '8px', backgroundColor: 'var(--ctp-surface0)' }}>
                            <span style={{ fontWeight: '500' }}>Deploying Production Cluster</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <Badge variant="filled" color="yellow" icon="⚙️">Pending</Badge>
                              <Badge variant="outline" color="yellow">Auth required</Badge>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: '1px solid var(--ctp-surface0)', borderRadius: '8px', backgroundColor: 'var(--ctp-surface0)' }}>
                            <span style={{ fontWeight: '500' }}>Server Health Check</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <Badge variant="filled" color="red" icon="❌">Failed</Badge>
                              <Badge variant="flat">Incident #8432</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Live Component Preview */}
                      <div style={{ marginTop: '1rem', padding: '1.5rem', border: '1px solid var(--ctp-surface1)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--ctp-mantle)' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--ctp-subtext1)', fontWeight: 'bold' }}>LIVE PREVIEW</span>
                        <Badge
                          variant={badgeVariant}
                          size={badgeSize}
                          shape={badgeShape}
                          color={badgeColor}
                          isDismissible={badgeDismissible}
                          onDismiss={() => showToast('Dismissed live badge!')}
                          icon={badgeHasIcon ? <SparklesIcon /> : undefined}
                        >
                          {badgeText || 'Badge'}
                        </Badge>
                      </div>

                    </div>
                  </div>

                  {/* Right Column: Interactive settings builder */}
                  <div className="playground-controls">
                    <h3 className="controls-title">Interactive Badge Customizer</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                      <FormGroup label="Badge Label Text">
                        <Input
                          type="text"
                          value={badgeText}
                          onChange={(e) => setBadgeText(e.target.value)}
                          placeholder="e.g. New Feature"
                        />
                      </FormGroup>

                      <FormGroup label="Variant style">
                        <Select value={badgeVariant} onChange={(e) => setBadgeVariant(e.target.value as any)}>
                          <option value="filled">Filled (Default)</option>
                          <option value="tonal">Tonal</option>
                          <option value="outline">Outline</option>
                          <option value="flat">Flat</option>
                        </Select>
                      </FormGroup>

                      <FormGroup label="Size font/padding">
                        <Select value={badgeSize} onChange={(e) => setBadgeSize(e.target.value as any)}>
                          <option value="sm">Small</option>
                          <option value="md">Medium</option>
                          <option value="lg">Large</option>
                        </Select>
                      </FormGroup>

                      <FormGroup label="Border Shape">
                        <Select value={badgeShape} onChange={(e) => setBadgeShape(e.target.value as any)}>
                          <option value="square">Square (0px)</option>
                          <option value="rounded">Rounded (4px)</option>
                          <option value="pill">Pill (Fully rounded)</option>

                        </Select>
                      </FormGroup>

                      <FormGroup label="Theme Accent Color">
                        <Select value={badgeColor} onChange={(e) => setBadgeColor(e.target.value as any)}>
                          {colors.map(c => (
                            <option key={c.variable} value={c.name.toLowerCase()}>{c.name}</option>
                          ))}
                        </Select>
                      </FormGroup>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={badgeHasIcon} onChange={(e) => setBadgeHasIcon(e.target.checked)} />
                          <span>Include Leading Icon</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={badgeDismissible} onChange={(e) => setBadgeDismissible(e.target.checked)} />
                          <span>Dismissible (Close x button)</span>
                        </label>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Playground Code Display */}
                <div style={{ marginTop: '2rem' }}>
                  <div className="tabs-header">
                    {(['react', 'vue', 'angular'] as const).map((tab) => (
                      <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="code-container">
                    <button
                      className="code-copy-btn"
                      onClick={() => {
                        const code = activeTab === 'react' ? getReactBadgeCode() : activeTab === 'vue' ? getVueBadgeCode() : getAngularBadgeCode();
                        const plainText = code.replace(/<[^>]*>/g, '');
                        copyToClipboard(plainText, `${activeTab} badge snippet`);
                      }}
                    >
                      Copy Code
                    </button>
                    <pre className="code-block">
                      <code
                        dangerouslySetInnerHTML={{
                          __html: activeTab === 'react'
                            ? getReactBadgeCode()
                            : activeTab === 'vue'
                              ? getVueBadgeCode()
                              : getAngularBadgeCode()
                        }}
                      />
                    </pre>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeComponent === 'accordion' && (
            <>
              <section>
                <h2 className="section-title">
                  <span>🪗</span> Accordion & Collapse Component
                </h2>

                <div className="playground-section">
                  {/* Left Column: Demo Stage */}
                  <div className="demo-stage" style={{ width: '100%' }}>
                    <h3 className="stage-title">Interactive Stage</h3>
                    <div style={{ padding: '2rem', backgroundColor: 'var(--ctp-mantle)', borderRadius: '12px', border: '1px solid var(--ctp-surface0)' }}>
                      <Accordion
                        variant={accordionVariant}
                        colorMode={accordionColorMode}
                        accentColor={accordionAccent as any}
                        allowMultiple={accordionAllowMultiple}
                        value={accordionActiveValue}
                        onValueChange={setAccordionActiveValue}
                      >
                        <Accordion.Item value="item-1">
                          <Accordion.Header>✨ Introdução ao Catppuccin</Accordion.Header>
                          <Accordion.Body>
                            Catppuccin é um tema de cores comunitário super aconchegante e pastel que visa preencher a lacuna entre designs de alto contraste e designs opacos e monótonos. Ele traz 4 flavors maravilhosos (Latte, Frappé, Macchiato e Mocha) para dezenas de aplicativos!
                          </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item value="item-2">
                          <Accordion.Header>📦 Design System Multitecnologia</Accordion.Header>
                          <Accordion.Body>
                            Este design system foi construído em monorepo com pacotes especializados: CSS puro para estilos universais, além de adaptadores ricos em estados para as frameworks mais populares da Web moderna: React, Vue 3 e Angular.
                          </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item value="item-3" disabled>
                          <Accordion.Header>🔒 Funcionalidade Bloqueada (Desabilitado)</Accordion.Header>
                          <Accordion.Body>
                            Este painel está desabilitado e não pode ser aberto pelo usuário. É útil para formulários ou fluxos onde etapas estão travadas até uma ação anterior.
                          </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item value="item-4">
                          <Accordion.Header>🚀 Suporte a Animações Fluidas</Accordion.Header>
                          <Accordion.Body>
                            Usando CSS Grids de transição de linhas (`grid-template-rows`), conseguimos animar o colapso e expansão a partir de altura 0 de forma nativa e extremamente leve, sem cálculos caros de Javascript.
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </div>
                  </div>

                  {/* Right Column: Customizer Controls */}
                  <div className="playground-controls">
                    <h3 className="controls-title">Accordion Customizer</h3>

                    <div className="control-group">
                      <label className="control-label">Layout Variant</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {(['default', 'split'] as const).map((v) => (
                          <button
                            key={v}
                            onClick={() => setAccordionVariant(v)}
                            style={{
                              flex: 1,
                              padding: '0.5rem',
                              borderRadius: '6px',
                              border: accordionVariant === v ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)',
                              backgroundColor: accordionVariant === v ? 'var(--ctp-mauve)' : 'transparent',
                              color: accordionVariant === v ? 'var(--ctp-base)' : 'var(--ctp-text)',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '0.85rem',
                              textTransform: 'capitalize',
                            }}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.25rem' }}>
                      <label className="control-label">Color Mode</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {(['none', 'colored', 'tonal'] as const).map((m) => (
                          <button
                            key={m}
                            onClick={() => setAccordionColorMode(m)}
                            style={{
                              flex: 1,
                              padding: '0.5rem',
                              borderRadius: '6px',
                              border: accordionColorMode === m ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)',
                              backgroundColor: accordionColorMode === m ? 'var(--ctp-mauve)' : 'transparent',
                              color: accordionColorMode === m ? 'var(--ctp-base)' : 'var(--ctp-text)',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '0.85rem',
                              textTransform: 'capitalize',
                            }}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.25rem' }}>
                      <label className="control-label">Expansion Mode</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleAccordionMultipleChange(false)}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: '6px',
                            border: !accordionAllowMultiple ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)',
                            backgroundColor: !accordionAllowMultiple ? 'var(--ctp-mauve)' : 'transparent',
                            color: !accordionAllowMultiple ? 'var(--ctp-base)' : 'var(--ctp-text)',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                          }}
                        >
                          Single (Accordion)
                        </button>
                        <button
                          onClick={() => handleAccordionMultipleChange(true)}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: '6px',
                            border: accordionAllowMultiple ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)',
                            backgroundColor: accordionAllowMultiple ? 'var(--ctp-mauve)' : 'transparent',
                            color: accordionAllowMultiple ? 'var(--ctp-base)' : 'var(--ctp-text)',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                          }}
                        >
                          Multiple (Collapse)
                        </button>
                      </div>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.25rem' }}>
                      <label className="control-label">Accent Color</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
                        {['rosewater', 'flamingo', 'pink', 'mauve', 'red', 'peach', 'yellow', 'green', 'teal', 'blue', 'sky', 'lavender', 'sapphire', 'maroon'].map((c) => (
                          <button
                            key={c}
                            onClick={() => setAccordionAccent(c)}
                            title={c.charAt(0).toUpperCase() + c.slice(1)}
                            style={{
                              height: '24px',
                              borderRadius: '4px',
                              border: accordionAccent === c ? '2px solid white' : '1px solid var(--ctp-surface1)',
                              backgroundColor: `var(--ctp-${c})`,
                              cursor: 'pointer',
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', padding: '12px', border: '1px solid var(--ctp-surface1)', borderRadius: '8px', backgroundColor: 'var(--ctp-mantle)', color: 'var(--ctp-subtext0)', fontSize: '0.8rem', lineHeight: '1.4' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--ctp-mauve)', marginBottom: '4px' }}>Active State:</div>
                      <pre style={{ margin: 0, fontSize: '0.75rem', overflowX: 'auto', color: 'var(--ctp-text)' }}>
                        {JSON.stringify(accordionActiveValue)}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Playground Code Display */}
                <div style={{ marginTop: '2rem' }}>
                  <div className="tabs-header" style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--ctp-surface1)', paddingBottom: '1px' }}>
                    {['react', 'vue', 'angular'].map((tab) => (
                      <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => {
                          setActiveTab(tab as any);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          border: 'none',
                          background: 'none',
                          color: activeTab === tab ? 'var(--ctp-mauve)' : 'var(--ctp-subtext0)',
                          borderBottom: activeTab === tab ? '2px solid var(--ctp-mauve)' : 'none',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: activeTab === tab ? 'bold' : 'normal',
                        }}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="code-container" style={{ position: 'relative', marginTop: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                      className="code-copy-btn"
                      onClick={() => {
                        const code = activeTab === 'react'
                          ? getReactAccordionCode()
                          : activeTab === 'vue'
                            ? getVueAccordionCode()
                            : getAngularAccordionCode();
                        const plainText = code.replace(/<[^>]*>/g, '');
                        copyToClipboard(plainText, `${activeTab} accordion snippet`);
                      }}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        padding: '0.3rem 0.6rem',
                        fontSize: '0.8rem',
                        borderRadius: '4px',
                        border: '1px solid var(--ctp-surface1)',
                        backgroundColor: 'var(--ctp-surface0)',
                        color: 'var(--ctp-text)',
                        cursor: 'pointer',
                      }}
                    >
                      Copy Code
                    </button>
                    <pre className="code-block" style={{ margin: 0, padding: '1rem', overflowX: 'auto', backgroundColor: 'var(--ctp-mantle)', borderRadius: '8px' }}>
                      <code
                        dangerouslySetInnerHTML={{
                          __html: activeTab === 'react'
                            ? getReactAccordionCode()
                            : activeTab === 'vue'
                              ? getVueAccordionCode()
                              : getAngularAccordionCode()
                        }}
                      />
                    </pre>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeComponent === 'dropdown' && (
            <>
              <section>
                <h2 className="section-title">
                  <span>▾</span> Dropdown Portal Component
                </h2>

                <div className="playground-section">
                  {/* Left Column: Demo Stage */}
                  <div className="demo-stage" style={{ width: '100%', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 className="stage-title">Interactive Stage</h3>
                    <div style={{ padding: '4rem 2rem', backgroundColor: 'var(--ctp-mantle)', borderRadius: '12px', border: '1px solid var(--ctp-surface0)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Dropdown
                        trigger={<Button color={dropdownColor}>Abrir Menu de Opções</Button>}
                        placement={dropdownPlacement}
                        color={dropdownColor}
                        closeOnItemClick={dropdownCloseOnItemClick}
                        autoFlip={dropdownAutoFlip}
                      >
                        <Dropdown.Header>Minha Conta</Dropdown.Header>
                        <Dropdown.Item icon={<UserIcon size={16} />}>Perfil do Usuário</Dropdown.Item>
                        <Dropdown.Item icon={<SettingsIcon size={16} />}>Configurações</Dropdown.Item>
                        <Dropdown.Item icon={<BellIcon size={16} />} disabled>Notificações (Desativado)</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Header>Ações Rápidas</Dropdown.Header>
                        <Dropdown.Item icon={<ExternalLinkIcon size={16} />}>Ver Site Externo</Dropdown.Item>
                        <Dropdown.Item icon={<TrashIcon size={16} />} danger>Excluir Conta</Dropdown.Item>
                      </Dropdown>
                    </div>
                  </div>

                  {/* Right Column: Customizer Controls */}
                  <div className="playground-controls">
                    <h3 className="controls-title">Dropdown Customizer</h3>

                    <div className="control-group">
                      <label className="control-label">Dropdown Placement</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
                        {(['bottom-start', 'bottom-end', 'bottom', 'top-start', 'top-end', 'top', 'left', 'right'] as const).map((p) => (
                          <button
                            key={p}
                            onClick={() => setDropdownPlacement(p)}
                            style={{
                              padding: '0.4rem',
                              borderRadius: '6px',
                              border: dropdownPlacement === p ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)',
                              backgroundColor: dropdownPlacement === p ? 'var(--ctp-mauve)' : 'transparent',
                              color: dropdownPlacement === p ? 'var(--ctp-base)' : 'var(--ctp-text)',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                            }}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.25rem' }}>
                      <label className="control-label">Accent Color</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
                        {['rosewater', 'flamingo', 'pink', 'mauve', 'red', 'peach', 'yellow', 'green', 'teal', 'blue', 'sky', 'lavender', 'sapphire', 'maroon'].map((c) => (
                          <button
                            key={c}
                            onClick={() => setDropdownColor(c as any)}
                            title={c.charAt(0).toUpperCase() + c.slice(1)}
                            style={{
                              height: '24px',
                              borderRadius: '4px',
                              border: dropdownColor === c ? '2px solid white' : '1px solid var(--ctp-surface1)',
                              backgroundColor: `var(--ctp-${c})`,
                              cursor: 'pointer',
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.25rem' }}>
                      <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={dropdownCloseOnItemClick}
                          onChange={(e) => setDropdownCloseOnItemClick(e.target.checked)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>Close Menu on Item Click</span>
                      </label>
                    </div>

                    <div className="control-group" style={{ marginTop: '0.75rem' }}>
                      <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={dropdownAutoFlip}
                          onChange={(e) => setDropdownAutoFlip(e.target.checked)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>Enable Viewport Auto-Flip</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Playground Code Display */}
                <div style={{ marginTop: '2rem' }}>
                  <div className="tabs-header" style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--ctp-surface1)', paddingBottom: '1px' }}>
                    {['react', 'vue', 'angular'].map((tab) => (
                      <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => {
                          setActiveTab(tab as any);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          border: 'none',
                          background: 'none',
                          color: activeTab === tab ? 'var(--ctp-mauve)' : 'var(--ctp-subtext0)',
                          borderBottom: activeTab === tab ? '2px solid var(--ctp-mauve)' : 'none',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: activeTab === tab ? 'bold' : 'normal',
                        }}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="code-container" style={{ position: 'relative', marginTop: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                      className="code-copy-btn"
                      onClick={() => {
                        const code = activeTab === 'react'
                          ? getReactDropdownCode()
                          : activeTab === 'vue'
                            ? getVueDropdownCode()
                            : getAngularDropdownCode();
                        const plainText = code.replace(/<[^>]*>/g, '');
                        copyToClipboard(plainText, `${activeTab} dropdown snippet`);
                      }}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        padding: '0.3rem 0.6rem',
                        fontSize: '0.8rem',
                        borderRadius: '4px',
                        border: '1px solid var(--ctp-surface1)',
                        backgroundColor: 'var(--ctp-surface0)',
                        color: 'var(--ctp-text)',
                        cursor: 'pointer',
                      }}
                    >
                      Copy Code
                    </button>
                    <pre className="code-block" style={{ margin: 0, padding: '1rem', overflowX: 'auto', backgroundColor: 'var(--ctp-mantle)', borderRadius: '8px' }}>
                      <code
                        dangerouslySetInnerHTML={{
                          __html: activeTab === 'react'
                            ? getReactDropdownCode()
                            : activeTab === 'vue'
                              ? getVueDropdownCode()
                              : getAngularDropdownCode()
                        }}
                      />
                    </pre>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeComponent === 'tooltip' && (
            <>
              <section>
                <h2 className="section-title">
                  <span>💬</span> Tooltip Portal Component
                </h2>

                <div className="playground-section">
                  {/* Left Column: Demo Stage */}
                  <div className="demo-stage" style={{ width: '100%', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 className="stage-title">Interactive Stage</h3>
                    <div style={{ padding: '4rem 2rem', backgroundColor: 'var(--ctp-mantle)', borderRadius: '12px', border: '1px solid var(--ctp-surface0)', display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>

                      <Tooltip
                        content="Olá! Eu sou um Tooltip posicionado via Portal."
                        placement={tooltipPlacement}
                        color={tooltipColor}
                        delay={tooltipDelay}
                        autoFlip={tooltipAutoFlip}
                      >
                        <Button color="mauve">Passe o Mouse Aqui</Button>
                      </Tooltip>

                      <Tooltip
                        content="Ação deletar é irreversível!"
                        placement={tooltipPlacement}
                        color="red"
                        delay={tooltipDelay}
                        autoFlip={tooltipAutoFlip}
                      >
                        <button className="btn btn--outline btn--red btn--md btn--rounded" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <TrashIcon size={16} />
                          Excluir Item
                        </button>
                      </Tooltip>

                      <Tooltip
                        content="Informações adicionais sobre o sistema"
                        placement={tooltipPlacement}
                        color="blue"
                        delay={tooltipDelay}
                        autoFlip={tooltipAutoFlip}
                      >
                        <span style={{ cursor: 'help', color: 'var(--ctp-blue)', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'underline dotted', fontWeight: 600 }}>
                          <InfoIcon size={18} />
                          Mais Informações
                        </span>
                      </Tooltip>

                    </div>
                  </div>

                  {/* Right Column: Customizer Controls */}
                  <div className="playground-controls">
                    <h3 className="controls-title">Tooltip Customizer</h3>

                    <div className="control-group">
                      <label className="control-label">Tooltip Placement</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
                        {(['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'right'] as const).map((p) => (
                          <button
                            key={p}
                            onClick={() => setTooltipPlacement(p)}
                            style={{
                              padding: '0.4rem',
                              borderRadius: '6px',
                              border: tooltipPlacement === p ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)',
                              backgroundColor: tooltipPlacement === p ? 'var(--ctp-mauve)' : 'transparent',
                              color: tooltipPlacement === p ? 'var(--ctp-base)' : 'var(--ctp-text)',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                            }}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.25rem' }}>
                      <label className="control-label">Tooltip Color Presets</label>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        {(['dark', 'light'] as const).map((v) => (
                          <button
                            key={v}
                            onClick={() => setTooltipColor(v)}
                            style={{
                              flex: 1,
                              padding: '0.4rem',
                              borderRadius: '6px',
                              border: tooltipColor === v ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)',
                              backgroundColor: tooltipColor === v ? 'var(--ctp-mauve)' : 'transparent',
                              color: tooltipColor === v ? 'var(--ctp-base)' : 'var(--ctp-text)',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                              textTransform: 'capitalize',
                            }}
                          >
                            {v} theme
                          </button>
                        ))}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
                        {['rosewater', 'flamingo', 'pink', 'mauve', 'red', 'peach', 'yellow', 'green', 'teal', 'blue', 'sky', 'lavender', 'sapphire', 'maroon'].map((c) => (
                          <button
                            key={c}
                            onClick={() => setTooltipColor(c as any)}
                            title={c.charAt(0).toUpperCase() + c.slice(1)}
                            style={{
                              height: '24px',
                              borderRadius: '4px',
                              border: tooltipColor === c ? '2px solid white' : '1px solid var(--ctp-surface1)',
                              backgroundColor: `var(--ctp-${c})`,
                              cursor: 'pointer',
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.25rem' }}>
                      <label className="control-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Hover Delay ({tooltipDelay}ms)</span>
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="1000"
                        step="50"
                        value={tooltipDelay}
                        onChange={(e) => setTooltipDelay(Number(e.target.value))}
                        style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--ctp-mauve)' }}
                      />
                    </div>

                    <div className="control-group" style={{ marginTop: '1.25rem' }}>
                      <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={tooltipAutoFlip}
                          onChange={(e) => setTooltipAutoFlip(e.target.checked)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>Enable Viewport Auto-Flip</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Playground Code Display */}
                <div style={{ marginTop: '2rem' }}>
                  <div className="tabs-header" style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--ctp-surface1)', paddingBottom: '1px' }}>
                    {['react', 'vue', 'angular'].map((tab) => (
                      <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => {
                          setActiveTab(tab as any);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          border: 'none',
                          background: 'none',
                          color: activeTab === tab ? 'var(--ctp-mauve)' : 'var(--ctp-subtext0)',
                          borderBottom: activeTab === tab ? '2px solid var(--ctp-mauve)' : 'none',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: activeTab === tab ? 'bold' : 'normal',
                        }}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="code-container" style={{ position: 'relative', marginTop: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                      className="code-copy-btn"
                      onClick={() => {
                        const code = activeTab === 'react'
                          ? getReactTooltipCode()
                          : activeTab === 'vue'
                            ? getVueTooltipCode()
                            : getAngularTooltipCode();
                        const plainText = code.replace(/<[^>]*>/g, '');
                        copyToClipboard(plainText, `${activeTab} tooltip snippet`);
                      }}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        padding: '0.3rem 0.6rem',
                        fontSize: '0.8rem',
                        borderRadius: '4px',
                        border: '1px solid var(--ctp-surface1)',
                        backgroundColor: 'var(--ctp-surface0)',
                        color: 'var(--ctp-text)',
                        cursor: 'pointer',
                      }}
                    >
                      Copy Code
                    </button>
                    <pre className="code-block" style={{ margin: 0, padding: '1rem', overflowX: 'auto', backgroundColor: 'var(--ctp-mantle)', borderRadius: '8px' }}>
                      <code
                        dangerouslySetInnerHTML={{
                          __html: activeTab === 'react'
                            ? getReactTooltipCode()
                            : activeTab === 'vue'
                              ? getVueTooltipCode()
                              : getAngularTooltipCode()
                        }}
                      />
                    </pre>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeComponent === 'grid' && (
            <>
              <section className="playground-section">
                <h2 className="section-title">
                  <span>📦</span> Flexbox Grid Component
                </h2>

                <div className="playground-panel">
                  {/* Left Column: Demo Stage */}
                  <div className="demo-stage" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <h3 className="stage-title">Interactive Stage</h3>

                    {/* Visual grid wrapping container */}
                    <div style={{ padding: '2rem', backgroundColor: 'var(--ctp-crust)', borderRadius: '12px', border: '1px solid var(--ctp-surface0)', overflow: 'hidden' }}>

                      <h4 style={{ color: 'var(--ctp-subtext0)', margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
                        1. Flex columns sharing space equally (Automatic Widths)
                      </h4>
                      <Grid gap={gridGap} mobile={gridMobile} multiline={gridMultiline} align={gridAlign} valign={gridValign} style={{ marginBottom: '2rem' }}>
                        <Grid.Col style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface2)', borderRadius: '6px', padding: '1rem', textAlign: 'center', color: 'var(--ctp-mauve)', fontWeight: 'bold' }}>
                          Auto-col A
                        </Grid.Col>
                        <Grid.Col style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface2)', borderRadius: '6px', padding: '1rem', textAlign: 'center', color: 'var(--ctp-mauve)', fontWeight: 'bold' }}>
                          Auto-col B
                        </Grid.Col>
                        <Grid.Col style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface2)', borderRadius: '6px', padding: '1rem', textAlign: 'center', color: 'var(--ctp-mauve)', fontWeight: 'bold' }}>
                          Auto-col C
                        </Grid.Col>
                      </Grid>

                      <h4 style={{ color: 'var(--ctp-subtext0)', margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
                        2. Column Span Spans (12-Columns grid base)
                      </h4>
                      <Grid gap={gridGap} mobile={gridMobile} multiline={gridMultiline} align={gridAlign} valign={gridValign} style={{ marginBottom: '2rem' }}>
                        <Grid.Col span={12} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-text)' }}>
                          span-12 (100%)
                        </Grid.Col>
                        <Grid.Col span={8} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-text)' }}>
                          span-8 (66.6%)
                        </Grid.Col>
                        <Grid.Col span={4} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-text)' }}>
                          span-4 (33.3%)
                        </Grid.Col>
                        <Grid.Col span={6} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-text)' }}>
                          span-6 (50%)
                        </Grid.Col>
                        <Grid.Col span={6} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-text)' }}>
                          span-6 (50%)
                        </Grid.Col>
                      </Grid>

                      <h4 style={{ color: 'var(--ctp-subtext0)', margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
                        3. Offsets and Alignment
                      </h4>
                      <Grid gap={gridGap} mobile={gridMobile} multiline={gridMultiline} align={gridAlign} valign={gridValign} style={{ marginBottom: '2rem' }}>
                        <Grid.Col span={4} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-peach)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-peach)', fontWeight: 600 }}>
                          Col 4
                        </Grid.Col>
                        <Grid.Col span={4} offset={4} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-peach)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-peach)', fontWeight: 600 }}>
                          Col 4 Offset 4
                        </Grid.Col>
                      </Grid>

                      <h4 style={{ color: 'var(--ctp-subtext0)', margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
                        4. Responsive Stacking (md=4, sm=12)
                      </h4>
                      <Grid gap={gridGap} mobile={gridMobile} multiline={gridMultiline} align={gridAlign} valign={gridValign}>
                        <Grid.Col md={4} sm={12} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-green)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-green)' }}>
                          Col A (md-4 sm-12)
                        </Grid.Col>
                        <Grid.Col md={4} sm={12} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-green)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-green)' }}>
                          Col B (md-4 sm-12)
                        </Grid.Col>
                        <Grid.Col md={4} sm={12} style={{ backgroundColor: 'var(--ctp-surface0)', border: '1px solid var(--ctp-green)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center', color: 'var(--ctp-green)' }}>
                          Col C (md-4 sm-12)
                        </Grid.Col>
                      </Grid>

                    </div>
                  </div>

                  {/* Right Column: Customizer Controls */}
                  <div className="playground-controls">
                    <h3 className="controls-title">Grid Customizer</h3>

                    <div className="control-group">
                      <label className="control-label">Gap Spacing Size</label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {([0, 1, 2, 3, 4, 5] as const).map((g) => (
                          <button
                            key={g}
                            onClick={() => setGridGap(g)}
                            style={{
                              flex: 1,
                              padding: '0.4rem',
                              borderRadius: '6px',
                              border: gridGap === g ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)',
                              backgroundColor: gridGap === g ? 'var(--ctp-mauve)' : 'transparent',
                              color: gridGap === g ? 'var(--ctp-base)' : 'var(--ctp-text)',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                            }}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.25rem' }}>
                      <label className="control-label">Align Columns (Justify Content)</label>
                      <select
                        value={gridAlign}
                        onChange={(e) => setGridAlign(e.target.value as any)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          backgroundColor: 'var(--ctp-surface0)',
                          border: '1px solid var(--ctp-surface1)',
                          color: 'var(--ctp-text)',
                          fontFamily: 'var(--ctp-font-family)',
                          outline: 'none',
                        }}
                      >
                        <option value="start">Start</option>
                        <option value="center">Center</option>
                        <option value="end">End</option>
                        <option value="space-between">Space Between</option>
                        <option value="space-around">Space Around</option>
                      </select>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.25rem' }}>
                      <label className="control-label">Vertical Align (Align Items)</label>
                      <select
                        value={gridValign}
                        onChange={(e) => setGridValign(e.target.value as any)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          backgroundColor: 'var(--ctp-surface0)',
                          border: '1px solid var(--ctp-surface1)',
                          color: 'var(--ctp-text)',
                          fontFamily: 'var(--ctp-font-family)',
                          outline: 'none',
                        }}
                      >
                        <option value="start">Start</option>
                        <option value="center">Center</option>
                        <option value="end">End</option>
                      </select>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.5rem' }}>
                      <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={gridMobile}
                          onChange={(e) => setGridMobile(e.target.checked)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>Force Row layout on Mobile (mobile)</span>
                      </label>
                    </div>

                    <div className="control-group" style={{ marginTop: '0.75rem' }}>
                      <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={gridMultiline}
                          onChange={(e) => setGridMultiline(e.target.checked)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>Enable Columns Wrapping (multiline)</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Playground Code Display */}
                <div style={{ marginTop: '2rem' }}>
                  <div className="tabs-header" style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--ctp-surface1)', paddingBottom: '1px' }}>
                    {['react', 'vue', 'angular'].map((tab) => (
                      <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => {
                          setActiveTab(tab as any);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          border: 'none',
                          background: 'none',
                          color: activeTab === tab ? 'var(--ctp-mauve)' : 'var(--ctp-subtext0)',
                          borderBottom: activeTab === tab ? '2px solid var(--ctp-mauve)' : 'none',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: activeTab === tab ? 'bold' : 'normal',
                        }}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="code-container" style={{ position: 'relative', marginTop: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                      className="code-copy-btn"
                      onClick={() => {
                        const code = activeTab === 'react'
                          ? getReactGridCode()
                          : activeTab === 'vue'
                            ? getVueGridCode()
                            : getAngularGridCode();
                        const plainText = code.replace(/<[^>]*>/g, '');
                        copyToClipboard(plainText, `${activeTab} grid snippet`);
                      }}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        padding: '0.3rem 0.6rem',
                        fontSize: '0.8rem',
                        borderRadius: '4px',
                        border: '1px solid var(--ctp-surface1)',
                        backgroundColor: 'var(--ctp-surface0)',
                        color: 'var(--ctp-text)',
                        cursor: 'pointer',
                      }}
                    >
                      Copy Code
                    </button>
                    <pre className="code-block" style={{ margin: 0, padding: '1rem', overflowX: 'auto', backgroundColor: 'var(--ctp-mantle)', borderRadius: '8px' }}>
                      <code
                        dangerouslySetInnerHTML={{
                          __html: activeTab === 'react'
                            ? getReactGridCode()
                            : activeTab === 'vue'
                              ? getVueGridCode()
                              : getAngularGridCode()
                        }}
                      />
                    </pre>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeComponent === 'datepicker' && (
            <>
              <section className="playground-section">
                <h2 className="section-title">
                  <span>📅</span> Date Picker Component
                </h2>

                <div className="playground-layout">
                  {/* Left column: Live preview */}
                  <div className="playground-preview" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Hero demo */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--ctp-subtext0)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Live Preview</div>

                      {dpMode === 'single' ? (
                        <DatePicker
                          mode="single"
                          value={dpDate}
                          onChange={setDpDate}
                          color={dpColor}
                          showToday={dpShowToday}
                          disabled={dpDisabled}
                        />
                      ) : (
                        <DatePicker
                          mode="range"
                          rangeValue={dpRange}
                          onRangeChange={setDpRange}
                          color={dpColor}
                          showToday={dpShowToday}
                          disabled={dpDisabled}
                        />
                      )}

                      {/* Value display */}
                      <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--ctp-mantle)', borderRadius: '8px', border: '1px solid var(--ctp-surface0)', fontSize: '0.85rem', color: 'var(--ctp-subtext1)', minWidth: '260px' }}>
                        {dpMode === 'single' ? (
                          <span>
                            <strong style={{ color: 'var(--ctp-text)' }}>Selecionado:</strong>{' '}
                            {dpDate ? dpDate.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : <em>nenhum</em>}
                          </span>
                        ) : (
                          <span>
                            <strong style={{ color: 'var(--ctp-text)' }}>Intervalo:</strong>{' '}
                            {dpRange.start ? dpRange.start.toLocaleDateString('pt-BR') : '—'}
                            {' → '}
                            {dpRange.end ? dpRange.end.toLocaleDateString('pt-BR') : '...'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Color palette preview */}
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--ctp-subtext0)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>All Accent Colors</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {(['rosewater', 'flamingo', 'pink', 'mauve', 'red', 'maroon', 'peach', 'yellow', 'green', 'teal', 'sky', 'sapphire', 'blue', 'lavender'] as FormControlColor[]).map(c => (
                          <DatePicker
                            key={c}
                            mode="single"
                            value={new Date()}
                            color={c}
                            showToday={false}
                            placeholder={c}
                          />
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right column: controls */}
                  <div className="playground-controls">
                    <h3 className="controls-title">DatePicker Customizer</h3>

                    <div className="control-group">
                      <label className="control-label">Mode</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {(['single', 'range'] as DatePickerMode[]).map(m => (
                          <button
                            key={m}
                            onClick={() => { setDpMode(m); setDpDate(null); setDpRange({ start: null, end: null }); }}
                            style={{
                              flex: 1, padding: '0.4rem 0.75rem', borderRadius: '6px',
                              border: dpMode === m ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)',
                              backgroundColor: dpMode === m ? 'var(--ctp-mauve)' : 'transparent',
                              color: dpMode === m ? 'var(--ctp-base)' : 'var(--ctp-text)',
                              cursor: 'pointer', fontWeight: 'bold', fontFamily: 'var(--ctp-font-family)'
                            }}
                          >{m}</button>
                        ))}
                      </div>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.25rem' }}>
                      <label className="control-label">Accent Color</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem' }}>
                        {(['rosewater', 'flamingo', 'pink', 'mauve', 'red', 'maroon', 'peach', 'yellow', 'green', 'teal', 'sky', 'sapphire', 'blue', 'lavender'] as FormControlColor[]).map(c => (
                          <button
                            key={c}
                            title={c}
                            onClick={() => setDpColor(c)}
                            style={{
                              width: '28px', height: '28px', borderRadius: '50%', border: dpColor === c ? '3px solid var(--ctp-text)' : '2px solid transparent',
                              backgroundColor: `var(--ctp-${c})`, cursor: 'pointer', transition: 'transform 0.15s ease',
                              transform: dpColor === c ? 'scale(1.2)' : 'scale(1)'
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.25rem' }}>
                      <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={dpShowToday} onChange={e => setDpShowToday(e.target.checked)} style={{ cursor: 'pointer' }} />
                        <span>Mostrar botão "Hoje"</span>
                      </label>
                    </div>

                    <div className="control-group" style={{ marginTop: '0.75rem' }}>
                      <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={dpDisabled} onChange={e => setDpDisabled(e.target.checked)} style={{ cursor: 'pointer' }} />
                        <span>Disabled</span>
                      </label>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.25rem' }}>
                      <button
                        onClick={() => { setDpDate(null); setDpRange({ start: null, end: null }); }}
                        style={{
                          width: '100%', padding: '0.5rem', borderRadius: '6px',
                          border: '1px solid var(--ctp-red)', backgroundColor: 'transparent',
                          color: 'var(--ctp-red)', cursor: 'pointer', fontFamily: 'var(--ctp-font-family)',
                          fontWeight: 600, fontSize: '0.85rem'
                        }}
                      >
                        Limpar seleção
                      </button>
                    </div>
                  </div>
                </div>

                {/* Code snippet */}
                <div style={{ marginTop: '2rem' }}>
                  <div className="code-container" style={{ position: 'relative', marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden' }}>
                    <pre className="code-block" style={{ margin: 0, padding: '1rem', overflowX: 'auto', backgroundColor: 'var(--ctp-mantle)', borderRadius: '8px' }}>
                      <code dangerouslySetInnerHTML={{
                        __html: dpMode === 'single'
                          ? `<span class="hl-tag">&lt;DatePicker</span>\n  <span class="hl-attr">mode</span>=<span class="hl-str">"single"</span>\n  <span class="hl-attr">value</span>=<span class="hl-str">{date}</span>\n  <span class="hl-attr">onChange</span>=<span class="hl-str">{setDate}</span>\n  <span class="hl-attr">color</span>=<span class="hl-str">"${dpColor}"</span>\n  <span class="hl-attr">showToday</span>=<span class="hl-str">{${dpShowToday}}</span>\n<span class="hl-tag">/&gt;</span>`
                          : `<span class="hl-tag">&lt;DatePicker</span>\n  <span class="hl-attr">mode</span>=<span class="hl-str">"range"</span>\n  <span class="hl-attr">rangeValue</span>=<span class="hl-str">{range}</span>\n  <span class="hl-attr">onRangeChange</span>=<span class="hl-str">{setRange}</span>\n  <span class="hl-attr">color</span>=<span class="hl-str">"${dpColor}"</span>\n  <span class="hl-attr">showToday</span>=<span class="hl-str">{${dpShowToday}}</span>\n<span class="hl-tag">/&gt;</span>`
                      }} />
                    </pre>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeComponent === 'shell' && (
            <>
              <section className="playground-section">
                <h2 className="section-title">
                  <span>💻</span> Layout Shell Component
                </h2>

                <div className="playground-layout">
                  {/* Left column: Live preview */}
                  <div className="playground-preview" style={{ minHeight: '480px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--ctp-subtext0)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                        Interactive Shell Sandbox
                      </div>
                      <button
                        onClick={() => setShellFullScreen(true)}
                        style={{
                          padding: '0.4rem 0.8rem', borderRadius: '6px',
                          border: '1px solid var(--ctp-mauve)',
                          backgroundColor: 'var(--ctp-mauve)',
                          color: 'var(--ctp-base)',
                          cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem',
                          fontFamily: 'var(--ctp-font-family)'
                        }}
                      >
                        🚀 Enter Full-Screen View
                      </button>
                    </div>

                    {/* Inline Shell container wrapper */}
                    <div style={{
                      height: '420px',
                      width: '100%',
                      border: '2px dashed var(--ctp-surface1)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <Shell
                        layout={shellLayout}
                        fullScreen={false}
                        sidebarCollapsed={shellSidebarCollapsed}
                        sidebarMini={shellSidebarMini}
                        sidebarMobileOpen={shellSidebarMobileOpen}
                        onBackdropClick={() => setShellSidebarMobileOpen(false)}
                        headerHeight={shellHeaderHeight}
                        sidebarWidth={shellSidebarWidth}
                        style={{ height: '100%' }}
                      >
                        {/* Header */}
                        {shellLayout !== 'custom' && (
                          <Shell.Header style={{ justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <button
                                type="button"
                                onClick={() => setShellSidebarMobileOpen(!shellSidebarMobileOpen)}
                                style={{
                                  alignItems: 'center', justifyContent: 'center',
                                  width: '32px', height: '32px', border: 'none', borderRadius: '6px',
                                  backgroundColor: 'var(--ctp-surface0)', color: 'var(--ctp-text)',
                                  cursor: 'pointer', fontSize: '1.1rem'
                                }}
                                className="shell__mobile-toggle"
                              >
                                ☰
                              </button>
                              <span style={{ fontSize: '1.25rem' }}>🐱</span>
                              <span style={{ fontWeight: 800, letterSpacing: '0.02em' }}>Catppuccin Shell</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--ctp-subtext0)' }} className="d--none d--inline-desktop">Header Bar</span>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--ctp-mauve)' }} />
                            </div>
                          </Shell.Header>
                        )}

                        {/* Sidebar */}
                        {shellLayout !== 'simple' && shellLayout !== 'custom' && (
                          <Shell.Sidebar style={{ padding: shellSidebarMini ? '1rem 0.5rem' : '1.5rem 1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {[
                                { icon: '🏠', label: 'Dashboard' },
                                { icon: '📊', label: 'Analytics' },
                                { icon: '👥', label: 'Team Members' },
                                { icon: '⚙️', label: 'Settings' }
                              ].map((item, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.6rem 0.8rem',
                                    borderRadius: '8px',
                                    backgroundColor: idx === 0 ? 'var(--ctp-surface0)' : 'transparent',
                                    color: idx === 0 ? 'var(--ctp-mauve)' : 'var(--ctp-text)',
                                    fontWeight: idx === 0 ? 'bold' : 'normal',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    whiteSpace: 'nowrap',
                                    justifyContent: shellSidebarMini ? 'center' : 'flex-start'
                                  }}
                                  title={item.label}
                                >
                                  <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                                  {!shellSidebarMini && <span>{item.label}</span>}
                                </div>
                              ))}
                            </div>
                          </Shell.Sidebar>
                        )}

                        {/* Main */}
                        <Shell.Main>
                          <Shell.Content scrollable={shellScrollable} style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                              {/* Top Welcome Title */}
                              <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Bem-vindo ao Sandbox!</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--ctp-subtext0)' }}>
                                  Layout atual: <code>{shellLayout}</code>. Modifique as opções ao lado para testar responsividade e fluxos.
                                </p>
                              </div>

                              {/* Side-by-side Page Columns using Grid component */}
                              <Grid>
                                <Grid.Col md={6} sm={12}>
                                  <div style={{
                                    padding: '1.25rem',
                                    borderRadius: '10px',
                                    backgroundColor: 'var(--ctp-mantle)',
                                    border: '1px solid var(--ctp-surface0)',
                                    height: '100%'
                                  }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 700 }}>Coluna da Esquerda</h4>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--ctp-subtext1)', lineHeight: 1.4 }}>
                                      Este painel representa uma página ou bloco principal de conteúdo. O Shell gerencia automaticamente o recuo e o alinhamento.
                                    </p>
                                  </div>
                                </Grid.Col>
                                <Grid.Col md={6} sm={12}>
                                  <div style={{
                                    padding: '1.25rem',
                                    borderRadius: '10px',
                                    backgroundColor: 'var(--ctp-mantle)',
                                    border: '1px solid var(--ctp-surface0)',
                                    height: '100%'
                                  }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 700 }}>Coluna da Direita</h4>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--ctp-subtext1)', lineHeight: 1.4 }}>
                                      Esta é a segunda coluna, demonstrando o comportamento lado a lado do Grid integrado ao Shell. Redimensione ou alterne layouts.
                                    </p>
                                  </div>
                                </Grid.Col>
                              </Grid>

                              {/* Extra paragraph to show scroll lock */}
                              {shellScrollable && (
                                <div style={{
                                  padding: '1.25rem',
                                  borderRadius: '10px',
                                  backgroundColor: 'var(--ctp-crust)',
                                  fontSize: '0.8rem',
                                  color: 'var(--ctp-subtext1)',
                                  lineHeight: 1.5
                                }}>
                                  <h5 style={{ margin: '0 0 0.5rem 0', fontWeight: 700 }}>Teste de Rolagem Localizada (Overflow Scroll)</h5>
                                  <p style={{ margin: '0 0 0.75rem 0' }}>
                                    O contêiner de conteúdo possui rolagem independente. Veja que o cabeçalho e a barra lateral permanecem fixados enquanto você rola este texto longo:
                                  </p>
                                  {Array.from({ length: 4 }).map((_, i) => (
                                    <p key={i} style={{ margin: '0 0 0.5rem 0' }}>
                                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec feugiat lectus. Ut et lorem ex. In elementum arcu at lacus rutrum, ut dictum purus dictum.
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </Shell.Content>
                        </Shell.Main>
                      </Shell>
                    </div>
                  </div>

                  {/* Right column: controls */}
                  <div className="playground-controls">
                    <h3 className="controls-title">Shell Layout Options</h3>

                    <div className="control-group">
                      <label className="control-label">Grid Layout Area Template</label>
                      <select
                        value={shellLayout}
                        onChange={(e) => setShellLayout(e.target.value as ShellLayout)}
                        style={{
                          width: '100%', padding: '0.5rem', borderRadius: '6px',
                          backgroundColor: 'var(--ctp-surface0)', color: 'var(--ctp-text)',
                          border: '1px solid var(--ctp-surface1)', fontFamily: 'var(--ctp-font-family)',
                          fontWeight: 600
                        }}
                      >
                        <option value="header-first">Header First (Header Full width)</option>
                        <option value="sidebar-first">Sidebar First (Sidebar Full height)</option>
                        <option value="simple">Simple Layout (Header Only)</option>
                      </select>
                    </div>

                    <div className="control-group" style={{ marginTop: '1rem' }}>
                      <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={shellSidebarCollapsed}
                          onChange={(e) => setShellSidebarCollapsed(e.target.checked)}
                          disabled={shellLayout === 'simple'}
                        />
                        <span>Collapse Sidebar</span>
                      </label>
                    </div>

                    <div className="control-group" style={{ marginTop: '0.5rem' }}>
                      <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={shellSidebarMini}
                          onChange={(e) => setShellSidebarMini(e.target.checked)}
                          disabled={shellLayout === 'simple' || shellSidebarCollapsed}
                        />
                        <span>Icon-only (Mini Sidebar)</span>
                      </label>
                    </div>

                    <div className="control-group" style={{ marginTop: '0.5rem' }}>
                      <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={shellScrollable}
                          onChange={(e) => setShellScrollable(e.target.checked)}
                        />
                        <span>Independent Content Scroll</span>
                      </label>
                    </div>

                    <div className="control-group" style={{ marginTop: '1rem' }}>
                      <label className="control-label">Header Height</label>
                      <input
                        type="text"
                        value={shellHeaderHeight}
                        onChange={(e) => setShellHeaderHeight(e.target.value)}
                        style={{
                          width: '100%', padding: '0.5rem', borderRadius: '6px',
                          backgroundColor: 'var(--ctp-surface0)', color: 'var(--ctp-text)',
                          border: '1px solid var(--ctp-surface1)', fontFamily: 'var(--ctp-font-family)'
                        }}
                      />
                    </div>

                    <div className="control-group" style={{ marginTop: '0.75rem' }}>
                      <label className="control-label">Sidebar Width</label>
                      <input
                        type="text"
                        value={shellSidebarWidth}
                        onChange={(e) => setShellSidebarWidth(e.target.value)}
                        disabled={shellLayout === 'simple' || shellSidebarCollapsed}
                        style={{
                          width: '100%', padding: '0.5rem', borderRadius: '6px',
                          backgroundColor: 'var(--ctp-surface0)', color: 'var(--ctp-text)',
                          border: '1px solid var(--ctp-surface1)', fontFamily: 'var(--ctp-font-family)'
                        }}
                      />
                    </div>

                    <div style={{ marginTop: '1.5rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'color-mix(in srgb, var(--ctp-mauve) 8%, transparent)', border: '1px solid var(--ctp-surface1)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--ctp-subtext0)', display: 'block', lineHeight: 1.3 }}>
                        💡 <strong>Dica de Responsividade:</strong> Em telas móveis (&lt;768px), o shell se reorganiza automaticamente. O menu lateral vira uma gaveta flutuante. Use o botão <strong>"Enter Full-Screen View"</strong> acima para testar responsividade real!
                      </span>
                    </div>
                  </div>
                </div>

                {/* Code snippets */}
                <div style={{ marginTop: '2rem' }}>
                  <div className="code-container" style={{ position: 'relative', marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden' }}>
                    <pre className="code-block" style={{ margin: 0, padding: '1rem', overflowX: 'auto', backgroundColor: 'var(--ctp-mantle)', borderRadius: '8px' }}>
                      <code dangerouslySetInnerHTML={{
                        __html:
                          `<span class="hl-tag">&lt;Shell</span>\n  <span class="hl-attr">layout</span>=<span class="hl-str">"${shellLayout}"</span>\n  <span class="hl-attr">sidebarCollapsed</span>=<span class="hl-str">{${shellSidebarCollapsed}}</span>\n  <span class="hl-attr">sidebarMini</span>=<span class="hl-str">{${shellSidebarMini}}</span>\n  <span class="hl-attr">headerHeight</span>=<span class="hl-str">"${shellHeaderHeight}"</span>\n  <span class="hl-attr">sidebarWidth</span>=<span class="hl-str">"${shellSidebarWidth}"</span>\n<span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;Shell.Header&gt;</span>\n    {/* Logo & Navigation Buttons */}\n  <span class="hl-tag">&lt;/Shell.Header&gt;</span>\n\n  <span class="hl-tag">&lt;Shell.Sidebar&gt;</span>\n    {/* Sidebar Links & Icons */}\n  <span class="hl-tag">&lt;/Shell.Sidebar&gt;</span>\n\n  <span class="hl-tag">&lt;Shell.Main&gt;</span>\n    <span class="hl-tag">&lt;Shell.Content</span> <span class="hl-attr">scrollable</span>=<span class="hl-str">{${shellScrollable}}</span><span class="hl-tag">&gt;</span>\n      <span class="hl-tag">&lt;Grid&gt;</span>\n        <span class="hl-tag">&lt;Grid.Col</span> <span class="hl-attr">span</span>=<span class="hl-str">{6}</span><span class="hl-tag">&gt;</span>Página 1<span class="hl-tag">&lt;/Grid.Col&gt;</span>\n        <span class="hl-tag">&lt;Grid.Col</span> <span class="hl-attr">span</span>=<span class="hl-str">{6}</span><span class="hl-tag">&gt;</span>Página 2<span class="hl-tag">&lt;/Grid.Col&gt;</span>\n      <span class="hl-tag">&lt;/Grid&gt;</span>\n    <span class="hl-tag">&lt;/Shell.Content&gt;</span>\n  <span class="hl-tag">&lt;/Shell.Main&gt;</span>\n<span class="hl-tag">&lt;/Shell&gt;</span>`
                      }} />
                    </pre>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeComponent === 'sidebar' && (
            <>
              <section className="playground-section">
                <h2 className="section-title">
                  <span>🚪</span> Rich Sidebar Component
                </h2>

                <div className="playground-layout">
                  {/* Left column: Live preview */}
                  <div className="playground-preview" style={{ minHeight: '480px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ctp-subtext0)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                      Live Interactive Sidebar Preview
                    </div>

                    {/* Simulated Viewport Wrapper */}
                    <div style={{
                      height: '420px',
                      width: '100%',
                      border: '1px solid var(--ctp-surface1)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      display: 'flex',
                      backgroundColor: 'var(--ctp-base)',
                      position: 'relative'
                    }}>
                      {/* Sidebar component rendering */}
                      <Sidebar
                        variant={sbVariant}
                        collapsed={sbCollapsed}
                        expandOnHover={sbExpandOnHover}
                      >
                        {/* Header */}
                        <Sidebar.Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                            <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>🐱</span>
                            {!sbCollapsed && (
                              <span style={{ fontWeight: 800, fontSize: '0.9rem', whiteSpace: 'nowrap', color: 'var(--ctp-text)' }}>
                                Catppuccin
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setSbCollapsed(!sbCollapsed)}
                            style={{
                              background: 'var(--ctp-surface0)',
                              border: 'none',
                              borderRadius: '4px',
                              color: 'var(--ctp-text)',
                              cursor: 'pointer',
                              padding: '2px 6px',
                              fontSize: '0.75rem',
                              fontFamily: 'monospace',
                              fontWeight: 'bold',
                              flexShrink: 0
                            }}
                            title={sbCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                          >
                            {sbCollapsed ? '⟩' : '⟨'}
                          </button>
                        </Sidebar.Header>

                        {/* Navigation items */}
                        <Sidebar.Section>
                          {[
                            { icon: '🏠', label: 'Dashboard' },
                            { icon: '📊', label: 'Analytics' },
                            { icon: '📂', label: 'Projects' },
                            { icon: '💬', label: 'Messages' },
                            { icon: '⚙️', label: 'Settings' }
                          ].map((item, idx) => (
                            <Sidebar.Item
                              key={idx}
                              icon={item.icon}
                              label={item.label}
                              active={sbActiveItem === idx}
                              onClick={() => setSbActiveItem(idx)}
                            />
                          ))}
                        </Sidebar.Section>

                        {/* Footer */}
                        <Sidebar.Footer>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden', width: '100%' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--ctp-mauve)',
                              color: 'var(--ctp-base)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '0.85rem',
                              flexShrink: 0
                            }}>
                              SD
                            </div>
                            {!sbCollapsed && (
                              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: 'var(--ctp-text)' }}>
                                  Savunma Dev
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--ctp-subtext0)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                  savunma@catppuccin.dev
                                </span>
                              </div>
                            )}
                          </div>
                        </Sidebar.Footer>
                      </Sidebar>

                      {/* Main Content Area in simulator */}
                      <div style={{
                        flex: 1,
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'var(--ctp-base)',
                        color: 'var(--ctp-text)',
                        boxSizing: 'border-box'
                      }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                          {sbActiveItem === 0 && '🏠'}
                          {sbActiveItem === 1 && '📊'}
                          {sbActiveItem === 2 && '📂'}
                          {sbActiveItem === 3 && '💬'}
                          {sbActiveItem === 4 && '⚙️'}
                        </div>
                        <h3 style={{ margin: 0, fontWeight: 800 }}>
                          Página: {[
                            'Dashboard',
                            'Analytics',
                            'Projects',
                            'Messages',
                            'Settings'
                          ][sbActiveItem]}
                        </h3>
                        <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: 'var(--ctp-subtext0)', textAlign: 'center' }}>
                          Simulação de conteúdo ativo. Alterne as seções do menu lateral.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right column: controls */}
                  <div className="playground-controls">
                    <h3 className="controls-title">Sidebar Customizer</h3>

                    <div className="control-group">
                      <label className="control-label">Sidebar Visual Style</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {(['fixed', 'floated'] as const).map(v => (
                          <button
                            key={v}
                            onClick={() => setSbVariant(v)}
                            style={{
                              flex: 1, padding: '0.4rem 0.75rem', borderRadius: '6px',
                              border: sbVariant === v ? '1px solid var(--ctp-mauve)' : '1px solid var(--ctp-surface1)',
                              backgroundColor: sbVariant === v ? 'var(--ctp-mauve)' : 'transparent',
                              color: sbVariant === v ? 'var(--ctp-base)' : 'var(--ctp-text)',
                              cursor: 'pointer', fontWeight: 'bold', fontFamily: 'var(--ctp-font-family)'
                            }}
                          >{v.toUpperCase()}</button>
                        ))}
                      </div>
                    </div>

                    <div className="control-group" style={{ marginTop: '1.25rem' }}>
                      <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={sbCollapsed}
                          onChange={(e) => setSbCollapsed(e.target.checked)}
                        />
                        <span>Collapsed (Mini Mode)</span>
                      </label>
                    </div>

                    <div className="control-group" style={{ marginTop: '0.5rem' }}>
                      <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={sbExpandOnHover}
                          onChange={(e) => setSbExpandOnHover(e.target.checked)}
                          disabled={!sbCollapsed}
                        />
                        <span>Expand on Hover (when Collapsed)</span>
                      </label>
                    </div>

                    <div style={{ marginTop: '1.5rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'color-mix(in srgb, var(--ctp-mauve) 8%, transparent)', border: '1px solid var(--ctp-surface1)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--ctp-subtext0)', display: 'block', lineHeight: 1.3 }}>
                        💡 <strong>Como testar:</strong> Ative a opção <strong>"Collapsed (Mini Mode)"</strong> e passe o mouse sobre o menu lateral. Se a opção <strong>"Expand on Hover"</strong> estiver ligada, a barra irá se expandir suavemente como overlay sobre o conteúdo da página, e encolherá ao tirar o mouse!
                      </span>
                    </div>
                  </div>
                </div>

                {/* Code snippets */}
                <div style={{ marginTop: '2rem' }}>
                  <div className="code-container" style={{ position: 'relative', marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden' }}>
                    <pre className="code-block" style={{ margin: 0, padding: '1rem', overflowX: 'auto', backgroundColor: 'var(--ctp-mantle)', borderRadius: '8px' }}>
                      <code dangerouslySetInnerHTML={{
                        __html:
                          `<span class="hl-tag">&lt;Sidebar</span>\n  <span class="hl-attr">variant</span>=<span class="hl-str">"${sbVariant}"</span>\n  <span class="hl-attr">collapsed</span>=<span class="hl-str">{${sbCollapsed}}</span>\n  <span class="hl-attr">expandOnHover</span>=<span class="hl-str">{${sbExpandOnHover}}</span>\n<span class="hl-tag">&gt;</span>\n  <span class="hl-tag">&lt;Sidebar.Header&gt;</span>\n    🐱 Brand\n    <span class="hl-tag">&lt;button</span> <span class="hl-attr">onClick</span>=<span class="hl-str">{(e) =&gt; setCollapsed(!collapsed)}</span><span class="hl-tag">&gt;</span>⟨<span class="hl-tag">&lt;/button&gt;</span>\n  <span class="hl-tag">&lt;/Sidebar.Header&gt;</span>\n\n  <span class="hl-tag">&lt;Sidebar.Section&gt;</span>\n    <span class="hl-tag">&lt;Sidebar.Item</span> <span class="hl-attr">icon</span>=<span class="hl-str">"🏠"</span> <span class="hl-attr">label</span>=<span class="hl-str">"Dashboard"</span> <span class="hl-attr">active</span>=<span class="hl-str">{active === 0}</span> <span class="hl-attr">onClick</span>=<span class="hl-str">{() =&gt; setActive(0)}</span> <span class="hl-tag">/&gt;</span>\n    <span class="hl-tag">&lt;Sidebar.Item</span> <span class="hl-attr">icon</span>=<span class="hl-str">"📊"</span> <span class="hl-attr">label</span>=<span class="hl-str">"Analytics"</span> <span class="hl-attr">active</span>=<span class="hl-str">{active === 1}</span> <span class="hl-attr">onClick</span>=<span class="hl-str">{() =&gt; setActive(1)}</span> <span class="hl-tag">/&gt;</span>\n  <span class="hl-tag">&lt;/Sidebar.Section&gt;</span>\n<span class="hl-tag">&lt;/Sidebar&gt;</span>`
                      }} />
                    </pre>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeComponent === 'typography' && (
            <>
              <section className="playground-section">
                <h2 className="section-title">
                  <span>🔤</span> Typography & Text Helpers
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* Card 1: Font Scale Showcase */}
                  <div className="card card--filled card--rounded card--padding-md">
                    <div className="card__header">
                      <h3 className="card__title">Scale & Hierarchy</h3>
                      <p className="card__subtitle">Default font sizes and heading modifiers using BEM</p>
                    </div>
                    <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ borderBottom: '1px solid var(--ctp-surface1)', paddingBottom: '1rem' }}>
                        <h1 className="title title--h1">Heading 1 (.title--h1)</h1>
                        <h2 className="title title--h2">Heading 2 (.title--h2)</h2>
                        <h3 className="title title--h3">Heading 3 (.title--h3)</h3>
                        <h4 className="title title--h4">Heading 4 (.title--h4)</h4>
                        <h5 className="title title--h5">Heading 5 (.title--h5)</h5>
                        <h6 className="title title--h6">Heading 6 (.title--h6)</h6>
                      </div>
                      <div>
                        <p className="text text--lead">Lead paragraph (.text--lead) - Perfect for introductory copy with a slightly larger size.</p>
                        <p className="text text--body">Body text (.text--body / default) - Standard paragraph text with comfortable reading line-height of 1.6.</p>
                        <p className="text text--sm">Small text (.text--sm) - Excellent for captions, secondary descriptions or card footers.</p>
                        <p className="text text--xs">Extra small text (.text--xs) - Ideal for labels, badges metadata or tiny details.</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Font Weights Showcase */}
                  <div className="card card--filled card--rounded card--padding-md">
                    <div className="card__header">
                      <h3 className="card__title">Font Weights</h3>
                      <p className="card__subtitle">Cozy weight variants matching Outfit design token scales</p>
                    </div>
                    <div className="card__body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                      <div>
                        <p className="text text--light" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Light 300</p>
                        <code className="text--xs" style={{ color: 'var(--ctp-subtext0)' }}>.text--light</code>
                      </div>
                      <div>
                        <p className="text text--regular" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Regular 400</p>
                        <code className="text--xs" style={{ color: 'var(--ctp-subtext0)' }}>.text--regular</code>
                      </div>
                      <div>
                        <p className="text text--medium" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Medium 500</p>
                        <code className="text--xs" style={{ color: 'var(--ctp-subtext0)' }}>.text--medium</code>
                      </div>
                      <div>
                        <p className="text text--semibold" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Semibold 600</p>
                        <code className="text--xs" style={{ color: 'var(--ctp-subtext0)' }}>.text--semibold</code>
                      </div>
                      <div>
                        <p className="text text--bold" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Bold 700</p>
                        <code className="text--xs" style={{ color: 'var(--ctp-subtext0)' }}>.text--bold</code>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Color Helpers Showcase */}
                  <div className="card card--filled card--rounded card--padding-md">
                    <div className="card__header">
                      <h3 className="card__title">Solid Text Colors</h3>
                      <p className="card__subtitle">Catppuccin colors mapped directly to typography modifiers</p>
                    </div>
                    <div className="card__body">
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                        {['rosewater', 'flamingo', 'pink', 'mauve', 'red', 'maroon', 'peach', 'yellow', 'green', 'teal', 'sky', 'sapphire', 'blue', 'lavender', 'text', 'subtext1', 'subtext0', 'overlay2'].map((c) => (
                          <div key={c} style={{ display: 'flex', flexDirection: 'column', padding: '10px', backgroundColor: 'var(--ctp-mantle)', borderRadius: '6px', border: '1px solid var(--ctp-surface0)' }}>
                            <span className={`text text--bold text--${c}`} style={{ marginBottom: '4px', textTransform: 'capitalize' }}>{c}</span>
                            <code style={{ fontSize: '0.7rem', color: 'var(--ctp-overlay1)', overflow: 'hidden', textOverflow: 'ellipsis' }}>.text--{c}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Gradient Text Gallery */}
                  <div className="card card--filled card--rounded card--padding-md">
                    <div className="card__header">
                      <h3 className="card__title">Gradient Title Gallery</h3>
                      <p className="card__subtitle">Premium text gradients combining Catppuccin color pairings</p>
                    </div>
                    <div className="card__body">
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        {[
                          { name: 'Mauve & Blue', gradient: 'mauve-blue', colors: 'Mauve to Blue' },
                          { name: 'Peach & Red', gradient: 'peach-red', colors: 'Peach to Red' },
                          { name: 'Green & Teal', gradient: 'green-teal', colors: 'Green to Teal' },
                          { name: 'Lavender & Pink', gradient: 'lavender-pink', colors: 'Lavender to Pink' },
                          { name: 'Yellow & Peach', gradient: 'yellow-peach', colors: 'Yellow to Peach' },
                          { name: 'Rosewater & Flamingo', gradient: 'rosewater-flamingo', colors: 'Rosewater to Flamingo' },
                          { name: 'Sky & Blue', gradient: 'sky-blue', colors: 'Sky to Blue' }
                        ].map((g) => (
                          <div
                            key={g.gradient}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              padding: '1.5rem',
                              backgroundColor: 'var(--ctp-mantle)',
                              borderRadius: '8px',
                              border: '1px solid var(--ctp-surface1)',
                              position: 'relative'
                            }}
                          >
                            <h2 className="title title--h2" data-gradient={g.gradient} style={{ marginBottom: '8px', fontSize: '1.8rem' }}>
                              Catppuccin
                            </h2>
                            <span style={{ fontSize: '0.85rem', color: 'var(--ctp-text)', fontWeight: 600 }}>{g.name}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--ctp-subtext0)', marginBottom: '1rem' }}>{g.colors}</span>

                            <button
                              className="btn btn--sm btn--outline btn--rounded"
                              onClick={() => copyToClipboard(`class="title title--h1" data-gradient="${g.gradient}"`, `data-gradient="${g.gradient}"`)}
                              style={{ marginTop: 'auto', alignSelf: 'flex-start', fontSize: '0.75rem', padding: '4px 10px' }}
                            >
                              Copy attribute code
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Playground Code Display */}
                <div style={{ marginTop: '2rem' }}>
                  <div className="tabs-header" style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--ctp-surface1)', paddingBottom: '1px' }}>
                    {['react', 'vue', 'angular'].map((tab) => (
                      <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => {
                          setActiveTab(tab as any);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          border: 'none',
                          background: 'none',
                          color: activeTab === tab ? 'var(--ctp-mauve)' : 'var(--ctp-subtext0)',
                          borderBottom: activeTab === tab ? '2px solid var(--ctp-mauve)' : 'none',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: activeTab === tab ? 'bold' : 'normal',
                        }}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="code-container" style={{ position: 'relative', marginTop: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                      className="code-copy-btn"
                      onClick={() => {
                        let codeText = '';
                        if (activeTab === 'react') {
                          codeText = '<h1 className="title title--h1" data-gradient="mauve-blue">Catppuccin Gradient</h1>';
                        } else if (activeTab === 'vue') {
                          codeText = '<h1 class="title title--h1" data-gradient="mauve-blue">Catppuccin Gradient</h1>';
                        } else {
                          codeText = '<h1 class="title title--h1" data-gradient="mauve-blue">Catppuccin Gradient</h1>';
                        }
                        copyToClipboard(codeText, `${activeTab} typography snippet`);
                      }}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        padding: '0.3rem 0.6rem',
                        fontSize: '0.8rem',
                        borderRadius: '4px',
                        border: '1px solid var(--ctp-surface1)',
                        backgroundColor: 'var(--ctp-surface0)',
                        color: 'var(--ctp-text)',
                        cursor: 'pointer',
                      }}
                    >
                      Copy Code
                    </button>
                    <pre className="code-block" style={{ margin: 0, padding: '1rem', overflowX: 'auto', backgroundColor: 'var(--ctp-mantle)', borderRadius: '8px' }}>
                      <code
                        dangerouslySetInnerHTML={{
                          __html: activeTab === 'react'
                            ? `<span class="hl-tag">&lt;h1</span> <span class="hl-attr">className</span>=<span class="hl-str">"title title--h1"</span> <span class="hl-attr">data-gradient</span>=<span class="hl-str">"mauve-blue"</span><span class="hl-tag">&gt;</span>Catppuccin Gradient<span class="hl-tag">&lt;/h1&gt;</span>`
                            : activeTab === 'vue'
                              ? `<span class="hl-tag">&lt;h1</span> <span class="hl-attr">class</span>=<span class="hl-str">"title title--h1"</span> <span class="hl-attr">data-gradient</span>=<span class="hl-str">"mauve-blue"</span><span class="hl-tag">&gt;</span>Catppuccin Gradient<span class="hl-tag">&lt;/h1&gt;</span>`
                              : `<span class="hl-tag">&lt;h1</span> <span class="hl-attr">class</span>=<span class="hl-str">"title title--h1"</span> <span class="hl-attr">data-gradient</span>=<span class="hl-str">"mauve-blue"</span><span class="hl-tag">&gt;</span>Catppuccin Gradient<span class="hl-tag">&lt;/h1&gt;</span>`
                        }}
                      />
                    </pre>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ===== TEXT EDITOR ===== */}
          {activeComponent === 'texteditor' && (
            <>
              <section className="showcase-section">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">✍️ Text Editor</h2>
                    <p className="section-description">
                      Editor de texto rico baseado em <strong>Tiptap</strong> + ProseMirror.
                      Suporta importação e exportação nativa de <code>Markdown</code>, modo WYSIWYG e modo Markdown raw,
                      toolbar completa e bubble menu de seleção de texto.
                    </p>
                  </div>
                </div>

                <div className="playground-card">
                  <div className="playground-controls">
                    <div className="control-group">
                      <label className="control-label">Cor de Destaque</label>
                      <div className="control-row" style={{ flexWrap: 'wrap', gap: '6px' }}>
                        {(['rosewater', 'flamingo', 'pink', 'mauve', 'red', 'maroon', 'peach', 'yellow', 'green', 'teal', 'sky', 'sapphire', 'blue', 'lavender'] as TextEditorColor[]).map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setEditorColor(c)}
                            title={c}
                            style={{
                              width: 22, height: 22, borderRadius: '50%',
                              border: editorColor === c ? '2.5px solid var(--ctp-text)' : '2px solid transparent',
                              background: `var(--ctp-${c})`,
                              cursor: 'pointer', padding: 0, outline: 'none',
                              boxShadow: editorColor === c ? '0 0 0 2px var(--ctp-base)' : 'none',
                              transition: 'all 0.15s'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="control-group">
                      <label className="control-label">Tamanho</label>
                      <div className="control-row">
                        {(['sm', 'md', 'lg'] as TextEditorSize[]).map(s => (
                          <button key={s} type="button"
                            className={`prop-btn ${editorSize === s ? 'active' : ''}`}
                            onClick={() => setEditorSize(s)}
                          >{s}</button>
                        ))}
                      </div>
                    </div>
                    <div className="control-group">
                      <label className="control-label">Limite de Caracteres</label>
                      <div className="control-row">
                        {([0, 200, 500, 1000]).map(n => (
                          <button key={n} type="button"
                            className={`prop-btn ${editorMaxLength === n ? 'active' : ''}`}
                            onClick={() => setEditorMaxLength(n)}
                          >{n === 0 ? 'Ilimitado' : n}</button>
                        ))}
                      </div>
                    </div>
                    <div className="control-group">
                      <label className="control-label">Modo</label>
                      <div className="control-row">
                        <button type="button"
                          className={`prop-btn ${!editorReadOnly ? 'active' : ''}`}
                          onClick={() => setEditorReadOnly(false)}
                        >Editável</button>
                        <button type="button"
                          className={`prop-btn ${editorReadOnly ? 'active' : ''}`}
                          onClick={() => setEditorReadOnly(true)}
                        >Read-only</button>
                      </div>
                    </div>
                  </div>

                  <div className="playground-preview" style={{ padding: '24px' }}>
                    <TextEditor
                      color={editorColor}
                      size={editorSize}
                      maxLength={editorMaxLength}
                      readOnly={editorReadOnly}
                      allowFullscreen={true}
                      placeholder="Comece a escrever… (suporta **Markdown**)."
                      defaultValue={`# Bem-vindo ao Catppuccin Text Editor\n\nEste é um editor **rico** baseado em [Tiptap](https://tiptap.dev). Você pode usar:\n\n- **Negrito**, *itálico*, ~~riscado~~ e \`código inline\`\n- Listas ordenadas e não-ordenadas\n- Blockquotes, tabelas e régua horizontal\n\n> Use o botão **Markdown** na barra de status para alternar entre WYSIWYG e código Markdown!\n\n---\n\nSelecione um texto para ver o **bubble menu** de formatação rápida.`}
                      onChange={(md) => setEditorContent(md)}
                    />
                  </div>
                </div>

                {editorContent && (
                  <div style={{ marginTop: 24, borderRadius: 12, border: '1.5px solid var(--ctp-surface1)', overflow: 'hidden' }}>
                    <div style={{
                      padding: '10px 16px', background: 'var(--ctp-mantle)',
                      borderBottom: '1px solid var(--ctp-surface0)', fontSize: '0.8rem',
                      fontWeight: 600, color: 'var(--ctp-subtext0)', display: 'flex', alignItems: 'center', gap: 8
                    }}>
                      <span>📄</span> Saída Markdown (onChange)
                    </div>
                    <pre style={{
                      margin: 0, padding: '16px 20px',
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                      fontSize: '0.82rem', lineHeight: 1.7, color: 'var(--ctp-text)',
                      background: 'var(--ctp-base)', overflowX: 'auto', whiteSpace: 'pre-wrap'
                    }}>{editorContent}</pre>
                  </div>
                )}

                <div className="code-section" style={{ marginTop: 32 }}>
                  <h3 className="code-section-title">Como usar</h3>
                  <pre className="code-block" style={{ padding: '1rem', overflowX: 'auto' }}>
                    <code dangerouslySetInnerHTML={{
                      __html:
                        `<span class="hl-comment">// React</span>\n` +
                        `<span class="hl-tag">&lt;TextEditor</span>\n` +
                        `  <span class="hl-attr">color</span>=<span class="hl-str">"${editorColor}"</span>\n` +
                        `  <span class="hl-attr">size</span>=<span class="hl-str">"${editorSize}"</span>\n` +
                        (editorMaxLength > 0 ? `  <span class="hl-attr">maxLength</span>=<span class="hl-str">{${editorMaxLength}}</span>\n` : '') +
                        (editorReadOnly ? `  <span class="hl-attr">readOnly</span>\n` : '') +
                        `  <span class="hl-attr">onChange</span>=<span class="hl-str">{(markdown) =&gt; console.log(markdown)}</span>\n` +
                        `<span class="hl-tag">/&gt;</span>`
                    }} />
                  </pre>
                </div>

              </section>
            </>
          )}

          {activeComponent === 'charts' && (
            <>
              <section>
                <h2 className="section-title">
                  <span>📊</span> Charts — Catppuccin × Recharts
                </h2>

                {/* KPI Stat Cards */}
                <div className="chart-stats">
                  {[
                    { label: 'Downloads', value: '284K', trend: '+18.4%', up: true },
                    { label: 'GitHub Stars', value: '12.7K', trend: '+6.2%', up: true },
                    { label: 'Contributors', value: '348', trend: '+11.5%', up: true },
                    { label: 'Open Issues', value: '37', trend: '-14%', up: false },
                  ].map((stat) => (
                    <div key={stat.label} className="chart-stat">
                      <div className="chart-stat__label">{stat.label}</div>
                      <div className="chart-stat__value">{stat.value}</div>
                      <div className={`chart-stat__trend chart-stat__trend--${stat.up ? 'up' : 'down'}`}>
                        {stat.up ? '↑' : '↓'} {stat.trend} vs last month
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2-column chart grid */}
                <div className="charts-grid">
                  {/* Line Chart */}
                  <div className="chart-card">
                    <div className="chart-card__header">
                      <div>
                        <h3 className="chart-card__name">Weekly Downloads</h3>
                        <p className="chart-card__subtitle">npm package installs per week</p>
                      </div>
                      <div className="chart-card__badge">📈 Line</div>
                    </div>
                    <CtpLineChart
                      xAxisKey="week"
                      series={[
                        { key: 'react', label: 'React', colorIndex: 0 },
                        { key: 'vue', label: 'Vue', colorIndex: 1 },
                        { key: 'angular', label: 'Angular', colorIndex: 2 },
                      ]}
                      data={[
                        { week: 'W1', react: 4800, vue: 3200, angular: 2100 },
                        { week: 'W2', react: 5200, vue: 3600, angular: 2400 },
                        { week: 'W3', react: 4900, vue: 3400, angular: 2600 },
                        { week: 'W4', react: 6100, vue: 4100, angular: 2900 },
                        { week: 'W5', react: 5800, vue: 4500, angular: 3100 },
                        { week: 'W6', react: 7200, vue: 4800, angular: 3400 },
                        { week: 'W7', react: 6900, vue: 5200, angular: 3700 },
                        { week: 'W8', react: 8100, vue: 5600, angular: 4000 },
                      ]}
                      height={250}
                    />
                  </div>

                  {/* Bar Chart */}
                  <div className="chart-card">
                    <div className="chart-card__header">
                      <div>
                        <h3 className="chart-card__name">Stars by Category</h3>
                        <p className="chart-card__subtitle">GitHub stars across Catppuccin ports</p>
                      </div>
                      <div className="chart-card__badge">📊 Bar</div>
                    </div>
                    <CtpBarChart
                      xAxisKey="name"
                      series={[{ key: 'stars', label: 'Stars (k)' }]}
                      rainbowMode
                      data={[
                        { name: 'VS Code', stars: 4.8 },
                        { name: 'Nvim', stars: 3.5 },
                        { name: 'iTerm', stars: 2.8 },
                        { name: 'Discord', stars: 2.1 },
                        { name: 'Alacritty', stars: 1.6 },
                        { name: 'GitHub', stars: 2.5 },
                        { name: 'Spicetify', stars: 1.1 },
                      ]}
                      height={250}
                      showLegend={false}
                    />
                  </div>

                  {/* Area Chart */}
                  <div className="chart-card">
                    <div className="chart-card__header">
                      <div>
                        <h3 className="chart-card__name">Community Growth</h3>
                        <p className="chart-card__subtitle">Cumulative contributors over time</p>
                      </div>
                      <div className="chart-card__badge">🌊 Area</div>
                    </div>
                    <CtpAreaChart
                      xAxisKey="month"
                      series={[
                        { key: 'members', label: 'Community Members', colorIndex: 3 },
                        { key: 'contributors', label: 'Contributors', colorIndex: 2 },
                      ]}
                      data={[
                        { month: 'Jan', members: 1200, contributors: 42 },
                        { month: 'Feb', members: 1800, contributors: 68 },
                        { month: 'Mar', members: 2600, contributors: 95 },
                        { month: 'Apr', members: 3400, contributors: 134 },
                        { month: 'May', members: 4800, contributors: 178 },
                        { month: 'Jun', members: 6200, contributors: 223 },
                        { month: 'Jul', members: 7900, contributors: 271 },
                        { month: 'Aug', members: 9800, contributors: 320 },
                        { month: 'Sep', members: 11400, contributors: 348 },
                      ]}
                      height={250}
                    />
                  </div>

                  {/* Radar Chart */}
                  <div className="chart-card">
                    <div className="chart-card__header">
                      <div>
                        <h3 className="chart-card__name">Framework Scorecard</h3>
                        <p className="chart-card__subtitle">Catppuccin port quality by framework</p>
                      </div>
                      <div className="chart-card__badge">🕸️ Radar</div>
                    </div>
                    <CtpRadarChart
                      angleKey="criterion"
                      series={[
                        { key: 'react', label: 'React', colorIndex: 0 },
                        { key: 'vue', label: 'Vue', colorIndex: 1 },
                        { key: 'angular', label: 'Angular', colorIndex: 2 },
                      ]}
                      data={[
                        { criterion: 'Coverage', react: 95, vue: 88, angular: 82 },
                        { criterion: 'A11y', react: 90, vue: 85, angular: 88 },
                        { criterion: 'Perf', react: 92, vue: 94, angular: 86 },
                        { criterion: 'DX', react: 96, vue: 91, angular: 78 },
                        { criterion: 'Bundle', react: 85, vue: 92, angular: 74 },
                        { criterion: 'Docs', react: 94, vue: 87, angular: 90 },
                      ]}
                      height={250}
                    />
                  </div>

                  {/* Pie/Donut Chart - full width */}
                  <div className="chart-card charts-grid--full">
                    <div className="chart-card__header">
                      <div>
                        <h3 className="chart-card__name">Flavor Popularity</h3>
                        <p className="chart-card__subtitle">Which Catppuccin flavor users love most — hover each slice</p>
                      </div>
                      <div className="chart-card__badge">🍩 Donut</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
                      <CtpPieChart
                        donut
                        height={280}
                        data={[
                          { name: 'Macchiato', value: 38400 },
                          { name: 'Mocha', value: 29700 },
                          { name: 'Frappé', value: 18200 },
                          { name: 'Latte', value: 14600 },
                        ]}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                          { name: 'Macchiato', value: '38.4K', pct: '38%', colorIdx: 0 },
                          { name: 'Mocha', value: '29.7K', pct: '30%', colorIdx: 1 },
                          { name: 'Frappé', value: '18.2K', pct: '18%', colorIdx: 2 },
                          { name: 'Latte', value: '14.6K', pct: '15%', colorIdx: 3 },
                        ].map((item) => (
                          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: ['var(--ctp-mauve)', 'var(--ctp-blue)', 'var(--ctp-green)', 'var(--ctp-peach)'][item.colorIdx],
                              flexShrink: 0,
                            }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ctp-text)' }}>{item.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--ctp-subtext0)' }}>{item.value} downloads</div>
                            </div>
                            <div style={{
                              background: 'var(--ctp-surface1)',
                              borderRadius: '6px',
                              padding: '2px 8px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              color: 'var(--ctp-text)',
                              fontVariantNumeric: 'tabular-nums',
                            }}>{item.pct}</div>
                          </div>
                        ))}
                        <div style={{ marginTop: '8px', padding: '12px', background: 'var(--ctp-mantle)', borderRadius: '10px', fontSize: '0.78rem', color: 'var(--ctp-subtext0)', lineHeight: 1.5 }}>
                          💡 <strong style={{ color: 'var(--ctp-text)' }}>Tip:</strong> Hover over each donut slice to see detailed stats with an animated expand effect.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Bar Chart - full width */}
                  <div className="chart-card charts-grid--full">
                    <div className="chart-card__header">
                      <div>
                        <h3 className="chart-card__name">Top Ports by Stars</h3>
                        <p className="chart-card__subtitle">GitHub stars across the Catppuccin ecosystem</p>
                      </div>
                      <div className="chart-card__badge">↔️ Horizontal Bar</div>
                    </div>
                    <CtpBarChart
                      xAxisKey="name"
                      layout="vertical"
                      series={[{ key: 'stars', label: 'Stars (k)' }]}
                      rainbowMode
                      showLegend={false}
                      data={[
                        { name: 'VS Code', stars: 4800 },
                        { name: 'GitHub CSS', stars: 2500 },
                        { name: 'Neovim', stars: 3500 },
                        { name: 'Discord', stars: 2100 },
                        { name: 'Firefox', stars: 1600 },
                        { name: 'KDE Plasma', stars: 1700 },
                        { name: 'Alacritty', stars: 1200 },
                        { name: 'Spicetify', stars: 1100 },
                      ]}
                      height={320}
                    />
                  </div>
                </div>

                {/* Info box about theme reactivity */}
                <div style={{
                  marginTop: '24px',
                  padding: '20px 24px',
                  background: 'linear-gradient(135deg, color-mix(in srgb, var(--ctp-mauve) 10%, transparent), color-mix(in srgb, var(--ctp-blue) 8%, transparent))',
                  border: '1px solid color-mix(in srgb, var(--ctp-mauve) 20%, transparent)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                }}>
                  <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>🎨</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--ctp-text)', marginBottom: '6px', fontSize: '0.95rem' }}>Reactive Theme Colors</div>
                    <div style={{ color: 'var(--ctp-subtext1)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                      All charts read colors from <code style={{ background: 'var(--ctp-surface0)', padding: '1px 5px', borderRadius: '4px', fontSize: '0.8rem' }}>CSS custom properties</code> at runtime via a custom hook. Switch the flavor using the theme buttons in the top bar — the charts <strong style={{ color: 'var(--ctp-text)' }}>recolor instantly</strong> without any re-renders, powered by a <code style={{ background: 'var(--ctp-surface0)', padding: '1px 5px', borderRadius: '4px', fontSize: '0.8rem' }}>MutationObserver</code> watching the <code style={{ background: 'var(--ctp-surface0)', padding: '1px 5px', borderRadius: '4px', fontSize: '0.8rem' }}>data-theme</code> attribute.
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
          {activeComponent === 'skeleton' && (
            <>
              <section>
                <h2 className="section-title"><span>💀</span> Skeleton Playground</h2>
                <div className="playground-section">
                  <div className="playground-card">
                    <h3>Preview</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', background: 'var(--ctp-mantle)', borderRadius: '12px' }}>
                      <Skeleton variant="text" size="lg" width="60%" />
                      <Skeleton variant="text" size="md" width="80%" />
                      <Skeleton variant="text" size="sm" width="40%" />
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                        <Skeleton variant="circle" size="xl" />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <Skeleton variant="text" size="md" width="50%" />
                          <Skeleton variant="text" size="sm" width="70%" />
                        </div>
                      </div>
                      <Skeleton variant="rect" size="xl" />
                      <Skeleton count={3} gap="8px" variant="text" size="sm" />
                    </div>
                  </div>
                </div>
                <div style={{ padding: '16px', background: 'var(--ctp-crust)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--ctp-subtext0)', marginTop: '16px' }}>
                  Variants: <code>text</code>, <code>circle</code>, <code>rect</code>. Sizes: <code>sm</code>, <code>md</code>, <code>lg</code>, <code>xl</code>.
                  Use <code>count</code> for repeated skeletons, <code>animated=false</code> to disable shimmer.
                </div>
              </section>
            </>
          )}
          {activeComponent === 'alert' && (
            <>
              <section>
                <h2 className="section-title"><span>⚠️</span> Alert Playground</h2>
                <div className="playground-section">
                  <div className="playground-card">
                    <h3>Variants</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <Alert variant="info" title="Information">This is an informational alert.</Alert>
                      <Alert variant="success" title="Success">Operation completed successfully.</Alert>
                      <Alert variant="warning" title="Warning">Please review before proceeding.</Alert>
                      <Alert variant="error" title="Error">Something went wrong.</Alert>
                    </div>
                  </div>
                  <div className="playground-card" style={{ marginTop: '16px' }}>
                    <h3>Dismissible</h3>
                    <Alert variant="info" title="Dismiss me" dismissible>Click the X to dismiss this alert.</Alert>
                  </div>
                </div>
              </section>
            </>
          )}
          {activeComponent === 'avatar' && (
            <>
              <section>
                <h2 className="section-title"><span>👤</span> Avatar Playground</h2>
                <div className="playground-section">
                  <div className="playground-card">
                    <h3>Individual Avatars</h3>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Avatar src="https://i.pravatar.cc/64?img=1" size="sm" />
                      <Avatar src="https://i.pravatar.cc/64?img=2" size="md" />
                      <Avatar src="https://i.pravatar.cc/64?img=3" size="lg" />
                      <Avatar src="https://i.pravatar.cc/64?img=4" size="xl" />
                      <Avatar fallback="John Doe" size="md" />
                      <Avatar fallback="A" size="md" />
                    </div>
                  </div>
                  <div className="playground-card" style={{ marginTop: '16px' }}>
                    <h3>Avatar Group</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                      <AvatarGroup max={4}>
                        <Avatar src="https://i.pravatar.cc/64?img=5" />
                        <Avatar src="https://i.pravatar.cc/64?img=6" />
                        <Avatar src="https://i.pravatar.cc/64?img=7" />
                        <Avatar src="https://i.pravatar.cc/64?img=8" />
                        <Avatar src="https://i.pravatar.cc/64?img=9" />
                      </AvatarGroup>
                      <AvatarGroup size="lg" max={3}>
                        <Avatar fallback="Alice" />
                        <Avatar fallback="Bob" />
                        <Avatar fallback="Charlie" />
                        <Avatar fallback="Diana" />
                        <Avatar fallback="Eve" />
                      </AvatarGroup>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
          {activeComponent === 'breadcrumb' && (
            <>
              <section>
                <h2 className="section-title"><span>🍞</span> Breadcrumb Playground</h2>
                <div className="playground-section">
                  <div className="playground-card">
                    <h3>Examples</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px', background: 'var(--ctp-mantle)', borderRadius: '12px' }}>
                      <Breadcrumb items={[
                        { label: 'Home', href: '/' },
                        { label: 'Documentation', href: '/docs' },
                        { label: 'Components' },
                      ]} />
                      <Breadcrumb items={[
                        { label: '🐱 Catppuccin', href: '/' },
                        { label: 'Design System', href: '/ds' },
                        { label: 'React' },
                      ]} />
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
          {activeComponent === 'carousel' && (
            <>
              <section>
                <h2 className="section-title"><span>🎠</span> Carousel Playground</h2>
                <div className="playground-section">
                  <div className="playground-card">
                    <h3>Auto-play Carousel</h3>
                    <Carousel autoPlay autoPlayInterval={3000}>
                      {[
                        { color: 'var(--ctp-mauve)', label: 'Mauve' },
                        { color: 'var(--ctp-blue)', label: 'Blue' },
                        { color: 'var(--ctp-green)', label: 'Green' },
                        { color: 'var(--ctp-peach)', label: 'Peach' },
                      ].map((slide, i) => (
                        <div key={i} style={{
                          height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: slide.color, borderRadius: 12, fontSize: '1.5rem', fontWeight: 700,
                          color: 'var(--ctp-base)'
                        }}>
                          {slide.label}
                        </div>
                      ))}
                    </Carousel>
                  </div>
                </div>
                <div style={{ padding: '16px', background: 'var(--ctp-crust)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--ctp-subtext0)', marginTop: '16px' }}>
                  Props: <code>showArrows</code>, <code>showDots</code>, <code>autoPlay</code>, <code>autoPlayInterval</code>.
                  Navigation via keyboard, swipe, or dots.
                </div>
              </section>
            </>
          )}
          {activeComponent === 'toast' && (
            <>
              <section>
                <h2 className="section-title"><span>🍞</span> Toast / Snackbar Playground</h2>
                <div className="playground-section">
                  <div className="playground-card">
                    <h3>Position</h3>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {(['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'] as const).map(p => (
                        <button key={p} className={`btn btn--sm ${toastPosition === p ? 'btn--filled btn--mauve' : 'btn--outline'}`} onClick={() => setToastPosition(p)}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="playground-card">
                    <h3>Mode</h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <button className={`btn btn--sm ${!toastFilled ? 'btn--filled btn--mauve' : 'btn--outline'}`} onClick={() => setToastFilled(false)}>
                        Accent (borda)
                      </button>
                      <button className={`btn btn--sm ${toastFilled ? 'btn--filled btn--mauve' : 'btn--outline'}`} onClick={() => setToastFilled(true)}>
                        Filled (fundo)
                      </button>
                    </div>
                  </div>
                  <div className="playground-card">
                    <h3>Color Override</h3>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <button
                        className={`btn btn--sm ${!toastColor ? 'btn--filled btn--mauve' : 'btn--outline'}`}
                        onClick={() => setToastColor('')}
                      >
                        Default (via variant)
                      </button>
                      {colors.map(c => (
                        <button
                          key={c.name}
                          title={c.name}
                          onClick={() => setToastColor(c.name.toLowerCase() as ToastColor)}
                          style={{
                            width: 32, height: 32, borderRadius: 8, border: toastColor === c.name.toLowerCase() ? '3px solid var(--ctp-text)' : '2px solid transparent',
                            background: `var(${c.variable})`, cursor: 'pointer', outline: 'none',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="playground-card">
                    <h3>Custom CSS Class</h3>
                    <input
                      type="text"
                      placeholder="e.g. my-toast-class"
                      value={toastCustomClass}
                      onChange={e => setToastCustomClass(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--ctp-surface0)', background: 'var(--ctp-mantle)', color: 'var(--ctp-text)', width: '100%', maxWidth: 300 }}
                    />
                  </div>
                  <div className="playground-card">
                    <h3>Trigger Toasts</h3>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button className="btn" onClick={() => toast({
                        title: 'Saved', description: 'Your changes have been saved.', variant: 'info',
                        position: toastPosition, filled: toastFilled, color: toastColor || undefined,
                        className: toastCustomClass || undefined,
                      })}>
                        Info Toast
                      </button>
                      <button className="btn" onClick={() => toast({
                        title: 'Success!', description: 'Operation completed.', variant: 'success',
                        position: toastPosition, filled: toastFilled, color: toastColor || undefined,
                        className: toastCustomClass || undefined,
                      })}>
                        Success Toast
                      </button>
                      <button className="btn" onClick={() => toast({
                        title: 'Warning', description: 'Please check your input.', variant: 'warning',
                        position: toastPosition, filled: toastFilled, color: toastColor || undefined,
                        className: toastCustomClass || undefined,
                      })}>
                        Warning Toast
                      </button>
                      <button className="btn" onClick={() => toast({
                        title: 'Error', description: 'Something went wrong.', variant: 'error',
                        position: toastPosition, filled: toastFilled, color: toastColor || undefined,
                        className: toastCustomClass || undefined,
                      })}>
                        Error Toast
                      </button>
                    </div>
                  </div>
                </div>
                <Toaster position={toastPosition} />
              </section>
            </>
          )}

          {/* ============================================================
              TEMPLATE / EXAMPLE PAGE
              Demonstrates a real-world dashboard affected by global
              [data-shape] [data-density] [data-font-theme] [data-theme]
              ============================================================ */}
          {activeComponent === 'template' && (
            <section className="template-page" style={{ padding: '0' }}>
              {/* ----- Header Bar ----- */}
              <div className="template-header">
                <div className="template-header-left">
                  <Breadcrumb
                    items={[
                      { label: 'Dashboard', href: '#' },
                      { label: 'Analytics', href: '#' },
                      { label: 'Overview', href: '#' },
                    ]}
                  />
                  <h1 className="template-title">Analytics Overview</h1>
                </div>
                <div className="template-header-right">
                  <Badge color="green" variant="tonal" size="sm">Live</Badge>
                  <Button variant="outline" color="mauve" size="sm">
                    <EditIcon /> Edit
                  </Button>
                  <Button variant="outline" color="blue" size="sm">
                    <DownloadIcon /> Export
                  </Button>
                  <Button variant="filled" color="mauve" size="sm">
                    <PlusIcon /> New Report
                  </Button>
                </div>
              </div>

              {/* ----- Stats Row ----- */}
              <div className="template-stats">
                <Card variant="filled" className="template-stat-card">
                  <div className="template-stat-icon" style={{ backgroundColor: 'color-mix(in srgb, var(--ctp-blue) 15%, transparent)', color: 'var(--ctp-blue)' }}>
                    <UserIcon />
                  </div>
                  <div className="template-stat-info">
                    <span className="template-stat-label">Total Users</span>
                    <span className="template-stat-value">24.8k</span>
                    <span className="template-stat-trend" data-state="up">
                      <ArrowUpIcon /> 12.5%
                    </span>
                  </div>
                </Card>

                <Card variant="filled" className="template-stat-card">
                  <div className="template-stat-icon" style={{ backgroundColor: 'color-mix(in srgb, var(--ctp-green) 15%, transparent)', color: 'var(--ctp-green)' }}>
                    <SparklesIcon />
                  </div>
                  <div className="template-stat-info">
                    <span className="template-stat-label">Revenue</span>
                    <span className="template-stat-value">$48.2k</span>
                    <span className="template-stat-trend" data-state="up">
                      <ArrowUpIcon /> 8.2%
                    </span>
                  </div>
                </Card>

                <Card variant="filled" className="template-stat-card">
                  <div className="template-stat-icon" style={{ backgroundColor: 'color-mix(in srgb, var(--ctp-peach) 15%, transparent)', color: 'var(--ctp-peach)' }}>
                    <FolderIcon />
                  </div>
                  <div className="template-stat-info">
                    <span className="template-stat-label">Active Projects</span>
                    <span className="template-stat-value">142</span>
                    <span className="template-stat-trend" data-state="up">
                      <ArrowUpIcon /> 4.1%
                    </span>
                  </div>
                </Card>

                <Card variant="filled" className="template-stat-card">
                  <div className="template-stat-icon" style={{ backgroundColor: 'color-mix(in srgb, var(--ctp-red) 15%, transparent)', color: 'var(--ctp-red)' }}>
                    <MouseIcon />
                  </div>
                  <div className="template-stat-info">
                    <span className="template-stat-label">Conversion</span>
                    <span className="template-stat-value">3.24%</span>
                    <span className="template-stat-trend" data-state="down">
                      <ArrowDownIcon /> 2.4%
                    </span>
                  </div>
                </Card>
              </div>

              {/* ----- Two-Column Content ----- */}
              <div className="template-content-grid">
                {/* ----- Left Column ----- */}
                <div className="template-col-main">
                  <Card variant="elevated" padding="lg">
                    <Tabs defaultValue="overview" variant="filled">
                      <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="traffic">Traffic</TabsTrigger>
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview" style={{ paddingTop: 'var(--ctp-space-md, 16px)' }}>
                        <div className="template-section-header">
                          <h3 className="template-section-title">Recent Transactions</h3>
                          <Badge color="mauve" variant="tonal" size="sm">14 new</Badge>
                        </div>
                        <table className="template-table">
                          <thead>
                            <tr>
                              <th>Transaction</th>
                              <th>Amount</th>
                              <th>Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><span className="template-tx-name">Payment to Acme Corp</span></td>
                              <td><strong>$2,400.00</strong></td>
                              <td>Jul 15, 2026</td>
                              <td><Badge color="green" variant="tonal" size="sm">Completed</Badge></td>
                            </tr>
                            <tr>
                              <td><span className="template-tx-name">Refund — John Doe</span></td>
                              <td><strong>$180.00</strong></td>
                              <td>Jul 14, 2026</td>
                              <td><Badge color="yellow" variant="tonal" size="sm">Pending</Badge></td>
                            </tr>
                            <tr>
                              <td><span className="template-tx-name">Subscription — SaaS Co</span></td>
                              <td><strong>$99.00</strong></td>
                              <td>Jul 13, 2026</td>
                              <td><Badge color="green" variant="tonal" size="sm">Completed</Badge></td>
                            </tr>
                            <tr>
                              <td><span className="template-tx-name">Invoice #482 — Design Inc</span></td>
                              <td><strong>$3,600.00</strong></td>
                              <td>Jul 12, 2026</td>
                              <td><Badge color="blue" variant="tonal" size="sm">Processing</Badge></td>
                            </tr>
                            <tr>
                              <td><span className="template-tx-name">Withdrawal — ATM</span></td>
                              <td><strong>$200.00</strong></td>
                              <td>Jul 11, 2026</td>
                              <td><Badge color="red" variant="tonal" size="sm">Failed</Badge></td>
                            </tr>
                          </tbody>
                        </table>
                      </TabsContent>
                      <TabsContent value="traffic" style={{ paddingTop: 'var(--ctp-space-md, 16px)' }}>
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--ctp-subtext0)', fontStyle: 'italic' }}>
                          Traffic analytics panel — chart placeholder
                        </div>
                      </TabsContent>
                      <TabsContent value="reports" style={{ paddingTop: 'var(--ctp-space-md, 16px)' }}>
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--ctp-subtext0)', fontStyle: 'italic' }}>
                          Generated reports list — placeholder
                        </div>
                      </TabsContent>
                    </Tabs>
                  </Card>
                </div>

                {/* ----- Right Column ----- */}
                <div className="template-col-side">
                  {/* Team Members */}
                  <Card variant="elevated" className="template-side-card">
                    <h3 className="template-section-title">Team</h3>
                    <AvatarGroup size="md">
                      <Avatar fallback="AM" />
                      <Avatar fallback="JD" />
                      <Avatar fallback="RK" />
                      <Avatar fallback="LP" />
                      <Avatar fallback="SC" />
                    </AvatarGroup>
                    <div style={{ marginTop: 'var(--ctp-space-sm, 8px)', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <Badge color="mauve" size="sm">Design</Badge>
                      <Badge color="blue" size="sm">Engineering</Badge>
                      <Badge color="green" size="sm">Product</Badge>
                      <Badge color="peach" size="sm">Marketing</Badge>
                    </div>
                  </Card>

                  {/* Project Progress */}
                  <Card variant="elevated" className="template-side-card">
                    <h3 className="template-section-title">Project Progress</h3>
                    <div className="template-progress-list">
                      <div className="template-progress-item">
                        <div className="template-progress-header">
                          <span>Design System</span>
                          <span className="template-progress-pct">85%</span>
                        </div>
                        <ProgressBar value={85} color="mauve" size="sm" />
                      </div>
                      <div className="template-progress-item">
                        <div className="template-progress-header">
                          <span>Frontend Migration</span>
                          <span className="template-progress-pct">62%</span>
                        </div>
                        <ProgressBar value={62} color="blue" size="sm" />
                      </div>
                      <div className="template-progress-item">
                        <div className="template-progress-header">
                          <span>Documentation</span>
                          <span className="template-progress-pct">40%</span>
                        </div>
                        <ProgressBar value={40} color="yellow" size="sm" />
                      </div>
                      <div className="template-progress-item">
                        <div className="template-progress-header">
                          <span>API Integration</span>
                          <span className="template-progress-pct">28%</span>
                        </div>
                        <ProgressBar value={28} color="peach" size="sm" />
                      </div>
                    </div>
                  </Card>

                  {/* Alerts + Actions */}
                  <Card variant="elevated" className="template-side-card">
                    <h3 className="template-section-title">Notifications</h3>
                    <Alert variant="info" title="New feature" description="Dashboard layout powered by the Catppuccin Design System." />
                    <Alert variant="warning" title="Scheduled Maintenance" description="Saturday, 2:00 AM — 4:00 AM UTC." />
                  </Card>

                  {/* Quick Actions */}
                  <div className="template-actions">
                    <Button variant="filled" color="mauve" style={{ flex: 1 }}>
                      <SparklesIcon /> Upgrade Plan
                    </Button>
                    <Button variant="ghost" color="blue" style={{ flex: 1 }}>
                      <HelpIcon /> Documentation
                    </Button>
                  </div>
                </div>
              </div>

              {/* ----- Density / Shape Info Bar ----- */}
              <div style={{
                marginTop: 'var(--ctp-space-xl, 32px)',
                padding: 'var(--ctp-space-sm, 8px) var(--ctp-space-md, 16px)',
                borderRadius: 'var(--ctp-radius-base, 8px)',
                backgroundColor: 'var(--ctp-color-surface-raised, var(--ctp-surface1))',
                border: '1px solid var(--ctp-color-border, color-mix(in srgb, var(--ctp-text) 12%, transparent))',
                fontSize: '0.75rem',
                fontFamily: 'var(--ctp-font-mono)',
                color: 'var(--ctp-color-text-muted, var(--ctp-subtext0))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--ctp-space-sm, 8px)',
              }}>
                <span>Theme:</span>
                <Badge color="mauve" variant="tonal" size="sm">{theme}</Badge>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
