import { GetStaticProps } from 'next';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { getPrismicClient } from '../services/prismic';

import styles from '../styles/Home.module.scss';
import { useCallback, useState } from 'react';

interface Post {
	uid: string;
	title: string;
	subtitle: string;
	createAt: string;
	author: string;
};

interface PostsProps {
	posts: Post[];
	nextPage: string;
}

interface HomeProps {
	postsProps: PostsProps;
	preview: boolean;
}


export default function Home({ postsProps, preview }: HomeProps) {
	const [posts, setPosts] = useState(postsProps.posts);
	const [nextPage, setNextPage] = useState(postsProps.nextPage);

	const handleNextPage = useCallback(async () => {
		if (!nextPage) {
			return;
		}

		fetch(nextPage)
			.then(response => response.json())
			.then(data => {
				const newPosts = data.results.map(post => ({
					uid: post.uid,
					title: post.data.title,
					subtitle: post.data.subtitle,
					createAt: format(new Date(post.first_publication_date), 'dd MMMM yyyy', {
						locale: ptBR
					}),
					author: post.data.author
				}))

				setPosts([...posts, ...newPosts]);
				setNextPage(data.next_page);
			})
	}, [nextPage]);

	return (
		<div className={styles.container}>
			<header>
				<Link href="/">
					<a>
						<img src="/logo.svg" alt="naposts" />
					</a>
				</Link>
			</header>

			<section className={styles.postsList}>
				{posts.map(post => (
					<a key={post.uid} href={`/post/${post.uid}`}>
						<h1>{post.title}</h1>
						<p>{post.subtitle}</p>
						<span>
							<FiCalendar size={20} />
							{post.createAt}
						</span>
						<span>
							<FiUser size={20} />
							{post.author}
						</span>
					</a>
				))}
				{nextPage && (
					<button
						type="button"
						onClick={handleNextPage}
					>
						Carregar mais posts
					</button>
				)}
			</section>
			{
				preview && (
					<footer>
						<Link
							href="/api/exit-preview"
						>
							<a>Sair do modo Preview</a>
						</Link>
					</footer>
				)
			}
		</div>
	)
}

export const getStaticProps: GetStaticProps = async ({
	preview = false,
	previewData
}) => {
	const prismic = getPrismicClient();


	const responsePosts = await prismic.query(
		Prismic.predicates.at('document.type', 'posts'),
		{
			fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
			pageSize: 1,
			ref: previewData?.ref ?? null,
		}
	)

	const posts = responsePosts.results.map(post => ({
		uid: post.uid,
		title: post.data.title,
		subtitle: post.data.subtitle,
		createAt: format(new Date(post.first_publication_date), 'dd MMM yyyy', {
			locale: ptBR
		}),
		author: post.data.author
	}))

	const nextPage = responsePosts.next_page;

	return {
		props: {
			postsProps: {
				posts,
				nextPage,
			},
			preview
		},
		revalidate: 60 * 60 * 1 // 1hours
	}
}
