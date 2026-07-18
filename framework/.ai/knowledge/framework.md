# Mocha-DS Framework — Documentação Técnica

## 1. Arquitetura Geral

```
┌─────────────────────────────────────────────────┐
│                  @mocha/qml                      │
│  runApp()   QMLComponent   generateQMLSource    │
│  QMLTemplateParser  BindingEngine  HotReload    │
├─────────────────────────────────────────────────┤
│                  @mocha/core                     │
│  QObject  QProperty  Signal  effect()           │
│  Container  @Injectable  QApplication  QTimer   │
│  QComputedProperty  ReactiveEffect              │
├─────────────────────────────────────────────────┤
│                 @mocha/native                    │
│  NativeApp  (JS)                                │
│  lib.rs     (Rust / napi-rs)                    │
│  qt_bridge.cpp  (C++ / Qt6)                     │
│  └─ MochaDynamicObject (QObject proxy)          │
├─────────────────────────────────────────────────┤
│                @mocha/shared                     │
│  Disposable  Logger  FileUtils                  │
├─────────────────────────────────────────────────┤
│              @mocha/kit + @mocha/cli             │
│  dev  build  type-gen  create  add  serve  info │
└─────────────────────────────────────────────────┘
```

### Fluxo de Boot (runApp)

1. `runApp(AppController)` é chamada pelo template do usuário
2. Cria `NativeApp` → `QGuiApplication` + `QQmlApplicationEngine`
3. Escaneia todos `@QMLComponent` com `providedIn: "root"`
   - Instancia cada um (via `globalContainer` se `@Injectable`, ou `new` direto)
   - Pra cada: `nativeApp.createProxy()` → `MochaDynamicObject` no C++
   - Pra cada `@qproperty` no service: `effect()` watcher → `proxySetValue()`
   - Registra como context property no QML engine
4. Cria o controller principal (AppController), mesmo processo acima
   - Context property name fixo: `"controller"`
5. `generateQMLSource()` transforma o template QML:
   - `controller.x.value` → `controller.get("x")`
   - `controller.x()` → `controller.__call("x")`
   - Injeta `readonly property int __bridge_Nome: Nome.__seq` pra reatividade
6. `loadQML()` carrega o QML transformado no engine
7. Entra no event loop: `processEvents()` + `setTimeout(tick, 8)` (~120fps)
   - A cada tick: processa eventos Qt, drena chamadas pendentes do C++
   - `__call(method)` no QML → C++ fila o nome → JS `drainPendingCalls`
     → invoca o método TS → `effect()` detecta mudança → `proxySetValue()`
     → C++ atualiza valor + `__seq++` → QML reavalia bindings

### Fluxo de Dados (Reatividade TS → QML)

```
TS QProperty.value = 5
  └─ effect() detecta (activeEffect tracking)
      └─ nativeApp.proxySetValue(proxyId, "count", 5)
          └─ Rust: nativeProxySetInt()
              └─ C: mocha_object_set_int()
                  └─ MochaDynamicObject::setInt("count", 5)
                      ├─ _values["count"] = QVariant(5)
                      ├─ _seq++
                      └─ emit seqChanged()
                          └─ QML bindings reavaliam
                              └─ controller.get("count") retorna "5"
```

### Fluxo de Dados (QML → TS)

```
Usuário clica botão
  └─ QML: onClicked: controller.__call("increment")
      └─ MochaDynamicObject::__call("increment")
          ├─ _pendingCalls << "increment"
          └─ _seq++; emit seqChanged()
              └─ (QML reavalia bindings, se houver)
  └─ processEvents() retorna
  └─ drainPendingCalls():
      ├─ nativeApp.proxyDrainPendingCalls(proxyId) → ["increment"]
      └─ instance["increment"]()  (TS method call)
          └─ count.value++ → effect() → proxySetValue() (ver fluxo acima)
```

---

## 2. Pacote @mocha/core

### `QObject` (`core/src/qobject.ts`)
- Base class de todos os objetos do framework
- `objectId`, `objectName`, parent/children tree
- `connect(signal, slot)` para conectar signals
- `dispose()` — chama `qmlDestroy()` se implementado
- `queueMicrotask` no constructor chama `qmlInit()` se implementado
- Meta-object registration automática via `_registerMetaObject()`

