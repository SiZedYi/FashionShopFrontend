export interface Category {
	id: number;
	name: string;
	description?: string;
	imageUrl?: string; // relative path from CDN/asset base
}

export interface PagedCategories {
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
	last: boolean;
	data: Category[];
}

export async function getCategories(page = 1, size = 4): Promise<PagedCategories | null> {
	try {
		const base = process.env.NEXT_PUBLIC_API_URL;
		const res = await fetch(`${base}/categories?page=${page}&size=${size}`);
		if (!res.ok) {
			// eslint-disable-next-line no-console
			console.error('getCategories failed', res.status, res.statusText);
			return null;
		}
		const json = await res.json();
		if (!json || !Array.isArray(json.data)) {
			// eslint-disable-next-line no-console
			console.error('getCategories invalid shape:', json);
			return null;
		}
		return json as PagedCategories;
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('getCategories error:', err);
		return null;
	}
}

