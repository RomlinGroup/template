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
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 3h10v7H5l-2 2V3z" stroke="#31efb8" stroke-width="1" fill="none"/>
</svg>`;

const arrowDownIcon = `
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 4v6.5 M5 8l3 3 3-3" stroke="#5865f2" stroke-width="1" fill="none" stroke-linecap="square"/>
</svg>`;

const arrowUpIcon = `
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 12V5.5 M5 8l3-3 3 3" stroke="#5865f2" stroke-width="1" fill="none" stroke-linecap="square"/>
</svg>`;

const crossedEyeIcon = `
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 8c2-3 5-3 6-3s4 0 6 3c-2 3-5 3-6 3s-4 0-6-3z" stroke="#5865f2" stroke-width="1" fill="none" stroke-linejoin="miter" stroke-linecap="butt"/>
  <circle cx="8" cy="8" r="2" stroke="#5865f2" stroke-width="1" fill="none"/>
  <line x1="2" y1="2" x2="14" y2="14" stroke="#5865f2" stroke-width="1"/>
</svg>`;

const editorTrashIcon = `
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 4h8 M5 4v8h6V4 M8 6v4" stroke="#5865f2" stroke-width="1" fill="none"/>
  <path d="M6 2h4" stroke="#5865f2" stroke-width="1" fill="none"/>
</svg>`;

const hooksTrashIcon = `
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 4h8 M5 4v8h6V4 M8 6v4" stroke="#060c4d" stroke-width="1" fill="none"/>
  <path d="M6 2h4" stroke="#060c4d" stroke-width="1" fill="none"/>
</svg>`;

const minusIcon = `
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="5" width="10" height="2" fill="#ff8d80"/>
</svg>`;

const regularEyeIcon = `
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 8c2-3 5-3 6-3s4 0 6 3c-2 3-5 3-6 3s-4 0-6-3z" stroke="#5865f2" stroke-width="1" fill="none" stroke-linejoin="miter" stroke-linecap="butt"/>
  <circle cx="8" cy="8" r="2" stroke="#5865f2" stroke-width="1" fill="none"/>
