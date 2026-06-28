#!/bin/bash
export QML_XHR_ALLOW_FILE_READ=1

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR/test"

if command -v qmlscene6 &>/dev/null; then
    qmlscene6 "$DIR/test/preview.qml" "$@"
else
    qmlscene "$DIR/test/preview.qml" "$@"
fi
