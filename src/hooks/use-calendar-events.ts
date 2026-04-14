"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  orderBy,
  Timestamp
} from "firebase/firestore";

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

  useEffect(() => {
    const eventsRef = collection(db, "calendar_events");
    const q = query(eventsRef, orderBy("date", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsList = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
        };
      }) as CalendarEvent[];
      
      setEvents(eventsList);
      setLoading(false);
    }, (error) => {
      console.error("Calendar events subscription error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addEvent = useCallback(async (eventData: { title: string; date: Date; type: string; project: string }) => {
    try {
      const eventsRef = collection(db, "calendar_events");
      await addDoc(eventsRef, {
        ...eventData,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to add calendar event:", error);
      throw error;
    }
  }, []);

  return { events, loading, addEvent };
}
