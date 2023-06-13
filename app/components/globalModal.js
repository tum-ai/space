import { observer } from 'mobx-react';
import Modal from '/components/Modal';
import { useStores } from '/providers/StoreProvider';

function GlobalModal() {
	const { globalModalModel } = useStores();

	return (
		<Modal
			state={globalModalModel.modalActive}
			setState={() => {
				globalModalModel.toggleModal();
			}}
		>
			<div className='flex flex-col space-y-6 rounded-lg p-6 bg-white dark:bg-gray-700 w-fit'>
				{globalModalModel.body}
				<button
					onClick={() => {
						globalModalModel.toggleModal();
					}}
					className='p-4 px-8 py-1 rounded-lg w-1/2 bg-gray-200 text-black'
				>
					ok
				</button>
			</div>
		</Modal>
	);
}
export default observer(GlobalModal);
