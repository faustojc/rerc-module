import { ChangeEventHandler, InputHTMLAttributes, useCallback } from "react";

interface InputFileProps extends Partial<InputHTMLAttributes<HTMLInputElement>> {
    label?: string;
    reverseButton?: boolean;
    file: File | File[] | null;
    isError: boolean;
    errorText?: string;
    handleSelectFile: ChangeEventHandler<HTMLInputElement> | undefined;
}

const InputFile = ({ label, reverseButton, file, isError, errorText, handleSelectFile, ...inputProps }: InputFileProps) => {
    const labelMessage = useCallback(() => {
        if (file && Array.isArray(file) && file.length > 0) {
            return file.length > 1
                ? `${file.length} file(s) selected`
                : file[0].name;
        }
        if (file && !Array.isArray(file)) {
            return file.name;
        }
        if (!file || (Array.isArray(file) && file.length === 0)) {
            return 'No file selected';
        }
    }, [file]);

    return (
        <div>
            <label aria-labelledby={label || 'file-inputs'} className={"cursor-pointer " + inputProps.className}>
                {label && (
                    <div className="mb-3">
                        <h3>{label}</h3>
                    </div>
                )}
                <div className={`w-full h-9 rounded-3xl border border-gray-300 items-center inline-flex ${!reverseButton && 'justify-between pl-4'}`}>
                    {reverseButton && (
                        <div className="flex w-28 h-9 px-2 flex-col bg-indigo-500 rounded-l-3xl shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none">
                            Choose File
                        </div>
                    )}
                    <h2 className={`text-default-900/70 text-sm font-normal truncate leading-snug ${reverseButton ? 'pl-2' : 'pr-4'}`}>
                        {labelMessage()}
                    </h2>
                    <input
                        onChange={handleSelectFile}
                        hidden
                        {...inputProps}
                    />
                    {!reverseButton && (
                        <div className="flex w-28 h-9 px-2 flex-col bg-indigo-500 rounded-r-3xl shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none">
                            Choose File
                        </div>
                    )}
                </div>
            </label>
            {isError && (
                <p className="text-danger-500 text-sm mt-1">
                    {errorText || 'Please select a file to upload.'}
                </p>
            )}
        </div>
    );
}

export default InputFile;
