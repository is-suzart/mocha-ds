import QtQuick
import QtQuick.Window
import QtQuick.Layouts
import QtQuick.Controls
import MochaDS

Window {
    id: window
    width: 800
    height: 600
    visible: true
    title: "Mocha-DS: MediaQuery + MochaMap"
    color: Theme.colors.crust

    Component.onCompleted: {
        // Inicializa o Singleton para vigiar o tamanho dessa janela
        MediaQuery.watch(window)
    }

    // Header fixo no topo
    Rectangle {
        id: header
        width: parent.width
        height: 60
        color: Theme.colors.mantle
        z: 10
        
        Text {
            anchors.centerIn: parent
            text: "Breakpoints Ativos: " + MediaQuery.activeBreakpoint.toUpperCase()
            font.pixelSize: Theme.typography.sizeH2
            font.bold: true
            color: MediaQuery.isSm ? Theme.colors.red : Theme.colors.green
        }
    }

    ScrollView {
        anchors.top: header.bottom
        anchors.bottom: parent.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        clip: true

        Box {
            p: "xl"
            width: window.width

            VStack {
                width: parent.width
                spacing: Theme.spacing.xl

                Text {
                    text: MediaQuery.isMobile 
                        ? "📱 Modo Mobile (Cartões em Coluna)" 
                        : "💻 Modo Desktop (Cartões em Linha)"
                    font.pixelSize: Theme.typography.sizeLg
                    color: Theme.colors.subtext0
                }

                // MochaMap mapeando um array nativo do Javascript!
                MochaMap {
                    width: parent.width
                    spacing: Theme.spacing.md

                    items: [
                        { name: "Suzart", role: "Arquiteto Chefe", avatar: "S", bio: "Criador do Mocha-DS." },
                        { name: "Ana", role: "Dev Frontend", avatar: "A", bio: "Especialista em DX." },
                        { name: "Carlos", role: "Backend Node", avatar: "C", bio: "Mestre dos WebSockets." }
                    ]

                    delegate: Card {
                        property var modelData
                        property int index
                        variant: "elevated"
                        width: window.width - (Theme.spacing.xl * 2)

                        // MÁGICA AQUI: O layout interno do card quebra dependendo da tela!
                        AdaptiveStack {
                            width: parent.width
                            direction: MediaQuery.isMobile ? "vertical" : "horizontal"
                            spacing: Theme.spacing.lg
                            
                            Avatar {
                                name: modelData.avatar
                                size: MediaQuery.isMobile ? "xl" : "lg"
                            }

                            VStack {
                                spacing: Theme.spacing.xs
                                Text { 
                                    text: modelData.name
                                    font.bold: true
                                    font.pixelSize: Theme.typography.sizeLg
                                }
                                Text { 
                                    text: modelData.role
                                    color: Theme.colors.subtext0
                                }
                                Text {
                                    text: modelData.bio
                                    color: Theme.colors.text
                                }
                            }
                            
                            Item { Layout.fillWidth: true } // Spacer
                            
                            Button {
                                text: "Seguir"
                                variant: MediaQuery.isMobile ? "solid" : "outline"
                                Layout.fillWidth: MediaQuery.isMobile // No mobile o botão estica!
                            }
                        }
                    }
                }
            }
        }
    }
}
