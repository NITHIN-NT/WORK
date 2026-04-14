"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'task' | 'milestone' | 'meeting';
  project: string;
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('date', { ascending: true });

    if (!error && data) {
      setEvents(data.map(e => ({
        ...e,
        date: new Date(e.date)
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();

    const channel = supabase.channel('calendar_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_events' }, () => {
        fetchEvents();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, [fetchEvents]);

  const addEvent = useCallback(async (eventData: { title: string; date: Date; type: string; project: string }) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .insert([
          {
            ...eventData,
            date: eventData.date.toISOString(),
          }
        ]);
      if (error) throw error;
    } catch (error) {
      console.error("Failed to add calendar event:", error);
      throw error;
    }
  }, []);

  return { events, loading, addEvent };
}

