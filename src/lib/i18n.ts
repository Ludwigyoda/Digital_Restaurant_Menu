export const hasCJK = (s: string | undefined): boolean =>
  !!s && /[一-鿿]/.test(s);
