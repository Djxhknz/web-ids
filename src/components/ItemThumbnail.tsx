import { useState } from "react";
import { ImageOff } from "lucide-react";
import { itemImageUrl } from "@/lib/item-images";

export function ItemThumbnail({ id, name }: { id: string; name: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className="flex size-14 shrink-0 items-center justify-center rounded-md bg-muted">
      {failed ? (
        <span role="img" aria-label={`${name}: image unavailable`} title="Image unavailable">
          <ImageOff className="size-5 text-muted-foreground" aria-hidden="true" />
        </span>
      ) : (
        <img
          src={itemImageUrl(id)}
          alt={name}
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="size-14 object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}