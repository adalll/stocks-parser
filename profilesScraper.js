const chalk = require('chalk');

const puppeteer = require('puppeteer');
const LAUNCH_PUPPETEER_OPTS = {
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
        // "--proxy-server=socks5://127.0.0.1:9999"
    ]
};
const PAGE_PUPPETEER_OPTS = {
    networkIdle2Timeout: 5000,
    waitUntil: 'networkidle2',
    timeout: 0
};

const profilesScraper = async (profileId, pageURL) => {
    const browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    let profileObject = {};
    try {
        await page.goto(pageURL, PAGE_PUPPETEER_OPTS);
        const enter = await page.$('[href="#"]');
        await enter.click();
        await page.setViewport({ width: 1200, height: 800 });
        const profileURL = pageURL + '/escort/-' + profileId;
        await page.goto(profileURL);

        let aboutMeFr = await page.evaluate(() => {
            const aboutMeSelector = '#profile-container > div.about-block > div.about-text';
            if (document.querySelector(aboutMeSelector) !== null) {
                aboutMeFr = document.querySelector(aboutMeSelector).innerText;
                return aboutMeFr;
            } else { return ''}
        });

        await page.goto(profileURL + '?ln=en');

        profileObject = await page.evaluate((profileId, aboutMeFr) => {

            let verification, suspicious, suspiciousBefore, homeCity,
                ethnicity, nationality, age, eyes, hair, hairLength, publicHair, tattoo, piercing, height, weight, bustWaistHip, bust, waist, hip, cupSize, breast, shoeSize, dressSize, smoker, drinking,
                availableForIncall, availableForOutcall, aboutMeEn,
                duration, durationUnits,
                tourCity, tourPhone, fromDate, toDate,
                cityZones, availableIn, phoneNumber, appsAvailable, appsAvailableArray, whatsApp, viber, phoneInstructions, noWithheldNumbers, otherPhoneInstructions,
                available247,
                mondayOpen, mondayClose, tuesdayOpen, tuesdayClose, wednesdayOpen, wednesdayClose, thursdayOpen, thursdayClose, fridayOpen, fridayClose, saturdayOpen, saturdayClose, sundayOpen, sundayClose,
                mondayWorkingTimeArray, tuesdayWorkingTimeArray, wednesdayWorkingTimeArray, thursdayWorkingTimeArray, fridayWorkingTimeArray, saturdayWorkingTimeArray, sundayWorkingTimeArray,
                profileFriends;

            let additionalInfoObject = {};

            let profileIncallPrices = [];
            let profileIncallDuration = [];
            let profileIncallDurationUnits = [];
            let profileIncallRates = [];
            let profileOutcallPrices = [];
            let profileOutcallDuration = [];
            let profileOutcallDurationUnits = [];
            let profileOutcallRates = [];

            let datesAndTimeArray = [];
            let datesArray = [];
            let currentTourAssociative = {};
            let currentTourObject = {};
            let upcomingToursArray = [];

            let contactsArrayObject = {};

            let profileWorkingTimeObject = {};

            let mainPhotoAlbum = [];

            const shownameSelector = '#profile-container > div.head.info > span';
            const mainInfoTitleSelector = '#profile-container > div > table > tbody > tr > th';
            const mainInfoContentSelector = '#profile-container > div > table > tbody > tr > td';
            const additionalInfoClassesSelector = '#profile-container > table > tbody > tr > td > span';
            const languagesLabelSelector = '#profile-container > table > tbody > tr > td > span';
            const availableForSelector = '#profile-container > table > tbody > tr > td > span.incall';
            const additionalInfoLabelSelector = '#profile-container > table > tbody > tr > th';
            const additionalInfoContentSelector = '#profile-container > table > tbody > tr > td';
            const aboutMeSelector = '#profile-container > div.about-block > div.about-text';
            let profileIncallPricesSelector = '#profile-container > div.block.rates > table.incall > tbody > tr > td';
            let profileIncallDurationSelector = '#profile-container > div.block.rates > table.incall > tbody > tr > th';
            let profileOutcallPricesSelector = '#profile-container > div.block.rates > table.outcall > tbody > tr > td';
            let profileOutcallDurationSelector = '#profile-container > div.block.rates > table.outcall > tbody > tr > th';
            let profileToursCitySelector = '#profile-container > div.block.tours > div.current';
            let profileUpcomingToursSelector = '#profile-container > div.block.tours > div.upcoming';
            let contactsSelectorLabel = '#profile-container > div.new_contacts > div > div.contactTab.block.contact > div > table.contact_info_table > tbody > tr > th';
            let contactsSelectorContent = '#profile-container > div.new_contacts > div > div.contactTab.block.contact > div > table.contact_info_table > tbody > tr > td';
            let workingDaysSelector = '#profile-container > div.new_contacts > div > div.contactTab.block.contact > div > table.working-times > tbody > tr > th';
            let workingTimeSelector = '#profile-container > div.new_contacts > div > div.contactTab.block.contact > div > table.working-times > tbody > tr > td';
            let profileFriendsSelector = '#studigirls';
            let photosVisible = '#gallery-content-0 > div > a > img';
            let photosHide = '#gallery-content-0 > div.more-photos > div > div > a > img';

            // HEAD INFO BLOCK

            document.querySelector('#left > div.mb45') !== null && document.querySelector('#gallery-content-0 > div > a > span.susp-big-icon-p') == null ? verification = false : verification = true;
            document.querySelector('#left > div.mb45') !== null && document.querySelector('#gallery-content-0 > div > a > span.susp-big-icon-p') !== null ? suspicious = true : suspicious = false;
            document.querySelector('#profile-container > div > img') !== null ? suspiciousBefore = true : suspiciousBefore = false;

            // MAIN INFO
            if (document.querySelector(shownameSelector) !== null) {
                const showname = document.querySelector(shownameSelector).innerText;
                const mainInfoTitle = Array.from(document.querySelectorAll(mainInfoTitleSelector)).map(item => item.innerText);
                const mainInfoContent = Array.from(document.querySelectorAll(mainInfoContentSelector)).map(item => item.innerText);
                let mainInfoObj = {};
                for (let i = 0; i < mainInfoContent.length; i++) {
                    mainInfoObj[mainInfoTitle[i]] = mainInfoContent[i];
                }
                if (mainInfoObj['Bust-Waist-Hip:'] !== undefined) {
                    bustWaistHip = mainInfoObj['Bust-Waist-Hip:'].split('-');
                    bust = parseInt(bustWaistHip[0]);
                    waist = parseInt(bustWaistHip[1]);
                    hip = parseInt(bustWaistHip[2]);
                } else { bust = ''; waist = ''; hip = ''; }


                // ADDITIONAL INFO

                let additionalInfoLabelArray = Array.from(document.querySelectorAll(additionalInfoLabelSelector)).map(item => item.innerText);
                let additionalInfoContentArray = Array.from(document.querySelectorAll(additionalInfoContentSelector)).map(item => item.innerText);
                for (let i = 0; i < additionalInfoLabelArray.length; i++){
                    additionalInfoObject[additionalInfoLabelArray[i]] = additionalInfoContentArray[i]
                }

                const meetingWith = additionalInfoObject['Meeting with:'];
                let meetingWithArray = meetingWith.split(' ');
                function meetingWithChecker (meetingWithValue){
                    return meetingWithArray.includes(meetingWithValue)
                }

                let availableForIncall, availableForOutcall, aboutMeEn;

                const additionalInfoClasses = Array.from(document.querySelectorAll(additionalInfoClassesSelector)).map(item => item.className);
                const languagesLabel = Array.from(document.querySelectorAll(languagesLabelSelector)).map(item => item.innerText);

                function getLanguageLevel (languageLevel, languageValue) {
                    if (languagesLabel.includes(languageValue)) {
                        let index = languagesLabel.indexOf(languageValue);
                        let levelIndex = index + 1;
                        while (additionalInfoClasses[levelIndex] === 'star-y') {
                            languageLevel = languageLevel + 1;
                            levelIndex = levelIndex + 1;
                        }
                    }
                    return languageLevel;
                }

                let languageLevel = 0;

                if (additionalInfoClasses.includes('incall')) {
                    availableForIncall = document.querySelector(availableForSelector).innerText
                        .replace(/^(Incall: )|(\s)$/g, "");
                    if (availableForIncall.includes('Hotel room') && Array.from(document.querySelectorAll(availableForSelector + ' > img')).length > 0) {
                        const hotelStars = Array.from(document.querySelectorAll(availableForSelector + ' > img')).length;
                        availableForIncall = availableForIncall.replace(/\s+$/g, ' ' + hotelStars + '*');
                    }
                } else { availableForIncall = '' }

                if (additionalInfoClasses.includes('outcall')) {
                    availableForOutcall = document.querySelector('#profile-container > table > tbody > tr > td > span.outcall').innerText.replace("Outcall: ", "");
                } else { availableForOutcall = '' }

                // RATES INFO

                if (document.querySelector(profileIncallPricesSelector) !== null) {
                    profileIncallPrices = Array.from(document.querySelectorAll(profileIncallPricesSelector)).map(item => parseInt(item.innerText.replace(/\s+/g,'')) );
                    profileIncallPrices.splice(0, 1);
                    profileIncallDuration = Array.from(document.querySelectorAll(profileIncallDurationSelector)).map(item => item.innerText.replace(/\s?:\s?/g, ''));
                    for(let i = 0; i < profileIncallPrices.length; i++) {
                        if (profileIncallDuration[i] !== 'overnight' && profileIncallDuration[i] !== 'additional hour' && profileIncallDuration[i] !== 'weekend' && profileIncallDuration[i] !== 'dinner date'){
                            profileIncallDurationUnits = profileIncallDuration[i].split(/\s/);
                            duration = parseInt(profileIncallDurationUnits[0]);
                            durationUnits = profileIncallDurationUnits[1];
                        } else {
                            duration = 1;
                            durationUnits = profileIncallDuration[i];
                        }
                        profileIncallRates.push({
                            duration: duration,
                            durationUnits: durationUnits,
                            price: profileIncallPrices[i]
                        });
                    }
                }
                if (document.querySelector(profileOutcallPricesSelector) !== null) {
                    profileOutcallPrices = Array.from(document.querySelectorAll(profileOutcallPricesSelector)).map(item => item.innerText.replace(/\s+/g,''));
                    profileOutcallPrices.splice(0, 1);
                    profileOutcallDuration = Array.from(document.querySelectorAll(profileOutcallDurationSelector)).map(item => item.innerText.replace(/\s?:\s?/g, ''));
                    for(let i = 0; i < profileOutcallPrices.length; i++) {
                        if (profileOutcallDuration[i] !== 'overnight' && profileOutcallDuration[i] !== 'additional hour' && profileOutcallDuration[i] !== 'weekend' && profileOutcallDuration[i] !== 'dinner date'){
                            profileOutcallDurationUnits = profileOutcallDuration[i].split(/\s/);
                            duration = profileOutcallDurationUnits[0];
                            durationUnits = profileOutcallDurationUnits[1];
                        } else {
                            duration = 1;
                            durationUnits = profileOutcallDuration[i];
                        }
                        profileOutcallRates.push({
                            duration: duration,
                            durationUnits: durationUnits,
                            price: profileOutcallPrices[i]
                        });
                    }
                }

                // TOURS INFO

                if (document.querySelector(profileToursCitySelector) !== null) {
                    let currentTourLabel = Array.from(document.querySelectorAll('#profile-container > div.block.tours > div.current > table > tbody > tr > th')).map(item => item.innerText);
                    let currentTourContent = Array.from(document.querySelectorAll('#profile-container > div.block.tours > div.current > table > tbody > tr > td')).map(item => item.innerText);
                    for (let i = 0; i < currentTourLabel.length; i++) {
                        currentTourAssociative[currentTourLabel[i]] = currentTourContent[i];
                    }
                    if (currentTourAssociative['Tour phone:'] !== undefined) {
                        tourPhone = currentTourAssociative['Tour phone:']
                    } else {tourPhone = ''}
                    currentTourAssociative['Date:'].split('-').map(item => {
                        if (item.includes(' , ')){
                            item.split(' , ').map(item => {
                                datesAndTimeArray.push(item);
                            });
                        } else datesArray.push(item);
                    });
                    if (datesAndTimeArray.length > 0){
                        fromDate = new Date(datesAndTimeArray[0] + ' ' + datesAndTimeArray[1]).getTime();
                        toDate = new Date(datesAndTimeArray[2] + ' ' + datesAndTimeArray[3]).getTime();
                    } else {
                        fromDate = new Date(datesArray[0]).getTime();
                        toDate = new Date(datesArray[1]).getTime();
                    }
                    tourCity = document.querySelector('#profile-container > div.block.tours > div.current > p > a').innerText;
                    currentTourObject = {
                        tourCity: tourCity,
                        fromDate: fromDate,
                        toDate: toDate,
                        tourPhone: tourPhone
                    }
                }

                if(document.querySelector(profileUpcomingToursSelector) !== null){
                    let upcomingToursLabel = Array.from(document.querySelectorAll('#profile-container > div.block.tours > div.upcoming > table > tbody > tr > th')).map(item => item.innerText);
                    let upcomingToursContent = Array.from(document.querySelectorAll('#profile-container > div.block.tours > div.upcoming > table > tbody > tr > td')).map(item => item.innerText);
                    for (let i = 0; i < upcomingToursLabel.length; i++) {
                        while (upcomingToursLabel[i] !== 'Status:') {
                            let upcomingDatesAndTimeArray = [];
                            let upcomingDatesArray = [];
                            if (upcomingToursLabel[i] === 'Visiting:') {
                                tourCity = upcomingToursContent[i];
                                i++;
                            } else if (upcomingToursLabel[i] === 'Date:') {
                                upcomingToursContent[i].split('-').map(item => {
                                    if (item.includes(' , ')){
                                        item.split(' , ').map(item => {
                                            upcomingDatesAndTimeArray.push(item);
                                        });
                                    } else upcomingDatesArray.push(item);
                                });
                                if (upcomingDatesAndTimeArray.length > 0){
                                    fromDate = new Date(upcomingDatesAndTimeArray[0] + ' ' + upcomingDatesAndTimeArray[1]).toString();
                                    toDate = new Date(upcomingDatesAndTimeArray[2] + ' ' + upcomingDatesAndTimeArray[3]).toString();
                                } else {
                                    fromDate = new Date(upcomingDatesArray[0]);
                                    toDate = new Date(upcomingDatesArray[1]);
                                }
                                i++;
                            } else if (upcomingToursLabel[i] === 'Tour phone:') {
                                tourPhone = upcomingToursContent[i];
                                i++;
                            }
                        }
                        if (tourPhone === undefined) {
                            tourPhone = '';
                        }
                        upcomingToursArray.push({
                            tourCity: tourCity,
                            fromDate: fromDate,
                            toDate: toDate,
                            tourPhone: tourPhone
                        });
                    }
                } else {
                    upcomingToursArray = [];
                }

                // CONTACTS

                let contactsLabelArray = Array.from(document.querySelectorAll(contactsSelectorLabel)).map(item => item.innerText);
                let contactsContentArray = Array.from(document.querySelectorAll(contactsSelectorContent)).map(item => item.innerText);
                for (let i = 0; i < contactsLabelArray.length; i++){
                    contactsArrayObject[contactsLabelArray[i]] = contactsContentArray[i]
                }
                let baseCity = contactsArrayObject['Base city:'];
                if (contactsArrayObject['Cityzones:'] !== undefined) {
                    cityZones = contactsArrayObject['Cityzones:'].split(/,\xA0\s/g);
                } else { cityZones = [] }
                if (contactsArrayObject['Available in:'] !== undefined){
                    availableIn = contactsArrayObject['Available in:'].split(/,\xA0\s/g);
                } else { availableIn = [] }
                if (contactsArrayObject['Phone:'] !== undefined){
                    phoneNumber = contactsArrayObject['Phone:']
                } else { phoneNumber = '' }
                if (contactsArrayObject['Apps Available:'] !== undefined) {
                    appsAvailableArray = Array.from(document.querySelectorAll(contactsSelectorContent + ' > div')).map(item => item.className);
                    appsAvailableArray.includes('whatsapp') === true ? whatsApp = true : whatsApp = false;
                    appsAvailableArray.includes('viber') === true ? viber = true : viber = false;

                    appsAvailable = {
                        whatsApp,
                        viber
                    }
                } else { appsAvailable = {
                    whatsApp: false,
                    viber: false
                } }
                if (contactsArrayObject['Phone instructions:'] !== undefined){
                    phoneInstructions = contactsArrayObject['Phone instructions:'].split(', ');
                    phoneInstructions [1] === 'No Withheld Numbers' ? noWithheldNumbers = true : noWithheldNumbers = false;
                    phoneInstructions = phoneInstructions [0];
                } else {
                    phoneInstructions = '';
                    noWithheldNumbers = false
                }
                if (contactsArrayObject['Other phone instructions:'] !== undefined){
                    otherPhoneInstructions = contactsArrayObject['Other phone instructions:']
                } else { otherPhoneInstructions = '' }

                // WORKING TIME INFO

                if (document.querySelector(workingTimeSelector) !== null){
                    let workingDays = Array.from(document.querySelectorAll(workingDaysSelector)).map(item => item.innerText);
                    let workingTime = Array.from(document.querySelectorAll(workingTimeSelector)).map(item => item.innerText);
                    if (document.querySelector(workingTimeSelector).innerText === 'I am available 24/7'){
                        available247 = true;
                        profileWorkingTimeObject = {
                            available247: available247,
                            monday: {
                                open: '',
                                close: ''
                            },
                            tuesday: {
                                open: '',
                                close: ''
                            },
                            wednesday: {
                                open: '',
                                close: ''
                            },
                            thursday: {
                                open: '',
                                close: ''
                            },
                            friday: {
                                open: '',
                                close: ''
                            },
                            saturday: {
                                open: '',
                                close: ''
                            },
                            sunday: {
                                open: '',
                                close: ''
                            }
                        };
                    } else
                    {
                        available247 = false;
                        let workingObject = {};
                        for (let i = 0; i < workingDays.length; i++) {
                            workingObject[workingDays[i]] = workingTime[i];
                        }

                        if (workingObject['Monday:'] !== undefined){
                            mondayWorkingTimeArray = workingObject['Monday:'].split(' - ');
                            mondayOpen = mondayWorkingTimeArray[0];
                            mondayClose = mondayWorkingTimeArray[1];
                        } else {
                            mondayOpen = '';
                            mondayClose = '';
                        }
                        if (workingObject['Tuesday:'] !== undefined){
                            tuesdayWorkingTimeArray = workingObject['Tuesday:'].split(' - ');
                            tuesdayOpen = tuesdayWorkingTimeArray[0];
                            tuesdayClose = tuesdayWorkingTimeArray[1];
                        } else {
                            tuesdayOpen = '';
                            tuesdayClose = '';
                        }
                        if (workingObject['Wednesday:'] !== undefined){
                            wednesdayWorkingTimeArray = workingObject['Wednesday:'].split(' - ');
                            wednesdayOpen = wednesdayWorkingTimeArray[0];
                            wednesdayClose = wednesdayWorkingTimeArray[1];
                        } else {
                            wednesdayOpen = '';
                            wednesdayClose = '';
                        }
                        if (workingObject['Thursday:'] !== undefined){
                            thursdayWorkingTimeArray = workingObject['Thursday:'].split(' - ');
                            thursdayOpen = thursdayWorkingTimeArray[0];
                            thursdayClose = thursdayWorkingTimeArray[1];
                        } else {
                            thursdayOpen = '';
                            thursdayClose = '';
                        }
                        if (workingObject['Friday:'] !== undefined){
                            fridayWorkingTimeArray = workingObject['Friday:'].split(' - ');
                            fridayOpen = fridayWorkingTimeArray[0];
                            fridayClose = fridayWorkingTimeArray[1];
                        } else {
                            fridayOpen = '';
                            fridayClose = '';
                        }
                        if (workingObject['Saturday:'] !== undefined){
                            saturdayWorkingTimeArray = workingObject['Saturday:'].split(' - ');
                            saturdayOpen = saturdayWorkingTimeArray[0];
                            saturdayClose = saturdayWorkingTimeArray[1];
                        } else {
                            saturdayOpen = '';
                            saturdayClose = '';
                        }
                        if (workingObject['Sunday:'] !== undefined){
                            sundayWorkingTimeArray = workingObject['Sunday:'].split(' - ');
                            sundayOpen = sundayWorkingTimeArray[0];
                            sundayClose = sundayWorkingTimeArray[1];
                        } else {
                            sundayOpen = '';
                            sundayClose = '';
                        }
                        profileWorkingTimeObject = {
                            available247: available247,
                            monday: {
                                open: mondayOpen,
                                close: mondayClose
                            },
                            tuesday: {
                                open: tuesdayOpen,
                                close: tuesdayClose
                            },
                            wednesday: {
                                open: wednesdayOpen,
                                close: wednesdayClose
                            },
                            thursday: {
                                open: thursdayOpen,
                                close: thursdayClose
                            },
                            friday: {
                                open: fridayOpen,
                                close: fridayClose
                            },
                            saturday: {
                                open: saturdayOpen,
                                close: saturdayClose
                            },
                            sunday: {
                                open: sundayOpen,
                                close: sundayClose
                            }
                        };
                    }
                }
                else {
                    profileWorkingTimeObject = {
                        available247: false,
                        monday: {
                            open: '',
                            close: ''
                        },
                        tuesday: {
                            open: '',
                            close: ''
                        },
                        wednesday: {
                            open: '',
                            close: ''
                        },
                        thursday: {
                            open: '',
                            close: ''
                        },
                        friday: {
                            open: '',
                            close: ''
                        },
                        saturday: {
                            open: '',
                            close: ''
                        },
                        sunday: {
                            open: '',
                            close: ''
                        }
                    };
                }

                // FRIENDS INFO

                if (document.querySelector(profileFriendsSelector) !== null) {
                    profileFriends = Array.from(document.querySelectorAll('#studigirls > a')).map(item => item.pathname);
                } else {
                    profileFriends = [];
                }

                // MAIN PHOTO ALBUM

                Array.from(document.querySelectorAll(photosVisible)).map(item => mainPhotoAlbum.push(item.src));
                if (Array.from(document.querySelectorAll('#gallery-content-0 > div')).map(item => item.className).includes('more-photos')) {
                    Array.from(document.querySelectorAll(photosHide)).map(item => mainPhotoAlbum.push(item.src))
                }

                return {
                    lastUpated: Date.now(),
                    onListing: true,
                    siteName: '6annonce',
                    profileId: profileId,
                    verification: verification,
                    suspicious: suspicious,
                    suspiciousBefore: suspiciousBefore,
                    lastModifiedOnSite: new Date(document.querySelector('#right > div.profile-info > p.r > span').innerText).getTime(),
                    showname: showname,
                    ethnicity: mainInfoObj['Ethnic:'] !== undefined ? ethnicity = mainInfoObj['Ethnic:'] : ethnicity = '',
                    nationality: mainInfoObj['Nationality:'] !== undefined ? nationality = mainInfoObj['Nationality:'] : nationality = '',
                    age: mainInfoObj['Age:'] !== undefined ? age = parseInt(mainInfoObj['Age:'], 10) : age = '',
                    eyes: mainInfoObj['Eyes:'] !== undefined ? eyes = mainInfoObj['Eyes:'] : eyes = '',
                    hair: mainInfoObj['Hair:'] !== undefined ? hair = mainInfoObj['Hair:'] : hair = '',
                    hairLength: mainInfoObj['Hair Length:'] !== undefined ? hairLength = mainInfoObj['Hair Length:'] : hairLength = '',
                    publicHair: mainInfoObj['Pubic hair:'] !== undefined ? publicHair = mainInfoObj['Pubic hair:'] : publicHair = '',
                    tattoo: mainInfoObj['Tattoo:'] !== undefined ? tattoo = mainInfoObj['Tattoo:'] : tattoo = '',
                    piercing: mainInfoObj['Piercings:'] !== undefined ? piercing = mainInfoObj['Piercings:'] : piercing = '',
                    height: mainInfoObj['Height:'] !== undefined ? height = parseInt(mainInfoObj['Height:'].replace(' cm', '')) : height = '',
                    weight: mainInfoObj['Weight:'] !== undefined ? weight = parseInt(mainInfoObj['Weight:'].replace(' kg', '')) : weight = '',
                    bust: bust,
                    waist: waist,
                    hip: hip,
                    cupSize: mainInfoObj['Cup size:'] !== undefined ? cupSize = mainInfoObj['Cup size:'] : cupSize = '',
                    breast: mainInfoObj['Breast:'] !== undefined ? breast = mainInfoObj['Breast:'] : breast = '',
                    shoeSize: mainInfoObj['Shoe size:'] !== undefined ? shoeSize = parseInt(mainInfoObj['Shoe size:']) : shoeSize = '',
                    dressSize: mainInfoObj['Dress size:'] !== undefined ? dressSize = mainInfoObj['Dress size:'] : dressSize = '',
                    smoker: mainInfoObj['Smoker:'] !== undefined ? smoker = mainInfoObj['Smoker:'] : smoker = '',
                    drinking: mainInfoObj['Drinking:'] !== undefined ? drinking = mainInfoObj['Drinking:'] : drinking = '',
                    languages: {
                        english: getLanguageLevel(languageLevel, 'English'),
                        french: getLanguageLevel(languageLevel, 'French'),
                        german: getLanguageLevel(languageLevel, 'German'),
                        italian: getLanguageLevel(languageLevel, 'Italian'),
                        portuguese: getLanguageLevel(languageLevel, 'Portuguese'),
                        russian: getLanguageLevel(languageLevel, 'Russian'),
                        spanish: getLanguageLevel(languageLevel, 'Spanish'),
                        arabic: getLanguageLevel(languageLevel, 'Arabic'),
                        bulgarian: getLanguageLevel(languageLevel, 'Bulgarian'),
                        chinese: getLanguageLevel(languageLevel, 'Chinese'),
                        czech: getLanguageLevel(languageLevel, 'Czech'),
                        croatian: getLanguageLevel(languageLevel, 'Croatian'),
                        dutch: getLanguageLevel(languageLevel, 'Dutch'),
                        finnisch: getLanguageLevel(languageLevel, 'Finnisch'),
                        greek: getLanguageLevel(languageLevel, 'Greek'),
                        hungarian: getLanguageLevel(languageLevel, 'Hungarian'),
                        indian: getLanguageLevel(languageLevel, 'Indian'),
                        japanese: getLanguageLevel(languageLevel, 'Japanese'),
                        latvinian: getLanguageLevel(languageLevel, 'Latvinian'),
                        polish: getLanguageLevel(languageLevel, 'Polish'),
                        romanian: getLanguageLevel(languageLevel, 'Romanian'),
                        turkish: getLanguageLevel(languageLevel, 'Turkish'),
                        slovak: getLanguageLevel(languageLevel, 'Slovak'),
                        slovenian:getLanguageLevel(languageLevel, 'Slovenian')
                    },
                    availableFor: {
                        incall: availableForIncall,
                        outcall: availableForOutcall
                    },
                    orientation: additionalInfoObject['Orientation:'],
                    meetindWith: {
                        man: meetingWithChecker('Men'),
                        women: meetingWithChecker('Women'),
                        couples: meetingWithChecker('Couples'),
                        trans: meetingWithChecker('Trans'),
                        gays: meetingWithChecker('Gays'),
                        mmf: meetingWithChecker('2+')
                    },
                    homeCity: additionalInfoObject['Home city:'] !== undefined ? homeCity = additionalInfoObject['Home city:'] : homeCity = '',
                    aboutMeEn: document.querySelector(aboutMeSelector) !== null ? aboutMeEn = document.querySelector(aboutMeSelector).innerText : aboutMeEn = '',
                    aboutMeFr: aboutMeFr,
                    profileIncallRates,
                    profileOutcallRates,
                    currentTour: currentTourObject,
                    upcomingTours: upcomingToursArray,
                    baseCity: baseCity,
                    cityZones: cityZones,
                    availableIn: availableIn,
                    phoneNumber: phoneNumber,
                    appsAvailable: appsAvailable,
                    phoneInstructions: phoneInstructions,
                    noWithheldNumbers: noWithheldNumbers,
                    otherPhoneInstructions: otherPhoneInstructions,
                    workingTime: profileWorkingTimeObject,
                    profileFriends: profileFriends,
                    mainPhotoAlbum: mainPhotoAlbum
                };
            } else {
                return {
                    lastUpated: Date.now(),
                    profileId: profileId,
                    verification: verification,
                    suspicious: suspicious,
                    suspiciousBefore: suspiciousBefore,
                    showname: 'Out of data',
                };
            }
        }, profileId, aboutMeFr);
    } catch (err) {
        console.log(chalk.red('An error has occured \n'));
        console.log(err);
    }
    browser.close();
    return await profileObject;
};
module.exports = profilesScraper;
