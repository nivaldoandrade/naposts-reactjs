import { NextApiRequest, NextApiResponse } from 'next';
import { getPrismicClient } from '../../services/prismic';
import { Document } from '@prismicio/client/types/documents';

function linkResolver(doc: Document): string {
	if (doc.type === 'posts') {
		return `/post/${doc.uid}`;
	}
	return '/';
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { token: ref, documentId } = req.query as { token: string, documentId: string };

	const prismic = getPrismicClient(req);

	const redirectUrl = await prismic.
		getPreviewResolver(ref, documentId)
		.resolve(linkResolver, '/');


	if (!redirectUrl) {
		return res.status(401).json({ message: 'Invalid token' });
	}

	res.setPreviewData({ ref });

	res.write(
		`<!DOCTYPE html><html><head><meta http-equiv="Refresh" content="0; url=${redirectUrl}" />
	  <script>window.location.href = '${redirectUrl}'</script>
	  </head>`
	);

	res.end();
}