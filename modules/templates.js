export const preloadHandlebarsTemplates = async function() {
	return loadTemplates([
                "modules/fichaTagmar/templates/ficha.hbs",
                "modules/fichaTagmar/templates/parts/atributos.hbs",
                "modules/fichaTagmar/templates/parts/habilidades.hbs",
                "modules/fichaTagmar/templates/parts/combates.hbs",
                "modules/fichaTagmar/templates/parts/magias.hbs",
                "modules/fichaTagmar/templates/parts/verso.hbs",
                "modules/fichaTagmar/templates/parts/efeitos.hbs"
	]);
};