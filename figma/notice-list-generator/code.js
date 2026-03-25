const PAGE_WIDTH = 1200;
const GRID_MARGIN = 120;
const GRID_GUTTER = 24;
const CONTENT_WIDTH = PAGE_WIDTH - GRID_MARGIN * 2;

const COLORS = {
  primary500: "5B5BD6",
  primary600: "4B4BC4",
  neutral900: "1F2937",
  neutral700: "4B5563",
  neutral500: "9CA3AF",
  borderDefault: "E5E7EB",
  borderStrong: "D0D5DD",
  backgroundPage: "F5F6F8",
  surfaceContainer: "FFFFFF",
  surfaceSubtle: "F8F9FC",
  surfaceMuted: "F3F4F6",
  rowHover: "F9FAFB",
  rowSelected: "EEF2FF",
  danger50: "FEF3F2",
  danger500: "F04438"
};

const TYPOGRAPHY = {
  title: { size: 28, lineHeight: 40 },
  sectionTitle: { size: 20, lineHeight: 28 },
  body: { size: 14, lineHeight: 20 },
  caption: { size: 12, lineHeight: 18 }
};

const SPACING = [4, 8, 12, 16, 24, 32];

const TABLE_COLUMNS = [
  { label: "번호", width: 72, align: "CENTER" },
  { label: "구분", width: 96, align: "CENTER" },
  { label: "제목", width: "FILL", align: "LEFT" },
  { label: "작성자", width: 96, align: "CENTER" },
  { label: "게시일", width: 152, align: "CENTER" },
  { label: "조회수", width: 88, align: "CENTER" }
];

const NOTICE_ROWS = [
  { no: "30", category: "공통", title: "AI DevOps 시스템 안내입니다.", isNew: true, author: "Admin", date: "2026-03-01 10:00", views: "312" },
  { no: "29", category: "공통", title: "2026년 상반기 시스템 점검 일정 안내", isNew: false, author: "Admin", date: "2026-02-28 09:30", views: "254" },
  { no: "28", category: "업무", title: "신규 기능 업데이트 안내 (v2.5.0)", isNew: false, author: "김개발", date: "2026-02-27 15:00", views: "189" },
  { no: "27", category: "공통", title: "보안 정책 변경 사항 공지", isNew: true, author: "Admin", date: "2026-02-26 11:00", views: "421" },
  { no: "26", category: "업무", title: "개발 환경 설정 가이드 업데이트", isNew: false, author: "이운영", date: "2026-02-25 14:30", views: "167" },
  { no: "25", category: "서비스", title: "2월 정기 배포 완료 안내", isNew: false, author: "박배포", date: "2026-02-24 18:00", views: "134" }
];

async function main() {
  const fonts = await loadFonts();
  const textStyles = createTextStyles(fonts);
  createColorStyles();
  createSpacingVariables();

  const page = figma.currentPage;
  const root = createFrame("Page", "VERTICAL", 40);
  root.x = 160;
  root.y = 160;
  root.primaryAxisSizingMode = "AUTO";
  root.counterAxisSizingMode = "AUTO";
  root.fills = [];

  const layoutFrame = createFrame("Layout", "VERTICAL", 24);
  layoutFrame.fills = [];
  const componentsFrame = createFrame("Components", "VERTICAL", 24);
  componentsFrame.fills = [];
  const stylesFrame = createFrame("Styles", "VERTICAL", 24);
  stylesFrame.fills = [];
  const assetsFrame = createFrame("Assets", "VERTICAL", 24);
  assetsFrame.fills = [];

  const pageDesign = buildNoticePage(textStyles, fonts);
  layoutFrame.appendChild(pageDesign);

  const componentNodes = buildComponentLibrary(textStyles, fonts);
  componentNodes.forEach((node) => componentsFrame.appendChild(node));

  const styleNodes = buildStyleShowcase(textStyles, fonts);
  styleNodes.forEach((node) => stylesFrame.appendChild(node));

  const assetNote = createTokenCard("asset/notes", ["Assets are intentionally empty for this screen."]);
  assetsFrame.appendChild(assetNote);

  root.appendChild(layoutFrame);
  root.appendChild(componentsFrame);
  root.appendChild(stylesFrame);
  root.appendChild(assetsFrame);
  page.appendChild(root);

  figma.currentPage.selection = [pageDesign];
  figma.viewport.scrollAndZoomIntoView([pageDesign]);
  figma.closePlugin("Notice List / Desktop design generated.");
}

