export interface Category {
	id: number;
	name: string;
	description?: string;
	images?: string; // relative path from CDN/asset base
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

// Fetch all categories across pages (no limit)
export async function getAllCategories(): Promise<Category[]> {
	const all: Category[] = [];
	let page = 1;
	const size = 100; // reasonable page size; will iterate until 'last'
	while (true) {
		const paged = await getCategories(page, size);
		if (!paged) break;
		if (Array.isArray(paged.data)) {
			all.push(...paged.data);
		}
		if (paged.last) break;
		page += 1;
	}
	return all;
}

// Fetch categories for filter component (limited for UI purposes)
export async function getCategoriesForFilter(size = 20): Promise<Category[]> {
	try {
		const paged = await getCategories(1, size);
		return paged?.data || [];
	} catch (err) {
		console.error('getCategoriesForFilter error:', err);
		return [];
	}
}

