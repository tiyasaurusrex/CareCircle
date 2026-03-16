import { getToken } from "./api";
export interface SOSEvent {
  userId: string;
  userName: string;
  caregiverNumber: string;
  timestamp: string;
  latitude: number | null;
  longitude: number | null;
  mapsLink: string | null;
  status: "pending" | "notified" | "failed";
}

export interface SOSResult {
  success: boolean;
  waUrl: string | null;
  popupBlocked: boolean;
  message: string;
  event: SOSEvent | null;
}
export function normalizeCaregiverNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}
export function getCurrentLocation(): Promise<{
  lat: number;
  lng: number;
} | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null), // permission denied or error → null
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  });
}
export function buildSOSMessage(
  userName: string,
  mapsLink: string | null,
  timestamp: string,
): string {
  const locationLine = mapsLink || "Location unavailable";
  return [
    " Emergency! I need help.",
    "",
    `Name: ${userName}`,
    `Location: ${locationLine}`,
    `Timestamp: ${timestamp}`,
  ].join("\n");
}
export function buildWhatsAppUrl(
  caregiverNumber: string,
  message: string,
): string {
  return `https://wa.me/${caregiverNumber}?text=${encodeURIComponent(message)}`;
}
export async function saveEmergencyEvent(event: SOSEvent): Promise<void> {
  const token = getToken();
  let retries = 1;
  while (retries >= 0) {
    try {
      const res = await fetch("/api/emergency-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(event),
      });
      if (res.ok) return;
      throw new Error("Failed to save emergency event");
    } catch {
      if (retries === 0)
        throw new Error("Could not save emergency event after retry");
      retries--;
    }
  }
}
export async function triggerSOS(
  userName: string,
  caregiverPhone: string,
  userId: string,
  onLocationStart?: () => void,
  onLocationEnd?: () => void,
): Promise<SOSResult> {
  const caregiverNumber = normalizeCaregiverNumber(caregiverPhone);

  if (!caregiverNumber) {
    return {
      success: false,
      waUrl: null,
      popupBlocked: false,
      message: "No caregiver number found. Please add one in your profile.",
      event: null,
    };
  }
  onLocationStart?.();
  const location = await getCurrentLocation();
  onLocationEnd?.();
  const timestamp = new Date().toISOString();
  const mapsLink = location
    ? `https://maps.google.com/?q=${location.lat},${location.lng}`
    : null;
  const message = buildSOSMessage(userName, mapsLink, timestamp);
  const waUrl = buildWhatsAppUrl(caregiverNumber, message);
  const event: SOSEvent = {
    userId,
    userName,
    caregiverNumber,
    timestamp,
    latitude: location?.lat ?? null,
    longitude: location?.lng ?? null,
    mapsLink,
    status: "pending",
  };
  try {
    await saveEmergencyEvent(event);
    event.status = "notified";
  } catch {
    event.status = "failed";
  }

  let popupBlocked = false;
  try {
    const win = window.open(waUrl, "_blank");
    if (!win || win.closed || typeof win.closed === "undefined") {
      popupBlocked = true;
    }
  } catch {
    popupBlocked = true;
  }
  return {
    success: true,
    waUrl,
    popupBlocked,
    message: popupBlocked
      ? "Popup was blocked. Use the link below to open WhatsApp."
      : "Opening WhatsApp with emergency alert. Please press Send in WhatsApp.",
    event,
  };
}