function buildNoticePage(textStyles, fonts) {
  const pageFrame = createFrame("Notice List / Desktop", "VERTICAL", 24);
  pageFrame.resizeWithoutConstraints(PAGE_WIDTH, 100);
  pageFrame.primaryAxisSizingMode = "AUTO";
  pageFrame.counterAxisSizingMode = "FIXED";
  pageFrame.paddingTop = 40;
  pageFrame.paddingBottom = 40;
  pageFrame.paddingLeft = 0;
  pageFrame.paddingRight = 0;
  pageFrame.cornerRadius = 0;
  pageFrame.fills = [solidPaint(COLORS.backgroundPage)];
  pageFrame.layoutGrids = [{
    pattern: "COLUMNS",
    sectionSize: 1,
    visible: true,
    color: { r: 91 / 255, g: 91 / 255, b: 214 / 255, a: 0.08 },
    alignment: "STRETCH",
    count: 12,
    gutterSize: GRID_GUTTER,
    offset: GRID_MARGIN
  }];

  const content = createFrame("layout/content", "VERTICAL", 24);
  content.resizeWithoutConstraints(CONTENT_WIDTH, 100);
  content.primaryAxisSizingMode = "AUTO";
  content.counterAxisSizingMode = "FIXED";
  content.paddingTop = 0;
  content.paddingBottom = 0;
  content.paddingLeft = 0;
  content.paddingRight = 0;
  content.fills = [];

  const searchSection = createFrame("layout/search-filter", "VERTICAL", 16);
  searchSection.fills = [];
  searchSection.counterAxisSizingMode = "FIXED";
  searchSection.resizeWithoutConstraints(CONTENT_WIDTH, 100);
  searchSection.appendChild(createTextNode("Search Filter Section", textStyles.sectionTitle, fonts.semibold, COLORS.neutral900));
  searchSection.appendChild(buildSearchFilter(textStyles, fonts));

  const tableSection = createFrame("layout/notice-table", "VERTICAL", 16);
  tableSection.fills = [];
  tableSection.counterAxisSizingMode = "FIXED";
  tableSection.resizeWithoutConstraints(CONTENT_WIDTH, 100);
  tableSection.appendChild(createTextNode("Notice Table Section", textStyles.sectionTitle, fonts.semibold, COLORS.neutral900));
  tableSection.appendChild(buildNoticeTable(textStyles, fonts));

  const paginationSection = createFrame("layout/pagination", "VERTICAL", 16);
  paginationSection.fills = [];
  paginationSection.counterAxisSizingMode = "FIXED";
  paginationSection.resizeWithoutConstraints(CONTENT_WIDTH, 100);
  paginationSection.appendChild(createTextNode("Pagination Section", textStyles.sectionTitle, fonts.semibold, COLORS.neutral900));
  paginationSection.appendChild(buildPaginationBar(textStyles, fonts));

  content.appendChild(searchSection);
  content.appendChild(tableSection);
  content.appendChild(paginationSection);
  pageFrame.appendChild(content);
  return pageFrame;
}

function buildSearchFilter(textStyles, fonts) {
  const container = createSurfaceFrame("component/SearchFilter", 12, 24);
  container.counterAxisSizingMode = "FIXED";
  container.resizeWithoutConstraints(CONTENT_WIDTH, 100);

  const row = createFrame("search-filter/row", "HORIZONTAL", 12);
  row.primaryAxisSizingMode = "AUTO";
  row.counterAxisSizingMode = "AUTO";
  row.fills = [];

  row.appendChild(buildSelectField("구분", 140, textStyles, fonts));
  row.appendChild(buildSelectField("전체", 140, textStyles, fonts));

  const input = buildInputField("검색어를 입력하세요.", "0/20", 0, textStyles, fonts);
  input.layoutGrow = 1;
  row.appendChild(input);

  row.appendChild(buildButton("검색", "secondary", "default", textStyles, fonts, 84, 40));
  container.appendChild(row);
  return container;
}

