/*
This class holds custom errors
*/

class IdError extends Error {
    constructor(message) {
        super(message);
        this.name = 'IdError';
    }
}

class PermissionsError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PermissionsError';
    }
}

module.exports = {
    IdError: IdError,
    PermissionsError: PermissionsError
};
