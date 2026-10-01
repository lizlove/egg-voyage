import type { APIRoute } from 'astro';

export const prerender = false;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request, locals }) => {
	const body = await request.json().catch(() => null);
	const email = typeof body?.email === 'string' ? body.email.trim() : '';

	if (!EMAIL_PATTERN.test(email)) {
		return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
	}

	const { KIT_API_KEY, KIT_FORM_ID } = locals.runtime.env;

	const kitPost = (path: string) =>
		fetch(`https://api.kit.com/v4${path}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Kit-Api-Key': KIT_API_KEY,
			},
			body: JSON.stringify({ email_address: email }),
		});

	// Kit only adds existing subscribers to a form (404 otherwise), so upsert first.
	for (const path of ['/subscribers', `/forms/${KIT_FORM_ID}/subscribers`]) {
		const kitResponse = await kitPost(path);
		if (!kitResponse.ok) {
			console.error('Kit request failed', path, kitResponse.status, await kitResponse.text());
			return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 502 });
		}
	}

	return Response.json({ success: true });
};
