export function GET() {
  const body = `User-Agent: *
Allow: /

Sitemap: https://support.fazr.co.kr/sitemap.xml

#DaumWebMasterTool:b979e8fef22bd4b4d035470a8cd2edbce83aa85df7ce7cacae92f59f191e7561:VAuOcEy3Zx2FHdO4eIqg/g==
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
