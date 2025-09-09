import React from 'react';
import { Edit2, Trash2, MapPin, Clock } from 'lucide-react';
import { ClassSession, DayOfWeek } from '../types';

interface ClassListProps {
  classes: ClassSession[];
  onEditClass: (classSession: ClassSession) => void;
  onDeleteClass: (day: DayOfWeek, classId: string) => void;
}

export const ClassList: React.FC<ClassListProps> = ({
  classes,
  onEditClass,
  onDeleteClass
}) => {
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const sortedClasses = [...classes].sort((a, b) => {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayCompare = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    if (dayCompare !== 0) return dayCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  if (classes.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="text-gray-500 dark:text-gray-400">
          <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Classes Scheduled</h3>
          <p className="text-sm">Add your first class to get started with scheduling!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <h2 className="text-xl font-bold">All Classes</h2>
        <p className="text-purple-100">Manage your schedule</p>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
        {sortedClasses.map(classSession => (
          <div
            key={classSession.id}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: classSession.color }}
                  />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {classSession.courseName}
                  </h3>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {classSession.day}, {formatTime(classSession.startTime)} - {formatTime(classSession.endTime)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{classSession.location}</span>
                  </div>
                  
                  {classSession.description && (
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                      {classSession.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEditClass(classSession)}
                  className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Edit class"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteClass(classSession.day, classSession.id)}
                  className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete class"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};