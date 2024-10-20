'use strict';

const comments = [];

const apiKeyInput = document.getElementById('api-key-input');
const apiKeyModal = document.getElementById('api-key-modal');
const apiKeySubmit = document.getElementById('api-key-authorize');
const commentSidebar = document.getElementById('comment-sidebar');
const cronPattern = document.getElementById('cron-pattern');
const cronWidget = document.getElementById('cron-widget');
const datetimeList = document.getElementById('datetime-list');
const evalWidget = document.getElementById('eval-widget');
const manualDatetime = document.getElementById('manual-datetime');
const manualSchedule = document.getElementById('manual-schedule');
const recurringSchedule = document.getElementById('recurring-schedule');
const saveScheduleBtn = document.getElementById('save-schedule');
const scheduleTypeInputs = cronWidget.querySelectorAll('input[name="schedule-type"]');

const BUILD_STEPS = [
    'Preparing build environment',
    'Compiling source code',
    'Running tests',
    'Packaging application',
    'Running build script'
];

const CHECK_INTERVAL = 5000;
const MAX_CONSECUTIVE_ERRORS = 5;
const MAX_DISCONNECTED_COUNT = 5;

const getBaseUrl = () => window.location.origin;

const addCommentIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M0 0h1v1h-1zM1 0h1v1h-1zM2 0h1v1h-1zM3 0h1v1h-1zM4 0h1v1h-1zM5 0h1v1h-1zM6 0h1v1h-1zM7 0h1v1h-1zM8 0h1v1h-1zM9 0h1v1h-1zM10 0h1v1h-1zM11 0h1v1h-1zM12 0h1v1h-1zM13 0h1v1h-1zM14 0h1v1h-1zM15 0h1v1h-1zM0 1h1v1h-1zM1 1h1v1h-1zM2 1h1v1h-1zM3 1h1v1h-1zM4 1h1v1h-1zM5 1h1v1h-1zM6 1h1v1h-1zM7 1h1v1h-1zM8 1h1v1h-1zM9 1h1v1h-1zM10 1h1v1h-1zM11 1h1v1h-1zM12 1h1v1h-1zM13 1h1v1h-1zM14 1h1v1h-1zM15 1h1v1h-1zM0 2h1v1h-1zM1 2h1v1h-1zM14 2h1v1h-1zM15 2h1v1h-1zM0 3h1v1h-1zM1 3h1v1h-1zM14 3h1v1h-1zM15 3h1v1h-1zM0 4h1v1h-1zM1 4h1v1h-1zM14 4h1v1h-1zM15 4h1v1h-1zM0 5h1v1h-1zM1 5h1v1h-1zM14 5h1v1h-1zM15 5h1v1h-1zM0 6h1v1h-1zM1 6h1v1h-1zM14 6h1v1h-1zM15 6h1v1h-1zM0 7h1v1h-1zM1 7h1v1h-1zM14 7h1v1h-1zM15 7h1v1h-1zM0 8h1v1h-1zM1 8h1v1h-1zM14 8h1v1h-1zM15 8h1v1h-1zM0 9h1v1h-1zM1 9h1v1h-1zM14 9h1v1h-1zM15 9h1v1h-1zM0 10h1v1h-1zM1 10h1v1h-1zM6 10h1v1h-1zM7 10h1v1h-1zM8 10h1v1h-1zM9 10h1v1h-1zM10 10h1v1h-1zM11 10h1v1h-1zM12 10h1v1h-1zM13 10h1v1h-1zM14 10h1v1h-1zM15 10h1v1h-1zM0 11h1v1h-1zM1 11h1v1h-1zM6 11h1v1h-1zM7 11h1v1h-1zM8 11h1v1h-1zM9 11h1v1h-1zM10 11h1v1h-1zM11 11h1v1h-1zM12 11h1v1h-1zM13 11h1v1h-1zM14 11h1v1h-1zM15 11h1v1h-1zM0 12h1v1h-1zM1 12h1v1h-1zM4 12h1v1h-1zM5 12h1v1h-1zM0 13h1v1h-1zM1 13h1v1h-1zM4 13h1v1h-1zM5 13h1v1h-1zM0 14h1v1h-1zM1 14h1v1h-1zM2 14h1v1h-1zM3 14h1v1h-1zM0 15h1v1h-1zM1 15h1v1h-1zM2 15h1v1h-1zM3 15h1v1h-1z" fill="#31efb8"/></svg>
`;

const arrowDownIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M7 2h1v1h-1zM8 2h1v1h-1zM7 3h1v1h-1zM8 3h1v1h-1zM7 4h1v1h-1zM8 4h1v1h-1zM7 5h1v1h-1zM8 5h1v1h-1zM7 6h1v1h-1zM8 6h1v1h-1zM7 7h1v1h-1zM8 7h1v1h-1zM3 8h1v1h-1zM4 8h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM11 8h1v1h-1zM12 8h1v1h-1zM3 9h1v1h-1zM4 9h1v1h-1zM7 9h1v1h-1zM8 9h1v1h-1zM11 9h1v1h-1zM12 9h1v1h-1zM5 10h1v1h-1zM6 10h1v1h-1zM7 10h1v1h-1zM8 10h1v1h-1zM9 10h1v1h-1zM10 10h1v1h-1zM5 11h1v1h-1zM6 11h1v1h-1zM7 11h1v1h-1zM8 11h1v1h-1zM9 11h1v1h-1zM10 11h1v1h-1zM7 12h1v1h-1zM8 12h1v1h-1zM7 13h1v1h-1zM8 13h1v1h-1z" fill="#5865f2"/></svg>
`;

const arrowUpIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M7 2h1v1h-1zM8 2h1v1h-1zM7 3h1v1h-1zM8 3h1v1h-1zM5 4h1v1h-1zM6 4h1v1h-1zM7 4h1v1h-1zM8 4h1v1h-1zM9 4h1v1h-1zM10 4h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM7 5h1v1h-1zM8 5h1v1h-1zM9 5h1v1h-1zM10 5h1v1h-1zM3 6h1v1h-1zM4 6h1v1h-1zM7 6h1v1h-1zM8 6h1v1h-1zM11 6h1v1h-1zM12 6h1v1h-1zM3 7h1v1h-1zM4 7h1v1h-1zM7 7h1v1h-1zM8 7h1v1h-1zM11 7h1v1h-1zM12 7h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM7 9h1v1h-1zM8 9h1v1h-1zM7 10h1v1h-1zM8 10h1v1h-1zM7 11h1v1h-1zM8 11h1v1h-1zM7 12h1v1h-1zM8 12h1v1h-1zM7 13h1v1h-1zM8 13h1v1h-1z" fill="#5865f2"/></svg>
`;

const crossedEyeIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M13 1h1v1h-1zM14 1h1v1h-1zM13 2h1v1h-1zM14 2h1v1h-1zM4 3h1v1h-1zM5 3h1v1h-1zM6 3h1v1h-1zM7 3h1v1h-1zM8 3h1v1h-1zM9 3h1v1h-1zM10 3h1v1h-1zM11 3h1v1h-1zM12 3h1v1h-1zM4 4h1v1h-1zM5 4h1v1h-1zM6 4h1v1h-1zM7 4h1v1h-1zM8 4h1v1h-1zM9 4h1v1h-1zM10 4h1v1h-1zM11 4h1v1h-1zM12 4h1v1h-1zM2 5h1v1h-1zM3 5h1v1h-1zM9 5h1v1h-1zM10 5h1v1h-1zM12 5h1v1h-1zM13 5h1v1h-1zM2 6h1v1h-1zM3 6h1v1h-1zM9 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM13 6h1v1h-1zM0 7h1v1h-1zM1 7h1v1h-1zM7 7h1v1h-1zM8 7h1v1h-1zM14 7h1v1h-1zM15 7h1v1h-1zM0 8h1v1h-1zM1 8h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM14 8h1v1h-1zM15 8h1v1h-1zM2 9h1v1h-1zM3 9h1v1h-1zM5 9h1v1h-1zM6 9h1v1h-1zM12 9h1v1h-1zM13 9h1v1h-1zM2 10h1v1h-1zM3 10h1v1h-1zM5 10h1v1h-1zM6 10h1v1h-1zM12 10h1v1h-1zM13 10h1v1h-1zM3 11h1v1h-1zM4 11h1v1h-1zM5 11h1v1h-1zM6 11h1v1h-1zM7 11h1v1h-1zM8 11h1v1h-1zM9 11h1v1h-1zM10 11h1v1h-1zM11 11h1v1h-1zM3 12h1v1h-1zM4 12h1v1h-1zM5 12h1v1h-1zM6 12h1v1h-1zM7 12h1v1h-1zM8 12h1v1h-1zM9 12h1v1h-1zM10 12h1v1h-1zM11 12h1v1h-1zM1 13h1v1h-1zM2 13h1v1h-1zM1 14h1v1h-1zM2 14h1v1h-1z" fill="#5865f2"/></svg>
`;

const editorTrashIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M2 0h1v1h-1zM3 0h1v1h-1zM4 0h1v1h-1zM5 0h1v1h-1zM6 0h1v1h-1zM7 0h1v1h-1zM8 0h1v1h-1zM9 0h1v1h-1zM10 0h1v1h-1zM11 0h1v1h-1zM12 0h1v1h-1zM13 0h1v1h-1zM2 1h1v1h-1zM3 1h1v1h-1zM4 1h1v1h-1zM5 1h1v1h-1zM6 1h1v1h-1zM7 1h1v1h-1zM8 1h1v1h-1zM9 1h1v1h-1zM10 1h1v1h-1zM11 1h1v1h-1zM12 1h1v1h-1zM13 1h1v1h-1zM2 4h1v1h-1zM3 4h1v1h-1zM4 4h1v1h-1zM5 4h1v1h-1zM6 4h1v1h-1zM7 4h1v1h-1zM8 4h1v1h-1zM9 4h1v1h-1zM10 4h1v1h-1zM11 4h1v1h-1zM12 4h1v1h-1zM13 4h1v1h-1zM2 5h1v1h-1zM3 5h1v1h-1zM4 5h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM7 5h1v1h-1zM8 5h1v1h-1zM9 5h1v1h-1zM10 5h1v1h-1zM11 5h1v1h-1zM12 5h1v1h-1zM13 5h1v1h-1zM2 6h1v1h-1zM3 6h1v1h-1zM12 6h1v1h-1zM13 6h1v1h-1zM2 7h1v1h-1zM3 7h1v1h-1zM12 7h1v1h-1zM13 7h1v1h-1zM2 8h1v1h-1zM3 8h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM12 8h1v1h-1zM13 8h1v1h-1zM2 9h1v1h-1zM3 9h1v1h-1zM7 9h1v1h-1zM8 9h1v1h-1zM12 9h1v1h-1zM13 9h1v1h-1zM2 10h1v1h-1zM3 10h1v1h-1zM7 10h1v1h-1zM8 10h1v1h-1zM12 10h1v1h-1zM13 10h1v1h-1zM2 11h1v1h-1zM3 11h1v1h-1zM7 11h1v1h-1zM8 11h1v1h-1zM12 11h1v1h-1zM13 11h1v1h-1zM2 12h1v1h-1zM3 12h1v1h-1zM12 12h1v1h-1zM13 12h1v1h-1zM2 13h1v1h-1zM3 13h1v1h-1zM12 13h1v1h-1zM13 13h1v1h-1zM2 14h1v1h-1zM3 14h1v1h-1zM4 14h1v1h-1zM5 14h1v1h-1zM6 14h1v1h-1zM7 14h1v1h-1zM8 14h1v1h-1zM9 14h1v1h-1zM10 14h1v1h-1zM11 14h1v1h-1zM12 14h1v1h-1zM13 14h1v1h-1zM2 15h1v1h-1zM3 15h1v1h-1zM4 15h1v1h-1zM5 15h1v1h-1zM6 15h1v1h-1zM7 15h1v1h-1zM8 15h1v1h-1zM9 15h1v1h-1zM10 15h1v1h-1zM11 15h1v1h-1zM12 15h1v1h-1zM13 15h1v1h-1z" fill="#5865f2"/></svg>
`;

const fullscreenIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M5 0h1v1h-1zM6 0h1v1h-1zM9 0h1v1h-1zM10 0h1v1h-1zM5 1h1v1h-1zM6 1h1v1h-1zM9 1h1v1h-1zM10 1h1v1h-1zM7 2h1v1h-1zM8 2h1v1h-1zM7 3h1v1h-1zM8 3h1v1h-1zM2 4h1v1h-1zM3 4h1v1h-1zM4 4h1v1h-1zM5 4h1v1h-1zM6 4h1v1h-1zM7 4h1v1h-1zM8 4h1v1h-1zM9 4h1v1h-1zM10 4h1v1h-1zM11 4h1v1h-1zM12 4h1v1h-1zM13 4h1v1h-1zM2 5h1v1h-1zM3 5h1v1h-1zM4 5h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM7 5h1v1h-1zM8 5h1v1h-1zM9 5h1v1h-1zM10 5h1v1h-1zM11 5h1v1h-1zM12 5h1v1h-1zM13 5h1v1h-1zM2 6h1v1h-1zM3 6h1v1h-1zM12 6h1v1h-1zM13 6h1v1h-1zM2 7h1v1h-1zM3 7h1v1h-1zM12 7h1v1h-1zM13 7h1v1h-1zM2 8h1v1h-1zM3 8h1v1h-1zM12 8h1v1h-1zM13 8h1v1h-1zM2 9h1v1h-1zM3 9h1v1h-1zM12 9h1v1h-1zM13 9h1v1h-1zM2 10h1v1h-1zM3 10h1v1h-1zM12 10h1v1h-1zM13 10h1v1h-1zM2 11h1v1h-1zM3 11h1v1h-1zM12 11h1v1h-1zM13 11h1v1h-1zM2 12h1v1h-1zM3 12h1v1h-1zM4 12h1v1h-1zM5 12h1v1h-1zM6 12h1v1h-1zM7 12h1v1h-1zM8 12h1v1h-1zM9 12h1v1h-1zM10 12h1v1h-1zM11 12h1v1h-1zM12 12h1v1h-1zM13 12h1v1h-1zM2 13h1v1h-1zM3 13h1v1h-1zM4 13h1v1h-1zM5 13h1v1h-1zM6 13h1v1h-1zM7 13h1v1h-1zM8 13h1v1h-1zM9 13h1v1h-1zM10 13h1v1h-1zM11 13h1v1h-1zM12 13h1v1h-1zM13 13h1v1h-1z" fill="#ffffff"/></svg>
`;

const hooksTrashIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M2 0h1v1h-1zM3 0h1v1h-1zM4 0h1v1h-1zM5 0h1v1h-1zM6 0h1v1h-1zM7 0h1v1h-1zM8 0h1v1h-1zM9 0h1v1h-1zM10 0h1v1h-1zM11 0h1v1h-1zM12 0h1v1h-1zM13 0h1v1h-1zM2 1h1v1h-1zM3 1h1v1h-1zM4 1h1v1h-1zM5 1h1v1h-1zM6 1h1v1h-1zM7 1h1v1h-1zM8 1h1v1h-1zM9 1h1v1h-1zM10 1h1v1h-1zM11 1h1v1h-1zM12 1h1v1h-1zM13 1h1v1h-1zM2 4h1v1h-1zM3 4h1v1h-1zM4 4h1v1h-1zM5 4h1v1h-1zM6 4h1v1h-1zM7 4h1v1h-1zM8 4h1v1h-1zM9 4h1v1h-1zM10 4h1v1h-1zM11 4h1v1h-1zM12 4h1v1h-1zM13 4h1v1h-1zM2 5h1v1h-1zM3 5h1v1h-1zM4 5h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM7 5h1v1h-1zM8 5h1v1h-1zM9 5h1v1h-1zM10 5h1v1h-1zM11 5h1v1h-1zM12 5h1v1h-1zM13 5h1v1h-1zM2 6h1v1h-1zM3 6h1v1h-1zM12 6h1v1h-1zM13 6h1v1h-1zM2 7h1v1h-1zM3 7h1v1h-1zM12 7h1v1h-1zM13 7h1v1h-1zM2 8h1v1h-1zM3 8h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM12 8h1v1h-1zM13 8h1v1h-1zM2 9h1v1h-1zM3 9h1v1h-1zM7 9h1v1h-1zM8 9h1v1h-1zM12 9h1v1h-1zM13 9h1v1h-1zM2 10h1v1h-1zM3 10h1v1h-1zM7 10h1v1h-1zM8 10h1v1h-1zM12 10h1v1h-1zM13 10h1v1h-1zM2 11h1v1h-1zM3 11h1v1h-1zM7 11h1v1h-1zM8 11h1v1h-1zM12 11h1v1h-1zM13 11h1v1h-1zM2 12h1v1h-1zM3 12h1v1h-1zM12 12h1v1h-1zM13 12h1v1h-1zM2 13h1v1h-1zM3 13h1v1h-1zM12 13h1v1h-1zM13 13h1v1h-1zM2 14h1v1h-1zM3 14h1v1h-1zM4 14h1v1h-1zM5 14h1v1h-1zM6 14h1v1h-1zM7 14h1v1h-1zM8 14h1v1h-1zM9 14h1v1h-1zM10 14h1v1h-1zM11 14h1v1h-1zM12 14h1v1h-1zM13 14h1v1h-1zM2 15h1v1h-1zM3 15h1v1h-1zM4 15h1v1h-1zM5 15h1v1h-1zM6 15h1v1h-1zM7 15h1v1h-1zM8 15h1v1h-1zM9 15h1v1h-1zM10 15h1v1h-1zM11 15h1v1h-1zM12 15h1v1h-1zM13 15h1v1h-1z" fill="#060c4d"/></svg>
`;

const minusIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M2 7h1v1h-1zM3 7h1v1h-1zM4 7h1v1h-1zM5 7h1v1h-1zM6 7h1v1h-1zM7 7h1v1h-1zM8 7h1v1h-1zM9 7h1v1h-1zM10 7h1v1h-1zM11 7h1v1h-1zM12 7h1v1h-1zM13 7h1v1h-1zM2 8h1v1h-1zM3 8h1v1h-1zM4 8h1v1h-1zM5 8h1v1h-1zM6 8h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM9 8h1v1h-1zM10 8h1v1h-1zM11 8h1v1h-1zM12 8h1v1h-1zM13 8h1v1h-1z" fill="#000000"/></svg>
`;

const regularEyeIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M4 3h1v1h-1zM5 3h1v1h-1zM6 3h1v1h-1zM7 3h1v1h-1zM8 3h1v1h-1zM9 3h1v1h-1zM10 3h1v1h-1zM11 3h1v1h-1zM4 4h1v1h-1zM5 4h1v1h-1zM6 4h1v1h-1zM7 4h1v1h-1zM8 4h1v1h-1zM9 4h1v1h-1zM10 4h1v1h-1zM11 4h1v1h-1zM2 5h1v1h-1zM3 5h1v1h-1zM12 5h1v1h-1zM13 5h1v1h-1zM2 6h1v1h-1zM3 6h1v1h-1zM12 6h1v1h-1zM13 6h1v1h-1zM0 7h1v1h-1zM1 7h1v1h-1zM7 7h1v1h-1zM8 7h1v1h-1zM14 7h1v1h-1zM15 7h1v1h-1zM0 8h1v1h-1zM1 8h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM14 8h1v1h-1zM15 8h1v1h-1zM2 9h1v1h-1zM3 9h1v1h-1zM12 9h1v1h-1zM13 9h1v1h-1zM2 10h1v1h-1zM3 10h1v1h-1zM12 10h1v1h-1zM13 10h1v1h-1zM4 11h1v1h-1zM5 11h1v1h-1zM6 11h1v1h-1zM7 11h1v1h-1zM8 11h1v1h-1zM9 11h1v1h-1zM10 11h1v1h-1zM11 11h1v1h-1zM4 12h1v1h-1zM5 12h1v1h-1zM6 12h1v1h-1zM7 12h1v1h-1zM8 12h1v1h-1zM9 12h1v1h-1zM10 12h1v1h-1zM11 12h1v1h-1z" fill="#5865f2"/></svg>
`;

let buildStatusCleared = false;
let buildStatusInterval;
let consecutiveErrors = 0;
let currentStepIndex = -1;
let disconnectedCount = 0;
let highlightTimeout;
let initializationTimeout;
let isBuilding = false;
let isFetchingEvalData = false;
let lastStatus = '';
let lastStep = '';
let manualDatetimes = [];

async function abortBuild(apiToken) {
    try {
        if (!apiToken) {
            apiToken = localStorage.getItem('apiToken');
        }

        const response = await callAPI('abort-build', apiToken, 'POST');
        if (response.message === "Build process aborted successfully.") {
            showStatus('Build process aborted.', false);
            stopBuildStatusCheck();
            hideLoadingOverlay();
            enableInteractions();
            exitFullscreen();
        } else {
            showStatus('Failed to abort build process.', false);
        }
    } catch (error) {
        console.error('Error aborting build:', error);
        showStatus('Error aborting build process.', false);
    }
}

function addBashBlock() {
    addBlock('bash');
}

function addBlock(type) {
    const uniqueId = `part-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const block = document.createElement('div');
    block.className = `part-${type}`;
    block.id = uniqueId;

    const colorLabel = document.createElement('div');
    colorLabel.className = 'color-label';
    block.appendChild(colorLabel);

    const editorWrapper = document.createElement('div');
    editorWrapper.className = 'editor-wrapper';
    editorWrapper.style.position = 'relative';

    const editorContainer = document.createElement('div');
    editorContainer.id = `editor-${uniqueId}`;
    editorContainer.style.width = '100%';
    editorContainer.classList.add('editor');
    editorWrapper.appendChild(editorContainer);

    const commentButton = document.createElement('button');
    commentButton.className = 'comment-button';
    commentButton.innerHTML = addCommentIcon;
    commentButton.onclick = () => addCommentToBlock(block);
    editorWrapper.appendChild(commentButton);

    block.appendChild(editorWrapper);

    const controls = document.createElement('div');
    controls.className = 'controls';

    controls.appendChild(createControlElement('handle', type.replace('part_', '')));
    controls.appendChild(createControlElement('move-up', arrowUpIcon, () => moveBlockUp(block)));
    controls.appendChild(createControlElement('move-down', arrowDownIcon, () => moveBlockDown(block)));
    controls.appendChild(createControlElement('delete-button', editorTrashIcon, () => deleteBlock(block)));
    controls.appendChild(createToggleButton(block));

    block.appendChild(controls);

    document.getElementById('file-content').appendChild(block);

    require.config({paths: {'vs': 'node_modules/monaco-editor/min/vs'}});

    require(['vs/editor/editor.main'], function () {
        monaco.editor.defineTheme('flatpack', {
            base: 'vs-dark',
            colors: {
                'editor.background': '#060c4d',
                'editor.lineHighlightBackground': '#080f61'
            },
            inherit: true,
            rules: [
                {token: '', background: '060c4d', foreground: 'ffffff'},
                {token: 'comment', foreground: 'cccccc', fontStyle: 'italic'},
                {token: 'keyword', foreground: '31efb8'}
            ]
        });

        let initialValue;
        let language;

        if (type === 'python') {
            initialValue = "# This is a Python block. Start coding here...";
            language = 'python';
        } else if (type === 'bash') {
            initialValue = "# This is a Bash block. Start coding here...";
            language = 'shell';
        } else {
            initialValue = `// This is a ${type} block. Start coding here...`;
            language = 'plaintext';
        }

        const editor = monaco.editor.create(document.getElementById(`editor-${uniqueId}`), {
            accessibilitySupport: 'off',
            autoIndent: 'advanced',
            automaticLayout: true,
            bracketPairColorization: {
                enabled: true
            },
            hideCursorInOverviewRuler: true,
            language: language,
            minimap: {
                enabled: false
            },
            overviewRulerBorder: false,
            overviewRulerLanes: 0,
            padding: {
                top: 25,
                bottom: 20
            },
            scrollBeyondLastColumn: 0,
            scrollBeyondLastLine: false,
            scrollbar: {
                horizontal: 'hidden',
                vertical: 'hidden'
            },
            showUnused: true,
            smoothScrolling: true,
            stickyScroll: {
                enabled: false
            },
            theme: 'flatpack',
            unusualLineTerminators: 'auto',
            value: initialValue,
            wordWrap: 'on',
            wrappingIndent: 'same',
            wrappingStrategy: 'advanced'
        });

        const updateHeight = () => {
            const contentHeight = Math.max(100, Math.min(1000, editor.getContentHeight()));
            editorContainer.style.height = `${contentHeight}px`;
            editor.layout();
        };

        editor.onDidContentSizeChange(updateHeight);
        updateHeight();
    });
}

