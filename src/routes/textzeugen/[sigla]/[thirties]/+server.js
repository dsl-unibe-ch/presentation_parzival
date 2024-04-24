import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	redirect(303, `/textzeugen/${params.sigla}/${params.thirties}/1`);
}
