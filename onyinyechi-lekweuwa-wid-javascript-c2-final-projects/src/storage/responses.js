const responses = [];

function saveResponse(userId, response) {
    const date = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    responses.push({ userId, date, response });
}

function getResponses(userId) {
    return responses.filter(response => response.userId === userId);
}

module.exports = { saveResponse, getResponses };