function buildNoticeTable(textStyles, fonts) {
  const section = createSurfaceFrame("component/DataTable", 16, 0);
  section.counterAxisSizingMode = "FIXED";
  section.resizeWithoutConstraints(CONTENT_WIDTH, 100);

  const topBar = createFrame("table/topbar", "HORIZONTAL", 16);
  topBar.paddingTop = 16;
  topBar.paddingBottom = 16;
  topBar.paddingLeft = 16;
  topBar.paddingRight = 16;
  topBar.counterAxisSizingMode = "AUTO";
  topBar.primaryAxisSizingMode = "FIXED";
  topBar.resizeWithoutConstraints(CONTENT_WIDTH, 56);
  topBar.fills = [];

  const totalBadge = createBadge("총 30개", fonts, COLORS.neutral700);
  const tableMeta = createFrame("table/meta", "HORIZONTAL", 12);
  tableMeta.fills = [];
  tableMeta.layoutAlign = "STRETCH";
  tableMeta.layoutGrow = 1;
  const spacer = createFrame("table/meta-spacer", "HORIZONTAL", 0);
  spacer.fills = [];
  spacer.layoutGrow = 1;
  spacer.primaryAxisSizingMode = "AUTO";
  spacer.counterAxisSizingMode = "AUTO";
  const itemInfo = createTextNode("Items per page: 10   1-10 of 30", textStyles.body, fonts.regular, COLORS.neutral500);
  tableMeta.appendChild(spacer);
  tableMeta.appendChild(itemInfo);

  topBar.appendChild(totalBadge);
  topBar.appendChild(tableMeta);
  section.appendChild(topBar);

  const table = createFrame("table", "VERTICAL", 0);
  table.counterAxisSizingMode = "FIXED";
  table.resizeWithoutConstraints(CONTENT_WIDTH, 100);
  table.strokes = [solidPaint(COLORS.borderDefault)];
  table.strokeTopWeight = 1;
  table.strokeBottomWeight = 1;
  table.strokeLeftWeight = 1;
  table.strokeRightWeight = 1;
  table.cornerRadius = 12;
  table.clipsContent = true;
  table.fills = [solidPaint(COLORS.surfaceContainer)];

  table.appendChild(buildTableHeader(textStyles, fonts));
  NOTICE_ROWS.forEach((rowData, index) => {
    const state = index === 2 ? "selected" : "default";
    table.appendChild(buildTableRow(rowData, state, textStyles, fonts));
  });

  const emptyState = createFrame("table/empty-state", "HORIZONTAL", 8);
  emptyState.primaryAxisSizingMode = "FIXED";
  emptyState.counterAxisSizingMode = "FIXED";
  emptyState.resizeWithoutConstraints(CONTENT_WIDTH, 88);
  emptyState.paddingTop = 24;
  emptyState.paddingBottom = 24;
  emptyState.paddingLeft = 16;
  emptyState.paddingRight = 16;
  emptyState.fills = [solidPaint(COLORS.surfaceContainer)];
  emptyState.strokes = [solidPaint(COLORS.borderDefault)];
  emptyState.strokeTopWeight = 1;
  emptyState.strokeBottomWeight = 0;
  emptyState.strokeLeftWeight = 0;
  emptyState.strokeRightWeight = 0;
  const emptyText = createTextNode("데이터가 없습니다.", textStyles.body, fonts.regular, COLORS.neutral500);
  emptyText.layoutAlign = "STRETCH";
  emptyText.textAlignHorizontal = "CENTER";
  emptyState.appendChild(emptyText);

  section.appendChild(table);
  section.appendChild(emptyState);
  return section;
}

function buildTableHeader(textStyles, fonts) {
  const row = createFrame("table/header-row", "HORIZONTAL", 0);
  row.primaryAxisSizingMode = "FIXED";
  row.counterAxisSizingMode = "FIXED";
  row.resizeWithoutConstraints(CONTENT_WIDTH, 56);
  row.fills = [solidPaint(COLORS.surfaceMuted)];

  TABLE_COLUMNS.forEach((column, index) => {
    const cell = createTableCell(`header/${column.label}`, column.width, "HORIZONTAL");
    cell.paddingLeft = 16;
    cell.paddingRight = 16;
    cell.paddingTop = 0;
    cell.paddingBottom = 0;
    cell.strokes = [solidPaint(COLORS.borderDefault)];
    cell.strokeTopWeight = 0;
    cell.strokeBottomWeight = 1;
    cell.strokeLeftWeight = index === 0 ? 0 : 1;
    cell.strokeRightWeight = 0;
    const label = createTextNode(column.label, textStyles.tableHeader, fonts.medium, COLORS.neutral700);
    label.textAlignHorizontal = column.align;
    label.layoutAlign = "CENTER";
    label.layoutGrow = column.width === "FILL" ? 1 : 0;
    cell.appendChild(label);
    row.appendChild(cell);
  });

  return row;
}

