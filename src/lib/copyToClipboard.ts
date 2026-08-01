import { toast } from "sonner";

export async function copyToClipboard(text: string, label?: string): Promise<boolean> {
  if (!text) return false;
  let success = false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      success = true;
    }
  } catch (err) {
    console.warn("navigator.clipboard failed, attempting fallback execution", err);
  }

  if (!success) {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      success = document.execCommand("copy");
      document.body.removeChild(textArea);
    } catch (err) {
      console.error("execCommand fallback failed", err);
    }
  }

  if (success) {
    toast.success(label ? `${label} copied to clipboard!` : "Copied to clipboard!");
  } else {
    toast.error("Failed to copy automatically. Please select the text and copy manually.");
  }

  return success;
}
