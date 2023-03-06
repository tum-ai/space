import useOutsideAlerter from '../hooks/useOutsideAlerter';
import React, { useRef, useState } from 'react';
import Icon from './Icon';

export default function Select({
	setSelectedItem,
	selectedItem,
	placeholder,
	data,
	className,
	trigger,
	label,
	disabled,
}) {
	const [active, setActive] = useState(false);
	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef, () => {
		setActive(false);
	});

	return (
		<div
			ref={wrapperRef}
			className={
				'flex flex-col space-y-1 justify-between cursor-pointer ' +
				className
			}
			style={{ maxWidth: '500px' }}
		>
			{label && <label className='font-light'>{label}</label>}
			<div className='relative border border-gray-300 rounded'>
				{React.cloneElement(
					trigger ? (
						trigger
					) : (
						<button
							className={
								'selectSingle w-full focus:outline-none trans flex items-center justify-between space-x-2 px-3 p-1 pr-0 ' +
								(!disabled
									? 'cursor-pointer'
									: 'cursor-default')
							}
							disabled={disabled}
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								setActive(!active);
							}}
						>
							<div
								className={
									'selectSingle truncate font-light ' +
									(!disabled
										? 'cursor-pointer'
										: 'cursor-default')
								}
							>
								{(selectedItem && selectedItem.key) ||
									placeholder}
							</div>
							<div
								className={
									'selectSingle inline-flex items-center px-3 ' +
									(!disabled
										? 'cursor-pointer'
										: 'cursor-default')
								}
							>
								{!disabled && (
									<Icon
										className='pointer-events-none'
										name={
											active ? 'FaAngleUp' : 'FaAngleDown'
										}
									/>
								)}
							</div>
						</button>
					),
					{
						onClick: () => {
							setActive(!active);
						},
					}
				)}
				<div
					className={
						'selectSingle absolute max-h-32 w-auto mt-2 overflow-auto flex flex-col trans border border-gray-300 rounded origin-bottom-left z-40 bg-white darks:bg-gray-600 ' +
						(active
							? 'opacity-100 scale-100 visible'
							: 'opacity-0 scale-75 hidden')
					}
					style={{
						width: 'max-content',
					}}
				>
					{data.map((item, i) => {
						const selected =
							(selectedItem && selectedItem.value) === item.value;
						return (
							<Item
								key={i}
								onClick={() => {
									if (!selected) {
										setSelectedItem(item);
										setActive(false);
									} else {
										setSelectedItem(undefined);
										setActive(false);
									}
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
				'selectSingle font-light cursor-pointer trans px-3 py-2 hover:bg-secondary-100 ' +
				(selected && 'opacity-50 bg-secondary-50')
			}
			{...props}
		>
			{props.children}
		</div>
	);
}
