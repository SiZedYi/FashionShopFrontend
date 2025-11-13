import { Slider } from "../types/slider";

export async function getActiveSliders(): Promise<Slider[] | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sliders/active`);
    if (!res.ok) {
      console.error('getActiveSliders failed', res.status, res.statusText);
      return null;
    }
    const json = await res.json();
    if (!Array.isArray(json)) return null;
    return json as Slider[];
  } catch (err) {
    console.error('getActiveSliders error', err);
    return null;
  }
}
