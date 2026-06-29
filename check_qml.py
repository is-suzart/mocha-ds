from PySide6.QtQml import QQmlComponent, QQmlEngine
from PySide6.QtCore import QUrl
from PySide6.QtGui import QGuiApplication
import sys

app = QGuiApplication(sys.argv)
engine = QQmlEngine()
comp = QQmlComponent(engine, QUrl.fromLocalFile("HeroCarousel.qml"))
if comp.isError():
    for err in comp.errors():
        print(err.toString())
else:
    print("No errors")
