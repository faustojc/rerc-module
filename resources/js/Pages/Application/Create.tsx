import Authenticated from '@/Layouts/AuthenticatedLayout';
import { ChangeEvent, FormEventHandler, useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { Member } from "@/types";
import { MdiAccountAdd, MdiArrowLeft, MdiDeleteForever } from "@/Components/Icons";

export default function Create() {
    const [researchTitle, setResearchTitle] = useState<string>("");
    const [researcher, setResearcher] = useState({
        firstname: "",
        lastname: "",
    });
    const [members, setMembers] = useState<Member[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [researchType, setResearchType] = useState<string>("internal");

    const [memberInput, setMemberInput] = useState({
        firstname: {
            value: "",
            error: false,
        },
        lastname: {
            value: "",
            error: false,
        },
    });

    const [errors, setErrors] = useState({
        research_title: false,
        researcher: false,
        documents: false,
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (researchTitle.length === 0 || (researcher.firstname.length === 0 || researcher.lastname.length === 0) || files.length === 0) {
            setErrors({
                research_title: researchTitle.length === 0,
                researcher: researcher.firstname.length === 0 || researcher.lastname.length === 0,
                documents: files.length === 0,
            })

            return;
        }

        const formData = new FormData();
        formData.append("research_title", researchTitle);
        formData.append("members", JSON.stringify(members));
        formData.append("firstname", researcher.firstname);
        formData.append("lastname", researcher.lastname);
        formData.append("research_type", researchType);

        for (let i = 0; i < files.length; i++) {
            formData.append("documents[]", files[i]);
        }

        setLoading(true);

        router.post(route('applications.store'), formData, {
            onError: (error) => {
                setErrorMessage(error.message);
            },
            onFinish: () => setLoading(false),
        })
    }

    const handleSetResearchTitle = (value: string) => {
        setErrors({
            ...errors,
            research_title: false
        })

        if (value.length > 200) {
            return;
        }

        setResearchTitle(value);
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setErrors({
            ...errors,
            documents: false
        })

        const selectedFiles = Array.from(e.target.files!);

        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    };

    // Handler for removing a file
    const handleFileRemove = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((file, i) => i !== index));
    };

    const handleAddMember = () => {
        const { firstname, lastname } = memberInput;

        if (firstname.value.length === 0 || lastname.value.length === 0) {
            setMemberInput({
                firstname: {
                    value: firstname.value,
                    error: true,
                },
                lastname: {
                    value: lastname.value,
                    error: true,
                },
            });
            return;
        }

        setMemberInput({
            firstname: {
                value: "",
                error: false,
            },
            lastname: {
                value: "",
                error: false,
            },
        });

        const newMember: Member = {
            id: "",
            app_profile_id: "",
            firstname: firstname.value,
            lastname: lastname.value,
        }

        setMembers([...members, newMember]);
    }

    const handleRemoveMember = (index: number) => {
        const newMembers = members.filter((member, i) => i !== index);

        setMembers(newMembers);
    }

    const handleNameInput = (e: ChangeEvent<HTMLInputElement>, isMember: boolean = false) => {
        if (isMember) {
            const { name, value } = e.target;

            setMemberInput({
                ...memberInput,
                [name]: {
                    value,
                    error: false,
                },
            });
        }
        else {
            setErrors({
                ...errors,
                researcher: false
            });

            setResearcher({
                ...researcher,
                [e.target.name]: e.target.value
            })
        }
    }

    return (
        <Authenticated header={"Submit a Research Proposal"}>
            <Head title="Research Submittion" />
            <div className="py-3 mx-auto">
                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader className="justify-between">
                            <h3 className="text-2xl font-semibold text-start">Proposal Information</h3>
                            <Button isIconOnly variant="light" onPress={() => history.back()}>
                                <MdiArrowLeft />
                            </Button>
                        </CardHeader>
                        <Divider />
                        <CardBody className="py-5">
                            <div className="md:grid grid-cols-3 grid-rows-3 items-center gap-5">
                                <div>
                                    <h3 className="text-lg text-default-800">
                                        RESEARCHER TITLE
                                        <span className="text-red-500">*</span>
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Please input your research title
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <Textarea value={researchTitle}
                                              onValueChange={handleSetResearchTitle}
                                              isInvalid={errors.research_title}
                                              isClearable
                                              description="Max. 200 characters"
                                    />
                                    {errors.research_title && (
                                        <div className="col-span-3">
                                            <p className="text-red-500 text-sm">Please provide your research title</p>
                                        </div>
                                    )}
                                </div>
                                <div className="sm:mt-0 mt-5">
                                    <h3 className="text-lg text-default-800">
                                        RESEARCHER NAME
                                        <span className="text-red-500">*</span>
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Please provide your full name
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <div className="flex sm:flex-row flex-col gap-3">
                                        <Input label="First name"
                                               name="firstname"
                                               labelPlacement="outside"
                                               value={researcher.firstname}
                                               isInvalid={errors.researcher}
                                               onChange={handleNameInput}
                                        />
                                        <Input label="Last name"
                                               name="lastname"
                                               labelPlacement="outside"
                                               value={researcher.lastname}
                                               isInvalid={errors.researcher}
                                               onChange={handleNameInput}
                                        />
                                    </div>
                                    {errors.researcher && (
                                        <div className="col-span-3 mt-3">
                                            <p className="text-red-500 text-sm">This field is required</p>
                                        </div>
                                    )}
                                </div>
                                <div className="sm:mt-0 mt-5">
                                    <h3 className="text-lg text-default-800">MEMBERS</h3>
                                    <p className="text-gray-500 text-sm">
                                        Add the members of your research team.
                                    </p>
                                </div>
                                <div className="col-span-2 sm:mt-0 mt-5">
                                    <div className="">
                                        <div className="flex sm:flex-row flex-col gap-3">
                                            <Input label="First name"
                                                   name="firstname"
                                                   labelPlacement="outside"
                                                   value={memberInput.firstname.value}
                                                   isInvalid={memberInput.firstname.error}
                                                   onChange={(e) => handleNameInput(e, true)}
                                            />
                                            <Input label="Last name"
                                                   name="lastname"
                                                   labelPlacement="outside"
                                                   value={memberInput.lastname.value}
                                                   isInvalid={memberInput.lastname.error}
                                                   onChange={(e) => handleNameInput(e, true)}
                                            />
                                        </div>
                                        <Button className="mt-3"
                                                color="success"
                                                size="sm"
                                                radius="full"
                                                variant="flat"
                                                onPress={() => handleAddMember()}
                                        >
                                            Add Member
                                            <MdiAccountAdd />
                                        </Button>
                                        {members.length === 0 && (
                                            <div className="mt-3">
                                                <p className="text-gray-500 text-sm">Leave blank if you are the only member.</p>
                                            </div>
                                        )}
                                    </div>
                                    {members.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-3">
                                            {members.map((member, index) => (
                                                <Chip key={index} color="secondary" variant="flat" onClose={() => handleRemoveMember(index)}>
                                                    {member.firstname} {member.lastname}
                                                </Chip>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="sm:mt-0 mt-5">
                                    <h3 className="text-lg text-default-800">
                                        RESEARCH DOCUMENT
                                        <span className="text-red-500">*</span>
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Please upload the research document for your research proposal.
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <div>
                                        <label className="block my-4">
                                            <span className="sr-only">Choose File</span>
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept={".pdf,.doc,.docx"}
                                                className="cursor-pointer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                            />
                                        </label>
                                        {errors.documents && (
                                            <div className="col-span-3">
                                                <p className="text-red-500 text-sm">Please upload your document</p>
                                            </div>
                                        )}

                                        {files.length > 0 && (
                                            <div className="space-y-4">
                                                {files.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <svg
                                                                className="w-6 h-6 text-indigo-600 mr-2"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a1 1 0 001 1h3m10-6v6a2 2 0 01-2 2H6l-2-2V6a2 2 0 012-2h7l5 5z" />
                                                            </svg>
                                                            <span className="text-gray-700">{file.name}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileRemove(index)}
                                                            className="ml-2 text-gray-500 hover:text-red-500"
                                                        >
                                                            <MdiDeleteForever />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="sm:mt-0 mt-5">
                                    <h3 className="text-lg text-default-800">
                                        RESEARCH TYPE
                                        <span className="text-red-500">*</span>
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Please select the type of your research proposal.
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <Select className="max-w-sm"
                                            aria-labelledby="Research Type"
                                            defaultSelectedKeys={[researchType]}
                                            value={researchType}
                                            onSelectionChange={(value) => setResearchType(value.currentKey!)}
                                            disallowEmptySelection
                                    >
                                        <SelectItem aria-labelledby="Research Type" key="internal" value="internal">Internal</SelectItem>
                                        <SelectItem aria-labelledby="Research Type" key="external" value="external">External</SelectItem>
                                    </Select>
                                </div>
                            </div>
                        </CardBody>
                        <Divider />
                        <CardFooter>
                            <div className="flex justify-end w-full">
                                <Button color="primary" variant="flat" type="submit" isLoading={loading}>
                                    Submit Proposal
                                </Button>
                            </div>
                            {errorMessage && (
                                <div className="mt-3">
                                    <p className="text-red-500 text-sm">{errorMessage}</p>
                                </div>
                            )}
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </Authenticated>
    );
}