async function addCommentToBlock(block) {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
        const comment = prompt('Enter your comment:');
        if (comment) {
            const blockId = block.id;
            try {
                await postComment(blockId, selectedText, comment);
                await refreshCommentsFromBackend();
                document.getElementById('comment-sidebar').style.display = 'block';
                localStorage.setItem('commentSidebarState', 'shown');
                showStatus('Comment added successfully.', true);
            } catch (error) {
                console.error('Failed to add comment:', error);
                showStatus('Failed to add comment. Please try again.', false);
            }
        }
    } else {
        showStatus('Please select text to comment on.', false);
    }
}

function addComment(text, comment, blockId, createdAt, commentId) {
    comments.push({
        text,
        comment,
        blockId,
        created_at: createdAt || new Date().toISOString(),
        id: commentId
    });
    renderComments();
}

function addDatetimeToList(datetime) {
    const li = document.createElement('li');
    li.textContent = new Date(datetime).toLocaleString();
    li.dataset.datetime = datetime;

    const removeLink = document.createElement('a');
    removeLink.textContent = 'Remove';
    removeLink.href = '#';
    removeLink.className = 'remove-link';
    removeLink.style.marginLeft = '10px';
    removeLink.onclick = (event) => {
        event.preventDefault();
        datetimeList.removeChild(li);
        checkDatetimeListEmpty();
    };

    li.appendChild(removeLink);
    datetimeList.appendChild(li);
    checkDatetimeListEmpty();
}

function addEventListenersToEditor(editor) {
    editor.addEventListener('input', (event) => {
        if (event.target.contentEditable !== 'false') {
            logCharacter(event);
            resizeEditor(event.target);
        }
    });
    editor.addEventListener('paste', stripFormatting);
}

function addPythonBlock() {
    addBlock('python');
}

function showAbortButton() {
    const loadingOverlay = document.getElementById('loading-overlay');
    let abortButton = document.getElementById('abort-build-button');

    if (!abortButton) {
        abortButton = document.createElement('button');
        abortButton.id = 'abort-build-button';
        abortButton.textContent = 'Abort build';
        abortButton.onclick = () => abortBuild(localStorage.getItem('apiToken'));
        loadingOverlay.appendChild(abortButton);
    }

    abortButton.style.display = 'block';
    abortButton.disabled = false;
    abortButton.style.pointerEvents = 'auto';
}

async function buildProject(apiToken) {
    disableInteractions();

    try {
        await saveFile(false, apiToken);
        const buildResponse = await callAPI('build', apiToken);

        if (buildResponse && (buildResponse.status === 'started' || buildResponse.message === 'Build process started in background.')) {
            saveBuildStatus('in_progress: Preparing build environment');
            startBuildStatusCheck();
            showAbortButton();
        } else if (buildResponse && buildResponse.message === "A build is already in progress.") {
            showStatus('A build is already in progress.', false);
            enableInteractions();
        } else if (buildResponse && buildResponse.message) {
            showStatus(buildResponse.message, false);
            enableInteractions();
        } else {
            throw new Error('Unexpected response from build API');
        }

        reattachToggleListeners();
    } catch (error) {
        console.error('Failed to build project:', error);
        showStatus(`Error: ${error.message}`, false);
        hideLoadingOverlay();
        enableInteractions();
    }
}

async function callAPI(endpoint, apiToken, method = "POST", data = null) {
    try {
        let url = `${getBaseUrl()}/api/${endpoint}`;

        const headers = {
            "Authorization": `Bearer ${apiToken}`
        };

        setCSRFHeader(headers);

        const options = {
            method: method,
            headers: headers
        };

        if (method === "POST" && data) {
            if (data instanceof FormData) {
                options.body = data;
            } else {
                headers["Content-Type"] = "application/x-www-form-urlencoded";
                const params = new URLSearchParams();
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        params.append(key, data[key]);
                    }
                }
                options.body = params.toString();
            }
        } else if (method === "GET" && data) {
            const params = new URLSearchParams(data);
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        if (error.message.includes('403')) {
            if (await handleCSRFError()) {
                return callAPI(endpoint, apiToken, method, data);
            }
        }
        throw error;
    }
}

function checkAndRestoreBuildStatus() {
    const savedStatus = localStorage.getItem('buildStatus');
    if (savedStatus) {
        handleBuildStatus(savedStatus);
        startBuildStatusCheck();
    }
}

async function checkApiTokenValidity(apiToken) {
    try {
        const response = await callAPI('validate_token', apiToken, 'GET');
        return response.valid;
    } catch (error) {
        console.error('Error checking API token:', error);
        return false;
    }
}

async function checkBuildStatus() {
    let apiToken;
    try {
        apiToken = localStorage.getItem('apiToken');
    } catch (e) {
        if (typeof stopBuildStatusCheck === 'function') {
            stopBuildStatusCheck();
        }
        return;
    }

    if (!apiToken) {
        if (typeof stopBuildStatusCheck === 'function') {
            stopBuildStatusCheck();
        }
        return;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            try {
                controller.abort();
            } catch (e) {
            }
        }, 10000);

        let data;
        try {
            data = await callAPI('build-status', apiToken, 'GET', null, controller.signal);
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }

        clearTimeout(timeoutId);

        if (data && data.status) {
            if (typeof handleBuildStatus === 'function') {
                handleBuildStatus(data.status);
            }
        } else {
            if (typeof handleBuildStatus === 'function') {
                handleBuildStatus('unknown');
            }
        }

        window.consecutiveErrors = 0;

        if (data && (data.status === 'completed' || data.status === 'failed') && !buildStatusCleared) {
            try {
                await callAPI('clear-build-status', apiToken, 'POST');
                buildStatusCleared = true;
            } catch (e) {
                console.error('Failed to clear build status:', e);
            }
        }
    } catch (error) {
        window.consecutiveErrors = (window.consecutiveErrors || 0) + 1;
        const MAX_CONSECUTIVE_ERRORS = window.MAX_CONSECUTIVE_ERRORS || 3;

        if (window.consecutiveErrors >= MAX_CONSECUTIVE_ERRORS || error.name === 'TypeError') {
            if (typeof handleBuildStatusError === 'function') {
                handleBuildStatusError();
            }
            if (typeof stopBuildStatusCheck === 'function') {
                stopBuildStatusCheck();
            }
        } else {
            if (typeof handleBuildStatus === 'function') {
                handleBuildStatus('unknown');
            }
        }
    }
}

function checkDatetimeListEmpty() {
    if (datetimeList.children.length === 0) {
        datetimeList.style.display = 'none';
    } else {
        datetimeList.style.display = 'block';
    }
}

function checkEvalDataForFile(data, filename, mimetype) {
    if (data && Array.isArray(data)) {
        for (const file of data) {
            if (file.public === `/${filename}` && file.type === mimetype) {
                return file.public;
            }
        }
    }
    return null;
}

async function checkHeartbeat(apiToken) {
    const heartbeatDot = document.getElementById('heartbeat-dot');
    const heartbeatTime = document.getElementById('heartbeat-time');

    if (!heartbeatDot || !heartbeatTime) {
        console.error('Heartbeat elements are missing.');
        return;
    }

    try {
        const data = await callAPI('heartbeat', apiToken, 'GET');
        const date = new Date(data.server_time);
        const formattedDate = date.toLocaleString('sv-SE', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        });
        heartbeatTime.textContent = formattedDate;
        heartbeatDot.classList.remove('disconnected');
        heartbeatDot.classList.add('connected');
        disconnectedCount = 0;

        if (isBuilding) {
            isBuilding = false;
            hideLoadingOverlay();
            enableInteractions();
        }
    } catch (error) {
        console.error('Heartbeat error:', error);
        handleDisconnection(error);
    }

    function handleDisconnection(error) {
        disconnectedCount++;

        if (error.status === 403) {
            handleForbiddenError();
        } else if (disconnectedCount >= MAX_DISCONNECTED_COUNT) {
            setDisconnectedState();
        } else {
            setReconnectingState();
        }
    }

    function handleForbiddenError() {
        console.error('403 Forbidden error. Refreshing CSRF token...');
        refreshCSRFToken()
            .then(() => {
                console.log('CSRF token refreshed. Retrying heartbeat...');
                disconnectedCount = 0;
            })
            .catch(refreshError => {
                console.error('Failed to refresh CSRF token:', refreshError);
                setDisconnectedState();
            });
    }

    function setReconnectingState() {
        heartbeatTime.textContent = 'Reconnecting';
        heartbeatDot.classList.remove('connected');
        heartbeatDot.classList.add('disconnected');
    }

    function setDisconnectedState() {
        heartbeatTime.textContent = 'Disconnected';
        heartbeatDot.classList.remove('connected');
        heartbeatDot.classList.add('disconnected');
        hideLoadingOverlay();
        resetAppState();
    }
}

