import { ChangeEventHandler, HTMLInputTypeAttribute } from "react";


interface InputFileProps {
    label: string;
    file: File | null;
    type: HTMLInputTypeAttribute;
    acceptedTypes?: string | undefined;
    isError: boolean;
    handleSelectFile: ChangeEventHandler<HTMLInputElement> | undefined;
}

const InputFile = ({label, file, type, acceptedTypes, isError, handleSelectFile}: InputFileProps) => {
    return (
        <label aria-labelledby={label}>
            <div className="mb-3">
                <h3>{label}</h3>
            </div>
            <div className="w-full h-9 rounded-3xl border border-gray-300 justify-between items-center inline-flex">
                <h2 className="text-default-900/50 text-sm font-normal leading-snug pl-4">
                    {file ? file.name : 'No file selected'}
                </h2>
                <input
                    type={type}
                    onChange={handleSelectFile}
                    hidden
                    accept={acceptedTypes}
                />
                <div className="flex w-28 h-9 px-2 flex-col bg-indigo-500 rounded-r-3xl shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none">
                    Choose File
                </div>
            </div>
            {isError && (
                <p className="text-danger-500 text-sm mt-2">Please select a file to upload.</p>
            )}
        </label>
    );
}

export default InputFile;
