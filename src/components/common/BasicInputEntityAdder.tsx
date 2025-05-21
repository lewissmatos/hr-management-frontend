import { Button } from "@heroui/react";
import { FC, useState } from "react";
import { MagicIconButton, MagicInput } from "../ui";
import { CircleX, PlusCircle, Save } from "lucide-react";
import { useLsmTranslation } from "react-lsm";

type Props = {
	useAddEntity: () => {
		mutateAsync: (data: { label: string }) => Promise<void>;
		isPending: boolean;
	};
};
const BasicInputEntityAdder: FC<Props> = ({ useAddEntity }) => {
	const { translate } = useLsmTranslation();
	const [inputValue, setInputValue] = useState("");
	const [isAdding, setIsAdding] = useState(false);
	const { mutateAsync, isPending } = useAddEntity();
	const handleSave = async () => {
		if (isAdding) {
			await mutateAsync({ label: inputValue });
		}
		setIsAdding((prev) => !prev);
	};
	return (
		<div className="flex flex-row gap-2 justify-end items-center w-4/12">
			{isAdding ? (
				<MagicInput
					className="w-9/12"
					onChange={(e) => {
						setInputValue(e.target.value);
					}}
					variant="faded"
					isDisabled={isPending}
					autoFocus
					onKeyDown={async (e) => {
						if (e.key === "Enter") {
							await handleSave();
						}
					}}
					endContent={
						<MagicIconButton
							size="sm"
							variant="light"
							tooltipProps={{
								content: translate("common.cancel"),
							}}
							onPress={() => {
								setInputValue("");
								setIsAdding(false);
							}}
						>
							<CircleX className="text-red-500" />
						</MagicIconButton>
					}
				/>
			) : null}

			<Button
				variant="solid"
				onPress={async () => {
					await handleSave();
				}}
				isLoading={isPending}
				color="primary"
				className="w-3/12"
				isDisabled={!inputValue && isAdding}
				endContent={isAdding ? <Save /> : <PlusCircle />}
			>
				{isAdding ? translate("common.save") : translate("common.add")}
			</Button>
		</div>
	);
};

export default BasicInputEntityAdder;
