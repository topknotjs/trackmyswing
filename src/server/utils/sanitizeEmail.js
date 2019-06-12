//  TODO: Create an email format sanitizer
const sanitizeEmail = emailInput => {
	if (typeof emailInput !== 'string') {
		return null;
	}
	return emailInput;
};

module.exports = sanitizeEmail;
