# Mocha Concepts — TS ↔ QML Communication

Mocha is a native desktop framework using Qt6/QML and TypeScript. It inherits two API styles from Qt:

| Mocha term | Qt equivalent | Purpose |
|-------------|---------------|---------|
| `QProperty<T>` | `Q_PROPERTY` | Declare state — QML reacts automatically |
| `QMLNode` / `viewChild()` | `QObject*` pointer | Get a reference — read or command imperatively |

The key insight: **QProperty is reactive (push), viewChild is imperative (pull/call).** If you're unsure which to use, answer: "Is this data that QML should display or react to?" → QProperty. "Do I need to grab a specific widget and read/write it?" → viewChild.

---

## The 4 Patterns

### 1. TS → QML (declarar estado)

**When**: You have data in TypeScript and QML should display it and stay in sync.

**API**: `@qproperty` / `QProperty<T>`

```typescript
class AppController extends QObject {
  @qproperty message = new QProperty("Hello");
}
```

```qml
Text { text: controller.message }  // auto-updates when message changes
```

### 2. QML → TS (ler estado do QML)

**When**: QML has state (e.g. a TextInput) and TypeScript needs to read it.

**API**: `viewChild()` + `.getProperty()` or `bind()`

```typescript
class AppController extends QObject {
  @viewChild("userInput", QMLTextField) input!: ViewChildRef<QMLTextField>;

  submit() {
    const name = this.input.getProperty("text");
    console.log(name);
  }
}
```

```qml
TextInput { id: userInput; objectName: "userInput" }
Button { onClicked: controller.bridgeCall("submit") }
```

### 3. TS → QML (comandar)

**When**: TypeScript tells QML to do something (focus, scroll, animate).

**API**: `viewChild()` + `.setProperty()` / `.invoke()`

```typescript
@viewChild("searchField", QMLTextField) searchField!: ViewChildRef<QMLTextField>;

focusSearch() {
  this.searchField.invoke("forceActiveFocus");
}
```

### 4. QML → TS (comandos / eventos)

**When**: QML triggers an action in TypeScript (button click, form submit).

**API**: `bridgeCall` via `onClicked: controller.bridgeCall("methodName")`

```qml
Button {
  text: "Save"
  onClicked: controller.bridgeCall("save")
}
```

```typescript
class AppController extends QObject {
  save() {
    // handle save
  }
}
```

---

## Quick Reference

```
┌──────────────────────────────────────────────┐
│                 TS → QML                      │
│  State    │  @qproperty         │  Pattern 1  │
│  Command  │  viewChild().invoke │  Pattern 3  │
├──────────────────────────────────────────────┤
│                 QML → TS                      │
│  Read     │  viewChild().get()   │  Pattern 2  │
│  Event    │  bridgeCall()        │  Pattern 4  │
└──────────────────────────────────────────────┘
```

## Common Mistakes

- `viewChild("foo").value` — QMLNode is not reactive. Use `getProperty("key")` or `bind()`.
- Forgetting `objectName` — viewChild relies on `objectName` matching the id. The framework auto-injects this in dev mode, but ensure your QML elements have `id` attributes.
