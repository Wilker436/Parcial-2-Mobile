export interface NotificationData{
 userId: string;   
 meeting: string 
 type: string;
 name: string;
 emisorID: string
} 

export interface NotificationPayLoad{
    token: string;
    notification:{
        title: string;
        body: string;
    }
    android: {
        priority: string;
        data: NotificationData
    }
} 

