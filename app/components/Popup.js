function Popup({ className, trigger, state, setState, onClose, ...props }) {
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
				<div
					// onClick={(e) => {
					//   e.stopPropagation()
					//   setState(false)
					//   onClose && onClose()
					// }}
					className={
						'fixed top-0 left-0 blur h-screen w-screen flex justify-center items-center overflow-hidden ' +
						className
					}
					style={{
						margin: '0px',
						zIndex: '100000',
					}}
				>
					<div
						className='w-full flex items-center justify-center overflow-hidden'
						style={{
							height: '90%',
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
			)}
		</>
	);
}

export default Popup;
