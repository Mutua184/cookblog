'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Recipe = {
  slug: string;
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  steps: string[];
};

export default function AddRecipePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState(false);

  // Handle image URL change with validation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImage(url);
    setImageError(false);
    
    // Set preview if URL looks like an image
    if (url && isValidImageUrl(url)) {
      setImagePreview(url);
    } else {
      setImagePreview('');
    }
  };

  // Basic image URL validation
  const isValidImageUrl = (url: string): boolean => {
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
    const urlPattern = /^https?:\/\/.+/i;
    return urlPattern.test(url) && (imageExtensions.test(url) || url.includes('unsplash') || url.includes('pexels') || url.includes('pixabay'));
  };

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
    setImagePreview('');
  };

  // Suggest popular image sources
  const getImageSuggestion = () => {
    const suggestions = [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500"
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate image URL
      if (!isValidImageUrl(image)) {
        alert('Please enter a valid image URL (jpg, png, gif, webp, or from popular image sites)');
        setIsSubmitting(false);
        return;
      }

      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      if (!slug) {
        alert('Please enter a valid title');
        setIsSubmitting(false);
        return;
      }

      const newRecipe: Recipe = {
        slug,
        title: title.trim(),
        image: image.trim(),
        description: description.trim(),
        ingredients: ingredients.split(',').map((i) => i.trim()).filter(i => i.length > 0),
        steps: steps.split(',').map((s) => s.trim()).filter(s => s.length > 0),
      };

      // Validate ingredients and steps
      if (newRecipe.ingredients.length === 0) {
        alert('Please add at least one ingredient');
        setIsSubmitting(false);
        return;
      }

      if (newRecipe.steps.length === 0) {
        alert('Please add at least one step');
        setIsSubmitting(false);
        return;
      }

      const stored = localStorage.getItem('userRecipes');
      const recipes: Recipe[] = stored ? JSON.parse(stored) : [];

      const exists = recipes.find((r) => r.slug === slug);
      if (exists) {
        alert('A recipe with this title already exists. Please use a different title.');
        setIsSubmitting(false);
        return;
      }

      recipes.push(newRecipe);
      localStorage.setItem('userRecipes', JSON.stringify(recipes));

      // Simulate a brief delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      alert('Recipe added successfully!');
      router.push(`/recipes/${slug}`);
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Failed to add recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/cblog.jpg')" }}
    >
      <div className="relative z-10 bg-white text-black w-full max-w-3xl rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#800000]">Add a New Recipe</h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            ← Back to Home
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Chocolate Chip Cookies"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#800000] focus:border-transparent"
            />
          </div>

          {/* Image URL Input with Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL *
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={image}
              onChange={handleImageChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#800000] focus:border-transparent"
            />
            
            {/* Image URL Help */}
            <div className="mt-2 text-sm text-gray-600">
              <p className="mb-1">📸 <strong>Image URL Tips:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Use high-quality images from <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Unsplash</a>, <a href="https://pexels.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Pexels</a>, or <a href="https://pixabay.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Pixabay</a></li>
                <li>Right-click on any image online → "Copy image address"</li>
                <li>Supported formats: JPG, PNG, GIF, WebP</li>
              </ul>
              <button
                type="button"
                onClick={() => {
                  const suggestion = getImageSuggestion();
                  setImage(suggestion);
                  setImagePreview(suggestion);
                }}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Try a sample image URL
              </button>
            </div>

            {/* Image Preview */}
            {imagePreview && !imageError && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                <div className="relative w-full max-w-md mx-auto">
                  <img
                    src={imagePreview}
                    alt="Recipe preview"
                    className="w-full h-48 object-cover rounded-lg border shadow-sm"
                    onError={handleImageError}
                  />
                </div>
              </div>
            )}

            {/* Image Error */}
            {imageError && image && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                ⚠️ Unable to load image. Please check the URL or try a different image.
              </div>
            )}
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              placeholder="A brief description of your recipe..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#800000] focus:border-transparent resize-vertical"
            />
          </div>

          {/* Ingredients Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients *
            </label>
            <textarea
              placeholder="2 cups flour, 1 cup sugar, 3 eggs, 1/2 cup butter..."
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#800000] focus:border-transparent resize-vertical"
            />
            <p className="mt-1 text-xs text-gray-500">
              💡 Separate each ingredient with a comma
            </p>
          </div>

          {/* Steps Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cooking Steps *
            </label>
            <textarea
              placeholder="Preheat oven to 350°F, Mix dry ingredients in a bowl, Add wet ingredients and stir..."
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              required
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#800000] focus:border-transparent resize-vertical"
            />
            <p className="mt-1 text-xs text-gray-500">
              💡 Separate each step with a comma
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#800000] text-white px-6 py-3 rounded-xl hover:bg-red-800 transition w-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Recipe...
              </>
            ) : (
              <>
                ➕ Add Recipe
              </>
            )}
          </button>
        </form>

        {/* Additional Tips */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">🌟 Pro Tips for Great Recipe Images:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Search for "[your dish name] food" on free image sites</li>
            <li>• Choose images that are well-lit and appetizing</li>
            <li>• Avoid images with watermarks or low resolution</li>
            <li>• Consider the image orientation (landscape works best)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


