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
					<div className='absolute h-screen w-screen bg-black opacity-40 z-20 top-0 left-0 flex'></div>
					<div
						onClick={(e) => {
							e.stopPropagation();
							setState();
							// onClose && onClose();
						}}
						className='absolute h-screen w-screen z-20 top-0 left-0 flex'
					>
						<div
							className='overflow-auto px-4 h-fit w-fit z-30 m-auto'
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
					</div>
				</>
			)}
		</>
	);
}

export default Modal;
