import React from 'react';
import { Edit2, Trash2, MapPin } from 'lucide-react';
import { ClassSession, DayOfWeek } from '../types';

interface WeeklyCalendarProps {
  classes: ClassSession[];
  onEditClass: (classSession: ClassSession) => void;
  onDeleteClass: (day: DayOfWeek, classId: string) => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  classes,
  onEditClass,
  onDeleteClass
}) => {
  const getClassesForDay = (day: DayOfWeek): ClassSession[] => {
    return classes.filter(cls => cls.day === day).sort((a, b) => 
      a.startTime.localeCompare(b.startTime)
    );
  };

  const getClassPosition = (startTime: string, endTime: string) => {
    const parseTime = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours + minutes / 60;
    };

    const start = parseTime(startTime);
    const end = parseTime(endTime);
    const startOffset = (start - 7) * 60; // Minutes from 7 AM
    const duration = (end - start) * 60; // Duration in minutes

    return {
      top: `${startOffset}px`,
      height: `${Math.max(duration, 30)}px` // Minimum 30px height
    };
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-xl font-bold">Weekly Schedule</h2>
        <p className="text-blue-100">Your classes and events at a glance</p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px] flex">
          {/* Time column */}
          <div className="w-20 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
            <div className="h-12 border-b border-gray-200 dark:border-gray-700"></div>
            {HOURS.map(hour => (
              <div
                key={hour}
                className="h-[60px] border-b border-gray-200 dark:border-gray-700 flex items-start justify-end pr-2 pt-1"
              >
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {hour === 0 ? '12 AM' : hour <= 12 ? `${hour} ${hour === 12 ? 'PM' : 'AM'}` : `${hour - 12} PM`}
                </span>
              </div>
            ))}
          </div>

          {/* Days columns */}
          {DAYS.map(day => (
            <div key={day} className="flex-1 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
              {/* Day header */}
              <div className="h-12 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <span className="font-medium text-gray-900 dark:text-white text-sm">
                  {day.substring(0, 3)}
                </span>
              </div>

              {/* Time slots */}
              <div className="relative" style={{ height: `${15 * 60}px` }}>
                {/* Grid lines */}
                {HOURS.map(hour => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 border-b border-gray-100 dark:border-gray-700"
                    style={{ top: `${(hour - 7) * 60}px`, height: '60px' }}
                  />
                ))}

                {/* Classes */}
                {getClassesForDay(day).map(classSession => {
                  const position = getClassPosition(classSession.startTime, classSession.endTime);
                  return (
                    <div
                      key={classSession.id}
                      className="absolute left-1 right-1 rounded-md p-2 text-white text-xs overflow-hidden group cursor-pointer transform transition-transform hover:scale-[1.02] hover:shadow-lg"
                      style={{
                        ...position,
                        backgroundColor: classSession.color
                      }}
                      onClick={() => onEditClass(classSession)}
                    >
                      <div className="font-semibold truncate mb-1">
                        {classSession.courseName}
                      </div>
                      <div className="flex items-center mb-1 opacity-90">
                        <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{classSession.location}</span>
                      </div>
                      <div className="text-xs opacity-80">
                        {formatTime(classSession.startTime)} - {formatTime(classSession.endTime)}
                      </div>

                      {/* Action buttons - only show on hover */}
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditClass(classSession);
                          }}
                          className="w-6 h-6 bg-white bg-opacity-20 rounded hover:bg-opacity-30 flex items-center justify-center transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClass(day, classSession.id);
                          }}
                          className="w-6 h-6 bg-red-500 bg-opacity-80 rounded hover:bg-opacity-100 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};