function createControlElement(className, innerHTML, onClick) {
    const element = document.createElement('div');
    element.className = className;
    element.innerHTML = innerHTML;
    if (onClick) {
        element.onclick = onClick;
    }
    return element;
}

function updateToggleButtonIcon(button, block) {
    button.innerHTML = block.classList.contains('disabled') ? crossedEyeIcon : regularEyeIcon;
}

function createToggleButton(block) {
    const button = createControlElement('toggle-button', regularEyeIcon, () => {
        toggleBlock(block);
        updateToggleButtonIcon(button, block);
    });
    return button;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function deleteBlock(block) {
    const blockId = block.id;
    block.remove();
}

async function deleteComment(commentId) {
    const apiToken = localStorage.getItem('apiToken');
    const csrfToken = localStorage.getItem('csrfToken');

    const numericCommentId = parseInt(commentId, 10);
    if (isNaN(numericCommentId)) {
        console.error('Invalid comment ID:', commentId);
        showStatus('Error: Invalid comment ID', false);
        return;
    }

    const headers = {
        'Authorization': `Bearer ${apiToken}`,
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(`${getBaseUrl()}/api/comments/${numericCommentId}`, {
            method: 'DELETE',
            headers: headers
        });

        const responseText = await response.text();

        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Error parsing response JSON:', parseError);
            responseData = {detail: 'Unable to parse server response'};
        }

        if (!response.ok) {
            throw new Error(`Server error: ${responseData.detail || response.statusText}`);
        }

        showStatus(responseData.message || 'Comment deleted successfully.', true);

        await refreshCommentsFromBackend();
    } catch (error) {
        console.error('Error deleting comment:', error);
        console.error('Error details:', {
            commentId: numericCommentId,
            endpoint: `${getBaseUrl()}/api/comments/${numericCommentId}`,
            headers: headers
        });
        showStatus(`Failed to delete comment: ${error.message}`, false);
    }
}

async function deleteHook(hookId) {
    const apiToken = localStorage.getItem('apiToken');
    try {
        await callAPI(`hooks/${hookId}`, apiToken, 'DELETE');
        showStatus('Hook deleted successfully!', true);
        document.querySelector(`[data-hook-id="${hookId}"]`).remove();
    } catch (error) {
        console.error('Error deleting hook:', error);
        showStatus('Error deleting hook!', false);
    }
}

async function deleteScheduleEntry(scheduleId, datetimeIndex = null) {
    const apiToken = localStorage.getItem('apiToken');
    const csrfToken = localStorage.getItem('csrfToken');

    const endpoint = datetimeIndex !== null
        ? `schedule/${scheduleId}?datetime_index=${datetimeIndex}`
        : `schedule/${scheduleId}`;

    const headers = {
        'Authorization': `Bearer ${apiToken}`,
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(`${getBaseUrl()}/api/${endpoint}`, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Server error: ${errorData.detail || response.statusText}`);
        }

        const data = await response.json();
        showStatus(data.message || 'Schedule entry deleted successfully.', true);

        if (datetimeIndex !== null) {
            const scheduleContainer = document.querySelector(`[data-schedule-id="${scheduleId}"]`);
            const datetimesContainer = scheduleContainer.querySelector('.datetimes-container');

            if (datetimesContainer.children.length === 1) {
                await deleteScheduleEntry(scheduleId);
            } else {
                await fetchSchedule();
            }
        } else {
            await fetchSchedule();
        }
    } catch (error) {
        console.error('Error deleting schedule entry:', error);
        showStatus(`Error during deletion: ${error.message}`, false);
    }
}

function disableInteractions() {
    document.querySelectorAll('button:not(#abort-build-button), .action, .editor').forEach(el => {
        el.setAttribute('disabled', 'true');
        el.style.pointerEvents = 'none';
    });
}

function displayAudioFile(file, container) {
    const timestamp = new Date().getTime();
    const audioElement = document.createElement('audio');

    audioElement.controls = true;
    audioElement.autoplay = false;
    audioElement.src = `${file.public}?cb=${timestamp}`;
}

function displayLightbox(imageSrc) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';

    const filename = imageSrc.split('/').pop().split('?')[0];

    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${imageSrc}" alt="Enlarged image">
            <p class="lightbox-filename">${filename}</p>
            <button class="close-lightbox">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M1 1h1v1h-1zM2 1h1v1h-1zM13 1h1v1h-1zM14 1h1v1h-1zM1 2h1v1h-1zM2 2h1v1h-1zM13 2h1v1h-1zM14 2h1v1h-1zM3 3h1v1h-1zM4 3h1v1h-1zM11 3h1v1h-1zM12 3h1v1h-1zM3 4h1v1h-1zM4 4h1v1h-1zM11 4h1v1h-1zM12 4h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM9 5h1v1h-1zM10 5h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM9 6h1v1h-1zM10 6h1v1h-1zM7 7h1v1h-1zM8 7h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM5 9h1v1h-1zM6 9h1v1h-1zM9 9h1v1h-1zM10 9h1v1h-1zM5 10h1v1h-1zM6 10h1v1h-1zM9 10h1v1h-1zM10 10h1v1h-1zM3 11h1v1h-1zM4 11h1v1h-1zM11 11h1v1h-1zM12 11h1v1h-1zM3 12h1v1h-1zM4 12h1v1h-1zM11 12h1v1h-1zM12 12h1v1h-1zM1 13h1v1h-1zM2 13h1v1h-1zM13 13h1v1h-1zM14 13h1v1h-1zM1 14h1v1h-1zM2 14h1v1h-1zM13 14h1v1h-1zM14 14h1v1h-1z" fill="#060c4d"/>
                </svg>
            </button>
        </div>
    `;

    document.body.appendChild(lightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.closest('.close-lightbox')) {
            document.body.removeChild(lightbox);
        }
    });
}

function enableInteractions() {
    document.querySelectorAll('button:not(#abort-build-button), .action, .editor').forEach(el => {
        el.removeAttribute('disabled');
        el.style.pointerEvents = 'auto';
    });
}

function exitFullscreen() {
    const outputWidget = document.getElementById('output-widget');
    if (outputWidget && outputWidget.classList.contains('fullscreen')) {
        outputWidget.classList.remove('fullscreen');
    }
}

async function fetchAndDisplayTextFile(file, container) {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`${file.public}?cb=${timestamp}`, {
            method: 'GET',
            credentials: 'same-origin',
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Error fetching ${file.public}: ${response.status} ${response.statusText}`);
        }

        const lastModified = response.headers.get('Last-Modified');
        let formattedTimestamp = "Unknown";

        if (lastModified) {
            const modifiedDate = new Date(lastModified);
        }

        const content = await response.text();
        const trimmedContent = content.trim();

        const preElement = document.createElement('pre');
        preElement.textContent = trimmedContent;
        preElement.classList.add('teletext-style');

        const existingContent = Array.from(container.getElementsByClassName('text-file-output'));
        let contentAlreadyExists = false;

        existingContent.forEach((element) => {
            if (element.querySelector('pre').textContent === trimmedContent) {
                contentAlreadyExists = true;
            }
        });

        if (!contentAlreadyExists) {
            const fileContainer = document.createElement('div');
            fileContainer.classList.add('text-file-output-wrapper');

            fileContainer.appendChild(preElement);
            container.appendChild(fileContainer);
        }
    } catch (error) {
        console.error('Error fetching text file:', error);
        container.innerHTML += `<p>Error reading ${escapeHTML(file.public)}: ${escapeHTML(error.message)}</p>`;
    }
}

async function fetchComments() {
    const apiToken = localStorage.getItem('apiToken');

    try {
        const fetchedComments = await callAPI('comments', apiToken, 'GET');

        comments.length = 0;

        fetchedComments.forEach(comment => {
            if (comment.id) {
                comments.push({
                    id: comment.id,
                    text: comment.selected_text,
                    comment: comment.comment,
                    blockId: comment.block_id,
                    created_at: comment.created_at
                });
            } else {
                console.error('Comment fetched without an ID:', comment);
            }
        });

        renderComments();
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

async function fetchCSRFToken() {
    const response = await fetch('/csrf-token');
    const data = await response.json();
    return data.csrf_token;
}

function escapeHTML(str) {
    if (typeof str !== 'string') {
        return '';
    }
    return str.replace(/[&<>"'`=\/]/g, (s) => {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;',
        }[s];
    });
}

