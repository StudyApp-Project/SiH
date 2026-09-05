/**
 * src/services/documentService.ts
 *
 * Document ingestion, chunking, and metadata extraction service.
 * Supports MoSPI survey manuals, CAPI guidelines, and FRAC curriculum ingestion.
 */

export interface DocumentChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  text: string;
  metadata: {
    section?: string;
    pageNumber?: number;
    competencyTags: string[];
    wordCount: number;
  };
}

export interface IngestedDocument {
  id: string;
  title: string;
  filename: string;
  sizeBytes: number;
  uploadedAt: string;
  status: 'PROCESSING' | 'CHUNKED' | 'INDEXED' | 'ERROR';
  chunkCount: number;
  targetCompetencies: string[];
  chunks?: DocumentChunk[];
}

export class DocumentService {
  /**
   * Mock document extraction & chunker
   */
  static async processDocument(
    filename: string,
    fileContent: string,
    targetCompetencies: string[] = []
  ): Promise<IngestedDocument> {
    const docId = `doc-${Date.now()}`;

    // Split into paragraphs / pseudo-chunks of roughly 200 words
    const paragraphs = fileContent.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

    const chunks: DocumentChunk[] = paragraphs.map((para, idx) => {
      const words = para.trim().split(/\s+/);
      return {
        id: `chunk-${docId}-${idx + 1}`,
        documentId: docId,
        chunkIndex: idx + 1,
        text: para.trim(),
        metadata: {
          section: `Section ${Math.floor(idx / 3) + 1}`,
          pageNumber: Math.floor(idx / 2) + 1,
          competencyTags: targetCompetencies.length > 0 ? targetCompetencies : ['comp-capi', 'comp-nsso'],
          wordCount: words.length,
        },
      };
    });

    return {
      id: docId,
      title: filename.replace(/\.[^/.]+$/, ''),
      filename,
      sizeBytes: fileContent.length,
      uploadedAt: new Date().toISOString(),
      status: 'INDEXED',
      chunkCount: chunks.length || 1,
      targetCompetencies,
      chunks,
    };
  }

  /**
   * Retrieves sample pre-loaded MoSPI official manuals for testing/demo
   */
  static getSampleDocuments(): IngestedDocument[] {
    return [
      {
        id: 'doc-plfs-2024',
        title: 'PLFS Field Instruction Manual 2024-25',
        filename: 'PLFS_Instruction_Manual_2024.pdf',
        sizeBytes: 4194304,
        uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'INDEXED',
        chunkCount: 24,
        targetCompetencies: ['comp-capi', 'comp-nsso'],
      },
      {
        id: 'doc-capi-handbook',
        title: 'CAPI Application User Guide for Field Staff',
        filename: 'CAPI_Tablet_Guide_v3.2.pdf',
        sizeBytes: 2097152,
        uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        status: 'INDEXED',
        chunkCount: 16,
        targetCompetencies: ['comp-capi', 'comp-data'],
      },
    ];
  }
}
