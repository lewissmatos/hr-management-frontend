import {
	Modal,
	ModalBody,
	ModalBodyProps,
	ModalContent,
	ModalContentProps,
	ModalFooter,
	ModalFooterProps,
	ModalHeader,
	ModalHeaderProps,
	ModalProps,
} from "@heroui/react";
import React from "react";

export type MagicModalProps = {
	modalProps?: ModalProps;
	contentProps?: ModalContentProps;
	headerProps?: ModalHeaderProps;
	bodyProps?: ModalBodyProps;
	footerProps?: ModalFooterProps;
};
const MagicModal: React.FC<MagicModalProps> = ({
	modalProps,
	contentProps,
	headerProps,
	bodyProps,
	footerProps,
}) => {
	return (
		<Modal
			data-testid="magic-modal"
			{...modalProps}
			className={`overflow-y-auto ${modalProps?.className} max-h-screen`}
		>
			<ModalContent {...contentProps} data-testid="magic-modal-content">
				<ModalHeader {...headerProps} data-testid="magic-modal-header">
					{headerProps?.children}
				</ModalHeader>
				<ModalBody {...bodyProps} data-testid="magic-modal-body">
					{bodyProps?.children}
				</ModalBody>
				<ModalFooter {...footerProps} data-testid="magic-modal-footer">
					{footerProps?.children}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default MagicModal;