async function fetchEvalData() {
    if (isFetchingEvalData) return;
    isFetchingEvalData = true;

    try {
        const response = await fetch('/output/eval_data.json', {
            method: 'GET',
            credentials: 'same-origin',
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch eval_data.json: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new TypeError('Invalid data format: Expected an array of files');
        }

        const outputWidget = document.getElementById('output-widget');
        const evalWidget = document.getElementById('eval-widget');

        if (!outputWidget || !evalWidget) {
            console.error('Output or eval widget not found in the DOM.');
            return;
        }

        outputWidget.innerHTML = '';
        evalWidget.innerHTML = '';

        let hasOutput = false;

        const sortedFiles = data.sort((a, b) => {
            const typeOrder = {
                'image/png': 1,
                'image/jpeg': 1,
                'image/gif': 1,
                'text/plain': 2,
                'audio/x-wav': 3
            };
            return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
        });

        for (const file of sortedFiles) {
            if (!file.public || !file.type) {
                continue;
            }

            const sanitizedPublicPath = encodeURI(file.public);

            if (file.type === 'text/plain' && file.public.endsWith('output.txt')) {
                await fetchAndDisplayTextFile({...file, public: sanitizedPublicPath}, outputWidget);
                hasOutput = true;
            } else if (file.type === 'audio/x-wav' && file.public.endsWith('output.wav')) {
                displayAudioFile({...file, public: sanitizedPublicPath}, outputWidget);
                hasOutput = true;
            }
        }

        if (!hasOutput) {
            outputWidget.innerHTML = '<p>No output available.</p>';
            evalWidget.innerHTML = '<p>No eval_data.json available</p>';
        } else {
            outputWidget.classList.add('text-file-output');

            const fullscreenButton = document.createElement('button');
            fullscreenButton.classList.add('fullscreen-toggle-btn');
            fullscreenButton.innerHTML = fullscreenIcon;

            fullscreenButton.addEventListener('click', () => {
                outputWidget.classList.toggle('fullscreen');
            });

            outputWidget.appendChild(fullscreenButton);
        }

        evalWidget.innerHTML = `<pre>${escapeHTML(JSON.stringify(data, null, 2))}</pre>`;
    } catch (error) {
        console.error('Error in fetchEvalData:', error);
        const evalWidget = document.getElementById('eval-widget');
        if (evalWidget) {
            evalWidget.innerHTML = `<p>Could not load eval_data.json: ${escapeHTML(error.message)}</p>`;
        }
        showStatus(`Error fetching eval data: ${error.message}`, false);
    } finally {
        isFetchingEvalData = false;
    }
}

async function fetchHooks(apiToken) {
    try {
        const data = await callAPI('hooks', apiToken, 'GET');
        renderHooks(data.hooks);
    } catch (error) {
        console.error('Fetch error:', error);
        showStatus('Error fetching hooks!', false);
    }
}

async function fetchLatestLogs(apiToken) {
    try {
        const data = await callAPI('logs', apiToken, 'GET');
        const logs = data.logs;

        populateLogDropdown(logs);

        if (logs.length > 0) {
            const latestLog = logs[0];
            const logDropdown = document.getElementById('log-dropdown');

            logDropdown.value = latestLog;
            logDropdown.dispatchEvent(new Event('change'));
        } else {
            renderLogContent("No log files found.");
        }
    } catch (error) {
        renderLogContent("Error fetching log files.");
        showStatus('Error fetching log files!', false);
    }
}

async function fetchLogFiles(apiToken) {
    try {
        const response = await fetch(`${getBaseUrl()}/api/logs`, {
            headers: {
                'Authorization': `Bearer ${apiToken}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            populateLogDropdown(data.logs);
        } else {
            showStatus('Error fetching log files!', false);
        }
    } catch (error) {
        console.error('Error fetching log files:', error);
        showStatus('Error fetching log files!', false);
    }
}

async function fetchSchedule() {
    const apiToken = localStorage.getItem('apiToken');

    if (!apiToken) {
        return;
    }

    try {
        const data = await callAPI('schedule', apiToken, 'GET');
        renderExistingSchedule(data);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        showStatus('An error occurred while fetching the schedule. Please try again.', false);
    }
}

async function fetchSelectedLog() {
    const apiToken = localStorage.getItem('apiToken');
    const logDropdown = document.getElementById('log-dropdown');
    const selectedLog = logDropdown.value;

    if (!selectedLog) {
        renderLogContent('No log file selected.');
        return;
    }

    try {
        const data = await callAPI(`logs/${selectedLog}`, apiToken, 'GET');
        renderLogContent(data.log);
    } catch (error) {
        console.error('Error fetching the selected log:', error);
        if (error.message.includes('404')) {
            renderLogContent(`Log file not found: ${selectedLog}`);
        } else {
            renderLogContent("Error fetching the selected log.");
            showStatus('Error fetching the selected log!', false);
        }
    }
}

async function fetchWithRetry(url, options, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) return response;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

async function getEvalJSON(apiToken) {
    try {
        const response = await fetch('/output/eval_data.json', {
            headers: {
                'Authorization': `Bearer ${apiToken}`
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('eval_data.json not found. This may be normal if no build has been run yet.');
                return null;
            }
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching eval_data.json:', error);
        throw error;
    }
}

function getSessionID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function handleBuildStatus(status) {
    saveBuildStatus(status);

    if (status.startsWith('in_progress')) {
        const step = status.split(': ')[1] || 'Unknown step';
        const stepIndex = BUILD_STEPS.indexOf(step);

        if (stepIndex > currentStepIndex) {
            showLoadingOverlay(`${step}`);
            disableInteractions();
            showAbortButton();
            currentStepIndex = stepIndex;
            lastStatus = status;
            lastStep = step;
        }
    } else if (status !== lastStatus) {
        switch (status) {
            case 'completed':
            case 'failed':
            case 'aborted':
                hideLoadingOverlay();
                enableInteractions();
                fetchEvalData();
                fetchLatestLogs(localStorage.getItem('apiToken'));
                fetchSchedule();
                listImageFiles();
                localStorage.removeItem('buildStatus');
                exitFullscreen();
                break;
            case 'no_builds':
                hideLoadingOverlay();
                enableInteractions();
                break;
            case 'unknown':
                break;
            default:
                showLoadingOverlay(status);
        }

        currentStepIndex = -1;
        lastStatus = status;
        lastStep = '';
    }
}

function handleBuildStatusError() {
    hideLoadingOverlay();
    enableInteractions();
    showStatus('Unable to check build status. The server may be unavailable.', false);
}

async function handleCSRFError() {
    try {
        const newToken = await fetchCSRFToken();
        localStorage.setItem('csrfToken', newToken);
        return true;
    } catch (error) {
        console.error('Failed to refresh CSRF token:', error);
        return false;
    }
}

function handleHookConflict(existingHook, newHook) {
    const confirmUpdate = confirm(`A hook with the name "${newHook.hook_name}" already exists. Do you want to update it?`);
    if (confirmUpdate) {
        updateExistingHook(existingHook.id, newHook);
    } else {
        showStatus('Hook not added. Please choose a different name.', false);
    }
}

function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'none';

    const abortButton = document.getElementById('abort-build-button');
    if (abortButton) {
        abortButton.style.display = 'none';
        abortButton.disabled = true;
    }

    exitFullscreen();
}

function highlightBlock(blockId) {
    clearTimeout(highlightTimeout);

    document.querySelectorAll('.part-python .color-label, .part-bash .color-label').forEach(label => {
        label.style.backgroundColor = '';
    });

    const block = document.getElementById(blockId);

    if (block) {
        const colorLabel = block.querySelector('.color-label');

        if (colorLabel) {
            colorLabel.style.backgroundColor = '#31efb8';
        }

        block.scrollIntoView({behavior: 'smooth', block: 'center'});

        highlightTimeout = setTimeout(() => {
            if (colorLabel) {
                colorLabel.style.backgroundColor = '';
            }
        }, 3000);
    }
}

function initializeMonacoEditorForExistingBlocks() {
    const blocks = document.querySelectorAll('.part-python, .part-bash');

    blocks.forEach(block => {
        const editorContainer = block.querySelector('.editor-wrapper > div');

        if (editorContainer) {
            const uniqueId = block.id;

            require.config({paths: {'vs': 'node_modules/monaco-editor/min/vs'}});

            require(['vs/editor/editor.main'], function () {
                const language = block.classList.contains('part-python') ? 'python' : 'bash';

                const initialValue = editorContainer.textContent.trim() || '// Enter your ' + type + ' code here...';

                editorContainer.textContent = '';

                monaco.editor.defineTheme('flatpack', {
                    base: 'vs-dark',
                    colors: {
                        'editor.background': '#060c4d',
                        'editor.lineHighlightBackground': '#080f61'
                    },
                    inherit: true,
                    rules: [
                        {token: '', background: '060c4d', foreground: 'ffffff'},
                        {token: 'comment', foreground: 'cccccc', fontStyle: 'italic'},
                        {token: 'keyword', foreground: '31efb8'}
                    ]
                });

                const editor = monaco.editor.create(editorContainer, {
                    accessibilitySupport: 'off',
                    autoIndent: 'advanced',
                    automaticLayout: true,
                    bracketPairColorization: {
                        enabled: true
                    },
                    hideCursorInOverviewRuler: true,
                    language: language,
                    minimap: {
                        enabled: false
                    },
                    overviewRulerBorder: false,
                    overviewRulerLanes: 0,
                    padding: {
                        top: 25,
                        bottom: 20
                    },
                    scrollBeyondLastColumn: 0,
                    scrollBeyondLastLine: false,
                    scrollbar: {
                        horizontal: 'hidden',
                        vertical: 'hidden'
                    },
                    showUnused: true,
                    smoothScrolling: true,
                    stickyScroll: {
                        enabled: false
                    },
                    theme: 'flatpack',
                    unusualLineTerminators: 'auto',
                    value: initialValue,
                    wordWrap: 'on',
                    wrappingIndent: 'same',
                    wrappingStrategy: 'advanced'
                });

                const updateHeight = () => {
                    const contentHeight = Math.max(100, Math.min(1000, editor.getContentHeight()));
                    editorContainer.style.height = `${contentHeight}px`;
                    editor.layout();
                };

                editor.onDidContentSizeChange(updateHeight);
                updateHeight();
            });

            const toggleButton = block.querySelector('.toggle-button');
            if (toggleButton) {
                toggleButton.onclick = () => {
                    toggleBlock(block);
                    updateToggleButtonIcon(toggleButton, block);
                };
            }
        }
    });
}

function initBuildStatusCheck() {
    startBuildStatusCheck();
}

async function initializeApp(apiToken) {
    try {
        const csrfToken = await fetchCSRFToken();
        localStorage.setItem('csrfToken', csrfToken);

        await callAPI('clear-build-status', apiToken, 'POST');

        await Promise.all([
            setupEventListeners(apiToken),
            checkHeartbeat(apiToken),
            listImageFiles(apiToken),
            loadDefaultFile(apiToken),
            fetchComments(apiToken),
            fetchHooks(apiToken),
            fetchLatestLogs(apiToken),
            fetchSchedule(apiToken),
            loadEvalAndOutputFiles(apiToken)
        ]);

        initBuildStatusCheck();

        setInterval(() => checkHeartbeat(apiToken), 1000);
    } catch (error) {
        console.error('Error initializing app:', error);
        if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
            showStatus('Network error. Please check your connection and try again.', false);
        } else {
            showStatus('Failed to initialize app. Please try again.', false);
        }
    }
}

async function listImageFiles() {
    try {
        const response = await callAPI('list_image_files', localStorage.getItem('apiToken'), 'GET');
        const imageListContainer = document.getElementById('image-list-container');

        if (!imageListContainer) {
            console.error('Image list container not found in the DOM');
            showStatus('Error: Image list container not found.', false);
            return;
        }

        if (response.files && Array.isArray(response.files)) {
            if (response.files.length > 0) {
                imageListContainer.style.display = 'block';
                imageListContainer.innerHTML = '<div class="gallery"></div>';
                const gallery = imageListContainer.querySelector('.gallery');

                response.files.forEach(file => {
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item';
                    const createdDate = new Date(file.created_at * 1000);
                    const dateString = createdDate.toLocaleString();

                    galleryItem.innerHTML = `
                        <div class="image-container">
                            <a href="/output/${file.name}" download="${file.name}" class="download-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M7 0h1v1h-1zM8 0h1v1h-1zM7 1h1v1h-1zM8 1h1v1h-1zM7 2h1v1h-1zM8 2h1v1h-1zM7 3h1v1h-1zM8 3h1v1h-1zM7 4h1v1h-1zM8 4h1v1h-1zM7 5h1v1h-1zM8 5h1v1h-1zM3 6h1v1h-1zM4 6h1v1h-1zM7 6h1v1h-1zM8 6h1v1h-1zM11 6h1v1h-1zM12 6h1v1h-1zM3 7h1v1h-1zM4 7h1v1h-1zM7 7h1v1h-1zM8 7h1v1h-1zM11 7h1v1h-1zM12 7h1v1h-1zM5 8h1v1h-1zM6 8h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM9 8h1v1h-1zM10 8h1v1h-1zM5 9h1v1h-1zM6 9h1v1h-1zM7 9h1v1h-1zM8 9h1v1h-1zM9 9h1v1h-1zM10 9h1v1h-1zM7 10h1v1h-1zM8 10h1v1h-1zM7 11h1v1h-1zM8 11h1v1h-1zM0 12h1v1h-1zM1 12h1v1h-1zM14 12h1v1h-1zM15 12h1v1h-1zM0 13h1v1h-1zM1 13h1v1h-1zM14 13h1v1h-1zM15 13h1v1h-1zM0 14h1v1h-1zM1 14h1v1h-1zM2 14h1v1h-1zM3 14h1v1h-1zM4 14h1v1h-1zM5 14h1v1h-1zM6 14h1v1h-1zM7 14h1v1h-1zM8 14h1v1h-1zM9 14h1v1h-1zM10 14h1v1h-1zM11 14h1v1h-1zM12 14h1v1h-1zM13 14h1v1h-1zM14 14h1v1h-1zM15 14h1v1h-1zM0 15h1v1h-1zM1 15h1v1h-1zM2 15h1v1h-1zM3 15h1v1h-1zM4 15h1v1h-1zM5 15h1v1h-1zM6 15h1v1h-1zM7 15h1v1h-1zM8 15h1v1h-1zM9 15h1v1h-1zM10 15h1v1h-1zM11 15h1v1h-1zM12 15h1v1h-1zM13 15h1v1h-1zM14 15h1v1h-1zM15 15h1v1h-1z" fill="#060c4d"/></svg>
                            </a>
                            <img src="/output/${file.name}?cb=${Date.now()}" alt="${file.name}" loading="lazy">
                        </div>
                    `;

                    const img = galleryItem.querySelector('img');

                    img.addEventListener('click', () => {
                        displayLightbox(`/output/${file.name}?cb=${Date.now()}`);
                    });

                    gallery.appendChild(galleryItem);
                });
            } else {
                imageListContainer.style.display = 'none';
            }
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Error listing image files:', error);
        const errorMessage = error.message || 'Unknown error occurred';
        showStatus(`Error listing image files: ${errorMessage}`, false);
        const imageListContainer = document.getElementById('image-list-container');
        if (imageListContainer) {
            imageListContainer.style.display = 'none';
        }
    }
}

async function loadEvalAndOutputFiles(apiToken) {

    try {
        await fetchEvalData();
    } catch (error) {
        console.warn('Error fetching eval data:', error);
    }

    try {
        const evalData = await getEvalJSON(apiToken);

        const evalWidget = document.getElementById('eval-widget');
        if (!evalWidget) {
            console.error('eval-widget element not found in the DOM');
            return;
        }

        if (evalData !== null) {
            evalWidget.innerHTML = `<pre>${JSON.stringify(evalData, null, 2)}</pre>`;
        } else {
            evalWidget.innerHTML = '<p>No eval_data.json found. This may be normal if no build has been run yet.</p>';
        }
    } catch (error) {
        console.error('Error processing eval data:', error);
        const evalWidget = document.getElementById('eval-widget');
        if (evalWidget) {
            evalWidget.innerHTML = `<p>Error processing eval data: ${error.message}</p>`;
        } else {
            console.error('eval-widget element not found when trying to display error');
        }
        showStatus('Error processing eval data. Some information may be missing.', false);
    }
}

async function loadDefaultFile(apiToken) {
    try {
        const json = await callAPI('load_file', apiToken, 'GET', {filename: 'custom.json'});

        if (json && json.content) {
            const base64Content = json.content;
            const decodedContent = decodeURIComponent(escape(atob(base64Content)));
            const codeBlocks = JSON.parse(decodedContent);

            renderFileContents(codeBlocks);
            initializeMonacoEditorForExistingBlocks();

        } else {
            throw new Error('Received invalid data structure from server');
        }
    } catch (error) {
        console.error('Error loading file:', error);
        showStatus('Error loading default file. Please try again later.', false);
    }
}

function logCharacter(event) {
    const editor = event.target;
    const type = editor.closest('.part-python') ? 'python' : 'bash';
}

function moveBlockDown(block) {
    const next = block.nextElementSibling;
    if (next) {
        block.parentNode.insertBefore(next, block);
    }
}

function moveBlockUp(block) {
    const prev = block.previousElementSibling;
    if (prev) {
        block.parentNode.insertBefore(block, prev);
    }
}

function populateLogDropdown(logs) {
    const logDropdown = document.getElementById('log-dropdown');
    logDropdown.innerHTML = '';

    if (logs.length === 0) {
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Select a log file';
        logDropdown.appendChild(defaultOption);
    } else {
        logs.forEach(log => {
            const option = document.createElement('option');
            option.value = log;
            option.textContent = log;
            logDropdown.appendChild(option);
        });

        logDropdown.value = logs[0];
        fetchSelectedLog();
    }
}

async function postComment(blockId, selectedText, comment) {
    const apiToken = localStorage.getItem('apiToken');
    const csrfToken = localStorage.getItem('csrfToken');

    const payload = JSON.stringify({
        block_id: blockId,
        selected_text: selectedText,
        comment: comment
    });

    try {
        const headers = {
            'Authorization': `Bearer ${apiToken}`,
            'X-CSRF-Token': csrfToken,
            'Content-Type': 'application/json'
        };

        const response = await fetch(`${getBaseUrl()}/api/comments`, {
            method: 'POST',
            headers: headers,
            body: payload
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Server error: ${errorData.detail}`);
        }

        const responseData = await response.json();
        return true;
    } catch (error) {
        throw new Error(`Failed to add comment: ${error.message}`);
    }
}

function reattachToggleListeners() {
    document.querySelectorAll('.toggle-button').forEach(button => {
        button.onclick = () => {
            const block = button.closest('.part-python, .part-bash');
            toggleBlock(block);
            updateToggleButtonIcon(button, block);
        };
    });
}

async function refreshCommentsFromBackend() {
    comments.length = 0;
    await fetchComments();
    renderComments();
}

async function refreshCSRFToken() {
    try {
        const response = await fetch('/csrf-token');
        if (!response.ok) {
            throw new Error('Failed to fetch new CSRF token');
        }
        const data = await response.json();
        localStorage.setItem('csrfToken', data.csrf_token);
        return data.csrf_token;
    } catch (error) {
        console.error('Error refreshing CSRF token:', error);
        throw error;
    }
}

function renderComments() {
    const commentList = document.getElementById('comment-list');
    commentList.innerHTML = '';

    if (comments.length === 0) {
        commentList.innerHTML = '<p>No comments available.</p>';
        return;
    }

    const sortedComments = comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    sortedComments.forEach((c, index) => {
        if (c.id) {
            const commentElement = document.createElement('div');
            commentElement.className = `comment-item comment-item-${index}`;
            commentElement.innerHTML = `
                <strong>ID:</strong> ${c.id}<br>
                <strong>Selection:</strong> ${c.text}<br>
                <strong>Comment:</strong> ${c.comment}<br>
                <strong>Created at:</strong> ${new Date(c.created_at).toLocaleString()}<br>
                <div class="delete-link"><a href="javascript:void(0);" onclick="deleteComment(${c.id})">Delete</a></div>
            `;
            commentElement.style.cursor = 'pointer';
            commentElement.onclick = () => highlightBlock(c.blockId);
            commentList.appendChild(commentElement);
        } else {
            console.error('Comment without an ID:', c);
        }
    });
}

function renderDatetimeList() {
    datetimeList.innerHTML = '';
    manualDatetimes.forEach((datetime, index) => {
        const li = document.createElement('li');
        li.textContent = new Date(datetime).toLocaleString();
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => deleteScheduleEntry(index);
        li.appendChild(removeBtn);
        datetimeList.appendChild(li);
    });
}

function renderExistingSchedule(data) {
    const schedulesContainer = document.getElementById('schedules-container');
    schedulesContainer.innerHTML = '';

    if (data.schedules && data.schedules.length > 0) {
        data.schedules.forEach((schedule, scheduleIndex) => {
            const scheduleContainer = document.createElement('div');
            scheduleContainer.className = 'schedule-container';
            scheduleContainer.setAttribute('data-schedule-id', schedule.id);

            const scheduleHeader = document.createElement('div');
            scheduleHeader.className = 'schedule-header';
            scheduleHeader.textContent = `Schedule ${scheduleIndex + 1} (ID: ${schedule.id}):`;
            scheduleContainer.appendChild(scheduleHeader);

            const scheduleType = document.createElement('div');
            scheduleType.className = 'schedule-type';
            scheduleType.textContent = `Type: ${schedule.type === 'recurring' ? 'Recurring' : 'Manual'}`;
            scheduleContainer.appendChild(scheduleType);

            const lastRun = document.createElement('div');
            lastRun.className = 'last-run';
            lastRun.textContent = `Last Run: ${schedule.last_run || 'Never'}`;
            scheduleContainer.appendChild(lastRun);

            if (schedule.type === 'recurring') {
                const cronPattern = document.createElement('div');
                cronPattern.className = 'cron-pattern';
                cronPattern.textContent = `Cron Pattern: ${schedule.pattern || 'Not set'}`;
                scheduleContainer.appendChild(cronPattern);
            } else if (schedule.type === 'manual') {
                const datetimesContainer = document.createElement('div');
                datetimesContainer.className = 'datetimes-container';

                if (schedule.datetimes && schedule.datetimes.length > 0) {
                    schedule.datetimes.forEach((dt, datetimeIndex) => {
                        const datetimeItem = document.createElement('div');
                        datetimeItem.className = 'datetime-item';
                        datetimeItem.textContent = `${datetimeIndex + 1}. ${dt}`;

                        const deleteDatetimeButton = document.createElement('span');
                        deleteDatetimeButton.className = 'delete-datetime-button';
                        deleteDatetimeButton.innerHTML = minusIcon;
                        deleteDatetimeButton.style.cursor = 'pointer';
                        deleteDatetimeButton.onclick = () => deleteScheduleEntry(schedule.id, datetimeIndex);

                        datetimeItem.appendChild(deleteDatetimeButton);
                        datetimesContainer.appendChild(datetimeItem);
                    });
                } else {
                    const noDatetimes = document.createElement('div');
                    noDatetimes.textContent = 'No datetimes set';
                    datetimesContainer.appendChild(noDatetimes);
                }

                scheduleContainer.appendChild(datetimesContainer);
            }

            const deleteScheduleButton = document.createElement('a');
            deleteScheduleButton.className = 'delete-schedule-link';
            deleteScheduleButton.textContent = 'Delete';
            deleteScheduleButton.href = '#';
            deleteScheduleButton.style.cursor = 'pointer';
            deleteScheduleButton.onclick = (event) => {
                event.preventDefault();
                deleteScheduleEntry(schedule.id);
            };

            scheduleContainer.appendChild(deleteScheduleButton);
            schedulesContainer.appendChild(scheduleContainer);
        });
    } else {
        const noSchedules = document.createElement('div');
        noSchedules.textContent = 'No schedules available.';
        schedulesContainer.appendChild(noSchedules);
    }
}

function renderFileContents(codeBlocks) {
    const fileContentElement = document.getElementById('file-content');
    fileContentElement.innerHTML = '';

    codeBlocks.forEach(blockData => {
        const {type, disabled, code} = blockData;

        const block = document.createElement('div');
        block.className = `part-${type}`;
        if (disabled) block.classList.add('disabled');

        const uniqueId = `part-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        block.id = uniqueId;

        const colorLabel = document.createElement('div');
        colorLabel.className = 'color-label';
        block.appendChild(colorLabel);

        const editorWrapper = document.createElement('div');
        editorWrapper.className = 'editor-wrapper';
        editorWrapper.style.position = 'relative';

        const editor = document.createElement('div');
        editor.className = 'editor';
        editor.contentEditable = disabled ? 'false' : 'true';

        editor.textContent = code;

        editor.style.whiteSpace = 'pre-wrap';

        editorWrapper.appendChild(editor);

        const commentButton = document.createElement('button');
        commentButton.className = 'comment-button';
        commentButton.innerHTML = addCommentIcon;
        commentButton.onclick = () => addCommentToBlock(block);
        editorWrapper.appendChild(commentButton);

        block.appendChild(editorWrapper);

        const controls = document.createElement('div');
        controls.className = 'controls';

        controls.appendChild(createControlElement('handle', type));
        controls.appendChild(createControlElement('move-up', arrowUpIcon, () => moveBlockUp(block)));
        controls.appendChild(createControlElement('move-down', arrowDownIcon, () => moveBlockDown(block)));
        controls.appendChild(createControlElement('delete-button', editorTrashIcon, () => deleteBlock(block)));

        const toggleButton = createToggleButton(block);
        updateToggleButtonIcon(toggleButton, block);
        controls.appendChild(toggleButton);

        block.appendChild(controls);

        fileContentElement.appendChild(block);

        if (disabled) {
            block.classList.add('disabled');
            editor.contentEditable = 'false';
            editor.style.pointerEvents = 'none';
            const controlElements = block.querySelectorAll('.move-up, .move-down, .delete-button');
            controlElements.forEach(control => control.style.display = 'none');
            commentButton.style.display = 'none';
        }
    });

    fileContentElement.classList.add('loaded');
}

function renderHooks(hooks) {
    const hooksContainer = document.getElementById('hooks-list');
    hooksContainer.innerHTML = '';

    if (!hooks || hooks.length === 0) {
        hooksContainer.innerHTML += '<p>No hooks available.</p>';
        return;
    }

    const list = document.createElement('ul');
    hooks.forEach(hook => {
        const listItem = document.createElement('li');

        listItem.setAttribute('data-hook-id', hook.id);

        const hookLabelElement = document.createElement('div');
        hookLabelElement.className = 'hook-label';

        const hookTypeContainer = document.createElement('div');
        hookTypeContainer.className = 'hook-type-container';

        const hookTypeElement = document.createElement('div');
        hookTypeElement.className = 'hook-type';
        hookTypeElement.innerHTML = `${hook.hook_type || 'undefined'}`;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = hooksTrashIcon;
        deleteButton.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this hook?')) {
                await deleteHook(hook.id);
                await fetchHooks(localStorage.getItem('apiToken'));
            }
        });

        hookTypeContainer.appendChild(hookTypeElement);
        hookTypeContainer.appendChild(deleteButton);

        const hookNameElement = document.createElement('div');
        hookNameElement.className = 'hook-name';
        hookNameElement.innerHTML = `@${hook.hook_name || 'undefined'}`;

        const hookPlacementElement = document.createElement('div');
        hookPlacementElement.className = 'hook-placement';
        hookPlacementElement.textContent = '-> ' + hook.hook_placement || 'undefined';

        const hookScriptElement = document.createElement('pre');
        hookScriptElement.className = 'hook-script';
        hookScriptElement.textContent = hook.hook_script || 'undefined';

        listItem.appendChild(hookLabelElement);
        listItem.appendChild(hookTypeContainer);
        listItem.appendChild(hookNameElement);
        listItem.appendChild(hookPlacementElement);
        listItem.appendChild(hookScriptElement);

        list.appendChild(listItem);
    });

    hooksContainer.appendChild(list);
}

function renderLogContent(content) {
    const logContentElement = document.getElementById('log-output');
    logContentElement.innerText = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
}

function resetAppState() {
    localStorage.removeItem('apiToken');
    window.location.reload();
}

function resizeAllTextareas() {
    const editors = document.querySelectorAll('.editor');
    editors.forEach(editor => {
        editor.style.height = 'auto';
        editor.style.height = `${editor.scrollHeight}px`;
    });
}

function resizeEditor(editor) {
    editor.style.height = 'auto';
    editor.style.height = `${editor.scrollHeight}px`;
}

function saveBuildStatus(status) {
    localStorage.setItem('buildStatus', status);
}

async function saveFile(status = false, apiToken) {
    const blocks = Array.from(document.querySelectorAll('.part-python, .part-bash'))
        .map(part => {
            const editorContainer = part.querySelector('.editor-wrapper > div');
            if (!editorContainer) return null;

            const editorInstance = monaco.editor.getEditors().find(editor => {
                const editorNode = editor.getDomNode();
                return editorNode && editorNode.parentElement === editorContainer;
            });

            if (!editorInstance) return null;

            let code = editorInstance.getValue();
            code = code.replace(/\n{3,}/g, '\n\n');

            const type = part.classList.contains('part-python') ? 'python' : 'bash';
            const disabled = part.classList.contains('disabled');

            return {type, disabled, code};
        })
        .filter(Boolean);

    const jsonContent = JSON.stringify(blocks);

    const base64Content = btoa(unescape(encodeURIComponent(jsonContent)));

    const formData = new FormData();
    formData.append('filename', 'custom.json');
    formData.append('content', base64Content);

    try {
        const csrfToken = localStorage.getItem('csrfToken');
        const headers = {'X-CSRF-Token': csrfToken};

        const response = await callAPI('save_file', apiToken, 'POST', formData, headers);

        if (response.message === "File saved successfully!") {
            showStatus('Saved successfully!', true);
        } else {
            showStatus('Save failed!', false);
        }

        if (response.message === "File saved successfully!") {
            window.scrollTo(0, 0);
        }

    } catch (error) {
        console.error('Error saving file:', error);
        showStatus('Error saving file!', false);
    }
}

async function sendScheduleToServer(scheduleData) {
    const apiToken = localStorage.getItem('apiToken');
    const csrfToken = localStorage.getItem('csrfToken');

    const headers = {
        'Authorization': `Bearer ${apiToken}`,
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(`${getBaseUrl()}/api/schedule`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(scheduleData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Server error: ${errorData.detail || response.statusText}`);
        }

        const responseData = await response.json();

        showStatus('Schedule saved successfully!', true);

        await fetchSchedule();
    } catch (error) {
        console.error('Error saving schedule:', error);
        showStatus(`Error saving schedule: ${error.message}`, false);
    }
}

function setCSRFHeader(headers) {
    const csrfToken = localStorage.getItem('csrfToken');
    if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
    }
}

