export function GET() {
  const body = `User-Agent: *
Allow: /

Sitemap: https://eitc.fazr.co.kr/sitemap.xml

#DaumWebMasterTool:8aabd0e8890c37e205afb9aa99bd0fd448aced4e8d548a006b0b4f02661db12b:nSYtUgyINYWMlHzlf2FO4Q==
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
