import Cookies from 'js-cookie';
import { Slider } from "../types/slider";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getActiveSliders(token?: string): Promise<Slider[] | null> {
  try {
    const res = await fetch(`${API_URL}/sliders/active`, {
      cache: 'no-store',
    });
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

export async function getSliders(token?: string): Promise<Slider[] | null> {
  const authToken = token || Cookies.get('admin_token') || Cookies.get('auth_token');

  if (!authToken) {
    console.error('No authentication token available');
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/sliders`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('getSliders failed', res.status, res.statusText);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error('getSliders error', err);
    return null;
  }
}

export async function getSliderById(id: number, token?: string): Promise<Slider | null> {
  const authToken = token || Cookies.get('admin_token') || Cookies.get('auth_token');

  if (!authToken) {
    console.error('No authentication token available');
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/sliders/${id}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('getSliderById failed', res.status, res.statusText);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error('getSliderById error', err);
    return null;
  }
}

export async function createSlider(data: Partial<Slider>, token?: string): Promise<Slider> {
  const authToken = token || Cookies.get('admin_token') || Cookies.get('auth_token');

  if (!authToken) {
    throw new Error('Please login to create slider');
  }

  try {
    const res = await fetch(`${API_URL}/sliders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to create slider');
    }
    return await res.json();
  } catch (err: any) {
    console.error('createSlider error', err);
    throw err;
  }
}

export async function updateSlider(id: number, data: Partial<Slider>, token?: string): Promise<Slider> {
  const authToken = token || Cookies.get('admin_token') || Cookies.get('auth_token');

  if (!authToken) {
    throw new Error('Please login to update slider');
  }

  try {
    const res = await fetch(`${API_URL}/sliders/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to update slider');
    }
    return await res.json();
  } catch (err: any) {
    console.error('updateSlider error', err);
    throw err;
  }
}

export async function deleteSlider(id: number, token?: string): Promise<void> {
  const authToken = token || Cookies.get('admin_token') || Cookies.get('auth_token');

  if (!authToken) {
    throw new Error('Please login to delete slider');
  }

  try {
    const res = await fetch(`${API_URL}/sliders/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to delete slider');
    }
  } catch (err: any) {
    console.error('deleteSlider error', err);
    throw err;
  }
}
