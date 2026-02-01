import { Capacitor } from "@capacitor/core";
import { VoiceRecorder } from "capacitor-voice-recorder";

/**
 * Devuelve true cuando corre dentro de Android/iOS (Capacitor nativo).
 */
export function isNativeApp() {
  return Capacitor.isNativePlatform();
}

function stripBase64Prefix(b64) {
  if (!b64) return "";
  const idx = b64.indexOf("base64,");
  return idx >= 0 ? b64.slice(idx + "base64,".length) : b64;
}

function base64ToBlob(base64, mimeType = "audio/aac") {
  const clean = stripBase64Prefix(base64);
  const byteChars = atob(clean);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

function guessExt(mimeType = "") {
  const m = mimeType.toLowerCase();
  if (m.includes("webm")) return "webm";
  if (m.includes("mp4") || m.includes("m4a")) return "m4a";
  if (m.includes("aac")) return "aac";
  if (m.includes("wav")) return "wav";
  return "audio";
}

/**
 * Asegura permiso de micrófono en runtime.
 */
async function ensureRecordingPermission() {
  const perm = await VoiceRecorder.hasAudioRecordingPermission();
  if (perm?.value) return true;

  const asked = await VoiceRecorder.requestAudioRecordingPermission();
  if (!asked?.value) {
    throw new Error("Permiso de micrófono denegado. Actívalo en Ajustes → Apps → Permisos.");
  }
  return true;
}

export async function startNativeRecording() {
  await ensureRecordingPermission();

  const can = await VoiceRecorder.canDeviceVoiceRecord();
  if (!can?.value) {
    throw new Error("Este dispositivo no puede grabar audio.");
  }

  // Inicia grabación
  await VoiceRecorder.startRecording();
}

export async function stopNativeRecording() {
  // stopRecording devuelve: recordDataBase64, mimeType, msDuration (según README) :contentReference[oaicite:3]{index=3}
  const res = await VoiceRecorder.stopRecording();

  const data = res?.value ?? res;
  const recordDataBase64 = data?.recordDataBase64;
  const mimeType = data?.mimeType || "audio/aac";
  const msDuration = data?.msDuration;

  if (!recordDataBase64) {
    throw new Error("Grabación vacía. Intenta grabar un poco más de tiempo.");
  }

  const blob = base64ToBlob(recordDataBase64, mimeType);

  // Mejor como File para FormData (igual sirve como Blob)
  let file = blob;
  try {
    const ext = guessExt(mimeType);
    file = new File([blob], `grabacion-${Date.now()}.${ext}`, { type: mimeType });
  } catch {
    // si algún WebView no soporta File(), devolvemos Blob igual
  }

  return { blob: file, mimeType, msDuration };
}
