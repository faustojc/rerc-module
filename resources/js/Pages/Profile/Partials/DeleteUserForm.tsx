import DangerButton from '@/Components/DangerButton';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import SecondaryButton from "@/Components/SecondaryButton";

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => clearFields(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const clearFields = () => {
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Delete Account
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </p>
            </header>

            <DangerButton onClick={onOpen}>
                Delete Account
            </DangerButton>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={deleteUser} className="p-6">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Are you sure you want to delete your account?
                                </h2>

                                <p className="mt-1 text-sm text-gray-600">
                                    Once your account is deleted, all of its resources and
                                    data will be permanently deleted. Please enter your
                                    password to confirm you would like to permanently delete
                                    your account.
                                </p>

                                <div className="mt-6">
                                    <InputLabel
                                        htmlFor="password"
                                        value="Password"
                                        className="sr-only"
                                    />

                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        className="mt-1 block w-3/4"
                                        isFocused
                                        placeholder="Password"
                                    />

                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <SecondaryButton onClick={() => {
                                        onClose();
                                        clearFields();
                                    }}>
                                        Cancel
                                    </SecondaryButton>

                                    <DangerButton className="ms-3" disabled={processing} type="submit">
                                        Delete Account
                                    </DangerButton>
                                </div>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}
