import useOutsideAlerter from '/hooks/useOutsideAlerter';
import React, { useRef, useState } from 'react';
import Icon from './Icon';

export default function SelectMultiple({
	label,
	className,
	data,
	selectedItems,
	setSelectedItems,
	placeholder,
	flowRight,
}) {
	const [active, setActive] = useState(false);
	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef, () => {
		setActive(false);
	});

	return (
		<div
			ref={wrapperRef}
			className={'flex flex-col space-y-2 justify-between ' + className}
			style={{ maxWidth: '500px' }}
		>
			{label && <label className='font-light'>{label}</label>}
			<div className='relative border border-gray-300 rounded'>
				<button
					className={
						'selectMultiple w-full focus:outline-none trans flex justify-between items-center space-x-1 h-8 px-3 pr-0 ' +
						(!selectedItems.length && 'cursor-pointer')
					}
					onClick={(e) => {
						e.stopPropagation();
						setActive(!active);
					}}
				>
					<div className='flex space-x-1 truncate'>
						{selectedItems.length ? (
							selectedItems.map((item, i) => (
								<Selected
									key={i}
									item={item}
									onDelete={(e) => {
										e.stopPropagation();
										setSelectedItems(
											selectedItems.filter(
												(x) => x.value !== item.value
											)
										);
									}}
								/>
							))
						) : (
							<div className='selectMultiple cursor-pointer font-light'>
								{placeholder || 'Select'}
							</div>
						)}
					</div>
					<div className='selectMultiple inline-flex items-center px-3 cursor-pointer '>
						<Icon
							className='pointer-events-none'
							name={active ? 'FaAngleUp' : 'FaAngleDown'}
						/>
					</div>
				</button>
				<div
					className={
						'selectMultiple absolute max-h-64 w-full mt-2 overflow-auto flex flex-col shadow trans rounded origin-bottom-left z-40 bg-white darkss:bg-gray-600 ' +
						(active
							? 'opacity-100 scale-100 visible'
							: 'opacity-0 scale-75 hidden') +
						' ' +
						(flowRight ? 'left-0' : 'right-0')
					}
				>
					{data.map((item, i) => {
						const selected = selectedItems.find(
							(x) => x.value === item.value
						);
						return (
							<Item
								key={i}
								onClick={(e) => {
									e.stopPropagation();
									!selected
										? setSelectedItems([
												...selectedItems,
												item,
										  ])
										: setSelectedItems(
												selectedItems.filter(
													(x) =>
														x.value !== item.value
												)
										  );
								}}
								selected={selected}
							>
								{item.key}
							</Item>
						);
					})}
				</div>
			</div>
		</div>
	);
}

function Item({ selected, ...props }) {
	return (
		<div
			className={
				'selectMultiple text-h5 cursor-pointer trans px-3 py-2 hover:bg-gray-100 darks:hover:bg-gray-500 trans ' +
				(!selected && 'opacity-50 bg-secondary-50')
			}
			{...props}
		>
			{props.children}
		</div>
	);
}

function Selected({ item, onDelete }) {
	return (
		<div className='flex space-x-2 whitespace-nowrap bg-gray-300 darks:bg-gray-500 px-1 rounded text-h5'>
			{item.key}
			<div className='inline-flex items-center px-3 cursor-pointer '>
				<Icon name={'FaTimes'} onClick={onDelete} />
			</div>
		</div>
	);
}
