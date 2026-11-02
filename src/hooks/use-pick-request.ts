import { useEffect, useState } from "react";
import { parsePickRequest, type PickKind, type PickRequest } from "@/lib/pick";

/** يقرأ طلب الاختيار من الرابط بعد الـ hydration (الصفحات مبنية مسبقاً فلا نقرأ window أثناء البناء). */
export function usePickRequest(kind: PickKind): PickRequest | null {
  const [req, setReq] = useState<PickRequest | null>(null);
  useEffect(() => {
    setReq(parsePickRequest(window.location.search, kind));
  }, [kind]);
  return req;
}
