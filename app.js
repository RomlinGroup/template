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

const MASONRY_CONFIG = {
    itemSelector: '.gallery-item',
    columnWidth: '.gallery-item',
    gutter: 20,
    percentPosition: false,
    horizontalOrder: true,
    transitionDuration: 100,
    initLayout: false,
    fitWidth: true,
    resize: true
};

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
let creatingConnection = false;
let currentStepIndex = -1;
let disconnectedCount = 0;
let highlightTimeout;
let initializationTimeout;
let isBuilding = false;
let isExpanded = false;
let isFetchingEvalData = false;
let isLayoutInProgress = false;
let lastStatus = '';
let lastStep = '';
let manualDatetimes = [];

async function abortBuild(apiToken) {
    try {
        if (!apiToken) {
            apiToken = localStorage.getItem('apiToken');
        }

        const response = await callAPI('abort-build', apiToken, 'POST');

        console.log('Abort build response:', response);

        if (response && response.message) {
            if (response.message === "Build process forcefully terminated.") {
                showStatus('Build process aborted.', true);
                stopBuildStatusCheck();
                hideLoadingOverlay();
                enableInteractions();
            } else if (response.message === "Attempted force abort with errors.") {
                showStatus('Build aborted with some errors.', false);
                stopBuildStatusCheck();
                hideLoadingOverlay();
                enableInteractions();
            } else {
                showStatus(response.message, false);
            }
        } else {
            showStatus('Invalid response from server', false);
        }
    } catch (error) {
        console.error('Error aborting build:', error);
        showStatus(`Error aborting build: ${error.message}`, false);
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

    editor.addEventListener('wheel', () => {
        resizeEditor(editor);
    }, {passive: true});

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
    let url = `${getBaseUrl()}/api/${endpoint}`;
    const headers = {
        "Authorization": `Bearer ${apiToken}`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
    };

    setCSRFHeader(headers);

    const options = {method, headers};

    if (method === "GET" && data) {
        const params = new URLSearchParams(data);
        url += `?${params.toString()}`;
    } else if (method === "POST" && data) {
        if (data instanceof FormData) {
            options.body = data;
        } else if (endpoint === "source-hook-mappings") {
            headers["Content-Type"] = "application/json";
            const mappings = Array.isArray(data) ? data : [data];
            options.body = JSON.stringify(mappings);
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
    }

    const separator = url.includes('?') ? '&' : '?';
    url += `${separator}t=${Date.now()}`;

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
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
        const response = await callAPI('validate-token', apiToken, 'GET');
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
            hour: '2-digit', minute: '2-digit', hour12: false
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

function createGPIOSelector(buttonSelector, validGPIOPins, onSelectCallback) {
    validGPIOPins = validGPIOPins || [4, 5, 6, 12, 13, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27];

    const lightboxHTML = `
        <div id="lightbox-overlay">
            <div class="source-lightbox">
                <h3>Add</h3>
                <div class="gpio-selector">
                    <button id="arrow-up" class="arrow-button">Up</button>
                    <ul id="gpio-list"></ul>
                    <button id="arrow-down" class="arrow-button">Down</button>
                </div>
                <button id="close-lightbox" class="close-button">Close</button>
            </div>
        </div>
    `;

    const lightboxContainer = document.createElement('div');
    lightboxContainer.innerHTML = lightboxHTML;
    document.body.appendChild(lightboxContainer);

    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const gpioList = document.getElementById('gpio-list');
    const closeButton = document.getElementById('close-lightbox');
    const arrowUp = document.getElementById('arrow-up');
    const arrowDown = document.getElementById('arrow-down');

    const visibleCount = 5;
    let startIndex = 0;

    function renderList() {
        gpioList.innerHTML = '';
        const endIndex = Math.min(startIndex + visibleCount, validGPIOPins.length);

        for (let i = startIndex; i < endIndex; i++) {
            const li = document.createElement('li');
            li.textContent = `GPIO ${validGPIOPins[i]}`;
            li.classList.add('gpio-item');
            li.addEventListener('click', () => {
                if (onSelectCallback) onSelectCallback(validGPIOPins[i]);
                hideLightbox();
            });

            gpioList.appendChild(li);
        }
    }

    function handleScroll(direction) {
        if (direction === 'up' && startIndex > 0) {
            startIndex--;
        } else if (direction === 'down' && startIndex + visibleCount < validGPIOPins.length) {
            startIndex++;
        }
        renderList();
    }

    function showLightbox() {
        startIndex = 0;
        renderList();
        lightboxOverlay.style.display = 'block';
    }

    function hideLightbox() {
        lightboxOverlay.style.display = 'none';
    }

    closeButton.addEventListener('click', hideLightbox);
    arrowUp.addEventListener('click', () => handleScroll('up'));
    arrowDown.addEventListener('click', () => handleScroll('down'));

    arrowUp.addEventListener('mouseover', () => {
        const interval = setInterval(() => handleScroll('up'), 200);
        arrowUp.addEventListener('mouseout', () => clearInterval(interval), {once: true});
    });

    arrowDown.addEventListener('mouseover', () => {
        const interval = setInterval(() => handleScroll('down'), 200);
        arrowDown.addEventListener('mouseout', () => clearInterval(interval), {once: true});
    });

    const buttons = document.querySelectorAll(buttonSelector);
    buttons.forEach(button => button.addEventListener('click', showLightbox));

    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) hideLightbox();
    });
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
        const hookElement = document.querySelector(`[data-hook-id="${hookId}"]`);
        if (!hookElement) {
            console.error('Hook element not found:', hookId);
            return;
        }

        await callAPI(`hooks/${hookId}`, apiToken, 'DELETE');

        hookElement.remove();

        const hooks = await callAPI('hooks', apiToken, 'GET');
        await renderHooks(hooks.hooks);
        await window.lineDrawing.loadConnections();

        await new Promise(resolve => setTimeout(resolve, 50));

        showStatus('Hook deleted successfully!', true);

    } catch (error) {
        console.error('Error deleting hook:', error);
        showStatus('Error deleting hook!', false);

        const svg = document.querySelector('.connector-svg');

        if (svg) {
            svg.style.visibility = 'visible';
        }
    }
}

