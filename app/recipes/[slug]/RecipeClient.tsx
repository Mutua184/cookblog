'use client';

type Props = {
  slug: string;
};

export default function RecipeClient({ slug }: Props) {
  return (
    <div className="mt-6 p-4 border-t border-gray-200 text-sm text-gray-700">
      <p><strong>Recipe slug:</strong> {slug}</p>
    </div>
  );
}