function buildTableRow(data, state, textStyles, fonts) {
  const row = createFrame(`table/data-row[state=${state}]`, "HORIZONTAL", 0);
  row.primaryAxisSizingMode = "FIXED";
  row.counterAxisSizingMode = "FIXED";
  row.resizeWithoutConstraints(CONTENT_WIDTH, 56);
  row.fills = [solidPaint(state === "selected" ? COLORS.rowSelected : state === "hover" ? COLORS.rowHover : COLORS.surfaceContainer)];

  const values = [data.no, data.category, data.title, data.author, data.date, data.views];
  TABLE_COLUMNS.forEach((column, index) => {
    const cell = createTableCell(`row/${column.label}`, column.width, "HORIZONTAL");
    cell.paddingLeft = 16;
    cell.paddingRight = 16;
    cell.strokes = [solidPaint(COLORS.borderDefault)];
    cell.strokeTopWeight = 0;
    cell.strokeBottomWeight = 1;
    cell.strokeLeftWeight = index === 0 ? 0 : 1;
    cell.strokeRightWeight = 0;
    if (column.label === "제목") {
      const titleWrap = createFrame("row/title-wrap", "HORIZONTAL", 8);
      titleWrap.fills = [];
      titleWrap.layoutGrow = 1;
      if (data.isNew) {
        titleWrap.appendChild(createNewBadge(fonts));
      }
      const title = createTextNode(values[index], textStyles.tableBody, fonts.regular, COLORS.neutral900);
      title.layoutGrow = 1;
      titleWrap.appendChild(title);
      cell.appendChild(titleWrap);
    } else {
      const text = createTextNode(values[index], textStyles.tableBody, fonts.regular, COLORS.neutral900);
      text.textAlignHorizontal = column.align;
      cell.appendChild(text);
    }
    row.appendChild(cell);
  });
  return row;
}

function buildPaginationBar(textStyles, fonts) {
  const container = createSurfaceFrame("component/Pagination", 8, 16);
  container.primaryAxisSizingMode = "AUTO";
  container.counterAxisSizingMode = "AUTO";

  container.appendChild(buildPaginationButton("Prev", "disabled", textStyles, fonts));
  [1, 2, 3].forEach((pageNo) => {
    container.appendChild(buildPaginationButton(String(pageNo), pageNo === 1 ? "active" : "default", textStyles, fonts));
  });
  container.appendChild(buildPaginationButton("Next", "default", textStyles, fonts));
  return container;
}

function buildComponentLibrary(textStyles, fonts) {
  const nodes = [];

  const buttonPrimary = componentFromNode(buildButton("검색", "primary", "default", textStyles, fonts, 84, 40), "Button, type=primary, state=default");
  const buttonSecondary = componentFromNode(buildButton("검색", "secondary", "default", textStyles, fonts, 84, 40), "Button, type=secondary, state=default");
  const buttonSet = figma.combineAsVariants([buttonPrimary, buttonSecondary], figma.currentPage);
  buttonSet.name = "Button";
  nodes.push(buttonSet);

  const pageDefault = componentFromNode(buildPaginationButton("2", "default", textStyles, fonts), "PaginationButton, state=default");
  const pageHover = componentFromNode(buildPaginationButton("2", "hover", textStyles, fonts), "PaginationButton, state=hover");
  const pageActive = componentFromNode(buildPaginationButton("2", "active", textStyles, fonts), "PaginationButton, state=active");
  const pageDisabled = componentFromNode(buildPaginationButton("2", "disabled", textStyles, fonts), "PaginationButton, state=disabled");
  const pageSet = figma.combineAsVariants([pageDefault, pageHover, pageActive, pageDisabled], figma.currentPage);
  pageSet.name = "PaginationButton";
  nodes.push(pageSet);

  const inputComponent = componentFromNode(buildInputField("검색어를 입력하세요.", "0/20", 320, textStyles, fonts), "Input");
  nodes.push(inputComponent);

  const searchFilterComponent = componentFromNode(buildSearchFilter(textStyles, fonts), "SearchFilter");
  nodes.push(searchFilterComponent);

  const dataTableComponent = componentFromNode(buildNoticeTable(textStyles, fonts), "DataTable");
  nodes.push(dataTableComponent);

  return nodes;
}

