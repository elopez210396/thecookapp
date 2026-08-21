export default function Loading({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-600" />
      <p className="mt-3 text-sm">{label}</p>
    </div>
  );
}