</svg>`;

let buildStatusInterval;
let consecutiveErrors = 0;
let currentPart = 1;
let currentStepIndex = -1;
let disconnectedCount = 0;
let highlightTimeout;
let initializationTimeout;
let isBuilding = false;
let lastStatus = '';
let lastStep = '';
let manualDatetimes = [];
let originalContent = '';

async function abortBuild(apiToken) {
    try {
        const response = await callAPI('abort-build', apiToken, 'POST');
        if (response.message === "Build process aborted successfully.") {
            showStatus('Build process aborted.', false);
            stopBuildStatusCheck();
            hideLoadingOverlay();
            enableInteractions();
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

    const editor = document.createElement('div');
    editor.className = 'editor';
    editor.contentEditable = true;
    editor.setAttribute('data-placeholder', `Enter your ${type} code here`);

    addEventListenersToEditor(editor);

    editorWrapper.appendChild(editor);

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

function checkAndFetchEvalData() {
    const evalDataFetched = localStorage.getItem('evalDataFetched');
    if (evalDataFetched === 'true') {
        fetchEvalData();
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
    const apiToken = localStorage.getItem('apiToken');

    if (!apiToken) {
        console.error('No API token found');
        return;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const data = await callAPI('build-status', apiToken, 'GET', null, controller.signal);
        clearTimeout(timeoutId);

        handleBuildStatus(data.status);
        consecutiveErrors = 0;

        if (data.status === 'completed' || data.status === 'failed') {
            await callAPI('clear-build-status', apiToken, 'POST');
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.warn('Build status check timed out');
        } else {
            console.error('Error checking build status:', error);
        }

        consecutiveErrors++;

        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
            handleBuildStatusError();
        } else {
            handleBuildStatus('unknown');
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
        handleDisconnection();
    }

    function handleDisconnection() {
        disconnectedCount++;

        if (disconnectedCount >= MAX_DISCONNECTED_COUNT) {
            setDisconnectedState();
        } else {
            heartbeatTime.textContent = 'Reconnecting';
            heartbeatDot.classList.remove('connected');
            heartbeatDot.classList.add('disconnected');
        }
    }

    function setDisconnectedState() {
        console.log('Connection lost. Resetting app state.');
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
        console.log(`Attempting to delete comment with ID: ${numericCommentId}`);
        console.log('Request headers:', headers);

        const response = await fetch(`${getBaseUrl()}/api/comments/${numericCommentId}`, {
            method: 'DELETE',
            headers: headers
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        const responseText = await response.text();
        console.log('Raw response:', responseText);

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

        console.log('Delete comment response:', responseData);
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

function enableInteractions() {
    document.querySelectorAll('button:not(#abort-build-button), .action, .editor').forEach(el => {
        el.removeAttribute('disabled');
        el.style.pointerEvents = 'auto';
    });
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

async function fetchEvalData() {
    try {
        const response = await fetch('/output/eval_data.json');
        if (response.ok) {
            const data = await response.json();
            console.log('Eval data:', data);

            const outputPath = data[0].public;
            console.log('Output path:', outputPath);

            const outputWidget = document.getElementById('output-widget');
            if (outputPath) {
                fetch(outputPath)
                    .then(response => response.text())
                    .then(content => {
                        const trimmedContent = content.trim();
                        outputWidget.innerHTML = `<pre>${trimmedContent}</pre>`;
                        outputWidget.classList.add('text-file-output');
                    })
                    .catch(error => {
                        console.error('Error fetching file:', error);
                        outputWidget.innerHTML = '<p>Error reading output.txt file.</p>';
                        outputWidget.classList.remove('text-file-output');
                    });
            } else {
                outputWidget.innerHTML = '<p>No output.txt file found.</p>';
            }

            evalWidget.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        } else {
            throw new Error('File not found');
        }
    } catch (error) {
        evalWidget.innerHTML = `<p>Could not load eval_data.json: ${error.message}</p>`;
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
            console.log('No log files found.');
            renderLogContent("No log files found.");
            showStatus('No log files found!', false);
        }
    } catch (error) {
        console.error('Error fetching log files:', error);
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
        console.log("No API token found, skipping schedule fetch");
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
        console.log("No log file selected");
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
        const data = await callAPI('output/eval_build.json', apiToken, 'GET');
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
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
            console.log(`Build in progress: ${step}`);
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
            fetchLatestLogs(apiToken),
            fetchSchedule(apiToken)
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

async function loadDefaultFile(apiToken) {
    try {
        const json = await callAPI('load_file', apiToken, 'GET', {filename: 'custom.sh'});

        if (json && json.content) {
            originalContent = json.content;
            renderFileContents(originalContent);
            resizeAllTextareas();

            document.querySelectorAll('.editor').forEach(editor => {
                addEventListenersToEditor(editor);
            });

        } else {
            throw new Error('Received invalid data structure from server');
        }
    } catch (error) {
        console.error('Error loading file:', error);

        if (error.message.includes('404')) {
            console.error('File not found. Please check if the file exists on the server.');
            showStatus('Error: File not found. Please contact support.', false);
        } else if (error.message.includes('403')) {
            console.error('Access forbidden. You may not have permission to access this file.');
            showStatus('Error: Access to file forbidden. Please contact support.', false);
        } else {
            showStatus('Error loading default file. Please try again later.', false);
        }

        originalContent = '';
        renderFileContents(originalContent);
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
        console.log('Comment added successfully:', responseData);
        return true;
    } catch (error) {
        console.error('Error in postComment:', error);
        throw new Error(`Failed to add comment: ${error.message}`);
    }
}

async function refreshCommentsFromBackend() {
    comments.length = 0;
    await fetchComments();
    renderComments();
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

function renderFileContents(contents) {
    const fileContentElement = document.getElementById('file-content');
    fileContentElement.innerHTML = '';

    const parts = contents.split(/((?:disabled )?part_[a-z]+ """[\s\S]*?""")/).filter(Boolean);
    parts.forEach(part => {
        const match = part.match(/(disabled )?(part_[a-z]+) """([\s\S]*?)"""/);
        if (match) {
            const isDisabled = !!match[1];
            const type = match[2];
            let code = match[3].trim();

            if (type === 'part_bash') {
                code = code.replace(/\\\$/g, '$');
            }

            const block = document.createElement('div');
            block.className = type.replace('_', '-');

            if (isDisabled) block.classList.add('disabled');

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
            editor.contentEditable = isDisabled ? 'false' : 'true';

            code = code.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');

            editor.innerHTML = code;
            editorWrapper.appendChild(editor);

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

            const toggleButton = createToggleButton(block);
            updateToggleButtonIcon(toggleButton, block);
            controls.appendChild(toggleButton);

            block.appendChild(controls);

            fileContentElement.appendChild(block);

            if (isDisabled) {
                block.classList.add('disabled');
                editor.contentEditable = 'false';
                editor.style.pointerEvents = 'none';
                const controls = block.querySelectorAll('.move-up, .move-down, .delete-button');
                controls.forEach(control => control.style.display = 'none');
                const commentButton = block.querySelector('.comment-button');
                if (commentButton) commentButton.style.display = 'none';
            }
        }
    });

    document.getElementById('file-content').classList.add('loaded');
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

        const hookScriptElement = document.createElement('pre');
        hookScriptElement.className = 'hook-script';
        hookScriptElement.textContent = hook.hook_script || 'undefined';

        listItem.appendChild(hookLabelElement);
        listItem.appendChild(hookTypeContainer);
        listItem.appendChild(hookNameElement);
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
    console.log("Resetting app state.");
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
    const parts = Array.from(document.querySelectorAll('.part-python, .part-bash'))
        .map(part => {
            const editor = part.querySelector('.editor');
            if (!editor) return null;

            let code = editor.innerText.trim().replace(/\n{3,}/g, '\n\n');
            if (!code) return null;

            const type = part.classList.contains('part-python') ? 'part_python' : 'part_bash';
            if (type === 'part_bash') code = code.replace(/\$/g, '\\$');

            return part.classList.contains('disabled')
                ? `disabled ${type} """\n${code}\n"""`
                : `${type} """\n${code}\n"""`;
        })
        .filter(Boolean)
        .join('\n');

    if (!parts) return;

    const formData = new FormData();
    formData.append('filename', 'custom.sh');
    formData.append('content', parts);

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
        console.log('Schedule saved successfully:', responseData);
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
    if (!buildStatusInterval) {
        buildStatusInterval = setInterval(checkBuildStatus, CHECK_INTERVAL);
    }
    checkBuildStatus();
    currentStepIndex = -1;
}

function stopBuildStatusCheck() {
    clearInterval(buildStatusInterval);
    buildStatusInterval = null;
    console.log('Stopped build status check');
}

function stripFormatting(e) {
    e.preventDefault();
    const text = (e.originalEvent || e).clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
}

function toggleBlock(block) {
    block.classList.toggle('disabled');
    const editor = block.querySelector('.editor');
    const controls = block.querySelectorAll('.move-up, .move-down, .delete-button');
    const commentButton = block.querySelector('.comment-button');

    if (block.classList.contains('disabled')) {
        editor.contentEditable = 'false';
        editor.style.pointerEvents = 'none';
        controls.forEach(control => control.style.display = 'none');
        commentButton.style.display = 'none';
    } else {
        editor.contentEditable = 'true';
        editor.style.pointerEvents = 'auto';
        controls.forEach(control => control.style.display = 'flex');
        commentButton.style.display = 'flex';
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

async function validateAndInitialize(apiToken) {
    try {
        if (!apiToken) {
            console.error("No API token provided.");
            alert("Please enter a valid API token.");
            return false;
        }

        const response = await callAPI('validate_token', apiToken, 'POST', {api_token: apiToken});

        console.log("API validation response:", response);

        if (response.message === 'API token is valid.') {
            console.log("API token is valid. Storing in localStorage.");
            localStorage.setItem('apiToken', apiToken);

            await initializeApp(apiToken);
            document.getElementById('api-key-modal').style.display = 'none';
            return true;
        } else {
            console.error('API token validation failed:', response.message);
            alert('API token validation failed. Please try again.');
            localStorage.removeItem('apiToken');
            return false;
        }
    } catch (error) {
        console.error('Error during API token validation:', error);

        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            alert('Network error. Please check your connection and try again.');
        } else if (error.message.includes('401')) {
            console.error('Unauthorized: Invalid API token.');
            alert('Please enter a valid API token.');
        } else {
            alert(`Failed to validate API token. ${error.message}`);
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
                    hook_script: hookScript
                })
            });

            if (response.ok) {
                const data = await response.json();
                await fetchHooks(apiToken);
                showStatus('Hook added successfully!', true);
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

document.addEventListener('DOMContentLoaded', function () {
    const abortButton = document.getElementById('abort-build-button');
    if (abortButton) {
        abortButton.addEventListener('click', function () {
            abortBuild();
        });
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const debouncedInitialization = debounce((apiToken) => {
        validateAndInitialize(apiToken);
    }, 500);

    apiKeySubmit.addEventListener('click', async () => {
        console.log('Validating the API token')

        const apiKey = apiKeyInput.value.trim();

        if (apiKey) {
            const isValid = await validateAndInitialize(apiKey);

            if (!isValid) {
                showApiKeyModal();
            }

        } else {
            alert('Please enter a valid API token.');
        }
    });

    const storedApiToken = localStorage.getItem('apiToken');

    if (storedApiToken) {
        await debouncedInitialization(storedApiToken);
        checkAndRestoreBuildStatus();
    } else {
        showApiKeyModal();
    }

    document.querySelectorAll('.editor').forEach(editor => {
        addEventListenersToEditor(editor);
        resizeEditor(editor);
    });

    const savedSidebarState = localStorage.getItem('commentSidebarState');

    if (savedSidebarState === 'shown') {
        commentSidebar.style.display = 'block';
    } else {
        commentSidebar.style.display = 'none';
    }

    // BEGIN Tabs
    const boardTab = document.querySelector('.tab[data-tab="board"]');
    const editorTab = document.querySelector('.tab[data-tab="editor"]');
    const hooksTab = document.querySelector('.tab[data-tab="hooks"]');
    const logTab = document.querySelector('.tab[data-tab="log"]');

    const setActiveTab = (tab) => {
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(`${tab.dataset.tab}-content`).classList.add('active');
        localStorage.setItem('activeTab', tab.dataset.tab);
        resizeAllTextareas();
    };

    boardTab.addEventListener('click', () => setActiveTab(boardTab));
    editorTab.addEventListener('click', () => setActiveTab(editorTab));
    hooksTab.addEventListener('click', () => setActiveTab(hooksTab));
    logTab.addEventListener('click', () => setActiveTab(logTab));

    const activeTab = localStorage.getItem('activeTab');

    const initialTab = activeTab && document.querySelector(`.tab[data-tab="${activeTab}"]`) ?
        document.querySelector(`.tab[data-tab="${activeTab}"]`) : boardTab;

    setActiveTab(initialTab);
    // END Tabs

    // BEGIN Widgets
    // Schedule
    setScheduleType('manual');

    scheduleTypeInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            if (e.target.value === 'recurring') {
                recurringSchedule.style.display = 'block';
                manualSchedule.style.display = 'none';
            } else {
                recurringSchedule.style.display = 'none';
                manualSchedule.style.display = 'block';
            }
        });
    });

    document.getElementById('add-datetime').addEventListener('click', () => {
        const datetimeInput = document.getElementById('manual-datetime');
        const datetimeValue = datetimeInput.value;

        if (datetimeValue) {
            addDatetimeToList(datetimeValue);
            datetimeInput.value = '';
        } else {
            showStatus("Please select a date and time.", false);
        }
    });

    saveScheduleBtn.addEventListener('click', async () => {
        const scheduleType = document.querySelector('input[name="schedule-type"]:checked').value;

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
                datetimes: []
            };

            cronPattern.value = '';
        } else if (scheduleType === 'manual') {
            const datetimes = [];

            datetimeList.querySelectorAll('li').forEach(li => {
                datetimes.push(li.dataset.datetime);
            });

            if (datetimes.length === 0) {
                showStatus('Please add at least one date-time for the manual schedule.', false);
                return;
            }

            scheduleData = {
                type: 'manual',
                pattern: null,
                datetimes: datetimes
            };
        }

        await sendScheduleToServer(scheduleData);

        datetimeList.style.display = 'none';
        datetimeList.innerHTML = '';
    });

    checkDatetimeListEmpty();
    fetchSchedule();

    // eval_data.json
    checkAndFetchEvalData();
    // END Widgets
});