import { useState, useEffect, useCallback } from 'react';
import { ClassSession, ConflictInfo, FreeSlot, DayOfWeek } from '../types';
import { ScheduleHashMap } from '../utils/dataStructures';

export const useScheduler = () => {
  const [scheduleMap] = useState(() => new ScheduleHashMap());
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedClasses = localStorage.getItem('studentScheduler_classes');
    const savedTheme = localStorage.getItem('studentScheduler_theme');
    
    if (savedClasses) {
      const parsedClasses: ClassSession[] = JSON.parse(savedClasses);
      parsedClasses.forEach(cls => scheduleMap.addClass(cls));
      setClasses(parsedClasses);
    }

    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, [scheduleMap]);

  // Save to localStorage whenever classes change
  useEffect(() => {
    localStorage.setItem('studentScheduler_classes', JSON.stringify(classes));
  }, [classes]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('studentScheduler_theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const addClass = useCallback((classSession: ClassSession): ConflictInfo => {
    const conflict = scheduleMap.addClass(classSession);
    if (!conflict.hasConflict) {
      setClasses(scheduleMap.getAllClasses());
    }
    return conflict;
  }, [scheduleMap]);

  const removeClass = useCallback((day: DayOfWeek, classId: string) => {
    const success = scheduleMap.removeClass(day, classId);
    if (success) {
      setClasses(scheduleMap.getAllClasses());
    }
    return success;
  }, [scheduleMap]);

  const updateClass = useCallback((updatedClass: ClassSession): ConflictInfo => {
    // Remove old version first
    const oldClass = classes.find(c => c.id === updatedClass.id);
    if (oldClass) {
      scheduleMap.removeClass(oldClass.day, oldClass.id);
    }

    // Add updated version
    const conflict = scheduleMap.addClass(updatedClass);
    if (!conflict.hasConflict) {
      setClasses(scheduleMap.getAllClasses());
    } else if (oldClass) {
      // If there's a conflict, restore the old class
      scheduleMap.addClass(oldClass);
      setClasses(scheduleMap.getAllClasses());
    }
    
    return conflict;
  }, [scheduleMap, classes]);

  const getClassesForDay = useCallback((day: DayOfWeek): ClassSession[] => {
    return scheduleMap.getClassesForDay(day);
  }, [scheduleMap]);

  const detectConflict = useCallback((classSession: ClassSession): ConflictInfo => {
    return scheduleMap.detectConflict(classSession);
  }, [scheduleMap]);

  const suggestFreeSlots = useCallback((duration: number = 60, preferredDays?: DayOfWeek[]): FreeSlot[] => {
    return scheduleMap.suggestFreeSlots(duration, preferredDays);
  }, [scheduleMap]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const clearAllClasses = useCallback(() => {
    setClasses([]);
    // Create new schedule map
    const newScheduleMap = new ScheduleHashMap();
    Object.setPrototypeOf(scheduleMap, Object.getPrototypeOf(newScheduleMap));
    Object.assign(scheduleMap, newScheduleMap);
  }, [scheduleMap]);

  return {
    classes,
    isDarkMode,
    addClass,
    removeClass,
    updateClass,
    getClassesForDay,
    detectConflict,
    suggestFreeSlots,
    toggleTheme,
    clearAllClasses
  };
};