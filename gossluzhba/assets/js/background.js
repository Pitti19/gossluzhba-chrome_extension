class BackgroundApp {
    constructor() {
        this.browser = new Browser();
        this._setEvents();
        this._setListener();
    }
    _setEvents() {
        this.browser.setEvents();
    }
    _setListener() {
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            console.log(request);
            if (request.method == "scrap-vacancies") {
                let scrapper = new Scrapper();
                scrapper.scrap()
                    .then((vacancies) => scrapper.setKeys(vacancies))
                    .then((vacancies) => {
                        sendResponse({
                            vacancies: vacancies,
                            status: true
                        });
                    });
            }

            return true;
        });
    }
}

class Browser {
    constructor() {
        this.tabManager = new TabManager();
    }
    setEvents() {
        this._browserAction();
    }
    _browserAction() {
        chrome.browserAction.onClicked.addListener((tab) => {
            this.tabManager.createTab();
        });
    }
}

class TabManager {
    constructor() {
        this.tabId = null;
    }
    createTab() {
        if (!this.tabId) {
            chrome.windows.create({
                url: "exports.html",
                type: "popup"
            }, (tab) => {

                this.tabId = tab.id;
            });
            chrome.windows.onRemoved.addListener((tabId, info, tab) => {
                this.tabId = null;
            });
        } else {
            chrome.windows.update(this.tabId, {
                focused: true
            });
        }
    }
}

class Scrapper {
    constructor() {

    }
    scrap() {
        return this.getPages()
            .then((count) => this.scrapPages(count))
            .then((results) => {
                return results;
            });
    }
    getPages() {
        return fetch("https://gossluzhba.gov.ru/vacancy").then((response) => {
            return response.text();
        }).then((html) => {
            let parser = new DOMParser(),
                doc = parser.parseFromString(html, 'text/html');
            return doc.querySelector('.pagination li:last-child a').text;
        });
    }
    async scrapPages(count) {
        let url = "https://gossluzhba.gov.ru/vacancy",
            results = [];

        for (let i = 1; i < parseInt(count) + 1; i++) {
            await this.getPageData(`${url}?page=${i}`).then((vacancies) => {
                results = results.concat(vacancies);
            });
        }

        return results;
    }
    getPageData(url) {
        return fetch(url).then((response) => {
            return response.text();
        }).then((html) => {
            let parser = new DOMParser(),
                doc = parser.parseFromString(html, 'text/html'),
                result = [];

            let $vacancies = doc.querySelectorAll('.vacancy-block');

            $vacancies.forEach(($row) => {
                console.log($row.querySelectorAll('p')[3]);
                let vacancy = {
                    title: $row.querySelector('.title').innerText.match(/(?:\n\s+|[^\s])(\D+)(?:\n|[^\s])/)[1],
                    location: $row.querySelectorAll('p')[2].innerText,
                    description: $row.querySelectorAll('p')[1].innerText,
                    salary: $row.querySelectorAll('p:not(.category)')[3].innerText,
                    min: parseInt($row
                        .querySelectorAll('p:not(.category)')[3]
                        .innerText
                        .match(/(?:от\s)(.+)(?:\n|\s)/)[1]
                        .replace(/\s/g, "")),
                    max: parseInt($row
                        .querySelectorAll('p:not(.category)')[3]
                        .innerText
                        .match(/(?:\sдо)(.+)(?:\n|\s)/)[1]
                        .replace(/\s/g, ""))
                };

                result.push(vacancy);
            });

            return result;
        })
    }
    setKeys(vacancies) {
        vacancies.forEach((vacancy, index) => {
            vacancy.id = index;
            vacancy.avg = this.getAverageSalary(vacancy.min, vacancy.max);
        })

        return vacancies;
    }
    getAverageSalary(min, max) {
        return (parseInt(min) + parseInt(max)) / 2;
    }
}

window.backgroundApp = new BackgroundApp();