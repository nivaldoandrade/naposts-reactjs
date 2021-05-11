import Link from 'next/link';

import styles from './Header.module.scss';

export function Header() {
	return (
		<header className={styles.container}>
			<Link href="/">
				<a>
					<img src="/logo.svg" alt="logo" />
				</a>
			</Link>
		</header>
	)
}