function setScheduleType(type) {
    const input = cronWidget.querySelector(`input[name="schedule-type"][value="${type}"]`);
    if (input) {
        input.checked = true;
        if (type === 'recurring') {
            recurringSchedule.style.display = 'block';
            manualSchedule.style.display = 'none';
        } else {
            recurringSchedule.style.display = 'none';
            manualSchedule.style.display = 'block';
        }
    }
}

function setupEventListeners(apiToken) {
    const saveAction = document.getElementById('save-action');
    const verifyAction = document.getElementById('verify-action');
    const buildAction = document.getElementById('build-action');
    const saveButton = document.getElementById('save-button');

    if (saveAction && verifyAction && buildAction && saveButton) {
        saveAction.addEventListener('click', () => saveFile(true, apiToken));
        verifyAction.addEventListener('click', () => verifyCode(apiToken));
        buildAction.addEventListener('click', () => buildProject(apiToken));
        saveButton.addEventListener('click', () => saveFile(true, apiToken));
    } else {
        console.error('One or more action buttons are missing.');
    }

    const abortButton = document.getElementById('abort-build-button');
    if (abortButton) {
        abortButton.addEventListener('click', () => abortBuild(apiToken));
    }
}

function showApiKeyModal() {
    apiKeyModal.style.display = 'flex';
}

