const { validator, projectRedgexValidator } = require("./regxValidation");

/*               [email validator]                */
const emailValidator = (data) => {
    const { email } = data;
    const emailValidationErr = handleValidation("email", email);
    if (!emailValidationErr.status) return emailValidationErr;

    return {
        status: true,
        errorMessage: null
    };
}


/*               [password validator]                */

const passwordValidator = (data) => {
    const { password } = data;
    if (password) {
        const passwordValidationErr = handleValidation("password", password);
        if (!passwordValidationErr.status) return passwordValidationErr;
    }

    return {
        status: true,
        errorMessage: null
    };
}



/*************[user validator]****************/
const userValidator = (data) => {
    const { name, email, password } = data;

    const nameValidationErr = handleValidation("string", name);
    if (!nameValidationErr.status) return nameValidationErr;

    const emailValidationErr = handleValidation("email", email);
    if (!emailValidationErr.status) return emailValidationErr;

    if (password !== undefined) {
        const passwordValidationErr = handleValidation("password", password);
        if (!passwordValidationErr.status) return passwordValidationErr;
    }

    return {
        status: true,
        errorMessage: null
    };
};

const userUpdationValidator = (data) => {
    let { name, password } = data;

    if (name) {
        const nameValidationErr = handleValidation("string", name);
        if (nameValidationErr) return nameValidationErr;
    }

    if (password) {
        const passwordValidationErr = handleValidation("password", password);
        if (passwordValidationErr) return passwordValidationErr;
    }
}

/***************[project validator]*************/
const projectValidator = (data) => {
    let { userId, projectTitle, Signup, TyPage, projectUrl } = data;

    const projectTitleValidtionErr = projectRedgexValidator("string", projectTitle);
    if (!projectTitleValidtionErr.status) return projectTitleValidtionErr;

    const projectUrlValidtionErr = projectRedgexValidator("URL", projectUrl);
    if (!projectUrlValidtionErr.status) return projectUrlValidtionErr;

    return {
        status: true,
        errorMessage: null
    };

};

const projectUpdationValidator = (data) => {
    let { userId, projectTitle, Signup, TyPage } = data;

    if (projectTitle) {
        const projectTitleValidtionErr = validator("string", projectTitle);
        if (projectTitleValidtionErr) return projectTitleValidtionErr;
    }

};

/*****************************[Lead Validator]*******************************/
const leadValidator = (data) => {
    let { projectId, name, email } = data;

    const emailValidationErr = handleValidation("email", email);
    if (emailValidationErr) return emailValidationErr;

    const passwordValidationErr = handleValidation("password", password);
    if (passwordValidationErr) return passwordValidationErr;

}

/****************************[[ VALIDATION HANDLER ]]***********************************/
const handleValidation = (type, data) => {
    const result = validator(type, data);
    return result;
};

module.exports = {
    userValidator,
    userUpdationValidator,
    projectValidator,
    projectUpdationValidator,
    leadValidator,


    emailValidator,
    passwordValidator
};
