#!/bin/bash
export QML_XHR_ALLOW_FILE_READ=1
export QML2_IMPORT_PATH="$(dirname "$0")/design-system"

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR/design-system/test"

if command -v qmlscene6 &>/dev/null; then
    qmlscene6 -I "$DIR/design-system" "$DIR/design-system/test/preview.qml" "$@"
else
    qmlscene -I "$DIR/design-system" "$DIR/design-system/test/preview.qml" "$@"
fi
