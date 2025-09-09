import React from 'react';
import { Plus, Calendar, Moon, Sun, Download, Trash2 } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onAddClass: () => void;
  onFindFreeSlots: () => void;
  onExportSchedule: () => void;
  onClearAll: () => void;
  classCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  onAddClass,
  onFindFreeSlots,
  onExportSchedule,
  onClearAll,
  classCount
}) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Student Scheduler
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {classCount} {classCount === 1 ? 'class' : 'classes'} scheduled
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onFindFreeSlots}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Find Free Time
            </button>

            <button
              onClick={onAddClass}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Class
            </button>

            <div className="flex items-center space-x-2 border-l pl-3 border-gray-300 dark:border-gray-600">
              <button
                onClick={onExportSchedule}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Export Schedule"
              >
                <Download className="w-5 h-5" />
              </button>

              <button
                onClick={onClearAll}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Clear All Classes"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <button
                onClick={onToggleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};