function buildStyleShowcase(textStyles, fonts) {
  const typographyCard = createFrame("styles/typography", "VERTICAL", 12);
  typographyCard.fills = [];
  typographyCard.appendChild(createTextNode("Typography", textStyles.sectionTitle, fonts.semibold, COLORS.neutral900));
  typographyCard.appendChild(createTextNode("Title 28 Bold", textStyles.title, fonts.bold, COLORS.neutral900));
  typographyCard.appendChild(createTextNode("Section Title 20 Semibold", textStyles.sectionTitle, fonts.semibold, COLORS.neutral900));
  typographyCard.appendChild(createTextNode("Body 14 Regular", textStyles.body, fonts.regular, COLORS.neutral700));
  typographyCard.appendChild(createTextNode("Caption 12 Regular", textStyles.caption, fonts.regular, COLORS.neutral500));

  const colorCard = createFrame("styles/color", "VERTICAL", 12);
  colorCard.fills = [];
  colorCard.appendChild(createTextNode("Color Tokens", textStyles.sectionTitle, fonts.semibold, COLORS.neutral900));
  [
    ["Primary/500", COLORS.primary500],
    ["Primary/600", COLORS.primary600],
    ["Neutral/900", COLORS.neutral900],
    ["Neutral/700", COLORS.neutral700],
    ["Border/Default", COLORS.borderDefault],
    ["Background/Page", COLORS.backgroundPage],
    ["Surface/Container", COLORS.surfaceContainer]
  ].forEach(([name, value]) => {
    colorCard.appendChild(createColorSwatch(name, value, textStyles, fonts));
  });

  const spacingCard = createTokenCard("styles/spacing", SPACING.map((value) => `space/${value} = ${value}px`));
  return [typographyCard, colorCard, spacingCard];
}

function buildButton(label, type, state, textStyles, fonts, width, height) {
  const button = createFrame(`button/${type}[${state}]`, "HORIZONTAL", 8);
  button.primaryAxisSizingMode = "FIXED";
  button.counterAxisSizingMode = "FIXED";
  button.resizeWithoutConstraints(width, height);
  button.paddingLeft = 16;
  button.paddingRight = 16;
  button.paddingTop = 0;
  button.paddingBottom = 0;
  button.cornerRadius = 8;
  button.strokes = type === "secondary" ? [solidPaint(COLORS.primary500)] : [];
  button.strokeTopWeight = 1;
  button.strokeBottomWeight = 1;
  button.strokeLeftWeight = 1;
  button.strokeRightWeight = 1;
  button.fills = [solidPaint(resolveButtonFill(type, state))];
  button.opacity = state === "disabled" ? 0.48 : 1;

  const text = createTextNode(label, textStyles.body, fonts.medium, type === "secondary" ? COLORS.primary500 : "FFFFFF");
  text.textAlignHorizontal = "CENTER";
  button.appendChild(text);
  return button;
}

function buildPaginationButton(label, state, textStyles, fonts) {
  const button = createFrame(`pagination/button[${state}]`, "HORIZONTAL", 0);
  button.primaryAxisSizingMode = "FIXED";
  button.counterAxisSizingMode = "FIXED";
  button.resizeWithoutConstraints(36, 36);
  button.paddingLeft = 0;
  button.paddingRight = 0;
  button.paddingTop = 0;
  button.paddingBottom = 0;
  button.cornerRadius = 8;
  button.fills = [solidPaint(state === "active" ? COLORS.primary500 : state === "hover" ? COLORS.surfaceMuted : COLORS.surfaceContainer)];
  button.strokes = [solidPaint(state === "active" ? COLORS.primary500 : COLORS.borderDefault)];
  button.strokeTopWeight = 1;
  button.strokeBottomWeight = 1;
  button.strokeLeftWeight = 1;
  button.strokeRightWeight = 1;
  button.opacity = state === "disabled" ? 0.45 : 1;
  const color = state === "active" ? "FFFFFF" : COLORS.neutral700;
  button.appendChild(createTextNode(label, textStyles.body, fonts.medium, color));
  return button;
}

