/**
 * Verifies Cloudflare Turnstile token server-side.
 */
export async function verifyTurnstileToken(token: string, ip?: string): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // In local development or if secret is not set, allow bypass
  if (!secretKey) {
    return { success: true };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (ip) {
      formData.append("remoteip", ip);
    }

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return { success: Boolean(data.success), error: data["error-codes"]?.[0] };
  } catch (err) {
    console.error("Turnstile verification error:", err);
    return { success: false, error: "Turnstile network error" };
  }
}
