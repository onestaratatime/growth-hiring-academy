#!/bin/bash

# Script to fix ALL contrast issues in dark mode

echo "🔍 Fixing all remaining contrast issues..."

convert_file() {
    local file=$1
    echo "Processing: $file"

    # Fix all problematic gray text colors
    sed -i '' 's/text-gray-500\b/text-slate-400/g' "$file"
    sed -i '' 's/text-gray-600\b/text-slate-400/g' "$file"
    sed -i '' 's/text-gray-700\b/text-slate-300/g' "$file"

    # Fix slate colors that are too dark
    sed -i '' 's/text-slate-600\b/text-slate-400/g' "$file"
    sed -i '' 's/text-slate-700\b/text-slate-300/g' "$file"
    sed -i '' 's/text-slate-800\b/text-slate-200/g' "$file"
    sed -i '' 's/text-slate-900\b/text-slate-100/g' "$file"

    # Fix borders
    sed -i '' 's/border-gray-400\b/border-slate-600/g' "$file"
    sed -i '' 's/border-gray-500\b/border-slate-600/g' "$file"
}

# Find all TSX files and convert them
find app components -name "*.tsx" -type f | while read file; do
    convert_file "$file"
done

echo "✅ All contrast issues fixed!"
