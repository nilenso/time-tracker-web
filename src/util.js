export function formDataAsObject(formId) {
	const form = document.getElementById(formId);
  let json = {};
  for (let i = 0; i < form.length; i++) {
  	const element = form.elements[i];
    if (element.tagName !== 'BUTTON') {
    	json[element.name] = element.value;
    }
  }
  return json;
}
