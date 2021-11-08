#!/bin/bash

set -eu

export digest=$(cat ./edge-image/digest)

pushd charts-repo

ref=$(yq e '.image.git_ref' charts/admin-panel/values.yaml)
git checkout ${BRANCH}
old_ref=$(yq e '.image.git_ref' charts/admin-panel/values.yaml)

cat <<EOF >> ../body.md
# Bump admin-panel image

The admin-panel image will be bumped to digest:
```
${digest}
```

Code diff contained in this image:

https://github.com/GaloyMoney/admin-panel/compare/${old_ref}...${ref}
EOF

gh pr close ${BOT_BRANCH} || true
gh pr create \
  --title bump-admin-panel-image-${ref} \
  --body-file ../body.md \
  --base ${BRANCH} \
  --head ${BOT_BRANCH} \
  --label galoybot
