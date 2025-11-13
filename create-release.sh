#!/bin/bash

# Script to create a new release tag
# Usage: ./create-release.sh <version>

set -e

# Check if version argument is provided
if [ -z "$1" ]; then
    echo "Error: Version number is required"
    echo "Usage: ./create-release.sh <version>"
    echo "Example: ./create-release.sh 0.0.3"
    exit 1
fi

VERSION="$1"

# Add 'v' prefix if not present
if [[ ! "$VERSION" =~ ^v ]]; then
    TAG_NAME="v$VERSION"
else
    TAG_NAME="$VERSION"
fi

MESSAGE="Release version $VERSION"

echo "Creating release tag: $TAG_NAME"
echo "Message: $MESSAGE"
echo ""

# Create annotated tag
git tag -a "$TAG_NAME" -m "$MESSAGE"

echo "✓ Tag created successfully"
echo ""

# Push tag to remote
echo "Pushing tag to remote..."
git push origin "$TAG_NAME"

echo "✓ Tag pushed successfully"
echo ""
echo "Release $TAG_NAME has been created and pushed!"
echo "Check GitHub Actions for the release build."

