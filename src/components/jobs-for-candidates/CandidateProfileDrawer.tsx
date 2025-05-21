import React from "react";
import { FC } from "react";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	Button,
} from "@heroui/react";
import { useLsmTranslation } from "react-lsm";
import useApplyingCandidateStore from "../../features/store/applying-candidate-store";
import CandidateProfileDetails from "./CandidateProfileDetails";
import ThemeToggler from "../layout/ThemeToggler";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};
const CandidateProfileDrawer: FC<Props> = ({ isOpen, onClose }) => {
	const { translate } = useLsmTranslation();
	const { hasCandidate, clearInfo } = useApplyingCandidateStore();

	return (
		<Drawer isOpen={isOpen} size="4xl" onClose={onClose} backdrop="blur">
			<DrawerContent>
				{(onClose) => (
					<>
						<DrawerHeader className="flex flex-col gap-1">
							<p className="text-xl font-semibold">
								{!hasCandidate
									? translate("jobsForCandidatesScreen.createProfile")
									: translate("jobsForCandidatesScreen.myProfile")}
							</p>
						</DrawerHeader>
						<DrawerBody className="p-6">
							<CandidateProfileDetails isFromProfileDrawer />
						</DrawerBody>
						<DrawerFooter className="flex justify-between">
							<Button
								color="danger"
								variant="light"
								onPress={() => {
									clearInfo();
									onClose();
								}}
							>
								{translate("logout.button")}
							</Button>
							<ThemeToggler />
						</DrawerFooter>
					</>
				)}
			</DrawerContent>
		</Drawer>
	);
};

export default CandidateProfileDrawer;
