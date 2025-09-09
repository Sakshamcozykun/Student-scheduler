import React, { useState } from 'react';
import { X, Clock, Calendar, Filter } from 'lucide-react';
import { FreeSlot, DayOfWeek } from '../types';

interface FreeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuggest: (duration: number, preferredDays?: DayOfWeek[]) => FreeSlot[];
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const FreeSlotModal: React.FC<FreeSlotModalProps> = ({
  isOpen,
  onClose,
  onSuggest
}) => {
  const [duration, setDuration] = useState(60);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [freeSlots, setFreeSlots] = useState<FreeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSuggest = async () => {
    setIsLoading(true);
    
    // Simulate algorithm processing delay for demonstration
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const slots = onSuggest(duration, selectedDays.length > 0 ? selectedDays : undefined);
    setFreeSlots(slots);
    setIsLoading(false);
  };

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
            Find Free Time Slots
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Clock className="inline w-4 h-4 mr-2" />
                Minimum Duration
              </label>
              <div className="space-y-2">
                {[30, 60, 90, 120, 180].map(mins => (
                  <label key={mins} className="flex items-center">
                    <input
                      type="radio"
                      value={mins}
                      checked={duration === mins}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {formatDuration(mins)}
                    </span>
                  </label>
                ))}
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={![30, 60, 90, 120, 180].includes(duration)}
                    onChange={() => {}}
                    className="mr-2 text-blue-600"
                  />
                  <input
                    type="number"
                    value={![30, 60, 90, 120, 180].includes(duration) ? duration : ''}
                    onChange={(e) => setDuration(Number(e.target.value) || 60)}
                    placeholder="Custom"
                    className="w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    min="15"
                    max="480"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">minutes</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Filter className="inline w-4 h-4 mr-2" />
                Preferred Days (Optional)
              </label>
              <div className="space-y-2">
                {DAYS.map(day => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(day)}
                      onChange={() => toggleDay(day)}
                      className="mr-2 text-blue-600 rounded"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSuggest}
              disabled={isLoading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Analyzing Schedule...
                </>
              ) : (
                'Find Free Slots'
              )}
            </button>
          </div>

          {freeSlots.length > 0 && (
            <div className="border-t dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Suggested Free Time Slots ({freeSlots.length} found)
              </h3>
              <div className="grid gap-3 max-h-60 overflow-y-auto">
                {freeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {slot.day}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {slot.startTime} - {slot.endTime}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatDuration(slot.duration)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        available
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {freeSlots.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <div className="text-gray-500 dark:text-gray-400">
                Click "Find Free Slots" to see available time slots based on your preferences.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};