async function deleteScheduleEntry(scheduleId, datetimeIndex = null) {
    if (!isAuthenticated()) {
        showStatus('Please authenticate before deleting schedules.', false);
        return;
    }

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

async function deleteSource(sourceId) {
    if (!isAuthenticated()) {
        showStatus('Please authenticate before deleting sources.', false);
        return;
    }

    try {
        const apiToken = localStorage.getItem('apiToken');
        const sourceElement = document.querySelector(`[data-source-id="${sourceId}"]`);

        if (!sourceId) {
            throw new Error('Invalid source ID');
        }

        const response = await callAPI(`sources/${sourceId}`, apiToken, 'DELETE');

        if (response && response.message === "Source deleted successfully.") {
            if (sourceElement) {
                sourceElement.remove();
            }
            await window.lineDrawing.loadConnections();
            showStatus('Source deleted successfully!', true);
        } else {
            throw new Error('Unexpected response from server');
        }
    } catch (error) {
        console.error('Error deleting source:', error);
        showStatus(`Error deleting source: ${error.message}`, false);
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

    if (container && container instanceof HTMLElement) {
        container.appendChild(audioElement);
    } else {
        console.error('Invalid container specified');
    }
}

function displayLatestMediaLightbox() {
    const existingLightbox = document.querySelector('.latest-media-lightbox');
    if (existingLightbox) {
        existingLightbox.remove();
    }

    const lightbox = document.createElement('div');
    lightbox.className = 'latest-media-lightbox';

    const closeButton = document.createElement('button');
    closeButton.className = 'close-lightbox';

    closeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
            <path d="M1 1h1v1h-1zM2 1h1v1h-1zM13 1h1v1h-1zM14 1h1v1h-1zM1 2h1v1h-1zM2 2h1v1h-1zM13 2h1v1h-1zM14 2h1v1h-1zM3 3h1v1h-1zM4 3h1v1h-1zM11 3h1v1h-1zM12 3h1v1h-1zM3 4h1v1h-1zM4 4h1v1h-1zM11 4h1v1h-1zM12 4h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM9 5h1v1h-1zM10 5h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM9 6h1v1h-1zM10 6h1v1h-1zM7 7h1v1h-1zM8 7h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM5 9h1v1h-1zM6 9h1v1h-1zM9 9h1v1h-1zM10 9h1v1h-1zM5 10h1v1h-1zM6 10h1v1h-1zM9 10h1v1h-1zM10 10h1v1h-1zM3 11h1v1h-1zM4 11h1v1h-1zM11 11h1v1h-1zM12 11h1v1h-1zM3 12h1v1h-1zM4 12h1v1h-1zM11 12h1v1h-1zM12 12h1v1h-1zM1 13h1v1h-1zM2 13h1v1h-1zM13 13h1v1h-1zM14 13h1v1h-1zM1 14h1v1h-1zM2 14h1v1h-1zM13 14h1v1h-1zM14 14h1v1h-1z" fill="#000000"/>
        </svg>
    `;

    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'media-container';
    mediaContainer.style.cssText = 'flex: 1; display: flex; align-items: center; justify-content: center; width: 100%; padding: 20px;';

    const filename = document.createElement('div');
    filename.className = 'filename';
    filename.style.cssText = 'color: white; text-align: center;';

    lightbox.appendChild(closeButton);
    lightbox.appendChild(mediaContainer);
    lightbox.appendChild(filename);

    document.body.appendChild(lightbox);

    let interval;
    let currentFileName = '';

    const closeLightbox = () => {
        if (interval) {
            clearInterval(interval);
        }
        lightbox.remove();
    };

    closeButton.onclick = closeLightbox;

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    async function updateLatestMedia() {
        try {
            const response = await callAPI('list-media-files', localStorage.getItem('apiToken'), 'GET');

            if (response.files && response.files.length > 0) {
                const sortedFiles = response.files.sort((a, b) => {
                    const aTime = a.name.match(/\d+/)?.[0] || 0;
                    const bTime = b.name.match(/\d+/)?.[0] || 0;
                    return bTime - aTime;
                });

                const latestFile = sortedFiles[0];

                if (currentFileName !== latestFile.name) {
                    currentFileName = latestFile.name;
                    const fileExtension = latestFile.name.split('.').pop().toLowerCase();
                    const timestamp = Date.now();

                    mediaContainer.innerHTML = '';
                    filename.textContent = latestFile.name;

                    if (['gif', 'jpg', 'png'].includes(fileExtension)) {
                        const img = document.createElement('img');

                        img.src = `/output/${latestFile.name}?cb=${timestamp}`;
                        img.alt = latestFile.name;

                        mediaContainer.appendChild(img);
                    } else if (['mp4'].includes(fileExtension)) {
                        const videoContainer = document.createElement('div');

                        const video = document.createElement('video');

                        video.controls = true;
                        video.autoplay = true;
                        video.style.cssText = `
                            max-width: 90%;
                            max-height: 80vh;
                            width: auto;
                            height: auto;
                            display: block;
                            margin: auto;
                        `;

                        const source = document.createElement('source');
                        source.src = `/output/${latestFile.name}?cb=${timestamp}`;
                        source.type = 'video/mp4';

                        video.appendChild(source);
                        videoContainer.appendChild(video);
                        mediaContainer.appendChild(videoContainer);
                    }
                }
            } else {
                mediaContainer.innerHTML = '<div style="color: white;">No media files available</div>';
            }
        } catch (error) {
            console.error('Error fetching latest media:', error);
            mediaContainer.innerHTML = '<div style="color: white;">Error loading media</div>';
        }
    }

    updateLatestMedia();

    interval = setInterval(updateLatestMedia, 5000);

    window.addEventListener('beforeunload', closeLightbox);
}

function displayLightbox(mediaSrc) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';

    const filename = mediaSrc.split('/').pop().split('?')[0];

    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${mediaSrc}" alt="Enlarged media">
            <p class="lightbox-filename">${filename}</p>
            <button class="close-lightbox">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M1 1h1v1h-1zM2 1h1v1h-1zM13 1h1v1h-1zM14 1h1v1h-1zM1 2h1v1h-1zM2 2h1v1h-1zM13 2h1v1h-1zM14 2h1v1h-1zM3 3h1v1h-1zM4 3h1v1h-1zM11 3h1v1h-1zM12 3h1v1h-1zM3 4h1v1h-1zM4 4h1v1h-1zM11 4h1v1h-1zM12 4h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM9 5h1v1h-1zM10 5h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM9 6h1v1h-1zM10 6h1v1h-1zM7 7h1v1h-1zM8 7h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM5 9h1v1h-1zM6 9h1v1h-1zM9 9h1v1h-1zM10 9h1v1h-1zM5 10h1v1h-1zM6 10h1v1h-1zM9 10h1v1h-1zM10 10h1v1h-1zM3 11h1v1h-1zM4 11h1v1h-1zM11 11h1v1h-1zM12 11h1v1h-1zM3 12h1v1h-1zM4 12h1v1h-1zM11 12h1v1h-1zM12 12h1v1h-1zM1 13h1v1h-1zM2 13h1v1h-1zM13 13h1v1h-1zM14 13h1v1h-1zM1 14h1v1h-1zM2 14h1v1h-1zM13 14h1v1h-1zM14 14h1v1h-1z" fill="#000000"/>
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

        const content = await response.text();

        const preElement = document.createElement('pre');
        preElement.textContent = `[Generated with AI] ${content.trim()}`;
        container.appendChild(preElement);
    } catch (error) {
        console.error('Error fetching text file:', error);

        container.innerHTML = `<p>Error reading ${escapeHTML(file.public)}: ${escapeHTML(error.message)}</p>`;
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
        const outputContent = document.getElementById('output-content');
        const evalWidget = document.getElementById('eval-widget');

        if (!outputWidget || !evalWidget) {
            console.error('Output or eval widget not found in the DOM.');
            return;
        }

        outputContent.innerHTML = '';
        evalWidget.innerHTML = '';

        let hasOutput = false;

        const sortedFiles = data.sort((a, b) => {
            const typeOrder = {
                'image/gif': 1,
                'image/jpeg': 1,
                'image/png': 1,
                'text/plain': 2,
                'audio/x-wav': 3
            };

            const getTypeOrder = (type) => {
                if (type.startsWith('text/')) {
                    return 2;
                }
                return typeOrder[type] || 99;
            };

            return getTypeOrder(a.type) - getTypeOrder(b.type);
        });

        for (const file of sortedFiles) {
            if (!file.public || !file.type) {
                continue;
            }

            const sanitizedPublicPath = encodeURI(file.public);

            if (file.type.startsWith('text/') && file.public.endsWith('output.txt')) {
                await fetchAndDisplayTextFile({...file, public: sanitizedPublicPath}, outputContent);
                hasOutput = true;
            } else if (file.type === 'audio/x-wav' && file.public.endsWith('output.wav')) {
                displayAudioFile({...file, public: sanitizedPublicPath}, outputContent);
                hasOutput = true;
            }
        }

        if (!hasOutput) {
            outputContent.innerHTML = 'No output available.';
            evalWidget.innerHTML = 'No eval_data.json available';
        } else {
            outputWidget.classList.add('text-file-output');
        }

        evalWidget.innerHTML = `<pre>${escapeHTML(JSON.stringify(data, null, 2))}</pre>`;
    } catch (error) {
        console.error('Error in fetchEvalData:', error);
        const evalWidget = document.getElementById('eval-widget');

        if (evalWidget) {
            evalWidget.innerHTML = `Could not load eval_data.json: ${escapeHTML(error.message)}`;
        }
    } finally {
        isFetchingEvalData = false;
    }
}

async function fetchHooks(apiToken) {
    try {
        const data = await callAPI('hooks', apiToken, 'GET');
        renderHooks(data.hooks);

        const frontpageHooks = getFrontpageHooks(data.hooks);
        const inputHooksDiv = document.getElementById('input-hooks');
        inputHooksDiv.innerHTML = '';

        const updateIconSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path d="M0 0h1v1h-1zM1 0h1v1h-1zM2 0h1v1h-1zM3 0h1v1h-1zM4 0h1v1h-1zM5 0h1v1h-1zM6 0h1v1h-1zM7 0h1v1h-1zM8 0h1v1h-1zM9 0h1v1h-1zM10 0h1v1h-1zM11 0h1v1h-1zM12 0h1v1h-1zM13 0h1v1h-1zM14 0h1v1h-1zM15 0h1v1h-1zM0 1h1v1h-1zM1 1h1v1h-1zM2 1h1v1h-1zM3 1h1v1h-1zM4 1h1v1h-1zM5 1h1v1h-1zM6 1h1v1h-1zM7 1h1v1h-1zM8 1h1v1h-1zM9 1h1v1h-1zM10 1h1v1h-1zM11 1h1v1h-1zM12 1h1v1h-1zM13 1h1v1h-1zM14 1h1v1h-1zM15 1h1v1h-1zM0 2h1v1h-1zM1 2h1v1h-1zM4 2h1v1h-1zM5 2h1v1h-1zM6 2h1v1h-1zM7 2h1v1h-1zM10 2h1v1h-1zM11 2h1v1h-1zM14 2h1v1h-1zM15 2h1v1h-1zM0 3h1v1h-1zM1 3h1v1h-1zM4 3h1v1h-1zM5 3h1v1h-1zM6 3h1v1h-1zM7 3h1v1h-1zM10 3h1v1h-1zM11 3h1v1h-1zM14 3h1v1h-1zM15 3h1v1h-1zM0 4h1v1h-1zM1 4h1v1h-1zM4 4h1v1h-1zM5 4h1v1h-1zM6 4h1v1h-1zM7 4h1v1h-1zM10 4h1v1h-1zM11 4h1v1h-1zM14 4h1v1h-1zM15 4h1v1h-1zM0 5h1v1h-1zM1 5h1v1h-1zM4 5h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM7 5h1v1h-1zM10 5h1v1h-1zM11 5h1v1h-1zM14 5h1v1h-1zM15 5h1v1h-1zM0 6h1v1h-1zM1 6h1v1h-1zM4 6h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM7 6h1v1h-1zM8 6h1v1h-1zM9 6h1v1h-1zM10 6h1v1h-1zM11 6h1v1h-1zM14 6h1v1h-1zM15 6h1v1h-1zM0 7h1v1h-1zM1 7h1v1h-1zM4 7h1v1h-1zM5 7h1v1h-1zM6 7h1v1h-1zM7 7h1v1h-1zM8 7h1v1h-1zM9 7h1v1h-1zM10 7h1v1h-1zM11 7h1v1h-1zM14 7h1v1h-1zM15 7h1v1h-1zM0 8h1v1h-1zM1 8h1v1h-1zM14 8h1v1h-1zM15 8h1v1h-1zM0 9h1v1h-1zM1 9h1v1h-1zM14 9h1v1h-1zM15 9h1v1h-1zM0 10h1v1h-1zM1 10h1v1h-1zM14 10h1v1h-1zM15 10h1v1h-1zM0 11h1v1h-1zM1 11h1v1h-1zM14 11h1v1h-1zM15 11h1v1h-1zM0 12h1v1h-1zM1 12h1v1h-1zM14 12h1v1h-1zM15 12h1v1h-1zM0 13h1v1h-1zM1 13h1v1h-1zM14 13h1v1h-1zM15 13h1v1h-1zM0 14h1v1h-1zM1 14h1v1h-1zM2 14h1v1h-1zM3 14h1v1h-1zM4 14h1v1h-1zM5 14h1v1h-1zM6 14h1v1h-1zM7 14h1v1h-1zM8 14h1v1h-1zM9 14h1v1h-1zM10 14h1v1h-1zM11 14h1v1h-1zM12 14h1v1h-1zM13 14h1v1h-1zM14 14h1v1h-1zM15 14h1v1h-1zM0 15h1v1h-1zM1 15h1v1h-1zM2 15h1v1h-1zM3 15h1v1h-1zM4 15h1v1h-1zM5 15h1v1h-1zM6 15h1v1h-1zM7 15h1v1h-1zM8 15h1v1h-1zM9 15h1v1h-1zM10 15h1v1h-1zM11 15h1v1h-1zM12 15h1v1h-1zM13 15h1v1h-1zM14 15h1v1h-1zM15 15h1v1h-1z" fill="#000000"/>
            </svg>
        `;

        frontpageHooks.forEach(hook => {
            const hookDiv = document.createElement('div');
            hookDiv.className = 'input-hook-frontpage';

            const hookName = hook.hook_name;
            const hookType = hook.hook_type;

            const findVariables = (script) => {
                const variables = new Map();
                const patterns = [
                    /([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*"([^"]*)"/g,
                    /([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*'([^']*)'/g,
                    /([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*"""([^"]*)"""/g,
                    /([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*'''([^']*)'''/g,
                    /export\s+([A-Z_][A-Z0-9_]*)\s*=\s*"([^"]*)"/g,
                    /export\s+([A-Z_][A-Z0-9_]*)\s*=\s*'([^']*)'/g,
                    /([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^"'\s\n;]+)/g
                ];

                patterns.forEach(pattern => {
                    let match;
                    while ((match = pattern.exec(script)) !== null) {
                        if (!variables.has(match[1])) {
                            variables.set(match[1], match[2]);
                        }
                    }
                });

                return Array.from(variables.entries()).map(([name, value]) => ({
                    name,
                    value
                }));
            };

            const variables = findVariables(hook.hook_script);

            let hookHTML = `
                <form class="variables-container">
                    ${variables.length > 0 ? variables.map(variable => `
                        <div class="variable-input">
                            <div class="connection-point" data-node-type="hook" 
                                 data-node-id="${(hookName + '-' + variable.name).toLowerCase()}"></div>
                            <label>@${hookName}/${variable.name}</label>
                            <input type="text" 
                                   data-variable="${variable.name}" 
                                   value="${variable.value}"
                                   placeholder="Enter value for ${variable.name}"
                                   required>
                        </div>
                    `).join('') : `
                        <div class="variable-input">
                            <div class="disabled-connection-point" data-node-type="hook" 
                                 data-node-id="${(hookName + '-no-variable').toLowerCase()}"></div>
                            <label>@${hookName}</label>
                            <input type="text" disabled placeholder="No variables available.">
                        </div>
                    `}
                    ${variables.length > 0 ? `
                        <div class="variable-actions">
                            <button type="submit" class="update-hook" title="Update hook">${updateIconSvg}</button>
                        </div>` : ''}
                </form>
            `;

            hookDiv.innerHTML = hookHTML;
            inputHooksDiv.appendChild(hookDiv);

            const form = hookDiv.querySelector('form');
            const updateButton = form.querySelector('.update-hook');
            const inputs = form.querySelectorAll('input[data-variable]');

            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                if (form.classList.contains('updating')) {
                    return;
                }

                try {
                    form.classList.add('updating');
                    updateButton.disabled = true;
                    inputs.forEach(input => input.disabled = true);

                    let modifiedScript = hook.hook_script;

                    inputs.forEach(input => {
                        const varName = input.dataset.variable;
                        const varValue = input.value.trim();
                        const isNumeric = !isNaN(varValue) && !isNaN(parseFloat(varValue));

                        let regex = new RegExp(`${varName}\\s*=\\s*["'].*?["']|${varName}\\s*=\\s*[^\\s;]+`, 'g');

                        modifiedScript = modifiedScript.replace(regex, `${varName}=${isNumeric ? varValue : `"${varValue}"`}`
                        );
                    });

                    await updateExistingHook(hook.id, {
                        ...hook,
                        hook_script: modifiedScript
                    });

                    await new Promise(resolve => setTimeout(resolve, 100));

                    showStatus('Hook updated successfully!', true);
                } catch (error) {
                    console.error('Error updating hook:', error);
                } finally {
                    form.classList.remove('updating');
                    updateButton.disabled = false;
                    inputs.forEach(input => input.disabled = false);
                }
            });
        });
    } catch (error) {
        console.error('Fetch error:', error);
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

function isAuthenticated() {
    const apiToken = localStorage.getItem('apiToken');
    return !!apiToken;
}

async function fetchSchedule() {
    if (!isAuthenticated()) {
        console.debug('Schedule fetch attempted before authentication');
        return;
    }

    const apiToken = localStorage.getItem('apiToken');

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

function getFrontpageHooks(hooks) {
    /**
     * Filters an array of hooks and returns only those with show_on_frontpage set to true
     *
     * @param {Array} hooks - Array of hook objects
     * @returns {Array} - Filtered array of hooks that should show on frontpage
     *
     * Example hook object structure:
     * {
     *   id: string,
     *   hook_name: string,
     *   hook_type: string,
     *   hook_placement: string,
     *   hook_script: string,
     *   show_on_frontpage: boolean
     * }
     */
    if (!Array.isArray(hooks)) {
        console.error('getFrontpageHooks expects an array of hooks');
        return [];
    }

    return hooks.filter(hook => {
        if (!hook || typeof hook !== 'object') {
            console.warn('Invalid hook object found:', hook);
            return false;
        }

        return hook.show_on_frontpage === true;
    });
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
                listMediaFiles();
                localStorage.removeItem('buildStatus');
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

function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'none';

    const abortButton = document.getElementById('abort-build-button');

    if (abortButton) {
        abortButton.style.display = 'none';
        abortButton.disabled = true;
    }
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

function initializeHookScriptEditor() {
    const hookScriptContainer = document.getElementById('hook-script');
    if (!hookScriptContainer) {
        console.error('Hook script container not found');
        return;
    }

    if (window.hookScriptEditor) {
        const editor = window.hookScriptEditor;
        setTimeout(() => {
            editor.layout();
            const contentHeight = Math.max(200, Math.min(600, editor.getContentHeight()));
            hookScriptContainer.style.height = `${contentHeight}px`;
        }, 0);
        return;
    }

    hookScriptContainer.innerHTML = '';
    hookScriptContainer.style.backgroundColor = '#060c4d';
    hookScriptContainer.classList.add('editor-loading');

    hookScriptContainer.addEventListener('wheel', () => {
        editor.layout();
    }, {passive: true});

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

    monaco.editor.setTheme('flatpack');

    const editor = monaco.editor.create(hookScriptContainer, {
        accessibilitySupport: 'off',
        autoIndent: 'advanced',
        automaticLayout: true,
        bracketPairColorization: {
            enabled: true
        },
        hideCursorInOverviewRuler: true,
        language: 'python',
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
        value: '',
        wordWrap: 'on',
        wrappingIndent: 'same',
        wrappingStrategy: 'advanced'
    });

    window.hookScriptEditor = editor;

    const updateHeight = () => {
        const contentHeight = Math.max(200, Math.min(600, editor.getContentHeight()));
        hookScriptContainer.style.height = `${contentHeight}px`;
        editor.layout();
    };

    editor.onDidContentSizeChange(updateHeight);
    updateHeight();

    hookScriptContainer.classList.remove('editor-loading');
}

document.querySelector('.tab[data-tab="hooks"]').addEventListener('click', () => {
    const hookScriptContainer = document.getElementById('hook-script');

    if (hookScriptContainer) {
        hookScriptContainer.style.backgroundColor = '#060c4d';
    }

    if (window.monaco) {
        initializeHookScriptEditor();
    } else {
        require.config({paths: {'vs': 'node_modules/monaco-editor/min/vs'}});
        require(['vs/editor/editor.main'], () => {
            initializeHookScriptEditor();
        });
    }
});

function initializeMonacoEditorForExistingBlocks() {
    const blocks = document.querySelectorAll('.part-python, .part-bash');

    blocks.forEach(block => {
        const editorContainer = block.querySelector('.editor-wrapper > div');

        if (editorContainer) {
            const uniqueId = block.id;
            const language = block.classList.contains('part-python') ? 'python' : 'shell';
            const initialValue = editorContainer.textContent.trim() || `// Enter your ${language} code here...`;

            editorContainer.textContent = '';

            require.config({paths: {'vs': 'node_modules/monaco-editor/min/vs'}});

            require(['vs/editor/editor.main'], function () {
                editorContainer.addEventListener('wheel', () => {
                    editor.layout();
                }, {passive: true});

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
                    readOnly: false,
                    wordWrap: 'on',
                    wrappingIndent: 'same',
                    wrappingStrategy: 'advanced'
                });

                editor.setValue(initialValue);

                const updateHeight = () => {
                    const contentHeight = Math.max(100, Math.min(1000, editor.getContentHeight()));
                    editorContainer.style.height = `${contentHeight}px`;
                    editor.layout();
                };

                editor.onDidContentSizeChange(updateHeight);
                updateHeight();

                editorContainer._monaco = editor;
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
            loadDefaultFile(apiToken),
            fetchComments(apiToken),
            fetchHooks(apiToken),
            loadAndRenderSources(apiToken)
        ]);

        await new Promise(resolve => setTimeout(resolve, 150));

        window.lineDrawing = setupLineDrawing();

        const activeTab = localStorage.getItem('activeTab') || 'board';

        if (activeTab === 'board') {
            listMediaFiles(apiToken);
        }

        await Promise.all([
            fetchLatestLogs(apiToken),
            fetchSchedule(apiToken),
            loadEvalAndOutputFiles(apiToken)
        ]);

        window.initialLoadComplete = true;

        initBuildStatusCheck();
        setInterval(() => checkHeartbeat(apiToken), 5000);

    } catch (error) {
        console.error('Error initializing app:', error);
        if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
            showStatus('Network error. Please check your connection and try again.', false);
        } else {
            showStatus('Failed to initialize app. Please try again.', false);
        }
    }
}

async function listMediaFiles() {
    try {
        const mediaListContainer = document.getElementById('media-list-container');
        const response = await callAPI('list-media-files', localStorage.getItem('apiToken'), 'GET');

        if (!mediaListContainer) return;

        mediaListContainer.innerHTML = '';

        const validExtensions = ['gif', 'jpg', 'png', 'mp4'];
        const validFiles = response.files.filter(file => {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            return validExtensions.includes(fileExtension);
        });

        if (!validFiles.length) {
            mediaListContainer.style.display = 'none';
            return;
        }

        mediaListContainer.style.display = 'block';

        mediaListContainer.innerHTML = `
            <div id="gallery-header">
                <div id="latest-media-button">Play</div>
                <div class="media-count">Media: ${validFiles.length}</div>
            </div>
            <div class="gallery"></div>
            ${validFiles.length > 9 ? `
                <div class="gallery-controls">
                    <button id="show-more-button" class="gallery-control-button">
                        Show all (${validFiles.length - 9} more)
                    </button>
                </div>
            ` : ''}
        `;

        document.getElementById('latest-media-button')?.addEventListener('click', displayLatestMediaLightbox);

        const gallery = mediaListContainer.querySelector('.gallery');
        const showMoreButton = document.getElementById('show-more-button');

        let masonryInstance = null;

        async function updateContainerHeight() {
            const items = gallery.querySelectorAll('.gallery-item');
            let maxHeight = 0;
            items.forEach(item => {
                const bottom = item.offsetTop + item.offsetHeight;
                maxHeight = Math.max(maxHeight, bottom);
            });
            gallery.style.height = `${maxHeight}px`;
        }

        async function initializeMasonry() {
            if (isLayoutInProgress) return;
            isLayoutInProgress = true;

            try {
                if (masonryInstance) masonryInstance.destroy();
                const itemWidth = calculateItemWidth();
                gallery.querySelectorAll('.gallery-item').forEach(item => {
                    item.style.width = `${itemWidth}px`;
                    item.style.transition = 'none';
                });

                await Promise.all(Array.from(gallery.getElementsByTagName('img')).map(img => new Promise(resolve => {
                    if (img.complete) resolve();
                    else {
                        img.onload = resolve;
                        img.onerror = resolve;
                    }
                })));

                masonryInstance = new Masonry(gallery, MASONRY_CONFIG);

                requestAnimationFrame(() => {
                    masonryInstance.layout();
                });
            } finally {
                isLayoutInProgress = false;
            }
        }

        function calculateItemWidth() {
            const containerWidth = gallery.parentElement.offsetWidth;
            const gutterWidth = 20;
            const minItemWidth = 200;
            const columns = Math.max(1, Math.floor(containerWidth / minItemWidth));
            return (containerWidth - (gutterWidth * (columns - 1))) / columns;
        }

        function createGalleryItem(file) {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const imageExtensions = ['gif', 'jpg', 'png'];
            const videoExtensions = ['mp4'];

            if (!imageExtensions.includes(fileExtension) && !videoExtensions.includes(fileExtension)) return null;

            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.style.opacity = '0';
            galleryItem.style.transition = 'none';

            if (imageExtensions.includes(fileExtension)) {
                galleryItem.innerHTML = `
            <div class="media-container">
                <a href="/output/${file.name}" download="${file.name}" class="download-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M7 0h1v1h-1zM8 0h1v1h-1zM7 1h1v1h-1zM8 1h1v1h-1zM7 2h1v1h-1zM8 2h1v1h-1zM7 3h1v1h-1zM8 3h1v1h-1zM7 4h1v1h-1zM8 4h1v1h-1zM7 5h1v1h-1zM8 5h1v1h-1zM3 6h1v1h-1zM4 6h1v1h-1zM7 6h1v1h-1zM8 6h1v1h-1zM11 6h1v1h-1zM12 6h1v1h-1zM3 7h1v1h-1zM4 7h1v1h-1zM7 7h1v1h-1zM8 7h1v1h-1zM11 7h1v1h-1zM12 7h1v1h-1zM5 8h1v1h-1zM6 8h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM9 8h1v1h-1zM10 8h1v1h-1zM5 9h1v1h-1zM6 9h1v1h-1zM7 9h1v1h-1zM8 9h1v1h-1zM9 9h1v1h-1zM10 9h1v1h-1zM7 10h1v1h-1zM8 10h1v1h-1zM7 11h1v1h-1zM8 11h1v1h-1zM0 12h1v1h-1zM1 12h1v1h-1zM14 12h1v1h-1zM15 12h1v1h-1zM0 13h1v1h-1zM1 13h1v1h-1zM14 13h1v1h-1zM15 13h1v1h-1zM0 14h1v1h-1zM1 14h1v1h-1zM2 14h1v1h-1zM3 14h1v1h-1zM4 14h1v1h-1zM5 14h1v1h-1zM6 14h1v1h-1zM7 14h1v1h-1zM8 14h1v1h-1zM9 14h1v1h-1zM10 14h1v1h-1zM11 14h1v1h-1zM12 14h1v1h-1zM13 14h1v1h-1zM14 14h1v1h-1zM15 14h1v1h-1zM0 15h1v1h-1zM1 15h1v1h-1zM2 15h1v1h-1zM3 15h1v1h-1zM4 15h1v1h-1zM5 15h1v1h-1zM6 15h1v1h-1zM7 15h1v1h-1zM8 15h1v1h-1zM9 15h1v1h-1zM10 15h1v1h-1zM11 15h1v1h-1zM12 15h1v1h-1zM13 15h1v1h-1zM14 15h1v1h-1zM15 15h1v1h-1z" fill="#060c4d"/></svg>
                </a>
                <img data-src="/output/${file.name}?cb=${Date.now()}" alt="${file.name}" loading="lazy">
            </div>
        `;
                const img = galleryItem.querySelector('img');
                img.addEventListener('click', () => displayLightbox(`/output/${file.name}?cb=${Date.now()}`));
            } else if (videoExtensions.includes(fileExtension)) {
                galleryItem.innerHTML = `
            <div class="media-container">
                <a href="/output/${file.name}" download="${file.name}" class="download-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M7 0h1v1h-1zM8 0h1v1h-1zM7 1h1v1h-1zM8 1h1v1h-1zM7 2h1v1h-1zM8 2h1v1h-1zM7 3h1v1h-1zM8 3h1v1h-1zM7 4h1v1h-1zM8 4h1v1h-1zM7 5h1v1h-1zM8 5h1v1h-1zM3 6h1v1h-1zM4 6h1v1h-1zM7 6h1v1h-1zM8 6h1v1h-1zM11 6h1v1h-1zM12 6h1v1h-1zM3 7h1v1h-1zM4 7h1v1h-1zM7 7h1v1h-1zM8 7h1v1h-1zM11 7h1v1h-1zM12 7h1v1h-1zM5 8h1v1h-1zM6 8h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM9 8h1v1h-1zM10 8h1v1h-1zM5 9h1v1h-1zM6 9h1v1h-1zM7 9h1v1h-1zM8 9h1v1h-1zM9 9h1v1h-1zM10 9h1v1h-1zM7 10h1v1h-1zM8 10h1v1h-1zM7 11h1v1h-1zM8 11h1v1h-1zM0 12h1v1h-1zM1 12h1v1h-1zM14 12h1v1h-1zM15 12h1v1h-1zM0 13h1v1h-1zM1 13h1v1h-1zM14 13h1v1h-1zM15 13h1v1h-1zM0 14h1v1h-1zM1 14h1v1h-1zM2 14h1v1h-1zM3 14h1v1h-1zM4 14h1v1h-1zM5 14h1v1h-1zM6 14h1v1h-1zM7 14h1v1h-1zM8 14h1v1h-1zM9 14h1v1h-1zM10 14h1v1h-1zM11 14h1v1h-1zM12 14h1v1h-1zM13 14h1v1h-1zM14 14h1v1h-1zM15 14h1v1h-1zM0 15h1v1h-1zM1 15h1v1h-1zM2 15h1v1h-1zM3 15h1v1h-1zM4 15h1v1h-1zM5 15h1v1h-1zM6 15h1v1h-1zM7 15h1v1h-1zM8 15h1v1h-1zM9 15h1v1h-1zM10 15h1v1h-1zM11 15h1v1h-1zM12 15h1v1h-1zM13 15h1v1h-1zM14 15h1v1h-1zM15 15h1v1h-1z" fill="#060c4d"/></svg>
                </a>
                <video width="200" controls data-src="/output/${file.name}">
                    <source type="video/mp4">
                </video>
            </div>
        `;
            }

            return galleryItem;
        }

        async function loadMediaItem(element) {
            if (element.tagName.toLowerCase() === 'img') {
                element.src = element.dataset.src;
            } else if (element.tagName.toLowerCase() === 'video') {
                element.querySelector('source').src = element.dataset.src;
                element.load();
            }
        }

        async function renderGalleryItems(files, start, limit) {
            if (isLayoutInProgress) return;

            showLoadingOverlay('Loading media files...');
            isLayoutInProgress = true;

            try {
                if (start === 0) {
                    gallery.innerHTML = '';
                    if (masonryInstance) {
                        masonryInstance.destroy();
                        masonryInstance = null;
                    }
                }

                const fragment = document.createDocumentFragment();
                const itemsToLoad = files.slice(start, start + limit);

                itemsToLoad.forEach(file => {
                    const galleryItem = createGalleryItem(file);
                    if (galleryItem) {
                        fragment.appendChild(galleryItem);
                    }
                });

                gallery.appendChild(fragment);

                masonryInstance = new Masonry(gallery, MASONRY_CONFIG);

                const mediaElements = Array.from(gallery.querySelectorAll('[data-src]'));

                for (const element of mediaElements) {
                    await loadMediaItem(element);

                    const item = element.closest('.gallery-item');
                    const itemWidth = calculateItemWidth();
                    item.style.width = `${itemWidth}px`;

                    requestAnimationFrame(() => {
                        item.style.transition = 'opacity 0.2s ease-in-out';
                        item.style.opacity = '1';
                        if (masonryInstance) {
                            masonryInstance.layout();
                        }
                    });

                    await new Promise(resolve => setTimeout(resolve, 50));
                }

            } catch (error) {
                console.error('Error rendering gallery items:', error);
                showStatus('Error loading some media files. Please try refreshing.', false);
            } finally {
                isLayoutInProgress = false;
                const loadingOverlay = document.getElementById('loading-overlay');
                loadingOverlay.style.display = 'none';
            }
        }

        if (showMoreButton) {
            let currentCount = 0;

            showMoreButton.addEventListener('click', async event => {
                event.preventDefault();

                if (isLayoutInProgress) return;

                showMoreButton.disabled = true;

                try {
                    if (!isExpanded) {
                        await renderGalleryItems(validFiles, 9, validFiles.length - 9);
                        showMoreButton.textContent = 'Show less';
                        currentCount = validFiles.length;
                    } else {
                        gallery.innerHTML = '';
                        await renderGalleryItems(validFiles, 0, 9);
                        await initializeMasonry();

                        showMoreButton.textContent = `Show all (${validFiles.length - 9} more)`;
                        currentCount = 9;
                    }

                    if (isExpanded) gallery.scrollIntoView({behavior: 'smooth'});
                    isExpanded = !isExpanded;
                } finally {
                    showMoreButton.disabled = false;
                }
            });
        }

        await renderGalleryItems(validFiles, 0, 9);

        if (gallery.children.length > 0) {
            initializeMasonry();
        }

        const debouncedResize = debounce(() => {
            if (gallery.children.length > 0) initializeMasonry();
        }, 100);

        window.addEventListener('resize', debouncedResize);

    } catch (error) {
        console.error('Error listing media files:', error);
        showStatus('Error loading media files. Please try again.', false);
    }
}

async function loadAndRenderSources(apiToken) {
    try {
        const response = await callAPI('sources', apiToken, 'GET');
        if (!response || !response.sources) return;

        const inputData = document.getElementById('input-data');
        let sourcesList = inputData.querySelector('ul');

        if (sourcesList) {
            const lockedNodes = sourcesList.querySelectorAll('.node-lock');
            sourcesList.innerHTML = '';
            lockedNodes.forEach(node => sourcesList.appendChild(node));
        } else {
            sourcesList = inputData.ownerDocument.createElement('ul');
            inputData.appendChild(sourcesList);
        }

        if (Array.isArray(response.sources)) {
            response.sources.sort((a, b) => a.id - b.id);
            const fragment = inputData.ownerDocument.createDocumentFragment();
            for (let i = 0; i < response.sources.length; i++) {
                const source = response.sources[i];
                const li = inputData.ownerDocument.createElement('li');
                const nodeId = source.source_name.toLowerCase();

                li.setAttribute('data-source-id', source.id);

                li.innerHTML = `
                    <div class="node-content">
                        <div class="connection-point" data-node-type="source" data-node-id="${nodeId}"></div>
                        <span>${source.source_type} ${source.source_name}</span>
                        <div class="source-controls">
                            <button class="delete-source-button" title="Delete source">${editorTrashIcon}</button>
                        </div>
                    </div>
                `;

                const deleteButton = li.querySelector('.delete-source-button');

                if (deleteButton) {
                    deleteButton.addEventListener('click', async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const sourceId = li.getAttribute('data-source-id');
                        if (sourceId && confirm('Are you sure you want to delete this source?')) {
                            await deleteSource(sourceId);
                        }
                    });
                }
                fragment.appendChild(li);
            }
            sourcesList.appendChild(fragment);
        }
    } catch (error) {
        console.error('Error loading sources:', error);
        showStatus('Error loading sources', false);
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
        const json = await callAPI('load-file', apiToken, 'GET', {filename: 'custom.json'});

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
        editor.contentEditable = 'true';
        editor.textContent = code;
        editor.style.whiteSpace = 'pre-wrap';
        editor.style.pointerEvents = 'auto';

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

        const hookShowOnFrontpageElement = document.createElement('div');
        hookShowOnFrontpageElement.className = 'hook-show-on-frontpage';
        hookShowOnFrontpageElement.textContent = 'show_on_frontpage: ' + hook.show_on_frontpage || 'undefined';

        const hookPlacementElement = document.createElement('div');
        hookPlacementElement.className = 'hook-placement';
        hookPlacementElement.textContent = '-> ' + hook.hook_placement || 'undefined';

        const hookScriptElement = document.createElement('pre');
        hookScriptElement.className = 'hook-script';
        hookScriptElement.textContent = hook.hook_script || 'undefined';

        listItem.appendChild(hookLabelElement);
        listItem.appendChild(hookTypeContainer);
        listItem.appendChild(hookNameElement);
        listItem.appendChild(hookShowOnFrontpageElement);
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

        const response = await callAPI('save-file', apiToken, 'POST', formData, headers);

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
    if (!isAuthenticated()) {
        showStatus('Please authenticate before scheduling.', false);
        return;
    }

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

function setupLineDrawing() {
    if (!isAuthenticated()) return;

    const wrapper = document.getElementById('input-wrapper');
    if (!wrapper) return;

    let svg = wrapper.querySelector('svg.connection-lines');

    if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'connection-lines');
        Object.assign(svg.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
        });
        wrapper.appendChild(svg);
    }

    let firstSelected = null;
    let connections = [];
    let drawFrame = null;

    const token = localStorage.getItem('apiToken');

    function getCenter(node) {
        const wRect = wrapper.getBoundingClientRect();
        const nRect = node.getBoundingClientRect();
        return {
            x: (nRect.left - wRect.left) + nRect.width / 2,
            y: (nRect.top - wRect.top) + nRect.height / 2
        };
    }

    function createPath(start, end) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const curvature = 0.5;

        const hx1 = start.x + dx * curvature;
        const hy1 = start.y;
        const hx2 = end.x - dx * curvature;
        const hy2 = end.y;

        return `M ${start.x},${start.y} C ${hx1},${hy1} ${hx2},${hy2} ${end.x},${end.y}`;
    }

    async function loadConnections() {
        try {
            const data = await callAPI('source-hook-mappings', token, 'GET');

            const checkAndDrawConnections = () => {
                connections.forEach(c => c.path?.remove());
                connections = [];
                let foundAll = true;

                data.mappings?.forEach(m => {
                    const n1 = document.querySelector(`[data-node-id="${m.source_id}"]`);
                    const n2 = document.querySelector(`[data-node-id="${m.target_id}"]`);

                    if (!n1 || !n2) {
                        foundAll = false;
                        return;
                    }

                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.setAttribute('fill', 'none');
                    path.setAttribute('stroke', '#5865f2');
                    path.setAttribute('stroke-width', '2');
                    path.style.pointerEvents = 'auto';
                    path.style.cursor = 'pointer';

                    path.addEventListener('mouseenter', () => {
                        path.setAttribute('stroke-width', '4');
                        path.setAttribute('stroke', '#5865f2');
                    });

                    path.addEventListener('mouseleave', () => {
                        path.setAttribute('stroke-width', '2');
                        path.setAttribute('stroke', '#5865f2');
                    });

                    path.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        const conn = connections.find(c => c.path === path);
                        if (conn) {
                            try {
                                await callAPI(`source-hook-mappings/${conn.id}`, token, 'DELETE');
                                conn.path.remove();
                                connections = connections.filter(c => c !== conn);
                            } catch (e) {
                                console.error('Failed to delete connection:', e);
                                showStatus('Failed to delete connection: ' + e.message, false);
                            }
                        }
                    });

                    svg.appendChild(path);
                    connections.push({path, node1: n1, node2: n2, id: m.id});
                });

                if (foundAll) {
                    requestDraw();
                    if (checkInterval) {
                        clearInterval(checkInterval);
                        checkInterval = null;
                    }
                }
            };

            let checkInterval = setInterval(checkAndDrawConnections, 100);
            checkAndDrawConnections();

        } catch (e) {
            console.error('Load failed:', e);
        }
    }

    async function saveConnection(node1, node2) {
        try {
            const sourceNode = node1.dataset.nodeType === 'source' ? node1 : node2;
            const hookNode = node1.dataset.nodeType === 'hook' ? node1 : node2;

            if (sourceNode.dataset.nodeType !== 'source' || hookNode.dataset.nodeType !== 'hook') {
                console.error('Invalid connection: Must connect a source to a hook');
                return;
            }

            const currentConnections = connections
                .filter(conn =>
                    conn.node1.dataset.nodeId !== sourceNode.dataset.nodeId &&
                    conn.node2.dataset.nodeId !== hookNode.dataset.nodeId
                )
                .map(conn => ({
                    sourceId: conn.node1.dataset.nodeId,
                    targetId: conn.node2.dataset.nodeId,
                    sourceType: conn.node1.dataset.nodeType,
                    targetType: conn.node2.dataset.nodeType
                }));

            const newConnection = {
                sourceId: sourceNode.dataset.nodeId,
                targetId: hookNode.dataset.nodeId,
                sourceType: sourceNode.dataset.nodeType,
                targetType: hookNode.dataset.nodeType
            };

            const allConnections = [...currentConnections, newConnection];
            await callAPI('source-hook-mappings', token, 'POST', allConnections);
            await loadConnections();
        } catch (e) {
            console.error('Save failed:', e);
        }
    }

    function requestDraw() {
        drawFrame = drawFrame || requestAnimationFrame(() => {
            connections = connections.filter(c => {
                if (!document.contains(c.node1) || !document.contains(c.node2)) {
                    c.path.remove();
                    return false;
                }
                const start = getCenter(c.node1);
                const end = getCenter(c.node2);
                c.path.setAttribute('d', createPath(start, end));
                return true;
            });
            drawFrame = null;
        });
    }

    wrapper.addEventListener('click', async e => {
        const node = e.target.closest('.connection-point');

        if (!node) {
            if (firstSelected) {
                firstSelected.classList.remove('highlight');
                firstSelected = null;
            }
            return;
        }

        if (firstSelected === node) {
            return;
        }

        if (firstSelected && firstSelected !== node) {
            if (firstSelected.dataset.nodeType === node.dataset.nodeType) {
                showStatus(`Cannot connect two ${firstSelected.dataset.nodeType}s together.`, false);
                firstSelected.classList.remove('highlight');
                firstSelected = null;
                return;
            }

            const existingSourceConnection = connections.find(conn =>
                conn.node1.dataset.nodeId === firstSelected.dataset.nodeId ||
                conn.node1.dataset.nodeId === node.dataset.nodeId
            );

            const existingTargetConnection = connections.find(conn =>
                conn.node2.dataset.nodeId === firstSelected.dataset.nodeId ||
                conn.node2.dataset.nodeId === node.dataset.nodeId
            );

            if (existingTargetConnection) {
                showStatus('Target node already has a connection.', false);
                firstSelected.classList.remove('highlight');
                firstSelected = null;
                return;
            }

            if (existingSourceConnection) {
                try {
                    await callAPI(`source-hook-mappings/${existingSourceConnection.id}`, token, 'DELETE');
                    existingSourceConnection.path.remove();
                    connections = connections.filter(c => c !== existingSourceConnection);
                } catch (e) {
                    console.error('Failed to delete existing connection:', e);
                    showStatus('Failed to delete connection: ' + e.message, false);
                    return;
                }
            }

            await saveConnection(firstSelected, node);
            firstSelected.classList.remove('highlight');
            firstSelected = null;
        } else if (!firstSelected) {
            firstSelected = node;
            firstSelected.classList.add('highlight');
        }
    });

    const observer = new MutationObserver(requestDraw);
    observer.observe(wrapper, {childList: true, subtree: true});

    addEventListener('resize', requestDraw, {passive: true});
    addEventListener('scroll', requestDraw, {passive: true});

    loadConnections();

    return {
        loadConnections,
        destroy: () => {
            observer.disconnect();
            removeEventListener('resize', requestDraw);
            removeEventListener('scroll', requestDraw);
            connections.forEach(c => c.path?.remove());
            svg.remove();
        }
    };
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

    const controls = block.querySelectorAll('.move-up, .move-down, .delete-button');
    const commentButton = block.querySelector('.comment-button');

    const editor = block.querySelector('.editor');

    if (editor) {
        editor.contentEditable = 'true';
        editor.style.pointerEvents = 'auto';
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

let quotes = [
    "In the midst of chaos, there is also opportunity. - Sun Tzu"
];

function getRandomQuote() {
    if (quotes.length === 0) return "Loading...";
    return quotes[Math.floor(Math.random() * quotes.length)];
}

async function validateAndInitialize(apiToken) {
    const apiKeyModalElement = document.getElementById('api-key-modal');
    if (apiKeyModalElement) {
        apiKeyModalElement.style.display = 'none';
    } else {
        console.warn('API key modal element not found.');
    }

    showLoadingOverlay(getRandomQuote());

    try {
        if (typeof apiToken !== 'string' || apiToken.trim() === '') {
            console.error('No API token provided.');
            showStatus('Please enter a valid API token.', false);
            hideLoadingOverlay();
            if (apiKeyModalElement) apiKeyModalElement.style.display = 'flex';
            return false;
        }

        if (typeof callAPI !== 'function') {
            console.error('callAPI function is not defined.');
            showStatus('Internal error: Unable to validate API token.', false);
            hideLoadingOverlay();
            if (apiKeyModalElement) apiKeyModalElement.style.display = 'flex';
            return false;
        }

        const response = await callAPI('validate-token', apiToken, 'POST', {api_token: apiToken});

        if (response && response.message === 'API token is valid.') {
            try {
                localStorage.setItem('apiToken', apiToken);
            } catch (storageError) {
                console.error('Failed to store API token in localStorage:', storageError);
                showStatus('Error storing API token. Please check your browser settings.', false);
                hideLoadingOverlay();
                if (apiKeyModalElement) apiKeyModalElement.style.display = 'flex';
                return false;
            }

            if (typeof initializeApp !== 'function') {
                console.error('initializeApp function is not defined.');
                showStatus('Internal error: Unable to initialize the application.', false);
                hideLoadingOverlay();
                if (apiKeyModalElement) apiKeyModalElement.style.display = 'flex';
                return false;
            }

            try {
                await new Promise((resolve, reject) => {
                    if (window.monaco) {
                        resolve();
                    } else {
                        window.require.config({paths: {'vs': 'node_modules/monaco-editor/min/vs'}});
                        window.require(['vs/editor/editor.main'], () => {
                            if (window.monaco) {
                                resolve();
                            } else {
                                reject(new Error('Monaco editor failed to initialize'));
                            }
                        });
                    }
                });

                await initializeApp(apiToken);
                hideLoadingOverlay();
                return true;

            } catch (monacoError) {
                console.error('Failed to initialize Monaco editor:', monacoError);
                showStatus('Failed to initialize code editor. Please refresh the page.', false);
                hideLoadingOverlay();
                if (apiKeyModalElement) apiKeyModalElement.style.display = 'flex';
                return false;
            }
        } else {
            const errorMessage = response && response.message ? response.message : 'Unknown error';
            localStorage.removeItem('apiToken');
            showStatus(`Invalid API token: ${errorMessage}`, false);
            hideLoadingOverlay();
            if (apiKeyModalElement) apiKeyModalElement.style.display = 'flex';
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
        hideLoadingOverlay();
        if (apiKeyModalElement) apiKeyModalElement.style.display = 'flex';
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
    const hookScript = window.hookScriptEditor ? window.hookScriptEditor.getValue().trim() : '';
    const showOnFrontpage = document.getElementById('show-on-frontpage').checked;

    if (hookName && hookType && hookScript) {
        try {
            const svg = document.querySelector('.connector-svg');

            if (svg) {
                svg.style.visibility = 'hidden';
            }

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
                    hook_script: hookScript,
                    show_on_frontpage: showOnFrontpage
                })
            });

            if (response.ok) {
                await fetchHooks(apiToken);

                await new Promise(resolve => setTimeout(resolve, 50));

                showStatus('Hook added successfully!', true);
            } else {
                if (response.status === 409) {
                    showStatus(`A hook with the name "${hookName}" already exists. Please choose a different name.`, false);
                } else {
                    let errorMessage = 'An error occurred.';
                    try {
                        const data = await response.json();
                        if (data && data.detail) {
                            errorMessage = data.detail;
                        }
                    } catch (e) {
                    }
                    showStatus(`Error: ${errorMessage}`, false);
                }
            }

            if (svg) {
                svg.style.visibility = 'visible';
            }
        } catch (error) {
            console.error('Error adding hook:', error);
            showStatus(`Error: ${error.message}`, false);
        }
    } else {
        showStatus('Please fill in all fields.', false);
    }
});

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
            const hooks = await callAPI('hooks', apiToken, 'GET');
            await renderHooks(hooks.hooks);

            await new Promise(resolve => setTimeout(resolve, 50));

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

