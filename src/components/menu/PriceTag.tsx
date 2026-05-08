type Props = { value: number | string; muted?: boolean };

export function PriceTag({ value, muted }: Props) {
  return (
    <span
      className={`tabular font-display text-lg ${muted ? "text-muted-foreground" : "text-foreground"}`}
    >
      ¥{value}
    </span>
  );
}
