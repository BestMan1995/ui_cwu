import streamlit as st
import pandas as pd
import time

# ──────────────────────────────────────────────
# 页面配置
# ──────────────────────────────────────────────
st.set_page_config(
    page_title="财务代账AI Agent（私有化版）",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ──────────────────────────────────────────────
# 自定义 CSS 样式
# ──────────────────────────────────────────────
st.markdown("""
<style>
    /* 全局字体 */
    html, body, [class*="css"] {
        font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif;
    }

    /* 顶部状态栏 */
    .top-bar {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        color: #e0e0e0;
        padding: 10px 20px;
        border-radius: 10px;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 18px;
        font-size: 13px;
        flex-wrap: wrap;
    }
    .top-bar .badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: rgba(255,255,255,0.07);
        padding: 3px 10px;
        border-radius: 20px;
        font-size: 12px;
    }
    .top-bar .badge.green { color: #4ade80; }
    .top-bar .badge.blue  { color: #60a5fa; }
    .top-bar .badge.amber { color: #fbbf24; }

    /* 侧边栏任务卡片 */
    .task-card {
        background: #f0f4ff;
        border-left: 4px solid #3b82f6;
        border-radius: 8px;
        padding: 14px;
        margin-bottom: 12px;
    }
    .task-card h4 {
        margin: 0 0 6px 0;
        font-size: 14px;
        color: #1e3a5f;
    }
    .task-card p {
        margin: 2px 0;
        font-size: 12.5px;
        color: #475569;
    }

    /* 侧边栏菜单按钮 */
    .menu-btn {
        display: block;
        width: 100%;
        padding: 10px 14px;
        margin: 4px 0;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        background: #ffffff;
        color: #334155;
        font-size: 14px;
        text-align: left;
        cursor: pointer;
        transition: all .15s;
    }
    .menu-btn:hover {
        background: #eff6ff;
        border-color: #93c5fd;
    }
    .menu-btn.active {
        background: #dbeafe;
        border-color: #3b82f6;
        color: #1d4ed8;
        font-weight: 600;
    }

    /* 待办列表 */
    .todo-item {
        padding: 7px 0;
        border-bottom: 1px dashed #e2e8f0;
        font-size: 13px;
        color: #475569;
    }
    .todo-item:last-child { border-bottom: none; }

    /* 上传区 */
    .upload-zone {
        border: 2px dashed #93c5fd;
        border-radius: 12px;
        background: #f0f7ff;
        padding: 24px;
        text-align: center;
        margin-bottom: 16px;
    }

    /* 统计卡片 */
    .stat-row {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;
    }
    .stat-card {
        flex: 1;
        border-radius: 10px;
        padding: 16px 20px;
        text-align: center;
    }
    .stat-card h2 { margin: 0; font-size: 28px; }
    .stat-card p  { margin: 4px 0 0 0; font-size: 13px; color: #64748b; }
    .stat-success  { background: #ecfdf5; color: #059669; }
    .stat-fail     { background: #fef2f2; color: #dc2626; }
    .stat-conf     { background: #eff6ff; color: #2563eb; }

    /* 问题提示卡片 */
    .issue-card {
        border-radius: 10px;
        padding: 14px 18px;
        margin-bottom: 10px;
    }
    .issue-card.red {
        background: #fef2f2;
        border-left: 4px solid #ef4444;
    }
    .issue-card.yellow {
        background: #fffbeb;
        border-left: 4px solid #f59e0b;
    }
    .issue-card .title {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 4px;
    }
    .issue-card .hint {
        font-size: 12.5px;
        color: #64748b;
    }

    /* 底栏 */
    .bottom-bar {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 12px;
        font-size: 13px;
    }

    /* 隐藏 Streamlit 默认菜单和 footer */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}

    /* 表格行悬浮 */
    .dataframe tbody tr:hover { background: #f0f7ff !important; }

    /* 置信度 badge */
    .conf-high  { color: #16a34a; font-weight: 600; }
    .conf-mid   { color: #d97706; font-weight: 600; }
    .conf-low   { color: #dc2626; font-weight: 600; }
</style>
""", unsafe_allow_html=True)


# ──────────────────────────────────────────────
# 初始化 Session State
# ──────────────────────────────────────────────
if "current_account" not in st.session_state:
    st.session_state.current_account = "A商贸公司（小规模）"
if "parsing" not in st.session_state:
    st.session_state.parsing = False
if "parsed" not in st.session_state:
    st.session_state.parsed = False
if "auto_dedup" not in st.session_state:
    st.session_state.auto_dedup = True
if "field_check" not in st.session_state:
    st.session_state.field_check = True


# ──────────────────────────────────────────────
# 顶部标题栏
# ──────────────────────────────────────────────
header_cols = st.columns([6, 3, 1])
with header_cols[0]:
    st.markdown("## 📊 财务代账AI Agent（私有化版）")
with header_cols[1]:
    st.selectbox(
        "当前账套",
        ["A商贸公司（小规模）", "B科技公司（一般纳税人）", "C餐饮公司（小规模）"],
        label_visibility="collapsed",
    )
with header_cols[2]:
    st.button("🔔", help="通知中心")

# 状态栏
st.markdown("""
<div class="top-bar">
    <span class="badge green">🟢 本地加密环境</span>
    <span class="badge blue">● 模型运行中（Qwen2-7B）</span>
    <span class="badge green">🔒 数据未上传公网</span>
    <span class="badge amber">📚 知识库规则库版本：V1.0</span>
</div>
""", unsafe_allow_html=True)


# ──────────────────────────────────────────────
# 侧边栏
# ──────────────────────────────────────────────
with st.sidebar:
    st.markdown("### 🔧 功能菜单")
    st.divider()

    # ── Agent 任务流 ──
    st.markdown("#### 🤖 Agent 任务流")
    st.markdown("""
    <div class="task-card">
        <h4>当前任务：发票解析校验</h4>
        <p>逻辑校验：匹配OCR规则 8 条</p>
        <p>执行进度：▰▰▰▰▰▰▰▰▰▰ <b>100%</b></p>
    </div>
    """, unsafe_allow_html=True)

    # ── 功能菜单 ──
    menu_items = [
        ("📄 发票解析", "自动去重 / 字段校验"),
        ("✏️ 自动分录", "智能生成会计分录"),
        ("💰 税种计算", "增值税 / 附加税 / 所得税"),
        ("📈 报表生成", "利润表 / 资产负债表"),
        ("⚠️ 风险预警", "税负异常 / 发票风险"),
    ]

    selected_menu = st.radio(
        "功能导航",
        [item[0] for item in menu_items],
        index=0,
        label_visibility="collapsed",
    )

    # 显示当前选中功能的描述
    for item_name, item_desc in menu_items:
        if item_name == selected_menu:
            st.caption(f"💡 {item_desc}")
            break

    st.divider()

    # ── 快捷操作：今日待办 ──
    st.markdown("#### 📋 快捷操作")
    with st.expander("📝 今日待办 (3)", expanded=True):
        st.markdown("""
        <div class="todo-item">1. A公司 3月报表生成</div>
        <div class="todo-item">2. B公司 税负异常检测</div>
        <div class="todo-item">3. C公司 发票分录保存</div>
        """, unsafe_allow_html=True)

    st.divider()

    # ── 技术支持 ──
    st.markdown("#### 📞 技术支持")
    st.info("**400-xxxx-xxxx**\n\n工作日 9:00 - 18:00")


# ──────────────────────────────────────────────
# 主内容区
# ──────────────────────────────────────────────

# Tab 区域
tab_invoice, tab_log = st.tabs(["📄 发票智能解析", "📝 操作日志"])

with tab_invoice:

    # 安全提示
    st.markdown(
        '<div style="text-align:right;font-size:12px;color:#64748b;margin-bottom:8px;">'
        '🛡️ 仅限本地局域网使用</div>',
        unsafe_allow_html=True,
    )

    # ════════════════════════════════
    # 📤 发票上传区
    # ════════════════════════════════
    st.markdown("### 📤 发票上传区")

    uploaded_files = st.file_uploader(
        "选择发票文件（支持 JPG / PNG / PDF，可批量上传）",
        type=["jpg", "jpeg", "png", "pdf"],
        accept_multiple_files=True,
    )

    if uploaded_files:
        encrypted_count = sum(1 for f in uploaded_files if f.name.endswith(".pdf"))
        st.success(f"已选：**{len(uploaded_files)}** 个文件（其中 {encrypted_count} 个 PDF 文件）")

    # 选项行
    opt_cols = st.columns([2, 2, 3, 3])
    with opt_cols[0]:
        auto_dedup = st.checkbox("☑ 自动去重", value=True)
    with opt_cols[1]:
        field_check = st.checkbox("☑ 字段校验", value=True)
    with opt_cols[2]:
        parse_btn = st.button("🔵 开始解析", type="primary", use_container_width=True)
    with opt_cols[3]:
        st.empty()

    # 模拟解析
    if parse_btn:
        st.session_state.parsing = True
        progress_bar = st.progress(0, text="正在解析发票...")
        for i in range(100):
            time.sleep(0.015)
            progress_bar.progress(i + 1, text=f"正在解析发票... {i + 1}%")
        st.session_state.parsing = False
        st.session_state.parsed = True
        st.rerun()

    st.divider()

    # ════════════════════════════════
    # 📊 解析结果区
    # ════════════════════════════════
    st.markdown("### 📊 解析结果区")

    # 统计卡片
    st.markdown("""
    <div class="stat-row">
        <div class="stat-card stat-success">
            <h2>8</h2>
            <p>✅ 解析成功</p>
        </div>
        <div class="stat-card stat-fail">
            <h2>2</h2>
            <p>❌ 解析失败</p>
        </div>
        <div class="stat-card stat-conf">
            <h2>92%</h2>
            <p>📊 平均置信度</p>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # 解析结果表格
    df = pd.DataFrame({
        "状态": ["✅", "✅", "✅", "✅", "✅", "✅", "✅", "✅", "❌", "❌"],
        "发票类型": [
            "增值税普通发票", "餐饮发票", "增值税普通发票", "交通费发票",
            "办公用品发票", "增值税专用发票", "通讯费发票", "增值税普通发票",
            "【失败】PDF加密件", "【失败】模糊扫描件",
        ],
        "开票日期": [
            "2026-02-20", "2026-02-19", "2026-02-18", "2026-02-17",
            "2026-02-16", "2026-02-15", "2026-02-14", "2026-02-13",
            "2026-02-18", "2026-02-17",
        ],
        "金额(元)": [
            1000.00, 500.00, 2300.00, 150.00,
            880.00, 5600.00, 200.00, 1350.00,
            None, None,
        ],
        "税率(%)": [
            3.0, 6.0, 3.0, 3.0,
            13.0, 13.0, 6.0, 3.0,
            None, None,
        ],
        "AI置信度": [
            "98%", "88% 🟡", "95%", "97%",
            "93%", "96%", "91%", "94%",
            "0% 🔴", "25% 🟡",
        ],
    })

    st.dataframe(
        df,
        use_container_width=True,
        hide_index=True,
        height=390,
        column_config={
            "状态": st.column_config.TextColumn("状态", width="small"),
            "发票类型": st.column_config.TextColumn("发票类型", width="medium"),
            "开票日期": st.column_config.TextColumn("开票日期", width="small"),
            "金额(元)": st.column_config.NumberColumn("金额(元)", format="%.2f"),
            "税率(%)": st.column_config.NumberColumn("税率(%)", format="%.1f"),
            "AI置信度": st.column_config.TextColumn("AI置信度", width="small"),
        },
    )

    # 操作按钮
    btn_cols = st.columns(4)
    with btn_cols[0]:
        st.button("✏️ 编辑", use_container_width=True)
    with btn_cols[1]:
        st.button("💾 保存", use_container_width=True)
    with btn_cols[2]:
        st.button("📥 导出", use_container_width=True)
    with btn_cols[3]:
        st.button("🗑️ 删除", use_container_width=True, type="secondary")

    st.divider()

    # ════════════════════════════════
    # 📌 问题提示与AI联调区
    # ════════════════════════════════
    st.markdown("### 📌 问题提示与AI联调区")

    # 问题 1：PDF 加密件
    st.markdown("""
    <div class="issue-card red">
        <div class="title">🔴 【PDF加密件】解析失败：文件受密码保护</div>
        <div class="hint">📋 历史解决方案：税号后六位 / 法人手机号后六位</div>
    </div>
    """, unsafe_allow_html=True)

    col_ai1, col_space1 = st.columns([1, 3])
    with col_ai1:
        ask_ai_1 = st.button("💬 问问AI怎么修", key="ai_fix_1")

    if ask_ai_1:
        with st.chat_message("assistant", avatar="🤖"):
            st.markdown("""
**PDF加密件处理建议：**

1. 尝试使用常见密码：税号后六位、法人手机号后六位、开票日期
2. 联系开票方获取密码或索要无密码版本
3. 使用本地 PDF 密码恢复工具（仅限合法用途）
4. 如有纸质版，可高清扫描后重新上传
            """)

    # 问题 2：模糊扫描件
    st.markdown("""
    <div class="issue-card yellow">
        <div class="title">🟡 【模糊扫描件】置信度低：票面信息模糊</div>
        <div class="hint">📋 历史解决方案：高清重扫 / 图片增强处理</div>
    </div>
    """, unsafe_allow_html=True)

    col_ai2, col_space2 = st.columns([1, 3])
    with col_ai2:
        ask_ai_2 = st.button("💬 问问AI怎么修", key="ai_fix_2")

    if ask_ai_2:
        with st.chat_message("assistant", avatar="🤖"):
            st.markdown("""
**模糊扫描件处理建议：**

1. 使用 300DPI 以上分辨率重新扫描
2. 确保扫描时发票平整，无折痕遮挡
3. 可使用本地图像增强工具提升清晰度（锐化 / 对比度调整）
4. 手动补填关键字段后标记为「人工校验」
            """)

    st.divider()

    # ════════════════════════════════
    # 底部操作栏
    # ════════════════════════════════
    bottom_cols = st.columns([1, 1, 1, 3])
    with bottom_cols[0]:
        st.button("⬅️ 返回")
    with bottom_cols[1]:
        st.button("🆘 帮助")
    with bottom_cols[2]:
        st.button("🔄 刷新")
    with bottom_cols[3]:
        st.toggle("🎛️ 会计模式", value=False, help="切换为专业会计视图，显示更多字段细节")


# ── 操作日志 Tab ──
with tab_log:
    st.markdown("### 📝 操作日志")

    log_data = pd.DataFrame({
        "时间": [
            "2026-02-25 10:32:15",
            "2026-02-25 10:30:02",
            "2026-02-25 10:28:47",
            "2026-02-25 09:15:33",
            "2026-02-24 17:42:10",
        ],
        "操作": [
            "发票批量解析",
            "上传 10 个文件",
            "切换账套至 A商贸公司",
            "登录系统",
            "导出 B公司 2月报表",
        ],
        "结果": ["成功 8 / 失败 2", "成功", "成功", "成功", "成功"],
        "操作人": ["张会计", "张会计", "张会计", "张会计", "李会计"],
    })

    st.dataframe(log_data, use_container_width=True, hide_index=True)
