// components/common/AlertMessage.tsx

interface Props {
  message?: string;
}

export default function AlertMessage({
  message,
}: Props) {
  if (!message) return null;

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      {message}
    </div>
  );
}