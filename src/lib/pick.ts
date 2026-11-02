/**
 * «وضع الاختيار» — تستعمله لوحات خارجية (مثل Botsys) لتختار رقصة/ايتم من هذا الموقع.
 *
 * الطلب:  /emotes?pick=emote&return=<url>&state=<token>[&mode=popup]
 * الرد:   نافذة منبثقة → window.opener.postMessage({type:"highrise-ids:pick", kind, id, name, duration?, state}, origin)
 *         أو تنقّل    → <return>?picked_kind=…&picked_id=…&picked_name=…&picked_duration=…&state=…
 *
 * الأمان: لا نرجع إلا لدومينات في القائمة المسموحة (VITE_PICK_ALLOWED_ORIGINS مفصولة بفاصلة، أو القائمة هنا)،
 * وإلا نتجاهل الطلب كأنه غير موجود — حتى لا يتحول الموقع إلى open redirect.
 * الموقع لا يتصل بأي سيرفر؛ الطرف المستقبِل هو المسؤول عن التحقق من state ومن الـ ID.
 */
import type { IdItem } from "@/components/IdTable";

export type PickKind = "emote" | "item";

export type PickRequest = {
  kind: PickKind;
  returnUrl: string;
  origin: string;
  state: string;
  mode: "popup" | "redirect";
};

/** دومينات مسموحة ثابتة (أضف هنا دومين لوحتك أو استخدم VITE_PICK_ALLOWED_ORIGINS). */
export const PICK_ALLOWED_ORIGINS: string[] = [];

export const PICK_MESSAGE_TYPE = "highrise-ids:pick";

const STATE_RE = /^[A-Za-z0-9_-]{8,128}$/;

function allowedOrigins(extra?: string): string[] {
  const fromEnv = (
    extra ??
    (import.meta.env?.["VITE_PICK_ALLOWED_ORIGINS"] as string | undefined) ??
    ""
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return [...PICK_ALLOWED_ORIGINS, ...fromEnv].map((o) => o.replace(/\/+$/, ""));
}

export function parsePickRequest(
  search: string,
  expectedKind: PickKind,
  allowedOverride?: string,
): PickRequest | null {
  const p = new URLSearchParams(search);
  if (p.get("pick") !== expectedKind) return null;

  const state = p.get("state") ?? "";
  if (!STATE_RE.test(state)) return null;

  let url: URL;
  try {
    url = new URL(p.get("return") ?? "");
  } catch {
    return null;
  }
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.protocol !== "https:" && !(isLocal && url.protocol === "http:")) return null;
  if (!allowedOrigins(allowedOverride).includes(url.origin)) return null;

  return {
    kind: expectedKind,
    returnUrl: url.toString(),
    origin: url.origin,
    state,
    mode: p.get("mode") === "popup" ? "popup" : "redirect",
  };
}

export function buildReturnUrl(req: PickRequest, item: IdItem): string {
  const url = new URL(req.returnUrl);
  url.searchParams.set("picked_kind", req.kind);
  url.searchParams.set("picked_id", item.id);
  url.searchParams.set("picked_name", item.name);
  if (item.duration !== undefined) url.searchParams.set("picked_duration", String(item.duration));
  url.searchParams.set("state", req.state);
  return url.toString();
}

export function buildMessage(req: PickRequest, item: IdItem) {
  return {
    type: PICK_MESSAGE_TYPE,
    kind: req.kind,
    id: item.id,
    name: item.name,
    ...(item.duration === undefined ? {} : { duration: item.duration }),
    state: req.state,
  };
}

/** يرسل الاختيار: نافذة منبثقة إن أمكن، وإلا تنقّل عادي. */
export function sendPick(req: PickRequest, item: IdItem): void {
  if (req.mode === "popup" && window.opener && !window.opener.closed) {
    try {
      window.opener.postMessage(buildMessage(req, item), req.origin);
      window.close();
      return;
    } catch {
      /* نرجع للتنقل */
    }
  }
  window.location.assign(buildReturnUrl(req, item));
}
