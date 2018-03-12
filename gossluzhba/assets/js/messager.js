class Messager {
    static sendScrap(callback) {
        chrome.runtime.sendMessage({
            method: "scrap-vacancies"
        }, function(response) {
            console.log(response.status);
            callback.updateVacancies(response.vacancies);
        });
    }
}

export default Messager;