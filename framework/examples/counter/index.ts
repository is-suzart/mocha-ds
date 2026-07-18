import {
  QObject,
  QProperty,
  QApplication,
  QTimer,
  qproperty,
} from "@mocha/core";

class Counter extends QObject {
  @qproperty count = new QProperty(0);
  @qproperty message = new QProperty("Hello from Mocha!");

  constructor(parent: QObject | null = null) {
    super(parent);
  }

  increment(): void {
    this.count.value += 1;
    this.message.value = `Count: ${this.count.value}`;
  }

  decrement(): void {
    this.count.value -= 1;
    this.message.value = `Count: ${this.count.value}`;
  }

  reset(): void {
    this.count.value = 0;
    this.message.value = "Reset!";
  }

  async delayedIncrement(): Promise<void> {
    await new Promise((resolve) => QTimer.singleShot(500, resolve));
    this.increment();
  }
}

const app = new QApplication({
  appName: "Mocha Counter",
  appVersion: "0.1.0",
});

const counter = new Counter();

console.log("=== Mocha Counter Example ===");
console.log(`Initial count: ${counter.count.value}`);

counter.increment();
console.log(`After increment: ${counter.count.value} (message: ${counter.message.value})`);

counter.increment();
console.log(`After another: ${counter.count.value}`);

counter.decrement();
console.log(`After decrement: ${counter.count.value}`);

counter.reset();
console.log(`After reset: ${counter.count.value}`);

console.log("=== Object Tree ===");
console.log(counter.dumpObjectTree());

console.log(`Object name: ${counter.objectName}`);
console.log(`Object ID: ${counter.objectId}`);
console.log(`Parent: ${counter.parent}`);

app.quit();
console.log("Done!");