### `QProperty<T>` (`core/src/qproperty.ts`)
- `value` getter: registra no `activeEffect` se houver
- `value` setter: emite `beforeChange` + `changed` signals
- `bindTo(source)`, `bindTwoWay(other)` para bindings entre QProperties
- `meta: QMetaProperty` — nome, tipo, notifySignal

### `Signal<F>` (`core/src/signals.ts`)
- `connect(fn)` → retorna `SignalConnection` com `.disconnect()`
- `emit(...args)` — chama todos os slots conectados
- Suporta `once`, `disconnectAll`, atraso/batching via microtask

### `effect()` (`core/src/reactivity.ts`)
- `ReactiveEffect`: cria, executa fn, rastreia dependências (`QProperty.value` lidos durante execução)
- No `changed` de cada dependência, re-executa o effect
- `activeEffectRef()`: retorna o effect ativo (usado por `QProperty.value` getter)
- `effect(fn)` → `{ destroy: () => void }`

### `QComputedProperty<T>` (`core/src/qcomputed.ts`)
- Built on top de `effect()` para valores derivados
- Recalcula quando dependências mudam

### DI Container (`core/src/di.ts`)
- `Container`: `register(token, factory)`, `resolve(token)`
- `globalContainer`: container global singleton
- `@Injectable()`: class decorator que registra no `globalContainer`

### Outros
- `QApplication`: wrapper TS para config da app
- `QTimer`: timer com `start(ms)`, `stop()`, `timeout` signal
- `QThread` + `ThreadManager`: threads worker
- `@qproperty`: property decorator que cria metadata `__qproperty_<name>`
- `QmlInit` / `QmlDestroy`: lifecycle interfaces

---

## 3. Pacote @mocha/qml

### `@QMLComponent(options)` (`qml/src/qml-component.ts`)
- Class decorator para componentes QML
- Options:
  - `qml`: string — template QML (tagged via `` qml`...` ``)
  - `autoBind?`: boolean
  - `hotReload?`: boolean
  - `providedIn?`: `"root"` | `"view"` (default `"view"`)
- Registra metadata no `componentRegistry`
- `getQMLComponentMetadata(cls)`, `getAllQMLComponents()`

### `generateQMLSource(component, metadata, proxyEntries?)`
- Transforma o template QML:
  - `controller.x.value` → `controller.get("x")`
  - `controller.x()` → `controller.__call("x")`
- Injeta `readonly property int __bridge_Nome: Nome.__seq` para cada proxy
- Se `proxyEntries` vazio, fallback: substitui valores estáticos (legacy)

### `runApp(AppController, options?)` (`qml/src/run-app.ts`)
- Bootstrap principal da aplicação
- Fluxo completo descrito na seção 1
- Retorna Promise que resolve quando o app fecha
- Usa `processEvents()` + `setTimeout(8ms)` como event loop
- Trata `SIGINT`/`SIGTERM` para sair

### `QMLTemplateParser` (`qml/src/qml-parser.ts`)
- Parse de template QML: extrai imports, nodes, propriedades, signal handlers
- `generateBindings(document, componentId)`: encontra expressões `controller.x.value`
- Regex de binding: `^controller\.\w+(\.(value|get)\(\))?$`

### `BindingEngine` (`qml/src/binding.ts`)
- Bindings entre QProperties TS e expressões QML
- `bind()`, `bindTwoWay()`, `bindToExpression()`
- `bindFromQMLBindings()` — estabelece bindings do parser

### `qml` tagged template (`qml/src/template-tag.ts`)
- Tagged template literal para QML: `` qml`import ...` ``

### Hot Reload (`qml/src/hot-reload.ts`)
- `hotReload()`, `hotreload()`, `isHotReloadable()`, `HotReloadManager`

---

## 4. Pacote @mocha/native

### Estrutura

```
packages/native/
├── index.js           # JS API (NativeApp class)
├── index.d.ts         # TypeScript declarations
├── package.json
├── Cargo.toml
├── build.rs           # Compila C++ com cc + roda moc
└── src/
    ├── qt_bridge.cpp  # C++ Qt6 bindings
    └── lib.rs         # Rust napi-rs bindings
```

### `qt_bridge.cpp`

**Exports C (`extern "C"`):**

