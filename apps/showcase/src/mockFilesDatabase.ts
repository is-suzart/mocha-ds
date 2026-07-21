export interface FileNode {
  id: string;
  name: string;
  type: string;
  size: string;
  sizeBytes: number;
  updatedAt: string;
  children?: FileNode[];
}

export const initialFilesData: FileNode[] = [
  {
    id: '1',
    name: 'Documentos de Trabalho',
    type: 'Diretório',
    size: '120.5 MB',
    sizeBytes: 126348800,
    updatedAt: '2026-07-01',
    children: [
      {
        id: '1-1',
        name: 'Relatorio_Financeiro.pdf',
        type: 'PDF',
        size: '15.2 MB',
        sizeBytes: 15938355,
        updatedAt: '2026-07-05',
      },
      {
        id: '1-2',
        name: 'Apresentacao_Vendas.pptx',
        type: 'Apresentação',
        size: '45.1 MB',
        sizeBytes: 47290777,
        updatedAt: '2026-06-28',
      },
      {
        id: '1-3',
        name: 'Contratos Anuais',
        type: 'Diretório',
        size: '60.2 MB',
        sizeBytes: 63124268,
        updatedAt: '2026-07-10',
        children: [
          {
            id: '1-3-1',
            name: 'Contrato_Cliente_Acme.docx',
            type: 'Documento Word',
            size: '2.1 MB',
            sizeBytes: 2202009,
            updatedAt: '2026-07-10',
          },
          {
            id: '1-3-2',
            name: 'Contrato_Fornecedor_Global.docx',
            type: 'Documento Word',
            size: '3.4 MB',
            sizeBytes: 3565158,
            updatedAt: '2026-07-09',
          },
          {
            id: '1-3-3',
            name: 'Anexos_Adicionais',
            type: 'Diretório',
            size: '54.7 MB',
            sizeBytes: 57357101,
            updatedAt: '2026-07-02',
            children: [
              {
                id: '1-3-3-1',
                name: 'Planilha_Custos_Anexos.xlsx',
                type: 'Planilha',
                size: '54.7 MB',
                sizeBytes: 57357101,
                updatedAt: '2026-07-02',
              }
            ]
          }
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Imagens & Mídia',
    type: 'Diretório',
    size: '850.3 MB',
    sizeBytes: 891602534,
    updatedAt: '2026-07-10',
    children: [
      {
        id: '2-1',
        name: 'Festa_Fim_Ano.jpg',
        type: 'Imagem JPEG',
        size: '8.4 MB',
        sizeBytes: 8808038,
        updatedAt: '2026-01-02',
      },
      {
        id: '2-2',
        name: 'Logo_Empresa_Vektor.png',
        type: 'Imagem PNG',
        size: '1.9 MB',
        sizeBytes: 1992294,
        updatedAt: '2026-05-15',
      },
      {
        id: '2-3',
        name: 'Video_Campanha_Promocional.mp4',
        type: 'Vídeo MP4',
        size: '840.0 MB',
        sizeBytes: 880802202,
        updatedAt: '2026-07-08',
      }
    ],
  },
  {
    id: '3',
    name: 'Ambiente de Desenvolvimento',
    type: 'Diretório',
    size: '5.2 MB',
    sizeBytes: 5452595,
    updatedAt: '2026-07-11',
    children: [
      {
        id: '3-1',
        name: 'tsconfig.json',
        type: 'Configuração JSON',
        size: '2 KB',
        sizeBytes: 2048,
        updatedAt: '2026-07-11',
      },
      {
        id: '3-2',
        name: 'package.json',
        type: 'Configuração JSON',
        size: '4 KB',
        sizeBytes: 4096,
        updatedAt: '2026-07-11',
      },
      {
        id: '3-3',
        name: 'src',
        type: 'Diretório',
        size: '5.1 MB',
        sizeBytes: 5348251,
        updatedAt: '2026-07-12',
        children: [
          {
            id: '3-3-1',
            name: 'index.ts',
            type: 'Script TypeScript',
            size: '12 KB',
            sizeBytes: 12288,
            updatedAt: '2026-07-05',
          },
          {
            id: '3-3-2',
            name: 'TreeTable.tsx',
            type: 'Componente React',
            size: '25 KB',
            sizeBytes: 25600,
            updatedAt: '2026-07-12',
          },
          {
            id: '3-3-3',
            name: 'styles.css',
            type: 'Estilo CSS',
            size: '5.0 MB',
            sizeBytes: 5310363,
            updatedAt: '2026-07-09',
          }
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'README.md',
    type: 'Documento Markdown',
    size: '12 KB',
    sizeBytes: 12288,
    updatedAt: '2026-07-11',
  },
  {
    id: '5',
    name: '.gitignore',
    type: 'Arquivo Oculto',
    size: '1 KB',
    sizeBytes: 1024,
    updatedAt: '2026-07-01',
  }
];
