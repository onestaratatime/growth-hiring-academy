#!/bin/bash

# Script to fix ALL remaining dark mode issues

echo "🌙 Fixing all dark mode issues..."

convert_file() {
    local file=$1
    echo "Converting: $file"

    # Background colors - comprehensive
    sed -i '' 's/bg-white\b/bg-slate-800/g' "$file"
    sed -i '' 's/bg-gray-50\b/bg-slate-900/g' "$file"
    sed -i '' 's/bg-gray-100\b/bg-slate-700/g' "$file"
    sed -i '' 's/bg-gray-200\b/bg-slate-600/g' "$file"

    # Text colors - comprehensive
    sed -i '' 's/text-gray-900\b/text-slate-100/g' "$file"
    sed -i '' 's/text-gray-800\b/text-slate-200/g' "$file"
    sed -i '' 's/text-gray-700\b/text-slate-300/g' "$file"
    sed -i '' 's/text-gray-600\b/text-slate-400/g' "$file"
    sed -i '' 's/text-gray-500\b/text-slate-500/g' "$file"
    sed -i '' 's/text-gray-400\b/text-slate-500/g' "$file"

    # Borders - comprehensive
    sed -i '' 's/border-gray-200\b/border-slate-700/g' "$file"
    sed -i '' 's/border-gray-300\b/border-slate-600/g' "$file"
    sed -i '' 's/border-gray-400\b/border-slate-500/g' "$file"

    # Hover states
    sed -i '' 's/hover:bg-gray-50\b/hover:bg-slate-700/g' "$file"
    sed -i '' 's/hover:bg-gray-100\b/hover:bg-slate-600/g' "$file"
    sed -i '' 's/hover:bg-white\b/hover:bg-slate-700/g' "$file"

    # Focus states
    sed -i '' 's/focus:bg-gray-50\b/focus:bg-slate-700/g' "$file"

    # Special cases for inputs
    sed -i '' 's/className="w-full px-\([0-9]\) py-\([0-9]\) border border-gray-\([0-9]\{3\}\) rounded/className="w-full px-\1 py-\2 bg-slate-700 border border-slate-600 text-slate-100 rounded/g' "$file"
}

# Find all TSX files and convert them
find app components -name "*.tsx" -type f | while read file; do
    convert_file "$file"
done

echo "✅ All dark mode issues fixed!"
