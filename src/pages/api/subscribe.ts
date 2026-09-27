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

	const kitResponse = await fetch(`https://api.kit.com/v4/forms/${KIT_FORM_ID}/subscribers`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Kit-Api-Key': KIT_API_KEY,
		},
		body: JSON.stringify({ email_address: email }),
	});

	if (!kitResponse.ok) {
		return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 502 });
	}

	return Response.json({ success: true });
};