function showLoadingOverlay(message = 'Please wait') {
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingMessage = document.getElementById('loading-message');

    loadingMessage.textContent = message;
    loadingOverlay.style.display = 'flex';
}

function showStatus(message, isSuccess = true) {
    const statusBar = document.getElementById('status-bar');
    const tabsContainer = document.querySelector('.tabs-container');

    if (!statusBar) {
        console.error('Status bar element not found');
        return;
    }

    if (statusBar.hideTimeout) {
        clearTimeout(statusBar.hideTimeout);
    }

    statusBar.textContent = message;
    statusBar.style.display = 'block';
    statusBar.classList.remove('success', 'error');
    statusBar.classList.add(isSuccess ? 'success' : 'error');

    if (tabsContainer) {
        tabsContainer.style.marginTop = '0px';
    }

    statusBar.hideTimeout = setTimeout(() => {
        statusBar.style.display = 'none';
        statusBar.classList.remove('success', 'error');

        if (tabsContainer) {
            tabsContainer.style.marginTop = '';
        }
    }, 5000);
}

function startBuildStatusCheck() {
    buildStatusCleared = false;

    if (!buildStatusInterval) {
        buildStatusInterval = setInterval(checkBuildStatus, CHECK_INTERVAL);
    }
    checkBuildStatus();
    currentStepIndex = -1;
}

function stopBuildStatusCheck() {
    clearInterval(buildStatusInterval);
    buildStatusInterval = null;
}

function stripFormatting(e) {
    e.preventDefault();
    const text = (e.originalEvent || e).clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
}

function toggleBlock(block) {
    if (!block) {
        console.error('Block is null or undefined.');
        return;
    }

    block.classList.toggle('disabled');
    const editor = block.querySelector('.editor');
    const controls = block.querySelectorAll('.move-up, .move-down, .delete-button');
    const commentButton = block.querySelector('.comment-button');

    if (editor) {
        if (block.classList.contains('disabled')) {
            editor.contentEditable = 'false';
            editor.style.pointerEvents = 'none';
        } else {
            editor.contentEditable = 'true';
            editor.style.pointerEvents = 'auto';
        }
    } else {
        console.error('Editor element not found within block:', block);
    }

    if (controls.length > 0) {
        controls.forEach(control => {
            control.style.display = block.classList.contains('disabled') ? 'none' : 'flex';
        });
    } else {
        console.error('Controls not found within block:', block);
    }

    if (commentButton) {
        commentButton.style.display = block.classList.contains('disabled') ? 'none' : 'flex';
    } else {
        console.error('Comment button not found within block:', block);
    }
}

function toggleCommentSidebar() {
    const sidebar = document.getElementById('comment-sidebar');
    if (sidebar.style.display === 'block') {
        sidebar.style.display = 'none';
        localStorage.setItem('commentSidebarState', 'hidden');
    } else {
        sidebar.style.display = 'block';
        localStorage.setItem('commentSidebarState', 'shown');
    }
}

