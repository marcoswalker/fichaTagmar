import fichaOficial from "./sheet/actor-sheet.js";
import { preloadHandlebarsTemplates } from "./templates.js";


Hooks.once("init", function(){
    Actors.registerSheet("tagmar", fichaOficial, {makeDefault: false});

    Handlebars.registerHelper('fataque', function(a, b, options) {
        let soma = a + b;
        return soma;
    });

    preloadHandlebarsTemplates();
});

Hooks.on('renderActorSheet', function (document, b, c) {
    if (document.actor.getFlag('core', 'sheetClass') == "tagmar.fichaOficial" && document.actor.type != "Personagem") {
        document.actor.setFlag('core', 'sheetClass', 'tagmar.tagmarActorSheet');
        return false;
    }
});
