// ==UserScript==
// @name            Erase
// @description     Delete all messages in a Discord channel or DM (Bulk deletion)
// @version         1.2.7
// @author          saint
// @homepageURL     https://github.com/saintordevil/erase-discord-messages
// @supportURL      https://github.com/saintordevil/erase-discord-messages/issues
// @updateURL       https://raw.githubusercontent.com/saintordevil/erase-discord-messages/main/Erase.user.js
// @downloadURL     https://raw.githubusercontent.com/saintordevil/erase-discord-messages/main/Erase.user.js
// @match           https://*.discord.com/app
// @match           https://*.discord.com/channels/*
// @match           https://*.discord.com/login
// @license         MIT
// @namespace       saint.erase
// @grant           unsafeWindow
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_listValues
// @grant           GM_deleteValue
// @run-at          document-start
// @noframes
// ==/UserScript==
(function () {
	'use strict';
	if (window.top !== window.self) return;

	/* rollup-plugin-baked-env */
	const VERSION = "1.2.7";

	var themeCss = (`
/* erase window */
#erase.theme-dark { color-scheme: dark; --erase-panel: #1e1f22; --erase-panel-2: #2b2d31; --erase-panel-3: #111214; --erase-border: #3f4147; --erase-shadow: 0 12px 32px rgb(0 0 0 / 45%); --background-secondary: var(--erase-panel); --background-surface-high: var(--erase-panel); --background-tertiary: var(--erase-panel-2); --background-base-lowest: #17181b; --background-base-lower: var(--erase-panel-3); --background-floating: #111214; --background-modifier-accent: rgb(78 80 88 / 48%); --background-mentioned: rgb(250 166 26 / 10%); --bg-overlay-4: #17181b; --bg-overlay-chat: var(--erase-panel-3); --bg-overlay-2: #202225; --__header-bar-background: #202225; --header-primary: #f2f3f5; --header-secondary: #b5bac1; --text-normal: #dbdee1; --text-default: #dbdee1; --text-muted: #949ba4; --text-link: #00a8fc; --interactive-normal: #b5bac1; --interactive-hover: #dbdee1; --interactive-active: #ffffff; --interactive-muted: #80848e; --input-background: #111214; --input-border: var(--erase-border); --button-secondary-background: #4e5058; --button-secondary-background-hover: #5c5e66; --button-danger-background: #da373c; --button-danger-background-hover: #a12828; --button-positive-background: #248046; --brand-experiment: #5865f2; --scrollbar-thin-thumb: #3f4147; --scrollbar-thin-track: transparent; --primary-700: #111214; --shadow-border: 0 0 0 1px rgb(0 0 0 / 45%); --shadow-high: var(--erase-shadow); --elevation-high: var(--erase-shadow); --elevation-medium: 0 4px 14px rgb(0 0 0 / 35%); --elevation-stroke: 0 0 0 1px rgb(0 0 0 / 30%); }
#erase.browser { box-shadow: var(--shadow-border), var(--shadow-high); border: 1px solid var(--erase-border); overflow: hidden; }
#erase.container,
#erase .container {
    background-color: var(--background-surface-high);
    border-radius: 8px;
    box-sizing: border-box;
    cursor: default;
    flex-direction: column;
}
#erase .header {
    background-color: var(--background-tertiary);
    height: 48px;
    align-items: center;
    min-height: 48px;
    padding: 0 16px;
    display: flex;
    color: var(--header-secondary);
    cursor: grab;
}
#erase .header .icon { color: var(--interactive-normal); margin-right: 8px; flex-shrink: 0; width: 24px; height: 24px; }
#erase .header .icon:hover {
    color: var(--interactive-hover);
}
#erase .header h3 {
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    font-family: var(--font-display);
    color: var(--header-primary);
    flex-shrink: 0;
    margin-right: 16px;
}
#erase .spacer {
    flex-grow: 1;
}
#erase .header .vert-divider {
    width: 1px;
    height: 24px;
    background-color: var(--background-modifier-accent);
    margin-right: 16px;
    flex-shrink: 0;
}
#erase label {
    color: var(--header-secondary);
    font-size: 12px;
    line-height: 16px;
    font-weight: 500;
    text-transform: uppercase;
    cursor: default;
    font-family: var(--font-display);
    margin-bottom: 8px;
}
#erase .multiInput {
    display: flex;
    align-items: center;
    font-size: 16px;
    box-sizing: border-box;
    width: 100%;
    border-radius: 3px;
    color: var(--text-default);
    background-color: var(--input-background);
    border: none;
    transition: border-color 0.2s ease-in-out 0s;
}
#erase .multiInput :first-child {
    flex-grow: 1;
}
#erase .multiInput button:last-child {
    margin-right: 4px;
}
#erase .input {
    font-size: 16px;
    width: 100%;
    transition: border-color 0.2s ease-in-out 0s;
    padding: 10px;
    height: 44px;
    background-color: var(--input-background);
    border: 1px solid var(--input-border);
    border-radius: 8px;
    box-sizing: border-box;
    color: var(--text-default);
}
#erase .input-wrapper {
    display: flex;
    align-items: center;
    font-size: 16px;
    box-sizing: border-box;
    width: 100%;
    border-radius: 3px;
    color: var(--text-default);
    background-color: var(--input-background);
    border: none;
    transition: border-color 0.2s ease-in-out 0s;
}
#erase input[type="text"],
#erase input[type="search"],
#erase input[type="password"],
#erase input[type="datetime-local"],
#erase input[type="number"],
#erase input[type="range"] { background-color: var(--input-background);
    border: 1px solid var(--input-border);
    border-radius: 8px;
    box-sizing: border-box;
    color: var(--text-default);
    font-size: 16px;
    height: 44px;
    padding: 12px 10px;
    transition: border-color .2s ease-in-out;
    width: 100%; }
#erase select { height: 28px; min-width: 82px; padding: 4px 24px 4px 8px; border: 1px solid var(--input-border); border-radius: 4px; color: var(--text-normal); background: var(--input-background); }
#erase input::placeholder { color: var(--interactive-muted); }
#erase input[type="checkbox"] { accent-color: var(--brand-experiment); }
#erase a {
    color: var(--text-link);
    text-decoration: none;
}
#erase .btn,
#erase button { position: relative;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    box-sizing: border-box;
    background: none;
    border: none;
    border-radius: 3px;
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    padding: 2px 16px;
    user-select: none;
    /* sizeSmall */
    width: 60px;
    height: 32px;
    min-width: 60px;
    min-height: 32px;
    /* lookFilled colorPrimary */
    color: rgb(255, 255, 255);
    background-color: var(--button-secondary-background); }
#erase button:hover { background-color: var(--button-secondary-background-hover); }
#erase button:focus-visible,
#erase select:focus-visible,
#erase input:focus-visible,
#erase-btn:focus-visible { outline: 2px solid var(--brand-experiment); outline-offset: 2px; }
#erase .sizeMedium {
    width: 96px;
    height: 38px;
    min-width: 96px;
    min-height: 38px;
}
#erase .sizeMedium.icon {
    width: 38px;
    min-width: 38px;
}
#erase sup {
    vertical-align: top;
}
/* lookFilled colorPrimary */
#erase .danger { background-color: var(--button-danger-background); }
#erase .danger:hover { background-color: var(--button-danger-background-hover); }
#erase .info { font-size: 12px; line-height: 16px; padding: 8px 10px; color: var(--text-muted); }
/* Scrollbar */
#erase .scroll::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
#erase .scroll::-webkit-scrollbar-corner {
    background-color: transparent;
}
#erase .scroll::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    border: 2px solid transparent;
    border-radius: 4px;
    background-color: var(--scrollbar-thin-thumb);
    min-height: 40px;
}
#erase .scroll::-webkit-scrollbar-track {
    border-color: var(--scrollbar-thin-track);
    background-color: var(--scrollbar-thin-track);
    border: 2px solid var(--scrollbar-thin-track);
}
/* fade scrollbar */
#erase .scroll::-webkit-scrollbar-thumb,
#erase .scroll::-webkit-scrollbar-track {
    visibility: hidden;
}
#erase .scroll:hover::-webkit-scrollbar-thumb,
#erase .scroll:hover::-webkit-scrollbar-track {
    visibility: visible;
}
/**** functional classes ****/
#erase.redact .priv {
    display: none !important;
}
#erase.redact x:not(:active) {
    color: transparent !important;
    background-color: var(--primary-700) !important;
    cursor: default;
    user-select: none;
}
#erase.redact x:hover {
    position: relative;
}
#erase.redact x:hover::after {
    content: "Redacted information (Streamer mode: ON)";
    position: absolute;
    display: inline-block;
    top: -32px;
    left: -20px;
    padding: 4px;
    width: 150px;
    font-size: 8pt;
    text-align: center;
    white-space: pre-wrap;
    background-color: var(--background-floating);
    -webkit-box-shadow: var(--elevation-high);
    box-shadow: var(--elevation-high);
    color: var(--text-default);
    border-radius: 5px;
    pointer-events: none;
}
#erase.redact [priv] {
    -webkit-text-security: disc !important;
}
#erase :disabled {
    display: none;
}
/**** layout and utility classes ****/
#erase,
#erase * {
    box-sizing: border-box;
}
#erase .col {
    display: flex;
    flex-direction: column;
}
#erase .log { margin-bottom: 0.25em; }
#erase .log-time { color: var(--interactive-muted); margin-right: 0.5em; }
#erase .log-debug {
    color: inherit;
}
#erase .log-info {
    color: #00b0f4;
}
#erase .log-verb {
    color: #72767d;
}
#erase .log-warn {
    color: #faa61a;
}
#erase .log-error {
    color: #f04747;
}
#erase .log-success {
    color: #43b581;
}

`);

	var mainCss = (`
/**** Erase Button ****/
#erase-btn {
    position: relative;
    width: auto;
    height: 24px;
    margin: 0 8px;
    cursor: pointer;
    color: var(--interactive-normal);
    flex: 0 0 auto;
}
#erase-btn progress {
    position: absolute;
    top: 23px;
    left: -4px;
    width: 32px;
    height: 12px;
    display: none;
}
#erase-btn.running {
    color: var(--button-danger-background) !important;
}
#erase-btn.running progress { display: block; }
/**** Erase Interface ****/
#erase { position: fixed;
    z-index: 100;
    top: 58px;
    right: 10px;
    display: flex;
    flex-direction: column;
    width: 800px;
    height: 80vh;
    min-width: 610px;
    max-width: 100vw;
    min-height: 448px;
    max-height: 100vh;
    color: var(--text-normal);
    border-radius: 4px;
    background-color: var(--background-secondary);
    box-shadow: var(--elevation-stroke), var(--elevation-high);
    will-change: top, left, width, height; }
#erase,
#erase div,
#erase span,
#erase p,
#erase pre { color: inherit; }
#erase .header .icon { cursor: pointer; }
#erase .window-body {
    height: calc(100% - 48px);
}
#erase .sidebar {
    overflow: hidden scroll;
    overflow-y: auto;
    width: 270px;
    min-width: 250px;
    height: 100%;
    max-height: 100%;
    padding: 8px;
    background: var(--bg-overlay-4, var(--background-base-lowest));
}
#erase .sidebar label {
    display: block;
    width: 100%;
}
#erase .main {
    display: flex;
    max-width: calc(100% - 250px);
    background-color: var(--bg-overlay-chat, var(--background-base-lower));
    flex-grow: 1;
}
#erase.hide-sidebar .sidebar {
    display: none;
}
#erase.hide-sidebar .main {
    max-width: 100%;
}
#erase #logArea { font-family: Consolas, Liberation Mono, Menlo, Courier, monospace; font-size: 0.75rem; overflow: auto; padding: 10px; user-select: text;
    flex-grow: 1; flex-grow: 1; cursor: auto; color: var(--text-normal); background-color: var(--background-base-lower); }
#erase .tbar {
    padding: 8px;
    background-color: var(--bg-overlay-2, var(--__header-bar-background));
}
#erase .tbar button { margin-right: 4px; margin-bottom: 4px; }
#erase .footer {
    cursor: se-resize;
    padding-right: 30px;
}
#erase .footer #progressPercent {
    padding: 0 1em;
    font-size: small;
    color: var(--interactive-muted);
    flex-grow: 1;
}
.resize-handle {
    position: absolute;
    bottom: -15px;
    right: -15px;
    width: 30px;
    height: 30px;
    transform: rotate(-45deg);
    background: repeating-linear-gradient(0, var(--background-modifier-accent), var(--background-modifier-accent) 1px, transparent 2px, transparent 4px);
    cursor: nwse-resize;
}
/**** Elements ****/
#erase summary {
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    position: relative;
    overflow: hidden;
    margin-bottom: 2px;
    padding: 6px 10px;
    cursor: pointer;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--interactive-normal);
    border-radius: 4px;
    flex-shrink: 0;
}
#erase progress {
    height: 8px;
    margin-top: 4px;
    flex-grow: 1;
}
@media (max-width: 700px) { #erase { right: 0; top: 0; width: 100vw; min-width: 0; height: 100vh; }
    #erase .window-body { flex-direction: column !important; }
    #erase .sidebar,
    #erase .main { width: 100%; max-width: 100%; }
}

/**** Discollect visual system ****/
#erase.theme-dark {
    color-scheme: dark;
    --erase-ui-bg: #15130f;
    --erase-ui-bg-2: #1b1813;
    --erase-ui-shell: #201c16;
    --erase-ui-surface: rgba(32, 28, 22, 0.88);
    --erase-ui-surface-2: #2a241b;
    --erase-ui-field: #241f18;
    --erase-ui-line: rgba(255, 239, 213, 0.13);
    --erase-ui-line-soft: rgba(255, 239, 213, 0.075);
    --erase-ui-line-hi: rgba(126, 157, 255, 0.52);
    --erase-ui-control-border: #776e62;
    --erase-ui-text: #f6efe3;
    --erase-ui-muted: #bba994;
    --erase-ui-dim: #988976;
    --erase-ui-accent-rgb: 126, 157, 255;
    --erase-ui-accent: #7e9dff;
    --erase-ui-accent-2: #c4d1ff;
    --erase-ui-accent-soft: rgba(126, 157, 255, 0.18);
    --erase-ui-accent-softer: rgba(126, 157, 255, 0.10);
    --erase-ui-accent-text: #10100d;
    --erase-ui-ok: #76d99f;
    --erase-ui-warn: #f4bb67;
    --erase-ui-danger: #ff7685;
    --erase-ui-danger-soft: rgba(255, 118, 133, 0.13);
    --erase-ui-panel-highlight: rgba(255, 239, 213, 0.05);
    --erase-ui-shadow: 0 22px 60px rgba(0, 0, 0, 0.34), 0 2px 8px rgba(0, 0, 0, 0.25);
    --erase-ui-button-bg: rgba(34, 30, 24, 0.88);
    --erase-ui-button-hover: #2b251d;
    --erase-ui-selection: rgba(126, 157, 255, 0.18);
    --background-secondary: var(--erase-ui-bg);
    --background-surface-high: var(--erase-ui-bg);
    --background-tertiary: var(--erase-ui-bg-2);
    --background-base-lowest: var(--erase-ui-bg-2);
    --background-base-lower: var(--erase-ui-bg);
    --background-floating: var(--erase-ui-shell);
    --background-modifier-accent: var(--erase-ui-line);
    --background-mentioned: var(--erase-ui-accent-softer);
    --bg-overlay-4: var(--erase-ui-bg-2);
    --bg-overlay-chat: var(--erase-ui-bg);
    --bg-overlay-2: var(--erase-ui-bg-2);
    --__header-bar-background: var(--erase-ui-bg-2);
    --header-primary: var(--erase-ui-text);
    --header-secondary: var(--erase-ui-muted);
    --text-normal: var(--erase-ui-text);
    --text-default: var(--erase-ui-text);
    --text-muted: var(--erase-ui-muted);
    --text-link: var(--erase-ui-accent-2);
    --interactive-normal: var(--erase-ui-muted);
    --interactive-hover: var(--erase-ui-text);
    --interactive-active: var(--erase-ui-accent-2);
    --interactive-muted: var(--erase-ui-dim);
    --input-background: var(--erase-ui-field);
    --input-border: var(--erase-ui-control-border);
    --button-secondary-background: var(--erase-ui-button-bg);
    --button-secondary-background-hover: var(--erase-ui-button-hover);
    --button-danger-background: #231a1d;
    --button-danger-background-hover: #2b1c21;
    --button-positive-background: #183127;
    --brand-experiment: var(--erase-ui-accent);
    --scrollbar-thin-thumb: rgba(126, 157, 255, 0.58);
    --scrollbar-thin-track: var(--erase-ui-accent-softer);
    --primary-700: var(--erase-ui-shell);
    --shadow-border: 0 0 0 1px var(--erase-ui-line);
    --shadow-high: var(--erase-ui-shadow);
    --elevation-high: var(--erase-ui-shadow);
    --elevation-medium: 0 10px 28px rgba(0, 0, 0, 0.24);
    --elevation-stroke: 0 0 0 1px var(--erase-ui-line);
}

#erase {
    --erase-ui-font: "Geist", "Segoe UI Variable", "Segoe UI", system-ui, sans-serif;
    --erase-ui-font-mono: "JetBrains Mono", "Cascadia Mono", Consolas, monospace;
    --erase-ui-radius: 7px;
    --erase-ui-ease: cubic-bezier(0.2, 0, 0, 1);
    --erase-ui-control-height: 34px;
    --erase-ui-control-icon: 16px;
    width: min(920px, calc(100vw - 28px));
    height: min(80vh, 760px);
    min-width: 650px;
    min-height: 480px;
    right: 14px;
    top: 58px;
    overflow: hidden;
    color: var(--erase-ui-text);
    font: 13px/1.35 var(--erase-ui-font);
    background: var(--erase-ui-bg);
    border: 1px solid var(--erase-ui-line);
    border-radius: var(--erase-ui-radius);
    box-shadow: var(--erase-ui-shadow), inset 0 1px 0 var(--erase-ui-panel-highlight);
    animation: erase-panel-enter 280ms var(--erase-ui-ease) both;
}

#erase::selection {
    color: var(--erase-ui-text);
    background: var(--erase-ui-selection);
}

#erase.container {
    border-radius: var(--erase-ui-radius);
    background: var(--erase-ui-bg);
}

#erase .container {
    border-radius: var(--erase-ui-radius);
    background: transparent;
}

@keyframes erase-panel-enter {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes erase-status-idle-flow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

@keyframes erase-status-search-flow {
    from { background-position: 180% 50%; }
    to { background-position: -180% 50%; }
}

@keyframes erase-status-delete-flow {
    from { background-position: -170% 50%; }
    to { background-position: 170% 50%; }
}

/* The 660%-wide layer contains three original 220% gradient periods.
   These translations reproduce the original background-position offsets. */
@keyframes erase-status-idle-translate {
    0%, 100% { transform: translate3d(0%, 0, 0); }
    50% { transform: translate3d(-18.1818181818%, 0, 0); }
}

@keyframes erase-status-search-translate {
    from { transform: translate3d(-32.7272727273%, 0, 0); }
    to { transform: translate3d(32.7272727273%, 0, 0); }
}

@keyframes erase-status-delete-translate {
    from { transform: translate3d(30.9090909091%, 0, 0); }
    to { transform: translate3d(-30.9090909091%, 0, 0); }
}

@keyframes erase-status-idle-dot {
    0%, 100% { opacity: 0.56; transform: scale(0.84); }
    50% { opacity: 1; transform: scale(1); }
}

@keyframes erase-status-search-dot {
    0% { opacity: 0.48; transform: scale(0.72); }
    45% { opacity: 1; transform: scale(1.16); }
    100% { opacity: 0.48; transform: scale(0.72); }
}

@keyframes erase-status-delete-dot {
    0%, 100% { opacity: 0.72; transform: scale(0.86); }
    34% { opacity: 1; transform: scale(1.2); }
    52% { opacity: 0.78; transform: scale(0.92); }
    72% { opacity: 1; transform: scale(1.08); }
}

@keyframes erase-progress-search-track {
    from { transform: translate3d(-125%, 0, 0) scaleX(0.64); }
    50% { transform: translate3d(132%, 0, 0) scaleX(1); }
    to { transform: translate3d(390%, 0, 0) scaleX(0.64); }
}

@keyframes erase-progress-fill-sheen {
    from { transform: translate3d(-125%, 0, 0); }
    to { transform: translate3d(325%, 0, 0); }
}

@keyframes erase-progress-delete-sheen {
    from { transform: translate3d(325%, 0, 0); }
    to { transform: translate3d(-125%, 0, 0); }
}

@keyframes erase-progress-idle-breathe {
    0%, 100% { opacity: 0.72; }
    50% { opacity: 1; }
}

@keyframes erase-progress-complete {
    0% { opacity: 0.68; transform: scaleY(0.72); }
    48% { opacity: 1; transform: scaleY(1.28); }
    100% { opacity: 1; transform: scaleY(1); }
}

#erase .header {
    min-height: 48px;
    height: 48px;
    gap: 8px;
    padding: 8px 10px;
    color: var(--erase-ui-muted);
    background: var(--erase-ui-bg-2);
    border-bottom: 1px solid var(--erase-ui-line);
    box-shadow: inset 0 1px 0 var(--erase-ui-panel-highlight);
    user-select: none;
    touch-action: none;
}

#erase .header-brand-icon {
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--erase-ui-accent-2);
    flex: 0 0 32px;
}

#erase .header-brand-icon svg {
    width: 18px;
    height: 18px;
    display: block;
}

#erase #hide {
    width: 32px;
    min-width: 32px;
    height: 32px;
    min-height: 32px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--erase-ui-muted);
    border: 1px solid var(--erase-ui-control-border);
    border-radius: 6px;
    background: var(--erase-ui-button-bg);
    cursor: pointer;
    flex: 0 0 32px;
}

#erase #hide svg {
    width: 16px;
    height: 16px;
    display: block;
}

#erase #hide:hover {
    color: var(--erase-ui-text);
    border-color: var(--erase-ui-line-hi);
    background: var(--erase-ui-button-hover);
}

#erase .header h3 {
    margin: 0;
    color: var(--erase-ui-text);
    font: 740 14px/16px var(--erase-ui-font);
    letter-spacing: -0.01em;
}

#erase .header-status {
    --erase-ui-status-base: var(--erase-ui-dim);
    --erase-ui-status-peak: var(--erase-ui-accent-2);
    --erase-ui-status-dot: var(--erase-ui-accent);
    --erase-ui-status-halo: var(--erase-ui-accent-softer);
    min-width: 72px;
    height: 24px;
    margin-right: 8px;
    padding: 0 9px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    color: var(--erase-ui-status-peak);
    background: var(--erase-ui-surface-2);
    border: 1px solid var(--erase-ui-line);
    border-radius: 999px;
    font: 740 10px/1 var(--erase-ui-font-mono);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    flex: 0 0 auto;
    transition: border-color 220ms var(--erase-ui-ease), box-shadow 220ms var(--erase-ui-ease);
}

#erase .header-status::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--erase-ui-status-dot);
    box-shadow: 0 0 0 3px var(--erase-ui-status-halo);
    flex: 0 0 6px;
    transform-origin: 50% 50%;
    animation: erase-status-idle-dot 3.8s ease-in-out infinite;
}

#erase #statusBadge {
    display: inline-block;
    color: transparent;
    --erase-ui-status-gradient: repeating-linear-gradient(
        90deg,
        var(--erase-ui-status-base) 0%,
        var(--erase-ui-status-base) 30%,
        var(--erase-ui-status-peak) 46%,
        var(--erase-ui-text) 50%,
        var(--erase-ui-status-peak) 54%,
        var(--erase-ui-status-base) 70%,
        var(--erase-ui-status-base) 100%
    );
    background-image: var(--erase-ui-status-gradient);
    --erase-ui-status-layer-animation: erase-status-idle-translate 4.4s ease-in-out infinite;
    background-size: 220% 100%;
    background-position: 0% 50%;
    background-clip: text;
    -webkit-background-clip: text;
    animation: erase-status-idle-flow 4.4s ease-in-out infinite;
}

#erase[data-status="idle"] .header-status {
    --erase-ui-status-base: var(--erase-ui-dim);
    --erase-ui-status-peak: var(--erase-ui-accent-2);
}

#erase[data-status="preparing"] .header-status,
#erase[data-status="searching"] .header-status {
    --erase-ui-status-base: #79aaff;
    --erase-ui-status-peak: #e4edff;
    --erase-ui-status-dot: #91b5ff;
    --erase-ui-status-halo: rgba(126, 157, 255, 0.18);
    border-color: rgba(126, 157, 255, 0.34);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);
}

#erase[data-status="preparing"] #statusBadge,
#erase[data-status="searching"] #statusBadge {
    animation: erase-status-search-flow 1.55s linear infinite;
    --erase-ui-status-layer-animation: erase-status-search-translate 1.55s linear infinite;
}

#erase[data-status="preparing"] .header-status::before,
#erase[data-status="searching"] .header-status::before {
    animation: erase-status-search-dot 1.35s ease-in-out infinite;
}

#erase[data-status="deleting"] .header-status,
#erase[data-status="stopping"] .header-status {
    --erase-ui-status-base: #ff8996;
    --erase-ui-status-peak: #ffe0ba;
    --erase-ui-status-dot: #ff8b98;
    --erase-ui-status-halo: rgba(255, 118, 133, 0.18);
    border-color: rgba(255, 118, 133, 0.34);
}

#erase[data-status="deleting"] #statusBadge,
#erase[data-status="stopping"] #statusBadge {
    animation: erase-status-delete-flow 1.08s linear infinite;
    --erase-ui-status-layer-animation: erase-status-delete-translate 1.08s linear infinite;
}

#erase[data-status="deleting"] .header-status::before,
#erase[data-status="stopping"] .header-status::before {
    animation: erase-status-delete-dot 1.02s ease-in-out infinite;
}

#erase[data-status="waiting-index"] .header-status,
#erase[data-status="rate-limited"] .header-status,
#erase[data-status="paused"] .header-status {
    --erase-ui-status-base: #c89450;
    --erase-ui-status-peak: #ffe0a2;
    --erase-ui-status-dot: var(--erase-ui-warn);
    --erase-ui-status-halo: rgba(244, 187, 103, 0.16);
    border-color: rgba(244, 187, 103, 0.28);
}

#erase[data-status="waiting-index"] #statusBadge,
#erase[data-status="rate-limited"] #statusBadge {
    animation: erase-status-search-flow 2.1s linear infinite;
    --erase-ui-status-layer-animation: erase-status-search-translate 2.1s linear infinite;
}

#erase[data-status="waiting-index"] .header-status::before,
#erase[data-status="rate-limited"] .header-status::before {
    animation: erase-status-search-dot 2.2s ease-in-out infinite;
}

#erase[data-status="paused"] #statusBadge {
    animation: erase-status-idle-flow 3.2s ease-in-out infinite;
    --erase-ui-status-layer-animation: erase-status-idle-translate 3.2s ease-in-out infinite;
}

#erase[data-status="paused"] .header-status::before {
    animation: erase-status-idle-dot 3s ease-in-out infinite;
}

#erase[data-status="done"] .header-status {
    --erase-ui-status-base: #72c793;
    --erase-ui-status-peak: #d7ffe6;
    --erase-ui-status-dot: var(--erase-ui-ok);
    --erase-ui-status-halo: rgba(118, 217, 159, 0.16);
    border-color: rgba(118, 217, 159, 0.26);
}

#erase[data-status="error"] .header-status {
    --erase-ui-status-base: #e76575;
    --erase-ui-status-peak: #ffd7dc;
    --erase-ui-status-dot: var(--erase-ui-danger);
    --erase-ui-status-halo: rgba(255, 118, 133, 0.16);
    border-color: rgba(255, 118, 133, 0.3);
}

#erase[data-status="done"] #statusBadge,
#erase[data-status="error"] #statusBadge {
    color: var(--erase-ui-status-peak);
    background-image: none;
    animation: none;
}

#erase[data-status="done"] .header-status::before,
#erase[data-status="error"] .header-status::before {
    animation: none;
}

#erase #statusBadge.erase-composited-status {
    position: relative;
    background-image: none;
    animation: none;
}

#erase #statusBadge.erase-composited-status::after {
    content: "";
    position: absolute;
    left: -220%;
    top: 0;
    width: 660%;
    height: 100%;
    background-image: var(--erase-ui-status-gradient);
    background-size: 33.3333333333% 100%;
    background-repeat: repeat;
    background-position: 0 50%;
    will-change: transform;
    animation: var(--erase-ui-status-layer-animation);
}

#erase .header > span:not(.spacer) {
    color: var(--erase-ui-muted);
    font-size: 11px;
    line-height: 14px;
    font-weight: 620;
}

#erase .header .vert-divider {
    height: 18px;
    margin: 0 2px;
    background: var(--erase-ui-line);
}

#erase .window-body {
    height: calc(100% - 48px);
    min-height: 0;
}

#erase .sidebar {
    width: 284px;
    min-width: 284px;
    padding: 10px;
    background: var(--erase-ui-bg-2);
    border-right: 1px solid var(--erase-ui-line);
    scrollbar-width: thin;
    scrollbar-color: var(--erase-ui-accent) var(--erase-ui-accent-softer);
}

#erase .main {
    min-width: 0;
    min-height: 0;
    container: erase-main / inline-size;
    max-width: calc(100% - 284px);
    background: var(--erase-ui-bg);
}

#erase.hide-sidebar .main {
    max-width: 100%;
}

#erase details {
    margin: 0 0 6px;
    border: 1px solid transparent;
    border-radius: 6px;
    transition: border-color 150ms var(--erase-ui-ease), background 150ms var(--erase-ui-ease);
}

#erase details[open] {
    border-color: var(--erase-ui-line);
    background: var(--erase-ui-surface);
    box-shadow: inset 0 1px 0 var(--erase-ui-panel-highlight);
}

#erase summary {
    min-height: 36px;
    height: 36px;
    margin: 0;
    padding: 8px 10px;
    display: grid;
    grid-template-columns: 12px minmax(0, 1fr);
    align-items: center;
    column-gap: 8px;
    list-style: none;
    color: var(--erase-ui-muted);
    border-bottom: 1px solid transparent;
    border-radius: 5px;
    font: 720 13px/18px var(--erase-ui-font);
    transition: color 150ms var(--erase-ui-ease), background 150ms var(--erase-ui-ease);
}

#erase summary::-webkit-details-marker {
    display: none;
}

#erase summary::marker {
    content: "";
}

#erase .disclosure-indicator {
    width: 12px;
    height: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--erase-ui-accent);
    transform: rotate(0deg);
    transform-origin: 50% 50%;
    transition: transform 150ms var(--erase-ui-ease);
}

#erase .disclosure-indicator::before {
    content: "";
    width: 12px;
    height: 12px;
    background: currentColor;
    clip-path: polygon(22% 10%, 80% 50%, 22% 90%);
}

#erase details[open] > summary .disclosure-indicator {
    transform: rotate(90deg);
}

#erase .summary-label {
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

#erase summary:hover {
    color: var(--erase-ui-text);
    background: var(--erase-ui-accent-softer);
}

#erase details[open] > summary {
    color: var(--erase-ui-accent-2);
    border-bottom: 1px solid var(--erase-ui-line-soft);
    border-radius: 5px 5px 0 0;
}

#erase .section-fields {
    min-width: 0;
    margin: 0;
    padding: 12px 10px 12px 30px;
    display: grid;
    gap: 12px;
    border: 0;
}

#erase .field {
    min-width: 0;
    display: grid;
    gap: 7px;
}

#erase .field-label,
#erase .group-label {
    width: 100%;
    margin: 0;
    color: var(--erase-ui-dim);
    font: 740 11px/14px var(--erase-ui-font-mono);
    letter-spacing: 0.045em;
    text-transform: uppercase;
}

#erase .field-control {
    min-width: 0;
    width: 100%;
}

#erase .field-help {
    margin: 0;
    color: var(--erase-ui-muted);
    font: 11px/1.45 var(--erase-ui-font);
}

#erase .settings-group {
    min-width: 0;
    display: grid;
    gap: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--erase-ui-line-soft);
}

#erase .check-list {
    min-width: 0;
    display: grid;
    gap: 6px;
}

#erase label {
    margin: 0;
    color: var(--erase-ui-muted);
    font: 650 12px/1.25 var(--erase-ui-font);
    text-transform: none;
}


#erase a {
    color: var(--erase-ui-accent-2);
    text-underline-offset: 2px;
}

#erase a:hover {
    color: var(--erase-ui-text);
    text-decoration: underline;
}



#erase .multiInput,
#erase .input-wrapper {
    gap: 6px;
    color: var(--erase-ui-text);
    background: transparent;
    border: 0;
    border-radius: 6px;
}

#erase .multiInput button:last-child {
    margin-right: 0;
}

#erase input[type="text"],
#erase input[type="search"],
#erase input[type="password"],
#erase input[type="datetime-local"],
#erase input[type="number"],
#erase .input {
    height: var(--erase-ui-control-height);
    min-width: 0;
    padding: 0 9px;
    color: var(--erase-ui-text);
    caret-color: var(--erase-ui-accent-2);
    background: var(--erase-ui-field);
    border: 1px solid var(--erase-ui-control-border);
    border-radius: 6px;
    font: 700 12px/16px var(--erase-ui-font);
    transition: border-color 150ms var(--erase-ui-ease), background 150ms var(--erase-ui-ease), box-shadow 180ms var(--erase-ui-ease);
}

#erase input::placeholder {
    color: var(--erase-ui-dim);
    opacity: 0.82;
}

#erase input[type="text"]:focus,
#erase input[type="search"]:focus,
#erase input[type="password"]:focus,
#erase input[type="datetime-local"]:focus,
#erase input[type="number"]:focus,
#erase .input:focus {
    background: var(--erase-ui-field);
    border-color: rgba(var(--erase-ui-accent-rgb), 0.72);
    box-shadow: inset 0 1px 0 var(--erase-ui-panel-highlight), 0 0 0 2px var(--erase-ui-accent-softer);
    outline: none;
}

#erase input[type="range"] {
    height: 24px;
    padding: 0;
    appearance: none;
    background: transparent;
    border: 0;
}

#erase input[type="range"]::-webkit-slider-runnable-track {
    height: 5px;
    border: 1px solid var(--erase-ui-line-soft);
    border-radius: 999px;
    background: var(--erase-ui-accent-softer);
}

#erase input[type="range"]::-webkit-slider-thumb {
    width: 14px;
    height: 14px;
    margin-top: -5px;
    appearance: none;
    border: 2px solid var(--erase-ui-bg-2);
    border-radius: 50%;
    background: var(--erase-ui-accent-2);
    box-shadow: 0 0 0 1px var(--erase-ui-line-hi);
}

#erase input[type="file"] {
    width: 100%;
    color: var(--erase-ui-muted);
    font: 11px/1.2 var(--erase-ui-font);
}

#erase input[type="file"]::file-selector-button {
    min-height: 32px;
    margin-right: 8px;
    padding: 0 9px;
    color: var(--erase-ui-text);
    background: var(--erase-ui-button-bg);
    border: 1px solid var(--erase-ui-control-border);
    border-radius: 5px;
    font: 700 11px/14px var(--erase-ui-font);
    cursor: pointer;
}

#erase input[type="checkbox"] {
    position: relative;
    width: 30px;
    min-width: 30px;
    height: 17px;
    margin: 0 7px 0 0;
    appearance: none;
    border: 1px solid var(--erase-ui-control-border);
    border-radius: 999px;
    background: var(--erase-ui-surface-2);
    box-shadow: inset 0 1px 0 var(--erase-ui-panel-highlight);
    cursor: pointer;
    transition: background 160ms var(--erase-ui-ease), border-color 160ms var(--erase-ui-ease);
}

#erase input[type="checkbox"]::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--erase-ui-muted);
    transition: transform 160ms var(--erase-ui-ease), background 160ms var(--erase-ui-ease);
}

#erase input[type="checkbox"]:checked {
    border-color: var(--erase-ui-line-hi);
    background: color-mix(in srgb, var(--erase-ui-accent) 34%, var(--erase-ui-surface-2));
}

#erase input[type="checkbox"]:checked::after {
    transform: translate3d(13px, 0, 0);
    background: var(--erase-ui-accent-2);
}

#erase .sidebar label.check-row,
#erase label.check-row {
    width: 100%;
    min-height: 24px;
    margin: 0;
    display: flex;
    align-items: center;
    color: var(--erase-ui-muted);
    font: 650 12px/16px var(--erase-ui-font);
    text-transform: none;
    cursor: pointer;
}

#erase .check-label {
    min-width: 0;
    display: inline-block;
}

#erase .range-control {
    min-height: var(--erase-ui-control-height);
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
}

#erase .range-value {
    min-width: 42px;
    color: var(--erase-ui-dim);
    font: 700 10px/14px var(--erase-ui-font-mono);
    text-align: right;
}

#erase select {
    height: var(--erase-ui-control-height);
    min-width: 80px;
    padding: 0 28px 0 9px;
    color: var(--erase-ui-text);
    color-scheme: inherit;
    background-color: var(--erase-ui-field);
    border: 1px solid var(--erase-ui-control-border);
    border-radius: 6px;
    font: 700 11px/14px var(--erase-ui-font);
    cursor: pointer;
}

#erase select option {
    color: var(--erase-ui-text);
    background: var(--erase-ui-shell);
}

#erase .btn,
#erase button {
    width: auto;
    min-width: 64px;
    height: var(--erase-ui-control-height);
    min-height: var(--erase-ui-control-height);
    padding: 0 11px;
    color: var(--erase-ui-text);
    background: var(--erase-ui-button-bg);
    border: 1px solid var(--erase-ui-control-border);
    border-radius: 6px;
    box-shadow: inset 0 1px 0 var(--erase-ui-panel-highlight), 0 1px 0 rgba(0, 0, 0, 0.22);
    font: 760 12px/16px var(--erase-ui-font);
    cursor: pointer;
    transition: background 150ms var(--erase-ui-ease), border-color 150ms var(--erase-ui-ease), color 150ms var(--erase-ui-ease), box-shadow 180ms var(--erase-ui-ease), opacity 150ms var(--erase-ui-ease);
}

#erase button:hover {
    color: var(--erase-ui-text);
    border-color: var(--erase-ui-line-hi);
    background: var(--erase-ui-button-hover);
    box-shadow: inset 0 1px 0 var(--erase-ui-panel-highlight), 0 0 0 1px var(--erase-ui-accent-softer);
}

#erase button:active {
    filter: brightness(0.92);
}

#erase .sizeMedium {
    width: auto;
    min-width: 86px;
    height: var(--erase-ui-control-height);
    min-height: var(--erase-ui-control-height);
}

#erase .sizeMedium.icon {
    width: var(--erase-ui-control-height);
    min-width: var(--erase-ui-control-height);
    padding: 0;
}


#erase .danger {
    color: color-mix(in srgb, var(--erase-ui-danger) 52%, var(--erase-ui-text));
    border-color: color-mix(in srgb, var(--erase-ui-danger) 42%, transparent);
    background: var(--button-danger-background);
}

#erase .danger:hover {
    color: color-mix(in srgb, var(--erase-ui-danger) 25%, var(--erase-ui-text));
    border-color: color-mix(in srgb, var(--erase-ui-danger) 70%, transparent);
    background: var(--button-danger-background-hover);
}


#erase button:focus-visible,
#erase select:focus-visible,
#erase input:focus-visible,
#erase summary:focus-visible,
#erase-btn:focus-visible {
    outline: 2px solid rgba(var(--erase-ui-accent-rgb), 0.72);
    outline-offset: 2px;
}

#erase .tbar {
    --erase-ui-control-height: 31px;
    position: relative;
    z-index: 5;
    padding: 7px 9px;
    background: var(--erase-ui-bg-2);
    border-bottom: 1px solid var(--erase-ui-line);
    box-shadow: inset 0 1px 0 var(--erase-ui-panel-highlight);
}

#erase .toolbar-layout {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 6px;
    min-width: 0;
}

#erase .toolbar-group {
    min-width: 0;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 6px;
}

#erase .toolbar-actions {
    flex: 0 1 auto;
}

#erase .toolbar-options {
    flex: 0 0 auto;
    margin-left: auto;
}

#erase #toggleSidebar {
    width: var(--erase-ui-control-height);
    min-width: var(--erase-ui-control-height);
    padding: 0;
}

#erase #start {
    min-width: 90px;
}

#erase #pause,
#erase #stop {
    width: auto;
    min-width: 64px;
}

#erase #clear {
    min-width: 68px;
}

#erase #diagnostics {
    min-width: 82px;
}

#erase .control-icon {
    width: 14px;
    height: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 14px;
    color: currentColor;
}

#erase button:has(.control-icon) {
    gap: 6px;
}

#erase .icon-menu {
    position: relative;
    width: 16px;
    height: 14px;
    flex: 0 0 16px;
}

#erase .icon-menu::before {
    content: "";
    position: absolute;
    left: 1px;
    top: 1px;
    width: 14px;
    height: 2px;
    background: currentColor;
    border-radius: 2px;
    box-shadow: 0 5px 0 currentColor, 0 10px 0 currentColor;
}

#erase .icon-play::before {
    content: "";
    width: 0;
    height: 0;
    margin-left: 2px;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 8px solid currentColor;
}

#erase .icon-stop::before {
    content: "";
    width: 9px;
    height: 9px;
    border-radius: 2px;
    background: currentColor;
}

#erase .control-lane {
    min-height: var(--erase-ui-control-height);
    height: var(--erase-ui-control-height);
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
}

#erase .streamer-control {
    width: auto;
    padding: 0;
    flex-wrap: nowrap;
}

#erase .toolbar-options label.streamer-control {
    width: auto;
}

#erase .toolbar-options .streamer-control {
    min-height: 31px;
    font-size: 10px;
    white-space: nowrap;
}

#erase .tbar button {
    margin: 0;
    padding: 0 9px;
    font-size: 10px;
}

#erase #logArea {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    margin: 0;
    min-height: 0;
    padding: 0;
    overflow: auto;
    color: var(--erase-ui-muted);
    background: var(--erase-ui-bg);
    font: 11px/1.45 var(--erase-ui-font-mono);
    white-space: normal;
    overflow-wrap: normal;
    scrollbar-width: thin;
    scrollbar-color: var(--erase-ui-accent) var(--erase-ui-accent-softer);
}


#erase #logArea:empty::before {
    content: "Log cleared. Ready for the next run.";
    display: block;
    padding: 11px 12px;
    color: var(--erase-ui-dim);
}

#erase .log {
    width: max-content;
    min-width: 100%;
    min-height: 32px;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 94px max-content;
    align-items: stretch;
    border-left: 2px solid var(--erase-ui-line-soft);
    border-bottom: 1px solid var(--erase-ui-line-soft);
    text-indent: 0;
    white-space: nowrap;
    overflow-wrap: normal;
    word-break: normal;
}

#erase .log + .log {
    border-top: 0;
}

#erase .log-time {
    width: auto;
    min-height: 32px;
    padding: 7px 10px;
    display: flex;
    align-items: center;
    color: var(--erase-ui-dim);
    border-right: 1px solid var(--erase-ui-line-soft);
    font-variant-numeric: tabular-nums;
    text-indent: 0;
    white-space: nowrap;
}

#erase .log-message {
    min-width: max-content;
    min-height: 32px;
    padding: 7px 12px;
    display: block;
    line-height: 18px;
    white-space: nowrap;
    overflow-wrap: normal;
    word-break: normal;
}
#erase .log-message x,
#erase .log-message sup,
#erase .log-message b,
#erase .log-message i {
    display: inline;
}
#erase .log-info { color: var(--erase-ui-accent-2); }
#erase .log-verb { color: var(--erase-ui-muted); }
#erase .log-warn { color: var(--erase-ui-warn); border-left-color: color-mix(in srgb, var(--erase-ui-warn) 72%, transparent); }
#erase .log-error { color: color-mix(in srgb, var(--erase-ui-danger) 72%, var(--erase-ui-text)); border-left-color: var(--erase-ui-danger); }
#erase .log-success { color: var(--erase-ui-ok); border-left-color: color-mix(in srgb, var(--erase-ui-ok) 72%, transparent); }

#erase .footer {
    min-height: 58px;
    min-width: 0;
    flex: 0 0 auto;
    padding: 9px 30px 9px 12px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    grid-template-rows: auto 7px;
    align-items: center;
    gap: 7px 12px;
    background: var(--erase-ui-bg-2);
    border-top: 1px solid var(--erase-ui-line);
    border-bottom: 0;
}

#erase .footer-progress-copy {
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    color: var(--erase-ui-dim);
    font: 11px/1.4 var(--erase-ui-font-mono);
    font-variant-numeric: tabular-nums;
    white-space: normal;
}

#erase #progressCopy {
    min-width: 0;
    overflow-wrap: anywhere;
}

#erase .footer #progressPercent {
    padding: 0;
    flex: 0 0 auto;
    color: var(--erase-ui-accent-2);
    font-weight: 760;
    transition: color 220ms var(--erase-ui-ease);
}

#erase[data-status="deleting"] .footer #progressPercent,
#erase[data-status="stopping"] .footer #progressPercent {
    color: #ffc3ca;
}

#erase[data-status="waiting-index"] .footer #progressPercent,
#erase[data-status="rate-limited"] .footer #progressPercent,
#erase[data-status="paused"] .footer #progressPercent {
    color: #ffe0a2;
}

#erase[data-status="done"] .footer #progressPercent {
    color: #baf5cf;
}

#erase[data-status="error"] .footer #progressPercent {
    color: #ffc1c9;
}

#erase .footer-stats {
    grid-column: 2;
    grid-row: 1 / span 2;
    margin: 0;
    display: flex;
    min-width: 0;
    flex-wrap: wrap;
    align-items: center;
    gap: 9px;
    white-space: normal;
}

#erase .footer-stats > div {
    display: grid;
    min-width: 0;
    justify-items: end;
    gap: 2px;
}

#erase .footer-stats dt,
#erase .footer-stats dd {
    margin: 0;
}

#erase .footer-stats dt {
    color: var(--erase-ui-dim);
    font: 700 8px/1.3 var(--erase-ui-font-mono);
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

#erase .footer-stats dd {
    color: var(--erase-ui-text);
    font: 680 11px/1.3 var(--erase-ui-font-mono);
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
}

#erase .footer label {
    display: inline-flex;
    align-items: center;
    flex: 0 0 auto;
    white-space: nowrap;
}

#erase .footer .footer-autoscroll {
    grid-column: 3;
    grid-row: 1 / span 2;
    width: auto;
    min-height: 24px;
    font-size: 10px;
}

#erase .footer-progress-track {
    grid-column: 1;
    grid-row: 2;
    position: relative;
    width: 100%;
    height: 7px;
    margin: 0;
    display: block;
    overflow: hidden;
    isolation: isolate;
    border: 1px solid rgba(var(--erase-ui-accent-rgb), 0.18);
    border-radius: 999px;
    background: var(--erase-ui-accent-softer);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.34), 0 0 0 1px rgba(126, 157, 255, 0.035);
    transform-origin: 50% 50%;
    transition: border-color 220ms var(--erase-ui-ease), box-shadow 220ms var(--erase-ui-ease), opacity 220ms var(--erase-ui-ease);
}

#erase .footer-progress-track::before,
#erase .footer-progress-track::after,
#erase .footer-progress-fill,
#erase .footer-progress-fill::after {
    content: "";
    position: absolute;
    pointer-events: none;
}

#erase .footer-progress-track::before {
    inset: 0;
    z-index: 0;
    background: linear-gradient(
        90deg,
        rgba(var(--erase-ui-accent-rgb), 0.03),
        rgba(var(--erase-ui-accent-rgb), 0.14),
        rgba(var(--erase-ui-accent-rgb), 0.03)
    );
}

#erase .footer-progress-track::after {
    inset: -1px auto -1px 0;
    z-index: 2;
    width: 34%;
    opacity: 0;
    border-radius: inherit;
    background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(169, 188, 255, 0.06) 24%,
        rgba(207, 219, 255, 0.34) 50%,
        rgba(169, 188, 255, 0.06) 76%,
        transparent 100%
    );
    transform: translate3d(-125%, 0, 0) scaleX(0.64);
}

#erase .footer-progress-fill {
    inset: 0;
    z-index: 1;
    overflow: hidden;
    border-radius: inherit;
    background: linear-gradient(
        90deg,
        #6f91ff 0%,
        var(--erase-ui-accent) 42%,
        var(--erase-ui-accent-2) 100%
    );
    box-shadow: 0 0 14px rgba(var(--erase-ui-accent-rgb), 0.32);
    transform: scaleX(var(--erase-ui-progress-ratio, 0));
    transform-origin: 0 50%;
    transition: transform 360ms var(--erase-ui-ease), opacity 180ms var(--erase-ui-ease), background 220ms var(--erase-ui-ease);
}

#erase .footer-progress-fill::after {
    inset: 0 auto 0 0;
    width: 44%;
    background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(169, 188, 255, 0.05) 28%,
        rgba(207, 219, 255, 0.3) 50%,
        rgba(169, 188, 255, 0.05) 72%,
        transparent 100%
    );
    transform: translate3d(-125%, 0, 0);
}

#erase #progressBar {
    position: absolute;
    inset: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
    margin: 0;
    appearance: none;
    opacity: 0;
    pointer-events: none;
}

#erase[data-status="idle"] .footer-progress-track::before {
    animation: erase-progress-idle-breathe 4s ease-in-out infinite;
}

#erase[data-status="preparing"] .footer-progress-fill::after,
#erase[data-status="searching"] .footer-progress-fill::after,
#erase[data-status="waiting-index"] .footer-progress-fill::after,
#erase[data-status="rate-limited"] .footer-progress-fill::after,
#erase[data-status="paused"] .footer-progress-fill::after {
    animation: erase-progress-fill-sheen 1.65s linear infinite;
}

#erase[data-progress="indeterminate"] .footer-progress-fill {
    opacity: 0;
    transform: scaleX(0);
    transition: none;
}

#erase[data-progress="indeterminate"] .footer-progress-fill::after {
    animation: none;
}

#erase[data-progress="indeterminate"] .footer-progress-track::after {
    opacity: 1;
    animation: erase-progress-search-track 1.5s var(--erase-ui-ease) infinite;
}

#erase[data-status="deleting"] .footer-progress-track,
#erase[data-status="stopping"] .footer-progress-track {
    border-color: rgba(255, 118, 133, 0.28);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.34), 0 0 9px rgba(255, 118, 133, 0.08);
}

#erase[data-status="deleting"] .footer-progress-fill,
#erase[data-status="stopping"] .footer-progress-fill {
    background: linear-gradient(
        90deg,
        #ff6f80 0%,
        #ff93a0 45%,
        #ffb690 100%
    );
}

#erase[data-status="deleting"] .footer-progress-fill::after,
#erase[data-status="stopping"] .footer-progress-fill::after {
    background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 182, 144, 0.05) 28%,
        rgba(255, 215, 194, 0.3) 50%,
        rgba(255, 182, 144, 0.05) 72%,
        transparent 100%
    );
    animation: erase-progress-delete-sheen 1.05s linear infinite;
}

#erase[data-status="done"] .footer-progress-track {
    border-color: rgba(118, 217, 159, 0.3);
    animation: erase-progress-complete 620ms var(--erase-ui-ease) both;
}

#erase[data-status="done"] .footer-progress-fill {
    background: linear-gradient(90deg, #5fc78a, #baf5cf);
}

#erase[data-status="error"] .footer-progress-track {
    border-color: rgba(255, 118, 133, 0.34);
}

#erase[data-status="error"] .footer-progress-fill {
    background: linear-gradient(90deg, #e85e70, #ffc1c9);
}

#erase .resize-handle {
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    transform: none;
    opacity: 0.62;
    background: var(--erase-ui-line-hi);
    clip-path: polygon(58% 100%, 100% 58%, 100% 72%, 72% 100%, 82% 100%, 100% 82%, 100% 100%);
}

#erase .info {
    padding: 0;
    color: var(--erase-ui-dim);
    font: 11px/1.45 var(--erase-ui-font-mono);
}

#erase .sidebar-meta {
    margin: 12px 0 0;
    padding: 12px 10px 4px 30px;
    display: grid;
    gap: 2px;
    color: var(--erase-ui-dim);
    border-top: 1px solid var(--erase-ui-line-soft);
    font: 700 11px/15px var(--erase-ui-font-mono);
    font-variant-numeric: tabular-nums;
}

#erase.redact x:not(:active) {
    border-radius: 2px;
    background: var(--erase-ui-surface-2) !important;
}

#erase.redact x:hover::after {
    padding: 7px 8px;
    color: var(--erase-ui-text);
    background: var(--erase-ui-shell);
    border: 1px solid var(--erase-ui-line);
    border-radius: 6px;
    box-shadow: var(--erase-ui-shadow);
    font: 10px/1.3 var(--erase-ui-font);
}

#erase .scroll::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

#erase .scroll::-webkit-scrollbar-thumb,
#erase .scroll::-webkit-scrollbar-track {
    visibility: visible;
}

#erase .scroll::-webkit-scrollbar-track {
    background: var(--erase-ui-accent-softer);
    border: 0;
    border-radius: 999px;
}

#erase .scroll::-webkit-scrollbar-thumb {
    background: rgba(var(--erase-ui-accent-rgb), 0.58);
    background-clip: padding-box;
    border: 2px solid transparent;
    border-radius: 999px;
}

#erase-btn.erase-mounting {
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
}

@media (max-width: 840px) {
    #erase .toolbar-layout {
        flex-wrap: wrap;
    }

    #erase .toolbar-actions {
        flex: 1 1 360px;
    }

    #erase .toolbar-options {
        flex: 1 1 280px;
        justify-content: flex-end;
        margin-left: 0;
    }

}

/* Respond to the resizable content pane, not the browser window. */
@container erase-main (max-width: 760px) {
    #erase .footer {
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-rows: auto 4px auto;
        gap: 7px 10px;
    }

    #erase .footer-progress-copy {
        grid-column: 1 / span 2;
        grid-row: 1;
    }

    #erase .footer-progress-track {
        grid-column: 1 / span 2;
        grid-row: 2;
    }

    #erase .footer-stats {
        grid-column: 1;
        grid-row: 3;
    }

    #erase .footer .footer-autoscroll {
        grid-column: 2;
        grid-row: 3;
    }
}

@container erase-main (max-width: 480px) {
    #erase .footer {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: auto 4px auto auto;
    }
    #erase .footer-progress-copy, #erase .footer-progress-track,
    #erase .footer-stats, #erase .footer .footer-autoscroll {
        grid-column: 1;
    }
    #erase .footer-stats { justify-content: space-between; gap: 9px 12px; }
    #erase .footer-stats > div { justify-items: start; }
    #erase .footer .footer-autoscroll { grid-row: 4; justify-self: start; }
}

@media (max-width: 760px) {
    #erase {
        top: 8px;
        right: 8px;
        width: calc(100vw - 16px);
        height: calc(100vh - 16px);
        min-width: 0;
        min-height: 420px;
    }

    #erase .window-body {
        flex-direction: row !important;
    }

    #erase .sidebar {
        width: 240px;
        min-width: 230px;
    }

    #erase .main {
        width: 100%;
        max-width: calc(100% - 230px);
    }

    #erase.hide-sidebar .main {
        max-width: 100%;
    }

    #erase .header > span:not(.spacer),
    #erase .header .vert-divider {
        display: none;
    }
}

@media (max-width: 520px) {
    #erase .sidebar {
        width: 220px;
        min-width: 220px;
    }

    #erase .main {
        max-width: calc(100% - 220px);
    }
}

@media (max-width: 620px) {
    #erase .window-body {
        flex-direction: column !important;
    }

    #erase .sidebar {
        position: static;
        width: 100%;
        min-width: 0;
        min-height: 0;
        height: auto;
        flex: 1 1 42%;
        max-height: 42%;
        border-right: 0;
        border-bottom: 1px solid var(--erase-ui-line-hi);
        box-shadow: none;
    }

    #erase .main {
        min-height: 0;
        height: auto;
        flex: 1 0 min(360px, 100%);
        max-width: 100%;
    }

    #erase.hide-sidebar .sidebar {
        display: none;
    }

    #erase.hide-sidebar .main {
        height: 100%;
    }

}

@media (max-width: 420px) {
    #erase .toolbar-options {
        justify-content: flex-start;
    }

    #erase .footer-stats {
        gap: 7px;
    }

}

@media (prefers-reduced-motion: reduce) {
    #erase,
    #erase *,
    #erase::before,
    #erase::after,
    #erase *::before,
    #erase *::after,
    #erase-btn,
    #erase-btn::before,
    #erase-btn::after {
        animation: none !important;
        transition: none !important;
    }

    #erase #statusBadge {
        color: var(--erase-ui-status-peak) !important;
        background-image: none !important;
        clip-path: none !important;
    }

    #erase #statusBadge::after {
        display: none !important;
    }

    #erase progress::-webkit-progress-bar,
    #erase progress::-webkit-progress-value,
    #erase progress::-moz-progress-bar {
        animation: none !important;
        transition: none !important;
    }
}

`);

	var queueCss = (`
#erase { min-width: min(650px, calc(100vw - 16px)); min-height: min(480px, calc(100dvh - 16px)); max-width: calc(100vw - 16px); max-height: calc(100dvh - 16px); }
@media (max-width: 620px) { #erase { min-height: min(650px, calc(100dvh - 16px)); } }
#erase .tbar { --erase-ui-control-height: 34px; }
#erase .tbar button { font-size: 13px; font-weight: 600; line-height: 18px; padding-inline: 10px; flex-shrink: 0; }
#erase .toolbar-layout { overflow-x: auto; padding: 2px; scrollbar-width: thin; }
#erase .toolbar-actions { flex-shrink: 0; }
#erase .toolbar-options { padding-left: 6px; }
#erase .toolbar-options .streamer-control { font-size: 11px; }
#erase .sidebar input:disabled { display: block; opacity: .6; cursor: not-allowed; }
#erase .sidebar input[type="checkbox"]:disabled { display: inline-block; }
#erase .sidebar button:disabled, #erase .queue-foot button:disabled { display: flex; opacity: .5; cursor: not-allowed; }
#erase .current-chat-details { display: grid; gap: 10px; min-width: 0; padding-top: 11px; border-top: 1px solid var(--erase-ui-line-soft); }
#erase .current-chat-info { display: grid; gap: 3px; min-width: 0; }
#erase #currentChatInfo[hidden] { display: none; }
#erase .current-chat-caption { color: var(--erase-ui-dim); font-size: 11px; line-height: 16px; margin: 0; }
#erase #contextName { color: var(--erase-ui-text); font-size: 13px; line-height: 18px; font-weight: 600; overflow-wrap: anywhere; }
#erase #openQueue { width: 100%; min-height: 36px; height: auto; font-size: 13px; margin: 0; }
#erase #retentionHelp span { display: block; }
#erase .webhook-actions { display: flex; gap: 8px; }
#erase .webhook-actions button { flex: 1; min-height: 34px; font-size: 12px; }
#erase #webhookStatus { margin: 0; min-height: 16px; overflow-wrap: anywhere; }
#erase #webhookStatus[data-state="success"] { color: var(--erase-ui-ok); }
#erase #webhookStatus[data-state="error"] { color: var(--erase-ui-danger); }
#erase .activity-strip { flex: 0 1 auto; min-width: 0; min-height: 0; overflow-y: auto; padding: 12px 14px; border-bottom: 1px solid var(--erase-ui-line); background: var(--erase-ui-bg-2); }
#erase #activityTitle { font-size: 13px; line-height: 1.5; font-weight: 600; color: var(--erase-ui-text); overflow-wrap: anywhere; }
#erase #activityDetail { margin-top: 4px; color: var(--erase-ui-muted); font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }
#erase #activityTarget { color: var(--erase-ui-muted); font-size: 11px; margin-bottom: 4px; overflow-wrap: anywhere; }
#erase #activityTarget:empty { display: none; }
#erase .erase-dialog { color: var(--erase-ui-text); background: var(--erase-ui-bg); border: 1px solid var(--erase-ui-line); border-radius: 10px; padding: 0; width: min(640px, calc(100vw - 32px)); max-width: calc(100vw - 32px); max-height: calc(100dvh - 32px); overflow: hidden; font: 13px/1.5 var(--erase-ui-font); box-shadow: 0 20px 70px #0008; }
#erase .erase-dialog::backdrop { background: #0009; }
#erase .erase-dialog[open] { display: flex; flex-direction: column; }
#erase .erase-dialog button { font-weight: 600; line-height: 18px; }
#erase .erase-dialog input:not([type="checkbox"]) { font-weight: 500; }
#erase .queue-head { padding: 20px 22px 14px; display: flex; align-items: flex-start; gap: 12px; border-bottom: 1px solid var(--erase-ui-line); }
#erase .queue-head h2 { margin: 0 0 5px; font-size: 19px; line-height: 1.3; color: var(--erase-ui-text); }
#erase .queue-head p { margin: 0; color: var(--erase-ui-muted); font-size: 12px; }
#erase #closeQueue { margin-left: auto; min-width: 32px; width: 32px; padding: 0; font-size: 18px; }
#erase .queue-body { overflow-y: auto; min-height: 0; padding: 16px 22px; }
#erase .queue-tabs { display: flex; gap: 6px; margin: 10px 0; flex-wrap: wrap; }
#erase .queue-tabs button { width: auto; min-width: 48px; font-size: 12px; padding: 0 10px; }
#erase .queue-tabs button[aria-pressed="true"] { border-color: var(--erase-ui-accent); color: var(--erase-ui-accent-2); background: var(--erase-ui-accent-softer); }
#erase .queue-friends { padding: 4px 0 10px; margin-bottom: 6px; border-bottom: 1px solid var(--erase-ui-line-soft); }
#erase .queue-friends-head { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 4px 12px; }
#erase .queue-friends-copy { min-width: 0; flex: 1 1 230px; }
#erase #queueFriendsSummary { margin: 0; color: var(--erase-ui-muted); font-size: 12px; line-height: 18px; font-variant-numeric: tabular-nums; }
#erase #queueOtherDMs { margin: 3px 0 0; color: var(--erase-ui-dim); font-size: 11px; line-height: 16px; }
#erase #queueOtherDMs:empty { display: none; }
#erase #queueFriendsToggle { display: inline-flex; align-items: center; justify-content: flex-start; gap: 6px; width: auto; min-height: 32px; height: auto; margin: 0; padding: 4px 6px; color: var(--erase-ui-accent-2); background: transparent; border-color: transparent; font-size: 12px; }
#erase #queueFriendsToggle:hover { background: var(--erase-ui-accent-softer); }
#erase #queueFriendsToggle:focus-visible { outline: 2px solid var(--erase-ui-accent); outline-offset: 1px; }
#erase #queueFriendsToggle[aria-expanded="true"] .disclosure-indicator { transform: rotate(90deg); }
#erase #queueMissingHelp { margin: 8px 0; color: var(--erase-ui-muted); font-size: 12px; line-height: 18px; }
#erase #queueMissingList { list-style: none; padding: 0; margin: 0; max-height: 180px; overflow-y: auto; }
#erase .queue-missing-friend { padding: 0; border-top: 1px solid var(--erase-ui-line-soft); border-left: 3px solid transparent; }
#erase .queue-missing-friend:has(input:checked) { background: var(--erase-ui-accent-softer); border-left-color: var(--erase-ui-accent); }
#erase .queue-missing-choice { display: flex; align-items: center; gap: 10px; padding: 8px; margin: 0; cursor: pointer; text-transform: none; }
#erase .queue-missing-copy { display: flex; align-items: baseline; flex-wrap: wrap; gap: 2px 10px; min-width: 0; }
#erase .queue-missing-choice input, #erase #queueMissingAll { appearance: auto; display: block; flex: 0 0 16px; width: 16px; min-width: 16px; height: 16px; margin: 0; accent-color: var(--erase-ui-accent); }
#erase .queue-missing-choice input::before, #erase .queue-missing-choice input::after, #erase #queueMissingAll::before, #erase #queueMissingAll::after { display: none; }
#erase .queue-missing-choice input:disabled { opacity: .55; cursor: default; }
#erase .queue-missing-result { flex-basis: 100%; color: var(--erase-ui-muted); font-size: 11px; line-height: 16px; }
#erase .queue-missing-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 10px; margin: 8px 0; }
#erase .queue-missing-actions label { display: flex; align-items: center; gap: 8px; margin: 0 auto 0 0; cursor: pointer; text-transform: none; font-size: 12px; }
#erase .queue-missing-actions button { width: auto; min-height: 32px; height: auto; padding: 5px 10px; font-size: 12px; }
#erase .queue-missing-actions button:disabled { display: flex; opacity: .5; cursor: not-allowed; }
#erase #queueMissingStatus { margin: 8px 0; font-size: 12px; line-height: 18px; color: var(--erase-ui-muted); }
#erase #queueMissingStatus:empty { display: none; }
#erase .queue-missing-friend strong { font-size: 13px; line-height: 18px; font-weight: 500; overflow-wrap: anywhere; min-width: 0; }
#erase .queue-missing-friend small { color: var(--erase-ui-muted); font-size: 11px; line-height: 18px; overflow-wrap: anywhere; min-width: 0; }
#erase .queue-missing-empty { padding: 8px 0; color: var(--erase-ui-muted); font-size: 12px; }
#erase #queueMissingMore { width: auto; min-height: 32px; height: auto; margin-top: 8px; padding: 4px 10px; font-size: 12px; }
#erase .queue-friends[hidden], #erase #queueFriendsToggle[hidden], #erase #queueMissingPanel[hidden], #erase #queueMissingMore[hidden], #erase #queueMissingCancel[hidden] { display: none; }
#erase .queue-bulk { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px 12px; min-height: 36px; padding: 4px 10px 9px; }
#erase .queue-bulk label { display: flex; align-items: center; gap: 10px; width: auto; margin: 0; color: var(--erase-ui-text); font: 600 12px/18px var(--erase-ui-font); text-transform: none; cursor: pointer; }
#erase .queue-bulk input { appearance: auto; width: 16px; height: 16px; min-width: 16px; margin: 0; accent-color: var(--erase-ui-accent); }
#erase .queue-bulk input::before, #erase .queue-bulk input::after { display: none; }
#erase .queue-bulk input:disabled, #erase .queue-row input:disabled { display: block; opacity: .5; cursor: not-allowed; }
#erase #queueViewSelection { color: var(--erase-ui-muted); font-size: 11px; font-variant-numeric: tabular-nums; }
#erase #queueSearch { height: 38px; padding: 0 12px; font-size: 13px; }
#erase #queueList { min-height: 150px; max-height: 260px; overflow-y: auto; margin: 0; padding: 0; border-block: 1px solid var(--erase-ui-line); }
#erase .queue-row { display: flex; width: 100%; box-sizing: border-box; gap: 12px; padding: 11px 10px; margin: 0; align-items: center; cursor: pointer; text-transform: none; color: var(--erase-ui-text); border-bottom: 1px solid var(--erase-ui-line); border-left: 3px solid transparent; }
#erase .queue-row:last-child { border-bottom: 0; }
#erase .queue-row:hover { background: var(--erase-ui-bg-2); }
#erase .queue-row:has(input:checked) { background: var(--erase-ui-accent-softer); border-left-color: var(--erase-ui-accent); }
#erase .queue-row:focus-within { outline: 2px solid var(--erase-ui-accent); outline-offset: -2px; }
#erase .queue-row input { appearance: auto; width: 16px; height: 16px; min-width: 16px; flex: 0 0 16px; margin: 0; accent-color: var(--erase-ui-accent); }
#erase .queue-row input::before, #erase .queue-row input::after { display: none; }
#erase .queue-row .queue-label { min-width: 0; flex: 1; }
#erase .queue-row strong { display: block; font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; font-weight: 500; }
#erase .queue-name-line { display: flex; align-items: center; gap: 6px 8px; flex-wrap: wrap; }
#erase .recent-delete-badge { display: inline-flex; align-items: center; border: 1px solid var(--erase-ui-line); border-radius: 999px; padding: 1px 7px; color: var(--erase-ui-accent-2); background: var(--erase-ui-accent-softer); font: 600 10px/16px var(--erase-ui-font); white-space: nowrap; }
#erase .saved-queue { border-top: 1px solid var(--erase-ui-line-soft); padding-top: 10px; display: grid; gap: 8px; }
#erase .saved-queue p, #erase #queueSavedNotice { margin: 0; font-size: 12px; line-height: 18px; color: var(--erase-ui-muted); }
#erase #restoreQueue, #erase #openChangelog { width: 100%; min-height: 34px; font-size: 12px; }
#erase #queueSavedNotice { margin: 8px 0; }
#erase .queue-history { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 8px 0 12px; }
#erase #queueHistoryStatus { margin: 0; color: var(--erase-ui-muted); font-size: 12px; line-height: 18px; }
#erase #queueClearHistory { flex: 0 0 auto; font-size: 12px; padding: 6px 10px; }
#erase .saved-queue[hidden], #erase #queueSavedNotice[hidden] { display: none; }
#erase .changelog-body { padding: 8px 22px 20px; overflow-y: auto; }
#erase .changelog-release { padding: 14px 0; border-bottom: 1px solid var(--erase-ui-line-soft); }
#erase .changelog-release:last-child { border: 0; }
#erase .changelog-release h3 { margin: 0 0 7px; font-size: 14px; color: var(--erase-ui-text); }
#erase .changelog-release ul { margin: 0; padding-left: 18px; color: var(--erase-ui-muted); font-size: 12px; line-height: 1.7; }
#erase #closeChangelog { margin-left: auto; width: 32px; min-width: 32px; padding: 0; }
#erase .queue-row small { display: block; color: var(--erase-ui-muted); font-size: 11px; line-height: 1.5; }
#erase .queue-kind { font-size: 10px; color: var(--erase-ui-muted); white-space: nowrap; }
#erase #queueNotice { margin: 10px 0; color: var(--erase-ui-muted); font-size: 12px; min-height: 18px; }
#erase .queue-rules { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding-top: 10px; }
#erase .queue-rules label { display: block; text-transform: none; font-size: 12px; margin: 0 0 6px; }
#erase .queue-rules input { height: 38px; font-size: 13px; padding: 0 10px; }
#erase .queue-help { margin: 9px 0 0; font-size: 12px; color: var(--erase-ui-muted); line-height: 1.6; }
#erase .queue-foot { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; padding: 14px 22px; border-top: 1px solid var(--erase-ui-line); background: var(--erase-ui-bg-2); }
#erase #queueSelectionCount { flex: 1; font-size: 12px; }
#erase .queue-foot button { width: auto; height: 36px; padding: 0 13px; font-size: 13px; }
#erase .erase-tooltip { position: fixed; z-index: 2147483647; width: max-content; max-width: min(300px, calc(100vw - 20px)); padding: 9px 12px; border: 1px solid var(--erase-ui-line); border-radius: 6px; background: var(--erase-ui-bg); color: var(--erase-ui-text); font: 12px/1.5 var(--erase-ui-font); pointer-events: none; box-shadow: 0 6px 20px #0006; }
#erase .erase-tooltip[hidden] { display: none; }
@media(max-width: 540px) { #erase .queue-head, #erase .queue-body, #erase .queue-foot { padding: 14px; } #erase .queue-rules { grid-template-columns: 1fr; } }
`);

	var dragCss = (`
[name^="grab-"] {
  position: absolute;
  --size: 6px;
  --corner-size: 16px;
  --offset: -1px;
  z-index: 9;
}
[name^="grab-"]:hover{
    background: rgba(128,128,128,0.1);
}
[name="grab-t"] {
  top: 0px;
  left: var(--corner-size);
  right: var(--corner-size);
  height: var(--size);
  margin-top: var(--offset);
  cursor: ns-resize;
}
[name="grab-r"] {
  top: var(--corner-size);
  bottom: var(--corner-size);
  right: 0px;
  width: var(--size);
  margin-right: var(--offset);
  cursor: ew-resize;
}
[name="grab-b"] {
  bottom: 0px;
  left: var(--corner-size);
  right: var(--corner-size);
  height: var(--size);
  margin-bottom: var(--offset);
  cursor: ns-resize;
}
[name="grab-l"] {
  top: var(--corner-size);
  bottom: var(--corner-size);
  left: 0px;
  width: var(--size);
  margin-left: var(--offset);
  cursor: ew-resize;
}
[name="grab-tl"] {
  top: 0px;
  left: 0px;
  width: var(--corner-size);
  height: var(--corner-size);
  margin-top: var(--offset);
  margin-left: var(--offset);
  cursor: nwse-resize;
}
[name="grab-tr"] {
  top: 0px;
  right: 0px;
  width: var(--corner-size);
  height: var(--corner-size);
  margin-top: var(--offset);
  margin-right: var(--offset);
  cursor: nesw-resize;
}
[name="grab-br"] {
  bottom: 0px;
  right: 0px;
  width: var(--corner-size);
  height: var(--corner-size);
  margin-bottom: var(--offset);
  margin-right: var(--offset);
  cursor: nwse-resize;
}
[name="grab-bl"] {
  bottom: 0px;
  left: 0px;
  width: var(--corner-size);
  height: var(--corner-size);
  margin-bottom: var(--offset);
  margin-left: var(--offset);
  cursor: nesw-resize;
}
`);

	var buttonHtml = (`
<div id="erase-btn" data-status="idle" data-progress="determinate" tabindex="0" role="button" aria-label="Open Erase" aria-controls="erase" aria-expanded="false" title="Open Erase">
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z"></path>
        <path fill="currentColor" d="M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z"></path>
    </svg>
    <progress></progress>
</div>
`);

	var eraseTemplate = (`
<div id="erase" class="browser container theme-dark" data-status="idle" data-progress="determinate" style="display:none;" role="dialog" aria-labelledby="erase-title">
    <div class="header">
        <div class="header-brand-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z"></path>
                <path fill="currentColor"
                    d="M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z">
                </path>
            </svg>
        </div>
        <h3 id="erase-title">Erase</h3>
        <div class="vert-divider"></div>
        <span> Bulk delete messages</span>
        <div class="spacer"></div>
        <div class="header-status" aria-label="Erase status">
            <span id="statusBadge" role="status" aria-live="polite" aria-atomic="true">Idle</span>
        </div>
        <button type="button" id="hide" aria-label="Close Erase">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor"
                    d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z">
                </path>
            </svg>
        </button>
    </div>
    <div class="window-body" style="display: flex; flex-direction: row;">
        <div id="erase-sidebar" class="sidebar scroll">
            <details id="generalSection" open>
                <summary>
                    <span class="disclosure-indicator" aria-hidden="true"></span>
                    <span class="summary-label">General</span>
                </summary>
                <div class="section-fields">
                    <div class="field">
                        <label class="field-label" for="authorId">Author ID</label>
                        <div class="multiInput field-control">
                            <div class="input-wrapper">
                                <input class="input" id="authorId" type="text" priv>
                            </div>
                            <button type="button" id="getAuthor" aria-label="Use current user as author">me</button>
                        </div>
                    </div>
                    <div class="field">
                        <label class="field-label" for="guildId">Server ID</label>
                        <div class="multiInput field-control">
                            <div class="input-wrapper">
                                <input class="input" id="guildId" type="text" priv>
                            </div>
                            <button type="button" id="getGuild" aria-label="Use current server">current</button>
                        </div>
                    </div>
                    <div class="field">
                        <label class="field-label" for="channelId">Channel ID</label>
                        <div class="multiInput field-control">
                            <div class="input-wrapper">
                                <input class="input" id="channelId" type="text" priv>
                            </div>
                            <button type="button" id="getChannel" aria-label="Use current channel">current</button>
                        </div>
                    </div>
                    <div class="field">
                        <label class="field-label" for="keepRecentCount">Keep newest messages</label>
                        <div class="input-wrapper field-control"><input id="keepRecentCount" type="number" min="0" max="1000" step="1" value="30"></div>
                        <p id="retentionHelp" class="field-help"><span>Keep recent messages for all.</span><span>Delete only your older ones.</span></p>
                    </div>
                    <div class="current-chat-details">
                        <label class="check-row" for="followChannel"><input id="followChannel" type="checkbox" aria-controls="currentChatInfo" checked><span class="check-label">Follow current chat</span></label>
                        <div id="currentChatInfo" class="current-chat-info" aria-live="polite" aria-atomic="true">
                            <p id="contextMeta" class="current-chat-caption">Select a chat</p>
                            <strong id="contextName" class="priv">No chat selected</strong>
                        </div>
                    </div>
                </div>
            </details>
            <details id="queueSection">
                <summary>
                    <span class="disclosure-indicator" aria-hidden="true"></span>
                    <span class="summary-label">Queued message deleting</span>
                </summary>
                <div class="section-fields">
                    <p class="field-help">Select chats and servers to delete from in one queue.</p>
                    <button type="button" id="openQueue">Choose chats and servers</button>
                    <div id="savedQueue" class="saved-queue" hidden><p id="savedQueueStatus" role="status"></p><button type="button" id="restoreQueue">Restore saved queue</button></div>
                </div>
            </details>
            <details id="notificationSettings">
                <summary><span class="disclosure-indicator" aria-hidden="true"></span><span class="summary-label">Webhook</span></summary>
                <div class="section-fields">
                    <label class="check-row" for="webhookEnabled"><input id="webhookEnabled" type="checkbox"><span class="check-label">Discord webhook reports</span></label>
                    <p class="field-help">One report when the full run finishes or stops.</p>
                    <div class="field">
                        <label class="field-label" for="webhookUrl">Webhook URL</label>
                            <div class="input-wrapper field-control"><input id="webhookUrl" type="password" maxlength="512" placeholder="Paste Discord webhook URL" autocomplete="off" spellcheck="false" priv></div>
                            <p class="field-help">Paste a URL to save it and send a test automatically.</p>
                    </div>
                    <div class="webhook-actions"><button type="button" id="testWebhook" disabled>Test again</button><button type="button" id="clearWebhook">Clear</button></div>
                    <p id="webhookStatus" class="field-help" role="status" aria-live="polite">Reports are off.</p>
                </div>
            </details>
            <details>
                <summary>
                    <span class="disclosure-indicator" aria-hidden="true"></span>
                    <span class="summary-label">Filter</span>
                </summary>
                <div class="section-fields">
                    <div class="field">
                        <label class="field-label" for="search">Search</label>
                        <div class="input-wrapper field-control">
                            <input id="search" type="text" placeholder="Containing text" priv>
                        </div>
                        <p class="field-help">Only delete messages that contain this text.</p>
                    </div>
                    <div class="check-list">
                        <label class="check-row" for="hasLink">
                            <input id="hasLink" type="checkbox">
                            <span class="check-label">has: link</span>
                        </label>
                        <label class="check-row" for="hasFile">
                            <input id="hasFile" type="checkbox">
                            <span class="check-label">has: file</span>
                        </label>
                        <label class="check-row" for="includePinned">
                            <input id="includePinned" type="checkbox">
                            <span class="check-label">Include pinned</span>
                        </label>
                        <label class="check-row" for="dryRun">
                            <input id="dryRun" type="checkbox">
                            <span class="check-label">Dry run (preview only)</span>
                        </label>
                    </div>
                    <div class="field">
                        <label class="field-label" for="pattern">Pattern</label>
                        <div class="input-wrapper field-control">
                            <span class="info" aria-hidden="true">/</span>
                            <input id="pattern" type="text" placeholder="regular expression" priv>
                            <span class="info" aria-hidden="true">/</span>
                        </div>
                        <p class="field-help">Delete messages that match this regular expression.</p>
                    </div>
                </div>
            </details>
            <details>
                <summary>
                    <span class="disclosure-indicator" aria-hidden="true"></span>
                    <span class="summary-label">Messages interval</span>
                </summary>
                <div class="section-fields">
                    <div class="field">
                        <label class="field-label" for="minId">After message</label>
                        <div class="multiInput field-control">
                            <div class="input-wrapper">
                                <input id="minId" type="text" placeholder="Message ID" priv>
                            </div>
                            <button type="button" id="pickMessageAfter" aria-label="Pick earliest message">Pick</button>
                        </div>
                    </div>
                    <div class="field">
                        <label class="field-label" for="maxId">Before message</label>
                        <div class="multiInput field-control">
                            <div class="input-wrapper">
                                <input id="maxId" type="text" placeholder="Message ID" priv>
                            </div>
                            <button type="button" id="pickMessageBefore" aria-label="Pick latest message">Pick</button>
                        </div>
                    </div>
                    <p class="field-help">Specify an interval to delete messages.</p>
                </div>
            </details>
            <details>
                <summary>
                    <span class="disclosure-indicator" aria-hidden="true"></span>
                    <span class="summary-label">Date interval</span>
                </summary>
                <div class="section-fields">
                    <div class="field">
                        <label class="field-label" for="minDate">After date</label>
                        <div class="input-wrapper field-control">
                            <input id="minDate" type="datetime-local" title="Messages posted AFTER this date">
                        </div>
                    </div>
                    <div class="field">
                        <label class="field-label" for="maxDate">Before date</label>
                        <div class="input-wrapper field-control">
                            <input id="maxDate" type="datetime-local" title="Messages posted BEFORE this date">
                        </div>
                    </div>
                    <p class="field-help">Delete messages posted between these dates.</p>
                    <p class="field-help">Date filtering is ignored when a message interval is set.</p>
                </div>
            </details>
            <details>
                <summary>
                    <span class="disclosure-indicator" aria-hidden="true"></span>
                    <span class="summary-label">Advanced settings</span>
                </summary>
                <div class="section-fields">
                    <div class="field">
                        <label class="field-label" for="searchDelay">Search delay</label>
                        <div class="input-wrapper field-control range-control">
                            <input id="searchDelay" type="range" value="30000" step="100" min="100" max="60000">
                            <output class="range-value" id="searchDelayValue" for="searchDelay"></output>
                        </div>
                    </div>
                    <div class="field">
                        <label class="field-label" for="deleteDelay">Delete delay</label>
                        <div class="input-wrapper field-control range-control">
                            <input id="deleteDelay" type="range" value="1000" step="50" min="50" max="10000">
                            <output class="range-value" id="deleteDelayValue" for="deleteDelay"></output>
                        </div>
                        <p class="field-help">Controls how quickly messages are deleted.</p>
                    </div>
                    <div class="settings-group">
                        <div class="group-label">Reliability</div>
                        <div class="check-list">
                            <label class="check-row" for="adaptiveDeletePacing">
                                <input id="adaptiveDeletePacing" type="checkbox">
                                <span class="check-label">Extra adaptive delete backoff</span>
                            </label>
                            <label class="check-row" for="conservativeMode">
                                <input id="conservativeMode" type="checkbox">
                                <span class="check-label">Conservative mode (slow from start)</span>
                            </label>
                        </div>
                        <div class="field">
                            <label class="field-label" for="prefetchPages">Prefetch pages</label>
                            <div class="input-wrapper field-control">
                                <input id="prefetchPages" type="number" value="2" min="1" max="5">
                            </div>
                        </div>
                        <div class="field">
                            <label class="field-label" for="maxEmptyPageRetries">Empty page retries</label>
                            <div class="input-wrapper field-control">
                                <input id="maxEmptyPageRetries" type="number" value="1" min="0" max="10">
                            </div>
                        </div>
                        <div class="field">
                            <label class="field-label" for="maxEmptyPageSkips">Max empty page skips</label>
                            <div class="input-wrapper field-control">
                                <input id="maxEmptyPageSkips" type="number" value="3" min="0" max="10">
                            </div>
                        </div>
                        <div class="field">
                            <label class="field-label" for="maxStagnantCycles">Max stagnant cycles</label>
                            <div class="input-wrapper field-control">
                                <input id="maxStagnantCycles" type="number" value="3" min="1" max="20">
                            </div>
                        </div>
                        <div class="field">
                            <label class="field-label" for="maxRuntimeMinutes">Max runtime minutes (0 = off)</label>
                            <div class="input-wrapper field-control">
                                <input id="maxRuntimeMinutes" type="number" value="0" min="0" max="1440">
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label class="field-label" for="token">Authorization token</label>
                        <div class="multiInput field-control">
                            <div class="input-wrapper">
                                <input class="input" id="token" type="text" autocomplete="dont" priv>
                            </div>
                            <button type="button" id="getToken" aria-label="Fill authorization token">fill</button>
                        </div>
                        <p class="field-help">Never share this token. Diagnostics and logs redact tokens by default.</p>
                    </div>
                    <div class="field"><button type="button" id="openChangelog">View changelog</button></div>
                </div>
            </details>
            <div class="sidebar-meta">
                <span>Erase {{VERSION}}</span>
                <span>Author: saint</span>
            </div>
        </div>
        <div class="main col">
            <div class="tbar col">
                <div class="toolbar-layout">
                    <div class="toolbar-group toolbar-actions">
                        <button type="button" id="toggleSidebar" class="sizeMedium icon" aria-label="Toggle settings sidebar" aria-controls="erase-sidebar">
                            <span class="control-icon icon-menu" aria-hidden="true"></span>
                        </button>
                        <button type="button" id="start" class="sizeMedium danger" title="Start the deletion process">
                            <span class="control-icon icon-play" aria-hidden="true"></span>
                            <span>Delete</span>
                        </button>
                        <button type="button" id="pause" class="sizeMedium" title="Pause or resume the deletion process" disabled>Pause</button>
                        <button type="button" id="stop" class="sizeMedium" title="Stop the deletion process" disabled>
                            <span class="control-icon icon-stop" aria-hidden="true"></span>
                            <span>Stop</span>
                        </button>
                        <button type="button" id="clear" class="sizeMedium">Clear log</button>
                        <button type="button" id="diagnostics" class="sizeMedium">Diagnostics</button>
                    </div>
                    <div class="toolbar-group toolbar-options">
                        <label class="check-row control-lane streamer-control" for="redact" title="Hide sensitive information on your screen for taking screenshots">
                            <input id="redact" type="checkbox">
                            <span class="check-label">Streamer mode</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="activity-strip" role="status" aria-live="polite" aria-atomic="true">
                <div id="activityTarget" class="priv"></div>
                <div id="activityTitle">Ready when you are</div>
                <div id="activityDetail">Keep the newest 30 messages in each chat, then delete only your older messages.</div>
            </div>
            <pre id="logArea" class="logarea scroll"></pre>
            <div class="tbar footer">
                <div class="footer-progress-copy">
                    <span id="progressCopy">Ready</span>
                    <strong id="progressPercent">0%</strong>
                </div>
                <div class="footer-progress-track">
                    <progress id="progressBar" max="1" value="0" aria-label="Deletion progress"></progress>
                    <span class="footer-progress-fill" aria-hidden="true"></span>
                </div>
                <dl class="footer-stats">
                    <div><dt>Deleted</dt><dd id="progressDeleted">0</dd></div>
                    <div><dt>Skipped</dt><dd id="progressSkipped">0</dd></div>
                    <div><dt>Failed</dt><dd id="progressFailed">0</dd></div>
                    <div><dt>Elapsed</dt><dd id="progressElapsed">00:00</dd></div>
                    <div><dt>Remaining</dt><dd id="progressRemaining">00:00</dd></div>
                </dl>
                <label class="check-row footer-autoscroll" for="autoScroll">
                    <input id="autoScroll" type="checkbox" checked>
                    <span class="check-label">Auto-scroll</span>
                </label>
                <div class="resize-handle"></div>
            </div>
        </div>
    </div>
    <dialog id="queueDialog" class="erase-dialog" aria-labelledby="queueTitle" aria-describedby="queueDescription">
        <div class="queue-head"><div><h2 id="queueTitle">Queued message deleting</h2><p id="queueDescription">Choose conversations and servers. Erase works through them one at a time.</p></div><button id="closeQueue" aria-label="Close queue"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M6 6l12 12M18 6L6 18"/></svg></button></div>
        <div class="queue-body scroll">
            <input id="queueSearch" type="search" aria-label="Find chats or servers" placeholder="Find a chat or server" autocomplete="off">
            <div class="queue-tabs" role="group" aria-label="Filter queue targets">
                <button data-queue-kind="all" aria-pressed="true">All</button><button data-queue-kind="dm" aria-pressed="false">DMs</button><button data-queue-kind="group" aria-pressed="false">Groups</button><button data-queue-kind="server" aria-pressed="false">Servers</button>
            </div>
            <section id="queueFriendCoverage" class="queue-friends" aria-label="Friends and detected DMs" hidden>
                <div class="queue-friends-head">
                    <div class="queue-friends-copy"><p id="queueFriendsSummary" role="status"></p><p id="queueOtherDMs"></p></div>
                    <button type="button" id="queueFriendsToggle" aria-expanded="false" aria-controls="queueMissingPanel" hidden><span class="disclosure-indicator" aria-hidden="true"></span><span id="queueFriendsToggleLabel"></span></button>
                </div>
                <div id="queueMissingPanel" hidden>
                    <p id="queueMissingHelp">Select friends to find and queue their existing DMs. Chats stay closed in Discord. Use the search above to find a name.</p>
                    <div class="queue-missing-actions">
                        <label><input id="queueMissingAll" type="checkbox"><span id="queueMissingAllLabel">Select all missing</span></label>
                        <button type="button" id="queueMissingAdd" disabled>Add selected to queue</button>
                        <button type="button" id="queueMissingCancel" hidden>Cancel lookup</button>
                    </div>
                    <p id="queueMissingStatus" role="status"></p>
                    <ul id="queueMissingList" class="scroll" aria-label="Friends without a detected DM"></ul>
                    <button type="button" id="queueMissingMore" hidden>Show more friends</button>
                </div>
            </section>
            <div class="queue-bulk">
                <label for="queueSelectAll"><input id="queueSelectAll" type="checkbox" disabled><span id="queueSelectAllLabel">Select all</span></label>
                <span id="queueViewSelection" aria-live="polite">0 selected</span>
            </div>
            <div id="queueList" class="scroll" role="group" aria-label="Available chats and servers"></div>
            <p id="queueNotice" role="status">Loading your conversations...</p>
            <p id="queueSavedNotice" role="status" hidden></p>
            <div class="queue-history">
                <p id="queueHistoryStatus" role="status">Deletion history stays until cleared.</p>
                <button type="button" id="queueClearHistory" disabled title="Clear saved deletion badges for this account. Your saved queue is kept.">Clear history</button>
            </div>
            <div class="queue-rules">
                <div><label for="queueKeepRecent">Keep newest messages per chat</label><input id="queueKeepRecent" type="number" min="0" max="1000" step="1" value="30"></div>
                <div><label for="queueBeforeDate">Only delete before (optional)</label><input id="queueBeforeDate" type="datetime-local"></div>
            </div>
            <p id="queueRetentionSummary" class="queue-help"></p>
            <p class="queue-help">The count includes everyone's messages, separately in each server channel. Pinned messages and your existing filters stay respected.</p>
            <p id="queueFilterSummary" class="queue-help"></p>
        </div>
        <div class="queue-foot"><span id="queueSelectionCount">No targets selected</span><button id="queuePreview">Preview queue</button><button id="queueStart" class="danger">Start queue</button></div>
    </dialog>
    <dialog id="changelogDialog" class="erase-dialog" aria-labelledby="changelogTitle">
        <div class="queue-head"><div><h2 id="changelogTitle">What's new in Erase</h2><p>Useful improvements since 1.0.8.</p></div><button type="button" id="closeChangelog" aria-label="Close changelog"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M6 6l12 12M18 6L6 18"/></svg></button></div>
        <div class="changelog-body scroll">
            <section class="changelog-release"><h3>1.2.7 · Matching webhook colors</h3><ul><li>Completion, preview and test cards use Erase's exact theme accent, #7e9dff. Warning, stopped and failed reports also use the tool's existing palette.</li></ul></section>
            <section class="changelog-release"><h3>1.2.6 · Clearer webhook cards</h3><ul><li>Webhook reports use a compact Discord card with blue completed-run and purple preview accents, prominent message totals, and neatly grouped progress, duration and newest-message protection.</li><li>Issues, stopped runs and failures have distinct headings and colors. Extra details appear only when needed, and previews and test reports remain clearly labelled.</li></ul></section>
            <section class="changelog-release"><h3>1.2.5 · Clear counts at every size</h3><ul><li>All numeric ratios use compact formatting such as 15/15, including queue selections, progress, missing-friend checks and webhook reports.</li><li>The progress footer adapts to the panel's width when resized. Status text, percentage, counters and Auto-scroll wrap into separate rows instead of overlapping.</li></ul></section>
            <section class="changelog-release"><h3>1.2.4 · History until you clear it</h3><ul><li>Recently deleted history no longer expires after seven days or drops older records after 200 chats. Existing saved activity carries forward automatically.</li><li>Clear history in the queue popup removes this account's deletion badges after confirmation, without changing its saved queue or messages.</li><li>History saves only changed records, keeping updates small as the list grows. Missing friends and closed DMs keep their badges across later runs.</li></ul></section>
            <section class="changelog-release"><h3>1.2.3 · Remember closed DMs</h3><ul><li>Recently deleted badges follow verified people as well as their chats, including friends whose DMs are missing from the current chat list.</li><li>Recently used closed DMs remain available in the queue after a reload, with their saved names and activity badges. They are never selected automatically.</li><li>Runs with nothing left to delete keep the earlier deletion record. Existing history gains identity details from matching saved queues and loaded chats where available.</li></ul></section>
            <section class="changelog-release"><h3>1.2.2 · Paste, test, and confirm</h3><ul><li>Webhook URLs save and validate as you type, without clicking a button or leaving the field.</li><li>A complete URL automatically sends one labelled test after a short typing pause, with live delivery or error feedback.</li><li>Changing or clearing the URL cancels outdated tests. Reloading saved settings does not resend a test; Test again remains available.</li></ul></section>
            <section class="changelog-release"><h3>1.2.1 · GitHub release</h3><ul><li>Install and update Erase from its official GitHub repository.</li><li>Find a concise usage guide, synthetic previews and the full changelog alongside the script.</li></ul></section>
            <section class="changelog-release"><h3>1.2.0 · Pick up where you left off</h3><ul><li>Saved queues retain your original chats, order, filters and progress after a pause or browser restart.</li><li>Restore the first unfinished target with its newest-message protection preserved. Deletion resumes only when you choose.</li><li>Recently deleted bubbles beside queue names help you track where you have worked during the last seven days.</li></ul></section>
            <section class="changelog-release"><h3>1.1.9 · Queue closed DMs</h3><ul><li>Select missing friends and add their existing DMs without reopening chats in Discord.</li><li>Select all matching friends, cancel lookups, and see clear results for found or unavailable chats.</li></ul></section>
            <section class="changelog-release"><h3>1.1.8 · See which chats are missing</h3><ul><li>All and DMs show how many friends have detected conversations.</li><li>A searchable list identifies missing friends by display name and username.</li><li>Open DMs with non-friends stay available and are counted separately.</li></ul></section>
            <section class="changelog-release"><h3>1.1.7 · A steadier start</h3><ul><li>The trash icon waits for Discord's loaded header before appearing in its final position.</li></ul></section>
            <section class="changelog-release"><h3>1.1.5–1.1.6 · Cleaner reports and logs</h3><ul><li>Optional Discord webhooks report the result of a single run or an entire queue, including failures, stops and previews.</li><li>Webhook settings are private to your userscript manager, and the on/off status updates immediately.</li><li>Each message gets one concise outcome row in the log.</li><li>Webhook has its own section below queued deleting. The old archive-import panel was removed.</li></ul></section>
            <section class="changelog-release"><h3>1.1.3–1.1.4 · Faster empty-chat handling</h3><ul><li>Chats with fewer messages than your keep-newest setting are skipped with a clear notice.</li><li>Empty search results no longer cause repeated page loops.</li><li>Queues move promptly past targets with nothing to delete while still respecting Discord's rate limits.</li></ul></section>
            <section class="changelog-release"><h3>1.1.1–1.1.2 · Easier selection</h3><ul><li>Select all works within the current All, DMs, Groups or Servers view and respects search.</li><li>Selected chats are highlighted, and overlapping server/channel selections are avoided.</li><li>The keep-newest explanation updates as you change the number.</li><li>Current-chat details and Follow current chat sit together in General. Unused legacy interface code was removed.</li></ul></section>
            <section class="changelog-release"><h3>1.1.0 · Queues and stronger protection</h3><ul><li>Queue DMs, group chats and servers together, with a preview before deletion.</li><li>Keep a custom number of newest messages per conversation, plus an optional before-date cutoff.</li><li>Recent-message boundaries and account checks guard every deletion; server protection applies separately to each channel.</li><li>Follow the current chat, detect age-restricted channels automatically, and read toggle explanations on hover.</li><li>A screen-contained panel, larger action text and detailed live activity make longer runs easier to follow.</li></ul></section>
        </div>
    </dialog>
    <div id="eraseTooltip" class="erase-tooltip" role="tooltip" hidden></div>
</div>

`);

	const log = {
	  debug() { return logFn ? logFn('debug', arguments) : console.debug.apply(console, arguments); },
	  info() { return logFn ? logFn('info', arguments) : console.info.apply(console, arguments); },
	  verb() { return logFn ? logFn('verb', arguments) : console.log.apply(console, arguments); },
	  warn() { return logFn ? logFn('warn', arguments) : console.warn.apply(console, arguments); },
	  error() { return logFn ? logFn('error', arguments) : console.error.apply(console, arguments); },
	  success() { return logFn ? logFn('success', arguments) : console.info.apply(console, arguments); },
	};

	var logFn; // custom console.log function
	const setLogFn = (fn) => logFn = fn;

	const TOKEN_PATTERNS = [
	  /mfa\.[\w-]{20,}/gi,
	  /[\w-]{24,}\.[\w-]{6,}\.[\w-]{20,}/g,
	];

	const AUTH_HEADER_PATTERN = /(authorization["'\s:=]+)(["']?)[^"',\s}]+/gi;
	const WEBHOOK_SECRET_PATTERN = /https:\/\/(?:(?:canary|ptb)\.)?discord(?:app)?\.com\/api\/(?:v\d+\/)?webhooks\/\d+\/[^\s"'<>]+/gi;
	const SNOWFLAKE_PATTERN = /\b\d{17,20}\b/g;

	function escapeHTML(html) {
	  return String(html).replace(/[&<>"']/g, m => ({
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    '\'': '&#039;',
	  })[m]);
	}

	function redactSensitiveText(value, options = {}) {
	  const { redactIds = false } = options;
	  let text = String(value ?? '');
	  for (const pattern of TOKEN_PATTERNS) text = text.replace(pattern, '[REDACTED_TOKEN]');
	  text = text.replace(AUTH_HEADER_PATTERN, '$1$2[REDACTED_TOKEN]');
	  text = text.replace(WEBHOOK_SECRET_PATTERN, '[REDACTED_WEBHOOK]');
	  if (redactIds) text = text.replace(SNOWFLAKE_PATTERN, '[REDACTED_ID]');
	  return text;
	}

	function redact(str) {
	  return `<x>${escapeHTML(redactSensitiveText(str))}</x>`;
	}

	function sanitizeDiagnosticValue(value, options = {}) {
	  if (value instanceof Error) {
	    return {
	      name: value.name,
	      message: redactSensitiveText(value.message, options),
	      stack: redactSensitiveText(value.stack || '', options),
	    };
	  }

	  if (Array.isArray(value)) return value.map(item => sanitizeDiagnosticValue(item, options));

	  if (value && typeof value === 'object') {
	    const clean = {};
	    for (const [key, nestedValue] of Object.entries(value)) {
	      if (/token|authorization|password|secret|webhookUrl/i.test(key)) {
	        clean[key] = '[REDACTED]';
	      } else if (/content/i.test(key) && options.includeContent !== true) {
	        clean[key] = '[REDACTED_CONTENT]';
	      } else {
	        clean[key] = sanitizeDiagnosticValue(nestedValue, options);
	      }
	    }
	    return clean;
	  }

	  if (typeof value === 'string') return redactSensitiveText(value, options);
	  return value;
	}

	function stringifySanitized(value, options = {}) {
	  return JSON.stringify(sanitizeDiagnosticValue(value, options), null, 2);
	}

	// Helpers
	const wait = async (ms, signal) => new Promise((done, reject) => {
	  if (!ms || ms <= 0) return done();
	  if (signal?.aborted) return reject(new DOMException('Operation aborted', 'AbortError'));

	  const timeout = setTimeout(cleanDone, ms);

	  function cleanDone() {
	    signal?.removeEventListener('abort', abort);
	    done();
	  }

	  function abort() {
	    clearTimeout(timeout);
	    signal?.removeEventListener('abort', abort);
	    reject(new DOMException('Operation aborted', 'AbortError'));
	  }

	  signal?.addEventListener('abort', abort, { once: true });
	});
	const msToHMS = s => `${s / 3.6e6 | 0}h ${(s % 3.6e6) / 6e4 | 0}m ${(s % 6e4) / 1000 | 0}s`;
	const queryString = params => params.filter(p => p[1] !== undefined).map(p => p[0] + '=' + encodeURIComponent(p[1])).join('&');
	const ask = async msg => new Promise(resolve => setTimeout(() => resolve(window.confirm(msg)), 10));
	const dateToSnowflake = (date, offsetMs = 0) => {
	  const timestamp = new Date(date).getTime();
	  if (!Number.isFinite(timestamp)) return date;
	  return ((BigInt(timestamp + offsetMs) - 1420070400000n) << 22n).toString();
	};
	const toSnowflake = (date) => /[-:T]/.test(String(date)) ? dateToSnowflake(date) : date;
	const replaceInterpolations = (str, obj, removeMissing = false) => str.replace(/\{\{([\w_]+)\}\}/g, (m, key) => obj[key] || (removeMissing ? '' : m));

	const DEFAULT_SAFE_RETRY_MS = 1000;
	const DEFAULT_JITTER_MS = 250;

	function header(headers, name) {
	  if (!headers) return null;
	  if (typeof headers.get === 'function') return headers.get(name);
	  const match = Object.keys(headers).find(key => key.toLowerCase() === name.toLowerCase());
	  return match ? headers[match] : null;
	}

	function secondsToMs(value) {
	  const n = Number(value);
	  if (!Number.isFinite(n) || n <= 0) return 0;
	  return Math.ceil(n * 1000);
	}

	function parseRateLimitHeaders(headers) {
	  const resetAfterMs = secondsToMs(header(headers, 'X-RateLimit-Reset-After'));
	  return {
	    limit: Number(header(headers, 'X-RateLimit-Limit')) || null,
	    remaining: Number(header(headers, 'X-RateLimit-Remaining')),
	    reset: Number(header(headers, 'X-RateLimit-Reset')) || null,
	    resetAfterMs,
	    bucket: header(headers, 'X-RateLimit-Bucket') || null,
	    scope: header(headers, 'X-RateLimit-Scope') || null,
	    global: header(headers, 'X-RateLimit-Global') === 'true',
	  };
	}

	function parseRetryAfter(headers, body) {
	  const headerMs = secondsToMs(header(headers, 'Retry-After'));
	  const bodyMs = secondsToMs(body?.retry_after);
	  return Math.max(headerMs, bodyMs);
	}

	class RateLimitManager {
	  constructor(options = {}) {
	    this.waitFn = options.waitFn || wait;
	    this.jitterMs = options.jitterMs ?? DEFAULT_JITTER_MS;
	    this.safeRetryMs = options.safeRetryMs ?? DEFAULT_SAFE_RETRY_MS;
	    this.routeResets = new Map();
	    this.bucketRoutes = new Map();
	    this.globalResetAt = 0;
	    this.stats = {
	      hits: 0,
	      globalHits: 0,
	      totalWaitMs: 0,
	      consecutive429s: 0,
	      lastCooldownMs: 0,
	      lastScope: null,
	      lastRouteKey: null,
	    };
	  }

	  jitter() {
	    return this.jitterMs ? Math.floor(Math.random() * this.jitterMs) : 0;
	  }

	  routeKeyFor(routeKey) {
	    return this.bucketRoutes.get(routeKey) || routeKey;
	  }

	  async waitFor(routeKey, signal) {
	    const now = Date.now();
	    const waits = [];
	    if (this.globalResetAt > now) waits.push(this.globalResetAt - now);

	    const bucketKey = this.routeKeyFor(routeKey);
	    const routeResetAt = this.routeResets.get(bucketKey) || 0;
	    if (routeResetAt > now) waits.push(routeResetAt - now);

	    const waitMs = Math.max(0, ...waits);
	    if (waitMs > 0) {
	      this.stats.totalWaitMs += waitMs;
	      this.stats.lastCooldownMs = waitMs;
	      await this.waitFn(waitMs, signal);
	    }
	  }

	  updateFromHeaders(routeKey, headers) {
	    const info = parseRateLimitHeaders(headers);
	    if (info.bucket) this.bucketRoutes.set(routeKey, info.bucket);
	    const bucketKey = info.bucket || this.routeKeyFor(routeKey);
	    if (info.remaining === 0 && info.resetAfterMs > 0) {
	      this.routeResets.set(bucketKey, Date.now() + info.resetAfterMs + this.jitter());
	    }
	    return info;
	  }

	  async handle429(routeKey, headers, body, signal) {
	    const info = this.updateFromHeaders(routeKey, headers);
	    let waitMs = parseRetryAfter(headers, body) || info.resetAfterMs || this.safeRetryMs;
	    waitMs += this.jitter();

	    this.stats.hits++;
	    this.stats.consecutive429s++;
	    this.stats.totalWaitMs += waitMs;
	    this.stats.lastCooldownMs = waitMs;
	    this.stats.lastScope = info.scope || (body?.global ? 'global' : 'unknown');
	    this.stats.lastRouteKey = routeKey;

	    if (info.global || body?.global) {
	      this.stats.globalHits++;
	      this.globalResetAt = Date.now() + waitMs;
	    } else {
	      const bucketKey = info.bucket || this.routeKeyFor(routeKey);
	      this.routeResets.set(bucketKey, Date.now() + waitMs);
	    }

	    await this.waitFn(waitMs, signal);
	    return waitMs;
	  }

	  markSuccess() {
	    this.stats.consecutive429s = 0;
	  }
	}

	// Discord documents v9 and v10 as available. This userscript keeps v9 for now
	// because the browser-client search route has historically used v9 semantics;
	// centralizing the version makes a future compatibility switch explicit.
	const DISCORD_API_VERSION = 'v9';
	const DISCORD_API_BASE = `https://discord.com/api/${DISCORD_API_VERSION}`;
	const MESSAGES_PER_SEARCH_PAGE = 25;
	const MAX_QUEUE_TARGETS = 5000;

	const STOP_REASONS = Object.freeze({
	  VERIFIED_COMPLETE: 'verified_complete',
	  NO_DELETABLE_MESSAGES: 'no_deletable_messages_after_verification',
	  USER_STOPPED: 'user_stopped',
	  AUTH_ERROR: 'auth_error',
	  PERMISSION_ERROR: 'permission_error',
	  NOT_FOUND: 'not_found',
	  RATE_LIMIT_SAFETY: 'rate_limit_safety',
	  RUNTIME_LIMIT: 'runtime_limit',
	  ERROR: 'error',
	});

	const EMPTY_PAGE_ACTIONS = Object.freeze({
	  CONTINUE: 'continue',
	  RETRY_SAME: 'retry_same',
	  SCAN_AHEAD: 'scan_ahead',
	  ADVANCE_CURSOR: 'advance_cursor',
	  TERMINATE: 'terminate',
	});

	function compareSnowflakes(a, b) {
	  const aBig = BigInt(a);
	  const bBig = BigInt(b);
	  if (aBig < bBig) return -1;
	  if (aBig > bBig) return 1;
	  return 0;
	}

	function minSnowflake(ids) {
	  return ids.filter(Boolean).reduce((min, id) => {
	    if (!min) return id;
	    return compareSnowflakes(id, min) < 0 ? id : min;
	  }, null);
	}

	function extractSearchHits(searchResponse) {
	  const conversations = Array.isArray(searchResponse?.messages) ? searchResponse.messages : [];
	  return conversations.map(conversation => {
	    if (!Array.isArray(conversation)) return null;
	    return conversation.find(message => message?.hit === true) || conversation[0] || null;
	  }).filter(Boolean);
	}

	function normalizeSearchOptions(options) {
	  return {
	    ...options,
	    minId: options.minId ? toSnowflake(options.minId) : undefined,
	    maxId: options.maxId ? toSnowflake(options.maxId) : undefined,
	    prefetchPages: clampInt(options.prefetchPages, 1, 5, 2),
	    maxEmptyPageRetries: clampInt(options.maxEmptyPageRetries, 0, 10, 1),
	    maxEmptyPageSkips: clampInt(options.maxEmptyPageSkips, 0, 10, 3),
	    maxStagnantCycles: clampInt(options.maxStagnantCycles, 1, 20, 3),
	    maxSearchPagesPerCycle: clampInt(options.maxSearchPagesPerCycle, 1, 20, 6),
	    searchDelay: clampInt(options.searchDelay, 0, 120000, 30000),
	    deleteDelay: clampInt(options.deleteDelay, 0, 120000, 1000),
	    deleteDelayFloor: clampInt(options.deleteDelayFloor, 0, 120000, 1000),
	    maxConsecutive429s: clampInt(options.maxConsecutive429s, 1, 20, 6),
	    maxRuntimeMinutes: clampInt(options.maxRuntimeMinutes, 0, 1440, 0),
	    keepRecentCount: clampInt(options.keepRecentCount, 0, 1000, 0),
	  };
	}

	function clampInt(value, min, max, fallback) {
	  const n = Number(value);
	  if (!Number.isFinite(n)) return fallback;
	  return Math.max(min, Math.min(max, Math.trunc(n)));
	}

	function buildSearchQueryParams(options, state, offset = state.workingOffset || 0) {
	  return [
	    ['author_id', options.authorId || undefined],
	    ['channel_id', (options.guildId !== '@me' ? options.channelId : undefined) || undefined],
	    ['min_id', options.minId || undefined],
	    // Discord search treats max_id as "before this message ID". The moving cursor is
	    // intentionally exclusive so a just-deleted boundary message is not reprocessed.
	    ['max_id', state.workingMaxId || options.maxId || undefined],
	    ['sort_by', 'timestamp'],
	    ['sort_order', 'desc'],
	    ['offset', offset],
	    ['limit', MESSAGES_PER_SEARCH_PAGE],
	    ['has', options.hasLink ? 'link' : undefined],
	    ['has', options.hasFile ? 'file' : undefined],
	    ['content', options.content || undefined],
	    ['include_nsfw', options.includeNsfw ? true : undefined],
	  ];
	}

	function buildSearchQuery(options, state, offset) {
	  return queryString(buildSearchQueryParams(options, state, offset));
	}

	function searchEndpoint(options) {
	  if (options.guildId === '@me') return `${DISCORD_API_BASE}/channels/${options.channelId}/messages/search`;
	  return `${DISCORD_API_BASE}/guilds/${options.guildId}/messages/search`;
	}

	function deleteEndpoint(message) {
	  return `${DISCORD_API_BASE}/channels/${message.channel_id}/messages/${message.id}`;
	}

	function advanceCursorFromMessages(state, messages) {
	  const oldest = minSnowflake(messages.map(message => message?.id));
	  if (!oldest) return false;
	  if (state.workingMaxId && compareSnowflakes(oldest, state.workingMaxId) >= 0) return false;
	  state.oldestProcessedMessageId = oldest;
	  state.workingMaxId = oldest;
	  state.workingOffset = 0;
	  state.offset = 0;
	  return true;
	}

	function calculateProgress(state) {
	  return (state.deletedCount || state.delCount || 0) +
	    (state.failedCount || state.failCount || 0) +
	    (state.skippedCount || 0) +
	    (state.alreadyDeletedCount || 0);
	}

	function shouldTerminateAfterSearch({ searchResponse, queue, state, options }) {
	  const pageHits = extractSearchHits(searchResponse).length;
	  if (state.stopRequested) {
	    return { action: EMPTY_PAGE_ACTIONS.TERMINATE, reason: STOP_REASONS.USER_STOPPED };
	  }
	  if ((queue?.length || 0) > 0 || pageHits > 0) {
	    return { action: EMPTY_PAGE_ACTIONS.CONTINUE };
	  }

	  const total = Number(searchResponse?.total_results || 0);
	  const processed = calculateProgress(state);
	  const evidenceRemaining = total > 0 && (state.workingOffset || 0) < total;

	  // Only the current query can establish remaining work. A previous total or
	  // cursor describes an older search scope and cannot override an explicit zero.
	  if (evidenceRemaining) {
	    if (state.emptyPageStreak <= options.maxEmptyPageRetries) {
	      return { action: EMPTY_PAGE_ACTIONS.RETRY_SAME };
	    }
	    if (state.emptyPageSkips < options.maxEmptyPageSkips && (state.workingOffset || 0) + MESSAGES_PER_SEARCH_PAGE < total) {
	      return { action: EMPTY_PAGE_ACTIONS.SCAN_AHEAD };
	    }
	    if (state.oldestProcessedMessageId && state.workingMaxId !== state.oldestProcessedMessageId) {
	      return { action: EMPTY_PAGE_ACTIONS.ADVANCE_CURSOR };
	    }
	    if (state.stagnantCycles < options.maxStagnantCycles) {
	      return { action: EMPTY_PAGE_ACTIONS.RETRY_SAME };
	    }
	  }

	  return {
	    action: EMPTY_PAGE_ACTIONS.TERMINATE,
	    reason: processed > 0 ? STOP_REASONS.VERIFIED_COMPLETE : STOP_REASONS.NO_DELETABLE_MESSAGES,
	  };
	}

	const NETWORK_RETRY_BASE_MS = 1000;

	class DiscordApiClient {
	  constructor(options = {}) {
	    this.fetchFn = options.fetchFn || fetch;
	    this.waitFn = options.waitFn || wait;
	    this.rateLimit = options.rateLimit || new RateLimitManager({ waitFn: this.waitFn });
	    this.maxNetworkRetries = options.maxNetworkRetries ?? 3;
	    this.onStatus = options.onStatus || (() => {});
	  }

	  async searchMessages(authToken, options, state, signal) {
	    const url = `${searchEndpoint(options)}?${buildSearchQuery(options, state, state.workingOffset || 0)}`;
	    return await this.request('GET messages/search', url, {
	      headers: this.safeHeaders(authToken),
	    }, signal);
	  }

	  async deleteMessage(authToken, message, signal) {
	    return await this.request('DELETE /channels/:channel_id/messages/:message_id', deleteEndpoint(message), {
	      method: 'DELETE',
	      headers: this.safeHeaders(authToken),
	    }, signal);
	  }

	  async getResource(path, authToken, signal) {
	    if (!/^\/(?:channels\/\d+(?:\/messages)?|users\/@me(?:\/channels|\/guilds|\/relationships|\/dms\/\d{17,20})?)$/.test(path.split('?')[0])) {
	      throw new Error('Invalid Discord resource');
	    }
	    return this.request(`GET ${path.split('?')[0].replace(/\d+/g, ':id')}`, `${DISCORD_API_BASE}${path}`, {
	      headers: this.safeHeaders(authToken),
	    }, signal);
	  }

	  safeHeaders(authToken) {
	    return { Authorization: authToken };
	  }

	  async request(routeKey, url, init, signal) {
	    let networkAttempt = 0;

	    for (let requestAttempt = 0; requestAttempt < 100; requestAttempt++) {
	      await this.rateLimit.waitFor(routeKey, signal);

	      let response;
	      try {
	        // Native browser fetch cannot use DiscordApiClient as its receiver.
	        const requestFetch = this.fetchFn;
	        response = await requestFetch(url, { ...init, signal });
	      } catch (err) {
	        if (signal?.aborted || err.name === 'AbortError') throw err;
	        if (networkAttempt >= this.maxNetworkRetries) {
	          return {
	            ok: false,
	            status: 0,
	            body: { message: 'Network error', detail: sanitizeDiagnosticValue(err) },
	            headers: null,
	          };
	        }
	        const waitMs = NETWORK_RETRY_BASE_MS * Math.pow(2, networkAttempt);
	        networkAttempt++;
	        this.onStatus('Waiting after network error', waitMs);
	        await this.waitFn(waitMs, signal);
	        continue;
	      }

	      const body = await readBody(response);
	      const rateLimitInfo = this.rateLimit.updateFromHeaders(routeKey, response.headers);

	      if (response.status === 429) {
	        this.onStatus('Discord rate limit; waiting to retry', parseRetryAfter(response.headers, body) || DEFAULT_SAFE_RETRY_MS);
	        await this.rateLimit.handle429(routeKey, response.headers, body, signal);
	        if (this.rateLimit.stats.consecutive429s > 20) {
	          return { ok: false, status: 429, body, headers: response.headers, rateLimitInfo };
	        }
	        continue;
	      }

	      if (response.status >= 500 && networkAttempt < this.maxNetworkRetries) {
	        const waitMs = NETWORK_RETRY_BASE_MS * Math.pow(2, networkAttempt);
	        networkAttempt++;
	        this.onStatus('Waiting after server error', waitMs);
	        await this.waitFn(waitMs, signal);
	        continue;
	      }

	      this.rateLimit.markSuccess();
	      return {
	        ok: response.ok,
	        status: response.status,
	        body,
	        headers: response.headers,
	        rateLimitInfo,
	      };
	    }

	    return {
	      ok: false,
	      status: 429,
	      body: { message: 'Request retry budget exhausted' },
	      headers: null,
	      rateLimitInfo: null,
	    };
	  }
	}

	async function readBody(response) {
	  if (response.status === 204) return null;
	  const text = await response.text();
	  if (!text) return null;
	  try {
	    return JSON.parse(text);
	  } catch {
	    return text;
	  }
	}

	const DELETABLE_MESSAGE_TYPES = new Set([
	  0, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 22, 23,
	  25, 26, 27, 28, 29, 31, 32, 36, 37, 38, 39, 44, 46,
	]);

	const NON_DELETABLE_MESSAGE_TYPES = new Set([1, 2, 3, 4, 5, 20, 21, 24]);

	function isDeletableMessageType(type, message, options = {}) {
	  if (type === 24) {
	    return { ok: false, reason: 'message type 24 requires Manage Messages permission' };
	  }
	  if (type === 20 && !options.includeApplicationCommands) {
	    return { ok: false, reason: 'chat input command response is not safely self-deletable' };
	  }
	  if (type === 21) {
	    return { ok: false, reason: 'thread starter placeholder is not deletable' };
	  }
	  if (DELETABLE_MESSAGE_TYPES.has(type)) return { ok: true, reason: null };
	  if (NON_DELETABLE_MESSAGE_TYPES.has(type)) return { ok: false, reason: `message type ${type} is not deletable` };
	  return { ok: false, reason: `unknown message type ${type}` };
	}

	function filterSearchResponse(searchResponse, options, state) {
	  const discoveredMessages = extractSearchHits(searchResponse);
	  return filterMessages(discoveredMessages, options, state);
	}

	function filterMessages(discoveredMessages, options, state = {}) {
	  let regex = null;
	  let patternError = null;
	  if (options.pattern) {
	    try {
	      regex = new RegExp(options.pattern, 'i');
	    } catch (err) {
	      patternError = err;
	    }
	  }

	  const messagesToDelete = [];
	  const skippedMessages = [];
	  const skipReasons = {};

	  for (const msg of discoveredMessages) {
	    const skipReason = patternError ? 'malformed regex' : getSkipReason(msg, options, regex);
	    if (skipReason) {
	      skippedMessages.push({ message: msg, reason: skipReason });
	      skipReasons[skipReason] = (skipReasons[skipReason] || 0) + 1;
	      continue;
	    }

	    if (state.processedMessageIds?.has(msg.id) || state.queuedMessageIds?.has(msg.id)) {
	      skippedMessages.push({ message: msg, reason: 'duplicate' });
	      skipReasons.duplicate = (skipReasons.duplicate || 0) + 1;
	      continue;
	    }

	    messagesToDelete.push(msg);
	  }

	  return { discoveredMessages, messagesToDelete, skippedMessages, skipReasons, patternError };
	}

	function getSkipReason(msg, options, regex) {
	  if (!msg) return 'invalid message';
	  if (typeof msg.id !== 'string' || !/^\d{17,20}$/.test(msg.id)) return 'invalid message id';
	  if (typeof msg.channel_id !== 'string' || !/^\d{17,20}$/.test(msg.channel_id)) return 'invalid channel id';

	  if (options.authorId && msg.author?.id !== options.authorId) return 'author mismatch';
	  if (options.channelId && msg.channel_id && msg.channel_id !== options.channelId) return 'channel mismatch';
	  if (options.minId && compareSnowflakes(msg.id, options.minId) <= 0) return 'older than minimum id';
	  if (options.maxId && compareSnowflakes(msg.id, options.maxId) >= 0) return 'newer than maximum id';
	  if (msg.pinned && !options.includePinned) return 'pinned';

	  const typeCheck = isDeletableMessageType(msg.type, msg, options);
	  if (!typeCheck.ok) return typeCheck.reason;

	  if (options.content && !String(msg.content || '').toLowerCase().includes(String(options.content).toLowerCase())) {
	    return 'content mismatch';
	  }
	  if (options.hasLink && !messageHasLink(msg)) return 'missing link';
	  if (options.hasFile && !messageHasFile(msg)) return 'missing file';
	  if (regex && !regex.test(msg.content || '')) return 'regex mismatch';

	  return null;
	}

	function messageHasLink(msg) {
	  return /https?:\/\//i.test(msg.content || '') ||
	    (msg.embeds || []).some(embed => embed.url || embed.type === 'link');
	}

	function messageHasFile(msg) {
	  return (msg.attachments || []).length > 0;
	}

	const PREFIX$1 = '[ERASE]';

	const STATUS = Object.freeze({
	  IDLE: 'Idle',
	  PREPARING: 'Preparing',
	  SEARCHING: 'Searching',
	  WAITING_INDEX: 'Waiting for index',
	  RATE_LIMITED: 'Rate limited',
	  DELETING: 'Deleting',
	  PAUSED: 'Paused',
	  STOPPING: 'Stopping',
	  DONE: 'Done',
	  ERROR: 'Error',
	});

	const DELETE_RESULT = Object.freeze({
	  DELETED: 'deleted',
	  ALREADY_DELETED: 'already_deleted',
	  SKIPPED: 'skipped',
	  FAILED: 'failed',
	  FATAL: 'fatal',
	});

	const CONSERVATIVE_DELETE_DELAY_MS = 5500;
	const ADAPTIVE_DELETE_DELAY_MAX_MS = 12000;
	const ADAPTIVE_DELAY_EASE_AFTER_SUCCESSES = 10;

	function createState() {
	  return {
	    running: false,
	    paused: false,
	    stopRequested: false,
	    stopReason: null,
	    retentionSkipNotice: null,
	    status: STATUS.IDLE,

	    delCount: 0,
	    failCount: 0,
	    deletedCount: 0,
	    deleteAttemptCount: 0,
	    failedCount: 0,
	    skippedCount: 0,
	    alreadyDeletedCount: 0,
	    queuedCount: 0,
	    dryRunCount: 0,
	    grandTotal: 0,
	    remainingEstimate: 0,

	    offset: 0,
	    workingOffset: 0,
	    workingMaxId: null,
	    originalMaxId: null,
	    originalMinId: null,
	    iterations: 0,
	    searchedPages: 0,
	    emptyPageStreak: 0,
	    emptyPageSkips: 0,
	    stagnantCycles: 0,
	    recentDeletions: 0,

	    lastDeletedMessageId: null,
	    oldestProcessedMessageId: null,
	    currentChannelId: null,
	    currentGuildId: null,
	    fatalStatus: null,

	    seenMessageIds: new Set(),
	    processedMessageIds: new Set(),
	    queuedMessageIds: new Set(),
	    skipReasons: {},
	    rateLimitStats: {},
	    indexingWaitStats: { count: 0, totalWaitMs: 0, lastWaitMs: 0 },
	    currentDeleteDelay: 0,
	    deletePacingMode: 'adaptive',
	    stableDeleteCount: 0,
	    rateLimitedDeleteCount: 0,

	    _searchResponse: null,
	    _messagesToDelete: [],
	    _skippedMessages: [],
	  };
	}

	function createStats() {
	  return {
	    startTime: new Date(),
	    endTime: null,
	    throttledCount: 0,
	    throttledTotalTime: 0,
	    lastPing: 0,
	    avgPing: 0,
	    etr: 0,
	  };
	}

	/**
	 * Delete all messages in a Discord channel or DM
	 */
	const QUEUE_SAVE_SCHEMA = 1;
	const QUEUE_COUNTERS = ['deleted', 'skipped', 'failed', 'alreadyDeleted', 'previewed', 'issueSkipped'];
	const QUEUE_OPTION_KEYS = ['authorId', 'minId', 'maxId', 'content', 'hasLink', 'hasFile', 'includePinned', 'pattern',
	  'searchDelay', 'deleteDelay', 'deleteDelayFloor', 'deleteDelayCeiling', 'adaptiveDeletePacing', 'conservativeMode',
	  'prefetchPages', 'maxEmptyPageRetries', 'maxEmptyPageSkips', 'maxStagnantCycles', 'maxSearchPagesPerCycle',
	  'maxConsecutive429s', 'maxRuntimeMinutes', 'dryRun', 'verbose', 'jobDelay', 'keepRecentCount', 'protectionBeforeId'];
	const queueScopeKey = row => row.channelId ? `channel:${row.channelId}` : `server:${row.guildId}`;
	const validQueueId = value => typeof value === 'string' && /^\d{17,20}$/.test(value);
	function normalizeRecentTarget(key, value) {
	  if (!value || typeof value !== 'object') return null;
	  const match = /^(channel|server):(\d{17,20})$/.exec(key || '');
	  if (!match) return null;
	  const channelId = match[1] === 'channel' ? match[2] : '';
	  if (channelId ? value.channelId !== channelId : value.guildId !== match[2] || Boolean(value.channelId)) return null;
	  const guildId = value.guildId;
	  if (!(guildId === '@me' || validQueueId(guildId))) return null;
	  const kind = channelId ? guildId === '@me' ? value.kind : 'channel' : 'server';
	  if (!['dm', 'group', 'channel', 'server'].includes(kind) || (!channelId && guildId === '@me') ||
	    (channelId && guildId === '@me' && !['dm', 'group'].includes(kind))) return null;
	  const label = String(value.label || value.targetLabel || ({ dm: 'Direct message', group: 'Group chat', channel: 'Server channel', server: 'Server' })[kind]).slice(0, 180);
	  return { key, guildId, channelId, kind, label,
	    ...(kind === 'dm' && validQueueId(value.resolvedFriendId) ? { resolvedFriendId: value.resolvedFriendId } : {}) };
	}
	function mergeRecentQueueRows(rows, recent) {
	  const merged = new Map(rows.map(row => [row.key, row]));
	  for (const record of recent.values()) {
	    if (merged.has(record.key)) continue;
	    const target = normalizeRecentTarget(record.key, record.target);
	    if (target?.kind === 'dm') merged.set(record.key, { ...target, recentOnly: true });
	  }
	  return [...merged.values()];
	}
	function recentFriendIndex(recent) {
	  const index = new Map();
	  for (const record of recent.values()) {
	    const target = normalizeRecentTarget(record.key, record.target);
	    if (!target?.resolvedFriendId) continue;
	    const old = index.get(target.resolvedFriendId);
	    if (!old || old.at < record.at) index.set(target.resolvedFriendId, record);
	  }
	  return index;
	}
	const zeroQueueCounters = () => Object.fromEntries(QUEUE_COUNTERS.map(key => [key, 0]));
	function queueStateCounters(state) {
	  return { deleted: state.deletedCount || 0, skipped: state.skippedCount || 0, failed: state.failedCount || 0,
	    alreadyDeleted: state.alreadyDeletedCount || 0, previewed: state.dryRunCount || 0,
	    issueSkipped: (state.skipReasons?.permission || 0) + (state.skipReasons?.['archived thread'] || 0) };
	}
	function savedQueueOptions(options) {
	  const clean = {};
	  for (const key of QUEUE_OPTION_KEYS) if (options[key] !== undefined && options[key] !== null) {
	    const value = options[key];
	    if (!['string', 'boolean', 'number'].includes(typeof value) || (typeof value === 'string' && value.length > 10000) ||
	      (typeof value === 'number' && (!Number.isFinite(value) || value < 0))) throw new Error('Invalid saved queue settings');
	    clean[key] = value;
	  }
	  if (!validQueueId(clean.authorId) || !Number.isInteger(clean.keepRecentCount) || clean.keepRecentCount < 0 || clean.keepRecentCount > 1000) throw new Error('Invalid saved queue owner or protection');
	  for (const key of ['minId', 'maxId', 'protectionBeforeId']) if (clean[key] && !validQueueId(clean[key])) throw new Error('Invalid saved queue interval');
	  if (clean.pattern) new RegExp(clean.pattern, 'i');
	  return clean;
	}
	function validateQueuePlan(value, accountId) {
	  if (!value || value.schema !== QUEUE_SAVE_SCHEMA || value.accountId !== accountId || !validQueueId(accountId) ||
	    !/^[A-Za-z0-9_-]{1,80}$/.test(value.runId || '') || typeof value.ownerId !== 'string' || value.ownerId.length > 80 ||
	    !Number.isFinite(value.createdAt) || !Array.isArray(value.jobs) || !value.jobs.length || value.jobs.length > MAX_QUEUE_TARGETS) throw new Error('Saved queue is incompatible or incomplete');
	  const seen = new Set();
	  const jobs = value.jobs.map(row => {
	    if (!row || !(row.guildId === '@me' || validQueueId(row.guildId)) || (row.channelId && !validQueueId(row.channelId)) ||
	      (row.guildId === '@me' && !row.channelId)) throw new Error('Invalid saved queue target');
	    const key = queueScopeKey(row);
	    if (seen.has(key)) throw new Error('Duplicate saved queue target');
	    seen.add(key);
	    const kind = !row.channelId ? 'server' : row.guildId !== '@me' ? 'channel' : row.kind === 'group' ? 'group' : 'dm';
	    return { key, guildId: row.guildId, channelId: row.channelId || '', kind,
	      label: String(row.label || row.targetLabel || (kind === 'server' ? 'Server' : 'Chat')).slice(0, 180),
	      ...(validQueueId(row.resolvedFriendId) ? { resolvedFriendId: row.resolvedFriendId } : {}) };
	  });
	  const options = savedQueueOptions(value.options || {});
	  if (options.authorId !== accountId) throw new Error('Saved queue belongs to another account');
	  return { schema: QUEUE_SAVE_SCHEMA, accountId, runId: value.runId, ownerId: value.ownerId, createdAt: value.createdAt, jobs, options };
	}
	function validateQueueProgress(value, plan) {
	  if (!value || value.schema !== QUEUE_SAVE_SCHEMA || value.runId !== plan.runId ||
	    !Number.isInteger(value.nextIndex) || value.nextIndex < 0 || value.nextIndex > plan.jobs.length ||
	    !['ready', 'running', 'paused', 'stopped', 'complete'].includes(value.phase) ||
	    !Number.isFinite(value.updatedAt) || !Number.isFinite(value.elapsedMs) || value.elapsedMs < 0) throw new Error('Saved queue progress is incomplete');
	  const counters = source => Object.fromEntries(QUEUE_COUNTERS.map(key => {
	    const n = source?.[key];
	    if (!Number.isSafeInteger(n) || n < 0) throw new Error('Invalid saved queue counts');
	    return [key, n];
	  }));
	  const totals = counters(value.totals), targetCounters = counters(value.targetCounters);
	  for (const key of QUEUE_COUNTERS) if (targetCounters[key] > totals[key]) throw new Error('Inconsistent saved queue counts');
	  if (!Array.isArray(value.retention) || value.retention.length > 2000) throw new Error('Invalid saved protection');
	  const seen = new Set();
	  const retention = value.retention.map(pair => {
	    if (!Array.isArray(pair) || pair.length !== 2 || !validQueueId(pair[0]) || !(pair[1] === '0' || validQueueId(pair[1])) || seen.has(pair[0])) throw new Error('Invalid saved protection boundary');
	    seen.add(pair[0]); return [pair[0], pair[1]];
	  });
	  const scope = value.nextIndex < plan.jobs.length ? queueScopeKey(plan.jobs[value.nextIndex]) : null;
	  if (retention.length && value.scope !== scope) throw new Error('Saved protection belongs to another target');
	  return { schema: QUEUE_SAVE_SCHEMA, runId: plan.runId, phase: value.phase, updatedAt: value.updatedAt,
	    nextIndex: value.nextIndex, elapsedMs: value.elapsedMs, totals, targetCounters, scope, retention };
	}
	class QueueSaveStore {
	  constructor({ getValue, setValue, listValues, deleteValue, now = Date.now, ownerId } = {}) {
	    this.getValue = getValue; this.setValue = setValue; this.now = now; this.ownerId = ownerId;
	    this.listValues = listValues; this.deleteValue = deleteValue;
	    this.plan = null; this.progress = null; this.pending = null; this.writer = null;
	    this.recent = new Map(); this.recentDirty = new Set(); this.recentWriter = null; this.accountId = null;
	    this.recentGeneration = null; this.recentInitialized = false;
	  }
	  key(kind, account = this.accountId) { return `erase.${kind}.v1.${account}`; }
	  recentPrefix(account = this.accountId, generation = '') { return `erase.recent.v2.${account}.${generation ? generation + '.' : ''}`; }
	  async historyLock(account, work) {
	    return typeof navigator !== 'undefined' && navigator.locks?.request
	      ? navigator.locks.request(`erase-history-${account}`, work) : work();
	  }
	  async historyHead(account) {
	    const head = await this.getValue(this.key('recent-generation', account), null);
	    if (head !== null && (head?.schema !== 2 || !/^[A-Za-z0-9_-]{1,80}$/.test(head.generation || ''))) throw new Error('Saved deletion history is incompatible. It has not been overwritten.');
	    return head;
	  }
	  historyRecord(row) {
	    if (!row || !/^(channel|server):\d{17,20}$/.test(row.key) || !Number.isFinite(row.at) || row.at < 0 ||
	      row.at > this.now() + 300000 || !Number.isSafeInteger(row.count) || row.count <= 0) return null;
	    const target = normalizeRecentTarget(row.key, row.target);
	    return { key: row.key, at: row.at, count: row.count, runId: String(row.runId || '').slice(0, 80), ...(target ? { target } : {}) };
	  }
	  async removeHistoryKey(key) {
	    await this.deleteValue(key);
	    if (await this.getValue(key, null) !== null) throw new Error('Deletion history cleanup could not be verified');
	  }
	  async cleanupHistory(account, generation) {
	    const prefix = this.recentPrefix(account), active = this.recentPrefix(account, generation);
	    const assertCurrent = async () => { if ((await this.historyHead(account))?.generation !== generation) throw new Error('History changed during cleanup'); };
	    await assertCurrent();
	    for (const key of await this.listValues()) if (key.startsWith(prefix) && !key.startsWith(active)) { await assertCurrent(); await this.removeHistoryKey(key); }
	    await assertCurrent();
	    if (await this.getValue(this.key('recent', account), null) !== null) await this.removeHistoryKey(this.key('recent', account));
	  }
	  async put(key, value) {
	    if (typeof this.getValue !== 'function' || typeof this.setValue !== 'function') throw new Error('Tampermonkey storage is unavailable');
	    const encoded = JSON.stringify(value);
	    if (encoded.length > 2500000) throw new Error('Saved queue exceeds the storage safety limit');
	    await this.setValue(key, value);
	    if (JSON.stringify(await this.getValue(key, null)) !== encoded) throw new Error('Saved queue could not be verified');
	  }
	  async load(accountId) {
	    if (!validQueueId(accountId)) return null;
	    if (this.recentWriter || this.recentDirty.size) await this.flushRecent();
	    this.accountId = accountId;
	    await this.historyLock(accountId, async () => {
	      const head = await this.historyHead(accountId), generation = head?.generation || 'legacy';
	      const recent = new Map(), dirty = new Set(), prefix = this.recentPrefix(accountId, generation);
	      if (!head) {
	        const legacy = await this.getValue(this.key('recent', accountId), []);
	        for (const row of Array.isArray(legacy) ? legacy : []) {
	          const record = this.historyRecord(row);
	          if (record) { recent.set(record.key, record); dirty.add(record.key); }
	        }
	      }
	      for (const key of await this.listValues()) if (key.startsWith(prefix)) {
	        const record = this.historyRecord(await this.getValue(key, null));
	        if (!record || key !== prefix + record.key) throw new Error('A deletion history record could not be loaded. Saved data has been preserved.');
	        const old = recent.get(record.key);
	        if (!old || record.at >= old.at) recent.set(record.key, record);
	      }
	      if ((await this.historyHead(accountId))?.generation !== head?.generation) throw new Error('Deletion history changed in another tab. Reopen the queue.');
	      if (this.accountId !== accountId) return;
	      this.recent = recent; this.recentDirty = dirty; this.recentGeneration = generation; this.recentInitialized = !!head;
	      if (head) { try { await this.cleanupHistory(accountId, generation); } catch { log.warn('Deletion history loaded; old storage cleanup will retry next time.'); } }
	    });
	    if (this.accountId !== accountId) return null;
	    const rawPlan = await this.getValue(this.key('queue-plan', accountId), null);
	    const previous = [...this.recent.values()].some(row => !row.target) || !rawPlan
	      ? await this.getValue(this.key('queue-previous', accountId), null) : null;
	    if (this.accountId !== accountId) return null;
	    if (previous?.plan) {
	      try { this.enrichRecentTargets(validateQueuePlan(previous.plan, accountId).jobs); } catch { /* Invalid old identity data is not used. */ }
	    }
	    if (!rawPlan) return null;
	    try {
	      const plan = validateQueuePlan(rawPlan, accountId);
	      this.enrichRecentTargets(plan.jobs);
	      try { return { plan, progress: validateQueueProgress(await this.getValue(this.key('queue-progress', accountId), null), plan) }; }
	      catch { return { plan, progress: validateQueueProgress(await this.getValue(this.key('queue-progress-backup', accountId), null), plan), recovered: true }; }
	    } catch (error) {
	      const fallback = previous || await this.getValue(this.key('queue-previous', accountId), null);
	      if (!fallback) throw error;
	      const plan = validateQueuePlan(fallback.plan, accountId);
	      if (this.accountId !== accountId) return null;
	      this.enrichRecentTargets(plan.jobs);
	      return { plan, progress: validateQueueProgress(fallback.progress, plan), recovered: true };
	    }
	  }
	  async begin(jobs, options, saved = null) {
	    this.accountId = options.authorId;
	    let plan;
	    if (saved) {
	      const latest = await this.load(this.accountId);
	      if (!latest || latest.plan.runId !== saved.plan.runId) throw new Error('The saved queue changed. Restore it again before resuming.');
	      saved = latest;
	      plan = validateQueuePlan({ ...saved.plan, ownerId: this.ownerId }, this.accountId);
	    }
	    else {
	      const cutoff = dateToSnowflake(new Date(this.now()).toISOString());
	      const frozen = { ...normalizeSearchOptions(options), protectionBeforeId: minSnowflake([options.protectionBeforeId, cutoff]) };
	      frozen.maxId = minSnowflake([frozen.maxId, frozen.protectionBeforeId]);
	      plan = validateQueuePlan({ schema: QUEUE_SAVE_SCHEMA, accountId: this.accountId, runId: crypto.randomUUID(), ownerId: this.ownerId,
	        createdAt: this.now(), jobs, options: savedQueueOptions(frozen) }, this.accountId);
	      const previous = await this.load(this.accountId);
	      if (previous) await this.put(this.key('queue-previous'), previous);
	    }
	    const progress = saved ? validateQueueProgress(saved.progress, plan) : { schema: QUEUE_SAVE_SCHEMA, runId: plan.runId, phase: 'ready',
	      updatedAt: this.now(), nextIndex: 0, elapsedMs: 0, totals: zeroQueueCounters(), targetCounters: zeroQueueCounters(), scope: queueScopeKey(plan.jobs[0]), retention: [] };
	    await this.put(this.key('queue-plan'), plan);
	    this.plan = plan; this.progress = progress;
	    await this.save(progress);
	    return { plan, progress };
	  }
	  enrichRecentTargets(rows) {
	    for (const row of rows) {
	      const key = queueScopeKey(row), record = this.recent.get(key);
	      if (!record) continue;
	      const target = normalizeRecentTarget(key, row);
	      if (!target) continue;
	      if (target.kind === 'dm' && !target.resolvedFriendId && record.target?.resolvedFriendId) target.resolvedFriendId = record.target.resolvedFriendId;
	      if (JSON.stringify(record.target) !== JSON.stringify(target)) { this.recent.set(key, { ...record, target }); this.recentDirty.add(key); }
	    }
	  }
	  markDeleted(key, count, runId, at = this.now(), details = null) {
	    if (!/^(channel|server):\d{17,20}$/.test(key) || !Number.isSafeInteger(count) || count <= 0) return;
	    const old = this.recent.get(key);
	    const target = normalizeRecentTarget(key, details) || normalizeRecentTarget(key, old?.target);
	    this.recent.set(key, { key, at, runId, count: old?.runId === runId ? Math.max(old.count, count) : count, ...(target ? { target } : {}) });
	    this.recentDirty.add(key);
	  }
	  async flushRecent() {
	    if (!this.accountId) return;
	    while (this.recentDirty.size || this.recentWriter || (!this.recentInitialized && this.recent.size)) {
	      if (this.recentWriter) await this.recentWriter;
	      else {
	        const account = this.accountId;
	        const work = this.recentWriter = this.historyLock(account, async () => {
	          const head = await this.historyHead(account);
	          const generation = this.recentGeneration || head?.generation || 'legacy';
	          if (!head && !this.recentGeneration) {
	            const legacy = await this.getValue(this.key('recent', account), []);
	            for (const row of Array.isArray(legacy) ? legacy : []) {
	              const record = this.historyRecord(row);
	              if (record && !this.recent.has(record.key)) { this.recent.set(record.key, record); this.recentDirty.add(record.key); }
	            }
	          }
	          const assertCurrent = async () => {
	            if (((await this.historyHead(account))?.generation || 'legacy') !== generation) {
	              const error = new Error('Deletion history was cleared in another tab. Reopen Erase before continuing.');
	              error.historyCleared = true; throw error;
	            }
	          };
	          await assertCurrent();
	          this.recentGeneration = generation;
	          while (this.recentDirty.size) {
	            const key = this.recentDirty.values().next().value, record = this.recent.get(key);
	            this.recentDirty.delete(key);
	            const storageKey = this.recentPrefix(account, generation) + key;
	            try {
	              await assertCurrent();
	              await this.put(storageKey, record);
	              await assertCurrent();
	            } catch (error) { this.recentDirty.add(key); throw error; }
	          }
	          if (!head) await this.put(this.key('recent-generation', account), { schema: 2, generation });
	          this.recentInitialized = true;
	          if (!head) await this.cleanupHistory(account, generation);
	        });
	        try { await work; }
	        catch (error) {
	          if (error.historyCleared) { this.recent.clear(); this.recentDirty.clear(); this.recentGeneration = null; this.recentInitialized = false; }
	          throw error;
	        }
	        finally { if (this.recentWriter === work) this.recentWriter = null; }
	      }
	    }
	  }
	  async clearRecent() {
	    const account = this.accountId;
	    if (!validQueueId(account)) throw new Error('Sign in before clearing deletion history');
	    // Finish an already accepted write before publishing the clear marker. Old
	    // tabs may only write their old generation, so they cannot restore badges.
	    if (this.recentWriter) { try { await this.recentWriter; } catch { /* Explicit clear replaces failed history writes too. */ } }
	    return this.historyLock(account, async () => {
	      const generation = crypto.randomUUID();
	      await this.put(this.key('recent-generation', account), { schema: 2, generation });
	      if (this.accountId === account) {
	        this.recent.clear(); this.recentDirty.clear(); this.recentGeneration = generation; this.recentInitialized = true;
	      }
	      try { await this.cleanupHistory(account, generation); return { cleanupPending: false }; }
	      catch { return { cleanupPending: true }; }
	    });
	  }
	  async save(progress) {
	    const next = validateQueueProgress(progress, this.plan);
	    if (this.progress?.runId === next.runId && (next.nextIndex < this.progress.nextIndex ||
	      QUEUE_COUNTERS.some(key => next.totals[key] < this.progress.totals[key]))) throw new Error('Stale queue progress was rejected');
	    this.pending = next;
	    while (this.pending || this.writer) {
	      if (this.writer) await this.writer;
	      else {
	        const work = this.writer = this.drain();
	        try { await work; } catch (error) { this.pending = null; throw error; }
	        finally { if (this.writer === work) this.writer = null; }
	      }
	    }
	  }
	  async drain() {
	    while (this.pending) {
	      const next = this.pending; this.pending = null;
	      const owner = await this.getValue(this.key('queue-plan'), null);
	      if (owner?.runId !== this.plan.runId || owner.ownerId !== this.ownerId) throw new Error('Another tab owns this saved queue');
	      await this.flushRecent();
	      if (this.progress?.runId === this.plan.runId) await this.put(this.key('queue-progress-backup'), this.progress);
	      await this.put(this.key('queue-progress'), next); this.progress = next;
	    }
	  }
	}

	class EraseCore {

	  options = {
	    authToken: null,
	    authorId: null,
	    guildId: null,
	    channelId: null,
	    minId: null,
	    maxId: null,
	    content: null,
	    hasLink: null,
	    hasFile: null,
	    includeNsfw: null,
	    includePinned: null,
	    pattern: null,
	    searchDelay: 30000,
	    deleteDelay: 1000,
	    deleteDelayFloor: 1000,
	    deleteDelayCeiling: ADAPTIVE_DELETE_DELAY_MAX_MS,
	    adaptiveDeletePacing: false,
	    conservativeMode: false,
	    prefetchPages: 2,
	    maxEmptyPageRetries: 1,
	    maxEmptyPageSkips: 3,
	    maxStagnantCycles: 3,
	    maxSearchPagesPerCycle: 6,
	    maxConsecutive429s: 6,
	    maxRuntimeMinutes: 0,
	    dryRun: false,
	    verbose: false,
	    jobDelay: 30000,
	    askForConfirmation: true,
	  };

	  state = createState();
	  stats = createStats();

	  onStart = undefined;
	  onProgress = undefined;
	  onStop = undefined;
	  onQueueCheckpoint = undefined;
	  onDeleted = undefined;

	  constructor(deps = {}) {
	    this.waitFn = deps.waitFn || wait;
	    this.fetchFn = deps.fetchFn || fetch;
	    this.apiClient = deps.apiClient || this.createApiClient();
	    this.abortController = null;
	    this._stopNotified = false;
	    this._runActive = false;
	    this.batch = null;
	    this.retentionBoundaries = new Map();
	  }

	  createApiClient() {
	    return new DiscordApiClient({
	      fetchFn: this.fetchFn,
	      waitFn: this.waitFn,
	      rateLimit: new RateLimitManager({ waitFn: this.waitFn }),
	      onStatus: (message, waitMs) => {
	        this.setStatus(STATUS.RATE_LIMITED);
	        this.setActivity(message, waitMs);
	        log.warn(`${message}; retrying after ${(waitMs / 1000).toFixed(2)}s.`);
	      },
	    });
	  }

	  resetState() {
	    this.state = createState();
	    this.stats = createStats();
	    this.options.askForConfirmation = true;
	    this._stopNotified = false;
	  }

	  queueCheckpointSnapshot(phase) {
	    const batch = this.batch;
	    if (!batch) return null;
	    const current = batch.currentIncluded ? zeroQueueCounters() : queueStateCounters(this.state);
	    const totals = Object.fromEntries(QUEUE_COUNTERS.map(key => [key, (batch[key] || 0) + current[key]]));
	    const targetCounters = batch.completed >= batch.index ? zeroQueueCounters() : Object.fromEntries(QUEUE_COUNTERS.map(key =>
	      [key, (batch.targetBase?.[key] || 0) + (queueStateCounters(this.state)[key] || 0)]));
	    return { phase: phase || (this.state.paused || batch.paused ? 'paused' : 'running'), updatedAt: Date.now(),
	      nextIndex: batch.completed, totals, targetCounters, elapsedMs: Math.max(0, Date.now() - batch.startedAt),
	      scope: batch.completed < batch.total ? queueScopeKey(batch.jobs[batch.completed]) : null,
	      retention: batch.completed < batch.index ? (batch.savedBoundaries || []) : [] };
	  }

	  async checkpointBatch(phase) {
	    if (this.batch && this.onQueueCheckpoint && !this.options.dryRun) await this.onQueueCheckpoint(this.queueCheckpointSnapshot(phase));
	  }

	  async runBatch(queue, recovery = null) {
	    if (this._runActive || this.batch) return;
	    if (!queue.length || queue.length > MAX_QUEUE_TARGETS) throw new Error(`Choose between 1 and ${MAX_QUEUE_TARGETS.toLocaleString()} queue targets.`);
	    const baseOptions = { ...this.options };
	    const startIndex = recovery?.nextIndex || 0;
	    const batch = this.batch = { controller: new AbortController(), paused: false, index: startIndex,
	      total: queue.length, completed: startIndex, attempted: startIndex, ...zeroQueueCounters(), ...(recovery?.totals || {}),
	      startedAt: Date.now() - (recovery?.elapsedMs || 0), jobs: queue, currentIncluded: true,
	      targetBase: recovery?.targetCounters || zeroQueueCounters(), savedBoundaries: recovery?.retention || [] };
	    let waitBeforeNextJob = false;
	    try {
	      for (let i = startIndex; i < queue.length; i++) {
	        if (batch.controller.signal.aborted) break;
	        batch.index = i + 1;
	        this.resetState();
	        this.options = { ...baseOptions, ...queue[i] };
	        batch.currentIncluded = false;
	        if (i !== startIndex) { batch.targetBase = zeroQueueCounters(); batch.savedBoundaries = []; }
	        this.resumeRetention = i === startIndex ? (recovery?.retention || []) : [];
	        this.state.paused = batch.paused;
	        await this.checkpointBatch();
	        if (i > 0 && waitBeforeNextJob) {
	          this.state.status = STATUS.PREPARING;
	          this.setActivity('Waiting before the next queued target', baseOptions.jobDelay);
	          await this.waitFn(baseOptions.jobDelay, batch.controller.signal);
	        }
	        while (batch.paused && !batch.controller.signal.aborted) await this.waitFn(250, batch.controller.signal);
	        if (batch.controller.signal.aborted) break;
	        log.info(`Starting queued target ${i + 1} of ${queue.length}.`);
	        batch.attempted++;
	        await this.run(true);
	        waitBeforeNextJob = this.state.deleteAttemptCount > 0;
	        batch.deleted += this.state.deletedCount;
	        batch.skipped += this.state.skippedCount;
	        batch.failed += this.state.failedCount;
	        batch.alreadyDeleted += this.state.alreadyDeletedCount;
	        batch.previewed += this.state.dryRunCount;
	        batch.issueSkipped += (this.state.skipReasons.permission || 0) + (this.state.skipReasons['archived thread'] || 0);
	        batch.currentIncluded = true;
	        if (![STOP_REASONS.VERIFIED_COMPLETE, STOP_REASONS.NO_DELETABLE_MESSAGES].includes(this.state.stopReason)) break;
	        batch.completed++;
	        batch.savedBoundaries = []; batch.targetBase = zeroQueueCounters();
	        await this.checkpointBatch(batch.completed === batch.total ? 'complete' : 'running');
	      }
	    } catch (error) {
	      if (error.name !== 'AbortError') {
	        this.state.stopReason = STOP_REASONS.ERROR;
	        log.error('Queue stopped:', error.message);
	      }
	    } finally {
	      try { await this.checkpointBatch(batch.completed === batch.total ? 'complete' : 'stopped'); }
	      catch (error) { this.state.stopReason = STOP_REASONS.ERROR; log.error('Queue save failed:', error.message); }
	      this.state.queueSummary = { completed: batch.completed, total: batch.total, deleted: batch.deleted,
	        skipped: batch.skipped, failed: batch.failed, attempted: batch.attempted,
	        alreadyDeleted: batch.alreadyDeleted, previewed: batch.previewed, issueSkipped: batch.issueSkipped,
	        elapsedMs: Math.max(0, Date.now() - batch.startedAt) };
	      if (batch.controller.signal.aborted && this.state.stopReason !== STOP_REASONS.ERROR) this.state.stopReason = STOP_REASONS.USER_STOPPED;
	      this.state.status = [STOP_REASONS.VERIFIED_COMPLETE, STOP_REASONS.NO_DELETABLE_MESSAGES, STOP_REASONS.USER_STOPPED].includes(this.state.stopReason) ? STATUS.DONE : STATUS.ERROR;
	      this.state.paused = false;
	      this.state.waitUntil = 0;
	      this.batch = null;
	      this.options.authToken = null;
	      this.onProgress?.(this.state, this.stats);
	      this.onStop?.(this.state, this.stats);
	      log.info(`Queue ended: ${batch.completed}/${batch.total} targets completed, ${batch.deleted} deleted.`);
	    }
	  }

	  async run(isJob = false) {
	    if (this._runActive || (this.batch && !isJob)) return log.error('Already running!');
	    this._runActive = true;
	    try {
	      this.prepareRun();
	      if (this.onStart) this.onStart(this.state, this.stats);
	      if (this.options.verifyContext) await this.verifyRunContext();
	      if (this.options.channelId && this.options.keepRecentCount) {
	        await this.resolveRetention(this.options.channelId);
	        if (this.retentionBoundaries.get(this.options.channelId) === '0') {
	          this.state.stopReason = STOP_REASONS.NO_DELETABLE_MESSAGES;
	          return;
	        }
	        // Do not search the protected window. The final per-message guard remains
	        // authoritative, and an existing stricter date/ID boundary is preserved.
	        this.state.workingMaxId = minSnowflake([this.state.workingMaxId, this.retentionBoundaries.get(this.options.channelId)]);
	      }
	      while (this.state.running) {
	        this.state.iterations++;
	        this.checkRuntimeLimit();
	        await this.waitIfPaused();

	        const work = await this.collectSearchWork();
	        if (!this.state.running) break;

	        if (work.queue.length > 0) {
	          if (await this.confirm(work.queue) === false) {
	            this.requestStop(STOP_REASONS.USER_STOPPED);
	            break;
	          }

	          if (this.options.dryRun) this.recordDryRun(work.queue);
	          else await this.deleteMessagesFromList(work.queue);

	          this.advanceAfterWork(work.processedMessages);
	          this.resetEmptyRecovery();
	        } else if (work.processedMessages.length > 0) {
	          log.warn('No deletable messages found on this page; advancing within the selected scope.');
	          this.advanceAfterWork(work.processedMessages);
	        } else {
	          const keepGoing = await this.handleEmptySearchPage(work.emptyResponse || this.state._searchResponse || {});
	          if (!keepGoing) break;
	        }

	        this.calcEtr();
	        if (this.onProgress) this.onProgress(this.state, this.stats);

	        if (this.state.running && (work.queue.length > 0 || work.processedMessages.length === 0)) {
	          log.verb(`Waiting ${(this.options.searchDelay / 1000).toFixed(2)}s before next search...`);
	          this.setActivity('Waiting before the next search', this.options.searchDelay);
	          await this.waitFn(this.options.searchDelay, this.abortController.signal);
	        }
	      }
	    } catch (err) {
	      if (err.name === 'AbortError' || this.state.stopRequested) {
	        this.state.stopReason = STOP_REASONS.USER_STOPPED;
	      } else {
	        this.state.stopReason = this.state.stopReason || STOP_REASONS.ERROR;
	        this.setStatus(STATUS.ERROR);
	        log.error('CoreException', err);
	      }
	    } finally {
	      try { this.finishRun(); } finally { this._runActive = false; }
	    }
	  }

	  setActivity(text, waitMs = 0) {
	    this.state.activity = text;
	    this.state.waitUntil = waitMs > 0 ? Date.now() + waitMs : 0;
	    this.onProgress?.(this.state, this.stats);
	  }

	  async verifyRunContext() {
	    this.setActivity('Verifying the signed-in account and selected scope');
	    const signal = this.abortController.signal;
	    const me = await this.apiClient.getResource('/users/@me', this.options.authToken, signal);
	    if (!me.ok || me.body?.id !== this.options.authorId) throw new Error('The selected author does not match the signed-in account. Nothing deleted.');
	    if (this.options.channelId) {
	      const result = await this.apiClient.getResource(`/channels/${this.options.channelId}`, this.options.authToken, signal);
	      const channel = result.body;
	      if (!result.ok || channel?.id !== this.options.channelId || (channel.guild_id || '@me') !== this.options.guildId) {
	        throw new Error('The channel no longer matches the selected scope. Nothing deleted.');
	      }
	      const recipients = channel.recipients?.length ? channel.recipients.map(user => user?.id) : channel.recipient_ids;
	      const peerId = channel.type === 1 && Array.isArray(recipients) && recipients.length === 1 && validQueueId(recipients[0]) ? recipients[0] : '';
	      if (this.options.resolvedFriendId && peerId !== this.options.resolvedFriendId) throw new Error('The DM recipient no longer matches the selected person. Nothing deleted.');
	      this.recentTarget = normalizeRecentTarget(queueScopeKey(this.options), {
	        ...this.options, kind: channel.type === 1 ? 'dm' : channel.type === 3 ? 'group' : 'channel',
	        label: this.options.targetLabel || channel.name || channel.recipients?.[0]?.global_name || channel.recipients?.[0]?.username,
	        resolvedFriendId: peerId,
	      });
	      this.options.includeNsfw = Boolean(channel.nsfw);
	      // Threads inherit their parent channel's age restriction.
	      if (channel.parent_id && [10, 11, 12].includes(channel.type)) {
	        const parent = await this.apiClient.getResource(`/channels/${channel.parent_id}`, this.options.authToken, signal);
	        if (!parent.ok) throw new Error('Could not verify the thread age restriction. Nothing deleted.');
	        this.options.includeNsfw ||= Boolean(parent.body?.nsfw);
	      }
	    } else {
	      if (this.options.guildId === '@me') throw new Error('Select a direct or group chat.');
	      this.recentTarget = normalizeRecentTarget(queueScopeKey(this.options), { ...this.options, kind: 'server' });
	      // A server-wide search must cover its age-restricted channels too.
	      this.options.includeNsfw = true;
	    }
	  }

	  async resolveRetention(channelId) {
	    if (!this.options.keepRecentCount || this.retentionBoundaries.has(channelId)) return;
	    if (this.retentionBoundaries.size >= 2000) throw new Error('Channel protection limit reached. Narrow the selected server scope.');
	    this.setStatus(STATUS.PREPARING);
	    this.setActivity(`Protecting the newest ${this.options.keepRecentCount} messages in this channel`);
	    let remaining = this.options.keepRecentCount;
	    let before = this.options.protectionBeforeId || null;
	    const seen = new Set();
	    while (remaining > 0) {
	      await this.waitIfPaused();
	      if (!this.state.running || this.state.stopRequested) throw new DOMException('Stopped', 'AbortError');
	      const limit = Math.min(100, remaining);
	      const result = await this.apiClient.getResource(`/channels/${channelId}/messages?limit=${limit}${before ? `&before=${before}` : ''}`, this.options.authToken, this.abortController.signal);
	      if (!result.ok || !Array.isArray(result.body)) throw new Error('Could not verify recent-message protection. This target was stopped safely.');
	      const rows = result.body;
	      if (rows.length > limit) throw new Error('Unexpected history page size. This target was stopped safely.');
	      for (const message of rows) {
	        if (typeof message?.id !== 'string' || !/^\d{17,20}$/.test(message.id) || message.channel_id !== channelId || seen.has(message.id) || (before && compareSnowflakes(message.id, before) >= 0)) {
	          throw new Error('Recent-message history is inconsistent. This target was stopped safely.');
	        }
	        seen.add(message.id);
	      }
	      remaining -= rows.length;
	      if (rows.length) before = minSnowflake(rows.map(message => message.id));
	      if (rows.length < limit) { before = '0'; break; }
	    }
	    this.retentionBoundaries.set(channelId, before || '0');
	    if (this.batch) this.batch.savedBoundaries = Array.from(this.retentionBoundaries.entries());
	    await this.checkpointBatch();
	    this.state.protectedChannels = this.retentionBoundaries.size;
	    if (before === '0') {
	      const target = !this.options.channelId ? 'channel' : this.batch ? `queued chat ${this.batch.index} of ${this.batch.total}` : 'chat';
	      const count = seen.size.toLocaleString();
	      const notice = `Skipped ${target}: found ${count} ${seen.size === 1 ? 'message' : 'messages'}. Keep newest is set to ${this.options.keepRecentCount.toLocaleString()}, so all ${count} are protected. Nothing deleted.`;
	      if (channelId === this.options.channelId) this.state.retentionSkipNotice = notice;
	      log.info(notice);
	      console.info('[ERASE]', notice);
	    }
	    this.setStatus(STATUS.SEARCHING);
	  }

	  async protectSearchWork(result) {
	    if (!this.options.keepRecentCount) return result;
	    const eligible = [];
	    for (const message of result.messagesToDelete) {
	      await this.resolveRetention(message.channel_id);
	      if (compareSnowflakes(message.id, this.retentionBoundaries.get(message.channel_id)) >= 0) {
	        result.skippedMessages.push({ message, reason: 'newest messages protected' });
	      } else eligible.push(message);
	    }
	    result.messagesToDelete = eligible;
	    return result;
	  }

	  prepareRun() {
	    this.recentTarget = null;
	    this.retentionBoundaries.clear();
	    for (const [channelId, boundary] of this.resumeRetention || []) this.retentionBoundaries.set(channelId, boundary);
	    this.resumeRetention = null;
	    this.options = normalizeSearchOptions(this.options);
	    const requestedDeleteDelay = Math.max(this.options.deleteDelay, this.options.deleteDelayFloor);
	    this.options.deleteDelay = requestedDeleteDelay;

	    this.abortController = new AbortController();
	    this.apiClient = this.createApiClient();
	    this.state.running = true;
	    this.state.stopRequested = false;
	    this.state.status = STATUS.PREPARING;
	    this.state.currentChannelId = this.options.channelId || null;
	    this.state.currentGuildId = this.options.guildId || null;
	    this.state.originalMaxId = this.options.maxId || null;
	    this.state.originalMinId = this.options.minId || null;
	    this.state.workingMaxId = this.options.maxId || null;
	    this.state.workingOffset = 0;
	    this.state.offset = 0;
	    this.state.deletePacingMode = this.options.conservativeMode ? 'conservative' : (this.options.adaptiveDeletePacing ? 'adaptive' : 'classic');
	    this.state.currentDeleteDelay = this.options.conservativeMode
	      ? Math.max(requestedDeleteDelay, CONSERVATIVE_DELETE_DELAY_MS)
	      : requestedDeleteDelay;
	    this.stats.startTime = new Date();

	    log.success(`\nStarted at ${this.stats.startTime.toLocaleString()}`);
	    log.warn('Warning: automating a normal Discord user account can violate Discord policy and may risk account action. Use at your own risk.');
	    log.debug(
	      `authorId = "${redact(this.options.authorId)}"`,
	      `guildId = "${redact(this.options.guildId)}"`,
	      `channelId = "${redact(this.options.channelId)}"`,
	      `minId = "${redact(this.options.minId)}"`,
	      `maxId = "${redact(this.options.maxId)}"`,
	      `hasLink = ${!!this.options.hasLink}`,
	      `hasFile = ${!!this.options.hasFile}`,
	      `includePinned = ${!!this.options.includePinned}`,
	      `dryRun = ${!!this.options.dryRun}`,
	    );
	  }

	  checkRuntimeLimit() {
	    if (!this.options.maxRuntimeMinutes) return;
	    const runtimeMs = Date.now() - this.stats.startTime.getTime();
	    if (runtimeMs > this.options.maxRuntimeMinutes * 60000) {
	      this.state.stopReason = STOP_REASONS.RUNTIME_LIMIT;
	      this.state.running = false;
	      log.warn(`Stopped because max runtime of ${this.options.maxRuntimeMinutes} minutes was reached.`);
	    }
	  }

	  async collectSearchWork() {
	    this.state.queuedMessageIds = new Set();
	    this.state._messagesToDelete = [];
	    this.state._skippedMessages = [];

	    const queue = [];
	    const processedMessages = [];
	    let emptyResponse = null;
	    let pagesFetched = 0;

	    while (this.state.running &&
	      pagesFetched < this.options.prefetchPages &&
	      pagesFetched < this.options.maxSearchPagesPerCycle) {
	      const data = await this.search();
	      const filter = await this.protectSearchWork(this.filterResponse(data));
	      pagesFetched++;

	      if (filter.discoveredMessages.length === 0) {
	        emptyResponse = data;
	        break;
	      }

	      let newIdsOnPage = 0;
	      for (const skipped of filter.skippedMessages) {
	        if (this.recordSkipped(skipped)) {
	          processedMessages.push(skipped.message);
	          newIdsOnPage++;
	        }
	      }

	      for (const message of filter.messagesToDelete) {
	        if (this.state.processedMessageIds.has(message.id) || this.state.queuedMessageIds.has(message.id)) continue;
	        this.state.queuedMessageIds.add(message.id);
	        this.state.seenMessageIds.add(message.id);
	        queue.push(message);
	        processedMessages.push(message);
	        newIdsOnPage++;
	      }

	      this.state.queuedCount = queue.length;
	      this.state._messagesToDelete = queue;
	      this.state._skippedMessages = processedMessages.filter(message => !this.state.queuedMessageIds.has(message.id));

	      if (newIdsOnPage === 0) {
	        this.state.stagnantCycles++;
	        log.warn(`Search page contained only previously processed IDs; stagnantCycles=${this.state.stagnantCycles}.`);
	        if (advanceCursorFromMessages(this.state, filter.discoveredMessages)) {
	          log.info(`Advanced cursor to ${redact(this.state.workingMaxId)} to avoid stale IDs.`);
	        }
	        break;
	      }

	      if (typeof data.total_results === 'number' && Number.isFinite(data.total_results) &&
	        this.state.workingOffset + filter.discoveredMessages.length >= data.total_results) break;

	      if (pagesFetched < this.options.prefetchPages) {
	        this.state.workingOffset += MESSAGES_PER_SEARCH_PAGE;
	        this.state.offset = this.state.workingOffset;
	      }
	    }

	    return { queue, processedMessages, emptyResponse };
	  }

	  async search() {
	    this.setStatus(STATUS.SEARCHING);
	    this.setActivity(`Searching older messages, page ${this.state.searchedPages + 1}`);

	    for (let attempt = 0; attempt < 20 && this.state.running; attempt++) {
	      this.beforeRequest();
	      const result = await this.apiClient.searchMessages(
	        this.options.authToken,
	        this.options,
	        this.state,
	        this.abortController.signal,
	      );
	      this.afterRequest();
	      this.syncRateLimitStats();

	      if (result.status === 202) {
	        const waitMs = this.retryAfterMs(result.body, this.options.searchDelay);
	        this.stats.indexingWaitStats = this.state.indexingWaitStats;
	        this.state.indexingWaitStats.count++;
	        this.state.indexingWaitStats.totalWaitMs += waitMs;
	        this.state.indexingWaitStats.lastWaitMs = waitMs;
	        this.setStatus(STATUS.WAITING_INDEX);
	        this.setActivity('Discord is preparing its search index', waitMs);
	        log.warn(`Search index not ready; retrying after ${(waitMs / 1000).toFixed(2)}s.`);
	        await this.waitFn(waitMs, this.abortController.signal);
	        continue;
	      }

	      if (result.status === 429) {
	        this.state.stopReason = STOP_REASONS.RATE_LIMIT_SAFETY;
	        this.state.running = false;
	        log.error('Stopped because repeated rate limits exceeded the safety cap.');
	        return { messages: [], total_results: 0 };
	      }

	      if (!result.ok) {
	        return this.handleSearchError(result);
	      }

	      const data = result.body || { messages: [], total_results: 0 };
	      this.state._searchResponse = data;
	      this.state.searchedPages++;
	      if (data.total_results > this.state.grandTotal) this.state.grandTotal = data.total_results;
	      this.state.remainingEstimate = Math.max(0, (data.total_results || 0) - calculateProgress(this.state));

	      const pageHits = Array.isArray(data.messages) ? data.messages.length : 0;
	      log.verb(
	        `Fetched page: total=${data.total_results || 0}, pageHits=${pageHits}, ` +
	        `offset=${this.state.workingOffset}, cursor=max_id=${redact(this.state.workingMaxId || '')}, ` +
	        `emptyStreak=${this.state.emptyPageStreak}.`
	      );
	      if (this.options.verbose) console.log(PREFIX$1, 'search', this.exportDiagnostics());
	      return data;
	    }

	    this.state.stopReason = STOP_REASONS.ERROR;
	    this.state.running = false;
	    log.error('Search retry budget exhausted.');
	    return { messages: [], total_results: 0 };
	  }

	  handleSearchError(result) {
	    const body = result.body || {};
	    if (result.status === 401) {
	      this.state.stopReason = STOP_REASONS.AUTH_ERROR;
	      this.state.running = false;
	      log.error('Search failed with 401 Unauthorized. Check the authorization token.');
	    } else if (result.status === 403) {
	      this.state.stopReason = STOP_REASONS.PERMISSION_ERROR;
	      this.state.running = false;
	      log.warn('Search failed with 403 Missing Access/Permission for this channel. Skipping this scope.');
	    } else if (result.status === 404) {
	      this.state.stopReason = STOP_REASONS.NOT_FOUND;
	      this.state.running = false;
	      log.warn('Search failed with 404 Not Found. Check the selected server/channel.');
	    } else {
	      this.state.stopReason = STOP_REASONS.ERROR;
	      this.state.running = false;
	      log.error(`Error searching messages, API responded with status ${result.status}!`, body);
	    }
	    this.state.fatalStatus = result.status;
	    this.state._searchResponse = { messages: [], total_results: 0, error: body };
	    return this.state._searchResponse;
	  }

	  filterResponse(data) {
	    const result = filterSearchResponse(data, this.options, this.state);

	    if (result.patternError) {
	      log.warn('Malformed RegExp; skipping matched page instead of broadening deletion scope.', result.patternError.message);
	    }

	    this.state._messagesToDelete = result.messagesToDelete;
	    this.state._skippedMessages = result.skippedMessages.map(item => item.message);

	    if (this.options.verbose) {
	      log.debug('Filter result', {
	        discovered: result.discoveredMessages.length,
	        queued: result.messagesToDelete.length,
	        skipped: result.skippedMessages.length,
	        skipReasons: result.skipReasons,
	      });
	    }

	    if (this.options.verbose) console.log(PREFIX$1, 'filterResponse', this.exportDiagnostics());
	    return result;
	  }

	  recordSkipped(skipped, forceLog = false) {
	    const { message, reason } = skipped;
	    if (!message?.id) return false;
	    this.state.seenMessageIds.add(message.id);

	    if (reason === 'duplicate') return false;
	    if (this.state.processedMessageIds.has(message.id)) return false;

	    this.state.processedMessageIds.add(message.id);
	    this.state.skippedCount++;
	    this.state.skipReasons[reason] = (this.state.skipReasons[reason] || 0) + 1;

	    if (forceLog || this.options.verbose || ['pinned', 'author mismatch'].includes(reason)) {
	      this.logMessageOutcome(message, 'Skipped', 'warn', reason);
	    }
	    return true;
	  }

	  async deleteMessagesFromList(messages) {
	    this.setStatus(STATUS.DELETING);
	    this.state.recentDeletions = 0;

	    for (let i = 0; i < messages.length; i++) {
	      const message = messages[i];
	      if (!this.state.running || this.state.stopRequested) return log.warn('Stopped by user.');
	      await this.waitIfPaused();
	      if (!this.state.running || this.state.stopRequested) return;
	      this.setStatus(STATUS.DELETING);
	      this.setActivity(`Deleting message ${i + 1} of ${messages.length} in this batch`);

	      const result = await this.deleteMessage(message);
	      if (result === DELETE_RESULT.FATAL) return;

	      this.calcEtr();
	      if (this.onProgress) this.onProgress(this.state, this.stats);

	      if (this.state.running && i < messages.length - 1) {
	        await this.waitFn(this.getDeleteDelay(), this.abortController.signal);
	      }
	    }
	  }

	  async deleteMessage(message) {
	    if (!this.state.running || this.state.stopRequested || this.abortController.signal.aborted) return DELETE_RESULT.FATAL;
	    const skip = getSkipReason(message, this.options, this.options.pattern ? new RegExp(this.options.pattern, 'i') : null);
	    if (skip) { this.recordDeleteSkip(message, skip); return DELETE_RESULT.SKIPPED; }
	    if (this.options.keepRecentCount) {
	      const boundary = this.retentionBoundaries.get(message.channel_id);
	      if (!boundary) throw new Error('Recent-message protection was not verified. Nothing further deleted.');
	      if (compareSnowflakes(message.id, boundary) >= 0) {
	        this.recordDeleteSkip(message, 'newest messages protected');
	        return DELETE_RESULT.SKIPPED;
	      }
	    }
	    const rateLimitHitsBefore = this.getRateLimitHitCount();
	    this.state.deleteAttemptCount++;
	    const result = await this.apiClient.deleteMessage(this.options.authToken, message, this.abortController.signal);
	    this.syncRateLimitStats();
	    this.adjustDeletePacing(this.getRateLimitHitCount() > rateLimitHitsBefore);

	    if (result.ok || result.status === 204) {
	      this.state.delCount++;
	      this.state.deletedCount++;
	      this.state.recentDeletions++;
	      this.state.lastDeletedMessageId = message.id;
	      this.state.processedMessageIds.add(message.id);
	      this.state.seenMessageIds.add(message.id);
	      this.logMessageOutcome(message, 'Deleted', 'success');
	      this.onDeleted?.(queueScopeKey(this.options), (this.batch?.targetBase?.deleted || 0) + this.state.deletedCount);
	      return DELETE_RESULT.DELETED;
	    }

	    if (result.status === 404) {
	      this.state.alreadyDeletedCount++;
	      this.state.processedMessageIds.add(message.id);
	      this.logMessageOutcome(message, 'Already deleted', 'warn');
	      return DELETE_RESULT.ALREADY_DELETED;
	    }

	    if (result.status === 401) {
	      this.state.stopReason = STOP_REASONS.AUTH_ERROR;
	      this.state.running = false;
	      this.logMessageOutcome(message, 'Failed', 'error', '401 Unauthorized; run stopped');
	      return DELETE_RESULT.FATAL;
	    }

	    if (result.status === 403) {
	      this.recordDeleteSkip(message, 'permission');
	      return DELETE_RESULT.SKIPPED;
	    }

	    if (result.status === 400 && result.body?.code === 50083) {
	      this.recordDeleteSkip(message, 'archived thread');
	      return DELETE_RESULT.SKIPPED;
	    }

	    this.state.failCount++;
	    this.state.failedCount++;
	    this.state.processedMessageIds.add(message.id);
	    this.logMessageOutcome(message, 'Failed', 'error', `HTTP ${result.status || 'network error'}`);
	    return DELETE_RESULT.FAILED;
	  }

	  logMessageOutcome(message, outcome, level, reason = '') {
	    const text = String(message.content || '').replace(/\s+/g, ' ').slice(0, 700);
	    const excerpt = text ? `: <i>${redact(text)}${String(message.content || '').length > 700 ? '…' : ''}</i>` : '';
	    const attachments = message.attachments?.length ? ` · ${message.attachments.length} attachment${message.attachments.length === 1 ? '' : 's'}` : '';
	    const when = message.timestamp ? `<sup>${new Date(message.timestamp).toLocaleString()}</sup> ` : '';
	    log[level](`<b>${outcome}</b>${reason ? ` (${reason})` : ''} · ${when}${redact(message.author?.username || 'Your message')}${excerpt}${attachments} <sup>{ID:${redact(message.id)}}</sup>`);
	  }

	  getRateLimitHitCount() {
	    return this.apiClient?.rateLimit?.stats?.hits || 0;
	  }

	  getDeleteDelay() {
	    return Math.max(0, this.state.currentDeleteDelay ?? this.options.deleteDelay ?? 0);
	  }

	  adjustDeletePacing(rateLimited) {
	    const baseDelay = Math.max(this.options.deleteDelay, this.options.deleteDelayFloor);

	    if (this.options.conservativeMode) {
	      this.state.currentDeleteDelay = Math.max(baseDelay, CONSERVATIVE_DELETE_DELAY_MS);
	      this.state.deletePacingMode = 'conservative';
	      this.state.stableDeleteCount = 0;
	      return;
	    }

	    if (!this.options.adaptiveDeletePacing) {
	      this.state.currentDeleteDelay = baseDelay;
	      this.state.deletePacingMode = 'classic';
	      this.state.stableDeleteCount = 0;
	      return;
	    }

	    this.state.deletePacingMode = 'adaptive';
	    const ceiling = Math.max(baseDelay, this.options.deleteDelayCeiling || ADAPTIVE_DELETE_DELAY_MAX_MS);
	    const current = Math.max(baseDelay, this.getDeleteDelay());

	    if (rateLimited) {
	      this.state.stableDeleteCount = 0;
	      this.state.rateLimitedDeleteCount++;
	      const nextDelay = Math.min(ceiling, Math.max(current + 500, Math.ceil(current * 1.6)));
	      if (nextDelay > current) {
	        log.warn(`Adaptive delete pacing increased to ${nextDelay}ms after a rate-limit response.`);
	      }
	      this.state.currentDeleteDelay = nextDelay;
	      return;
	    }

	    this.state.stableDeleteCount++;
	    if (this.state.stableDeleteCount >= ADAPTIVE_DELAY_EASE_AFTER_SUCCESSES && current > baseDelay) {
	      const nextDelay = Math.max(baseDelay, Math.floor(current * 0.85));
	      if (nextDelay < current) {
	        log.info(`Adaptive delete pacing eased to ${nextDelay}ms after stable deletes.`);
	      }
	      this.state.currentDeleteDelay = nextDelay;
	      this.state.stableDeleteCount = 0;
	      return;
	    }

	    this.state.currentDeleteDelay = current;
	  }

	  recordDeleteSkip(message, reason) {
	    this.recordSkipped({ message, reason }, true);
	  }

	  recordDryRun(messages) {
	    this.state.dryRunCount += messages.length;
	    this.state.skippedCount += messages.length;
	    this.state.skipReasons['dry run'] = (this.state.skipReasons['dry run'] || 0) + messages.length;
	    for (const message of messages) {
	      this.state.processedMessageIds.add(message.id);
	      this.state.seenMessageIds.add(message.id);
	    }
	    log.success(`Dry run: ${messages.length} matching messages queued, no deletes sent.`);
	  }

	  advanceAfterWork(messages) {
	    if (advanceCursorFromMessages(this.state, messages)) {
	      log.verb(`Advanced search cursor to before message ${redact(this.state.workingMaxId)}.`);
	    } else {
	      this.state.workingOffset += MESSAGES_PER_SEARCH_PAGE;
	      this.state.offset = this.state.workingOffset;
	      log.verb(`Advanced search offset to ${this.state.workingOffset}.`);
	    }
	  }

	  async handleEmptySearchPage(searchResponse) {
	    this.state.emptyPageStreak++;
	    this.state.stagnantCycles++;

	    log.warn('Empty search page detected; verifying before stopping.');
	    const decision = shouldTerminateAfterSearch({
	      searchResponse,
	      queue: this.state._messagesToDelete,
	      state: this.state,
	      options: this.options,
	    });

	    if (decision.action === EMPTY_PAGE_ACTIONS.RETRY_SAME) {
	      log.warn('Empty page but search metadata suggests more work may remain; retrying same query after cooldown.');
	      return true;
	    }

	    if (decision.action === EMPTY_PAGE_ACTIONS.SCAN_AHEAD) {
	      this.state.emptyPageSkips++;
	      this.state.workingOffset += MESSAGES_PER_SEARCH_PAGE;
	      this.state.offset = this.state.workingOffset;
	      log.warn(`Empty page but total_results is nonzero; scanning ahead to offset ${this.state.workingOffset}.`);
	      return true;
	    }

	    if (decision.action === EMPTY_PAGE_ACTIONS.ADVANCE_CURSOR) {
	      this.state.workingMaxId = this.state.oldestProcessedMessageId;
	      this.state.workingOffset = 0;
	      this.state.offset = 0;
	      log.warn(`No new IDs after recovery attempts; advancing cursor to ${redact(this.state.workingMaxId)}.`);
	      return true;
	    }

	    this.state.stopReason = decision.reason;
	    this.state.running = false;
	    const message = decision.reason === STOP_REASONS.NO_DELETABLE_MESSAGES ?
	      'No deletable messages found after verification.' :
	      'Stopped: verified no more deletable messages in selected scope.';
	    log.success(message);
	    return false;
	  }

	  resetEmptyRecovery() {
	    this.state.emptyPageStreak = 0;
	    this.state.emptyPageSkips = 0;
	    this.state.stagnantCycles = 0;
	  }

	  retryAfterMs(body, fallbackMs) {
	    const retryAfterMs = Math.ceil(Number(body?.retry_after) * 1000);
	    return Number.isFinite(retryAfterMs) && retryAfterMs > 0 ? retryAfterMs : Math.max(1000, fallbackMs || 1000);
	  }

	  async confirm(messages = this.state._messagesToDelete) {
	    if (!this.options.askForConfirmation) return true;

	    log.verb('Waiting for your confirmation...');
	    const preview = messages.slice(0, 10).map(m => `${m.author?.username}#${m.author?.discriminator}: ${(m.attachments || []).length ? '[ATTACHMENTS]' : m.content}`).join('\n');
	    const scope = [
	      `Author ID: ${this.options.authorId || '(current user)'}`,
	      `Server ID: ${this.options.guildId || '(none)'}`,
	      `Channel ID: ${this.options.channelId || '(all selected)'}`,
	      `Date/ID after: ${this.options.minId || '(none)'}`,
	      `Date/ID before: ${this.options.maxId || '(none)'}`,
	      `Include pinned: ${this.options.includePinned ? 'yes' : 'no'}`,
	      `Dry run: ${this.options.dryRun ? 'yes' : 'no'}`,
	    ].join('\n');

	    const answer = await ask(
	      `Erase is about to ${this.options.dryRun ? 'preview' : 'delete'} messages matching this scope.\n\n` +
	      `${scope}\n\n` +
	      `Estimated matching results: ${this.state.grandTotal || 'unknown'}\n` +
	      `Estimated time: ${msToHMS(this.stats.etr)}\n\n` +
	      'Warning: automating a normal Discord account can violate Discord policy and may risk account action.\n' +
	      'Pinned messages are not deleted unless Include pinned is enabled.\n\n' +
	      '---- Preview ----\n' +
	      preview
	    );

	    if (!answer) {
	      log.error('Aborted by you!');
	      return false;
	    }
	    log.verb('OK');
	    this.options.askForConfirmation = false;
	    return true;
	  }

	  stop() {
	    this.batch?.controller.abort();
	    this.requestStop(STOP_REASONS.USER_STOPPED);
	  }

	  pause() {
	    if (this.batch) this.batch.paused = true;
	    if (!this.state.running && !this.batch) return;
	    this.state.paused = true;
	    this.setStatus(STATUS.PAUSED);
	  }

	  resume() {
	    if (this.batch) this.batch.paused = false;
	    if (!this.state.running && !this.batch) return;
	    this.state.paused = false;
	    this.setStatus(STATUS.SEARCHING);
	  }

	  requestStop(reason) {
	    if (!this.state.running && this.state.stopRequested) return;
	    this.state.stopRequested = true;
	    this.state.stopReason = reason;
	    this.state.running = false;
	    this.setStatus(STATUS.STOPPING);
	    this.abortController?.abort();
	  }

	  async waitIfPaused() {
	    while (this.state.paused && this.state.running && !this.state.stopRequested) {
	      await this.waitFn(500, this.abortController.signal);
	    }
	  }

	  setStatus(status) {
	    this.state.status = status;
	    if (this.onProgress) this.onProgress(this.state, this.stats);
	  }

	  calcEtr() {
	    const processed = calculateProgress(this.state);
	    const remaining = Math.max(0, this.state.grandTotal - processed);
	    const pages = Math.ceil(remaining / MESSAGES_PER_SEARCH_PAGE);
	    this.state.remainingEstimate = remaining;
	    this.stats.etr = (this.options.searchDelay * pages) + ((this.getDeleteDelay() + this.stats.avgPing) * remaining);
	  }

	  #beforeTs = 0;
	  beforeRequest() {
	    this.#beforeTs = Date.now();
	  }
	  afterRequest() {
	    this.stats.lastPing = Date.now() - this.#beforeTs;
	    this.stats.avgPing = this.stats.avgPing > 0 ? (this.stats.avgPing * 0.9) + (this.stats.lastPing * 0.1) : this.stats.lastPing;
	  }

	  syncRateLimitStats() {
	    const stats = this.apiClient.rateLimit?.stats || {};
	    this.state.rateLimitStats = { ...stats };
	    this.stats.throttledCount = stats.hits || 0;
	    this.stats.throttledTotalTime = stats.totalWaitMs || 0;
	    if ((stats.consecutive429s || 0) >= this.options.maxConsecutive429s) {
	      this.state.stopReason = STOP_REASONS.RATE_LIMIT_SAFETY;
	      this.state.running = false;
	      log.error(`Stopped after ${stats.consecutive429s} consecutive 429 responses.`);
	    }
	  }

	  printStats() {
	    log.verb(
	      `Delete delay: ${this.getDeleteDelay()}ms (${this.state.deletePacingMode}), Search delay: ${this.options.searchDelay}ms`,
	      `Last Ping: ${this.stats.lastPing}ms, Average Ping: ${this.stats.avgPing | 0}ms`,
	    );
	    log.verb(
	      `Rate Limited: ${this.stats.throttledCount} times.`,
	      `Total time throttled: ${msToHMS(this.stats.throttledTotalTime)}.`,
	      `Index waits: ${this.state.indexingWaitStats.count}.`
	    );
	  }

	  exportDiagnostics(options = {}) {
	    // Export summaries directly instead of copying every ID and traversing the
	    // same message payload through its search, queue and compatibility aliases.
	    const {
	      seenMessageIds, processedMessageIds, queuedMessageIds,
	      _searchResponse, _messagesToDelete, _skippedMessages,
	      ...summary
	    } = this.state;
	    return stringifySanitized({
	      version: 'erase-core',
	      options: {
	        ...this.options,
	        authToken: '[REDACTED]',
	        targetLabel: '[REDACTED_TARGET]',
	        content: options.includeContent ? this.options.content : '[REDACTED_CONTENT]',
	        pattern: options.includeContent ? this.options.pattern : '[REDACTED_CONTENT]',
	      },
	      state: {
	        ...summary,
	        collectionCounts: this.state.collectionCounts || this.getCollectionCounts(),
	        lastSearch: this.state.lastSearch || this.getLastSearchSummary(),
	      },
	      stats: this.stats,
	    }, { redactIds: true, includeContent: options.includeContent === true });
	  }

	  getCollectionCounts() {
	    return {
	      seen: this.state.seenMessageIds.size,
	      processed: this.state.processedMessageIds.size,
	      queued: this.state.queuedMessageIds.size,
	      searchHits: extractSearchHits(this.state._searchResponse).length,
	      pending: this.state._messagesToDelete.length,
	      skipped: this.state._skippedMessages.length,
	    };
	  }

	  getLastSearchSummary() {
	    const response = this.state._searchResponse;
	    return response ? {
	      totalResults: Number(response.total_results) || 0,
	      pageHits: extractSearchHits(response).length,
	    } : null;
	  }

	  releaseRunData() {
	    this.retentionBoundaries.clear();
	    // Keep active-run deduplication exact. Release it only after all work has
	    // settled, preserving final counts for diagnostics and the summary UI.
	    this.state.collectionCounts ||= this.getCollectionCounts();
	    this.state.lastSearch ||= this.getLastSearchSummary();
	    this.state.seenMessageIds.clear();
	    this.state.processedMessageIds.clear();
	    this.state.queuedMessageIds.clear();
	    this.state._searchResponse = null;
	    this.state._messagesToDelete = [];
	    this.state._skippedMessages = [];
	  }

	  finishRun() {
	    this.stats.endTime = new Date();
	    this.state.running = false;
	    if (!this.state.stopReason) this.state.stopReason = STOP_REASONS.VERIFIED_COMPLETE;
	    this.state.waitUntil = 0;
	    this.state.status = [STOP_REASONS.VERIFIED_COMPLETE, STOP_REASONS.NO_DELETABLE_MESSAGES, STOP_REASONS.USER_STOPPED].includes(this.state.stopReason) ? STATUS.DONE : STATUS.ERROR;
	    this.calcEtr();

	    try {
	      log.success(`Ended at ${this.stats.endTime.toLocaleString()}! Total time: ${msToHMS(this.stats.endTime.getTime() - this.stats.startTime.getTime())}`);
	      log.success(`Stop reason: ${this.state.stopReason}.`);
	      this.printStats();
	      log.debug(
	        `Deleted ${this.state.delCount} messages, ` +
	        `${this.state.alreadyDeletedCount} already deleted, ` +
	        `${this.state.skippedCount} skipped, ${this.state.failCount} failed.`
	      );
	    } finally {
	      this.releaseRunData();
	    }

	    if (this.onStop && !this._stopNotified) {
	      this._stopNotified = true;
	      this.onStop(this.state, this.stats);
	    }
	  }
	}

	function normalizeWebhookUrl(value) {
	  const raw = String(value || '').trim();
	  if (!raw || raw.length > 512) throw new Error('Enter a valid Discord webhook URL.');
	  let url;
	  try { url = new URL(raw); } catch { throw new Error('Enter a valid Discord webhook URL.'); }
	  if (url.protocol !== 'https:' || !['discord.com', 'discordapp.com'].includes(url.hostname) || url.port || url.username || url.password || url.hash ||
	    [...url.searchParams.keys()].some(key => key !== 'wait') ||
	    !/^\/api\/(?:v\d+\/)?webhooks\/\d{17,20}\/[A-Za-z0-9_-]{50,128}\/?$/.test(url.pathname)) {
	    throw new Error('Enter a valid Discord webhook URL.');
	  }
	  url.hostname = 'discord.com';
	  url.pathname = url.pathname.replace(/^\/api\/(?:v\d+\/)?/, '/api/v10/').replace(/\/$/, '');
	  url.search = '?wait=true';
	  return url.href;
	}

	function createRunReport(state, stats, context = {}) {
	  const queue = state.queueSummary;
	  const reason = state.stopReason || STOP_REASONS.ERROR;
	  const complete = [STOP_REASONS.VERIFIED_COMPLETE, STOP_REASONS.NO_DELETABLE_MESSAGES].includes(reason);
	  const failed = queue?.failed ?? state.failedCount ?? 0;
	  const issueSkipped = queue?.issueSkipped ?? ((state.skipReasons?.permission || 0) + (state.skipReasons?.['archived thread'] || 0));
	  const outcome = reason === STOP_REASONS.USER_STOPPED ? 'stopped' : !complete ? 'failed' : failed || issueSkipped ? 'issues' : 'success';
	  const completedAt = Date.now();
	  return {
	    mode: context.queued ? 'Queued run' : 'Single run', outcome, reason, preview: Boolean(context.preview),
	    deleted: queue?.deleted ?? state.deletedCount ?? 0,
	    skipped: queue?.skipped ?? state.skippedCount ?? 0, failed, issueSkipped,
	    alreadyDeleted: queue?.alreadyDeleted ?? state.alreadyDeletedCount ?? 0,
	    previewed: queue?.previewed ?? state.dryRunCount ?? 0,
	    totalTargets: queue?.total ?? context.totalTargets ?? 1,
	    completedTargets: queue?.completed ?? Number(complete),
	    attemptedTargets: queue?.attempted ?? 1,
	    elapsedMs: queue?.elapsedMs ?? Math.max(0, completedAt - (context.startedAt || stats.startTime?.getTime?.() || completedAt)),
	    keepNewest: context.keepNewest || 0, completedAt,
	  };
	}

	function buildWebhookPayload(report, { test = false } = {}) {
	  const number = value => Math.max(0, Math.trunc(Number(value) || 0)).toLocaleString();
	  const outcome = ['success', 'issues', 'stopped', 'failed'].includes(report.outcome) ? report.outcome : 'failed';
	  const scope = report.preview ? 'Preview' : report.mode === 'Queued run' ? 'Queue' : 'Run';
	  const labels = { success: `${scope} complete`, issues: `${scope} completed with issues`, stopped: `${scope} stopped`, failed: `${scope} failed` };
	  const reasons = {
	    auth_error: 'Discord rejected the account authorization.',
	    permission_error: 'Discord denied access to a selected target.',
	    not_found: 'A selected target could not be found.',
	    rate_limit_safety: 'Repeated rate limits reached the safety limit.',
	    runtime_limit: 'The configured runtime limit was reached.',
	    error: 'The run stopped after an error. Check Erase’s activity log.',
	    user_stopped: 'Stopped by the user. Remaining work was not processed.',
	  };
	  let description = outcome === 'success' ? 'Finished the selected scope. Protected and filtered messages were kept.' :
	    outcome === 'issues' ? 'Finished scanning. Some messages could not be deleted; check the activity log.' :
	    reasons[report.reason] || 'The run did not finish. Check Erase’s activity log.';
	  if (report.preview) description = `No messages were deleted. ${outcome === 'success' ? 'Finished checking the selected scope.' : description}`;
	  if (test) description = `**Synthetic example. No messages were deleted for this test.**\n\n${description}`;
	  const fields = [
	    { name: report.preview ? 'Would delete' : 'Deleted', value: `**${number(report.preview ? report.previewed : report.deleted)}**`, inline: true },
	    { name: 'Skipped', value: `**${number(report.skipped)}**`, inline: true },
	    { name: 'Failed', value: `**${number(report.failed)}**`, inline: true },
	    { name: 'Targets completed', value: `${number(report.completedTargets)}/${number(report.totalTargets)}`, inline: true },
	    { name: 'Duration', value: msToHMS(Math.max(0, report.elapsedMs || 0)), inline: true },
	    { name: 'Keep newest', value: report.keepNewest ? `${number(report.keepNewest)} per channel` : 'Off', inline: true },
	  ];
	  const details = [];
	  if (report.alreadyDeleted) details.push(`Already removed: **${number(report.alreadyDeleted)}**`);
	  if (report.issueSkipped) details.push(`Access or archived-thread skips: **${number(report.issueSkipped)}**`);
	  const notStarted = Math.max(0, (report.totalTargets || 0) - (report.attemptedTargets || 0));
	  if (notStarted) details.push(`Targets not started: **${number(notStarted)}**`);
	  if (details.length) fields.push({ name: 'Run details', value: details.join('\n'), inline: false });
	  return { username: 'Erase', allowed_mentions: { parse: [] }, embeds: [{
	    author: { name: report.mode === 'Queued run' ? 'Queued run' : 'Single run' },
	    title: `${test ? 'Test · ' : ''}${labels[outcome]}`,
	    // Match the panel's accent, warning, secondary accent and danger tokens.
	    description, color: ({ success: 0x7e9dff, issues: 0xf4bb67, stopped: 0xc4d1ff, failed: 0xff7685 })[outcome],
	    fields, footer: { text: test ? 'Erase · Test report' : report.preview ? 'Erase · Preview only' : 'Erase · Run report' },
	    timestamp: new Date(report.completedAt || Date.now()).toISOString(),
	  }] };
	}

	async function sendRunWebhook(value, payload, deps = {}) {
	  let url;
	  try { url = normalizeWebhookUrl(value); } catch (error) { return { ok: false, message: error.message }; }
	  const send = deps.fetchFn || fetch;
	  const sleep = deps.waitFn || wait;
	  const cancelled = () => ({ ok: false, cancelled: true, message: 'Webhook test cancelled.' });
	  for (let attempt = 0; attempt < 2; attempt++) {
	    if (deps.signal?.aborted) return cancelled();
	    const controller = new AbortController();
	    const abort = () => controller.abort();
	    deps.signal?.addEventListener('abort', abort, { once: true });
	    const timeout = setTimeout(() => controller.abort(), deps.timeoutMs ?? 10000);
	    try {
	      const response = await send(url, {
	        method: 'POST', credentials: 'omit', redirect: 'error', referrerPolicy: 'no-referrer',
	        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal,
	      });
	      const body = await response.json().catch(() => null);
	      if (deps.signal?.aborted) return cancelled();
	      if (response.ok && typeof body?.id === 'string') return { ok: true, message: 'Webhook report delivered.' };
	      if (response.status === 429 && attempt === 0) {
	        const retryMs = Math.ceil(Number(body?.retry_after) * 1000);
	        if (Number.isFinite(retryMs) && retryMs > 0 && retryMs <= 30000) {
	          clearTimeout(timeout);
	          await sleep(retryMs, deps.signal);
	          continue;
	        }
	      }
	      return { ok: false, message: response.status === 429 ? 'Webhook is rate limited. Report was not delivered.' : `Webhook delivery failed (HTTP ${response.status}). Check the Webhook section.` };
	    } catch {
	      if (deps.signal?.aborted) return cancelled();
	      // A lost response may follow an accepted POST. Do not blindly retry and
	      // duplicate a report, or print an exception containing the webhook secret.
	      return { ok: false, message: 'Webhook delivery could not be confirmed. Check the channel before retrying.' };
	    } finally { clearTimeout(timeout); deps.signal?.removeEventListener('abort', abort); }
	  }
	  return { ok: false, message: 'Webhook report was not delivered.' };
	}

	const MOVE = 0;
	const RESIZE_T = 1;
	const RESIZE_B = 2;
	const RESIZE_L = 4;
	const RESIZE_R = 8;
	const RESIZE_TL = RESIZE_T + RESIZE_L;
	const RESIZE_TR = RESIZE_T + RESIZE_R;
	const RESIZE_BL = RESIZE_B + RESIZE_L;
	const RESIZE_BR = RESIZE_B + RESIZE_R;

	function containPanel(element) {
	  if (!element || element.style.display === 'none') return;
	  const viewport = window.visualViewport;
	  const left = viewport?.offsetLeft || 0;
	  const top = viewport?.offsetTop || 0;
	  const width = viewport?.width || window.innerWidth;
	  const height = viewport?.height || window.innerHeight;
	  const margin = Math.min(8, width / 4, height / 4);
	  element.style.maxWidth = `${Math.max(1, width - margin * 2)}px`;
	  element.style.maxHeight = `${Math.max(1, height - margin * 2)}px`;
	  element.style.minWidth = `${Math.min(650, Math.max(1, width - margin * 2))}px`;
	  element.style.minHeight = `${Math.min(width <= 620 ? 650 : 480, Math.max(1, height - margin * 2))}px`;
	  const rect = element.getBoundingClientRect();
	  element.style.right = 'auto';
	  element.style.bottom = 'auto';
	  element.style.left = `${Math.max(left + margin, Math.min(rect.left, left + width - rect.width - margin))}px`;
	  element.style.top = `${Math.max(top + margin, Math.min(rect.top, top + height - rect.height - margin))}px`;
	}

	/**
	 * Make an element draggable/resizable
	 */
	class DragResize {
	  constructor({ elm, moveHandle, options }) {
	    this.options = defaultArgs({
	      minWidth: 200,
	      maxWidth: Infinity,
	      minHeight: 100,
	      maxHeight: Infinity,
	      draggingClass: 'drag',
	      useMouseEvents: true,
	      useTouchEvents: true,
	      createHandlers: true,
	    }, options);
	    Object.assign(this, options);
	    options = undefined;

	    elm.style.position = 'fixed';

	    this.drag_m = new Draggable(elm, moveHandle, MOVE, this.options);

	    if (this.options.createHandlers) {
	      this.el_t = createElement('div', { name: 'grab-t' }, elm);
	      this.drag_t = new Draggable(elm, this.el_t, RESIZE_T, this.options);
	      this.el_r = createElement('div', { name: 'grab-r' }, elm);
	      this.drag_r = new Draggable(elm, this.el_r, RESIZE_R, this.options);
	      this.el_b = createElement('div', { name: 'grab-b' }, elm);
	      this.drag_b = new Draggable(elm, this.el_b, RESIZE_B, this.options);
	      this.el_l = createElement('div', { name: 'grab-l' }, elm);
	      this.drag_l = new Draggable(elm, this.el_l, RESIZE_L, this.options);
	      this.el_tl = createElement('div', { name: 'grab-tl' }, elm);
	      this.drag_tl = new Draggable(elm, this.el_tl, RESIZE_TL, this.options);
	      this.el_tr = createElement('div', { name: 'grab-tr' }, elm);
	      this.drag_tr = new Draggable(elm, this.el_tr, RESIZE_TR, this.options);
	      this.el_br = createElement('div', { name: 'grab-br' }, elm);
	      this.drag_br = new Draggable(elm, this.el_br, RESIZE_BR, this.options);
	      this.el_bl = createElement('div', { name: 'grab-bl' }, elm);
	      this.drag_bl = new Draggable(elm, this.el_bl, RESIZE_BL, this.options);
	    }
	  }
	}

	class Draggable {
	  constructor(targetElm, handleElm, op, options) {
	    Object.assign(this, options);
	    options = undefined;

	    this._targetElm = targetElm;
	    this._handleElm = handleElm;

	    let vw = window.innerWidth;
	    let vh = window.innerHeight;
	    let initialX, initialY, initialT, initialL, initialW, initialH;

	    const clamp = (value, min, max) => value < min ? min : value > max ? max : value;

	    const moveOp = (x, y) => {
	      const deltaX = (x - initialX);
	      const deltaY = (y - initialY);
	      const t = clamp(initialT + deltaY, 0, vh - initialH);
	      const l = clamp(initialL + deltaX, 0, vw - initialW);
	      this._targetElm.style.top = t + 'px';
	      this._targetElm.style.left = l + 'px';
	    };

	    const resizeOp = (x, y) => {
	      x = clamp(x, 0, vw);
	      y = clamp(y, 0, vh);
	      const deltaX = (x - initialX);
	      const deltaY = (y - initialY);
	      const resizeDirX = (op & RESIZE_L) ? -1 : 1;
	      const resizeDirY = (op & RESIZE_T) ? -1 : 1;
	      const deltaXMax = (this.maxWidth - initialW);
	      const deltaXMin = (this.minWidth - initialW);
	      const deltaYMax = (this.maxHeight - initialH);
	      const deltaYMin = (this.minHeight - initialH);
	      const t = initialT + clamp(deltaY * resizeDirY, deltaYMin, deltaYMax) * resizeDirY;
	      const l = initialL + clamp(deltaX * resizeDirX, deltaXMin, deltaXMax) * resizeDirX;
	      const w = initialW + clamp(deltaX * resizeDirX, deltaXMin, deltaXMax);
	      const h = initialH + clamp(deltaY * resizeDirY, deltaYMin, deltaYMax);
	      if (op & RESIZE_T) { // resize ↑
	        this._targetElm.style.top = t + 'px';
	        this._targetElm.style.height = h + 'px';
	      }
	      if (op & RESIZE_B) { // resize ↓
	        this._targetElm.style.height = h + 'px';
	      }
	      if (op & RESIZE_L) { // resize ←
	        this._targetElm.style.left = l + 'px';
	        this._targetElm.style.width = w + 'px';
	      }
	      if (op & RESIZE_R) { // resize →
	        this._targetElm.style.width = w + 'px';
	      }
	    };

	    let operation = op === MOVE ? moveOp : resizeOp;

	    function dragStartHandler(e) {
	      if (e.target.closest('button, input, a')) return;
	      const touch = e.type === 'touchstart';
	      if ((e.buttons === 1 || e.which === 1) || touch) {
	        e.preventDefault();
	        containPanel(this._targetElm);
	        const x = touch ? e.touches[0].clientX : e.clientX;
	        const y = touch ? e.touches[0].clientY : e.clientY;
	        initialX = x;
	        initialY = y;
	        vw = window.innerWidth;
	        vh = window.innerHeight;
	        initialT = this._targetElm.offsetTop;
	        initialL = this._targetElm.offsetLeft;
	        initialW = this._targetElm.offsetWidth;
	        initialH = this._targetElm.offsetHeight;
	        if (this.useMouseEvents) {
	          document.addEventListener('mousemove', this._dragMoveHandler);
	          document.addEventListener('mouseup', this._dragEndHandler);
	        }
	        if (this.useTouchEvents) {
	          document.addEventListener('touchmove', this._dragMoveHandler, { passive: false });
	          document.addEventListener('touchend', this._dragEndHandler);
	        }
	        this._targetElm.classList.add(this.draggingClass);
	      }
	    }

	    function dragMoveHandler(e) {
	      e.preventDefault();
	      let x, y;
	      const touch = e.type === 'touchmove';
	      if (touch) {
	        const t = e.touches[0];
	        x = t.clientX;
	        y = t.clientY;
	      } else { //mouse
	        // If the button is not down, dispatch a "fake" mouse up event, to stop listening to mousemove
	        // This happens when the mouseup is not captured (outside the browser)
	        if ((e.buttons || e.which) !== 1) {
	          this._dragEndHandler();
	          return;
	        }
	        x = e.clientX;
	        y = e.clientY;
	      }
	      // perform drag / resize operation
	      operation(x, y);
	      containPanel(this._targetElm);
	    }

	    function dragEndHandler(e) {
	      if (this.useMouseEvents) {
	        document.removeEventListener('mousemove', this._dragMoveHandler);
	        document.removeEventListener('mouseup', this._dragEndHandler);
	      }
	      if (this.useTouchEvents) {
	        document.removeEventListener('touchmove', this._dragMoveHandler);
	        document.removeEventListener('touchend', this._dragEndHandler);
	      }
	      this._targetElm.classList.remove(this.draggingClass);
	      containPanel(this._targetElm);
	    }

	    // We need to bind the handlers to this instance
	    this._dragStartHandler = dragStartHandler.bind(this);
	    this._dragMoveHandler = dragMoveHandler.bind(this);
	    this._dragEndHandler = dragEndHandler.bind(this);

	    this.enable();
	  }

	  /** Turn on the drag and drop of the instance */
	  enable() {
	    this.destroy(); // prevent events from getting binded twice
	    if (this.useMouseEvents) this._handleElm.addEventListener('mousedown', this._dragStartHandler);
	    if (this.useTouchEvents) this._handleElm.addEventListener('touchstart', this._dragStartHandler, { passive: false });
	  }

	  /** Teardown all events bound to the document and elements. You can resurrect this instance by calling enable() */
	  destroy() {
	    this._targetElm.classList.remove(this.draggingClass);
	    if (this.useMouseEvents) {
	      this._handleElm.removeEventListener('mousedown', this._dragStartHandler);
	      document.removeEventListener('mousemove', this._dragMoveHandler);
	      document.removeEventListener('mouseup', this._dragEndHandler);
	    }
	    if (this.useTouchEvents) {
	      this._handleElm.removeEventListener('touchstart', this._dragStartHandler);
	      document.removeEventListener('touchmove', this._dragMoveHandler);
	      document.removeEventListener('touchend', this._dragEndHandler);
	    }
	  }
	}

	function createElement(tag='div', attrs, parent) {
	  const elm = document.createElement(tag);
	  if (attrs) Object.entries(attrs).forEach(([k, v]) => elm.setAttribute(k, v));
	  if (parent) parent.appendChild(elm);
	  return elm;
	}

	function defaultArgs(defaults, options) {
	  function isObj(x) { return x !== null && typeof x === 'object'; }
	  function hasOwn(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
	  if (isObj(options)) for (let prop in defaults) {
	    if (hasOwn(defaults, prop) && hasOwn(options, prop) && options[prop] !== undefined) {
	      if (isObj(defaults[prop])) defaultArgs(defaults[prop], options[prop]);
	      else defaults[prop] = options[prop];
	    }
	  }
	  return defaults;
	}

	function createElm(html) {
	  const temp = document.createElement('div');
	  temp.innerHTML = html;
	  return temp.removeChild(temp.firstElementChild);
	}

	function insertCss(css) {
	  const style = document.createElement('style');
	  style.appendChild(document.createTextNode(css));
	  document.head.appendChild(style);
	  return style;
	}

	const messagePickerCss = `
body.erase-pick-message [data-list-id="chat-messages"] {
  background-color: var(--background-secondary-alt);
  box-shadow: inset 0 0 0px 2px var(--button-outline-brand-border);
}

body.erase-pick-message [id^="message-content-"]:hover {
  cursor: pointer;
  cursor: cell;
  background: var(--background-message-automod-hover);
}
body.erase-pick-message [id^="message-content-"]:hover::after {
  position: absolute;
  top: calc(50% - 11px);
  left: 4px;
  z-index: 1;
  width: 65px;
  height: 22px;
  line-height: 22px;
  font-family: var(--font-display);
  background-color: var(--button-secondary-background);
  color: var(--header-secondary);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  text-align: center;
  border-radius: 3px;
  content: 'This 👉';
}
body.erase-pick-message.before [id^="message-content-"]:hover::after {
  content: 'Before 👆';
}
body.erase-pick-message.after [id^="message-content-"]:hover::after {
  content: 'After 👇';
}
`;

	const messagePicker = {
	  init() {
	    insertCss(messagePickerCss);
	  },
	  grab(auxiliary) {
	    return new Promise((resolve, reject) => {
	      document.body.classList.add('erase-pick-message');
	      if (auxiliary) document.body.classList.add(auxiliary);
	      function clickHandler(e) {
	        const message = e.target.closest('[id^="message-content-"]');
	        if (message) {
	          e.preventDefault();
	          e.stopPropagation();
	          e.stopImmediatePropagation();
	          if (auxiliary) document.body.classList.remove(auxiliary);
	          document.body.classList.remove('erase-pick-message');
	          document.removeEventListener('click', clickHandler);
	          try {
	            resolve(message.id.match(/message-content-(\d+)/)[1]);
	          } catch (e) {
	            resolve(null);
	          }
	        }
	      }
	      document.addEventListener('click', clickHandler);
	    });
	  }
	};
	window.messagePicker = messagePicker;

	let capturedAuthorization = null;
	let capturedAuthorizationSource = null;
	let cachedWebpackRequire = null;
	let webpackProbeSequence = 0;
	let lastAuthorizationSource = null;
	const AUTH_CAPTURE_HOOK_FLAG = '__eraseAuthorizationCaptureHookV1';

	function getPageWindow() {
	  return typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
	}

	function normalizeAuthorizationToken(raw) {
	  if (typeof raw !== 'string' || !raw || raw === 'null' || raw === 'undefined') return null;
	  try {
	    const parsed = JSON.parse(raw);
	    if (typeof parsed === 'string' && parsed.trim()) return parsed.trim();
	  } catch (_err) {
	    // Discord has historically stored a JSON-quoted token, but page hooks
	    // expose the same value as an ordinary unquoted header string.
	  }
	  const token = raw.replace(/^"+|"+$/g, '').trim();
	  return token || null;
	}

	function usableAuthorizationToken(raw) {
	  const token = normalizeAuthorizationToken(raw);
	  return token && token.length >= 20 && !/\s/.test(token) ? token : null;
	}

	function getStoredAuthorizationToken() {
	  const seen = new Set();
	  for (const owner of [getPageWindow(), window]) {
	    try {
	      const storage = owner?.localStorage;
	      if (!storage || seen.has(storage)) continue;
	      seen.add(storage);
	      const token = usableAuthorizationToken(storage.getItem('token') || storage.token);
	      if (token) return token;
	    } catch (_err) {
	      // Storage access can be unavailable during early document startup.
	    }
	  }
	  return null;
	}

	function setTokenInputIfEmpty(token) {
	  const usableToken = usableAuthorizationToken(token);
	  if (!usableToken) return false;
	  const input = document.querySelector('#erase input#token');
	  if (!input || input.value) return false;
	  input.value = usableToken;
	  return true;
	}

	function captureAuthorizationValue(value, source) {
	  const token = usableAuthorizationToken(value);
	  if (!token || token === capturedAuthorization) return;
	  const updated = Boolean(capturedAuthorization);
	  capturedAuthorization = token;
	  capturedAuthorizationSource = source || 'captured-header';
	  setTokenInputIfEmpty(token);
	  console.log(PREFIX, `${updated ? 'updated' : 'captured'} authorization from ${capturedAuthorizationSource}`);
	}

	function captureAuthorizationFromHeaders(headers, source) {
	  if (!headers) return;
	  try {
	    if (typeof headers.get === 'function') {
	      captureAuthorizationValue(headers.get('authorization') || headers.get('Authorization'), source);
	      return;
	    }
	    if (Array.isArray(headers)) {
	      for (const entry of headers) {
	        if (Array.isArray(entry) && String(entry[0]).toLowerCase() === 'authorization') {
	          captureAuthorizationValue(entry[1], source);
	          return;
	        }
	      }
	      return;
	    }
	    if (typeof headers === 'object') {
	      for (const [name, value] of Object.entries(headers)) {
	        if (String(name).toLowerCase() === 'authorization') {
	          captureAuthorizationValue(value, source);
	          return;
	        }
	      }
	    }
	  } catch (_err) {
	    // Header inspection must never interfere with Discord's request.
	  }
	}

	function extractRequestUrl(input) {
	  if (typeof input === 'string') return input;
	  if (input && typeof input.href === 'string') return input.href;
	  if (input && typeof input.url === 'string') return input.url;
	  return '';
	}

	function isAllowedDiscordApiRequest(url) {
	  try {
	    const pageWindow = getPageWindow();
	    let parsed;
	    try {
	      parsed = new URL(url);
	    } catch (_err) {
	      parsed = new URL(url, pageWindow.location?.href || location.href);
	    }
	    const allowedHosts = ['discord.com', 'canary.discord.com', 'ptb.discord.com'];
	    return parsed.protocol === 'https:'
	      && allowedHosts.includes(parsed.hostname)
	      && /^\/api\/v\d+\//.test(parsed.pathname);
	  } catch (_err) {
	    return false;
	  }
	}

	function installAuthorizationCaptureHooks() {
	  const pageWindow = getPageWindow();
	  if (pageWindow[AUTH_CAPTURE_HOOK_FLAG]) return;
	  try {
	    Object.defineProperty(pageWindow, AUTH_CAPTURE_HOOK_FLAG, {
	      value: true,
	      configurable: false,
	      enumerable: false,
	      writable: false,
	    });
	  } catch (_err) {
	    pageWindow[AUTH_CAPTURE_HOOK_FLAG] = true;
	  }

	  const originalFetch = pageWindow.fetch;
	  if (typeof originalFetch === 'function') {
	    pageWindow.fetch = function eraseAuthorizationFetchHook(input, init) {
	      try {
	        const method = String(init?.method || input?.method || 'GET').toUpperCase();
	        const url = extractRequestUrl(input);
	        if (method === 'GET' && isAllowedDiscordApiRequest(url)) {
	          captureAuthorizationFromHeaders(input?.headers, 'fetch-request');
	          captureAuthorizationFromHeaders(init?.headers, 'fetch-init');
	        }
	      } catch (_err) {
	        // Capture is observational. The original fetch must always continue.
	      }
	      return Reflect.apply(originalFetch, this, arguments);
	    };
	    console.log(PREFIX, 'installed authorization fetch hook');
	  }

	  const xhrPrototype = pageWindow.XMLHttpRequest?.prototype;
	  if (xhrPrototype && !xhrPrototype[AUTH_CAPTURE_HOOK_FLAG]) {
	    const methodKey = Symbol('eraseAuthorizationMethod');
	    const urlKey = Symbol('eraseAuthorizationUrl');
	    const originalOpen = xhrPrototype.open;
	    const originalSetRequestHeader = xhrPrototype.setRequestHeader;
	    try {
	      Object.defineProperty(xhrPrototype, AUTH_CAPTURE_HOOK_FLAG, {
	        value: true,
	        configurable: false,
	        enumerable: false,
	        writable: false,
	      });
	    } catch (_err) {
	      xhrPrototype[AUTH_CAPTURE_HOOK_FLAG] = true;
	    }

	    if (typeof originalOpen === 'function') {
	      xhrPrototype.open = function eraseAuthorizationXhrOpen(method, url) {
	        this[methodKey] = String(method || 'GET').toUpperCase();
	        this[urlKey] = String(url || '');
	        return Reflect.apply(originalOpen, this, arguments);
	      };
	    }
	    if (typeof originalSetRequestHeader === 'function') {
	      xhrPrototype.setRequestHeader = function eraseAuthorizationXhrHeader(name, value) {
	        try {
	          if (
	            String(name).toLowerCase() === 'authorization'
	            && this[methodKey] === 'GET'
	            && isAllowedDiscordApiRequest(this[urlKey])
	          ) captureAuthorizationValue(value, 'xhr-header');
	        } catch (_err) {
	          // Capture is observational. The original XHR must always continue.
	        }
	        return Reflect.apply(originalSetRequestHeader, this, arguments);
	      };
	    }
	    console.log(PREFIX, 'installed authorization XHR hook');
	  }
	}

	function getWebpackRequire() {
	  if (cachedWebpackRequire?.c) return cachedWebpackRequire;
	  const pageWindow = getPageWindow();
	  const chunk = pageWindow.webpackChunkdiscord_app || pageWindow.webpackChunkdiscordapp;
	  if (!chunk || typeof chunk.push !== 'function') return null;
	  try {
	    const chunkId = `erase-auth-${Date.now()}-${++webpackProbeSequence}`;
	    chunk.push([[chunkId], {}, require => { cachedWebpackRequire = require; }]);
	  } catch (_err) {
	    return null;
	  }
	  return cachedWebpackRequire?.c ? cachedWebpackRequire : null;
	}

	function getWebpackAuthorizationToken() {
	  const webpackRequire = getWebpackRequire();
	  if (!webpackRequire?.c) return null;
	  const seen = new Set();
	  for (const moduleRecord of Object.values(webpackRequire.c)) {
	    let candidates = [];
	    try {
	      const moduleExports = moduleRecord?.exports;
	      candidates = [moduleExports, moduleExports?.default, ...Object.values(moduleExports || {})];
	    } catch (_err) {
	      continue;
	    }
	    for (const candidate of candidates) {
	      if (!candidate || seen.has(candidate) || candidate === window || candidate === document || candidate === navigator) continue;
	      seen.add(candidate);
	      try {
	        if (typeof candidate.getToken !== 'function') continue;
	        const raw = Reflect.apply(candidate.getToken, candidate, []);
	        if (typeof raw !== 'string') continue;
	        const token = usableAuthorizationToken(raw);
	        if (token) return token;
	      } catch (_err) {
	        // A similarly named export can require arguments. Keep scanning safely.
	      }
	    }
	  }
	  return null;
	}

	function getToken() {
	  const storedToken = getStoredAuthorizationToken();
	  if (storedToken) {
	    lastAuthorizationSource = 'localStorage';
	    return storedToken;
	  }
	  if (capturedAuthorization) {
	    lastAuthorizationSource = capturedAuthorizationSource || 'captured-header';
	    return capturedAuthorization;
	  }
	  const webpackToken = getWebpackAuthorizationToken();
	  if (webpackToken) {
	    lastAuthorizationSource = 'webpack-cache';
	    return webpackToken;
	  }
	  lastAuthorizationSource = null;
	  return '';
	}

	function getAuthorId() {
	  const frame = document.createElement('iframe');
	  try {
	    document.body.appendChild(frame);
	    return JSON.parse(frame.contentWindow.localStorage.user_id_cache);
	  } finally {
	    frame.remove();
	  }
	}

	function fillToken({ silent = false } = {}) {
	  try {
	    const token = getToken();
	    if (token) {
	      setTokenInputIfEmpty(token);
	      console.log(PREFIX, `authorization ready from ${lastAuthorizationSource || 'automatic resolver'}`);
	      return token;
	    }
	  } catch (_err) {
	    // All automatic resolvers are best effort and must fail without throwing.
	  }
	  if (!silent) {
	    log.error('Could not automatically detect Authorization Token!');
	    log.info('Reload Discord once so Erase can observe an authenticated API request, then try again.');
	    log.debug('You can still enter a Token manually in the "Advanced Settings" section.');
	  }
	  return '';
	}

	let runBusy = false;
	let contextRequest = null;
	let contextRoute = '';
	let currentContext = null;
	let activityTimer = null;
	const queueSelection = new Map();
	let queueCatalog = [];
	let queueRequest = null;
	let queueKind = 'all';
	let queueVisibleLimit = 100;
	let queueFriendCoverage = null;
	let queueMissingExpanded = false;
	let queueMissingLimit = 50;
	const queueMissingSelection = new Set();
	const queueMissingResults = new Map();
	let queueResolveRequest = null;
	let queueCatalogLoaded = false;
	const queueSaveStore = new QueueSaveStore({
	  getValue: typeof GM_getValue === 'function' ? GM_getValue : undefined,
	  setValue: typeof GM_setValue === 'function' ? GM_setValue : undefined,
	  listValues: typeof GM_listValues === 'function' ? GM_listValues : undefined,
	  deleteValue: typeof GM_deleteValue === 'function' ? GM_deleteValue : undefined,
	  ownerId: crypto.randomUUID(),
	});
	let lastSavedQueue = null;
	let queueRestored = null;
	let queueSaveTimer = null;
	let recentSaveTimer = null;
	let queueSaveFailed = false;
	let queueMemoryLoad = 0;
	let preparingQueueRequest = null;
	let singleHistoryId = null;
	let historyBusy = false;

	function renderSavedQueue() {
	  if (!ui.eraseWindow) return;
	  const saved = lastSavedQueue;
	  $('#savedQueue').hidden = !saved && !queueSaveFailed;
	  $('#restoreQueue').hidden = !saved;
	  $('#restoreQueue').disabled = runBusy || webhookBusy || !saved;
	  if (queueSaveFailed) $('#savedQueueStatus').textContent = 'Queue saving is unavailable. Check the log before starting again.';
	  else if (saved) {
	    const complete = saved.progress.nextIndex === saved.plan.jobs.length;
	    $('#savedQueueStatus').textContent = complete ? `Last queue: ${saved.plan.jobs.length} targets completed.`
	      : `Saved queue: ${saved.plan.jobs.length} targets. Continue from target ${saved.progress.nextIndex + 1}.${saved.recovered ? ' Previous checkpoint recovered.' : ''}`;
	    $('#restoreQueue').textContent = complete ? 'Restore last selection' : 'Restore saved queue';
	  }
	}

	async function loadQueueMemory(accountId) {
	  if (!validQueueId(accountId) || runBusy) return;
	  const sequence = ++queueMemoryLoad;
	  try {
	    const saved = await queueSaveStore.load(accountId);
	    if (sequence !== queueMemoryLoad) return;
	    lastSavedQueue = saved; queueSaveFailed = false; renderSavedQueue();
	  } catch (error) {
	    if (sequence !== queueMemoryLoad) return;
	    lastSavedQueue = null; queueSaveFailed = true; renderSavedQueue();
	    console.warn(PREFIX, 'saved queue could not be loaded', error.name);
	  }
	}

	function queueSaveError(error) {
	  if (queueSaveFailed) return;
	  queueSaveFailed = true;
	  if (queueSaveTimer) clearTimeout(queueSaveTimer); queueSaveTimer = null;
	  log.error('Queue saving failed. The queued run has been stopped:', error.message);
	  if (eraseCore.batch) { eraseCore.batch.controller.abort(); eraseCore.requestStop(STOP_REASONS.ERROR); }
	  renderSavedQueue();
	}

	async function saveQueueCheckpoint(snapshot) {
	  if (!snapshot || !queueSaveStore.plan || eraseCore.options.dryRun) return;
	  if (queueSaveTimer) clearTimeout(queueSaveTimer); queueSaveTimer = null;
	  if (queueSaveFailed) throw new Error('Queue saving is unavailable');
	  try {
	    await queueSaveStore.save({ ...snapshot, schema: QUEUE_SAVE_SCHEMA, runId: queueSaveStore.plan.runId });
	    lastSavedQueue = { plan: queueSaveStore.plan, progress: queueSaveStore.progress }; renderSavedQueue();
	  } catch (error) { queueSaveError(error); throw error; }
	}

	function scheduleQueueCheckpoint(force = false) {
	  if (!eraseCore.batch || !queueSaveStore.plan || eraseCore.options.dryRun || queueSaveFailed) return;
	  if (force) { void saveQueueCheckpoint(eraseCore.queueCheckpointSnapshot()).catch(() => {}); return; }
	  if (!queueSaveTimer) queueSaveTimer = setTimeout(() => {
	    queueSaveTimer = null; void saveQueueCheckpoint(eraseCore.queueCheckpointSnapshot()).catch(() => {});
	  }, 1000);
	}

	function recordRecentDeletion(key, count) {
	  if (eraseCore.options.dryRun || !validQueueId(eraseCore.options.authorId)) return;
	  queueSaveStore.accountId = eraseCore.options.authorId;
	  queueSaveStore.markDeleted(key, count, eraseCore.batch ? queueSaveStore.plan?.runId : singleHistoryId, undefined, eraseCore.recentTarget);
	  if (eraseCore.batch) scheduleQueueCheckpoint(count === 1);
	  else if (!recentSaveTimer) recentSaveTimer = setTimeout(() => {
	    recentSaveTimer = null; void queueSaveStore.flushRecent().catch(() => log.warn('Recent deletion history could not be saved.'));
	  }, 1000);
	}

	function invalidateQueueResume() {
	  if (!queueRestored) return;
	  queueRestored = null;
	  $('#queueSavedNotice').hidden = false;
	  $('#queueSavedNotice').textContent = 'Selection or protection changed. Start will create a new queue.';
	}

	async function restoreSavedQueue() {
	  if (runBusy) return;
	  let account; try { account = getAuthorId(); } catch { return; }
	  await loadQueueMemory(account);
	  if (!lastSavedQueue || runBusy) return;
	  const saved = lastSavedQueue;
	  queueSelection.clear();
	  for (const job of saved.plan.jobs) queueSelection.set(job.key, { ...job });
	  const options = saved.plan.options;
	  const fieldMap = { authorId: 'authorId', content: 'search', pattern: 'pattern', minId: 'minId', maxId: 'maxId', keepRecentCount: 'keepRecentCount',
	    searchDelay: 'searchDelay', deleteDelay: 'deleteDelay', prefetchPages: 'prefetchPages', maxEmptyPageRetries: 'maxEmptyPageRetries',
	    maxEmptyPageSkips: 'maxEmptyPageSkips', maxStagnantCycles: 'maxStagnantCycles', maxRuntimeMinutes: 'maxRuntimeMinutes' };
	  for (const [key, id] of Object.entries(fieldMap)) { $(`#${id}`).value = String(options[key] ?? ''); $(`#${id}`).dispatchEvent(new Event('input')); }
	  for (const id of ['hasLink', 'hasFile', 'includePinned', 'dryRun', 'adaptiveDeletePacing', 'conservativeMode']) $(`#${id}`).checked = Boolean(options[id]);
	  $('#minDate').value = ''; $('#maxDate').value = ''; $('#queueBeforeDate').value = ''; $('#queueSearch').value = '';
	  queueRestored = saved;
	  await openQueue();
	}

	function routeContext() {
	  const match = location.pathname.match(/^\/channels\/(@me|\d+)\/(\d+)/);
	  return match ? { guildId: match[1], channelId: match[2] } : null;
	}

	function channelLabel(channel) {
	  if (channel.name) return String(channel.name).slice(0, 180);
	  const recipients = Array.isArray(channel.recipients) ? channel.recipients : [];
	  return recipients.map(user => user.global_name || user.username || '').filter(Boolean).join(', ').slice(0, 180)
	    || (channel.type === 3 ? 'Group chat' : 'Direct message');
	}

	function syncFollowChannelVisibility() {
	  $('#currentChatInfo').hidden = !$('#followChannel').checked;
	}

	async function refreshContext(force = false) {
	  if (!ui.eraseWindow || runBusy || !$('#followChannel').checked) return;
	  const route = routeContext();
	  const key = route ? `${route.guildId}/${route.channelId}` : '';
	  if (!force && key === contextRoute) return;
	  contextRoute = key;
	  contextRequest?.abort();
	  const controller = contextRequest = new AbortController();
	  currentContext = null;
	  if (!route) {
	    $('#contextName').textContent = 'No chat selected';
	    $('#contextMeta').textContent = 'Open a Discord channel or choose a queue.';
	    $('#guildId').value = '';
	    $('#channelId').value = '';
	    return;
	  }
	  $('#guildId').value = route.guildId;
	  $('#channelId').value = route.channelId;
	  $('#contextName').textContent = 'Loading chat...';
	  $('#contextMeta').textContent = 'Detecting channel details...';
	  try { $('#authorId').value = getAuthorId() || ''; } catch { /* Verified through the account API below. */ }
	  const auth = $('#token').value || fillToken({ silent: true });
	  if (!auth) { contextRoute = ''; $('#contextMeta').textContent = 'Waiting for Discord sign-in.'; return; }
	  try {
	    const api = new DiscordApiClient();
	    const me = await api.getResource('/users/@me', auth, controller.signal);
	    if (!me.ok || !/^\d{17,20}$/.test(me.body?.id || '')) throw new Error('Account detection unavailable');
	    const result = await api.getResource(`/channels/${route.channelId}`, auth, controller.signal);
	    if (!result.ok || result.body?.id !== route.channelId || (result.body.guild_id || '@me') !== route.guildId) throw new Error('Channel detection unavailable');
	    if (controller.signal.aborted || runBusy || !$('#followChannel').checked || routeContext()?.channelId !== route.channelId) return;
	    const channel = result.body;
	    $('#authorId').value = me.body.id;
	    if (queueSaveStore.accountId !== me.body.id) void loadQueueMemory(me.body.id);
	    currentContext = { ...route, label: channelLabel(channel), kind: channel.type === 3 ? 'group' : route.guildId === '@me' ? 'dm' : 'channel', nsfw: Boolean(channel.nsfw) };
	    $('#contextName').textContent = currentContext.label;
	    $('#contextName').classList.add('priv');
	    $('#contextMeta').textContent = currentContext.kind === 'dm' ? 'Direct message' : currentContext.kind === 'group' ? 'Group chat' : 'Server channel';
	    console.log(PREFIX, 'current channel detected', currentContext.kind);
	  } catch (error) {
	    if (error.name === 'AbortError') return;
	    $('#contextMeta').textContent = 'Details unavailable. Erase will verify this scope before starting.';
	    console.warn(PREFIX, 'channel detection unavailable:', redactSensitiveText(error.message));
	  }
	}

	function setRunControls(active) {
	  $('#start').disabled = active;
	  $('#openQueue').disabled = active;
	  $('#pause').disabled = !active;
	  $('#stop').disabled = !active;
	  for (const input of ui.eraseWindow.querySelectorAll('.sidebar input, .sidebar button, #followChannel')) input.disabled = active;
	  $('#openChangelog').disabled = false;
	  renderSavedQueue();
	  if (active && !activityTimer) activityTimer = setInterval(() => {
	    if (ui.eraseWindow.style.display !== 'none') updateStatus(eraseCore.state);
	  }, 1000);
	  if (!active && activityTimer) { clearInterval(activityTimer); activityTimer = null; }
	  refreshWebhookControls();
	}

	function installToggleHelp(signal) {
	  const descriptions = {
	    followChannel: 'Automatically fill the current chat and server when you switch channels. Your active run stays on its original targets.',
	    autoScroll: 'Keep the activity log at the newest entry. Turn this off to read older log lines without being moved.',
	    redact: 'Hide personal fields in Erase. Always inspect the rest of the Discord window before sharing a screenshot.',
	    hasLink: 'Only delete your messages that contain a web link.',
	    hasFile: 'Only delete your messages that contain an attachment.',
	    includePinned: 'Allow deletion of your pinned messages. Newest-message protection still applies.',
	    dryRun: 'Search and preview matching messages without deleting anything.',
	    adaptiveDeletePacing: 'Add extra delay after rate limits, then gradually return to your selected pace.',
	    conservativeMode: 'Use a slower deletion pace from the beginning. Discord rate-limit waits are always respected.',
	    webhookEnabled: 'Send one final report for a single or queued run, including completion, issues, failure or a user stop. Reports contain totals, not chat names or message contents.'
	  };
	  const tooltip = $('#eraseTooltip');
	  let owner = null;
	  let hoverTimer = null;
	  function hide() { if (hoverTimer) clearTimeout(hoverTimer); hoverTimer = null; owner?.removeAttribute('aria-describedby'); owner = null; tooltip.hidden = true; }
	  function show(target) {
	    const label = target.closest?.('label[data-help]');
	    if (!label) return;
	    hide(); owner = label.querySelector('input');
	    tooltip.textContent = label.dataset.help;
	    owner?.setAttribute('aria-describedby', 'eraseTooltip');
	    tooltip.hidden = false;
	    const rect = label.getBoundingClientRect();
	    const tip = tooltip.getBoundingClientRect();
	    tooltip.style.left = `${Math.max(10, Math.min(rect.left, innerWidth - tip.width - 10))}px`;
	    tooltip.style.top = `${Math.max(10, rect.bottom + tip.height + 8 < innerHeight ? rect.bottom + 8 : rect.top - tip.height - 8)}px`;
	  }
	  for (const [id, description] of Object.entries(descriptions)) {
	    const label = $(`label[for="${id}"]`);
	    if (label) { label.dataset.help = description; label.removeAttribute('title'); }
	  }
	  ui.eraseWindow.addEventListener('pointerover', event => {
	    if (!event.target.closest?.('label[data-help]')) return;
	    if (event.target.closest('label[data-help]') === event.relatedTarget?.closest?.('label[data-help]')) return;
	    hide(); hoverTimer = setTimeout(() => { hoverTimer = null; show(event.target); }, 450);
	  }, { signal });
	  ui.eraseWindow.addEventListener('pointerout', event => { if (!event.relatedTarget?.closest?.('label[data-help]')) hide(); }, { signal });
	  ui.eraseWindow.addEventListener('focusin', event => show(event.target), { signal });
	  ui.eraseWindow.addEventListener('focusout', hide, { signal });
	  ui.eraseWindow.addEventListener('scroll', hide, { capture: true, signal });
	  window.addEventListener('resize', hide, { signal });
	  document.addEventListener('keydown', event => { if (event.key === 'Escape') hide(); }, { signal });
	  signal.addEventListener('abort', hide, { once: true });
	}

	function compareQueueFriends(channels, relationships) {
	  // Compare identities, not chat totals: groups and non-friend DMs do not
	  // establish that a friend has a detected one-to-one conversation.
	  if (!Array.isArray(channels) || channels.length > MAX_QUEUE_TARGETS ||
	    !Array.isArray(relationships) || relationships.length > 10000) throw new Error('Friend comparison unavailable');
	  const validId = value => typeof value === 'string' && /^\d{17,20}$/.test(value);
	  const friends = new Map();
	  for (const relationship of relationships) {
	    if (!relationship || !Number.isInteger(relationship.type)) throw new Error('Incomplete friend list');
	    if (relationship.type !== 1) continue;
	    const user = relationship.user;
	    const id = relationship.id || user?.id;
	    if (!validId(id) || (user?.id && user.id !== id)) throw new Error('Incomplete friend identity');
	    const username = typeof user?.username === 'string' ? user.username.slice(0, 80) : '';
	    const label = (typeof user?.global_name === 'string' && user.global_name) || username || 'Friend';
	    friends.set(id, { id, label: label.slice(0, 180), username });
	    if (friends.size > MAX_QUEUE_TARGETS) throw new Error('Friend list is too large');
	  }
	  const directChats = new Map();
	  for (const channel of channels) {
	    if (channel?.type !== 1) continue;
	    if (!validId(channel.id)) throw new Error('Incomplete DM identity');
	    const recipients = Array.isArray(channel.recipients) && channel.recipients.length
	      ? channel.recipients.map(user => user?.id) : channel.recipient_ids;
	    if (!Array.isArray(recipients) || !recipients.length || !recipients.every(validId)) throw new Error('Incomplete DM recipients');
	    directChats.set(channel.id, recipients);
	  }
	  const detectedFriends = new Set();
	  let otherDMs = 0;
	  for (const recipients of directChats.values()) {
	    let hasFriend = false;
	    for (const id of recipients) if (friends.has(id)) { detectedFriends.add(id); hasFriend = true; }
	    if (!hasFriend) otherDMs++;
	  }
	  const missing = [...friends.values()].filter(friend => !detectedFriends.has(friend.id));
	  missing.sort((a, b) => a.label.localeCompare(b.label) || a.username.localeCompare(b.username) || a.id.localeCompare(b.id));
	  return { status: 'ready', total: friends.size, detected: detectedFriends.size, otherDMs, missing };
	}

	function existingDMQueueRow(friend, channel) {
	  const recipients = channel?.recipients?.map(user => user?.id) || channel?.recipient_ids;
	  if (channel?.type !== 1 || typeof channel.id !== 'string' || !/^\d{17,20}$/.test(channel.id) ||
	    !Array.isArray(recipients) || recipients.length !== 1 || recipients[0] !== friend.id) {
	    throw new Error('Discord returned a different or incomplete DM');
	  }
	  return { key: `channel:${channel.id}`, channelId: channel.id, guildId: '@me', kind: 'dm',
	    label: friend.label, resolvedFriendId: friend.id };
	}

	function matchingMissingFriends() {
	  const query = $('#queueSearch').value.trim().toLocaleLowerCase();
	  return (queueFriendCoverage?.missing || []).filter(friend => `${friend.label} ${friend.username}`.toLocaleLowerCase().includes(query));
	}

	function createRecentBadge(recent) {
	  if (!recent) return null;
	  const badge = document.createElement('span'); badge.className = 'recent-delete-badge'; badge.textContent = 'Recently deleted';
	  badge.title = `Last recorded deletion activity: ${recent.count.toLocaleString()} confirmed deletions, ${new Date(recent.at).toLocaleString()}. Saved until you clear history. Protected or filtered messages may remain.`;
	  return badge;
	}

	function renderQueueFriends() {
	  const coverage = queueFriendCoverage;
	  const section = $('#queueFriendCoverage');
	  section.hidden = !coverage || !['all', 'dm'].includes(queueKind);
	  const ready = coverage?.status === 'ready';
	  const resolvedCount = ready ? coverage.missing.filter(friend => queueMissingResults.get(friend.id)?.channelId).length : 0;
	  const missingCount = ready ? coverage.missing.length - resolvedCount : 0;
	  const hasDetails = ready && coverage.missing.length > 0;
	  $('#queueFriendsSummary').textContent = !coverage ? '' : ready
	    ? `${coverage.total.toLocaleString()} ${coverage.total === 1 ? 'friend' : 'friends'} · DMs detected for ${(coverage.detected + resolvedCount).toLocaleString()}`
	    : coverage.status === 'loading' ? 'Checking friends and detected DMs...' : 'Friend comparison unavailable. Reopen the queue to retry.';
	  $('#queueOtherDMs').textContent = ready && coverage.otherDMs
	    ? `${coverage.otherDMs.toLocaleString()} ${coverage.otherDMs === 1 ? 'DM with a non-friend is' : 'DMs with non-friends are'} also available.` : '';
	  const toggle = $('#queueFriendsToggle');
	  toggle.hidden = !hasDetails;
	  toggle.setAttribute('aria-expanded', String(Boolean(hasDetails && queueMissingExpanded)));
	  $('#queueFriendsToggleLabel').textContent = `${queueMissingExpanded ? 'Hide' : 'View'} ${missingCount ? `${missingCount.toLocaleString()} missing` : 'added DMs'}`;
	  const showList = !section.hidden && hasDetails && queueMissingExpanded;
	  $('#queueMissingPanel').hidden = !showList;
	  const list = $('#queueMissingList');
	  const focusedFriend = document.activeElement?.dataset?.missingId;
	  list.replaceChildren();
	  $('#queueMissingMore').hidden = true;
	  if (!showList) return;
	  const matches = matchingMissingFriends();
	  const selectable = matches.filter(friend => !queueMissingResults.get(friend.id)?.channelId);
	  const selected = selectable.filter(friend => queueMissingSelection.has(friend.id)).length;
	  const all = $('#queueMissingAll');
	  all.disabled = !!queueResolveRequest || !queueCatalogLoaded || !selectable.length;
	  all.checked = selectable.length > 0 && selected === selectable.length;
	  all.indeterminate = selected > 0 && selected < selectable.length;
	  $('#queueMissingAllLabel').textContent = $('#queueSearch').value.trim() ? 'Select all matching' : 'Select all missing';
	  $('#queueMissingAdd').disabled = !!queueResolveRequest || !queueCatalogLoaded || !queueMissingSelection.size;
	  $('#queueMissingAdd').textContent = queueResolveRequest ? 'Finding DMs...' : queueMissingSelection.size ? `Add ${queueMissingSelection.size} to queue` : 'Add selected to queue';
	  $('#queueMissingCancel').hidden = !queueResolveRequest;
	  const fragment = document.createDocumentFragment();
	  const recentPeople = recentFriendIndex(queueSaveStore.recent);
	  for (const friend of matches.slice(0, queueMissingLimit)) {
	    const row = document.createElement('li'); row.className = 'queue-missing-friend';
	    const choice = document.createElement('label'); choice.className = 'queue-missing-choice';
	    const result = queueMissingResults.get(friend.id);
	    const input = document.createElement('input'); input.type = 'checkbox'; input.dataset.missingId = friend.id;
	    input.checked = result?.channelId ? queueSelection.has(`channel:${result.channelId}`) : queueMissingSelection.has(friend.id);
	    input.disabled = !!queueResolveRequest || !queueCatalogLoaded || !!result?.channelId;
	    input.setAttribute('aria-label', `Select ${friend.label}${friend.username ? ` (@${friend.username})` : ''}`);
	    const copy = document.createElement('span'); copy.className = 'queue-missing-copy';
	    const name = document.createElement('strong'); name.className = 'priv'; name.textContent = friend.label;
	    const identity = document.createElement('small'); identity.className = 'priv';
	    identity.textContent = friend.username ? `@${friend.username}` : `User ID: ${friend.id}`;
	    const nameLine = document.createElement('span'); nameLine.className = 'queue-name-line'; nameLine.append(name);
	    const badge = createRecentBadge(recentPeople.get(friend.id)); if (badge) nameLine.append(badge);
	    copy.append(nameLine, identity);
	    if (result) {
	      const status = document.createElement('span'); status.className = 'queue-missing-result';
	      status.textContent = result.channelId ? queueSelection.has(`channel:${result.channelId}`) ? 'Added to queue' : 'Available in the chat list below' : result.message;
	      copy.append(status);
	    }
	    choice.append(input, copy); row.append(choice); fragment.append(row);
	  }
	  if (!matches.length) {
	    const empty = document.createElement('li'); empty.className = 'queue-missing-empty';
	    empty.textContent = 'No missing friends match this search.'; fragment.append(empty);
	  }
	  list.append(fragment);
	  $('#queueMissingMore').hidden = matches.length <= queueMissingLimit;
	  if (focusedFriend) list.querySelector(`input[data-missing-id="${focusedFriend}"]`)?.focus();
	}

	async function addMissingFriendsToQueue() {
	  if (runBusy || queueResolveRequest || !queueCatalogLoaded || !queueMissingSelection.size || queueFriendCoverage?.status !== 'ready') return;
	  const friends = queueFriendCoverage.missing.filter(friend => queueMissingSelection.has(friend.id) && !queueMissingResults.get(friend.id)?.channelId);
	  if (!friends.length) return;
	  const parent = queueRequest;
	  if (!parent || parent.signal.aborted) return;
	  const controller = queueResolveRequest = new AbortController();
	  const cancel = () => controller.abort();
	  parent.signal.addEventListener('abort', cancel, { once: true });
	  let stopped = '', added = 0, absent = 0, failed = 0, checked = 0, failureStreak = 0;
	  const deadline = setTimeout(() => { stopped = 'Time limit reached.'; cancel(); }, 300000);
	  const isCurrent = () => queueRequest === parent && queueResolveRequest === controller && !parent.signal.aborted && $('#queueDialog').open;
	  const status = $('#queueMissingStatus');
	  status.textContent = `Finding existing DMs for ${friends.length} selected friends...`;
	  renderQueueFriends(); updateQueueSelection();
	  console.log(PREFIX, 'existing DM lookup started', friends.length);
	  try {
	    const auth = $('#token').value || fillToken();
	    if (!auth) throw new Error('Sign in to Discord before finding DMs.');
	    const api = new DiscordApiClient({ maxNetworkRetries: 1, onStatus: () => {
	      if (isCurrent()) status.textContent = `Discord asked Erase to wait. ${checked}/${friends.length} checked.`;
	    } });
	    for (const friend of friends) {
	      if (!isCurrent() || controller.signal.aborted) break;
	      if (queueSelection.size >= MAX_QUEUE_TARGETS || queueCatalog.length >= MAX_QUEUE_TARGETS) { stopped = 'Queue limit reached.'; break; }
	      queueMissingResults.set(friend.id, { message: 'Finding existing DM...' }); renderQueueFriends();
	      const request = new AbortController();
	      const abortRequest = () => request.abort();
	      controller.signal.addEventListener('abort', abortRequest, { once: true });
	      const timeout = setTimeout(abortRequest, 15000);
	      let received = false;
	      try {
	        const result = await api.getResource(`/users/@me/dms/${friend.id}`, auth, request.signal);
	        if (!isCurrent() || controller.signal.aborted) break;
	        received = true; checked++;
	        if (result.ok) {
	          const row = existingDMQueueRow(friend, result.body);
	          const known = queueCatalog.find(item => item.key === row.key);
	          if (known && (known.kind !== 'dm' || (known.resolvedFriendId && known.resolvedFriendId !== friend.id))) throw new Error('DM identity mismatch');
	          if (!known) queueCatalog.push(row);
	          else Object.assign(known, row, { recentOnly: false });
	          queueSaveStore.enrichRecentTargets([row]);
	          if (!queueSelection.has(row.key)) invalidateQueueResume();
	          queueSelection.set(row.key, { ...row });
	          queueMissingResults.set(friend.id, { channelId: row.channelId });
	          queueMissingSelection.delete(friend.id); added++; failureStreak = 0;
	        } else if (result.status === 404 && result.body?.code === 10003) {
	          absent++; failureStreak = 0; queueMissingSelection.delete(friend.id);
	          queueMissingResults.set(friend.id, { message: 'No existing DM found' });
	        } else {
	          failed++; failureStreak++;
	          queueMissingResults.set(friend.id, { message: result.status === 403 ? 'Discord did not allow this lookup' : 'Could not verify an existing DM' });
	          if (result.status === 401 || result.status === 429 || failureStreak >= 3) { stopped = result.status === 401 ? 'Sign in again before retrying.' : 'Lookup stopped after Discord errors.'; break; }
	        }
	      } catch (error) {
	        if (!isCurrent() || controller.signal.aborted) { queueMissingResults.delete(friend.id); break; }
	        if (!received) checked++;
	        failed++; failureStreak++;
	        queueMissingResults.set(friend.id, { message: request.signal.aborted ? 'Lookup timed out' : 'Could not verify the DM recipient' });
	        if (request.signal.aborted || failureStreak >= 3) { stopped = 'Try the remaining friends again.'; break; }
	      } finally {
	        clearTimeout(timeout); controller.signal.removeEventListener('abort', abortRequest);
	      }
	      if (!isCurrent()) break;
	      status.textContent = `${checked}/${friends.length} checked · ${added} added to queue`;
	      renderQueue();
	      if (checked < friends.length) await wait(200, controller.signal);
	    }
	  } catch (error) {
	    if (error.name !== 'AbortError') stopped = 'The lookup could not finish. Try again.';
	  } finally {
	    clearTimeout(deadline); parent.signal.removeEventListener('abort', cancel);
	    if (isCurrent()) {
	      const cancelled = controller.signal.aborted;
	      queueResolveRequest = null;
	      for (const [id, result] of queueMissingResults) if (result.message === 'Finding existing DM...') queueMissingResults.delete(id);
	      status.textContent = `${added} ${added === 1 ? 'DM added' : 'DMs added'} to queue.${absent ? ` ${absent} had no existing DM.` : ''}${failed ? ` ${failed} could not be verified.` : ''}${stopped ? ` ${stopped}` : cancelled ? ' Lookup cancelled.' : ''}${checked < friends.length ? ` ${friends.length - checked} not checked.` : ''}`;
	      renderQueue();
	      console.log(PREFIX, 'existing DM lookup finished', { added, absent, failed, checked, total: friends.length, cancelled });
	    }
	  }
	}

	async function loadQueueFriends(channels, auth, queueController) {
	  if (queueController.signal.aborted) return;
	  const request = new AbortController();
	  const cancel = () => request.abort();
	  queueController.signal.addEventListener('abort', cancel, { once: true });
	  const timeout = setTimeout(cancel, 12000);
	  const isCurrent = () => queueRequest === queueController && !queueController.signal.aborted && $('#queueDialog').open;
	  console.log(PREFIX, 'checking friend coverage');
	  try {
	    const result = await new DiscordApiClient({ maxNetworkRetries: 1 }).getResource('/users/@me/relationships', auth, request.signal);
	    if (!isCurrent()) return;
	    if (!result.ok) throw new Error('Friend list request failed');
	    queueFriendCoverage = compareQueueFriends(channels, result.body);
	    renderQueueFriends();
	    console.log(PREFIX, 'friend coverage loaded', queueFriendCoverage.total, 'friends', queueFriendCoverage.detected, 'with DMs', queueFriendCoverage.otherDMs, 'other DMs', queueFriendCoverage.missing.length, 'missing');
	  } catch (error) {
	    if (!isCurrent()) return;
	    queueFriendCoverage = { status: 'unavailable' }; renderQueueFriends();
	    console.warn(PREFIX, 'friend coverage unavailable', request.signal.aborted ? 'timed out' : 'request or data error');
	  } finally {
	    clearTimeout(timeout);
	    queueController.signal.removeEventListener('abort', cancel);
	  }
	}

	function filteredQueueRows() {
	  const query = $('#queueSearch').value.trim().toLocaleLowerCase();
	  return queueCatalog.filter(row => (queueKind === 'all' || row.kind === queueKind || (queueKind === 'server' && row.kind === 'channel')) && row.label.toLocaleLowerCase().includes(query));
	}

	function bulkQueueTargets() {
	  // Bulk selection operates on conversations and whole servers. A separately
	  // listed current server channel is included through its server, never twice.
	  return filteredQueueRows().filter(row => row.kind !== 'channel');
	}

	function coveredBySelectedServer(row) {
	  return row.kind === 'channel' && queueSelection.has(`server:${row.guildId}`);
	}

	function renderQueue() {
	  const matches = filteredQueueRows();
	  const fragment = document.createDocumentFragment();
	  for (const row of matches.slice(0, queueVisibleLimit)) {
	    const label = document.createElement('label'); label.className = 'queue-row';
	    const input = document.createElement('input'); input.type = 'checkbox'; input.dataset.queueKey = row.key;
	    const covered = coveredBySelectedServer(row);
	    input.checked = queueSelection.has(row.key) || covered;
	    input.disabled = covered;
	    const copy = document.createElement('span'); copy.className = 'queue-label';
	    const name = document.createElement('strong'); name.className = 'priv'; name.textContent = row.label;
	    const sub = document.createElement('small'); sub.textContent = covered ? 'Included in the selected server' : row.recentOnly ? 'Saved DM · not in the current chat list' : row.kind === 'server' ? 'Your messages across searchable channels' : row.kind === 'channel' ? 'Only this server channel' : row.kind === 'group' ? 'Group conversation' : 'Personal conversation';
	    const nameLine = document.createElement('span'); nameLine.className = 'queue-name-line'; nameLine.append(name);
	    const badge = createRecentBadge(queueSaveStore.recent.get(row.key)); if (badge) nameLine.append(badge);
	    copy.append(nameLine, sub);
	    const kind = document.createElement('span'); kind.className = 'queue-kind'; kind.textContent = ({ dm: 'DM', group: 'GROUP', server: 'SERVER', channel: 'CHANNEL' })[row.kind];
	    label.append(input, copy, kind); fragment.append(label);
	  }
	  if (matches.length > queueVisibleLimit) {
	    const more = document.createElement('button'); more.textContent = 'Show more'; more.id = 'queueShowMore';
	    more.onclick = () => { queueVisibleLimit += 100; renderQueue(); };
	    fragment.append(more);
	  }
	  $('#queueList').replaceChildren(fragment);
	  $('#queueNotice').textContent = matches.length ? `${matches.length.toLocaleString()} available` : 'No matching conversations. Try another name or filter.';
	  renderQueueFriends();
	  updateQueueSelection();
	}

	function updateQueueSelection() {
	  const count = queueSelection.size;
	  const historyCount = queueSaveStore.recent.size;
	  $('#queueHistoryStatus').textContent = historyBusy ? 'Clearing deletion history...' : historyCount ? `${historyCount.toLocaleString()} saved ${historyCount === 1 ? 'target' : 'targets'} · kept until cleared` : 'Deletion history stays until cleared.';
	  $('#queueClearHistory').disabled = !historyCount || historyBusy || runBusy || !queueCatalogLoaded;
	  $('#queueSelectionCount').textContent = count ? `${count} target${count === 1 ? '' : 's'} selected` : 'No targets selected';
	  $('#queuePreview').disabled = !count || runBusy || historyBusy || !!queueResolveRequest;
	  $('#queueStart').disabled = !count || runBusy || historyBusy || !!queueResolveRequest;
	  $('#queueStart').textContent = queueRestored && queueRestored.progress.nextIndex < queueRestored.plan.jobs.length ? 'Resume queue' : 'Start queue';
	  const targets = bulkQueueTargets();
	  const selected = targets.reduce((total, row) => total + Number(queueSelection.has(row.key)), 0);
	  const control = $('#queueSelectAll');
	  control.disabled = !targets.length || runBusy;
	  control.checked = targets.length > 0 && selected === targets.length;
	  control.indeterminate = selected > 0 && selected < targets.length;
	  const category = ({ all: '', dm: ' DMs', group: ' groups', server: ' servers' })[queueKind];
	  const matching = $('#queueSearch').value.trim() ? ' matching' : '';
	  $('#queueSelectAllLabel').textContent = `Select all${matching}${category}`;
	  $('#queueViewSelection').textContent = `${selected.toLocaleString()}/${targets.length.toLocaleString()} selected`;
	}

	function selectAllInQueueView(checked) {
	  if (runBusy) return;
	  invalidateQueueResume();
	  const targets = bulkQueueTargets();
	  if (checked) {
	    const next = new Map(queueSelection);
	    const selectedGuilds = new Set(targets.filter(row => row.kind === 'server').map(row => row.guildId));
	    for (const [key, row] of next) if (row.kind === 'channel' && selectedGuilds.has(row.guildId)) next.delete(key);
	    for (const row of targets) next.set(row.key, { ...row });
	    if (next.size > MAX_QUEUE_TARGETS) {
	      updateQueueSelection();
	      $('#queueNotice').textContent = `The queue supports up to ${MAX_QUEUE_TARGETS.toLocaleString()} targets. Nothing was partially selected.`;
	      return;
	    }
	    queueSelection.clear();
	    for (const [key, row] of next) queueSelection.set(key, row);
	  } else {
	    for (const row of targets) queueSelection.delete(row.key);
	  }
	  renderQueue();
	  console.log(PREFIX, checked ? 'selected all in queue view' : 'cleared queue view', queueKind, targets.length, 'total', queueSelection.size);
	}

	function retentionPreviewText(value) {
	  const count = Number(value);
	  if (String(value).trim() === '' || !Number.isInteger(count) || count < 0 || count > 1000) {
	    return 'Enter a whole number from 0 to 1,000 for newest-message protection.';
	  }
	  if (count === 0) return 'Keep 0 recent messages. Newest-message protection is off.';
	  return `Keep the newest ${count.toLocaleString()} ${count === 1 ? 'message' : 'messages'} in each chat, then delete only your older messages.`;
	}

	async function openQueue() {
	  if (runBusy) return;
	  const dialog = $('#queueDialog');
	  if (dialog.open) return;
	  queueRequest?.abort();
	  const controller = queueRequest = new AbortController();
	  queueCatalog = [];
	  queueCatalogLoaded = false;
	  queueMissingSelection.clear(); queueMissingResults.clear(); $('#queueMissingStatus').textContent = '';
	  queueFriendCoverage = { status: 'loading' };
	  queueMissingExpanded = false; queueMissingLimit = 50;
	  renderQueueFriends();
	  $('#queueList').replaceChildren();
	  $('#queueNotice').textContent = 'Loading your conversations...';
	  $('#queueSavedNotice').hidden = !queueRestored;
	  $('#queueSavedNotice').textContent = queueRestored ? `Restored ${queueRestored.plan.jobs.length} targets. ${queueRestored.progress.nextIndex} completed; the unfinished target will be checked again with its saved protection.` : '';
	  $('#queueKeepRecent').value = $('#keepRecentCount').value;
	  $('#queueRetentionSummary').textContent = retentionPreviewText($('#queueKeepRecent').value);
	  $('#queueFilterSummary').textContent = 'Also applies the text, attachment, pinned, message interval and date filters set in the main panel.';
	  dialog.showModal();
	  updateQueueSelection();
	  $('#queuePreview').disabled = true; $('#queueStart').disabled = true;
	  try {
	    const auth = $('#token').value || fillToken();
	    if (!auth) throw new Error('Sign in to Discord, then reopen the queue.');
	    try { await loadQueueMemory(getAuthorId()); } catch { /* Account is verified again before deletion. */ }
	    const api = new DiscordApiClient();
	    const privateResult = await api.getResource('/users/@me/channels', auth, controller.signal);
	    if (!privateResult.ok || !Array.isArray(privateResult.body)) throw new Error('Conversations could not be loaded. Close and reopen the queue to retry.');
	    const retainedDMs = [...queueSelection.values()].filter(row => row.kind === 'dm' && row.resolvedFriendId && !privateResult.body.some(channel => channel.id === row.channelId));
	    void loadQueueFriends([...privateResult.body, ...retainedDMs.map(row => ({ id: row.channelId, type: 1, recipient_ids: [row.resolvedFriendId] }))], auth, controller);
	    const rows = privateResult.body.filter(channel => [1, 3].includes(channel.type) && /^\d{17,20}$/.test(channel.id)).map(channel => ({
	      key: `channel:${channel.id}`, channelId: channel.id, guildId: '@me', kind: channel.type === 3 ? 'group' : 'dm', label: channelLabel(channel),
	      ...(channel.type === 1 && (channel.recipients?.length === 1 || channel.recipient_ids?.length === 1) && validQueueId(channel.recipients?.[0]?.id || channel.recipient_ids?.[0])
	        ? { resolvedFriendId: channel.recipients?.[0]?.id || channel.recipient_ids[0] } : {})
	    }));
	    let after = '';
	    for (let page = 0; page < 5; page++) {
	      const guilds = await api.getResource(`/users/@me/guilds?limit=200${after ? `&after=${after}` : ''}`, auth, controller.signal);
	      if (!guilds.ok || !Array.isArray(guilds.body)) throw new Error('Servers could not be loaded. Close and reopen the queue to retry.');
	      for (const guild of guilds.body) if (/^\d{17,20}$/.test(guild.id)) rows.push({ key: `server:${guild.id}`, guildId: guild.id, channelId: '', kind: 'server', label: String(guild.name || 'Server').slice(0, 180) });
	      if (guilds.body.length < 200) break;
	      after = guilds.body.at(-1)?.id;
	      if (page === 4) throw new Error('Too many servers to load safely. Select a specific channel instead.');
	    }
	    if (currentContext?.kind === 'channel') rows.unshift({ ...currentContext, key: `channel:${currentContext.channelId}` });
	    rows.push(...retainedDMs);
	    if (queueRestored) for (const job of queueRestored.plan.jobs) if (!rows.some(row => row.key === job.key)) rows.push({ ...job });
	    if (controller.signal.aborted || !dialog.open) return;
	    if (rows.length > MAX_QUEUE_TARGETS) throw new Error('Too many conversations to load safely. Select a specific channel instead.');
	    queueSaveStore.enrichRecentTargets(rows);
	    queueCatalog = mergeRecentQueueRows(rows, queueSaveStore.recent);
	    try { await queueSaveStore.flushRecent(); } catch { log.warn('Recent deletion history could not be saved.'); }
	    if (controller.signal.aborted || queueRequest !== controller || !dialog.open) return;
	    queueCatalogLoaded = true;
	    const availableKeys = new Set(queueCatalog.map(row => row.key));
	    for (const key of queueSelection.keys()) if (!availableKeys.has(key)) queueSelection.delete(key);
	    renderQueue();
	    console.log(PREFIX, 'queue catalog loaded', queueCatalog.length);
	  } catch (error) {
	    if (error.name !== 'AbortError' && queueRequest === controller && !controller.signal.aborted) {
	      controller.abort();
	      queueFriendCoverage = { status: 'unavailable' }; renderQueueFriends();
	      $('#queueNotice').textContent = error.message;
	    }
	  }
	}

	function closeQueue() {
	  queueRequest?.abort(); queueRequest = null;
	  queueResolveRequest?.abort(); queueResolveRequest = null; queueCatalogLoaded = false;
	  queueRestored = null;
	  queueMissingSelection.clear(); queueMissingResults.clear(); $('#queueMissingStatus').textContent = '';
	  queueCatalog = [];
	  queueFriendCoverage = null; queueMissingExpanded = false; queueMissingLimit = 50;
	  renderQueueFriends();
	  $('#queueList').replaceChildren();
	  if ($('#queueDialog').open) $('#queueDialog').close();
	  $('#openQueue').focus();
	}

	const WEBHOOK_SETTINGS_KEY = 'erase.webhook.v1';
	let webhookBusy = false;
	let refreshWebhookControls = () => {};

	function readWebhookSettings() {
	  return { enabled: $('#webhookEnabled').checked, url: $('#webhookUrl').value.trim() };
	}

	function installWebhookSettings(signal) {
	  const status = $('#webhookStatus');
	  const input = $('#webhookUrl');
	  let detail = '', state = 'idle', storageNotice = '', timer = null, request = null, generation = 0;
	  let lastAttemptUrl = '', lastResult = null, pendingSave = null, saveWriter = null, saveVersion = 0;
	  const target = () => { try { return normalizeWebhookUrl(input.value.trim()); } catch { return ''; } };
	  const controls = () => {
	    if (signal.aborted) return;
	    $('#testWebhook').disabled = runBusy || webhookBusy || !target();
	    $('#clearWebhook').disabled = runBusy || (!input.value && !$('#webhookEnabled').checked);
	    $('#start').disabled = $('#openQueue').disabled = runBusy || webhookBusy;
	    $('#restoreQueue').disabled = runBusy || webhookBusy || !lastSavedQueue;
	  };
	  const render = () => {
	    if (signal.aborted) return;
	    const enabled = $('#webhookEnabled').checked;
	    const text = detail || (enabled && !input.value.trim() ? 'Add a webhook URL.' : '');
	    status.textContent = `Reports are ${enabled ? 'on' : 'off'}.${text ? ` ${text}` : ''}${storageNotice ? ` ${storageNotice}` : ''}`;
	    status.dataset.state = state;
	    input.setAttribute('aria-invalid', String(Boolean(input.value.trim() && !target())));
	    controls();
	  };
	  try {
	    const stored = typeof GM_getValue === 'function' ? GM_getValue(WEBHOOK_SETTINGS_KEY, null) : null;
	    if (stored && typeof stored.url === 'string' && stored.url.length <= 512) {
	      input.value = stored.url;
	      $('#webhookEnabled').checked = stored.enabled === true;
	    }
	  } catch { storageNotice = 'Saved webhook settings could not be loaded.'; }
	  let lastInput = input.value.trim(), composing = false;
	  if (lastInput && !target()) { detail = 'Enter a complete Discord webhook URL.'; state = 'error'; }
	  // Serialize asynchronous manager writes and retain only the newest pending value.
	  const drainSaves = () => {
	    if (saveWriter) return;
	    saveWriter = (async () => {
	      while (pendingSave) {
	        const entry = pendingSave; pendingSave = null;
	        let notice = '';
	        try {
	          if (typeof GM_setValue === 'function') await GM_setValue(WEBHOOK_SETTINGS_KEY, entry.settings);
	          else notice = 'Available for this tab only. Tampermonkey storage is unavailable.';
	        } catch { notice = 'Could not save settings. Available for this tab only.'; }
	        if (entry.version === saveVersion) { storageNotice = notice; render(); }
	      }
	    })().finally(() => { saveWriter = null; if (pendingSave) drainSaves(); });
	  };
	  const save = () => {
	    const settings = readWebhookSettings(); settings.url = settings.url.slice(0, 512);
	    pendingSave = { version: ++saveVersion, settings }; drainSaves();
	  };
	  const cancel = () => {
	    generation++;
	    if (timer !== null) clearTimeout(timer); timer = null;
	    request?.abort(); request = null; webhookBusy = false;
	  };
	  const showResult = result => {
	    state = result.ok ? 'success' : 'error';
	    const http = result.message?.match(/\bHTTP (\d{3})\b/)?.[1];
	    detail = result.ok ? 'Test delivered. Check your Discord channel.' : http
	      ? `Webhook error (HTTP ${http}). Check the URL and channel permissions.`
	      : /rate limit/i.test(result.message || '') ? 'Webhook error. Discord is rate limiting tests. Try again later.'
	      : 'Webhook error. Delivery could not be confirmed. Check the channel before retrying.';
	  };
	  const test = async () => {
	    if (runBusy || request || signal.aborted) return;
	    const url = target();
	    if (!url) { cancel(); detail = 'Enter a complete Discord webhook URL.'; state = 'error'; render(); return; }
	    if (timer !== null) clearTimeout(timer); timer = null;
	    const controller = request = new AbortController();
	    const version = generation;
	    lastAttemptUrl = url; lastResult = null; webhookBusy = true;
	    detail = 'Sending a labelled test report...'; state = 'testing'; render();
	    console.log(PREFIX, 'webhook test requested');
	    try {
	      const result = await sendRunWebhook(url, buildWebhookPayload({ outcome: 'success', mode: 'Connection test',
	        deleted: 0, skipped: 0, failed: 0, totalTargets: 0, completedTargets: 0, attemptedTargets: 0, elapsedMs: 0,
	        keepNewest: Number($('#keepRecentCount').value) || 0 }, { test: true }), { signal: controller.signal });
	      if (version !== generation || signal.aborted || result.cancelled) return;
	      lastResult = result; showResult(result);
	      console.log(PREFIX, 'webhook test result', result.ok ? 'delivered' : 'not confirmed');
	    } catch {
	      if (version === generation && !signal.aborted) {
	        lastResult = { ok: false, message: 'Test delivery could not be confirmed. Check the channel before retrying.' };
	        showResult(lastResult); console.warn(PREFIX, 'webhook test could not be confirmed');
	      }
	    } finally {
	      if (request === controller) { request = null; webhookBusy = false; render(); }
	    }
	  };
	  const inputChanged = event => {
	    if (runBusy || signal.aborted) return;
	    const value = input.value.trim();
	    const wasComposing = composing; composing = event?.isComposing === true;
	    if (value === lastInput && !(wasComposing && !composing)) { render(); return; }
	    lastInput = value; cancel(); storageNotice = ''; save();
	    const url = target();
	    if (!value) { detail = ''; state = 'idle'; }
	    else if (!url) { detail = 'Enter a complete Discord webhook URL.'; state = 'error'; }
	    else if (url === lastAttemptUrl && lastResult) showResult(lastResult);
	    else if (event?.isComposing) { detail = 'Finish entering the webhook URL.'; state = 'idle'; }
	    else {
	      detail = 'URL accepted. Testing shortly...'; state = 'pending'; webhookBusy = true;
	      timer = setTimeout(() => { timer = null; void test(); }, 800);
	    }
	    render();
	  };
	  input.addEventListener('input', inputChanged, { signal });
	  input.addEventListener('change', inputChanged, { signal });
	  input.addEventListener('compositionend', inputChanged, { signal });
	  $('#webhookEnabled').addEventListener('change', () => { save(); render(); }, { signal });
	  $('#clearWebhook').addEventListener('click', () => {
	    if (runBusy) return;
	    cancel(); input.value = ''; lastInput = ''; lastAttemptUrl = ''; lastResult = null;
	    $('#webhookEnabled').checked = false; detail = ''; state = 'idle'; storageNotice = ''; save(); render();
	    console.log(PREFIX, 'webhook settings cleared');
	  }, { signal });
	  $('#testWebhook').addEventListener('click', () => { if (!webhookBusy) void test(); }, { signal });
	  signal.addEventListener('abort', () => { cancel(); lastAttemptUrl = ''; lastResult = null; refreshWebhookControls = () => {}; }, { once: true });
	  refreshWebhookControls = controls;
	  render(); // Restoring a saved URL never sends an automatic test.
	}

	function installQueueControls(signal) {
	  $('#openQueue').onclick = () => { queueRestored = null; void openQueue(); };
	  $('#closeQueue').onclick = closeQueue;
	  $('#restoreQueue').onclick = restoreSavedQueue;
	  $('#queueFriendsToggle').addEventListener('click', () => {
	    queueMissingExpanded = !queueMissingExpanded; renderQueueFriends();
	    console.log(PREFIX, queueMissingExpanded ? 'showing friends without detected DMs' : 'collapsed missing friends');
	  }, { signal });
	  $('#queueMissingMore').addEventListener('click', () => { queueMissingLimit += 50; renderQueueFriends(); }, { signal });
	  $('#queueMissingList').addEventListener('change', event => {
	    const id = event.target.dataset.missingId;
	    if (queueResolveRequest || !queueFriendCoverage?.missing.some(friend => friend.id === id) || queueMissingResults.get(id)?.channelId) return;
	    if (event.target.checked) queueMissingSelection.add(id); else queueMissingSelection.delete(id);
	    renderQueueFriends();
	  }, { signal });
	  $('#queueMissingAll').addEventListener('change', event => {
	    if (queueResolveRequest || !queueCatalogLoaded) return;
	    for (const friend of matchingMissingFriends()) if (!queueMissingResults.get(friend.id)?.channelId) {
	      if (event.target.checked) queueMissingSelection.add(friend.id); else queueMissingSelection.delete(friend.id);
	    }
	    renderQueueFriends();
	  }, { signal });
	  $('#queueMissingAdd').addEventListener('click', addMissingFriendsToQueue, { signal });
	  $('#queueMissingCancel').addEventListener('click', () => queueResolveRequest?.abort(), { signal });
	  $('#queueSelectAll').addEventListener('change', event => selectAllInQueueView(event.target.checked), { signal });
	  $('#queueClearHistory').addEventListener('click', async () => {
	    if (runBusy || historyBusy || !queueSaveStore.recent.size) return;
	    const account = queueSaveStore.accountId;
	    if (!await ask('Clear all Recently deleted history for this account?\n\nThis removes saved badges and unselected history-only chats. Your saved queue, current selection and Discord messages stay unchanged.')) return;
	    if (runBusy || historyBusy || getAuthorId() !== account) return;
	    historyBusy = true; updateQueueSelection();
	    try {
	      const result = await queueSaveStore.clearRecent();
	      queueCatalog = queueCatalog.filter(row => !row.recentOnly || queueSelection.has(row.key));
	      log.info('Deletion history cleared. Saved queue and current selection kept.');
	      if (result.cleanupPending) log.warn('History is cleared. Old storage cleanup will retry when you reopen the queue.');
	    } catch (error) { log.warn('Deletion history could not be cleared:', error.message); }
	    finally { historyBusy = false; renderQueue(); }
	  }, { signal });
	  $('#keepRecentCount').addEventListener('input', () => {
	    if (!runBusy) $('#activityDetail').textContent = retentionPreviewText($('#keepRecentCount').value);
	  }, { signal });
	  $('#queueKeepRecent').addEventListener('input', () => {
	    invalidateQueueResume(); updateQueueSelection();
	    $('#queueRetentionSummary').textContent = retentionPreviewText($('#queueKeepRecent').value);
	  }, { signal });
	  $('#queueBeforeDate').addEventListener('input', () => { invalidateQueueResume(); updateQueueSelection(); }, { signal });
	  $('#queueDialog').addEventListener('cancel', event => { event.preventDefault(); closeQueue(); }, { signal });
	  $('#queueSearch').addEventListener('input', () => { queueVisibleLimit = 100; queueMissingLimit = 50; renderQueue(); }, { signal });
	  for (const button of ui.eraseWindow.querySelectorAll('[data-queue-kind]')) button.onclick = () => {
	    queueKind = button.dataset.queueKind;
	    queueVisibleLimit = 100;
	    for (const tab of ui.eraseWindow.querySelectorAll('[data-queue-kind]')) tab.setAttribute('aria-pressed', String(tab === button));
	    renderQueue();
	  };
	  $('#queueList').addEventListener('change', event => {
	    const key = event.target.dataset.queueKey;
	    const row = queueCatalog.find(item => item.key === key);
	    if (!row) return;
	    invalidateQueueResume();
	    if (event.target.checked) {
	      if (queueSelection.size >= MAX_QUEUE_TARGETS) { event.target.checked = false; $('#queueNotice').textContent = `You can queue up to ${MAX_QUEUE_TARGETS.toLocaleString()} targets.`; return; }
	      const overlap = [...queueSelection.values()].some(item => item.guildId === row.guildId && row.guildId !== '@me' && (item.kind === 'server' || row.kind === 'server'));
	      if (overlap) { event.target.checked = false; $('#queueNotice').textContent = 'That server or one of its channels is already selected. Choose one scope to avoid overlap.'; return; }
	      queueSelection.set(key, { ...row });
	    } else queueSelection.delete(key);
	    if (row.kind === 'server') renderQueue();
	    else { updateQueueSelection(); renderQueueFriends(); }
	    console.log(PREFIX, 'queue selection changed', queueSelection.size);
	  }, { signal });
	  $('#queuePreview').onclick = () => startQueue(true);
	  $('#queueStart').onclick = () => startQueue(false);
	}

	async function startQueue(preview) {
	  if (runBusy || historyBusy || queueResolveRequest || !queueSelection.size) return;
	  const keep = Number($('#queueKeepRecent').value);
	  if (!Number.isInteger(keep) || keep < 0 || keep > 1000 || $('#queueKeepRecent').value === '') {
	    $('#queueNotice').textContent = 'Enter a whole number from 0 to 1,000.'; return;
	  }
	  const before = $('#queueBeforeDate').value;
	  const jobs = [...queueSelection.values()].map(row => ({ ...row, targetLabel: row.label }));
	  const recovery = queueRestored && queueRestored.progress.nextIndex < queueRestored.plan.jobs.length ? queueRestored : null;
	  const selection = [...queueSelection.values()];
	  const counts = selection.reduce((result, row) => { result[row.kind] = (result[row.kind] || 0) + 1; return result; }, {});
	  const categorySummary = `${counts.dm || 0} DMs, ${counts.group || 0} groups, ${counts.server || 0} servers, ${counts.channel || 0} individual channels`;
	  const selectedNames = selection.slice(0, 12).map(row => `${row.kind === 'server' ? 'Server' : 'Chat'}: ${row.label}`).join('\n');
	  const remainder = selection.length > 12 ? `\n...and ${selection.length - 12} more selected targets.` : '';
	  if (!preview && !await ask(`Delete your older messages from ${jobs.length} selected targets?\n${categorySummary}\n\n${selectedNames}${remainder}\n\nKeep newest: ${keep} messages in each channel (everyone's messages).\nBefore: ${before || 'No additional date cutoff'}.\nYour existing filters also apply.\n\nDeletion is permanent. New messages remain protected when the keep-newest count is above zero.`)) return;
	  if (runBusy) return;
	  closeQueue();
	  await startAction({ jobs, keep, before, preview, queueApproved: true, recovery });
	}

	const PREFIX = '[ERASE]';
	console.log(PREFIX, 'script loaded', VERSION, location.href);

	// -------------------------- User interface ------------------------------- //

	const eraseCore = new EraseCore();

	const ui = {
	  eraseWindow: null,
	  eraseBtn: null,
	  logArea: null,
	  autoScroll: null,

	  // progress handler
	  progressMain: null,
	  progressIcon: null,
	  percent: null,
	  progressCopy: null,
	  progressDeleted: null,
	  progressSkipped: null,
	  progressFailed: null,
	  progressElapsed: null,
	  progressRemaining: null,
	  statusBadge: null,
	  statusRenderer: null,
	};
	const $ = s => ui.eraseWindow.querySelector(s);

	function initUI() {
	  console.log(PREFIX, 'initializing UI');

	  messagePicker.init();
	  insertCss(themeCss);
	  insertCss(mainCss);
	  insertCss(queueCss);
	  insertCss(dragCss);

	  // create erase window
	  const eraseUI = replaceInterpolations(eraseTemplate, {
	    VERSION,
	  });
	  ui.eraseWindow = createElm(eraseUI);
	  document.body.appendChild(ui.eraseWindow);

	  // enable drag and resize on erase window
	  const dragResize = new DragResize({ elm: ui.eraseWindow, moveHandle: $('.header') });

	  // create erase Trash icon
	  ui.eraseBtn = createElm(buttonHtml);
	  ui.eraseBtn.classList.add('erase-mounting');
	  ui.eraseBtn.onclick = toggleWindow;
	  ui.eraseBtn.onkeydown = event => {
	    if (event.key === 'Enter' || event.key === ' ') {
	      event.preventDefault();
	      toggleWindow();
	    }
	  };

	  const toolbarSelectors = [
	    '#app-mount [aria-label="Channel header"] [role="toolbar"]',
	    '#app-mount [aria-label="Channel header"] [class*="toolbar"]',
	    '#app-mount [role="banner"] [role="toolbar"]',
	    '#app-mount [role="banner"] [class*="toolbar"]',
	  ];
	  let mountSequence = 0;
	  let revealFrame = null;
	  let mountPending = false;
	  const uiLifecycle = new AbortController();
	  let containmentFrame = null;
	  const scheduleContainment = () => {
	    if (containmentFrame !== null) return;
	    containmentFrame = requestAnimationFrame(() => { containmentFrame = null; containPanel(ui.eraseWindow); });
	  };
	  window.addEventListener('resize', scheduleContainment, { signal: uiLifecycle.signal });
	  window.visualViewport?.addEventListener('resize', scheduleContainment, { signal: uiLifecycle.signal });
	  window.visualViewport?.addEventListener('scroll', scheduleContainment, { signal: uiLifecycle.signal });

	  function isVisibleElement(elm) {
	    if (!elm || !elm.isConnected) return false;
	    const style = getComputedStyle(elm);
	    if (style.display === 'none' || style.visibility === 'hidden') return false;
	    const rect = elm.getBoundingClientRect();
	    return rect.width > 0 && rect.height > 0;
	  }

	  function isEraseButtonVisible() {
	    return isVisibleElement(ui.eraseBtn);
	  }

	  function findDiscordToolbar() {
	    for (const selector of toolbarSelectors) {
	      const toolbar = Array.from(document.querySelectorAll(selector)).find(elm =>
	        isVisibleElement(elm) && Array.from(elm.children).some(child => child !== ui.eraseBtn && isVisibleElement(child)));
	      if (toolbar) return toolbar;
	    }

	    // Older layouts may omit the header landmark. Require a real chat-header
	    // control, rather than any toolbar, Help button, or loading placeholder.
	    const headerControl = Array.from(document.querySelectorAll('#app-mount [aria-label]'))
	      .find(elm => isVisibleElement(elm) && /^(?:threads|notification settings|pinned messages|(?:show|hide) member list)$/i.test(elm.getAttribute('aria-label') || ''));
	    const toolbar = headerControl?.closest('[role="toolbar"], [class*="toolbar"]');
	    return isVisibleElement(toolbar) ? toolbar : null;
	  }

	  function hideLauncher() {
	    mountSequence++;
	    if (revealFrame !== null) cancelAnimationFrame(revealFrame);
	    revealFrame = null; mountPending = false;
	    ui.eraseBtn.classList.add('erase-mounting');
	    ui.eraseBtn.remove();
	  }

	  function placeButton(parent) {
	    const sequence = ++mountSequence;
	    if (revealFrame !== null) cancelAnimationFrame(revealFrame);
	    mountPending = true;
	    ui.eraseBtn.classList.add('erase-mounting');
	    parent.appendChild(ui.eraseBtn);
	    revealFrame = requestAnimationFrame(() => {
	      revealFrame = requestAnimationFrame(() => {
	        revealFrame = null;
	        if (uiLifecycle.signal.aborted || sequence !== mountSequence) return;
	        if (document.readyState !== 'complete' || document.fonts?.status === 'loading' || !parent.isConnected ||
	          ui.eraseBtn.parentElement !== parent || findDiscordToolbar() !== parent) {
	          hideLauncher(); return;
	        }
	        mountPending = false;
	        ui.eraseBtn.classList.remove('erase-mounting');
	        console.log(PREFIX, 'trash icon ready in Discord toolbar');
	      });
	    });
	  }

	  function mountBtn() {
	    if (uiLifecycle.signal.aborted) return false;
	    if (document.readyState !== 'complete' || document.fonts?.status === 'loading') return false;
	    const toolbar = findDiscordToolbar();
	    if (toolbar) {
	      if (ui.eraseBtn.parentElement === toolbar && (mountPending || isEraseButtonVisible())) return true;
	      placeButton(toolbar);
	      return true;
	    }
	    if (ui.eraseBtn.isConnected || mountPending) hideLauncher();
	    return false;
	  }
	  mountBtn();
	  window.addEventListener('load', mountBtn, { once: true, signal: uiLifecycle.signal });
	  window.addEventListener('resize', mountBtn, { signal: uiLifecycle.signal });
	  document.addEventListener('visibilitychange', () => { if (!document.hidden) mountBtn(); }, { signal: uiLifecycle.signal });
	  document.fonts?.addEventListener('loadingdone', mountBtn, { signal: uiLifecycle.signal });
	  // watch for changes and re-mount button if necessary
	  let discordElm = null;
	  let observerThrottle = null;
	  const observer = new MutationObserver((_mutationsList, _observer) => {
	    observeDiscordRoot();
	    if (!ui.eraseBtn.isConnected && mountPending) hideLauncher();
	    if (observerThrottle) return;
	    observerThrottle = setTimeout(() => {
	      observerThrottle = null;
	      if (ui.eraseWindow.style.display !== 'none') refreshContext();
	      if (!ui.eraseBtn.isConnected || !discordElm.contains(ui.eraseBtn) || (!mountPending && !isEraseButtonVisible())) {
	        mountBtn(); // Re-mount only into a ready header; never into the page body.
	      }
	    }, 100);
	  });
	  function observeDiscordRoot() {
	    const nextRoot = document.querySelector('#app-mount') || document.body;
	    if (nextRoot === discordElm) return;
	    observer.disconnect(); discordElm = nextRoot;
	    observer.observe(discordElm, { attributes: false, childList: true, subtree: true });
	    if (discordElm !== document.body) observer.observe(document.body, { attributes: false, childList: true });
	  }
	  observeDiscordRoot();

	  function toggleWindow() {
	    const willShow = ui.eraseWindow.style.display === 'none';
	    if (willShow && !$('input#token').value) fillToken({ silent: true });
	    ui.eraseWindow.style.display = willShow ? '' : 'none';
	    if (willShow) { containPanel(ui.eraseWindow); ui.statusRenderer?.refresh(); refreshContext(true); }
	    else { $('#eraseTooltip').hidden = true; if ($('#queueDialog').open) closeQueue(); if ($('#changelogDialog').open) $('#changelogDialog').close(); }
	    ui.eraseBtn.style.color = willShow ? 'var(--interactive-active)' : 'var(--interactive-normal)';
	    ui.eraseBtn.setAttribute('aria-expanded', String(willShow));
	  }

	  document.addEventListener('keydown', event => {
	    const isEraseShortcut = event.ctrlKey
	      && !event.altKey
	      && !event.metaKey
	      && !event.shiftKey
	      && !event.repeat
	      && event.key.toLowerCase() === 'd';
	    if (!isEraseShortcut) return;
	    event.preventDefault();
	    event.stopPropagation();
	    console.log(PREFIX, 'Ctrl+D toggled the UI');
	    toggleWindow();
	  }, { capture: true, signal: uiLifecycle.signal });

	  window.addEventListener('pagehide', event => {
	    if (observerThrottle) clearTimeout(observerThrottle);
	    if (revealFrame !== null) cancelAnimationFrame(revealFrame);
	    observer.disconnect();
	    if (containmentFrame !== null) cancelAnimationFrame(containmentFrame);
	    if (activityTimer) clearInterval(activityTimer);
	    contextRequest?.abort(); queueRequest?.abort();
	    preparingQueueRequest?.abort();
	    if (queueSaveTimer) clearTimeout(queueSaveTimer); queueSaveTimer = null;
	    if (recentSaveTimer) clearTimeout(recentSaveTimer); recentSaveTimer = null;
	    void saveQueueCheckpoint(eraseCore.queueCheckpointSnapshot('stopped')).catch(() => {});
	    void queueSaveStore.flushRecent().catch(() => {});
	    for (const value of Object.values(dragResize)) if (value instanceof Draggable) value.destroy();
	    eraseCore.stop();
	    uiLifecycle.abort();
	  }, { once: true });

	  // cached elements
	  ui.logArea = $('#logArea');
	  ui.autoScroll = $('#autoScroll');
	  ui.progressMain = $('#progressBar');
	  ui.progressIcon = ui.eraseBtn.querySelector('progress');
	  ui.percent = $('#progressPercent');
	  ui.progressCopy = $('#progressCopy');
	  ui.progressDeleted = $('#progressDeleted');
	  ui.progressSkipped = $('#progressSkipped');
	  ui.progressFailed = $('#progressFailed');
	  ui.progressElapsed = $('#progressElapsed');
	  ui.progressRemaining = $('#progressRemaining');
	  ui.statusBadge = $('#statusBadge');
	  ui.statusRenderer = createStatusRenderer(ui.statusBadge);

	  // register event listeners
	  $('#hide').onclick = toggleWindow;
	  $('#toggleSidebar').onclick = ()=> ui.eraseWindow.classList.toggle('hide-sidebar');
	  $('button#start').onclick = () => startAction();
	  $('button#pause').onclick = pauseAction;
	  $('button#stop').onclick = stopAction;
	  $('button#clear').onclick = clearLog;
	  $('button#diagnostics').onclick = exportDiagnostics;
	  $('#openChangelog').onclick = () => $('#changelogDialog').showModal();
	  $('#closeChangelog').onclick = () => { $('#changelogDialog').close(); $('#openChangelog').focus(); };
	  $('button#getAuthor').onclick = () => $('input#authorId').value = getAuthorId();
	  $('button#getGuild').onclick = () => {
	    $('#followChannel').checked = true; syncFollowChannelVisibility(); refreshContext(true);
	  };
	  $('button#getChannel').onclick = () => {
	    $('#followChannel').checked = true; syncFollowChannelVisibility(); refreshContext(true);
	  };
	  for (const id of ['guildId', 'channelId']) $(`#${id}`).addEventListener('input', () => {
	    $('#followChannel').checked = false; syncFollowChannelVisibility(); contextRequest?.abort();
	    $('#contextName').textContent = 'Manual scope';
	    $('#contextMeta').textContent = 'The selected scope will be verified before starting.';
	  }, { signal: uiLifecycle.signal });
	  $('#followChannel').onchange = () => { syncFollowChannelVisibility(); if ($('#followChannel').checked) refreshContext(true); else contextRequest?.abort(); };
	  window.addEventListener('popstate', () => refreshContext(), { signal: uiLifecycle.signal });
	  installToggleHelp(uiLifecycle.signal);
	  installQueueControls(uiLifecycle.signal);
	    installWebhookSettings(uiLifecycle.signal);
	  eraseCore.onQueueCheckpoint = saveQueueCheckpoint;
	  eraseCore.onDeleted = recordRecentDeletion;
	  try { void loadQueueMemory(getAuthorId()); } catch { /* Available after sign-in. */ }
	  $('#redact').onchange = () => {
	    const b = ui.eraseWindow.classList.toggle('redact', $('#redact').checked);
	    if (b) alert('This mode will attempt to hide personal information, so you can screen share / take screenshots.\nAlways double check you are not sharing sensitive information!');
	  };
	  $('#pickMessageAfter').onclick = async () => {
	    alert('Select a message on the chat.\nThe message below it will be deleted.');
	    toggleWindow();
	    const id = await messagePicker.grab('after');
	    if (id) $('input#minId').value = id;
	    toggleWindow();
	  };
	  $('#pickMessageBefore').onclick = async () => {
	    alert('Select a message on the chat.\nThe message above it will be deleted.');
	    toggleWindow();
	    const id = await messagePicker.grab('before');
	    if (id) $('input#maxId').value = id;
	    toggleWindow();
	  };
	  $('button#getToken').onclick = () => $('input#token').value = fillToken();

	  // sync delays
	  $('input#searchDelay').onchange = (e) => {
	    const v = parseInt(e.target.value);
	    if (v) eraseCore.options.searchDelay = v;
	  };
	  $('input#deleteDelay').onchange = (e) => {
	    const v = parseInt(e.target.value);
	    if (v) eraseCore.options.deleteDelay = v;
	  };

	  $('input#searchDelay').addEventListener('input', (event) => {
	    $('#searchDelayValue').textContent = event.target.value + 'ms';
	  });
	  $('input#deleteDelay').addEventListener('input', (event) => {
	    $('#deleteDelayValue').textContent = event.target.value + 'ms';
	  });

	  // redirect console logs to inside the window after setting up the UI
	  setLogFn(printLog);

	  setupEraseCore();
	  fillToken({ silent: true });
	  refreshContext(true);
	}

	const MAX_LOG_ROWS = 500;
	const MAX_LOG_CHARS = 262144; // At most 512 KiB of UTF-16 log text.
	const MAX_LOG_ENTRY_CHARS = 8192;
	let logChars = 0;

	function clearLog() {
	  ui.logArea.replaceChildren();
	  logChars = 0;
	}

	function printLog(type = '', args) {
	  const safeType = ['debug', 'info', 'verb', 'warn', 'error', 'success'].includes(type) ? type : 'info';
	  const html = Array.from(args).map(formatLogArg).join(' ');
	  ui.logArea.insertAdjacentHTML('beforeend', `<div class="log log-${safeType}"><span class="log-time">${new Date().toLocaleTimeString()}</span><span class="log-message">${html}</span></div>`);
	  const row = ui.logArea.lastElementChild;
	  const message = row.querySelector('.log-message');
	  if (message.textContent.length > MAX_LOG_ENTRY_CHARS) {
	    // Exceptionally large attachment/error payloads cannot defeat the budget.
	    // Normal console entries keep their existing rich inline formatting.
	    const truncated = document.createElement('x');
	    truncated.textContent = message.textContent.slice(0, MAX_LOG_ENTRY_CHARS - 16) + ' ... [truncated]';
	    message.replaceChildren(truncated); // Keep the existing streamer-mode privacy rule.
	  }
	  row.dataset.logChars = String(row.textContent.length);
	  logChars += Number(row.dataset.logChars);
	  while (ui.logArea.childElementCount > MAX_LOG_ROWS || logChars > MAX_LOG_CHARS) {
	    const oldest = ui.logArea.firstElementChild;
	    logChars -= Number(oldest.dataset.logChars) || 0;
	    oldest.remove();
	  }
	  if (ui.autoScroll.checked) row.scrollIntoView(false);
	  if (type==='error') console.error(PREFIX, ...Array.from(args).map(arg => redactSensitiveText(String(arg))));
	}

	function formatLogArg(value) {
	  let raw;
	  try {
	    raw = typeof value === 'object' ?
	      JSON.stringify(value, value instanceof Error && Object.getOwnPropertyNames(value)) :
	      String(value);
	  } catch {
	    raw = String(value);
	  }
	  return escapeHTML(redactSensitiveText(raw))
	    .replace(/&lt;(\/?(?:x|sup|b|i))&gt;/g, '<$1>')
	    .replace(/<\/i><x>/g, '</i> <x>')
	    .replace(/&lt;br\s*\/?&gt;/gi, ' · ')
	    .replace(/(?:\r\n|\r|\n)+/g, ' · ');
	}

	function setupEraseCore() {
	  const visualStatusTokens = Object.freeze({
	    Idle: 'idle',
	    Preparing: 'preparing',
	    Searching: 'searching',
	    'Waiting for index': 'waiting-index',
	    'Rate limited': 'rate-limited',
	    Deleting: 'deleting',
	    Paused: 'paused',
	    Stopping: 'stopping',
	    Done: 'done',
	    Error: 'error',
	  });
	  const syncVisualState = (state, max, value = 0) => {
	    const status = visualStatusTokens[state.status] || 'idle';
	    ui.eraseWindow.dataset.status = status;
	    ui.eraseBtn.dataset.status = status;
	    if (max !== undefined) {
	      const progressMode = Number(max) > 0 ? 'determinate' : 'indeterminate';
	      const progressRatio = Number(max) > 0
	        ? Math.max(0, Math.min(1, Number(value) / Number(max)))
	        : 0;
	      ui.eraseWindow.dataset.progress = progressMode;
	      ui.eraseBtn.dataset.progress = progressMode;
	      ui.eraseWindow.style.setProperty('--erase-ui-progress-ratio', String(progressRatio));
	    }
	  };

	  eraseCore.onStart = (state, stats) => {
	    console.log(PREFIX, 'onStart', state.status, stats.startTime);
	    setRunControls(true);

	    ui.eraseBtn.classList.add('running');
	    ui.percent.style.display = 'block';
	    syncVisualState(state, state.grandTotal);
	    updateStatus(state);
	  };

	  eraseCore.onProgress = (state, stats) => {
	    scheduleQueueCheckpoint(state.paused || state.stopRequested);
	    // console.log(PREFIX, 'onProgress', state, stats);
	    let max = state.grandTotal;
	    let value = state.delCount + state.failCount + (state.skippedCount || 0) + (state.alreadyDeletedCount || 0);
	    max = Math.max(max, value, 0); // clamp max

	    // Each metric keeps its own cell; CSS reflows the footer as the pane narrows.
	    const percent = max ? `${Math.round(value / max * 100)}%` : '...';
	    const startTime = stats.startTime instanceof Date ? stats.startTime.getTime() : Number.NaN;
	    const elapsed = Number.isFinite(startTime) ? msToHMS(Date.now() - startTime) : '00:00';
	    const remaining = Number.isFinite(stats.etr) ? msToHMS(stats.etr) : '00:00';
	    ui.percent.textContent = percent;
	    ui.progressCopy.textContent = max
	      ? `${value.toLocaleString()}/${max.toLocaleString()} processed`
	      : `${value.toLocaleString()} processed`;
	    ui.progressDeleted.textContent = (state.delCount || 0).toLocaleString();
	    ui.progressSkipped.textContent = (state.skippedCount || 0).toLocaleString();
	    ui.progressFailed.textContent = (state.failCount || 0).toLocaleString();
	    ui.progressElapsed.textContent = elapsed;
	    ui.progressRemaining.textContent = remaining;
	    const batch = eraseCore.batch;
	    if (batch) {
	      ui.progressCopy.textContent = `Target ${batch.index}/${batch.total} · ${value.toLocaleString()}/~${max.toLocaleString()} processed`;
	      ui.progressDeleted.textContent = (batch.deleted + (state.deletedCount || 0)).toLocaleString();
	      ui.progressSkipped.textContent = (batch.skipped + (state.skippedCount || 0)).toLocaleString();
	      ui.progressFailed.textContent = (batch.failed + (state.failedCount || 0)).toLocaleString();
	    } else if (state.queueSummary) {
	      const summary = state.queueSummary;
	      ui.progressCopy.textContent = `${summary.completed}/${summary.total} queued targets completed`;
	      ui.progressDeleted.textContent = summary.deleted.toLocaleString();
	      ui.progressSkipped.textContent = summary.skipped.toLocaleString();
	      ui.progressFailed.textContent = summary.failed.toLocaleString();
	      ui.percent.textContent = `${Math.round(summary.completed / summary.total * 100)}%`;
	      max = summary.total;
	      value = summary.completed;
	    }
	    syncVisualState(state, max, value);
	    updateStatus(state);

	    ui.progressIcon.value = value;
	    ui.progressMain.value = value;

	    // indeterminate progress bar
	    if (max) {
	      ui.progressIcon.setAttribute('max', max);
	      ui.progressMain.setAttribute('max', max);
	    } else {
	      ui.progressIcon.removeAttribute('value');
	      ui.progressMain.removeAttribute('value');
	    }

	    // update delays
	    const searchDelayInput = $('input#searchDelay');
	    searchDelayInput.value = eraseCore.options.searchDelay;
	    $('#searchDelayValue').textContent = eraseCore.options.searchDelay+'ms';

	    const deleteDelayInput = $('input#deleteDelay');
	    deleteDelayInput.value = eraseCore.options.deleteDelay;
	    const currentDelay = state.currentDeleteDelay ?? eraseCore.options.deleteDelay;
	    $('#deleteDelayValue').textContent = currentDelay === eraseCore.options.deleteDelay
	      ? eraseCore.options.deleteDelay+'ms'
	      : `${eraseCore.options.deleteDelay}ms (pace ${currentDelay}ms)`;

	    $('#pause').textContent = state.paused ? 'Resume' : 'Pause';
	  };

	  eraseCore.onStop = (state, stats) => {
	    console.log(PREFIX, 'onStop', state.stopReason, stats.endTime);
	    setRunControls(runBusy || Boolean(eraseCore.batch));
	    if (runBusy && !eraseCore.batch) { $('#pause').disabled = true; $('#stop').disabled = true; }
	    $('#pause').textContent = 'Pause';
	    ui.eraseBtn.classList.remove('running');
	    ui.percent.style.display = 'block';
	    syncVisualState(state);
	    updateStatus(state);
	  };
	}

	function updateStatus(state) {
	  if (!ui.statusBadge) return;
	  const batch = eraseCore.batch;
	  const summary = state.queueSummary;
	  const target = batch ? `Target ${batch.index} of ${batch.total}: ${eraseCore.options.targetLabel || 'Selected scope'}` : '';
	  if ($('#activityTarget').textContent !== target) $('#activityTarget').textContent = target;
	  const stopped = state.stopReason === STOP_REASONS.USER_STOPPED;
	  const label = stopped && !state.running ? 'Stopped' : state.status || 'Idle';
	  if (ui.statusBadge.textContent !== label) ui.statusBadge.textContent = label;
	  ui.statusRenderer?.refresh();
	  const keep = eraseCore.options.keepRecentCount || 0;
	  const waitSeconds = Math.max(0, Math.ceil(((state.waitUntil || 0) - Date.now()) / 1000));
	  const terminal = !state.running && !batch;
	  let title = state.paused ? 'Paused. Resume when you are ready.' : state.activity || 'Ready when you are';
	  let detail = `${batch ? `Target ${batch.index} of ${batch.total} · ` : ''}${state.deletedCount || 0} deleted · ${state.skippedCount || 0} skipped · ${state.failedCount || 0} failed · ${state.searchedPages || 0} search pages`;
	  if (waitSeconds && !state.paused) title += ` · ${waitSeconds}s`;
	  if (terminal && state.stopReason) {
	    const totalDeleted = summary?.deleted ?? state.deletedCount;
	    title = stopped ? 'Stopped. No further messages will be deleted.' : state.status === STATUS.ERROR ? 'Stopped safely. Review the activity log.' : eraseCore.options.dryRun ? 'Preview complete. No messages were deleted.' : `Finished. ${totalDeleted || 0} messages deleted.`;
	    if (!summary && state.retentionSkipNotice && state.stopReason === STOP_REASONS.NO_DELETABLE_MESSAGES) title = state.retentionSkipNotice;
	    detail = `${summary ? `${summary.completed}/${summary.total} queued targets completed · ` : ''}${keep ? `Newest ${keep} messages protected in each channel` : 'Newest-message protection was off'} · ${summary?.skipped ?? state.skippedCount ?? 0} skipped · ${summary?.failed ?? state.failedCount ?? 0} failed`;
	  }
	  if (state.status === STATUS.IDLE) detail = retentionPreviewText($('#keepRecentCount').value);
	  if ($('#activityTitle').textContent !== title) $('#activityTitle').textContent = title;
	  if ($('#activityDetail').textContent !== detail) $('#activityDetail').textContent = detail;
	  if (runBusy) {
	    const start = eraseCore.stats.startTime?.getTime?.();
	    if (start) ui.progressElapsed.textContent = msToHMS(Date.now() - start);
	  }
	}

	function createStatusRenderer(host) {
	  // Keep one vector clip, without bitmap caches, object URLs or per-frame JS.
	  // The original CSS remains the fallback for unsupported rendering/scales.
	  if (!window.SVGClipPathElement || !window.ResizeObserver || !CSS.supports('clip-path', 'url("#erase-status-clip")')) {
	    return { refresh() {}, dispose() {} };
	  }
	  const ns = 'http://www.w3.org/2000/svg';
	  const lifecycle = new AbortController();
	  const { signal } = lifecycle;
	  const svg = document.createElementNS(ns, 'svg');
	  svg.setAttribute('width', '0');
	  svg.setAttribute('height', '0');
	  svg.setAttribute('aria-hidden', 'true');
	  svg.setAttribute('focusable', 'false');
	  svg.style.position = 'absolute';
	  svg.style.pointerEvents = 'none';
	  const defs = document.createElementNS(ns, 'defs');
	  const clip = document.createElementNS(ns, 'clipPath');
	  const glyph = document.createElementNS(ns, 'text');
	  const clipId = `erase-status-clip-${Math.random().toString(36).slice(2)}`;
	  clip.id = clipId;
	  clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
	  glyph.setAttribute('x', '0');
	  clip.appendChild(glyph);
	  defs.appendChild(clip);
	  svg.appendChild(defs);
	  host.parentElement.appendChild(svg);
	  const fontProperties = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'fontVariantNumeric', 'fontKerning', 'letterSpacing', 'textRendering', 'textTransform'];
	  let lastKey = '';
	  let disposed = false;
	  const restore = () => {
	    host.classList.remove('erase-composited-status');
	    host.style.removeProperty('clip-path');
	  };
	  function refresh() {
	    if (disposed) return;
	    const status = ui.eraseWindow.dataset.status;
	    // Preserve native CSS at fractional scales where clip antialiasing differs.
	    const scale = devicePixelRatio;
	    if (![1, 2, 3].includes(scale) || status === 'done' || status === 'error') {
	      restore();
	      return;
	    }
	    const rect = host.getBoundingClientRect();
	    if (!rect.width || !rect.height) return;
	    const style = getComputedStyle(host);
	    const text = host.textContent;
	    const key = JSON.stringify([text, rect.width, rect.height, scale, ...fontProperties.map(name => style[name])]);
	    if (key !== lastKey) {
	      const marker = document.createElement('span');
	      Object.assign(marker.style, { display: 'inline-block', width: '0px', height: '0px', padding: '0px', margin: '0px', border: 'none', verticalAlign: 'baseline' });
	      try {
	        host.appendChild(marker);
	        const baseline = marker.getBoundingClientRect().top - host.getBoundingClientRect().top;
	        glyph.setAttribute('y', String(baseline + (scale > 1 ? 0.5 : 0)));
	      } finally {
	        marker.remove();
	      }
	      for (const name of fontProperties) glyph.style[name] = style[name];
	      glyph.textContent = text;
	      lastKey = key;
	    }
	    host.style.clipPath = `url("#${clipId}")`;
	    host.classList.add('erase-composited-status');
	  }
	  const observer = new ResizeObserver(refresh);
	  observer.observe(host);
	  window.addEventListener('resize', refresh, { signal });
	  window.addEventListener('pageshow', event => {
	    if (event.persisted) refresh();
	  }, { signal });
	  window.addEventListener('pagehide', event => {
	    if (!event.persisted) dispose();
	  }, { signal });
	  document.fonts?.addEventListener('loadingdone', refresh, { signal });
	  refresh();
	  function dispose() {
	    disposed = true;
	    lifecycle.abort();
	    observer.disconnect();
	    svg.remove();
	    restore();
	  }
	  return { refresh, dispose };
	}

	async function startAction(queueOptions = {}) {
	  if (runBusy || webhookBusy || eraseCore._runActive || eraseCore.batch) return;
	  console.log(PREFIX, 'startAction');
	  // general
	  const authorId = $('input#authorId').value.trim();
	  const guildId = $('input#guildId').value.trim();
	  const channelIds = $('input#channelId').value.trim().split(/\s*,\s*/);
	  const includeNsfw = false; // Verified from Discord channel metadata at run start.
	  const keepRecentCount = queueOptions.keep ?? Number($('#keepRecentCount').value);
	  if (!Number.isInteger(keepRecentCount) || keepRecentCount < 0 || keepRecentCount > 1000 || (!queueOptions.jobs && $('#keepRecentCount').value === '')) return log.error('Keep newest messages must be a whole number from 0 to 1,000.');
	  // filter
	  const content = $('input#search').value.trim();
	  const hasLink = $('input#hasLink').checked;
	  const hasFile = $('input#hasFile').checked;
	  const includePinned = $('input#includePinned').checked;
	  const dryRun = queueOptions.preview ?? $('input#dryRun').checked;
	  const pattern = $('input#pattern').value;
	  // message interval
	  const minId = $('input#minId').value.trim();
	  const maxId = $('input#maxId').value.trim();
	  // date range
	  const minDate = $('input#minDate').value.trim();
	  const maxDate = $('input#maxDate').value.trim();
	  //advanced
	  const searchDelay = parseInt($('input#searchDelay').value.trim());
	  const deleteDelay = parseInt($('input#deleteDelay').value.trim());
	  const adaptiveDeletePacing = $('input#adaptiveDeletePacing').checked;
	  const conservativeMode = $('input#conservativeMode').checked;
	  const prefetchPages = parseInt($('input#prefetchPages').value.trim());
	  const maxEmptyPageRetries = parseInt($('input#maxEmptyPageRetries').value.trim());
	  const maxEmptyPageSkips = parseInt($('input#maxEmptyPageSkips').value.trim());
	  const maxStagnantCycles = parseInt($('input#maxStagnantCycles').value.trim());
	  const maxRuntimeMinutes = parseInt($('input#maxRuntimeMinutes').value.trim());

	  // token
	  const authToken = $('input#token').value.trim() || fillToken();
	  if (!authToken) return; // get token already logs an error.
	  let effectiveAuthorId = authorId;
	  if (!effectiveAuthorId) {
	    try {
	      effectiveAuthorId = getAuthorId();
	    } catch (err) {
	      log.error('Could not detect the current user ID. Fill Author ID manually.', err);
	      return;
	    }
	  }
	  if (!authorId && effectiveAuthorId) $('input#authorId').value = effectiveAuthorId;

	  // validate input
	  if (!queueOptions.jobs && !guildId) return log.error('Select a channel or fill the Server ID field.');
	  if (!/^\d{17,20}$/.test(effectiveAuthorId || '')) return log.error('A valid author ID is required.');
	  const jobs = queueOptions.jobs || channelIds.map(channelId => ({ guildId, channelId }));
	  if (jobs.some(job => !(job.guildId === '@me' || /^\d{17,20}$/.test(job.guildId)) || (job.channelId && !/^\d{17,20}$/.test(job.channelId)) || (job.guildId === '@me' && !job.channelId))) return log.error('The selected server or channel ID is invalid.');
	  if (pattern) { try { new RegExp(pattern, 'i'); } catch { return log.error('Fix the regular expression before starting.'); } }
	  let effectiveMax;
	  try {
	    effectiveMax = minSnowflake([maxId || maxDate, queueOptions.before].filter(Boolean).map(toSnowflake));
	    if (effectiveMax && !/^\d{17,20}$/.test(effectiveMax)) return log.error('Enter a valid before-message ID or date.');
	    if ((minId || minDate) && !/^\d{17,20}$/.test(toSnowflake(minId || minDate))) return log.error('Enter a valid after-message ID or date.');
	    if ((minId || minDate) && effectiveMax && compareSnowflakes(toSnowflake(minId || minDate), effectiveMax) >= 0) return log.error('The start of the interval must be earlier than its end.');
	  } catch { return log.error('Check the message IDs and date interval.'); }
	  const notification = readWebhookSettings();
	  if (notification.enabled) {
	    try { normalizeWebhookUrl(notification.url); } catch {
	      return log.error('Enter a valid URL in the Webhook section, or turn Discord webhook reports off.');
	    }
	  }
	  const notificationContext = { queued: Boolean(queueOptions.jobs || jobs.length > 1), preview: dryRun,
	    totalTargets: jobs.length, keepNewest: keepRecentCount, startedAt: Date.now() };
	  contextRequest?.abort();
	  runBusy = true;
	  setRunControls(true);
	  $('#pause').disabled = true;
	  singleHistoryId = crypto.randomUUID();
	  queueSaveFailed = false;

	  // clear logArea
	  clearLog();

	  eraseCore.resetState();
	  eraseCore.options = {
	    ...eraseCore.options,
	    // Target identity belongs to this run; queued jobs supply their own below.
	    key: undefined, kind: undefined, label: undefined, targetLabel: undefined, resolvedFriendId: undefined,
	    authToken,
	    authorId: effectiveAuthorId,
	    guildId,
	    channelId: channelIds.length === 1 ? channelIds[0] : undefined, // single or multiple channel
	    minId: minId || minDate,
	    maxId: effectiveMax,
	    content,
	    hasLink,
	    hasFile,
	    includeNsfw,
	    includePinned,
	    dryRun,
	    pattern,
	    searchDelay,
	    deleteDelay,
	    adaptiveDeletePacing,
	    conservativeMode,
	    prefetchPages,
	    maxEmptyPageRetries,
	    maxEmptyPageSkips,
	    maxStagnantCycles,
	    maxRuntimeMinutes,
	    keepRecentCount,
	    protectionBeforeId: undefined, // Fresh runs must not inherit an earlier queue's cutoff.
	    verifyContext: true,
	    askForConfirmation: !queueOptions.queueApproved && !dryRun,
	  };
	  const preparation = preparingQueueRequest = new AbortController();
	  try {
	    if (queueOptions.jobs || jobs.length > 1) {
	      const executeQueue = async () => {
	        if (dryRun) {
	          const remaining = queueOptions.recovery ? jobs.slice(queueOptions.recovery.progress.nextIndex) : jobs;
	          if (queueOptions.recovery) eraseCore.options = { ...eraseCore.options, ...queueOptions.recovery.plan.options,
	            authToken, dryRun: true, verifyContext: true, askForConfirmation: false };
	          await eraseCore.runBatch(remaining, queueOptions.recovery ? { nextIndex: 0, totals: zeroQueueCounters(),
	            targetCounters: zeroQueueCounters(), retention: queueOptions.recovery.progress.retention, elapsedMs: 0 } : null); return;
	        }
	        const account = await new DiscordApiClient().getResource('/users/@me', authToken, preparation.signal);
	        if (!account.ok || account.body?.id !== effectiveAuthorId) throw new Error('The queued author does not match the signed-in account. Nothing deleted.');
	        preparation.signal.throwIfAborted();
	        const saved = await queueSaveStore.begin(jobs, eraseCore.options, queueOptions.recovery || null);
	        lastSavedQueue = saved; renderSavedQueue();
	        preparation.signal.throwIfAborted();
	        eraseCore.options = { ...eraseCore.options, ...saved.plan.options, authToken, verifyContext: true, askForConfirmation: false };
	        await eraseCore.runBatch(saved.plan.jobs.map(job => ({ ...job, targetLabel: job.label })), queueOptions.recovery ? saved.progress : null);
	      };
	      if (dryRun) await executeQueue();
	      else {
	        if (!navigator.locks?.request) throw new Error('This browser cannot safely coordinate a saved queue. Use a current browser.');
	        await navigator.locks.request(`erase-queue-${effectiveAuthorId}`, { ifAvailable: true }, async lock => {
	          if (!lock) throw new Error('Another Erase tab is running a queue for this account. Pause and stop it before resuming here.');
	          preparation.signal.throwIfAborted(); await executeQueue();
	        });
	      }
	    }
	    else await eraseCore.run();
	  } catch (err) {
	    if (err.name !== 'AbortError') log.error('CoreException', err);
	    eraseCore.stop();
	    eraseCore.state.stopReason = err.name === 'AbortError' ? STOP_REASONS.USER_STOPPED : STOP_REASONS.ERROR;
	    eraseCore.state.status = err.name === 'AbortError' ? STATUS.DONE : STATUS.ERROR;
	  } finally {
	    if (preparingQueueRequest === preparation) preparingQueueRequest = null;
	    if (queueSaveTimer) clearTimeout(queueSaveTimer); queueSaveTimer = null;
	    if (recentSaveTimer) clearTimeout(recentSaveTimer); recentSaveTimer = null;
	    try { await queueSaveStore.flushRecent(); } catch { log.warn('Recent deletion history could not be saved.'); }
	    if (notification.enabled) {
	      const report = createRunReport(eraseCore.state, eraseCore.stats, notificationContext);
	      try {
	        console.log(PREFIX, 'sending final webhook report', report.mode, report.outcome);
	        const delivery = await sendRunWebhook(notification.url, buildWebhookPayload(report));
	        log[delivery.ok ? 'info' : 'warn'](delivery.message);
	        console.log(PREFIX, 'final webhook report', delivery.ok ? 'delivered' : 'not confirmed');
	      } catch { log.warn('Webhook report could not be sent. The deletion result is unchanged.'); }
	    }
	    notification.url = '';
	    runBusy = false;
	    setRunControls(false);
	    $('#pause').textContent = 'Pause';
	    updateStatus(eraseCore.state);
	    contextRoute = ''; // A changed route is picked up on the next open/navigation.
	  }
	}

	function stopAction() {
	  console.log(PREFIX, 'stopAction');
	  preparingQueueRequest?.abort();
	  eraseCore.stop();
	}

	function pauseAction() {
	  console.log(PREFIX, 'pauseAction');
	  if (eraseCore.state.paused) eraseCore.resume();
	  else eraseCore.pause();
	}

	function exportDiagnostics() {
	  const diagnostics = eraseCore.exportDiagnostics();
	  const blob = new Blob([diagnostics], { type: 'application/json' });
	  const url = URL.createObjectURL(blob);
	  const a = document.createElement('a');
	  a.href = url;
	  a.download = `erase-diagnostics-${Date.now()}.json`;
	  a.click();
	  URL.revokeObjectURL(url);
	  log.info('Exported sanitized diagnostics. Tokens, IDs, and message content are redacted.');
	}

	// ---- END Erase ----

	let uiInitializationStarted = false;
	function initializeUiWhenReady() {
	  if (uiInitializationStarted || !document.head || !document.body) return false;
	  uiInitializationStarted = true;
	  initUI();
	  return true;
	}

	installAuthorizationCaptureHooks();
	if (!initializeUiWhenReady()) {
	  document.addEventListener('DOMContentLoaded', initializeUiWhenReady, { once: true });
	}

})();

/*
MIT License

Copyright (c) 2026 saintordevil (Erase modifications)
Copyright (c) 2019-2025 Victornpb and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

Attribution: Original project (https://github.com/victornpb/undiscord)
Derivatives must keep attribution comments to the original project in the code readme and license.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
