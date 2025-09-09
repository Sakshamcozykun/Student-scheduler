import { ClassSession, DayOfWeek, TimeSlot, ConflictInfo, FreeSlot } from '../types';

// Linked List Node for time-sorted class storage
export class ClassNode {
  data: ClassSession;
  next: ClassNode | null = null;

  constructor(data: ClassSession) {
    this.data = data;
  }
}

// Linked List implementation for each day
export class DaySchedule {
  head: ClassNode | null = null;

  // Insert class in time-sorted order
  insert(classSession: ClassSession): void {
    const newNode = new ClassNode(classSession);
    
    if (!this.head || this.timeToMinutes(classSession.startTime) < this.timeToMinutes(this.head.data.startTime)) {
      newNode.next = this.head;
      this.head = newNode;
      return;
    }

    let current = this.head;
    while (current.next && this.timeToMinutes(current.next.data.startTime) < this.timeToMinutes(classSession.startTime)) {
      current = current.next;
    }
    
    newNode.next = current.next;
    current.next = newNode;
  }

  // Remove class by ID
  remove(classId: string): boolean {
    if (!this.head) return false;

    if (this.head.data.id === classId) {
      this.head = this.head.next;
      return true;
    }

    let current = this.head;
    while (current.next && current.next.data.id !== classId) {
      current = current.next;
    }

    if (current.next) {
      current.next = current.next.next;
      return true;
    }

    return false;
  }

  // Get all classes as array
  toArray(): ClassSession[] {
    const result: ClassSession[] = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}

// Hash Map implementation for fast conflict detection
export class ScheduleHashMap {
  private map: Map<DayOfWeek, DaySchedule>;

  constructor() {
    this.map = new Map();
    const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach(day => {
      this.map.set(day, new DaySchedule());
    });
  }

  // Add class with conflict detection
  addClass(classSession: ClassSession): ConflictInfo {
    const conflict = this.detectConflict(classSession);
    if (!conflict.hasConflict) {
      const daySchedule = this.map.get(classSession.day);
      if (daySchedule) {
        daySchedule.insert(classSession);
      }
    }
    return conflict;
  }

  // Remove class
  removeClass(day: DayOfWeek, classId: string): boolean {
    const daySchedule = this.map.get(day);
    return daySchedule ? daySchedule.remove(classId) : false;
  }

  // Detect scheduling conflicts using efficient hash map lookup
  detectConflict(newClass: ClassSession): ConflictInfo {
    const daySchedule = this.map.get(newClass.day);
    if (!daySchedule) {
      return { hasConflict: false };
    }

    const existingClasses = daySchedule.toArray();
    const newStart = this.timeToMinutes(newClass.startTime);
    const newEnd = this.timeToMinutes(newClass.endTime);

    for (const existingClass of existingClasses) {
      if (existingClass.id === newClass.id) continue; // Skip self when editing
      
      const existingStart = this.timeToMinutes(existingClass.startTime);
      const existingEnd = this.timeToMinutes(existingClass.endTime);

      // Check for time overlap
      if (newStart < existingEnd && newEnd > existingStart) {
        return {
          hasConflict: true,
          conflictingClass: existingClass,
          message: `Conflicts with ${existingClass.courseName} (${existingClass.startTime}-${existingClass.endTime})`
        };
      }
    }

    return { hasConflict: false };
  }

  // Get all classes for a specific day
  getClassesForDay(day: DayOfWeek): ClassSession[] {
    const daySchedule = this.map.get(day);
    return daySchedule ? daySchedule.toArray() : [];
  }

  // Get all classes
  getAllClasses(): ClassSession[] {
    const allClasses: ClassSession[] = [];
    this.map.forEach((daySchedule) => {
      allClasses.push(...daySchedule.toArray());
    });
    return allClasses;
  }

  // Suggest free time slots
  suggestFreeSlots(duration: number = 60, preferredDays?: DayOfWeek[]): FreeSlot[] {
    const freeSlots: FreeSlot[] = [];
    const startHour = 7; // 7 AM
    const endHour = 21; // 9 PM
    const days = preferredDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    days.forEach(day => {
      const daySchedule = this.map.get(day);
      if (!daySchedule) return;

      const classes = daySchedule.toArray();
      let currentTime = startHour * 60; // Start at 7 AM in minutes

      classes.forEach(classSession => {
        const classStart = this.timeToMinutes(classSession.startTime);
        
        // Check gap before this class
        if (classStart - currentTime >= duration) {
          freeSlots.push({
            day,
            startTime: this.minutesToTime(currentTime),
            endTime: this.minutesToTime(classStart),
            duration: classStart - currentTime
          });
        }
        
        currentTime = Math.max(currentTime, this.timeToMinutes(classSession.endTime));
      });

      // Check gap after last class until end of day
      const endOfDay = endHour * 60;
      if (endOfDay - currentTime >= duration) {
        freeSlots.push({
          day,
          startTime: this.minutesToTime(currentTime),
          endTime: this.minutesToTime(endOfDay),
          duration: endOfDay - currentTime
        });
      }
    });

    return freeSlots.sort((a, b) => b.duration - a.duration); // Sort by duration, longest first
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}