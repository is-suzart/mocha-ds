import {
  QObject,
  QProperty,
  qproperty,
  AppMeta,
} from "@mocha/core";
import {
  MochaForm,
  required,
  requiredTrue,
  email,
  minLength,
} from "@mocha/core";
import {
  QMLComponent,
  qml,
  runApp,
} from "@mocha/qml";

@AppMeta({
  name: "Form Test",
  shortName: "Form",
  description: "MochaForm API test",
  color: "#cba6f7",
})
@QMLComponent({
  qml: qml`
    import QtQuick 2.15
    import MochaDS

    ApplicationWindow {
      id: root
      width: 480
      height: 640
      visible: true
      title: "MochaForm Test"
      color: Theme.colors.base

      VStack {
        anchors.centerIn: parent
        spacing: Theme.spacing.lg

        Text { text: "MochaForm Teasta"; font.pixelSize: 24; font.bold: true; color: Theme.colors.text }
        Text { text: form.valid ? "VALID" : "INVALID"; font.pixelSize: 18; color: form.valid ? Theme.colors.green : Theme.colors.red }

        VStack { spacing: 4
          Text { text: "Name *"; font.bold: true; color: Theme.colors.text }
          TextField { id: nameField; text: form.value_name; placeholder: "Enter name"; onTextChanged: controller.setField("name", text) }
          Text { text: form.error_name || ""; color: Theme.colors.red; visible: form.error_name !== "" }
        }

        VStack { spacing: 4
          Text { text: "Email *"; font.bold: true; color: Theme.colors.text }
          TextField { id: emailField; text: form.value_email; placeholder: "you@example.com"; onTextChanged: controller.setField("email", text) }
          Text { text: form.error_email || ""; color: Theme.colors.red; visible: form.error_email !== "" }
        }

        VStack { spacing: 4
          Text { text: "Password *"; font.bold: true; color: Theme.colors.text }
          TextField { id: passwordField; text: form.value_password; placeholder: "Min 6 chars"; onTextChanged: controller.setField("password", text) }
          Text { text: form.error_password || ""; color: Theme.colors.red; visible: form.error_password !== "" }
        }

        Checkbox { id: termsCheck; label: "I accept the Terms"; onCheckedChanged: controller.setField("terms", checked) }
        Text { text: form.error_terms || ""; color: Theme.colors.red; visible: form.error_terms !== "" }

        HStack { spacing: 12
          Button { text: "Submit"; color: "mauve"; onClicked: controller.onSubmit() }
          Button { text: "Reset"; variant: "secondary"; onClicked: controller.onReset() }
        }
      }
    }
  `,
})
export class FormTestController extends QObject {
  form = this.form({
    name: ["", [required, minLength(2)]],
    email: ["", [required, email]],
    password: ["", [required, minLength(6)]],
    terms: [false, [requiredTrue]],
  });

  setField(key: string, value: any) {
    this.form.field(key).set(value);
  }

  onSubmit() {
    const r = this.form.submit();
    if (r.valid) console.log("SUBMIT", r.value);
    else console.log("INVALID", this.form.errors.value);
  }

  onReset() {
    this.form.reset();
  }
}

runApp(FormTestController);
