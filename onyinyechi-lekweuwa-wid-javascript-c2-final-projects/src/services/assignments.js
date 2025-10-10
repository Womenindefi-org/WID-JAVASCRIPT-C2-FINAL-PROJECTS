class AssignmentsService {
    constructor() {
        this.assignments = [];
    }

    addAssignment(assignment) {
        this.assignments.push(assignment);
    }

    listAssignments() {
        return this.assignments;
    }
}

module.exports = { AssignmentsService };