function buildInputField(placeholder, indicator, width, textStyles, fonts) {
  const wrapper = createFrame("input", "HORIZONTAL", 8);
  wrapper.primaryAxisSizingMode = width > 0 ? "FIXED" : "AUTO";
  wrapper.counterAxisSizingMode = "FIXED";
  wrapper.resizeWithoutConstraints(width > 0 ? width : 320, 40);
  wrapper.paddingLeft = 12;
  wrapper.paddingRight = 12;
  wrapper.paddingTop = 0;
  wrapper.paddingBottom = 0;
  wrapper.cornerRadius = 8;
  wrapper.fills = [solidPaint(COLORS.surfaceContainer)];
  wrapper.strokes = [solidPaint(COLORS.borderDefault)];
  wrapper.strokeTopWeight = 1;
  wrapper.strokeBottomWeight = 1;
  wrapper.strokeLeftWeight = 1;
  wrapper.strokeRightWeight = 1;

  const search = createTextNode("⌕", textStyles.body, fonts.regular, COLORS.neutral500);
  const text = createTextNode(placeholder, textStyles.body, fonts.regular, COLORS.neutral500);
  text.layoutGrow = 1;
  const count = createTextNode(indicator, textStyles.caption, fonts.regular, COLORS.neutral500);

  wrapper.appendChild(search);
  wrapper.appendChild(text);
  wrapper.appendChild(count);
  return wrapper;
}

function buildSelectField(label, width, textStyles, fonts) {
  const field = createFrame(`select/${label}`, "HORIZONTAL", 8);
  field.primaryAxisSizingMode = "FIXED";
  field.counterAxisSizingMode = "FIXED";
  field.resizeWithoutConstraints(width, 40);
  field.paddingLeft = 12;
  field.paddingRight = 12;
  field.cornerRadius = 8;
  field.fills = [solidPaint(COLORS.surfaceContainer)];
  field.strokes = [solidPaint(COLORS.borderDefault)];
  field.strokeTopWeight = 1;
  field.strokeBottomWeight = 1;
  field.strokeLeftWeight = 1;
  field.strokeRightWeight = 1;
  const text = createTextNode(label, textStyles.body, fonts.regular, COLORS.neutral700);
  text.layoutGrow = 1;
  const chevron = createTextNode("⌄", textStyles.body, fonts.regular, COLORS.neutral500);
  field.appendChild(text);
  field.appendChild(chevron);
  return field;
}

function createFrame(name, layoutMode, itemSpacing) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = layoutMode;
  frame.itemSpacing = itemSpacing;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.counterAxisAlignItems = "MIN";
  frame.primaryAxisAlignItems = "MIN";
  frame.paddingTop = 0;
  frame.paddingBottom = 0;
  frame.paddingLeft = 0;
  frame.paddingRight = 0;
  frame.fills = [solidPaint(COLORS.surfaceContainer)];
  frame.strokes = [];
  return frame;
}

function createSurfaceFrame(name, radius, padding) {
  const frame = createFrame(name, "VERTICAL", 16);
  frame.cornerRadius = radius;
  frame.paddingTop = padding;
  frame.paddingBottom = padding;
  frame.paddingLeft = padding;
  frame.paddingRight = padding;
  frame.fills = [solidPaint(COLORS.surfaceContainer)];
  frame.strokes = [solidPaint(COLORS.borderDefault)];
  frame.strokeTopWeight = 1;
  frame.strokeBottomWeight = 1;
  frame.strokeLeftWeight = 1;
  frame.strokeRightWeight = 1;
  return frame;
}

function createTableCell(name, width, layoutMode) {
  const cell = createFrame(name, layoutMode, 0);
  cell.counterAxisSizingMode = "FIXED";
  cell.primaryAxisSizingMode = width === "FILL" ? "AUTO" : "FIXED";
  cell.counterAxisAlignItems = "CENTER";
  cell.primaryAxisAlignItems = "CENTER";
  cell.resizeWithoutConstraints(width === "FILL" ? 240 : width, 56);
  if (width === "FILL") {
    cell.layoutGrow = 1;
  }
  cell.fills = [];
  return cell;
}

function createTextNode(characters, style, fontName, colorHex) {
  const text = figma.createText();
  text.fontName = fontName;
  text.characters = characters;
  text.fontSize = style.fontSize;
  text.lineHeight = { value: style.lineHeight, unit: "PIXELS" };
  text.fills = [solidPaint(colorHex)];
  return text;
}

