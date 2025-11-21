Hussein Experience Lab – Interactive Portfolio
------------------------------------------------
A modern, fast, and fully interactive single-page portfolio showcasing professional experience, skills, case studies, and project highlights.

FEATURES
- Light & Dark Themes with persistent state.
- Arabic & English support with full reload for accurate rendering.
- Data-driven structure inside data/resume-data.js.
- Modern animations respecting OS motion settings.
- Interactive contact form with language-specific responses.
- Full RTL support and clean typography.

RUNNING LOCALLY
1. Open the Protofilo folder.
2. Run index.html directly.

Optional lightweight servers:
npx serve
or Live Server in VS Code.

CUSTOMIZING CONTENT
- All content in data/resume-data.js under ar and en objects.
- Update hero, stats, experiences, caseStudies, copy.sections, contact.form.
- Update asset paths when replacing CV or profile image.

LANGUAGE SWITCHING
- Stored in localStorage under: proto-lang
- Language change triggers a full reload.

FUTURE-FRIENDLY DESIGN
- ES Modules
- Clean structure
- Ready for migration to React, Vite, Next.js, etc.

AUTHOR
Hussein – Software Engineer (ASP.NET, EF, SQL Server, DevExpress, Flutter, PHP)
