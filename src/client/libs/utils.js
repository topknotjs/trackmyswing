export function getPageFromUrl(location) {
	if (!location.pathname) {
		return '';
	}
	const lastIndex = location.pathname.lastIndexOf('/');
	if (lastIndex === -1) {
		return '';
	}
	return location.pathname.substring(lastIndex + 1);
}
