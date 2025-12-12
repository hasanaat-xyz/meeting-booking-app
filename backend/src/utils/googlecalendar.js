import { calendar } from "@googleapis/calendar";
import { OAuth2Client } from "google-auth-library";

// Create OAuth2 client
export const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

// Set credentials for the OAuth2 client
export const setCredentials = (tokens) => {
  oauth2Client.setCredentials(tokens);
};

// Create a calendar event using @googleapis/calendar
export const createCalendarEvent = async ({ summary, description, start, end }) => {
  try {
    // Create calendar client with OAuth2 authentication
    const calendarClient = calendar({
      version: "v3",
      auth: oauth2Client,
    });

    // Ensure start and end are Date objects
    const startDateTime = start instanceof Date ? start : new Date(start);
    const endDateTime = end instanceof Date ? end : new Date(end);

    // Format dates as ISO strings
    const eventDetails = {
      summary,
      description,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: process.env.TIMEZONE || "UTC",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: process.env.TIMEZONE || "UTC",
      },
    };

    // Insert event into primary calendar
    const response = await calendarClient.events.insert({
      calendarId: "primary",
      requestBody: eventDetails,
    });

    console.log("Event created:", response.data.htmlLink);
    return response.data;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
};

// Get list of calendars (optional helper function)
export const listCalendars = async () => {
  try {
    const calendarClient = calendar({
      version: "v3",
      auth: oauth2Client,
    });

    const response = await calendarClient.calendarList.list();
    return response.data.items || [];
  } catch (error) {
    console.error("Error listing calendars:", error);
    throw error;
  }
};
