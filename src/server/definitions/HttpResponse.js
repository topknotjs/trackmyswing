class HttpResponse {
	constructor() {}
}

HttpResponse.Conflict = 409;
HttpResponse.NotFound = 404;
HttpResponse.BadRequest = 400;
HttpResponse.Success = 200;
HttpResponse.InternalServerError = 500;

module.exports = HttpResponse;