function createTextStyles(fonts) {
  const title = figma.createTextStyle();
  title.name = "Title/28 Bold";
  title.fontName = fonts.bold;
  title.fontSize = TYPOGRAPHY.title.size;
  title.lineHeight = { value: TYPOGRAPHY.title.lineHeight, unit: "PIXELS" };

  const sectionTitle = figma.createTextStyle();
  sectionTitle.name = "Section Title/20 Semibold";
  sectionTitle.fontName = fonts.semibold;
  sectionTitle.fontSize = TYPOGRAPHY.sectionTitle.size;
  sectionTitle.lineHeight = { value: TYPOGRAPHY.sectionTitle.lineHeight, unit: "PIXELS" };

  const body = figma.createTextStyle();
  body.name = "Body/14 Regular";
  body.fontName = fonts.regular;
  body.fontSize = TYPOGRAPHY.body.size;
  body.lineHeight = { value: TYPOGRAPHY.body.lineHeight, unit: "PIXELS" };

  const caption = figma.createTextStyle();
  caption.name = "Caption/12 Regular";
  caption.fontName = fonts.regular;
  caption.fontSize = TYPOGRAPHY.caption.size;
  caption.lineHeight = { value: TYPOGRAPHY.caption.lineHeight, unit: "PIXELS" };

  const tableHeader = figma.createTextStyle();
  tableHeader.name = "Table Header/14 Medium";
  tableHeader.fontName = fonts.medium;
  tableHeader.fontSize = TYPOGRAPHY.body.size;
  tableHeader.lineHeight = { value: TYPOGRAPHY.body.lineHeight, unit: "PIXELS" };

  const tableBody = figma.createTextStyle();
  tableBody.name = "Table Body/14 Regular";
  tableBody.fontName = fonts.regular;
  tableBody.fontSize = TYPOGRAPHY.body.size;
  tableBody.lineHeight = { value: TYPOGRAPHY.body.lineHeight, unit: "PIXELS" };

  return {
    title,
    sectionTitle,
    body,
    caption,
    tableHeader,
    tableBody
  };
}

function createColorStyles() {
  [
    ["Primary/500", COLORS.primary500],
    ["Primary/600", COLORS.primary600],
    ["Neutral/900", COLORS.neutral900],
    ["Neutral/700", COLORS.neutral700],
    ["Neutral/500", COLORS.neutral500],
    ["Border/Default", COLORS.borderDefault],
    ["Background/Page", COLORS.backgroundPage],
    ["Surface/Container", COLORS.surfaceContainer],
    ["Surface/Subtle", COLORS.surfaceSubtle]
  ].forEach(([name, hex]) => {
    const style = figma.createPaintStyle();
    style.name = name;
    style.paints = [solidPaint(hex)];
  });
}

function createSpacingVariables() {
  if (!figma.variables || !figma.variables.createVariableCollection) {
    return;
  }

  const collection = figma.variables.createVariableCollection("Spacing");
  const modeId = collection.modes[0].modeId;
  SPACING.forEach((value) => {
    const variable = figma.variables.createVariable(`space/${value}`, collection, "FLOAT");
    variable.setValueForMode(modeId, value);
  });
}

function createBadge(label, fonts, colorHex) {
  const badge = createFrame("table/total-badge", "HORIZONTAL", 0);
  badge.primaryAxisSizingMode = "AUTO";
  badge.counterAxisSizingMode = "FIXED";
  badge.resizeWithoutConstraints(72, 28);
  badge.paddingLeft = 12;
  badge.paddingRight = 12;
  badge.cornerRadius = 14;
  badge.fills = [solidPaint("FAFAFA")];
  badge.strokes = [solidPaint(COLORS.borderStrong)];
  badge.strokeTopWeight = 1;
  badge.strokeBottomWeight = 1;
  badge.strokeLeftWeight = 1;
  badge.strokeRightWeight = 1;
  badge.appendChild(createTextNode(label, { fontSize: 14, lineHeight: 20 }, fonts.medium, colorHex));
  return badge;
}

function createNewBadge(fonts) {
  const badge = createFrame("row/new-badge", "HORIZONTAL", 0);
  badge.primaryAxisSizingMode = "AUTO";
  badge.counterAxisSizingMode = "AUTO";
  badge.paddingLeft = 6;
  badge.paddingRight = 6;
  badge.paddingTop = 2;
  badge.paddingBottom = 2;
  badge.cornerRadius = 4;
  badge.fills = [solidPaint(COLORS.danger50)];
  badge.strokes = [solidPaint(COLORS.danger500)];
  badge.strokeTopWeight = 1;
  badge.strokeBottomWeight = 1;
  badge.strokeLeftWeight = 1;
  badge.strokeRightWeight = 1;
  badge.appendChild(createTextNode("NEW", { fontSize: 11, lineHeight: 16 }, fonts.bold, COLORS.danger500));
  return badge;
}

