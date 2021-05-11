import { GetStaticProps, GetStaticPaths } from 'next';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { RichText } from 'prismic-dom';
import Link from 'next/link';
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../../services/prismic';

import { Header } from '../../components/Header';
import Comments from '../../components/Comments';

import styles from './Post.module.scss';
import { useMemo } from 'react';

interface Post {
	uid: string;
	title: string;
	createAt: string;
	updatedAt: string;
	author: string | null;
	banner?: string;
	content: Content[];
}

interface Content {
	heading: string;
	body: {
		type: string;
		text: string;
	}[]
}

interface PreviousNext {
	uid?: string;
	title?: string;
}

interface PostProps {
	post: Post;
	preview: boolean;
	nextPost: PreviousNext;
	previousPost: PreviousNext;
}

export default function Post(
	{ post, preview, nextPost, previousPost }: PostProps
) {

	const timeToRead = useMemo(() => {
		const totalQuantityLetters = post.content.reduce((accumulator, contentItem) => {
			const totalLettersHeading = contentItem.heading
				? contentItem.heading.split(' ').length
				: 0;
			const totalLettersBody = RichText.asText(contentItem.body).split(' ').length;

			return accumulator + totalLettersBody + totalLettersHeading;
		}, 0)

		return Math.ceil(totalQuantityLetters / 200);
	}, [post.content]);
	return (
		<>
			<Header />
			{/* {post?.banner && (
				<section
					className={styles.bannerPost}
					style={{
						backgroundImage: `url('${post.banner}')`
					}}
				/>
			)} */}
			{post?.banner && <img src={post?.banner} alt="banner" className={styles.bannerPost} />}
			<main className={styles.containerPost}>
				<header className={styles.headerPost}>
					<h1>{post.title}</h1>
					<span>
						<FiCalendar size={20} />
						{post.createAt}
					</span>
					<span>
						<FiUser size={20} />
						{post.author}
					</span>
					<span>
						<FiClock size={20} />
						{timeToRead} min
					</span>
					{post.updatedAt && (
						<p>{post.updatedAt}</p>
					)}
				</header>
				<article className={styles.contentPost}>
					{post.content.map(cont => (
						<div key={cont.heading}>
							<h2 key={cont.heading} >{cont.heading}</h2>
							<div dangerouslySetInnerHTML={{ __html: RichText.asHtml(cont.body) }} />
						</div>
					))}
				</article>
			</main>
			<footer className={styles.footerPost}>
				<div className={styles.previousNext}>
					{previousPost && (
						<div className={styles.previous}>
							<h3>{previousPost.title}</h3>
							<Link href={`/post/${previousPost.uid}`}>
								<a>Post anterior</a>
							</Link>
						</div>
					)}
					{nextPost && (
						<div className={styles.next}>
							<h3>{nextPost.title}</h3>
							<Link href={`/post/${nextPost.uid}`} >
								<a>Próximo post</a>
							</Link>
						</div>
					)}
				</div>
				<Comments />
				{preview && (
					<Link href="/api/exit-preview">
						<a className={styles.modePreview} >Sair do modo Preview</a>
					</Link>
				)}
			</footer>
		</>
	)
}

export const getStaticPaths: GetStaticPaths = async () => {

	return {
		paths: [],
		fallback: 'blocking',
	}
}

export const getStaticProps: GetStaticProps = async ({
	params, preview = false, previewData,
}) => {
	const { slug } = params;

	const prismic = getPrismicClient();


	const responsePost = await prismic.getByUID('posts', `${slug}`,
		{
			ref: previewData?.ref ?? null,
		}
	);

	const responsePreviousPost = (await prismic.query(
		Prismic.predicates.at('document.type', 'posts'),
		{
			fetch: ['posts.title'],
			pageSize: 1,
			after: `${responsePost.id}`,
			orderings: '[document.first_publication_date]'
		}
	)).results[0];


	const responseNextPost = (await prismic.query(
		Prismic.predicates.at('document.type', 'posts'),
		{
			pageSize: 1,
			after: `${responsePost.id}`,
			orderings: '[document.first_publication_date desc]'
		}
	)).results[0];

	const previousPost = responsePreviousPost ? (
		{
			uid: responsePreviousPost.uid,
			title: responsePreviousPost.data.title
		}
	) : '';

	const nextPost = responseNextPost ? (
		{
			uid: responseNextPost.uid,
			title: responseNextPost.data.title
		}
	) : '';


	const post = {
		uid: slug,
		title: responsePost.data.title,
		createAt: format(new Date(responsePost.first_publication_date), 'dd MMM yyyy', {
			locale: ptBR
		}),
		updatedAt: format(
			new Date(responsePost.last_publication_date),
			"'* editado em' dd MMM yyyy, 'às' HH:mm",
			{
				locale: ptBR
			}
		),
		author: responsePost.data.author,
		banner: responsePost.data.banner.url ?? '',
		content: responsePost.data.content,
	}

	return {
		props: {
			post,
			preview,
			previousPost,
			nextPost
		},
		revalidate: 60 * 60 * 1 // 1hours
	}
}