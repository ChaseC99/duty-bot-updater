#!/bin/bash
if test -f "deployment-package.zip"; then
    echo "Removing deployment-package.zip"
    rm deployment-package.zip
fi

echo "Zipping..."
zip -r deployment-package.zip node_modules src .env
echo "Zipped!"