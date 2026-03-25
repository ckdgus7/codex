# Notice List Generator

Figma Design 파일에서 실행하면 현재 React 공지사항 목록 화면을 기준으로 다음을 생성합니다.

- `Notice List / Desktop` 메인 프레임
- `SearchFilter`, `DataTable`, `Pagination` 구조
- `Button`, `Input`, `PaginationButton` 컴포넌트/변형
- Typography, Color, Spacing 토큰 샘플
- `Page > Layout > Components > Styles > Assets` 레이어 구조

## Run

1. Figma Desktop 또는 Web에서 Design 파일을 엽니다.
2. `Plugins > Development > Import plugin from manifest...`를 선택합니다.
3. [manifest.json](/c:/projects/codex/github_codex/figma/notice-list-generator/manifest.json)을 선택합니다.
4. 플러그인을 실행합니다.

## Files

- [manifest.json](/c:/projects/codex/github_codex/figma/notice-list-generator/manifest.json)
- [code.js](/c:/projects/codex/github_codex/figma/notice-list-generator/code.js)
- [README.md](/c:/projects/codex/github_codex/figma/notice-list-generator/README.md)

## Notes

- 폰트는 `Pretendard`를 우선 사용하고, 없으면 `Inter`로 대체합니다.
- 현재 화면에서 제외 요청한 좌측 메뉴, 상단 MDI, pageHeader는 생성하지 않습니다.
- Figma MCP가 write API를 제공하지 않아, 플러그인 실행 방식으로 대체했습니다.
