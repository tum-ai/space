import { observer } from 'mobx-react';
import Modal from '/components/Modal';
import { useStores } from '/providers/StoreProvider';

function GlobalModal() {
	const { uiModel } = useStores();

	return (
		<Modal
			state={uiModel.modalActive}
			setState={() => {
				uiModel.toggleModal();
			}}
		>
			<div className='flex flex-col space-y-6 rounded-lg p-6 bg-white dark:bg-gray-700 w-fit'>
				{uiModel.modalContent}
			</div>
		</Modal>
	);
}
export default observer(GlobalModal);