| Função | Descrição |
|---|---|
| `qt_app_create` | Cria `QGuiApplication` |
| `qt_app_destroy` | Destroi app |
| `qml_engine_create` | Cria `QQmlApplicationEngine` |
| `qml_engine_load_data` | Carrega QML via `loadData()` |
| `qml_engine_root_objects` | Retorna primeiro root object |
| `qml_engine_set_context_property` | `engine->rootContext()->setContextProperty()` |
| `qt_object_get/set_property` | Acessa propriedades de QObject |
| `qt_object_get/set_int/bool` | Acessa typed properties |
| `qt_app_process_events` | `QCoreApplication::processEvents()` |
| `qt_app_exec` | `QGuiApplication::exec()` |
| `qt_app_quit` | `QGuiApplication::quit()` |
| `mocha_object_create` | Cria `MochaDynamicObject` com proxyId |
| `mocha_object_destroy` | Destroi proxy |
| `mocha_object_set_value/int/bool` | Seta valores no proxy |
| `mocha_object_get_value` | Lê valor do proxy |
| `mocha_object_has_pending_calls` | Verifica se há chamadas pendentes |
| `mocha_object_drain_pending_calls` | Drena chamadas pendentes (batch) |

**`MochaDynamicObject` (QObject):**
- `Q_PROPERTY(int __seq READ seq NOTIFY seqChanged)` — propulsor de reatividade
- `Q_INVOKABLE setValue(QString, QString)`, `setInt`, `setBool`
- `Q_INVOKABLE getValue(QString)` / `get(QString)` — lê valores
- `Q_INVOKABLE __call(QString method)` — fila chamada de método TS
- `_pendingCalls: QStringList` — fila de métodos chamados pelo QML
- `_seq++` em toda mutação → notifica QML bindings

### `lib.rs` (Rust)

**Napi functions:**

| Função | Descrição |
|---|---|
| `nativeAppCreate()` | Cria QApplication |
| `nativeEngineCreate()` → u32 | Cria engine, retorna handle |
| `nativeEngineLoad(id, data, base, import?)` | Carrega QML |
| `nativeEngineRootObject(id)` → u32 | Retorna root object handle |
| `nativeObjectGet/SetProperty/Int/Bool` | Acessa QObject properties |
| `nativeProcessEvents()` | Processa eventos Qt |
| `nativeAppExec()` → i32 | Entra no event loop Qt |
| `nativeAppQuit()` | Sai do event loop |
| `nativeEngineCreateProxy(engineId)` → u32 | Cria MochaDynamicObject |
| `nativeProxySetValue/Int/Bool(id, name, val)` | Seta valor no proxy |
| `nativeProxyGetValue(id, name)` → String | Lê valor do proxy |
| `nativeProxyHasPendingCalls(id)` → bool | Verifica fila |
| `nativeProxyDrainPendingCalls(id)` → Vec<String> | Drena fila |
| `nativeEngineSetContext(engineId, name, proxyId)` | setContextProperty |

**`NativeState`:**
- `objects: HashMap<u32, *mut c_void>` — mapeia handles pra ponteiros C++
- Gerenciado por `LazyLock<Mutex<NativeState>>`

### `build.rs`
- `pkg_config` para achar Qt6 (Core, Gui, Qml, Quick)
- Roda `moc` (Qt6 Meta-Object Compiler) no `qt_bridge.cpp`
  - Localiza moc em `/usr/lib/qt6/moc` ou `PATH`
  - Gera `qt_bridge.moc`, incluso via `#include "qt_bridge.moc"`
- Compila C++ com `cc::Build` (C++17, -fPIC)
- Passa libs Qt pro linker via `cargo:rustc-link-lib`

---

## 5. Pacotes @mocha/cli e @mocha/kit

### CLI (`packages/cli/src/index.ts`)
- Baseado em `commander`
- Comandos: `create`, `add`
- `create <name>` — scaffolding de projeto:
  1. Pergunta backend (native / hybrid / node / python / rust)
  2. Copia template de `packages/cli/templates/{backend}/`
  3. Substitui `{{project_name}}`, `{{project_slug}}`, `{{project_module}}`
  4. Clona MochaDS (shallow) em `ui/MochaDS/`
  5. Gera `qmldir`
  6. Configura i18n opcional
  7. Se dentro do monorepo, usa `file:` links
