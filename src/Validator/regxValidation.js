const validator = (type, data) => {
    /* String */

    if (type == "string") {
        if (!data.trim()) {
            const errorMessage = "String cannot be empty.";
            return errorResponse(type, errorMessage);
        }

        return {
            status: true,
            errorMessage: null,
        };
    }

    /* Email */
    else if (type == "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(data)) {
            const errorMessage = "Invalid email format.";
            return errorResponse(type, errorMessage);
        }

        return {
            status: true,
            errorMessage: null
        };
    }

    /* Password */
    else if (type == "password") {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*])[A-Za-z\d@#$%^&*]{8,}$/;


        if (!passwordRegex.test(data)) {
            const errorMessage = "Password must meet specified criteria.";
            return errorResponse(type, errorMessage);
        }

        return {
            status: true,
            errorMessage: null
        };
    }

}

const projectRedgexValidator = (type, data) => {
    if (type == "string") {

        if (!data.trim()) {
            const errorMessage = "Project name cannot be empty.";
            return errorResponse(type, errorMessage);
        }

        return {
            status: true,
            errorMessage: null,
        };
    }

    if (type === 'URL') {
        if (!data.trim()) {
            const errorMessage = "project URL cannot be empty";
            return errorResponse(type, errorMessage);
        }

        return {
            status: true,
            errorMessage: null,
        };
    }
}

const errorResponse = (type, errorMessage) => {
    return {
        errorFoundIn: type,
        status: false,
        errorMessage: errorMessage
    }
}

module.exports = {
    validator,
    projectRedgexValidator
}
