import {
  QObject,
  QProperty,
  QApplication,
  QTimer,
  Signal,
  qproperty,
} from "@mocha/core";

class Greeter extends QObject {
  readonly greeted = new Signal<(name: string) => void>();

  @qproperty name = new QProperty("World");
  @qproperty greeting = new QProperty("");

  constructor(parent: QObject | null = null) {
    super(parent);
    this._updateGreeting();
    this.name.changed.connect(() => this._updateGreeting());
  }

  greet(): void {
    this.greeted.emit(this.greeting.value);
  }

  private _updateGreeting(): void {
    this.greeting.value = `Hello, ${this.name.value}!`;
  }
}

const app = new QApplication({
  appName: "Mocha Hello World",
  appVersion: "0.1.0",
});

const greeter = new Greeter();

greeter.greeted.connect((name: string) => {
  console.log(`🐻 Signal received: ${name}`);
});

console.log("=== Mocha Hello World ===");

console.log(greeter.greeting.value);
greeter.greet();

greeter.name.value = "Mocha";
console.log(greeter.greeting.value);
greeter.greet();

greeter.name.value = "TypeScript + Qt";
console.log(greeter.greeting.value);
greeter.greet();

console.log("\n=== Parent-Child Hierarchy ===");
const parent = new QObject();
const child1 = new QObject(parent);
const child2 = new QObject(parent);
const grandchild = new QObject(child1);

console.log(`Parent has ${parent.childCount} children`);
console.log(parent.dumpObjectTree());

app.quit();
