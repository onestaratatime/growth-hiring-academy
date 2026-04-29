#!/bin/bash

# Script to fix text contrast issues for dark mode

echo "🔍 Fixing text contrast issues..."

convert_file() {
    local file=$1
    echo "Fixing: $file"

    # Fix dark text on dark background
    sed -i '' 's/text-gray-900/text-slate-100/g' "$file"
    sed -i '' 's/text-slate-900/text-slate-100/g' "$file"

    # Fix medium dark text
    sed -i '' 's/text-gray-800/text-slate-200/g' "$file"
    sed -i '' 's/text-slate-800/text-slate-200/g' "$file"
}

# Find all TSX files and convert them
find app components -name "*.tsx" -type f | while read file; do
    # Check if file contains problematic classes
    if grep -q "text-gray-900\|text-slate-900\|text-gray-800\|text-slate-800" "$file"; then
        convert_file "$file"
    fi
done

echo "✅ Text contrast fixed!"
