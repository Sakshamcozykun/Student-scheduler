import { ClassSession } from '../types';

export const exportScheduleAsText = (classes: ClassSession[]): string => {
  const sortedClasses = [...classes].sort((a, b) => {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayCompare = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    if (dayCompare !== 0) return dayCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  let output = '📅 STUDENT SCHEDULE\n';
  output += '═══════════════════\n\n';

  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  dayOrder.forEach(day => {
    const dayClasses = sortedClasses.filter(cls => cls.day === day);
    if (dayClasses.length > 0) {
      output += `${day.toUpperCase()}\n`;
      output += '─'.repeat(day.length) + '\n';
      
      dayClasses.forEach(cls => {
        const formatTime = (time: string): string => {
          const [hours, minutes] = time.split(':');
          const hour = parseInt(hours);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          return `${hour12}:${minutes} ${ampm}`;
        };

        output += `• ${cls.courseName}\n`;
        output += `  📍 ${cls.location}\n`;
        output += `  🕐 ${formatTime(cls.startTime)} - ${formatTime(cls.endTime)}\n`;
        if (cls.description) {
          output += `  📝 ${cls.description}\n`;
        }
        output += '\n';
      });
    }
  });

  output += `\nTotal Classes: ${classes.length}\n`;
  output += `Generated on: ${new Date().toLocaleDateString()}\n`;

  return output;
};

export const downloadSchedule = (classes: ClassSession[]): void => {
  const content = exportScheduleAsText(classes);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `student-schedule-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};