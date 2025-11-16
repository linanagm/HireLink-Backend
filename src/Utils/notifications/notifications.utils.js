import { prisma } from "../../../prisma/client.js";

export const createNotification = async (  recipientId, message, type = "GENERAL", senderId) => {
  
  
  return await prisma.notification.create({
      data: {
        recipientId,
        message,
        type,
        senderId
      },
    });
  
}
