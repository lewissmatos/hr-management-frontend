import React from "react";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalProps,
} from "@heroui/react";
type Props = Omit<
	ModalProps,
	"className" | "fullScreen" | "closeButton" | "animated" | "blur"
>;

const MagicDrawer: React.FC<Props> = ({ children, ...props }) => {
	const { isOpen } = props;

	return (
		<Modal
			classNames={{
				wrapper: "w-full",
			}}
			className={`drawer drawer-animated ${
				isOpen ? "drawer-animated-slide-in" : "drawer-animated-slide-out"
			}`}
			animated={false}
			placement="top"
			hideCloseButton
			size="full"
			{...props}
		>
			{children}
		</Modal>
	);
};

const MagicDrawerContent = ModalContent;
const MagicDrawerHeader = ModalHeader;
const MagicDrawerBody = ModalBody;
const MagicDrawerFooter = ModalFooter;

export {
	MagicDrawerContent,
	MagicDrawerHeader,
	MagicDrawerBody,
	MagicDrawerFooter,
};
export default MagicDrawer;
