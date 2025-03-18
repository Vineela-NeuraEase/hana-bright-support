
import { LocalNotifications, ScheduleOptions, ActionPerformed } from '@capacitor/local-notifications';
import { Event } from '@/types/event';
import { parseISO, differenceInMinutes } from 'date-fns';

export class NotificationService {
  // Initialize the notification service
  static async initialize() {
    try {
      // Request permission to show notifications
      const permissionStatus = await LocalNotifications.requestPermissions();
      
      if (permissionStatus.display !== 'granted') {
        console.warn('Notification permission not granted');
        return false;
      }
      
      // Register action types if needed
      await LocalNotifications.registerActionTypes({
        types: [
          {
            id: 'EVENT_ACTIONS',
            actions: [
              {
                id: 'view',
                title: 'View',
              },
              {
                id: 'dismiss',
                title: 'Dismiss',
                destructive: true,
              },
            ],
          },
        ],
      });

      // Set up notification action listeners
      LocalNotifications.addListener('localNotificationActionPerformed', 
        (notification: ActionPerformed) => {
          console.log('Action performed on notification', notification);
          if (notification.actionId === 'view') {
            // Could implement navigation to the event here
            console.log('View action: navigate to event', notification.notification.extra);
          }
        }
      );
      
      return true;
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      return false;
    }
  }

  // Schedule notifications for an event based on its reminders
  static async scheduleEventReminders(event: Event) {
    try {
      if (!event.reminders || event.reminders.length === 0) {
        console.log('No reminders to schedule for event:', event.title);
        return;
      }

      // Cancel any existing notifications for this event
      await this.cancelEventNotifications(event.id);
      
      const startTime = typeof event.startTime === 'string' 
        ? parseISO(event.startTime) 
        : event.startTime;
      
      const notifications: ScheduleOptions = {
        notifications: event.reminders.map((minutes, index) => {
          const triggerTime = new Date(startTime.getTime() - minutes * 60 * 1000);
          
          // Skip if the notification time is in the past
          if (triggerTime <= new Date()) {
            console.log(`Skipping reminder ${minutes} minutes before - time already passed`);
            return null;
          }
          
          return {
            id: this.generateNotificationId(event.id, index),
            title: `Reminder: ${event.title}`,
            body: event.description 
              ? `${event.title} starts in ${minutes} minutes - ${event.description}`
              : `${event.title} starts in ${minutes} minutes`,
            schedule: { at: triggerTime },
            actionTypeId: 'EVENT_ACTIONS',
            extra: {
              eventId: event.id,
              startTime: event.startTime,
              endTime: event.endTime
            }
          };
        }).filter(Boolean) // Remove any null entries (past notifications)
      };
      
      if (notifications.notifications.length === 0) {
        console.log('No future notifications to schedule');
        return;
      }
      
      console.log('Scheduling notifications:', notifications);
      await LocalNotifications.schedule(notifications);
    } catch (error) {
      console.error('Failed to schedule notifications:', error);
    }
  }
  
  // Cancel all notifications for an event
  static async cancelEventNotifications(eventId: string) {
    try {
      const pendingNotifications = await LocalNotifications.getPending();
      
      const notificationIdsToCancel = pendingNotifications.notifications
        .filter(notification => {
          const extra = notification.extra as { eventId: string } | undefined;
          return extra && extra.eventId === eventId;
        })
        .map(notification => notification.id);
      
      if (notificationIdsToCancel.length > 0) {
        await LocalNotifications.cancel({ notifications: notificationIdsToCancel.map(id => ({ id })) });
        console.log(`Cancelled ${notificationIdsToCancel.length} notifications for event ${eventId}`);
      }
    } catch (error) {
      console.error('Failed to cancel notifications:', error);
    }
  }
  
  // Helper to generate unique notification IDs for an event
  private static generateNotificationId(eventId: string, index: number): number {
    // Create a deterministic notification ID using the event ID
    // This allows us to find and cancel notifications for a specific event
    // We use a simple hash of the event ID plus the reminder index
    const hash = eventId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    // Add the index to make each reminder unique, multiply by 1000 to avoid collisions
    return (hash * 1000) + index;
  }
  
  // Check and update notifications for all events
  static async updateAllEventNotifications(events: Event[]) {
    try {
      for (const event of events) {
        await this.scheduleEventReminders(event);
      }
      console.log(`Updated notifications for ${events.length} events`);
    } catch (error) {
      console.error('Failed to update all notifications:', error);
    }
  }
}