function createColorSwatch(name, hex, textStyles, fonts) {
  const row = createFrame(`swatch/${name}`, "HORIZONTAL", 12);
  row.fills = [];
  const chip = figma.createRectangle();
  chip.name = `${name}/chip`;
  chip.resize(48, 48);
  chip.cornerRadius = 12;
  chip.fills = [solidPaint(hex)];
  chip.strokes = [solidPaint(COLORS.borderDefault)];
  row.appendChild(chip);
  const label = createFrame(`${name}/label`, "VERTICAL", 4);
  label.fills = [];
  label.appendChild(createTextNode(name, textStyles.body, fonts.medium, COLORS.neutral900));
  label.appendChild(createTextNode(`#${hex}`, textStyles.caption, fonts.regular, COLORS.neutral500));
  row.appendChild(label);
  return row;
}

function createTokenCard(name, lines) {
  const frame = createSurfaceFrame(name, 12, 16);
  frame.itemSpacing = 8;
  frame.resizeWithoutConstraints(480, 100);
  lines.forEach((line) => {
    const text = figma.createText();
    text.characters = line;
    text.fontName = { family: "Inter", style: "Regular" };
    text.fontSize = 14;
    text.lineHeight = { value: 20, unit: "PIXELS" };
    text.fills = [solidPaint(COLORS.neutral700)];
    frame.appendChild(text);
  });
  return frame;
}

function componentFromNode(node, name) {
  const component = figma.createComponent();
  component.name = name;
  component.resizeWithoutConstraints(node.width, node.height);
  if ("layoutMode" in node) {
    component.layoutMode = node.layoutMode;
    component.itemSpacing = node.itemSpacing;
    component.primaryAxisSizingMode = node.primaryAxisSizingMode;
    component.counterAxisSizingMode = node.counterAxisSizingMode;
    component.counterAxisAlignItems = node.counterAxisAlignItems;
    component.primaryAxisAlignItems = node.primaryAxisAlignItems;
    component.paddingTop = node.paddingTop;
    component.paddingBottom = node.paddingBottom;
    component.paddingLeft = node.paddingLeft;
    component.paddingRight = node.paddingRight;
    component.cornerRadius = node.cornerRadius;
    component.fills = node.fills;
    component.strokes = node.strokes;
    component.strokeTopWeight = node.strokeTopWeight;
    component.strokeBottomWeight = node.strokeBottomWeight;
    component.strokeLeftWeight = node.strokeLeftWeight;
    component.strokeRightWeight = node.strokeRightWeight;
  }
  node.children.slice().forEach((child) => component.appendChild(child.clone()));
  return component;
}

function resolveButtonFill(type, state) {
  if (type === "secondary") {
    return state === "hover" ? COLORS.surfaceMuted : COLORS.surfaceContainer;
  }
  if (state === "hover") {
    return COLORS.primary600;
  }
  return COLORS.primary500;
}

async function loadFonts() {
  const availableFonts = await figma.listAvailableFontsAsync();
  const pick = (style, fallbackStyle = style) => {
    const pretendard = availableFonts.find((font) => font.fontName.family === "Pretendard" && font.fontName.style === style);
    if (pretendard) return pretendard.fontName;
    const inter = availableFonts.find((font) => font.fontName.family === "Inter" && font.fontName.style === fallbackStyle);
    if (inter) return inter.fontName;
    return availableFonts[0].fontName;
  };

  const fonts = {
    regular: pick("Regular"),
    medium: pick("Medium", "Regular"),
    semibold: pick("SemiBold", "Bold"),
    bold: pick("Bold")
  };

  await figma.loadFontAsync(fonts.regular);
  await figma.loadFontAsync(fonts.medium);
  await figma.loadFontAsync(fonts.semibold);
  await figma.loadFontAsync(fonts.bold);
  await figma.loadFontAsync({ family: "Inter", style: "Regular" }).catch(() => {});
  return fonts;
}

function solidPaint(hex) {
  return {
    type: "SOLID",
    color: hexToRgb(hex)
  };
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const value = parseInt(clean, 16);
  return {
    r: ((value >> 16) & 255) / 255,
    g: ((value >> 8) & 255) / 255,
    b: (value & 255) / 255
  };
}

main().catch((error) => {
  figma.closePlugin(`Failed to generate design: ${error instanceof Error ? error.message : String(error)}`);
});