- `add <component>` — baixa QML individual do raw.githubusercontent

### Templates
- **`native/`**: usa `@mocha/native` + `runApp(AppController)`, janela real
- **`hybrid/`**: usa `@mocha/core` + `@mocha/qml` sem native, mock backend
- **`rust/`**, **`python/`**, **`node/`**: placeholders — templates não existem

### Kit (`packages/kit/src/`):
- `dev`, `build`, `type-gen`, `serve`, `info`

---

## 6. Bridge Reativa TS↔QML — Status da Implementação

### ✅ Concluído (8 etapas)

| Etapa | O que | Arquivos |
|---|---|---|
| 1 | `MochaDynamicObject` C++ class | `qt_bridge.cpp` |
| 2 | Rust napi bindings | `lib.rs` |
| 3 | `NativeApp` JS methods | `index.js`, `index.d.ts` |
| 4 | `providedIn: "root"` metadata | `qml-component.ts` |
| 5 | `runApp` com proxy + sync | `run-app.ts` |
| 6 | `generateQMLSource` transformer | `qml-component.ts` |
| 7 | `__bridge` helper injection | `qml-component.ts` |
| 8 | Build (moc + napi + tsc) + test | `build.rs` + `test-native/` |

### 🔄 Fluxo de Reatividade

```
TS QProperty muda
  → effect() detecta
  → proxySetValue() no C++
  → MochaDynamicObject atualiza _values + __seq++
  → emit seqChanged()
  → QML bindings reavaliam (controller.get("count"))

QML chama __call("increment")
  → MochaDynamicObject fila + __seq++
  → processEvents() retorna
  → JS drainPendingCalls() pega da fila
  → TS method é invocado
  → QProperty muda → fluxo acima
```

### ⚠️ Limitação Conhecida

O event loop usa `processEvents()` + `setTimeout(8ms)` em vez de `exec()`.
Isso é necessário para que o Node.js event loop continue rodando e possa
drenar as chamadas pendentes do C++. Efeitos colaterais:
- CPU um pouco mais alta (loop ativo)
- Timing de animações Qt pode diferir ligeiramente do `exec()` padrão
- `QML_XHR_ALLOW_FILE_READ=1` necessário para LucideIcon

---

## 7. Projeto de Teste

**Localização:** `framework/test-native/` (branch `framework-feat`)

**O que testa:**
- `CounterState` com `providedIn: "root"` — estado global que persiste entre rotas
- `AppController` com `@qproperty count` — controller principal
- Navegação Router entre `/home` e `/about`
- Botões que chamam `controller.__call("increment")` e `CounterState.__call("increment")`
- Uso de `controller.get("count")` e `CounterState.get("count")` no QML

**Como rodar:**
```bash
cd framework/test-native
npm install
QML_XHR_ALLOW_FILE_READ=1 npx tsx src/App.qml.ts
```

---

## 8. Dependências do Sistema

| Ferramenta | Versão | Como instalar |
|---|---|---|
| Qt 6 | ≥ 6.5 | `apt install qt6-base-dev libqt6-dev qt6-tools-dev` |
| Rust | ≥ 1.70 | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` |
| Node.js | ≥ 20 | nvm ou distro package |
| g++ | ≥ 11 | `apt install build-essential` |
| pkg-config | — | `apt install pkg-config` |
| moc (Qt6) | — | parte do `qt6-base-dev`, em `/usr/lib/qt6/moc` |

### Ambiente Verificado

| Componente | Versão |
|---|---|
| Qt | 6.11.1 |
| Rust | 1.96.0 |
| g++ | 16.1.1 |
| Node.js | 26.4.0 |
| Platform | Linux x64 (Wayland + X11) |

---

## 9. Convenções de Código

- **TypeScript:** ES2022, NodeNext modules, `experimentalDecorators`, `useDefineForClassFields: false`
- **C++:** C++17, `QString` em Q_INVOKABLE (não `const char*` — QML não converte)
- **Rust:** `napi` e `napi-derive` v2, `#[napi]` para exports
- **Build:** napi-rs CLI (`napi build --platform --release`), com backup/restore de `index.d.ts`
- **Testes:** Vitest (42 testes em `packages/core/__tests__/core.test.ts`)