async function updateExistingHook(hookId, newHook) {
    const apiToken = localStorage.getItem('apiToken');
    const csrfToken = localStorage.getItem('csrfToken');

    try {
        const response = await fetch(`${getBaseUrl()}/api/hooks/${hookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`,
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify(newHook)
        });

        if (response.ok) {
            await fetchHooks(apiToken);
            showStatus('Hook updated successfully!', true);
        } else {
            const data = await response.json();
            showStatus(`Error updating hook: ${data.detail}`, false);
        }
    } catch (error) {
        console.error('Error updating hook:', error);
        showStatus(`Error: ${error.message}`, false);
    }
}

async function validateAndInitialize(apiToken) {
    try {
        if (typeof apiToken !== 'string' || apiToken.trim() === '') {
            console.error('No API token provided.');
            showStatus('Please enter a valid API token.', false);
            return false;
        }

        if (typeof callAPI !== 'function') {
            console.error('callAPI function is not defined.');
            showStatus('Internal error: Unable to validate API token.', false);
            return false;
        }

        const response = await callAPI('validate_token', apiToken, 'POST', {api_token: apiToken});

        if (response && response.message === 'API token is valid.') {
            try {
                localStorage.setItem('apiToken', apiToken);
            } catch (storageError) {
                console.error('Failed to store API token in localStorage:', storageError);
                showStatus('Error storing API token. Please check your browser settings.', false);
                return false;
            }

            if (typeof initializeApp !== 'function') {
                console.error('initializeApp function is not defined.');
                showStatus('Internal error: Unable to initialize the application.', false);
                return false;
            }

            await initializeApp(apiToken);

            const apiKeyModalElement = document.getElementById('api-key-modal');

            if (apiKeyModalElement) {
                apiKeyModalElement.style.display = 'none';
            } else {
                console.warn('API key modal element not found.');
            }

            return true;
        } else {
            const errorMessage = response && response.message ? response.message : 'Unknown error';
            localStorage.removeItem('apiToken');
            return false;
        }
    } catch (error) {

        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            showStatus('Network error. Please check your connection and try again.', false);
        } else if (error.message && error.message.includes('401')) {
            showStatus('Invalid API token. Please enter a valid token.', false);
        } else {
            showStatus(`Failed to validate API token. ${error.message}`, false);
        }

        localStorage.removeItem('apiToken');
        return false;
    }
}

async function verifyCode(apiToken) {
    try {
        const csrfToken = localStorage.getItem('csrfToken');
        const headers = {'X-CSRF-Token': csrfToken};
        const response = await callAPI('verify', apiToken, 'POST', null, headers);

        if (response.message === "Verification process completed successfully.") {
            showStatus('Verification successful!', true);
        } else {
            showStatus('Verification failed!', false);
        }

    } catch (error) {
        console.error('Error during verification:', error);
        showStatus('Error during verification!', false);
    }
}

document.getElementById('hook-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const apiToken = localStorage.getItem('apiToken');
    const csrfToken = localStorage.getItem('csrfToken');
    const hookName = document.getElementById('hook-name').value.trim();
    const hookType = document.getElementById('hook-type').value;
    const hookPlacement = document.getElementById('hook-placement').value.trim();
    const hookScript = document.getElementById('hook-script').value.trim();

    if (hookName && hookType && hookScript) {
        try {
            const response = await fetch(`${getBaseUrl()}/api/hooks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiToken}`,
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({
                    hook_name: hookName,
                    hook_type: hookType,
                    hook_placement: hookPlacement,
                    hook_script: hookScript
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.existing_hook) {
                    handleHookConflict(data.existing_hook, data.new_hook);
                } else {
                    await fetchHooks(apiToken);
                    showStatus('Hook added successfully!', true);
                }
            } else if (response.status === 409) {
                const data = await response.json();
                handleHookConflict(data.existing_hook, data.new_hook);
            } else {
                const data = await response.json();
                showStatus(`Error: ${data.detail}`, false);
            }
        } catch (error) {
            console.error('Error adding hook:', error);
            showStatus(`Error: ${error.message}`, false);
        }
    } else {
        showStatus('Please fill in all fields.', false);
    }
});

window.addEventListener('resize', resizeAllTextareas);

document.getElementById('file-content').addEventListener('click', function (event) {
    if (event.target.closest('.toggle-button')) {
        const button = event.target.closest('.toggle-button');
        const block = button.closest('.part-python, .part-bash');
        if (block) {
            toggleBlock(block);
            updateToggleButtonIcon(button, block);
        }
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const abortButton = document.getElementById('abort-build-button');

    if (abortButton) {
        abortButton.addEventListener('click', function () {
            abortBuild();
        });
    }

    const debouncedInitialization = debounce(async (apiToken) => {
        try {
            await validateAndInitialize(apiToken);
        } catch (error) {
            console.error('Error during debounced initialization:', error);
            showStatus('Initialization error. Please try again.', false);
        }
    }, 500);

    if (apiKeySubmit && apiKeyInput) {
        apiKeySubmit.addEventListener('click', async () => {
            const apiKey = apiKeyInput.value.trim();

            if (apiKey) {
                try {
                    const isValid = await validateAndInitialize(apiKey);

                    if (!isValid) {
                        showApiKeyModal();
                    }
                } catch (error) {
                    console.error('Error during API token validation:', error);
                    showStatus('Failed to validate API token. Please try again.', false);
                    showApiKeyModal();
                }
            } else {
                showStatus('Please enter a valid API token.', false);
            }
        });
    } else {
        console.error('API key input or submit button not found.');
    }

    try {
        const storedApiToken = localStorage.getItem('apiToken');

        if (storedApiToken) {
            await debouncedInitialization(storedApiToken);
            checkAndRestoreBuildStatus();
        } else {
            showApiKeyModal();
        }
    } catch (error) {
        console.error('Error during initialization with stored API token:', error);
        showStatus('Failed to initialize with stored API token. Please log in again.', false);
        showApiKeyModal();
    }

    const editors = document.querySelectorAll('.editor');

    if (editors.length > 0) {
        editors.forEach((editor) => {
            addEventListenersToEditor(editor);
            resizeEditor(editor);
        });
    }

    if (commentSidebar) {
        const savedSidebarState = localStorage.getItem('commentSidebarState');
        commentSidebar.style.display = savedSidebarState === 'shown' ? 'block' : 'none';
    } else {
        console.warn('Comment sidebar element not found.');
    }

    const boardTab = document.querySelector('.tab[data-tab="board"]');
    const editorTab = document.querySelector('.tab[data-tab="editor"]');
    const hooksTab = document.querySelector('.tab[data-tab="hooks"]');
    const logTab = document.querySelector('.tab[data-tab="log"]');

    const setActiveTab = (tab) => {
        if (!tab) {
            console.error('Tab element is undefined.');
            return;
        }
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');
        tabs.forEach((t) => t.classList.remove('active'));
        tabContents.forEach((tc) => tc.classList.remove('active'));

        tab.classList.add('active');
        const tabContent = document.getElementById(`${tab.dataset.tab}-content`);
        if (tabContent) {
            tabContent.classList.add('active');
        } else {
            console.error(`Tab content element not found for ${tab.dataset.tab}`);
        }
        localStorage.setItem('activeTab', tab.dataset.tab);
        resizeAllTextareas();
    };

    if (boardTab) {
        boardTab.addEventListener('click', () => setActiveTab(boardTab));
    } else {
        console.error('Board tab element not found.');
    }
    if (editorTab) {
        editorTab.addEventListener('click', () => setActiveTab(editorTab));
    } else {
        console.error('Editor tab element not found.');
    }
    if (hooksTab) {
        hooksTab.addEventListener('click', () => setActiveTab(hooksTab));
    } else {
        console.error('Hooks tab element not found.');
    }
    if (logTab) {
        logTab.addEventListener('click', () => setActiveTab(logTab));
    } else {
        console.error('Log tab element not found.');
    }

    const activeTab = localStorage.getItem('activeTab');
    let initialTab = boardTab;

    if (activeTab) {
        const activeTabElement = document.querySelector(`.tab[data-tab="${activeTab}"]`);
        if (activeTabElement) {
            initialTab = activeTabElement;
        } else {
            console.warn(`No tab found for activeTab: ${activeTab}, defaulting to boardTab.`);
        }
    }
    setActiveTab(initialTab);

    setScheduleType('manual');

    if (scheduleTypeInputs.length > 0) {
        scheduleTypeInputs.forEach((input) => {
            input.addEventListener('change', (e) => {
                if (e.target.value === 'recurring') {
                    if (recurringSchedule && manualSchedule) {
                        recurringSchedule.style.display = 'block';
                        manualSchedule.style.display = 'none';
                    } else {
                        console.error('Schedule elements not found.');
                    }
                } else {
                    if (recurringSchedule && manualSchedule) {
                        recurringSchedule.style.display = 'none';
                        manualSchedule.style.display = 'block';
                    } else {
                        console.error('Schedule elements not found.');
                    }
                }
            });
        });
    } else {
        console.warn('No schedule type inputs found.');
    }

    const addDatetimeBtn = document.getElementById('add-datetime');
    if (addDatetimeBtn) {
        addDatetimeBtn.addEventListener('click', () => {
            const datetimeInput = document.getElementById('manual-datetime');
            if (datetimeInput) {
                const datetimeValue = datetimeInput.value;
                if (datetimeValue) {
                    addDatetimeToList(datetimeValue);
                    datetimeInput.value = '';
                } else {
                    showStatus('Please select a date and time.', false);
                }
            } else {
                console.error('Manual datetime input element not found.');
            }
        });
    } else {
        console.error('Add datetime button not found.');
    }

    if (saveScheduleBtn) {
        saveScheduleBtn.addEventListener('click', async () => {
            try {
                const scheduleTypeElement = document.querySelector('input[name="schedule-type"]:checked');
                if (!scheduleTypeElement) {
                    showStatus('Please select a schedule type.', false);
                    return;
                }

                const scheduleType = scheduleTypeElement.value;
                let scheduleData;

                if (scheduleType === 'recurring') {
                    const cronPatternValue = cronPattern.value.trim();

                    if (!cronPatternValue) {
                        showStatus('Please enter a valid cron pattern.', false);
                        return;
                    }

                    scheduleData = {
                        type: 'recurring',
                        pattern: cronPatternValue,
                        datetimes: [],
                    };

                    cronPattern.value = '';
                } else if (scheduleType === 'manual') {
                    const datetimes = [];
                    datetimeList.querySelectorAll('li').forEach((li) => {
                        datetimes.push(li.dataset.datetime);
                    });

                    if (datetimes.length === 0) {
                        showStatus('Please add at least one date-time for the manual schedule.', false);
                        return;
                    }

                    scheduleData = {
                        type: 'manual',
                        pattern: null,
                        datetimes: datetimes,
                    };
                }

                await sendScheduleToServer(scheduleData);

                datetimeList.style.display = 'none';
                datetimeList.innerHTML = '';
            } catch (error) {
                console.error('Error saving schedule:', error);
                showStatus('Error saving schedule. Please try again.', false);
            }
        });
    } else {
        console.error('Save schedule button not found.');
    }

    checkDatetimeListEmpty();
    await fetchSchedule();
});