/**
 * Production Link Authenticity & Anti-Cheat Validator
 * Blocks dummy/fake links, validates live domain patterns, and prevents duplicate submissions.
 */

const BLOCKED_DOMAINS = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "example.com",
  "test.com",
  "fake.com",
  "dummy.com",
  "temp.com",
  "tempmail.com",
  "none.com",
];

export interface LinkValidationResult {
  isValid: boolean;
  domain?: string;
  category?: string;
  error?: string;
  warning?: string;
}

export function validateTaskSubmissionUrl(rawUrl: string, expectedType?: string): LinkValidationResult {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { isValid: false, error: "Submission URL cannot be empty." };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { isValid: false, error: "Please enter a valid, complete web address starting with https://" };
  }

  // Must be HTTPS or HTTP
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { isValid: false, error: "Invalid protocol. Link must begin with https://" };
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");

  // Block fake or test domains
  if (BLOCKED_DOMAINS.some((blocked) => hostname === blocked || hostname.endsWith("." + blocked))) {
    return { isValid: false, error: `Invalid link domain (${hostname}). Test or dummy domains are not accepted.` };
  }

  // Check specific platforms
  if (hostname.includes("linkedin.com")) {
    const path = parsed.pathname.toLowerCase();
    const isPost = path.includes("/posts/") || path.includes("/feed/update/") || path.includes("/pulse/");
    if (!isPost && expectedType === "linkedin") {
      return {
        isValid: false,
        error: "Invalid LinkedIn link. Must be a direct link to your published post (e.g. linkedin.com/posts/...)",
      };
    }
    return { isValid: true, domain: "linkedin.com", category: "Social Media Post" };
  }

  if (hostname.includes("github.com")) {
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length < 2 && expectedType === "github") {
      return {
        isValid: false,
        error: "Invalid GitHub link. Must be a link to a repository, pull request, or issue (e.g. github.com/user/repo).",
      };
    }
    return { isValid: true, domain: "github.com", category: "Code Repository / Pull Request" };
  }

  if (hostname.includes("forms.gle") || (hostname.includes("docs.google.com") && parsed.pathname.includes("/forms/"))) {
    return { isValid: true, domain: "google.com", category: "Google Form" };
  }

  if (hostname.includes("chat.whatsapp.com")) {
    return { isValid: true, domain: "whatsapp.com", category: "WhatsApp Community" };
  }

  if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
    return { isValid: true, domain: "x.com", category: "X / Twitter Post" };
  }

  if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
    return { isValid: true, domain: "youtube.com", category: "Video Submission" };
  }

  if (hostname.includes("instagram.com")) {
    return { isValid: true, domain: "instagram.com", category: "Instagram Post / Reel" };
  }

  // Generic valid web link
  return {
    isValid: true,
    domain: hostname,
    category: "Web Link",
  };
}

/**
 * Normalizes URLs for strict duplicate detection (stripping tracking query params, www, trailing slashes).
 */
export function normalizeSubmissionUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl.trim());
    url.hostname = url.hostname.replace(/^www\./, "").toLowerCase();

    // Strip social media tracking query params
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "igshid",
      "rcm",
      "trackingId",
      "midSigToken",
      "trk",
    ];
    trackingParams.forEach((param) => url.searchParams.delete(param));

    // Strip trailing slash
    let cleanPath = url.pathname.replace(/\/+$/, "");
    return `${url.protocol}//${url.hostname}${cleanPath}${url.search ? url.search : ""}`;
  } catch {
    return rawUrl.trim().toLowerCase();
  }
}
