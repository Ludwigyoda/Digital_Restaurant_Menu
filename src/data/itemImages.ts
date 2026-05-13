// Auto-generated mapping of item IDs to photos
const modules = import.meta.glob("../assets/items/*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export const ITEM_IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(modules).map(([path, url]) => {
    const id = path.split("/").pop()!.replace(".jpg", "");
    return [id, url];
  }),
);
