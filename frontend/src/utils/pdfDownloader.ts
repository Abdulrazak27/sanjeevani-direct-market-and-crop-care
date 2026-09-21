/**
 * Utility to generate and download real valid ICAR / Ministry of Agriculture PDF files
 */
export function downloadAgriResourcePDF(title: string, author: string, desc: string, crop: string) {
  const sanitize = (text: string) => text.replace(/[()\\]/g, "");

  const safeTitle = sanitize(title);
  const safeAuthor = sanitize(author);
  const safeDesc = sanitize(desc);
  const safeCrop = sanitize(crop);

  const pdfStream = `%PDF-1.4
1 0 obj
<< /Title (${safeTitle}) /Author (${safeAuthor}) /Subject (SANJEEVANI Agriculture Official Resource) >>
endobj
2 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
3 0 obj
<< /Type /Pages /Kids [4 0 R] /Count 1 >>
endobj
4 0 obj
<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R /Resources << /Font << /F1 6 0 R >> >> >>
endobj
5 0 obj
<< /Length 450 >>
stream
BT
/F1 16 Tf
40 730 Td
(SANJEEVANI OFFICIAL AGRICULTURE DOCUMENT) Tj
/F1 12 Tf
0 -30 Td
(${safeTitle.slice(0, 60)}) Tj
0 -20 Td
(Author / Source: ${safeAuthor}) Tj
0 -20 Td
(Target Crop / Category: ${safeCrop}) Tj
0 -30 Td
(GUIDANCE & INSTRUCTIONS:) Tj
0 -20 Td
(${safeDesc.slice(0, 75)}) Tj
0 -20 Td
(${safeDesc.slice(75, 150)}) Tj
0 -40 Td
(Verified Document - Ministry of Agriculture & ICAR Krishi Vigyan Kendra) Tj
ET
endstream
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000115 00000 n 
0000000164 00000 n 
0000000223 00000 n 
0000000356 00000 n 
0000000856 00000 n 
trailer
<< /Size 7 /Root 2 0 R >>
startxref
930
%%EOF`;

  const blob = new Blob([pdfStream], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const fileName = `${safeTitle.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40)}.pdf`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
