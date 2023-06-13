import Link from 'next/link';
import { useRouter } from 'next/router';
import ProtectedItem from '../../ProtectedItem';

function Links() {
	const router = useRouter();
	return (
		<>
			<Link
				href={'/'}
				className={
					'text-gray-500 hover:text-black dark:hover:text-white hover:underline ' +
					(router.asPath == '/' && 'font-bold')
				}
			>
				Home
			</Link>
			<Link
				href={'/profiles'}
				className={
					'text-gray-500 hover:text-black dark:hover:text-white hover:underline ' +
					(router.asPath?.includes('/profiles') &&
						!router.asPath?.includes('/profiles/me') &&
						'font-bold')
				}
			>
				Team
			</Link>
			<ProtectedItem>
				<Link
					href={'/feedback'}
					className={
						'text-gray-500 hover:text-black dark:hover:text-white hover:underline ' +
						(router.asPath?.includes('/feedback') && 'font-bold')
					}
				>
					Feedback
				</Link>
			</ProtectedItem>
			<ProtectedItem roles={['invite_members']}>
				<Link
					href={'/invite'}
					className={
						'text-gray-500 hover:text-black dark:hover:text-white hover:underline ' +
						(router.asPath?.includes('/invite') && 'font-bold')
					}
				>
					Invite Members
				</Link>
			</ProtectedItem>
		</>
	);
}

export default Links;
