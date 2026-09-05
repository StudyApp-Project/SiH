import { NextResponse } from 'next/server';
import { DocumentService } from '@/services/documentService';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const targetCompetency = formData.get('competency') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const filename = file.name;
    const text = await file.text();

    const ingested = await DocumentService.processDocument(
      filename,
      text || 'Sample MoSPI guidelines extracted text for statistical manual.',
      targetCompetency ? [targetCompetency] : []
    );

    return NextResponse.json({
      success: true,
      document: ingested,
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json({ error: 'Failed to process document' }, { status: 500 });
  }
}
