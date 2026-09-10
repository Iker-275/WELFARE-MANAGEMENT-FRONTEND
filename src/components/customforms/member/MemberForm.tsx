import {
    FormEvent,
    useState,
} from "react";

import Input from "../../form/input/InputField";

import Label from "../../form/Label";

import GenderDropdown from "../../customDropdowns/GenderDropdown";
import RegionDropdown from "../../customDropdowns/RegionDropdown";

import Button from "../../ui/button/Button";

import {
    Gender,
} from "../../../types/GenderType";

import {
    CreateMemberDto,
} from "../../../types/MemberType";

interface MemberFormProps {

    initialData?: Partial<CreateMemberDto>;

    onSubmit: (
        payload: CreateMemberDto
    ) => Promise<boolean>;

    loading?: boolean;

    error?: string;
}

const MemberForm = ({
    initialData,
    onSubmit,
    loading = false,
    error,
}: MemberFormProps) => {

    const [formData, setFormData] =
        useState<CreateMemberDto>({
            userId:
                initialData?.userId ?? "",

            regionId:
                initialData?.regionId ?? "",

            profile: {
                firstName:
                    initialData?.profile
                        ?.firstName ?? "",

                lastName:
                    initialData?.profile
                        ?.lastName ?? "",

                otherNames:
                    initialData?.profile
                        ?.otherNames ?? "",

                gender:
                    initialData?.profile
                        ?.gender ?? null,

                dateOfBirth:
                    initialData?.profile
                        ?.dateOfBirth ?? "",

                nationalId:
                    initialData?.profile
                        ?.nationalId ?? "",

                address:
                    initialData?.profile
                        ?.address ?? "",

                profilePhotoId:
                    initialData?.profile
                        ?.profilePhotoId ?? null,
            },
        });

    const [
        errors,
        setErrors,
    ] = useState<Record<string, string>>({});

    const updateProfile = (
        field: keyof CreateMemberDto["profile"],
        value: string | null
    ) => {

        setFormData((previous) => ({
            ...previous,

            profile: {
                ...previous.profile,
                [field]: value,
            },
        }));

        setErrors((previous) => ({
            ...previous,
            [field]: "",
        }));
    };

    const validate = () => {

        const newErrors:
            Record<string, string> = {};

        if (!formData.userId.trim()) {
            newErrors.userId =
                "User is required.";
        }

        if (
            !formData.profile.firstName.trim()
        ) {
            newErrors.firstName =
                "First name is required.";
        }

        if (
            !formData.profile.lastName.trim()
        ) {
            newErrors.lastName =
                "Last name is required.";
        }

        if (
            !formData.profile.dateOfBirth
        ) {
            newErrors.dateOfBirth =
                "Date of birth is required.";
        }

        if (!formData.regionId) {
            newErrors.regionId =
                "Region is required.";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors)
                .length === 0
        );
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        if (!validate()) {
            return;
        }

        await onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >

            {error && (
                <div
                    className="
            rounded-lg
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-600
            dark:border-red-900/40
            dark:bg-red-900/20
            dark:text-red-400
          "
                >
                    {error}
                </div>
            )}

            {/* Member Assignment */}

            <div
                className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-6
          dark:border-gray-800
          dark:bg-white/[0.03]
        "
            >

                <h3
                    className="
            mb-5
            text-lg
            font-semibold
            text-gray-800
            dark:text-white
          "
                >
                    Member Assignment
                </h3>

                <div
                    className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
          "
                >

                    <div>
                        <Label>
                            User ID
                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </Label>

                        <Input
                            value={formData.userId}
                            onChange={(event) => {
                                setFormData((previous) => ({
                                    ...previous,
                                    userId: event.target.value
                                    ,
                                }));
                            }}
                            placeholder="Enter user ID"
                            error={!!errors.userId}
                            hint={errors.userId}
                        />
                    </div>

                    <RegionDropdown
                        value={formData.regionId}
                        onChange={(value) => {
                            setFormData((previous) => ({
                                ...previous,
                                regionId: value,
                            }));

                            setErrors((previous) => ({
                                ...previous,
                                regionId: "",
                            }));
                        }}
                        required
                        error={errors.regionId}
                    />

                </div>

            </div>

            {/* Personal Information */}

            <div
                className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-6
          dark:border-gray-800
          dark:bg-white/[0.03]
        "
            >

                <h3
                    className="
            mb-5
            text-lg
            font-semibold
            text-gray-800
            dark:text-white
          "
                >
                    Personal Information
                </h3>

                <div
                    className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
          "
                >

                    <div>
                        <Label>
                            First Name
                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </Label>

                        <Input
                            value={
                                formData.profile.firstName
                            }
                            onChange={(event) =>
                                updateProfile(
                                    "firstName",
                                    event.target.value

                                )
                            }
                            placeholder="Enter first name"
                            error={!!errors.firstName}
                            hint={errors.firstName}
                        />
                    </div>

                    <div>
                        <Label>
                            Last Name
                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </Label>

                        <Input
                            value={
                                formData.profile.lastName
                            }
                            onChange={(event) =>
                                updateProfile(
                                    "lastName",
                                    event.target.value

                                )
                            }
                            placeholder="Enter last name"
                            error={!!errors.lastName}
                            hint={errors.lastName}
                        />
                    </div>

                    <div>
                        <Label>
                            Other Names
                        </Label>

                        <Input
                            value={
                                formData.profile.otherNames ??
                                ""
                            }
                            onChange={(event) =>
                                updateProfile(
                                    "otherNames",
                                    event.target.value

                                )
                            }
                            placeholder="Enter other names"
                        />
                    </div>

                    <GenderDropdown
                        value={
                            formData.profile.gender ?? ""
                        }
                        onChange={(value) =>
                            updateProfile(
                                "gender",
                                value as Gender
                            )
                        }
                    />

                    <div>
                        <Label>
                            Date of Birth
                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </Label>

                        <Input
                            type="date"
                            value={
                                formData.profile.dateOfBirth
                            }
                            onChange={(event) =>
                                updateProfile(
                                    "dateOfBirth",
                                    event.target.value

                                )
                            }
                            error={!!errors.dateOfBirth}
                            hint={errors.dateOfBirth}
                        />
                    </div>

                    <div>
                        <Label>
                            National ID
                        </Label>

                        <Input
                            value={
                                formData.profile.nationalId ??
                                ""
                            }
                            onChange={(event) =>
                                updateProfile(
                                    "nationalId",
                                    event.target.value

                                )
                            }
                            placeholder="Enter national ID"
                        />
                    </div>

                    <div className="md:col-span-2">

                        <Label>
                            Address
                        </Label>

                        <Input
                            value={
                                formData.profile.address ??
                                ""
                            }
                            onChange={(event) =>
                                updateProfile(
                                    "address",
                                    event.target.value

                                )
                            }
                            placeholder="Enter address"
                        />

                    </div>

                </div>

            </div>

            {/* Actions */}

            <div
                className="
          flex
          justify-end
          gap-3
        "
            >

                <Button

                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Member"}
                </Button>

            </div>

        </form>
    );
};

export default MemberForm;