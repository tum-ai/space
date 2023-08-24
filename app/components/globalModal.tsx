import Modal from '@components/Modal';
import { useStores } from '@providers/StoreProvider';
import { observer } from 'mobx-react';

function GlobalModal() {
	const { uiModel } = useStores();

	return (
		<Modal
			state={uiModel.modalActive}
			setState={() => {
				uiModel.toggleModal();
			}}
		>
			<div className='flex w-fit flex-col space-y-6 rounded-lg bg-white p-6 dark:bg-gray-700'>
				{uiModel.modalContent}
			</div>
		</Modal>
	);
}
export default observer(GlobalModal);