// Sources
async function addSource(sourceName, sourceType, sourceDetails = null) {
    if (!isAuthenticated()) {
        showStatus('Please authenticate before adding sources.', false);
        return;
    }

    const apiToken = localStorage.getItem('apiToken');
    const csrfToken = localStorage.getItem('csrfToken');
    const headers = {
        'Authorization': `Bearer ${apiToken}`,
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json'
    };

    const inputData = document.getElementById('input-data');
    const sourcesList = inputData.querySelector('ul');

    if (sourcesList) {
        const existingSources = sourcesList.querySelectorAll('li[data-source-id]');
        for (const source of existingSources) {
            const span = source.querySelector('span');
            if (span && span.textContent.includes(sourceName)) {
                showStatus('This source is already added.', false);
                return;
            }
        }
    }

    const sourceData = {
        source_name: sourceName,
        source_type: sourceType,
        source_details: sourceDetails
    };

    try {
        const response = await fetch(`${getBaseUrl()}/api/sources`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(sourceData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Server error: ${errorData.detail || response.statusText}`);
        }

        const responseData = await response.json();
        showStatus('Source added successfully!', true);

        if (sourcesList) {
            const li = document.createElement('li');
            const nodeId = sourceName.toLowerCase();
            li.setAttribute('data-source-id', responseData.id);
            li.innerHTML = `
                <div class="node-content">
                    <div class="connection-point" data-node-type="source" data-node-id="${nodeId}"></div>
                    <span>${sourceType} ${sourceName}</span>
                    <div class="source-controls">
                        <button class="delete-source-button" title="Delete source">
                            ${editorTrashIcon}
                        </button>
                    </div>
                </div>
            `;

            const deleteButton = li.querySelector('.delete-source-button');
            if (deleteButton) {
                deleteButton.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this source?')) {
                        try {
                            await deleteSource(responseData.id);
                            li.remove();
                        } catch (error) {
                            console.error('Error during source deletion:', error);
                        }
                    }
                });
            }

            sourcesList.appendChild(li);
        }

        return responseData;
    } catch (error) {
        console.error('Error adding source:', error);
        showStatus(`Error adding source: ${error.message}`, false);
        throw error;
    }
}

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

    createGPIOSelector(
        '#add-pin',
        [4, 5, 6, 12, 13, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27],
        function (selectedPin) {
            console.log(`You added GPIO ${selectedPin}`);
            addSource(`${selectedPin}`, 'GPIO', null);
        }
    );

    window.addEventListener('wheel', () => {
        resizeAllTextareas();
    }, {passive: true});

    document.getElementById('latest-media-button')?.addEventListener('click', displayLatestMediaLightbox);

    const outputWidget = document.getElementById('output-widget');
    const fullscreenButton = outputWidget.querySelector('.fullscreen-toggle-btn');

    if (fullscreenButton) {
        fullscreenButton.addEventListener('click', () => {
            outputWidget.classList.toggle('fullscreen');
        });
    }

    if (document.querySelector('.tab[data-tab="hooks"]')) {
        document.querySelector('.tab[data-tab="hooks"]').addEventListener('click', () => {
            setActiveTab(document.querySelector('.tab[data-tab="hooks"]'));

            const hookScriptContainer = document.getElementById('hook-script');
            if (hookScriptContainer) {
                hookScriptContainer.style.backgroundColor = '#060c4d';
            }

            if (window.monaco) {
                initializeHookScriptEditor();
            } else {
                require.config({paths: {'vs': 'node_modules/monaco-editor/min/vs'}});
                require(['vs/editor/editor.main'], () => {
                    initializeHookScriptEditor();
                });
            }
        });
    }

    const hookTypeSelect = document.getElementById('hook-type');

    if (hookTypeSelect) {
        hookTypeSelect.addEventListener('change', function (e) {
            if (window.hookScriptEditor) {
                const currentValue = window.hookScriptEditor.getValue();
                monaco.editor.setModelLanguage(
                    window.hookScriptEditor.getModel(),
                    e.target.value === 'python' ? 'python' : 'shell'
                );
                window.hookScriptEditor.setValue(currentValue);
            }
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

        if (tab.dataset.tab === 'board') {
            if (window.initialLoadComplete) {
                listMediaFiles();

                if (window.lineDrawing && typeof window.lineDrawing.loadConnections === 'function') {
                    window.lineDrawing.loadConnections();
                } else {
                    window.lineDrawing = setupLineDrawing();
                }
            }
        }
    };

    if (boardTab) {
        boardTab.addEventListener('click', () => {
            setActiveTab(boardTab);
        });
    } else {
        console.error('Board tab element not found.');
    }

    if (editorTab) {
        editorTab.addEventListener('click', () => setActiveTab(editorTab));
    } else {
        console.error('Editor tab element not found.');
    }

    if (hooksTab) {
        hooksTab.addEventListener('click', () => {
            setActiveTab(hooksTab);
            if (window.monaco) {
                initializeHookScriptEditor();
            } else {
                window.require.config({paths: {'vs': 'node_modules/monaco-editor/min/vs'}});
                window.require(['vs/editor/editor.main'], () => {
                    initializeHookScriptEditor();
                });
            }
        });
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

    window.require.config({paths: {'vs': 'node_modules/monaco-editor/min/vs'}});

    window.require(['vs/editor/editor.main'], () => {
        if (document.querySelector('.tab[data-tab="hooks"]').classList.contains('active')) {
            initializeHookScriptEditor();
        }
    });

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
});