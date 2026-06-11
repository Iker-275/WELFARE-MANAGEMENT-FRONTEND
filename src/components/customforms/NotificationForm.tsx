import { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Button from "../ui/button/Button";
import MultiSelect from "../form/MultiSelect";
import TextArea from "../form/input/TextArea";
import Input from "../form/input/InputField";

import { useNotification } from "../../hooks/useNotification";
import { useRoles } from "../../hooks/useRoles";

export default function NotificationForm() {
  const {
    createNotification,
    loading,
    message,
  } = useNotification();

  const {
    roles,
    loading: rolesLoading,
  } = useRoles();

  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "",
    sendToAll: true,
    roleIds: [] as string[],
    regionIds: [] as string[],
  });

  const [errors, setErrors] = useState<any>({});

  const roleOptions =
    roles?.map((role: any) => ({
      value: role.id,
      text: role.name,
    })) || [];

  const validate = () => {
    const newErrors: any = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const success =
      await createNotification({
        title: form.title,
        message: form.message,
        type: form.type,
        sendToAll: form.sendToAll,
        roleIds: form.roleIds,
        regionIds: form.regionIds,
      });

    if (success) {
      setForm({
        title: "",
        message: "",
        type: "",
        sendToAll: true,
        roleIds: [],
        regionIds: [],
      });

      setErrors({});
    }
  };

  return (
    <ComponentCard title="Create Notification">
      <div className="space-y-5">
        <Input
          placeholder="Notification Title"
          value={form.title}
          onChange={(e: any) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
          error={!!errors.title}
          hint={errors.title}
        />

        <TextArea
          placeholder="Notification Message"
          value={form.message}
          onChange={(value) =>
            setForm({
              ...form,
              message: value,
            })
          }
          error={!!errors.message}
          hint={errors.message}
        />

        <Input
          placeholder="Notification Type (optional)"
          value={form.type}
          onChange={(e: any) =>
            setForm({
              ...form,
              type: e.target.value,
            })
          }
        />

        {!form.sendToAll && (
          <MultiSelect
            label="Target Roles"
            options={roleOptions}
            value={form.roleIds}
            onChange={(values) =>
              setForm({
                ...form,
                roleIds: values,
              })
            }
            placeholder={
              rolesLoading
                ? "Loading roles..."
                : "Select roles"
            }
            disabled={rolesLoading}
          />
        )}

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.sendToAll}
            onChange={(e) =>
              setForm({
                ...form,
                sendToAll:
                  e.target.checked,
              })
            }
          />

          <span>
            Send To All Members
          </span>
        </label>

        {message && (
          <div className="text-sm">
            {message}
          </div>
        )}
      </div>

      <div className="flex justify-end mt-6 pt-6 border-t">
        <Button
          onClick={handleSubmit}
          disabled={
            loading || rolesLoading
          }
        >
          {loading
            ? "Creating..."
            : "Create Notification"}
        </Button>
      </div>
    </ComponentCard>
  );
}