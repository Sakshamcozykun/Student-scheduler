import React, { useState } from 'react';
import { Header } from './components/Header';
import { WeeklyCalendar } from './components/WeeklyCalendar';
import { ClassList } from './components/ClassList';
import { ClassModal } from './components/ClassModal';
import { FreeSlotModal } from './components/FreeSlotModal';
import { Toast } from './components/Toast';
import { useScheduler } from './hooks/useScheduler';
import { downloadSchedule } from './utils/exportUtils';
import { ClassSession, DayOfWeek, ConflictInfo } from './types';

function App() {
  const {
    classes,
    isDarkMode,
    addClass,
    removeClass,
    updateClass,
    suggestFreeSlots,
    toggleTheme,
    clearAllClasses
  } = useScheduler();

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isFreeSlotModalOpen, setIsFreeSlotModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassSession | undefined>();
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleAddClass = () => {
    setEditingClass(undefined);
    setIsClassModalOpen(true);
  };

  const handleEditClass = (classSession: ClassSession) => {
    setEditingClass(classSession);
    setIsClassModalOpen(true);
  };

  const handleSaveClass = (classSession: ClassSession): ConflictInfo => {
    let conflict: ConflictInfo;
    
    if (editingClass) {
      conflict = updateClass(classSession);
      if (!conflict.hasConflict) {
        showToast('Class updated successfully!', 'success');
      } else {
        showToast(conflict.message || 'Scheduling conflict detected', 'error');
      }
    } else {
      conflict = addClass(classSession);
      if (!conflict.hasConflict) {
        showToast('Class added successfully!', 'success');
      } else {
        showToast(conflict.message || 'Scheduling conflict detected', 'error');
      }
    }
    
    return conflict;
  };

  const handleDeleteClass = (day: DayOfWeek, classId: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      const success = removeClass(day, classId);
      if (success) {
        showToast('Class deleted successfully!', 'success');
      } else {
        showToast('Failed to delete class', 'error');
      }
    }
  };

  const handleExportSchedule = () => {
    try {
      downloadSchedule(classes);
      showToast('Schedule exported successfully!', 'success');
    } catch (error) {
      showToast('Failed to export schedule', 'error');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all classes? This action cannot be undone.')) {
      clearAllClasses();
      showToast('All classes cleared!', 'success');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onAddClass={handleAddClass}
        onFindFreeSlots={() => setIsFreeSlotModalOpen(true)}
        onExportSchedule={handleExportSchedule}
        onClearAll={handleClearAll}
        classCount={classes.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <WeeklyCalendar
              classes={classes}
              onEditClass={handleEditClass}
              onDeleteClass={handleDeleteClass}
            />
          </div>
          
          <div className="lg:col-span-1">
            <ClassList
              classes={classes}
              onEditClass={handleEditClass}
              onDeleteClass={handleDeleteClass}
            />
          </div>
        </div>
      </main>

      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onSave={handleSaveClass}
        editingClass={editingClass}
      />

      <FreeSlotModal
        isOpen={isFreeSlotModalOpen}
        onClose={() => setIsFreeSlotModalOpen(false)}
        onSuggest={suggestFreeSlots}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}

export default App;