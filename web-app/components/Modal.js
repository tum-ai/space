import React from 'react';

function Modal({ className, trigger, state, setState, onClose, ...props }) {
	return (
		<>
			{trigger
				? React.cloneElement(trigger, {
						onClick: (e) => {
							console.log('triggered');
							e.stopPropagation();
							if (trigger.props.onClick) trigger.props.onClick(e);
							setState(true);
						},
				  })
				: null}
			{state && (
				<>
					<div
						onClick={(e) => {
							e.stopPropagation();
							setState();
							// onClose && onClose();
						}}
						className='absolute h-screen w-screen bg-black opacity-40 z-20 top-0 left-0'
					></div>
					<div
						className='absolute overflow-auto max-w-fit h-fit z-30 right-0 left-0 mx-auto top-0 bottom-0 my-auto'
						style={{
							maxHeight: '90%',
						}}
					>
						{React.cloneElement(props.children, {
							onClick: (e) => {
								e.stopPropagation();
							},
							onClose: () => {
								setState(false);
								onClose && onClose();
							},
						})}
					</div>
				</>
			)}
		</>
	);
}

export default Modal;
