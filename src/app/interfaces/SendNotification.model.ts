export default interface SendNotification {
    token: string;
    notification: Notification
    android: Android;
  }
  
  interface Notification {
    title: string;
    body: string;
  }
  
  interface Android {
    priority: string;
    data: Data;
  }
  
  interface Data {
    userId: string;
    meetingId: string;
    type: string;
    name: string;
    userFrom: string;
  }