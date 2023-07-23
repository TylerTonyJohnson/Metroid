import { installPolyfills } from '@sveltejs/kit/node/polyfills';
import { getRequest, setResponse } from '@sveltejs/kit/node';
import { Server } from '../output/server/index.js';
import { manifest } from './manifest.js';

installPolyfills();

const server = new Server(manifest);

await server.init({
	env: /** @type {Record<string, string>} */ (process.env)
});

const DATA_SUFFIX = '/__data.json';

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
export default async (req, res) => {
	if (req.url) {
		const [path, search] = req.url.split('?');

		const params = new URLSearchParams(search);
		let pathname = params.get('__pathname');

		if (pathname) {
			params.delete('__pathname');
			// Optional routes' pathname replacements look like `/foo/$1/bar` which means we could end up with an url like /foo//bar
			pathname = pathname.replace(/\/+/g, '/');
			req.url = `${pathname}${path.endsWith(DATA_SUFFIX) ? DATA_SUFFIX : ''}?${params}`;
		}
	}

	/** @type {Request} */
	let request;

	try {
		request = await getRequest({ base: `https://${req.headers.host}`, request: req });
	} catch (err) {
		res.statusCode = /** @type {any} */ (err).status || 400;
		return res.end('Invalid request body');
	}

	setResponse(
		res,
		await server.respond(request, {
			getClientAddress() {
				return /** @type {string} */ (request.headers.get('x-forwarded-for'));
			}
		})
	);
};
