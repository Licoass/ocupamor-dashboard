// ==========================================
// OCUPAMOR DASHBOARD ENGINE (PHASE 2)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // ------------------------------------------
    // STATE VARIABLES
    // ------------------------------------------
    let planningData = {};
    let assetsData = {};
    let birthdaysList = [];
    let calendarEvents = [];
    let progressState = {};
    let customBirthdays = {}; // { specialistCleanName: "YYYY-MM-DD" }
    let customActivities = []; // List of custom activities added in UI
    
    let currentMonth = "JULIO";
    let currentView = "grid";
    
    let filters = {
        text: "",
        area: "",
        format: "",
        status: ""
    };
    
    // Modal contexts
    let activeCardKey = null; // format: sheetName_row_rowNumber
    let activeCardItem = null;
    let isEditingMode = false;
    let activeBirthdaySpecName = null;

    // Spanish Month Mapping
    const monthOrder = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
    const monthNumberMap = {
        "ENERO": 1, "FEBRERO": 2, "MARZO": 3, "ABRIL": 4, "MAYO": 5, "JUNIO": 6,
        "JULIO": 7, "AGOSTO": 8, "SEPTIEMBRE": 9, "OCTUBRE": 10, "NOVIEMBRE": 11, "DICIEMBRE": 12
    };

    // ------------------------------------------
    // DOM ELEMENTS
    // ------------------------------------------
    const excelInput = document.getElementById("excel-input");
    const excelDropZone = document.getElementById("excel-drop-zone");
    const resetDataBtn = document.getElementById("reset-data-btn");
    
    const monthTabsContainer = document.getElementById("month-tabs-container");
    const specialistsListContainer = document.getElementById("specialists-list-container");
    
    // Canva Banner
    const canvaBanner = document.getElementById("canva-banner");
    const canvaBannerText = document.getElementById("canva-banner-text");
    const canvaEditBtn = document.getElementById("canva-edit-btn");
    const canvaOpenLink = document.getElementById("canva-open-link");
    const canvaEditor = document.getElementById("canva-editor");
    const canvaUrlInput = document.getElementById("canva-url-input");
    const canvaSaveBtn = document.getElementById("canva-save-btn");
    const canvaCancelBtn = document.getElementById("canva-cancel-btn");

    // KPI Stats
    const statTotal = document.getElementById("stat-total");
    const statPending = document.getElementById("stat-pending");
    const statProgress = document.getElementById("stat-progress");
    const statCompleted = document.getElementById("stat-completed");

    // Events Section
    const eventsSection = document.getElementById("events-section");
    const eventsMonthTitle = document.getElementById("events-month-title");
    const eventsToggleBtn = document.getElementById("events-toggle-btn");
    const eventsContent = document.getElementById("events-content");
    
    // Filters & Toolbar
    const searchInput = document.getElementById("search-input");
    const filterArea = document.getElementById("filter-area");
    const filterFormat = document.getElementById("filter-format");
    const filterStatus = document.getElementById("filter-status");
    const btnNewActivity = document.getElementById("btn-new-activity");
    
    // View Selectors & Viewports
    const btnViewGrid = document.getElementById("btn-view-grid");
    const btnViewKanban = document.getElementById("btn-view-kanban");
    const btnViewTable = document.getElementById("btn-view-table");
    
    const viewGrid = document.getElementById("view-grid");
    const cardsGridContainer = document.getElementById("cards-grid-container");
    const viewKanban = document.getElementById("view-kanban");
    const viewTable = document.getElementById("view-table");
    const emptyState = document.getElementById("empty-state");
    
    // Kanban Columns
    const kanbanColPending = document.getElementById("kanban-col-pending");
    const kanbanColInDesign = document.getElementById("kanban-col-indesign");
    const kanbanColDesigned = document.getElementById("kanban-col-designed");
    const kanbanColApproved = document.getElementById("kanban-col-approved");
    const kanbanColPublished = document.getElementById("kanban-col-published");
    
    const countPending = document.getElementById("count-pending");
    const countInDesign = document.getElementById("count-indesign");
    const countDesigned = document.getElementById("count-designed");
    const countApproved = document.getElementById("count-approved");
    const countPublished = document.getElementById("count-published");

    // Table rows
    const tableRowsContainer = document.getElementById("table-rows-container");

    // Detail/Editor Modal
    const detailModal = document.getElementById("detail-modal");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalBanner = document.getElementById("modal-banner");
    const modalArea = document.getElementById("modal-area");
    const modalAreaInput = document.getElementById("modal-area-input");
    
    const modalTitle = document.getElementById("modal-title");
    const modalTitleInput = document.getElementById("modal-title-input");
    const modalStatus = document.getElementById("modal-status");
    const modalDateTime = document.getElementById("modal-datetime");
    
    const modalDateInput = document.getElementById("modal-date-input");
    const modalDayInput = document.getElementById("modal-day-input");
    const modalTimeStartInput = document.getElementById("modal-time-start-input");
    const modalTimeEndInput = document.getElementById("modal-time-end-input");

    const modalTemario = document.getElementById("modal-temario");
    const modalTemarioInput = document.getElementById("modal-temario-input");
    const modalEnfoqueContainer = document.getElementById("modal-enfoque-container");
    const modalEnfoque = document.getElementById("modal-enfoque");
    const modalEnfoqueInput = document.getElementById("modal-enfoque-input");
    
    const modalBrief = document.getElementById("modal-brief");
    const modalBriefInput = document.getElementById("modal-brief-input");
    
    const modalLugar = document.getElementById("modal-lugar");
    const modalLugarInput = document.getElementById("modal-lugar-input");
    const modalDirigida = document.getElementById("modal-dirigida");
    const modalDirigidaInput = document.getElementById("modal-dirigida-input");
    
    const modalInversion = document.getElementById("modal-inversion");
    const modalInversionInput = document.getElementById("modal-inversion-input");
    const modalMateriales = document.getElementById("modal-materiales");
    const modalMaterialesInput = document.getElementById("modal-materiales-input");
    const modalRefrigerio = document.getElementById("modal-refrigerio");
    const modalRefrigerioInput = document.getElementById("modal-refrigerio-input");
    
    const modalSpecialistsContainer = document.getElementById("modal-specialists-container");
    const modalSpecsInput = document.getElementById("modal-specs-input");
    const modalSpecsInstaInput = document.getElementById("modal-specs-insta-input");
    const modalSpecsFedInput = document.getElementById("modal-specs-fed-input");
    const modalFormatInput = document.getElementById("modal-format-input");
    
    const modalStatusSelect = document.getElementById("modal-status-select");
    const modalEditToggleBtn = document.getElementById("modal-edit-toggle-btn");
    const modalSaveBtn = document.getElementById("modal-save-btn");
    const modalDeleteBtn = document.getElementById("modal-delete-btn");

    // Birthday Modal
    const birthdayModal = document.getElementById("birthday-modal");
    const birthdayCloseBtn = document.getElementById("birthday-modal-close-btn");
    const birthdaySpecName = document.getElementById("birthday-spec-name");
    const birthdayDateInput = document.getElementById("birthday-date-input");
    const birthdayCancelBtn = document.getElementById("birthday-cancel-btn");
    const birthdaySaveBtn = document.getElementById("birthday-save-btn");

    // Sidebar DOM Elements

    // Toast
    const toast = document.getElementById("toast");

    // Firebase & Security Lock Screen Elements
    let db = null;
    let stateRef = null;

    const accessKeyOverlay = document.getElementById("access-key-overlay");
    const accessKeyInput = document.getElementById("access-key-input");
    const accessKeySubmitBtn = document.getElementById("access-key-submit-btn");
    const accessKeyErrorMsg = document.getElementById("access-key-error-msg");

    // Collapsible Sidebar & Specialist Manager Elements
    let specialistsDirectory = [];
    let activeSpecId = null;

    const sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");
    const appBody = document.querySelector(".app-body");

    const specialistModal = document.getElementById("specialist-modal");
    const specialistModalBadge = document.getElementById("specialist-modal-badge");
    const specNameInput = document.getElementById("spec-name-input");
    const specRoleInput = document.getElementById("spec-role-input");
    const specInstaInput = document.getElementById("spec-insta-input");
    const specFedInput = document.getElementById("spec-fed-input");
    const specDobInput = document.getElementById("spec-dob-input");
    const specDriveInput = document.getElementById("spec-drive-input");

    const btnAddSpecialist = document.getElementById("btn-add-specialist");
    const specCancelBtn = document.getElementById("spec-cancel-btn");
    const specSaveBtn = document.getElementById("spec-save-btn");
    const specialistModalCloseBtn = document.getElementById("specialist-modal-close-btn");

    // ------------------------------------------
    // INITIALIZATION
    // ------------------------------------------
    function init() {
        // Verify Access Key first
        const isVerified = localStorage.getItem("ocupamor_access_key") === "Ocupamor2026";
        if (!isVerified) {
            accessKeyOverlay.style.display = "flex";
            setupAccessKeyListeners();
            return; // Halt initialization until verified
        } else {
            accessKeyOverlay.style.display = "none";
        }

        console.log("init called. initial currentMonth:", currentMonth);
        
        // Initialize Firebase if loaded and configured
        initializeFirebaseSync();

        loadBirthdaysAndEvents();
        loadPlanningData();
        console.log("planningData sheets loaded:", Object.keys(planningData));
        loadAssetsData();
        loadProgressState();
        loadSpecialistsDirectory();
        
        // Migrate specialists to include default Drive links if missing
        let migrated = false;
        specialistsDirectory.forEach(spec => {
            if (!spec.driveLink) {
                const defaultLink = getDefaultDriveLink(spec.rawName);
                if (defaultLink) {
                    spec.driveLink = defaultLink;
                    migrated = true;
                }
            }
        });
        if (migrated) {
            saveSpecialistsDirectory();
        }
        
        buildMonthTabs();
        console.log("after buildMonthTabs. currentMonth is now:", currentMonth);
        buildAreaFilters();
        buildAreaModalDropdown();
        buildSpecialistsDirectory();
        
        updateActiveMonthView();
        registerEventListeners();
    }

    function setupAccessKeyListeners() {
        const verify = () => {
            const password = accessKeyInput.value.trim();
            if (password === "Ocupamor2026") {
                localStorage.setItem("ocupamor_access_key", "Ocupamor2026");
                accessKeyOverlay.style.display = "none";
                init(); // Resume normal initialization
            } else {
                accessKeyErrorMsg.style.display = "block";
                accessKeyInput.value = "";
                accessKeyInput.focus();
            }
        };

        accessKeySubmitBtn.addEventListener("click", verify);
        accessKeyInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                verify();
            }
        });
    }

    function initializeFirebaseSync() {
        if (typeof firebase !== "undefined" && typeof firebaseConfig !== "undefined" && firebaseConfig.apiKey !== "REEMPLAZAR_CON_TU_API_KEY") {
            try {
                if (firebase.apps.length === 0) {
                    firebase.initializeApp(firebaseConfig);
                }
                db = firebase.firestore();
                stateRef = db.collection("ocupamor").doc("dashboard_state");
                setupRealtimeListeners();
            } catch (err) {
                console.error("Error al inicializar Firebase Sync:", err);
            }
        } else {
            console.log("Firebase no configurado o no cargado. Funcionando en modo local (localStorage).");
        }
    }

    function setupRealtimeListeners() {
        if (!stateRef) return;

        stateRef.onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                const cloudTimestamp = data.lastUpdated ? (data.lastUpdated.toMillis ? data.lastUpdated.toMillis() : (data.lastUpdated.seconds ? data.lastUpdated.seconds * 1000 : 0)) : 0;
                const localTimestamp = parseInt(localStorage.getItem("ocupamor_last_sync_timestamp") || "0", 10);
                
                if (cloudTimestamp > localTimestamp) {
                    console.log("Sincronizando estado en tiempo real desde Firebase...");
                    
                    if (data.planningData) {
                        planningData = typeof data.planningData === "string" ? JSON.parse(data.planningData) : data.planningData;
                        localStorage.setItem("ocupamor_custom_planning", JSON.stringify(planningData));
                    }
                    if (data.progressState) {
                        progressState = typeof data.progressState === "string" ? JSON.parse(data.progressState) : data.progressState;
                        localStorage.setItem("ocupamor_progress_state", JSON.stringify(progressState));
                    }
                    if (data.customBirthdays) {
                        customBirthdays = typeof data.customBirthdays === "string" ? JSON.parse(data.customBirthdays) : data.customBirthdays;
                        localStorage.setItem("ocupamor_custom_birthdays", JSON.stringify(customBirthdays));
                    }
                    if (data.customActivities) {
                        customActivities = typeof data.customActivities === "string" ? JSON.parse(data.customActivities) : data.customActivities;
                        localStorage.setItem("ocupamor_custom_activities", JSON.stringify(customActivities));
                    }
                    if (data.specialistsDirectory) {
                        specialistsDirectory = typeof data.specialistsDirectory === "string" ? JSON.parse(data.specialistsDirectory) : data.specialistsDirectory;
                        localStorage.setItem("ocupamor_specialists_directory", JSON.stringify(specialistsDirectory));
                    }
                    if (data.canvaLinks) {
                        const links = typeof data.canvaLinks === "string" ? JSON.parse(data.canvaLinks) : data.canvaLinks;
                        Object.keys(links).forEach(month => {
                            localStorage.setItem(`ocupamor_canva_link_${month}`, links[month]);
                        });
                    }
                    
                    localStorage.setItem("ocupamor_last_sync_timestamp", cloudTimestamp.toString());
                    
                    // Re-render
                    loadBirthdaysAndEvents();
                    buildMonthTabs();
                    buildAreaFilters();
                    buildSpecialistsDirectory();
                    updateActiveMonthView();
                }
            } else {
                uploadLocalStateToFirebase();
            }
        }, err => {
            console.warn("Fallo al conectar con Firestore (usando reglas de prueba o sin internet):", err);
        });
    }

    function uploadLocalStateToFirebase() {
        if (!stateRef) return;

        const canvaLinks = {};
        monthOrder.forEach(month => {
            const link = localStorage.getItem(`ocupamor_canva_link_${month}`);
            if (link) canvaLinks[month] = link;
        });

        const newTimestamp = Date.now();
        localStorage.setItem("ocupamor_last_sync_timestamp", newTimestamp.toString());

        stateRef.set({
            planningData: planningData,
            progressState: progressState,
            customBirthdays: customBirthdays,
            customActivities: customActivities,
            specialistsDirectory: specialistsDirectory,
            canvaLinks: canvaLinks,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            console.log("Estado sincronizado con Firebase.");
        }).catch(err => {
            console.error("Error al escribir en Firebase Firestore:", err);
        });
    }

    // ------------------------------------------
    // DATA LOADING & MERGING
    // ------------------------------------------
    function loadBirthdaysAndEvents() {
        // Load default birthdays
        birthdaysList = window.DEFAULT_BIRTHDAYS || [];
        // Load default calendar
        calendarEvents = window.DEFAULT_CALENDAR_EVENTS || [];

        // Load custom birthdays
        const storedCustomBirthdays = localStorage.getItem("ocupamor_custom_birthdays");
        if (storedCustomBirthdays) {
            try {
                customBirthdays = JSON.parse(storedCustomBirthdays);
                // Merge custom birthdays into active list
                Object.keys(customBirthdays).forEach(name => {
                    const dateStr = customBirthdays[name]; // YYYY-MM-DD
                    const parts = dateStr.split("-");
                    if (parts.length === 3) {
                        const month = parseInt(parts[1], 10);
                        const day = parseInt(parts[2], 10);
                        
                        // Check if already in list, if so update it, otherwise push
                        const existingIdx = birthdaysList.findIndex(b => cleanSpecialistName(b.name) === cleanSpecialistName(name));
                        if (existingIdx !== -1) {
                            birthdaysList[existingIdx].day = day;
                            birthdaysList[existingIdx].month = month;
                        } else {
                            birthdaysList.push({
                                name: name,
                                day: day,
                                month: month
                            });
                        }
                    }
                });
            } catch (e) {
                customBirthdays = {};
            }
        }
    }

    function loadPlanningData() {
        // 1. Get Excel Planning Data
        const storedPlanning = localStorage.getItem("ocupamor_custom_planning");
        if (storedPlanning) {
            try {
                planningData = JSON.parse(storedPlanning);
            } catch (e) {
                planningData = window.DEFAULT_PLANNING || {};
            }
        } else {
            planningData = window.DEFAULT_PLANNING || {};
        }

        // 2. Load custom activities added in UI
        const storedCustomActs = localStorage.getItem("ocupamor_custom_activities");
        if (storedCustomActs) {
            try {
                customActivities = JSON.parse(storedCustomActs);
                // Merge custom activities into planningData sheets
                customActivities.forEach(act => {
                    const sheet = act._sheetName;
                    if (planningData[sheet]) {
                        // Avoid duplicates on merge
                        const exists = planningData[sheet].rows.some(r => r._row_number === act._row_number && r._isCustom);
                        if (!exists) {
                            planningData[sheet].rows.push(act);
                        }
                    }
                });
            } catch (e) {
                customActivities = [];
            }
        }
    }

    function loadAssetsData() {
        assetsData = window.DEFAULT_ASSETS || {};
    }

    function loadProgressState() {
        const storedProgress = localStorage.getItem("ocupamor_progress_state");
        if (storedProgress) {
            try {
                progressState = JSON.parse(storedProgress);
            } catch (e) {
                progressState = {};
            }
        } else {
            progressState = {};
        }
    }

    function saveProgressState() {
        localStorage.setItem("ocupamor_progress_state", JSON.stringify(progressState));
        calculateStats();
        uploadLocalStateToFirebase();
    }

    function savePlanningData() {
        // Separate custom activities to save them in their own storage
        const customOnly = [];
        const cleanPlanning = {};

        Object.keys(planningData).forEach(sheetName => {
            cleanPlanning[sheetName] = {
                headers: planningData[sheetName].headers,
                rows: []
            };

            planningData[sheetName].rows.forEach(r => {
                if (r._isCustom) {
                    customOnly.push(r);
                }
                // Save in general planning
                cleanPlanning[sheetName].rows.push(r);
            });
        });

        customActivities = customOnly;
        localStorage.setItem("ocupamor_custom_activities", JSON.stringify(customActivities));
        localStorage.setItem("ocupamor_custom_planning", JSON.stringify(cleanPlanning));
        uploadLocalStateToFirebase();
    }

    function resetData() {
        if (confirm("¿Estás seguro de que deseas restablecer los datos de planificación y cumpleaños? Esto borrará cualquier Excel cargado y actividades creadas manualmente.")) {
            localStorage.removeItem("ocupamor_custom_planning");
            localStorage.removeItem("ocupamor_progress_state");
            localStorage.removeItem("ocupamor_custom_birthdays");
            localStorage.removeItem("ocupamor_custom_activities");
            localStorage.removeItem("ocupamor_specialists_directory");
            
            planningData = window.DEFAULT_PLANNING || {};
            progressState = {};
            customBirthdays = {};
            customActivities = [];
            currentMonth = "JULIO";
            
            loadBirthdaysAndEvents();
            loadPlanningData();
            loadSpecialistsDirectory();
            buildMonthTabs();
            buildAreaFilters();
            buildSpecialistsDirectory();
            updateActiveMonthView();
            uploadLocalStateToFirebase();
            showToast("Datos restablecidos correctamente.");
        }
    }

    function getCardKey(sheetName, item) {
        return `${sheetName}_row_${item._row_number}`;
    }

    // ------------------------------------------
    // STATS & KPI METRICS
    // ------------------------------------------
    function calculateStats() {
        const activeItems = getActiveMonthItems();
        const total = activeItems.length;
        
        let pending = 0;
        let inDesign = 0;
        let designed = 0;
        let approved = 0;
        let published = 0;

        activeItems.forEach(item => {
            const key = getCardKey(item._sheetName, item);
            const status = progressState[key] || "Pendiente";
            
            if (status === "Pendiente") pending++;
            else if (status === "En Diseño") inDesign++;
            else if (status === "Diseñado") designed++;
            else if (status === "Aprobado") approved++;
            else if (status === "Publicado") published++;
        });

        statTotal.textContent = total;
        statPending.textContent = pending;
        statProgress.textContent = inDesign + designed;
        statCompleted.textContent = approved + published;

        countPending.textContent = pending;
        countInDesign.textContent = inDesign;
        countDesigned.textContent = designed;
        countApproved.textContent = approved;
        countPublished.textContent = published;
    }

    // ------------------------------------------
    // MONTH NAVIGATION & CANVA SYNC
    // ------------------------------------------
    function buildMonthTabs() {
        const monthsSet = new Set();
        
        Object.keys(planningData).forEach(sheetName => {
            const rows = planningData[sheetName].rows || [];
            rows.forEach(r => {
                if (r.MES) {
                    monthsSet.add(r.MES.trim().toUpperCase());
                }
            });
        });

        // Add standard months in case Excel only has a few
        monthOrder.forEach(m => {
            if (m === "JULIO" || m === "AGOSTO" || m === "JUNIO" || m === "MAYO" || m === "ABRIL") {
                monthsSet.add(m);
            }
        });

        const sortedMonths = Array.from(monthsSet).sort((a, b) => {
            let idxA = monthOrder.indexOf(a);
            let idxB = monthOrder.indexOf(b);
            if (idxA === -1) idxA = 99;
            if (idxB === -1) idxB = 99;
            return idxA - idxB;
        });

        monthTabsContainer.innerHTML = "";
        
        if (!monthsSet.has(currentMonth)) {
            currentMonth = monthsSet.has("JULIO") ? "JULIO" : sortedMonths[0];
        }

        sortedMonths.forEach(month => {
            const btn = document.createElement("button");
            btn.className = `month-tab-btn ${month === currentMonth ? 'active' : ''}`;
            btn.textContent = month;
            btn.addEventListener("click", () => {
                document.querySelectorAll(".month-tab-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentMonth = month;
                updateActiveMonthView();
            });
            monthTabsContainer.appendChild(btn);
        });
    }

    // Canva link helpers
    function updateCanvaBanner() {
        const linkKey = `ocupamor_canva_link_${currentMonth}`;
        const savedUrl = localStorage.getItem(linkKey);
        
        if (savedUrl) {
            canvaBannerText.innerHTML = `Enlace de Canva (${currentMonth}): <a href="${savedUrl}" target="_blank" style="color:var(--morado-desarrollo); font-weight:600; text-decoration:underline;">${savedUrl.substring(0, 45)}...</a>`;
            canvaOpenLink.href = savedUrl;
            canvaOpenLink.style.display = "inline-flex";
            canvaEditBtn.textContent = "Editar Enlace";
        } else {
            canvaBannerText.innerHTML = `Proyecto de Canva (${currentMonth}): <strong style="color:var(--gris-suave)">No vinculado aún</strong>`;
            canvaOpenLink.style.display = "none";
            canvaEditBtn.textContent = "Vincular Canva";
        }
        
        canvaEditor.style.display = "none";
        canvaBanner.style.display = "flex";
    }

    canvaEditBtn.addEventListener("click", () => {
        const linkKey = `ocupamor_canva_link_${currentMonth}`;
        const savedUrl = localStorage.getItem(linkKey) || "";
        
        canvaUrlInput.value = savedUrl;
        canvaBanner.style.display = "none";
        canvaEditor.style.display = "flex";
        canvaUrlInput.focus();
    });

    canvaSaveBtn.addEventListener("click", () => {
        const url = canvaUrlInput.value.trim();
        const linkKey = `ocupamor_canva_link_${currentMonth}`;
        
        if (url) {
            localStorage.setItem(linkKey, url);
            showToast("Enlace de Canva guardado correctamente.");
        } else {
            localStorage.removeItem(linkKey);
            showToast("Enlace de Canva removido.");
        }
        updateCanvaBanner();
        uploadLocalStateToFirebase();
    });

    canvaCancelBtn.addEventListener("click", () => {
        canvaEditor.style.display = "none";
        canvaBanner.style.display = "flex";
    });

    // ------------------------------------------
    // EVENTS AND BIRTHDAYS PANEL (EFEMÉRIDES)
    // ------------------------------------------
    function renderEventsAndBirthdays() {
        eventsMonthTitle.textContent = currentMonth;
        eventsContent.innerHTML = "";
        
        const activeMonthNum = monthNumberMap[currentMonth] || 7;
        
        // 1. Gather Birthdays of active specialists in this month
        const allEvents = [];
        specialistsDirectory.forEach(spec => {
            if (spec.birthdateVal) {
                const parts = spec.birthdateVal.split("-");
                if (parts.length === 3) {
                    const month = parseInt(parts[1], 10);
                    const day = parseInt(parts[2], 10);
                    
                    if (month === activeMonthNum) {
                        allEvents.push({
                            type: "birthday",
                            day: day,
                            title: `Cumpleaños: ${spec.rawName}`,
                            rawName: spec.rawName
                        });
                    }
                }
            }
        });
        
        // 2. Gather Calendar events of this month
        const currentCalendarEvents = calendarEvents.filter(e => e.month === activeMonthNum);
        currentCalendarEvents.forEach(e => {
            allEvents.push({
                type: "holiday",
                day: e.day,
                title: e.summary
            });
        });

        // Sort ascending by day
        allEvents.sort((a, b) => a.day - b.day);

        if (allEvents.length === 0) {
            eventsContent.innerHTML = `<div style="font-size:12px; color:var(--gris-suave); font-style:italic; padding: 6px;">No hay efemérides ni cumpleaños registrados en ${currentMonth}.</div>`;
            return;
        }

        allEvents.forEach(ev => {
            const chip = document.createElement("div");
            chip.className = "event-card";
            
            const monthAbbr = currentMonth.substring(0, 3);
            const isBirthday = ev.type === "birthday";
            
            chip.innerHTML = `
                <div class="event-cal-block ${isBirthday ? 'event-birthday' : ''}">
                    <span class="event-cal-day">${ev.day}</span>
                    <span class="event-cal-month">${monthAbbr}</span>
                </div>
                <div class="event-info">
                    <span class="event-name" title="${ev.title}">${ev.title}</span>
                    <span class="event-tag ${isBirthday ? 'birthday' : 'holiday'}">${isBirthday ? 'Cumpleaños' : 'Efeméride'}</span>
                </div>
                <button class="btn btn-secondary btn-sm events-create-post-btn" style="padding: 3px 8px; font-size:10px;" title="Generar Post de Calendario">
                    + Post
                </button>
            `;

            // Setup quick post generation click
            chip.querySelector(".events-create-post-btn").addEventListener("click", () => {
                let defaultBrief = "";
                let specs = "";
                let instas = "";
                
                if (isBirthday) {
                    defaultBrief = `Diseño de cumpleaños para ${ev.rawName}. Colores de la marca. Fondo limpio y foto del especialista.`;
                    specs = ev.rawName;
                    // Find insta if exists
                    const specMatch = findSpecialistProfile(ev.rawName);
                    if (specMatch && specMatch.instagram) instas = specMatch.instagram;
                } else {
                    defaultBrief = `Diseño conmemorativo sobre: ${ev.title}. Enfocado en educar y concientizar.`;
                }

                // Prepare blank item
                const newItem = {
                    _sheetName: "PLANIFICACION TO 2026", // Default area fallback
                    _isCustom: true,
                    _row_number: Date.now(),
                    MES: currentMonth,
                    DIA: getDayNameForDate(activeMonthNum, ev.day),
                    FECHA: `2026-${activeMonthNum.toString().padStart(2, '0')}-${ev.day.toString().padStart(2, '0')}T00:00:00`,
                    TITULO: isBirthday ? `Cumpleaños de ${ev.rawName}` : ev.title,
                    TEMARIO: isBirthday ? `Celebración y agradecimiento por el cumpleaños de ${ev.rawName} en redes.` : `Conmemoración del ${ev.title}.`,
                    "DIRIGIDA A": "Todo público",
                    INVERSION: "Gratis",
                    "DISEÑO PUBLICIDAD": defaultBrief,
                    "NOMBRE Y APELLIDO": specs,
                    INSTAGRAM: instas,
                    FEDERACION: "",
                    "FORMATO DE PUBLICACION": "POST/HISTORIA",
                    LUGAR: "Redes Sociales"
                };

                // Open modal in edit mode pre-filled
                openNewActivityModal(newItem);
            });

            eventsContent.appendChild(chip);
        });
    }

    // Toggle event section visibility
    eventsToggleBtn.addEventListener("click", () => {
        const isHidden = eventsContent.style.display === "none";
        eventsContent.style.display = isHidden ? "flex" : "none";
        eventsToggleBtn.textContent = isHidden ? "Ocultar Panel" : "Mostrar Panel";
    });

    function getDayNameForDate(month, day) {
        try {
            const date = new Date(2026, month - 1, day);
            const days = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];
            return days[date.getDay()];
        } catch (e) {
            return "LUNES";
        }
    }

    // ------------------------------------------
    // MAIN TOOLBAR & FILTERS
    // ------------------------------------------
    function buildAreaFilters() {
        filterArea.innerHTML = '<option value="">Todas las Áreas</option>';
        Object.keys(planningData).forEach(sheetName => {
            const displayName = sheetName.replace("PLANIFICACION ", "").replace(" 2026", "");
            const opt = document.createElement("option");
            opt.value = sheetName;
            opt.textContent = getAreaFriendlyName(displayName);
            filterArea.appendChild(opt);
        });
    }

    function buildAreaModalDropdown() {
        modalAreaInput.innerHTML = "";
        Object.keys(planningData).forEach(sheetName => {
            const displayName = sheetName.replace("PLANIFICACION ", "").replace(" 2026", "");
            const opt = document.createElement("option");
            opt.value = sheetName;
            opt.textContent = getAreaFriendlyName(displayName);
            modalAreaInput.appendChild(opt);
        });
    }

    function getAreaFriendlyName(acronym) {
        const mapping = {
            "TO": "Terapia Ocupacional",
            "PS": "Psicología",
            "NT": "Nutrición",
            "FT": "Fisioterapia",
            "PP": "Psicopedagogía",
            "PP (2)": "Psicopedagogía 2",
            "LENGUAJE": "Terapia de Lenguaje",
            "CLUB": "Club de Actividades"
        };
        return mapping[acronym] || acronym;
    }

    function getAreaColorClass(sheetName) {
        if (sheetName.includes("TO")) return "to";
        if (sheetName.includes("PS")) return "ps";
        if (sheetName.includes("NT")) return "nt";
        if (sheetName.includes("FT")) return "ft";
        if (sheetName.includes("PP")) return "pp";
        if (sheetName.includes("LENGUAJE")) return "tl";
        return "club";
    }

    // ------------------------------------------
    // CORE WORKSPACE RENDERING
    // ------------------------------------------
    function getActiveMonthItems() {
        const items = [];
        Object.keys(planningData).forEach(sheetName => {
            const rows = planningData[sheetName].rows || [];
            rows.forEach(r => {
                if (r.MES && r.MES.trim().toUpperCase() === currentMonth) {
                    const itemWithMeta = {
                        ...r,
                        _sheetName: sheetName,
                        _areaName: getAreaFriendlyName(sheetName.replace("PLANIFICACION ", "").replace(" 2026", ""))
                    };
                    items.push(itemWithMeta);
                }
            });
        });
        console.log("getActiveMonthItems: currentMonth =", currentMonth, "items found =", items.length);
        return items;
    }

    function getFilteredItems() {
        let items = getActiveMonthItems();

        if (filters.text) {
            const query = filters.text.toLowerCase();
            items = items.filter(item => {
                const titleMatch = item.TITULO && item.TITULO.toLowerCase().includes(query);
                const temarioMatch = item.TEMARIO && item.TEMARIO.toLowerCase().includes(query);
                const focusMatch = item["ENFOQUE DEL TEMA"] && item["ENFOQUE DEL TEMA"].toLowerCase().includes(query);
                const nameMatch = item["NOMBRE Y APELLIDO"] && item["NOMBRE Y APELLIDO"].toLowerCase().includes(query);
                const specMatch = item.ESPECIALISTA && item.ESPECIALISTA.toLowerCase().includes(query);
                return titleMatch || temarioMatch || focusMatch || nameMatch || specMatch;
            });
        }

        if (filters.area) {
            items = items.filter(item => item._sheetName === filters.area);
        }

        if (filters.format) {
            const formatQuery = filters.format.toUpperCase();
            items = items.filter(item => {
                const pubFormat = item["FORMATO DE PUBLICACION"] || "";
                return pubFormat.toUpperCase().includes(formatQuery);
            });
        }

        if (filters.status) {
            items = items.filter(item => {
                const key = getCardKey(item._sheetName, item);
                const status = progressState[key] || "Pendiente";
                return status === filters.status;
            });
        }

        return items;
    }

    function updateActiveMonthView() {
        updateCanvaBanner();
        calculateStats();
        renderEventsAndBirthdays();
        renderActiveView();
        
        // Rebuild directory to update activity counts / histories based on month context
        buildSpecialistsDirectory();
    }

    function renderActiveView() {
        const filteredItems = getFilteredItems();

        if (filteredItems.length === 0) {
            emptyState.style.display = "flex";
            viewGrid.style.display = "none";
            viewKanban.style.display = "none";
            viewTable.style.display = "none";
            return;
        } else {
            emptyState.style.display = "none";
            viewGrid.style.display = currentView === "grid" ? "block" : "none";
            viewKanban.style.display = currentView === "kanban" ? "block" : "none";
            viewTable.style.display = currentView === "table" ? "block" : "none";
        }

        if (currentView === "grid") {
            renderGridView(filteredItems);
        } else if (currentView === "kanban") {
            renderKanbanView(filteredItems);
        } else if (currentView === "table") {
            renderTableView(filteredItems);
        }
    }

    // Grid Renderer
    function renderGridView(items) {
        cardsGridContainer.innerHTML = "";
        
        items.forEach(item => {
            const key = getCardKey(item._sheetName, item);
            const status = progressState[key] || "Pendiente";
            const areaClass = getAreaColorClass(item._sheetName);
            const formattedDate = parseAndFormatDate(item.FECHA, item.DIA);
            const format = item["FORMATO DE PUBLICACION"] || "POST/HISTORIA";
            
            const card = document.createElement("div");
            card.className = "design-card";
            card.style.setProperty("--morado-desarrollo", `var(--color-${areaClass})`);
            card.addEventListener("click", () => openDetailModal(item));

            const avatarsHtml = getAvatarsHtml(item["NOMBRE Y APELLIDO"]);

            card.innerHTML = `
                <div class="card-header">
                    <span class="area-badge" style="background-color: rgba(var(--color-${areaClass}-rgb, 106, 44, 255), 0.1); color: var(--color-${areaClass})">${item._areaName}</span>
                    <span class="status-badge status-${status.toLowerCase().replace(' ', '')}">
                        ${status}
                    </span>
                </div>
                <div class="card-body">
                    <div class="card-date">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span>${formattedDate}</span>
                    </div>
                    <h3 class="card-title">${item.TITULO || item["ENFOQUE DEL TEMA"] || 'Publicación sin título'}</h3>
                    <p class="card-desc">${item.TEMARIO || 'No se detalló temario para esta publicación.'}</p>
                    <ul class="card-meta-list">
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
                            <span>Lugar: <strong>${item.LUGAR || 'Ocupamor'}</strong></span>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            <span>Público: <strong>${item["DIRIGIDA A"] || 'Todo público'}</strong></span>
                        </li>
                    </ul>
                </div>
                <div class="card-footer">
                    <div class="card-format">
                        <span>${format}</span>
                    </div>
                    <div class="card-specs-avatars">
                        ${avatarsHtml}
                    </div>
                </div>
            `;
            
            cardsGridContainer.appendChild(card);
        });
    }

    // Kanban Renderer
    function renderKanbanView(items) {
        kanbanColPending.innerHTML = "";
        kanbanColInDesign.innerHTML = "";
        kanbanColDesigned.innerHTML = "";
        kanbanColApproved.innerHTML = "";
        kanbanColPublished.innerHTML = "";

        items.forEach(item => {
            const key = getCardKey(item._sheetName, item);
            const status = progressState[key] || "Pendiente";
            const areaClass = getAreaColorClass(item._sheetName);
            const formattedDate = parseAndFormatDate(item.FECHA, item.DIA);
            const format = item["FORMATO DE PUBLICACION"] || "POST/HISTORIA";
            
            const card = document.createElement("div");
            card.className = "design-card";
            card.setAttribute("draggable", "true");
            card.setAttribute("id", `drag-${key}`);
            card.style.setProperty("--morado-desarrollo", `var(--color-${areaClass})`);
            
            card.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", key);
                card.classList.add("dragging");
            });

            card.addEventListener("dragend", () => {
                card.classList.remove("dragging");
            });

            card.addEventListener("click", () => openDetailModal(item));

            const avatarsHtml = getAvatarsHtml(item["NOMBRE Y APELLIDO"]);

            card.innerHTML = `
                <div class="card-header">
                    <span class="area-badge" style="background-color: rgba(var(--color-${areaClass}-rgb, 106, 44, 255), 0.1); color: var(--color-${areaClass})">${item._areaName}</span>
                </div>
                <div class="card-body" style="padding-top: 10px;">
                    <div class="card-date" style="font-size: 11px;">
                        <span>${formattedDate}</span>
                    </div>
                    <h3 class="card-title" style="font-size: 14px; margin-bottom: 4px;">${item.TITULO || item["ENFOQUE DEL TEMA"] || 'Publicación sin título'}</h3>
                    <p class="card-desc" style="font-size: 11.5px; margin-bottom: 8px;">${item.TEMARIO || 'Sin temario.'}</p>
                </div>
                <div class="card-footer">
                    <div class="card-format" style="font-size: 10px; padding: 2px 6px;">
                        <span>${format}</span>
                    </div>
                    <div class="card-specs-avatars">
                        ${avatarsHtml}
                    </div>
                </div>
            `;

            if (status === "Pendiente") kanbanColPending.appendChild(card);
            else if (status === "En Diseño") kanbanColInDesign.appendChild(card);
            else if (status === "Diseñado") kanbanColDesigned.appendChild(card);
            else if (status === "Aprobado") kanbanColApproved.appendChild(card);
            else if (status === "Publicado") kanbanColPublished.appendChild(card);
        });
    }

    // Table List Renderer
    function renderTableView(items) {
        tableRowsContainer.innerHTML = "";

        items.forEach(item => {
            const key = getCardKey(item._sheetName, item);
            const status = progressState[key] || "Pendiente";
            const formattedDate = parseAndFormatDate(item.FECHA, item.DIA);
            const areaClass = getAreaColorClass(item._sheetName);
            const format = item["FORMATO DE PUBLICACION"] || "POST/HISTORIA";
            const professionals = item["NOMBRE Y APELLIDO"] || "No asignado";

            const tr = document.createElement("tr");
            tr.addEventListener("click", (e) => {
                if (e.target.tagName !== "SELECT" && e.target.tagName !== "BUTTON" && !e.target.closest("button")) {
                    openDetailModal(item);
                }
            });

            tr.innerHTML = `
                <td class="table-date-col">${formattedDate}</td>
                <td>
                    <span class="area-badge" style="background-color: rgba(var(--color-${areaClass}-rgb, 106, 44, 255), 0.1); color: var(--color-${areaClass})">
                        ${item._areaName}
                    </span>
                </td>
                <td class="table-title-col">
                    <strong>${item.TITULO || 'Publicación sin título'}</strong>
                    <div style="font-size: 11px; color: var(--gris-suave); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;">
                        ${item.TEMARIO || ''}
                    </div>
                </td>
                <td><span class="card-format">${format}</span></td>
                <td>${item.INVERSION || 'Gratis'}</td>
                <td style="font-size: 12px; font-weight: 500;">${professionals}</td>
                <td>
                    <select class="select-filter table-status-select" data-card-key="${key}" style="font-size: 12px; padding: 4px 8px;">
                        <option value="Pendiente" ${status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="En Diseño" ${status === 'En Diseño' ? 'selected' : ''}>En Diseño</option>
                        <option value="Diseñado" ${status === 'Diseñado' ? 'selected' : ''}>Diseñado</option>
                        <option value="Aprobado" ${status === 'Aprobado' ? 'selected' : ''}>Aprobado</option>
                        <option value="Publicado" ${status === 'Publicado' ? 'selected' : ''}>Publicado</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-secondary btn-icon table-action-btn" title="Ver Detalles">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                </td>
            `;

            const selectEl = tr.querySelector(".table-status-select");
            selectEl.addEventListener("change", (e) => {
                const newStatus = e.target.value;
                progressState[key] = newStatus;
                saveProgressState();
                showToast(`Estado cambiado a "${newStatus}"`);
                renderActiveView();
            });

            tableRowsContainer.appendChild(tr);
        });
    }

    // ------------------------------------------
    // DETAIL / EDIT SYSTEM MODAL
    // ------------------------------------------
    function openDetailModal(item) {
        activeCardItem = item;
        activeCardKey = getCardKey(item._sheetName, item);
        isEditingMode = false;
        
        detailModal.classList.remove("is-editing");
        modalDeleteBtn.style.display = item._isCustom ? "inline-flex" : "none";
        modalEditToggleBtn.textContent = "Editar Ficha";
        
        toggleModalFields(false);
        populateModalData(item);

        detailModal.classList.add("active");
    }

    function openNewActivityModal(prefilledItem = null) {
        // Reset or use pre-filled item
        activeCardKey = null;
        isEditingMode = true;
        
        const freshItem = prefilledItem || {
            _sheetName: Object.keys(planningData)[0] || "PLANIFICACION TO 2026",
            _isCustom: true,
            _row_number: Date.now(),
            MES: currentMonth,
            DIA: "LUNES",
            FECHA: new Date().toISOString().split("T")[0] + "T00:00:00",
            TITULO: "",
            TEMARIO: "",
            "DIRIGIDA A": "Todo público",
            INVERSION: "Gratis",
            "DISEÑO PUBLICIDAD": "",
            "NOMBRE Y APELLIDO": "",
            INSTAGRAM: "",
            FEDERACION: "",
            "FORMATO DE PUBLICACION": "POST/HISTORIA",
            LUGAR: "Sede Ocupamor"
        };

        activeCardItem = freshItem;
        
        detailModal.classList.add("is-editing");
        modalDeleteBtn.style.display = "none"; // not saved yet
        modalEditToggleBtn.textContent = "Cancelar";
        
        toggleModalFields(true);
        populateModalData(freshItem);

        // Pre-fill inputs explicitly
        modalTitleInput.value = freshItem.TITULO;
        modalAreaInput.value = freshItem._sheetName;
        modalTemarioInput.value = freshItem.TEMARIO;
        modalEnfoqueInput.value = freshItem["ENFOQUE DEL TEMA"] || "";
        modalBriefInput.value = freshItem["DISEÑO PUBLICIDAD"] || "";
        modalLugarInput.value = freshItem.LUGAR || "Sede Ocupamor";
        modalDirigidaInput.value = freshItem["DIRIGIDA A"] || "Todo público";
        modalInversionInput.value = freshItem.INVERSION || "Gratis";
        modalMaterialesInput.value = freshItem.MATERIALES || "";
        modalRefrigerioInput.value = freshItem.REFRIGERIO || "";
        modalSpecsInput.value = freshItem["NOMBRE Y APELLIDO"] || "";
        modalSpecsInstaInput.value = freshItem.INSTAGRAM || "";
        modalSpecsFedInput.value = freshItem.FEDERACION || "";
        modalFormatInput.value = freshItem["FORMATO DE PUBLICACION"] || "POST/HISTORIA";
        
        if (freshItem.FECHA && freshItem.FECHA.includes("T")) {
            modalDateInput.value = freshItem.FECHA.split("T")[0];
        } else {
            modalDateInput.value = new Date().toISOString().split("T")[0];
        }
        modalDayInput.value = freshItem.DIA || "LUNES";
        modalTimeStartInput.value = freshItem["HORA DE INICIO"] || "";
        modalTimeEndInput.value = freshItem["HORARIO DE FINAL"] || "";

        detailModal.classList.add("active");
    }

    function populateModalData(item) {
        const status = progressState[activeCardKey] || "Pendiente";
        const areaClass = getAreaColorClass(item._sheetName);

        modalBanner.style.backgroundColor = `var(--color-${areaClass})`;
        modalArea.textContent = getAreaFriendlyName(item._sheetName.replace("PLANIFICACION ", "").replace(" 2026", ""));
        
        // Static text bindings
        modalTitle.textContent = item.TITULO || item["ENFOQUE DEL TEMA"] || 'Publicación sin título';
        modalDateTime.textContent = `${item.DIA || ''} ${parseAndFormatDate(item.FECHA, "")} • ${item["HORA DE INICIO"] || ''} - ${item["HORARIO DE FINAL"] || ''}`;
        
        modalStatus.textContent = status;
        modalStatus.className = `status-badge status-${status.toLowerCase().replace(' ', '')}`;
        
        modalTemario.textContent = item.TEMARIO || 'No se detalló temario para esta publicación.';
        
        if (item["ENFOQUE DEL TEMA"]) {
            modalEnfoque.textContent = item["ENFOQUE DEL TEMA"];
            modalEnfoqueContainer.style.display = "inline-block";
        } else {
            modalEnfoqueContainer.style.display = "none";
        }

        const brief = item["DISEÑO PUBLICIDAD"];
        if (brief) {
            modalBrief.textContent = brief;
            modalBrief.style.fontStyle = "normal";
        } else {
            modalBrief.textContent = "No se especificó un brief detallado de diseño en la planificación de Excel. Revisa el ayudante de recursos o manual de marca.";
            modalBrief.style.fontStyle = "italic";
        }

        modalLugar.textContent = item.LUGAR || 'Sede Ocupamor';
        modalDirigida.textContent = item["DIRIGIDA A"] || 'Público general';
        modalInversion.textContent = item.INVERSION || 'Gratis';
        modalMateriales.textContent = item.MATERIALES || 'No especificados';
        modalRefrigerio.textContent = item.REFRIGERIO || item.REGRIGERIO || 'No aplica';

        // Bind Edit Mode input values
        modalTitleInput.value = item.TITULO || "";
        modalAreaInput.value = item._sheetName;
        modalTemarioInput.value = item.TEMARIO || "";
        modalEnfoqueInput.value = item["ENFOQUE DEL TEMA"] || "";
        modalBriefInput.value = item["DISEÑO PUBLICIDAD"] || "";
        modalLugarInput.value = item.LUGAR || "";
        modalDirigidaInput.value = item["DIRIGIDA A"] || "";
        modalInversionInput.value = item.INVERSION || "";
        modalMaterialesInput.value = item.MATERIALES || "";
        modalRefrigerioInput.value = item.REFRIGERIO || item.REGRIGERIO || "";
        modalSpecsInput.value = item["NOMBRE Y APELLIDO"] || "";
        modalSpecsInstaInput.value = item.INSTAGRAM || "";
        modalSpecsFedInput.value = item.FEDERACION || "";
        modalFormatInput.value = item["FORMATO DE PUBLICACION"] || "";
        
        if (item.FECHA && item.FECHA.includes("T")) {
            modalDateInput.value = item.FECHA.split("T")[0];
        } else {
            modalDateInput.value = "";
        }
        modalDayInput.value = item.DIA || "";
        modalTimeStartInput.value = item["HORA DE INICIO"] || "";
        modalTimeEndInput.value = item["HORARIO DE FINAL"] || "";

        // Specialists layout inside modal
        modalSpecialistsContainer.innerHTML = "";
        const specialistsNames = item["NOMBRE Y APELLIDO"] ? splitSpecialistNames(item["NOMBRE Y APELLIDO"]) : [];
        const specialistsInstas = item.INSTAGRAM ? item.INSTAGRAM.split(/\s+/).filter(n => n.trim().length > 0) : [];
        const specialistsFed = item.FEDERACION ? item.FEDERACION.split(/\s+/).filter(n => n.trim().length > 0) : [];

        if (specialistsNames.length === 0) {
            modalSpecialistsContainer.innerHTML = "<p style='font-size: 12px; color: var(--gris-suave); font-style: italic;'>No hay profesionales asignados.</p>";
        } else {
            specialistsNames.forEach((name, i) => {
                const handle = specialistsInstas[i] || "";
                const fed = specialistsFed[i] || "";
                
                const itemEl = document.createElement("div");
                itemEl.className = "modal-spec-item";
                itemEl.innerHTML = `
                    <div>
                        <span class="modal-spec-item-name">${name.trim()}</span>
                        ${fed ? `<div style="font-size:10px; color:var(--gris-suave); margin-top:2px;">Matrícula: ${fed.trim()}</div>` : ''}
                    </div>
                    ${handle ? `
                        <button class="btn btn-secondary spec-copy-btn-modal" data-handle="${handle.trim()}" style="font-size:10px; padding: 3px 6px; border-radius:4px;">
                            @${handle.trim()}
                        </button>
                    ` : '<span style="font-size: 10px; color: var(--gris-suave);">Sin IG</span>'}
                `;

                const btn = itemEl.querySelector(".spec-copy-btn-modal");
                if (btn) {
                    btn.addEventListener("click", () => {
                        copyToClipboard(`@${btn.getAttribute("data-handle")}`);
                        showToast(`Instagram de ${name.trim()} copiado.`);
                    });
                }
                modalSpecialistsContainer.appendChild(itemEl);
            });
        }

        modalStatusSelect.value = status;
    }

    function toggleModalFields(editModeActive) {
        const staticFields = detailModal.querySelectorAll(".static-field");
        const editFields = detailModal.querySelectorAll(".edit-field");
        
        staticFields.forEach(f => f.style.display = editModeActive ? "none" : "");
        editFields.forEach(f => f.style.display = editModeActive ? "" : "none");

        // Area text header in banner is toggled
        modalArea.style.display = editModeActive ? "none" : "";
        modalAreaInput.style.display = editModeActive ? "block" : "none";
    }

    modalEditToggleBtn.addEventListener("click", () => {
        if (!activeCardKey) {
            // Cancel new card addition
            closeDetailModal();
            return;
        }

        isEditingMode = !isEditingMode;
        detailModal.classList.toggle("is-editing", isEditingMode);
        
        if (isEditingMode) {
            modalEditToggleBtn.textContent = "Cancelar";
            modalDeleteBtn.style.display = activeCardItem._isCustom ? "inline-flex" : "none";
            toggleModalFields(true);
        } else {
            modalEditToggleBtn.textContent = "Editar Ficha";
            modalDeleteBtn.style.display = "none";
            toggleModalFields(false);
            populateModalData(activeCardItem); // Reset values
        }
    });

    // Save changes
    modalSaveBtn.addEventListener("click", () => {
        const selectedArea = modalAreaInput.value;
        const newStatus = modalStatusSelect.value;
        
        // Read input fields
        const title = modalTitleInput.value.trim() || "Diseño sin título";
        const temario = modalTemarioInput.value.trim();
        const enfoque = modalEnfoqueInput.value.trim();
        const brief = modalBriefInput.value.trim();
        const lugar = modalLugarInput.value.trim();
        const dirigida = modalDirigidaInput.value.trim();
        const inversion = modalInversionInput.value.trim();
        const materiales = modalMaterialesInput.value.trim();
        const refrigerio = modalRefrigerioInput.value.trim();
        const specs = modalSpecsInput.value.trim();
        const specsInstas = modalSpecsInstaInput.value.trim();
        const specsFeds = modalSpecsFedInput.value.trim();
        const format = modalFormatInput.value.trim();
        const dateVal = modalDateInput.value;
        const dayVal = modalDayInput.value.trim().toUpperCase();
        const timeStart = modalTimeStartInput.value.trim();
        const timeEnd = modalTimeEndInput.value.trim();

        if (!activeCardKey) {
            // 1. ADD NEW CUSTOM DESIGN CARD
            const newRowNumber = Date.now();
            const newCardItem = {
                _sheetName: selectedArea,
                _isCustom: true,
                _row_number: newRowNumber,
                MES: currentMonth,
                DIA: dayVal || "LUNES",
                FECHA: dateVal ? `${dateVal}T00:00:00` : null,
                "HORA DE INICIO": timeStart,
                "HORARIO DE FINAL": timeEnd,
                TITULO: title,
                TEMARIO: temario,
                "ENFOQUE DEL TEMA": enfoque,
                "DISEÑO PUBLICIDAD": brief,
                LUGAR: lugar,
                "DIRIGIDA A": dirigida,
                INVERSION: inversion,
                MATERIALES: materiales,
                REFRIGERIO: refrigerio,
                "NOMBRE Y APELLIDO": specs,
                INSTAGRAM: specsInstas,
                FEDERACION: specsFeds,
                "FORMATO DE PUBLICACION": format
            };

            // Push into memory structure
            planningData[selectedArea].rows.push(newCardItem);
            
            // Set status
            const newKey = getCardKey(selectedArea, newCardItem);
            progressState[newKey] = newStatus;
            
            savePlanningData();
            saveProgressState();
            showToast("Nueva actividad agregada con éxito.");
        } else {
            // 2. MODIFY EXISTING CARD
            // Check if sheet area changed
            const oldArea = activeCardItem._sheetName;
            
            // Edit fields directly in object reference
            activeCardItem.TITULO = title;
            activeCardItem.TEMARIO = temario;
            activeCardItem["ENFOQUE DEL TEMA"] = enfoque;
            activeCardItem["DISEÑO PUBLICIDAD"] = brief;
            activeCardItem.LUGAR = lugar;
            activeCardItem["DIRIGIDA A"] = dirigida;
            activeCardItem.INVERSION = inversion;
            activeCardItem.MATERIALES = materiales;
            activeCardItem.REFRIGERIO = refrigerio;
            activeCardItem["NOMBRE Y APELLIDO"] = specs;
            activeCardItem.INSTAGRAM = specsInstas;
            activeCardItem.FEDERACION = specsFeds;
            activeCardItem["FORMATO DE PUBLICACION"] = format;
            activeCardItem.DIA = dayVal;
            activeCardItem.FECHA = dateVal ? `${dateVal}T00:00:00` : activeCardItem.FECHA;
            activeCardItem["HORA DE INICIO"] = timeStart;
            activeCardItem["HORARIO DE FINAL"] = timeEnd;
            activeCardItem._isEdited = true; // Mark as edited

            // Handle Area Change
            if (oldArea !== selectedArea) {
                // Remove from old sheet list
                const oldSheetRows = planningData[oldArea].rows;
                const idx = oldSheetRows.findIndex(r => r._row_number === activeCardItem._row_number);
                if (idx !== -1) oldSheetRows.splice(idx, 1);
                
                // Add to new sheet list
                activeCardItem._sheetName = selectedArea;
                planningData[selectedArea].rows.push(activeCardItem);
                
                // Migrates progress status to new key
                const newKey = getCardKey(selectedArea, activeCardItem);
                progressState[newKey] = newStatus;
                delete progressState[activeCardKey];
            } else {
                progressState[activeCardKey] = newStatus;
            }

            savePlanningData();
            saveProgressState();
            showToast("Cambios guardados con éxito.");
        }

        closeDetailModal();
        updateActiveMonthView();
    }
    );

    // Delete custom activity
    modalDeleteBtn.addEventListener("click", () => {
        if (activeCardKey && activeCardItem && activeCardItem._isCustom) {
            if (confirm(`¿Estás seguro de que deseas eliminar la actividad "${activeCardItem.TITULO}"?`)) {
                const sheet = activeCardItem._sheetName;
                const rows = planningData[sheet].rows;
                const idx = rows.findIndex(r => r._row_number === activeCardItem._row_number);
                if (idx !== -1) {
                    rows.splice(idx, 1);
                }
                
                // Clear progress
                delete progressState[activeCardKey];
                
                savePlanningData();
                saveProgressState();
                showToast("Actividad eliminada.");
                closeDetailModal();
                updateActiveMonthView();
            }
        }
    });

    function closeDetailModal() {
        detailModal.classList.remove("active");
        activeCardKey = null;
        activeCardItem = null;
    }

    // ------------------------------------------
    // BIRTHDAYS & SPECIALISTS DIRECTORY
    // ------------------------------------------
    const defaultDriveLinks = {
        "maria peña": "https://drive.google.com/drive/folders/1Osda4cb4V09bimO00D6dCPlKGopmdKwb?usp=drive_link",
        "maria pena": "https://drive.google.com/drive/folders/1Osda4cb4V09bimO00D6dCPlKGopmdKwb?usp=drive_link",
        "doriangelys": "https://drive.google.com/drive/folders/1_NtSPw5Dg7BTCB2607MwzPB1idq-xXMN?usp=drive_link",
        "stephannie": "https://drive.google.com/drive/folders/1x7RHk_As_XdrJTjXrV3KRn22AjbhKVVt?usp=drive_link",
        "yulibeth": "https://drive.google.com/drive/folders/1BN2dt_oVKIVA2wijNUz8xwwqW2WJIEjw?usp=drive_link",
        "onaily": "https://drive.google.com/drive/folders/1ZNw7lWH_Dj07zto-urdhRPdxkHkGofwD?usp=drive_link",
        "miguel": "https://drive.google.com/drive/folders/1BF8J3LH-wJuKS7hmHzgDlAx2HVw1iKNy?usp=drive_link",
        "yaisibit": "https://drive.google.com/drive/folders/1Pc8RP_iWqK-Dj_gU6ItwrD6FqBEfaXse?usp=drive_link",
        "aderling": "https://drive.google.com/drive/folders/1EAc3D1Dccm6F2bJw_3bq68T9hXFG-zZe?usp=drive_link",
        "jhoana": "https://drive.google.com/drive/folders/1Bifhs3AOurANkc0oMltdD-7Hoxct4P7O?usp=drive_link",
        "nelson": "https://drive.google.com/drive/folders/15AtRox9YUHxiDNI7pDg0INJq4ktaJU7P?usp=drive_link",
        "siramad": "https://drive.google.com/drive/folders/1ZeQMzcXYRciITRizENKYVO1eoWmOz_hi?usp=drive_link",
        "francia": "https://drive.google.com/drive/folders/1P9OoJlZPCQtRHUwfj1t50pWYhCtku3SM?usp=drive_link",
        "merlin": "https://drive.google.com/drive/folders/1Yhh1r5yWfDpMn-EKq0buNDTi8Ko0Jw0U?usp=drive_link",
        "yesenia": "https://drive.google.com/drive/folders/1zLK5zVrnGo0zyjzEoRV4vU1fkLqKluHE?usp=drive_link",
        "betania": "https://drive.google.com/drive/folders/1vJD3_PcMJLt4S2FT9eob39NSs029x98L?usp=drive_link",
        "elimar": "https://drive.google.com/drive/folders/1ZijRGBSkbJ_VEZBIE6J3wZyKOoK0tsI5?usp=drive_link",
        "wilmary": "https://drive.google.com/drive/folders/1eaEFJbeG2wdq7vl1myhSwUt-lZK7APJW?usp=drive_link"
    };

    function getDefaultDriveLink(rawName) {
        const clean = cleanSpecialistName(rawName);
        const sortedKeys = Object.keys(defaultDriveLinks).sort((a, b) => b.length - a.length);
        for (const key of sortedKeys) {
            if (clean.includes(key)) {
                return defaultDriveLinks[key];
            }
        }
        return "";
    }

    function loadSpecialistsDirectory() {
        const stored = localStorage.getItem("ocupamor_specialists_directory");
        if (stored) {
            try {
                specialistsDirectory = JSON.parse(stored);
                return;
            } catch (e) {
                specialistsDirectory = [];
            }
        }

        // Rebuild from assetsData (default folders in ACTIVOS)
        const specMap = new Map();

        if (assetsData) {
            Object.keys(assetsData).forEach(area => {
                const specialists = assetsData[area];
                Object.keys(specialists).forEach(spec => {
                    const cleanName = spec.replace(/^(T\.O|F\.T|PS\.|NT\.|PP\.|TL|DOC\.)\s+/g, "").replace("-", " ").trim();
                    const mapKey = cleanSpecialistName(cleanName);
                    
                    if (cleanName && !specMap.has(mapKey)) {
                        // Find default birthday
                        let birthdayStr = null;
                        let birthdayVal = "";
                        const birthdayMatch = findBirthday(cleanName);
                        if (birthdayMatch) {
                            birthdayStr = `${birthdayMatch.day} de ${monthOrder[birthdayMatch.month - 1]}`;
                            birthdayVal = `2000-${birthdayMatch.month.toString().padStart(2, '0')}-${birthdayMatch.day.toString().padStart(2, '0')}`;
                        }

                        // Find default instagram and fed from planningData
                        let insta = "";
                        let fed = "";
                        Object.keys(planningData).forEach(sheetName => {
                            planningData[sheetName].rows.forEach(r => {
                                if (r["NOMBRE Y APELLIDO"]) {
                                    const names = splitSpecialistNames(r["NOMBRE Y APELLIDO"]);
                                    const instas = r.INSTAGRAM ? r.INSTAGRAM.split(/\s+/).filter(n => n.trim().length > 0) : [];
                                    const feds = r.FEDERACION ? r.FEDERACION.split(/\s+/).filter(n => n.trim().length > 0) : [];
                                    
                                    const idx = names.findIndex(n => cleanSpecialistName(n) === mapKey);
                                    if (idx !== -1) {
                                        if (instas[idx]) insta = instas[idx].trim();
                                        if (feds[idx]) fed = feds[idx].trim();
                                    }
                                }
                            });
                        });

                        // Find default Google Drive link
                        const driveLinkVal = getDefaultDriveLink(cleanName);

                        specMap.set(mapKey, {
                            id: mapKey,
                            rawName: cleanName,
                            role: getAreaFriendlyName(area),
                            instagram: insta,
                            fed: fed,
                            birthdate: birthdayStr,
                            birthdateVal: birthdayVal,
                            driveLink: driveLinkVal,
                            isDefault: true
                        });
                    }
                });
            });
        }

        specialistsDirectory = Array.from(specMap.values());
        saveSpecialistsDirectory();
    }

    function saveSpecialistsDirectory() {
        localStorage.setItem("ocupamor_specialists_directory", JSON.stringify(specialistsDirectory));
        uploadLocalStateToFirebase();
    }

    function buildSpecialistsDirectory() {
        specialistsListContainer.innerHTML = "";
        
        if (specialistsDirectory.length === 0) {
            specialistsListContainer.innerHTML = "<p style='font-size: 12px; color: var(--gris-suave); font-style: italic;'>No hay especialistas en el directorio.</p>";
            return;
        }

        // Sort alphabetically
        const sorted = [...specialistsDirectory].sort((a, b) => a.rawName.localeCompare(b.rawName));

        sorted.forEach(spec => {
            const card = document.createElement("div");
            card.className = "specialist-card";
            
            let birthdayHtml = "";
            if (spec.birthdateVal) {
                birthdayHtml = `
                    <div class="spec-birthday-row">
                        <span>🎂 Cumpleaños: <strong>${spec.birthdate || spec.birthdateVal}</strong></span>
                    </div>
                `;
            } else {
                birthdayHtml = `
                    <div class="spec-birthday-row">
                        <span class="warning-badge" data-id="${spec.id}">
                            ⚠️ Agregar cumpleaños
                        </span>
                    </div>
                `;
            }

            // Find activities history
            const activities = findSpecialistActivities(spec.rawName);

            // Build activities history HTML
            let activitiesHtml = "";
            if (activities.length > 0) {
                activitiesHtml = `
                    <div class="spec-activities-title">Participación (${activities.length})</div>
                    <ul class="spec-activities-list">
                        ${activities.slice(0, 3).map(act => `
                            <li title="${act.title}">
                                <span class="spec-activity-dot"></span>
                                <span>${act.title} (${act.month})</span>
                            </li>
                        `).join("")}
                        ${activities.length > 3 ? `<li style='color:var(--gris-suave); font-style:italic;'>+ ${activities.length - 3} más...</li>` : ''}
                    </ul>
                `;
            }

            let driveLinkHtml = "";
            if (spec.driveLink) {
                driveLinkHtml = `
                    <a href="${spec.driveLink}" target="_blank" class="btn btn-secondary spec-drive-btn" style="width: 100%; margin-top: 10px; gap: 8px; justify-content: center; font-size: 11px; padding: 6px 12px; display: inline-flex; align-items: center; text-decoration: none;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        Ver Recursos (Drive)
                    </a>
                `;
            }

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 4px;">
                    <div>
                        <div class="spec-name">${spec.rawName}</div>
                        <div class="spec-role">${spec.role}</div>
                    </div>
                    <div style="display:flex; gap: 4px;">
                        <button class="btn btn-secondary btn-icon spec-card-edit-btn" data-id="${spec.id}" title="Editar Ficha" style="padding: 4px; border-radius: 4px; border:none; background:transparent;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="btn btn-secondary btn-icon spec-card-delete-btn" data-id="${spec.id}" title="Eliminar Especialista" style="padding: 4px; border-radius: 4px; border:none; background:transparent; color:#EF4444;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </div>
                ${birthdayHtml}
                
                ${spec.instagram ? `
                    <div class="spec-info-row">
                        <span>IG: <strong>@${spec.instagram}</strong></span>
                        <button class="spec-copy-btn" data-copy="@${spec.instagram}" title="Copiar Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </button>
                    </div>
                ` : ''}

                ${spec.fed ? `
                    <div class="spec-info-row">
                        <span>Matrícula: <strong>${spec.fed}</strong></span>
                        <button class="spec-copy-btn" data-copy="${spec.fed}" title="Copiar Matrícula">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </button>
                    </div>
                ` : ''}

                ${activitiesHtml}
                
                ${driveLinkHtml}
            `;

            // Bind click handlers
            const warningBadge = card.querySelector(".warning-badge");
            if (warningBadge) {
                warningBadge.addEventListener("click", () => {
                    openSpecialistModal(spec.id);
                });
            }

            card.querySelector(".spec-card-edit-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                openSpecialistModal(spec.id);
            });

            card.querySelector(".spec-card-delete-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                deleteSpecialist(spec.id);
            });

            card.querySelectorAll(".spec-copy-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const text = btn.getAttribute("data-copy");
                    copyToClipboard(text);
                    showToast(`Copiado: "${text}"`);
                });
            });

            specialistsListContainer.appendChild(card);
        });
    }

    // Modal Specialist Operations
    function openSpecialistModal(specId = null) {
        activeSpecId = specId;
        
        if (specId) {
            specialistModalBadge.textContent = "Editar Especialista";
            const spec = specialistsDirectory.find(s => s.id === specId);
            if (spec) {
                specNameInput.value = spec.rawName;
                specRoleInput.value = spec.role;
                specInstaInput.value = spec.instagram;
                specFedInput.value = spec.fed;
                specDobInput.value = spec.birthdateVal || "";
                specDriveInput.value = spec.driveLink || "";
            }
        } else {
            specialistModalBadge.textContent = "Agregar Especialista";
            specNameInput.value = "";
            specRoleInput.value = "Terapia Ocupacional";
            specInstaInput.value = "";
            specFedInput.value = "";
            specDobInput.value = "";
            specDriveInput.value = "";
        }
        
        specialistModal.classList.add("active");
    }

    function closeSpecialistModal() {
        specialistModal.classList.remove("active");
        activeSpecId = null;
    }

    function saveSpecialist() {
        const name = specNameInput.value.trim();
        const role = specRoleInput.value;
        const insta = specInstaInput.value.trim().replace(/^@/, "");
        const fed = specFedInput.value.trim();
        const dobVal = specDobInput.value;
        const driveLinkVal = specDriveInput.value.trim();

        if (!name) {
            alert("Por favor ingresa el nombre completo del especialista.");
            return;
        }

        let birthdayStr = null;
        if (dobVal) {
            const parts = dobVal.split("-");
            if (parts.length === 3) {
                const month = parseInt(parts[1], 10);
                const day = parseInt(parts[2], 10);
                birthdayStr = `${day} de ${monthOrder[month - 1]}`;
            }
        }

        if (activeSpecId) {
            // Edit existing
            const spec = specialistsDirectory.find(s => s.id === activeSpecId);
            if (spec) {
                spec.rawName = name;
                spec.role = role;
                spec.instagram = insta;
                spec.fed = fed;
                spec.birthdate = birthdayStr;
                spec.birthdateVal = dobVal;
                spec.driveLink = driveLinkVal;
            }
            showToast("Especialista actualizado.");
        } else {
            // Add new
            const newId = cleanSpecialistName(name);
            // Check duplicate ID
            if (specialistsDirectory.some(s => s.id === newId)) {
                alert("Ya existe un especialista registrado con ese nombre.");
                return;
            }
            
            specialistsDirectory.push({
                id: newId,
                rawName: name,
                role: role,
                instagram: insta,
                fed: fed,
                birthdate: birthdayStr,
                birthdateVal: dobVal,
                driveLink: driveLinkVal,
                isDefault: false
            });
            showToast("Especialista agregado.");
        }

        saveSpecialistsDirectory();
        closeSpecialistModal();
        buildSpecialistsDirectory();
        renderEventsAndBirthdays();
    }

    function deleteSpecialist(specId) {
        const spec = specialistsDirectory.find(s => s.id === specId);
        if (!spec) return;

        if (confirm(`¿Estás seguro de que deseas eliminar a ${spec.rawName}?`)) {
            specialistsDirectory = specialistsDirectory.filter(s => s.id !== specId);
            saveSpecialistsDirectory();
            buildSpecialistsDirectory();
            renderEventsAndBirthdays();
            showToast("Especialista eliminado.");
        }
    }

    // Fuzzy matching profiles
    function cleanSpecialistName(name) {
        return name.toLowerCase()
            .replace(/^(lcda\.|lic\.|ltd\.|f\.t|t\.o|doc\.|ps\.|nt\.|pp\.)\s+/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    function findSpecialistProfile(rawName) {
        // Look up by prefix or name similarity
        const cleanQuery = cleanSpecialistName(rawName);
        let match = null;
        
        Object.keys(planningData).forEach(sheetName => {
            planningData[sheetName].rows.forEach(r => {
                if (r["NOMBRE Y APELLIDO"]) {
                    const names = splitSpecialistNames(r["NOMBRE Y APELLIDO"]);
                    const instas = r.INSTAGRAM ? r.INSTAGRAM.split(/\s+/).filter(n => n.trim().length > 0) : [];
                    names.forEach((n, idx) => {
                        if (cleanSpecialistName(n) === cleanQuery && instas[idx]) {
                            match = { instagram: instas[idx].trim() };
                        }
                    });
                }
            });
        });
        return match;
    }

    function findBirthday(rawName) {
        const cleanName = cleanSpecialistName(rawName);
        
        // Exact clean match first
        let match = birthdaysList.find(b => cleanSpecialistName(b.name) === cleanName);
        
        // Fuzzy lookup fallback
        if (!match) {
            match = birthdaysList.find(b => {
                const bClean = cleanSpecialistName(b.name);
                return cleanName.includes(bClean) || bClean.includes(cleanName);
            });
        }
        return match;
    }

    function findSpecialistActivities(rawName) {
        const cleanName = cleanSpecialistName(rawName);
        const acts = [];
        
        Object.keys(planningData).forEach(sheetName => {
            planningData[sheetName].rows.forEach(r => {
                if (r["NOMBRE Y APELLIDO"]) {
                    const names = splitSpecialistNames(r["NOMBRE Y APELLIDO"]);
                    const matched = names.some(n => {
                        const cn = cleanSpecialistName(n);
                        return cn.includes(cleanName) || cleanName.includes(cn);
                    });
                    
                    if (matched) {
                        acts.push({
                            title: r.TITULO || r["ENFOQUE DEL TEMA"] || "Actividad sin título",
                            month: r.MES
                        });
                    }
                }
            });
        });
        return acts;
    }

    // Birthday adder modal
    function openBirthdayModal(specName) {
        activeBirthdaySpecName = specName;
        birthdaySpecName.textContent = specName;
        birthdayDateInput.value = "";
        birthdayModal.classList.add("active");
    }

    function closeBirthdayModal() {
        birthdayModal.classList.remove("active");
        activeBirthdaySpecName = null;
    }

    birthdaySaveBtn.addEventListener("click", () => {
        const dateVal = birthdayDateInput.value;
        if (dateVal && activeBirthdaySpecName) {
            customBirthdays[activeBirthdaySpecName] = dateVal;
            localStorage.setItem("ocupamor_custom_birthdays", JSON.stringify(customBirthdays));
            
            // Reload list and directory
            loadBirthdaysAndEvents();
            buildSpecialistsDirectory();
            renderEventsAndBirthdays();
            uploadLocalStateToFirebase();
            
            showToast(`Fecha de cumpleaños guardada para ${activeBirthdaySpecName}`);
            closeBirthdayModal();
        } else {
            alert("Por favor selecciona una fecha válida.");
        }
    });

    birthdayCancelBtn.addEventListener("click", closeBirthdayModal);
    birthdayCloseBtn.addEventListener("click", closeBirthdayModal);

    // ------------------------------------------
    // DRAG AND DROP HANDLERS (GLOBAL LEVEL)
    // ------------------------------------------
    window.allowDrop = function(e) {
        e.preventDefault();
    };

    window.drop = function(e, targetStatus) {
        e.preventDefault();
        const cardKey = e.dataTransfer.getData("text/plain");
        if (cardKey) {
            progressState[cardKey] = targetStatus;
            saveProgressState();
            showToast(`Estado de diseño movido a "${targetStatus}"`);
            renderActiveView();
        }
    };

    // ------------------------------------------
    // EXCEL IMPORT PARSER
    // ------------------------------------------
    function handleExcelFile(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {
                    type: "array",
                    cellDates: true,
                    dateNF: "yyyy-mm-dd"
                });
                
                const newPlanningData = {};
                
                workbook.SheetNames.forEach(sheetName => {
                    if (sheetName.startsWith("PLANIFICACION") || sheetName.startsWith("Hoja")) {
                        const sheet = workbook.Sheets[sheetName];
                        const jsonRows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });
                        if (jsonRows.length === 0) return;
                        
                        let headerRowIdx = -1;
                        let headers = [];
                        
                        for (let r = 0; r < Math.min(25, jsonRows.length); r++) {
                            const row = jsonRows[r];
                            if (row.some(val => val && typeof val === 'string' && ['MES', 'MESES'].includes(val.trim().toUpperCase()))) {
                                headerRowIdx = r;
                                headers = row.map((val, colIdx) => val ? val.toString().trim() : `Col${colIdx}`);
                                break;
                            }
                        }
                        
                        if (headerRowIdx === -1) {
                            headerRowIdx = sheetName.includes("NT") ? 6 : 11;
                            if (jsonRows.length > headerRowIdx) {
                                headers = jsonRows[headerRowIdx].map((val, colIdx) => val ? val.toString().trim() : `Col${colIdx}`);
                            } else {
                                return;
                            }
                        }
                        
                        const mesColIdx = headers.findIndex(h => ['MES', 'MESES'].includes(h.toUpperCase()));
                        if (mesColIdx === -1) return;
                        
                        newPlanningData[sheetName] = {
                            headers: headers,
                            rows: []
                        };
                        
                        for (let r = headerRowIdx + 1; r < jsonRows.length; r++) {
                            const row = jsonRows[r];
                            if (!row || row.length === 0) continue;
                            
                            const mesVal = row[mesColIdx];
                            if (mesVal && typeof mesVal === 'string' && mesVal.trim().length > 0) {
                                const rowDict = {};
                                headers.forEach((h, colIdx) => {
                                    const colName = h.startsWith("Col") ? `Col${colIdx}` : h;
                                    rowDict[colName] = (row[colIdx] !== undefined && row[colIdx] !== null) ? row[colIdx].toString().trim() : null;
                                });
                                
                                const hasRealContent = Object.keys(rowDict).some(k => rowDict[k] !== null && k !== "MES" && !k.startsWith("Col"));
                                if (hasRealContent) {
                                    rowDict["_row_number"] = r + 1;
                                    newPlanningData[sheetName].rows.push(rowDict);
                                }
                            }
                        }
                    }
                });

                if (Object.keys(newPlanningData).length === 0) {
                    showToast("No se encontraron pestañas de planificación válidas en el Excel.");
                    return;
                }

                // Restore custom activities into new sheets
                customActivities.forEach(act => {
                    const sheet = act._sheetName;
                    if (newPlanningData[sheet]) {
                        newPlanningData[sheet].rows.push(act);
                    }
                });

                planningData = newPlanningData;
                localStorage.setItem("ocupamor_custom_planning", JSON.stringify(planningData));
                
                buildMonthTabs();
                buildAreaFilters();
                buildSpecialistsDirectory();
                updateActiveMonthView();
                uploadLocalStateToFirebase();
                
                showToast("¡Excel importado con éxito! Se respetaron las actividades personalizadas.");
            } catch (err) {
                console.error(err);
                showToast("Error al analizar el Excel.");
            }
        };
        reader.readAsArrayBuffer(file);
    }

    // ------------------------------------------
    // GENERAL UTILITY HELPERS
    // ------------------------------------------
    function copyToClipboard(text) {
        const temp = document.createElement("textarea");
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }

    function splitSpecialistNames(nameStr) {
        if (!nameStr) return [];
        
        // 1. Get all known specialist names from birthdaysList and assetsData
        const knownNames = [];
        if (window.DEFAULT_BIRTHDAYS) {
            window.DEFAULT_BIRTHDAYS.forEach(b => knownNames.push(b.name));
        }
        if (window.DEFAULT_ASSETS) {
            Object.keys(window.DEFAULT_ASSETS).forEach(area => {
                Object.keys(window.DEFAULT_ASSETS[area]).forEach(spec => {
                    const clean = spec.replace(/^(T\.O|F\.T|PS\.|NT\.|PP\.|TL|DOC\.)\s+/g, "").replace("-", " ").trim();
                    knownNames.push(clean);
                });
            });
        }
        
        // Add custom birthdays names
        const storedCustomBirthdays = localStorage.getItem("ocupamor_custom_birthdays");
        if (storedCustomBirthdays) {
            try {
                const cb = JSON.parse(storedCustomBirthdays);
                Object.keys(cb).forEach(name => knownNames.push(name));
            } catch(e){}
        }

        // Clean duplicates
        const uniqueKnown = Array.from(new Set(knownNames.map(n => n.trim()))).filter(n => n.length > 0);
        
        // 2. Try to find matches of known names in nameStr
        const matchedNames = [];
        
        // Sort uniqueKnown by length descending to match longer names first
        uniqueKnown.sort((a, b) => b.length - a.length);
        
        const cleanNameStr = nameStr.replace(/\s+/g, " ").trim();
        const cleanNameStrLower = cleanNameStr.toLowerCase();
        
        // We find which known names are substrings of cleanNameStr
        const foundKnown = [];
        uniqueKnown.forEach(known => {
            const knownLower = known.toLowerCase();
            const idx = cleanNameStrLower.indexOf(knownLower);
            if (idx !== -1) {
                foundKnown.push({
                    name: known,
                    start: idx,
                    end: idx + known.length
                });
            }
        });

        // If we found some known names, let's sort them by start index and return them if they don't overlap
        if (foundKnown.length > 0) {
            foundKnown.sort((a, b) => a.start - b.start);
            const nonOverlapping = [];
            let lastEnd = -1;
            foundKnown.forEach(item => {
                if (item.start >= lastEnd) {
                    nonOverlapping.push(item.name);
                    lastEnd = item.end;
                }
            });
            
            if (nonOverlapping.length > 0) {
                return nonOverlapping;
            }
        }

        // 3. Fallback: split by newlines, double spaces, or commas
        return nameStr.split(/\r?\n|\s{2,}|,\s*/).map(n => n.trim()).filter(n => n.length > 0);
    }

    function parseAndFormatDate(excelDate, dayOfWeekStr) {
        if (!excelDate) return dayOfWeekStr || "Por definir";
        if (excelDate.includes("T")) {
            const dateParts = excelDate.split("T")[0].split("-");
            if (dateParts.length === 3) {
                const year = dateParts[0];
                const month = dateParts[1];
                const day = dateParts[2];
                const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
                const parsedMonth = parseInt(month, 10) - 1;
                
                let outStr = `${day} de ${monthNames[parsedMonth] || month}`;
                if (dayOfWeekStr) {
                    outStr = `${dayOfWeekStr.substring(0, 3)}. ${outStr}`;
                }
                return outStr;
            }
        }
        return excelDate;
    }

    function getAvatarsHtml(nameStr) {
        if (!nameStr) return "";
        const names = splitSpecialistNames(nameStr);
        let avatars = "";
        
        names.forEach((name, idx) => {
            if (idx < 3) {
                const parts = name.trim().split(" ");
                let initials = "";
                if (parts.length > 0) {
                    initials += parts[0][0] || "";
                    if (parts.length > 1 && !parts[1].toLowerCase().includes("lcda") && !parts[1].toLowerCase().includes("ltd")) {
                        initials += parts[1][0] || "";
                    } else if (parts.length > 2) {
                        initials += parts[2][0] || "";
                    }
                }
                const colors = ["#B7E000", "#1EDB8F", "#6A2CFF", "#FF2E7A", "#4F46E5", "#06B6D4"];
                const colorIdx = (name.length + idx) % colors.length;
                avatars += `<div class="spec-avatar" style="background-color: ${colors[colorIdx]}" title="${name.trim()}">${initials.toUpperCase()}</div>`;
            }
        });
        
        if (names.length > 3) {
            avatars += `<div class="spec-avatar" style="background-color: var(--gris-texto);" title="Y otros">+${names.length - 3}</div>`;
        }
        return avatars;
    }

    // ------------------------------------------
    // EVENT LISTENERS REGISTER
    // ------------------------------------------
    function registerEventListeners() {
        excelDropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            excelDropZone.classList.add("dragover");
        });
        
        excelDropZone.addEventListener("dragleave", () => {
            excelDropZone.classList.remove("dragover");
        });
        
        excelDropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            excelDropZone.classList.remove("dragover");
            handleExcelFile(e.dataTransfer.files[0]);
        });

        excelInput.addEventListener("change", (e) => {
            handleExcelFile(e.target.files[0]);
        });

        resetDataBtn.addEventListener("click", resetData);

        // Filters listeners
        searchInput.addEventListener("input", (e) => {
            filters.text = e.target.value;
            renderActiveView();
        });

        filterArea.addEventListener("change", (e) => {
            filters.area = e.target.value;
            renderActiveView();
        });

        filterFormat.addEventListener("change", (e) => {
            filters.format = e.target.value;
            renderActiveView();
        });

        filterStatus.addEventListener("change", (e) => {
            filters.status = e.target.value;
            renderActiveView();
        });

        // View mode toggles
        btnViewGrid.addEventListener("click", () => toggleView("grid"));
        btnViewKanban.addEventListener("click", () => toggleView("kanban"));
        btnViewTable.addEventListener("click", () => toggleView("table"));

        // New design trigger
        btnNewActivity.addEventListener("click", () => openNewActivityModal());

        // Close modal listeners
        modalCloseBtn.addEventListener("click", closeDetailModal);

        // Sidebar Toggle
        if (sidebarToggleBtn && appBody) {
            sidebarToggleBtn.addEventListener("click", () => {
                appBody.classList.toggle("sidebar-collapsed");
            });
        }

        // Specialist Manager Modals
        if (btnAddSpecialist) {
            btnAddSpecialist.addEventListener("click", () => openSpecialistModal());
        }
        if (specialistModalCloseBtn) {
            specialistModalCloseBtn.addEventListener("click", closeSpecialistModal);
        }
        if (specCancelBtn) {
            specCancelBtn.addEventListener("click", closeSpecialistModal);
        }
        if (specSaveBtn) {
            specSaveBtn.addEventListener("click", saveSpecialist);
        }
        
        window.addEventListener("click", (e) => {
            if (e.target === detailModal) closeDetailModal();
            if (e.target === birthdayModal) closeBirthdayModal();
            if (e.target === specialistModal) closeSpecialistModal();
        });

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                if (detailModal.classList.contains("active")) closeDetailModal();
                if (birthdayModal.classList.contains("active")) closeBirthdayModal();
                if (specialistModal.classList.contains("active")) closeSpecialistModal();
            }
        });
    }

    function toggleView(viewName) {
        currentView = viewName;
        btnViewGrid.classList.toggle("active", viewName === "grid");
        btnViewKanban.classList.toggle("active", viewName === "kanban");
        btnViewTable.classList.toggle("active", viewName === "table");
        renderActiveView();
    }

    // Run app
    init();
});
