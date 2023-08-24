import * as DialogRadix from '@radix-ui/react-dialog';
import { clsx } from 'clsx';
import { useState } from 'react';

function Dialog({ trigger, children }) {
	let [isOpen, setIsOpen] = useState(false);
	return (
		<DialogRadix.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogRadix.Trigger asChild>{trigger}</DialogRadix.Trigger>
			<DialogRadix.Portal>
				<DialogRadix.Overlay className='fixed inset-0 z-20 bg-black/50' />
				<DialogRadix.Content
					className={clsx(
						'fixed z-50 overflow-auto',
						'w-[95vw] max-w-[800px] rounded-lg p-8 md:w-full',
						'max-h-[90%]',
						'top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]',
						'bg-white dark:bg-gray-800',
						'outline-none'
					)}
				>
					{children}
				</DialogRadix.Content>
			</DialogRadix.Portal>
		</DialogRadix.Root>
	);
}

export default Dialog;
