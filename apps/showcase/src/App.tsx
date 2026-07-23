import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@mocha-ds/react';
import { Sidebar } from './components/Sidebar';
import { useTheme } from './hooks/useTheme';
import * as Pages from './pages';
import '@mocha-ds/react-pro/pro.css';
import './App.css';

export default function App() {
  const { theme, themes, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="showcase-layout">
      <Sidebar
        theme={theme}
        themes={themes as any}
        setTheme={setTheme}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="showcase-main">
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
          <Routes>
            <Route path="/" element={<Pages.HomePage />} />
            <Route path="/button" element={<Pages.ButtonPage />} />
            <Route path="/buttongroup" element={<Pages.ButtonGroupPage />} />
            <Route path="/stepper" element={<Pages.StepperPage />} />
            <Route path="/modal" element={<Pages.ModalPage />} />
            <Route path="/tabs" element={<Pages.TabsPage />} />
            <Route path="/form" element={<Pages.DynamicFormPage />} />
            <Route path="/steps" element={<Pages.StepsPage />} />
            <Route path="/progress" element={<Pages.ProgressPage />} />
            <Route path="/drawer" element={<Pages.DrawerPage />} />
            <Route path="/select" element={<Pages.SelectPage />} />
            <Route path="/colorpicker" element={<Pages.ColorPickerPage />} />
            <Route path="/pagination" element={<Pages.PaginationPage />} />
            <Route path="/table" element={<Pages.TablePage />} />
            <Route path="/card" element={<Pages.CardPage />} />
            <Route path="/icons" element={<Pages.IconsPage />} />
            <Route path="/badge" element={<Pages.BadgePage />} />
            <Route path="/accordion" element={<Pages.AccordionPage />} />
            <Route path="/dropdown" element={<Pages.DropdownPage />} />
            <Route path="/tooltip" element={<Pages.TooltipPage />} />
            <Route path="/grid" element={<Pages.GridPage />} />
            <Route path="/typography" element={<Pages.TypographyPage />} />
            <Route path="/texteditor" element={<Pages.TextEditorPage />} />
            <Route path="/charts" element={<Pages.ChartsPage />} />
            <Route path="/datepicker" element={<Pages.DatePickerPage />} />
            <Route path="/shell" element={<Pages.ShellPage />} />
            <Route path="/sidebar" element={<Pages.SidebarPage />} />
            <Route path="/skeleton" element={<Pages.SkeletonPage />} />
            <Route path="/alert" element={<Pages.AlertPage />} />
            <Route path="/avatar" element={<Pages.AvatarPage />} />
            <Route path="/breadcrumb" element={<Pages.BreadcrumbPage />} />
            <Route path="/carousel" element={<Pages.CarouselPage />} />
            <Route path="/toast" element={<Pages.ToastPage />} />
            <Route path="/pro" element={<Pages.ProPage />} />
            <Route path="/kanban" element={<Pages.ProPage />} />
            <Route path="/template" element={<Pages.TemplatePage />} />
          </Routes>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
