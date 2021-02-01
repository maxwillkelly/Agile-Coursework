/*
This class holds custom errors
*/

// Thrown for errorous IDs
class IdError extends Error {
    constructor(message) {
        super(message);
        this.name = 'IdError';
    }
}

// Thrown for invalid Permission
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
