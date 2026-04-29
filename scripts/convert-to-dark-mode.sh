#!/bin/bash

# Script to convert all Tailwind classes to dark mode

echo "🌙 Converting all files to dark mode..."

# Function to convert a file
convert_file() {
    local file=$1
    echo "Converting: $file"

    # Background colors
    sed -i '' 's/bg-white\b/bg-slate-800/g' "$file"
    sed -i '' 's/bg-gray-50\b/bg-slate-900/g' "$file"
    sed -i '' 's/bg-gray-100\b/bg-slate-700/g' "$file"

    # Text colors
    sed -i '' 's/text-gray-900\b/text-slate-100/g' "$file"
    sed -i '' 's/text-gray-800\b/text-slate-200/g' "$file"
    sed -i '' 's/text-gray-700\b/text-slate-300/g' "$file"
    sed -i '' 's/text-gray-600\b/text-slate-400/g' "$file"
    sed -i '' 's/text-gray-500\b/text-slate-500/g' "$file"

    # Borders
    sed -i '' 's/border-gray-200\b/border-slate-700/g' "$file"
    sed -i '' 's/border-gray-300\b/border-slate-600/g' "$file"

    # Hover states
    sed -i '' 's/hover:bg-gray-50\b/hover:bg-slate-700/g' "$file"
    sed -i '' 's/hover:bg-gray-100\b/hover:bg-slate-600/g' "$file"
}

# Find all TSX files and convert them
find app components -name "*.tsx" -type f | while read file; do
    convert_file "$file"
done

echo "✅ Dark mode conversion complete!"
