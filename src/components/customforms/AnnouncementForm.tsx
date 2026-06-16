import { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Button from "../ui/button/Button";
import MultiSelect from "../form/MultiSelect";
import TextArea from "../form/input/TextArea";
import Input from "../form/input/InputField";

import { useAnnouncement } from "../../hooks/useAnnouncement";
import { useRoles } from "../../hooks/useRoles";


export default function AnnouncementForm() {
  const {
    createAnnouncement,
    loading,
    message,
  } = useAnnouncement();

  
  const { roles, loading: rolesLoading } = useRoles();

  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "",
    sendToAll: true,
    roleIds: [] as string[],
    regionIds: [] as string[],
    isPublished: false,
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

    if (!form.content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const success = await createAnnouncement({
      title: form.title,
      content: form.content,
      type: form.type,
      sendToAll: form.sendToAll,
      roleIds: form.roleIds,
      regionIds: form.regionIds,
      isPublished: form.isPublished,
    });

    if (success) {
      setForm({
        title: "",
        content: "",
        type: "",
        sendToAll: true,
        roleIds: [],
        regionIds: [],
        isPublished: false,
      });

      setErrors({});
    }
  };

  return (
    <ComponentCard title="Create Announcement">
      <div className="space-y-5">

        <Input
          placeholder="Announcement Title"
          value={form.title}
          onChange={(e: any) =>
            setForm({ ...form, title: e.target.value })
          }
          error={!!errors.title}
          hint={errors.title}
        />

        <TextArea
          placeholder="Announcement Content"
          value={form.content}
          onChange={(value) =>
            setForm({ ...form, content: value })
          }
          error={!!errors.content}
          hint={errors.content}
        />

        <Input
          placeholder="Type (optional)"
          value={form.type}
          onChange={(e: any) =>
            setForm({ ...form, type: e.target.value })
          }
        />

        {!form.sendToAll && (
          <MultiSelect
            label="Target Roles"
            options={roleOptions}
            value={form.roleIds}
            onChange={(values) =>
              setForm({ ...form, roleIds: values })
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
                sendToAll: e.target.checked,
              })
            }
          />
          <span>Send To All</span>
        </label>

        {/* 🔥 publish toggle */}
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) =>
              setForm({
                ...form,
                isPublished: e.target.checked,
              })
            }
          />
          <span>Publish Immediately</span>
        </label>

        {message && (
          <div className="text-sm">{message}</div>
        )}
      </div>

      <div className="flex justify-end mt-6 pt-6 border-t">
        <Button
          onClick={handleSubmit}
          disabled={loading || rolesLoading}
        >
          {loading ? "Creating..." : "Create Announcement"}
        </Button>
      </div>
    </ComponentCard>
  );
}