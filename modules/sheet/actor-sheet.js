export default class fichaOficial extends ActorSheet {
    // classe da ficha
    static get defaultOptions() {
        this.lastUpdate = {};
        this.lastItemsUpdate = [];
        return mergeObject(super.defaultOptions, {
        classes: ["tagmar", "sheet", "actor"],
        width: 920,
        height: 975,
        tabs: [{
            navSelector: ".prim-tabs",
            contentSelector: ".sheet-primary",
            initial: "frente"
            }]
        });
    }
    get template() {
        if (this.actor.data.type != "Personagem") {
            return;
        }
        let layout = game.settings.get(game.system.id, "sheetTemplate");
        if (layout != "base") {
            if (layout == 'tagmar3anao') {
                return 'modules/fichaTagmar/templates/ficha-borda-anao.hbs';
            } else if (layout == 'tagmar3barda') {
                return 'modules/fichaTagmar/templates/ficha-borda-barda.hbs';
            } else if (layout == 'tagmar3bardo') {
                return 'modules/fichaTagmar/templates/ficha-borda-bardo.hbs';
            } else if (layout == 'tagmar3gana') {
                return 'modules/fichaTagmar/templates/ficha-borda-gana.hbs';
            } else if (layout == 'tagmar3ghuma') {
                return 'modules/fichaTagmar/templates/ficha-borda-ghuma.hbs';
            } else if (layout == 'tagmar3ghumk') {
                return 'modules/fichaTagmar/templates/ficha-borda-ghumk.hbs';
            } else if (layout == 'tagmar3lhuma') {
                return 'modules/fichaTagmar/templates/ficha-borda-lhuma.hbs';
            } else if (layout == 'tagmar3lpeqa') {
                return 'modules/fichaTagmar/templates/ficha-borda-lpeqa.hbs';
            } else if (layout == 'tagmar3lpeq') {
                return 'modules/fichaTagmar/templates/ficha-borda-lpeq.hbs';
            } else if (layout == 'tagmar3lhum') {
                return 'modules/fichaTagmar/templates/ficha-borda-lhum.hbs';
            } else if (layout == 'tagmar3melfa') {
                return 'modules/fichaTagmar/templates/ficha-borda-melfa.hbs';
            } else if (layout == 'tagmar3mhuma') {
                return 'modules/fichaTagmar/templates/ficha-borda-mhuma.hbs';
            } else if (layout == 'tagmar3melfo') {
                return 'modules/fichaTagmar/templates/ficha-borda-melfo.hbs';
            } else if (layout == 'tagmar3pap') {
                return 'modules/fichaTagmar/templates/ficha-borda-pap.hbs';
            } else if (layout == 'tagmar3relf') {
                return 'modules/fichaTagmar/templates/ficha-borda-relf.hbs';
            } else if (layout == 'tagmar3rhuma') {
                return 'modules/fichaTagmar/templates/ficha-borda-rhuma.hbs';
            } else if (layout == 'tagmar3shum') {
                return 'modules/fichaTagmar/templates/ficha-borda-shum.hbs';
            } else if (layout == 'tagmar3shumv') {
                return 'modules/fichaTagmar/templates/ficha-borda-shumv.hbs';
            } else if (layout == 'tagmar3selfa') {
                return 'modules/fichaTagmar/templates/ficha-borda-selfa.hbs';
            } else if (layout == 'tagmar3shum1') {
                return 'modules/fichaTagmar/templates/ficha-borda-shum1.hbs';
            } else if (layout == 'tagmar3shum2') {
                return 'modules/fichaTagmar/templates/ficha-borda-shum2.hbs';
            } else {
                return 'modules/fichaTagmar/templates/ficha-borda.hbs';
            }
        } else {
            return 'modules/fichaTagmar/templates/ficha.hbs';
        }
    }

    async getData(options) {
        const data = super.getData(options);
        const gameSystem = game.system.id;
        const actorUtils = await import("/systems/"+ gameSystem +"/modules/sheets/actorUtils.js");
        data.dtypes = ["String", "Number", "Boolean"];
        if (data.actor.data.type == 'Personagem') {
            let updatePers = {};
            let items_toUpdate = [];
            this._getItems(data);
            if (!game.settings.get(gameSystem, 'ajusteManual')) actorUtils._setPontosRaca(data, updatePers); // pontos = actor.data.data.carac_final.INT
            actorUtils._prepareValorTeste(data, updatePers);
            if (data.actor.raca) {
                actorUtils._preparaCaracRaciais(data, updatePers);
            }
            if (data.actor.profissao) {
                actorUtils._attProfissao(data, updatePers, items_toUpdate);
            }
            actorUtils._attCargaAbsorcaoDefesa(data, updatePers);
            if (data.actor.raca && data.actor.profissao) {
                actorUtils._attEfEhVB(data, updatePers); 
            }
            actorUtils._attProximoEstag(data, updatePers);
            actorUtils._attKarmaMax(data, updatePers);
            actorUtils._attRM(data, updatePers);
            actorUtils._attRF(data, updatePers);
            if (updatePers.hasOwnProperty('_id')) delete updatePers['_id'];
            if (this.lastUpdate) {
                if (this.lastUpdate.hasOwnProperty('_id')) delete this.lastUpdate['_id'];
            }
            if (Object.keys(updatePers).length > 0 && options.editable) {
                if (!this.lastUpdate) {
                    this.lastUpdate = updatePers;
                    data.actor.update(updatePers);
                    //ui.notifications.info("Ficha atualizada.");
                }
                else if (JSON.stringify(updatePers) !== JSON.stringify(this.lastUpdate)) {   // updatePers[Object.keys(updatePers)[0]] != this.lastUpdate[Object.keys(updatePers)[0]]
                    this.lastUpdate = updatePers;
                    data.actor.update(updatePers);
                    //ui.notifications.info("Ficha atualizada.");
                }
            }
            actorUtils._updateCombatItems(data, items_toUpdate);
            actorUtils._updateMagiasItems(data, items_toUpdate);
            actorUtils._updateTencnicasItems(data, items_toUpdate);
            if (items_toUpdate.length > 0 && options.editable) {
                if (!this.lastItemsUpdate) {
                    this.lastItemsUpdate = items_toUpdate;
                    data.actor.updateEmbeddedDocuments("Item", items_toUpdate);
                } else if (JSON.stringify(items_toUpdate) !== JSON.stringify(this.lastItemsUpdate)) {
                    this.lastItemsUpdate = items_toUpdate;
                    data.actor.updateEmbeddedDocuments("Item", items_toUpdate);
                }
            }
        } else {
            this.actor.setFlag('core', 'sheetClass', 'tagmar.tagmarActorSheet');
            return;
        }
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        if (!this.options.editable) return;
        html.find('.ativaDesc').click(this._edtDesc.bind(this));    // Ativa Descrição

        html.find('.item-edit').click(ev => {                       // Item Edit
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data('itemId'));
            item.sheet.render(true);
        });

        html.find('.item-delete').click(ev => {                     // Item Delete
            const li = $(ev.currentTarget).parents(".item");
            let dialog = new Dialog({
                title: "Tem certeza que deseja deletar?",
                content: "<p class='rola_desc mediaeval'>Deseja mesmo <b>deletar</b> esse item?</p>",
                buttons: {
                    sim: {
                        icon: "<i class='fas fa-check'></i>",
                        label: "Confirmar",
                        callback: () => {
                            this.actor.deleteEmbeddedDocuments("Item", [li.data("itemId")]);
                            li.slideUp(200, () => this.render(false));
                        }
                    },
                    nao: {
                        icon: '<i class="fas fa-times"></i>',
                        label: "Cancelar",
                        callback: () => {}
                    }
                },
                default: "nao"
            });
            dialog.render(true);
        });
        html.find(".testeRF").click(this._rolarRF.bind(this));
        html.find(".testeRM").click(this._rolarRF.bind(this));
        html.find(".ativaEfeito").click(this._ativaEfeito.bind(this));
        html.find(".rollAtributo").click(this._rolarAtt.bind(this));
        html.find('.editRaca').click(this._editRaca.bind(this));
        html.find('.editProf').click(this._editProf.bind(this));
        if (this.actor.isOwner) {
            let handler = ev => this._onDragStart(ev);
            html.find('.dragable').each((i, li) => {
                if (li.classList.contains("inventory-header")) return;
                li.setAttribute("draggable", true);
                li.addEventListener("dragstart", handler, false);
            });
        }
        html.find('.rollable').click(this._onItemRoll.bind(this));
        html.find('.rollable').contextmenu(this._onItemRightButton.bind(this));
        html.find(".calculaNovaEH").click(this._passandoEH.bind(this));
        html.find(".roll1d10").click(ev => {
            let formula = "1d10";
            let r = new Roll(formula);
            r.evaluate({async:false});
            r.toMessage({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: ``
            });
            $(html.find(".valord10EH")).val(r.total);
            $('.calculaNovaEH').css('color', 'rgb(94, 8, 8)');
        });
        html.find('.newEfeito').click(this._newEfeito.bind(this));
        html.find(".newHabilidade").click(this._newHabilidade.bind(this));
        html.find(".newCombat").click(this._newCombate.bind(this));
        html.find(".newMagia").click(this._newMagia.bind(this));
        html.find(".newPertence").click(this._newPertence.bind(this));
        html.find(".rolarIniciativa").click(this._rolarIniciativa.bind(this));
    }

    _rolarIniciativa(event) {
        if (!this.options.editable) return;
        if (game.combats.size > 0) this.actor.rollInitiative({createCombatants:false, rerollInitiative:false});
    }

    _newMagia(event) {
        if (!this.options.editable) return;
        const actor = this.actor;
        actor.createEmbeddedDocuments('Item', [{name: "Nova Magia", type: "Magia"}]).then(function (item) {
            item[0].sheet.render(true);
        });
    }

    _newPertence(event) {
        if (!this.options.editable) return;
        let create = false;
        let tipo = "";
        const actor = this.actor;
        let dialogContent = `<div>
            <label for="selectTipo" class="mediaeval">Selecione o tipo do item:</label>
            <select id="selectTipo" name="selectTipo" class="selectType mediaeval" height="30" style="margin-left:2px;">
                <option value="Pertence">Pertence</option>
                <option value="Transporte">Transporte</option>
            </select>
        </div>`;
        let dialog = new Dialog({
            title: "Escolha o tipo do item que deseja criar.",
            content: dialogContent,
            buttons: {
                criar: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "Criar Item",
                    callback: html => {
                        create = true;
                        tipo = html.find(".selectType").val();
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: 'Cancelar'
                }
            },
            default: "cancel",
            close: html => {
                if (create) {
                    if (tipo.length > 0) {
                        actor.createEmbeddedDocuments("Item", [{name: `Novo ${tipo}`, type: tipo}]).then(function (item) {
                            item[0].sheet.render(true);
                        });
                    }
                }
            }
        });
        dialog.render(true);
    }

    _newCombate(event) {
        if (!this.options.editable) return;
        let create = false;
        let tipo = "";
        const actor = this.actor;
        let dialogContent = `<div>
            <label for="selectTipo" class="mediaeval">Selecione o tipo do item:</label>
            <select id="selectTipo" name="selectTipo" class="selectType mediaeval" height="30" style="margin-left:2px;">
                <option value="Ataque">Ataque</option>
                <option value="Defesa">Defesa</option>
                <option value="Tecnica">Técnica de Combate</option>
            </select>
            </div>`;
        let dialog = new Dialog({
            title: "Escolha o tipo do item que deseja criar.",
            content: dialogContent,
            buttons: {
                criar: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "Criar Item",
                    callback: html => {
                        create = true;
                        tipo = html.find(".selectType").val();
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: 'Cancelar'
                }
            },
            default: "cancel",
            close: html => {
                if (create) {
                    let tipoItem = "";
                    if (tipo == "Ataque") tipoItem = "Combate";
                    else if (tipo == "Defesa") tipoItem = "Defesa";
                    else if (tipo == "Tecnica") tipoItem = "TecnicasCombate";
                    if (tipoItem.length > 0) {
                        actor.createEmbeddedDocuments("Item", [{name: "Novo Item Criado", type: tipoItem}]).then(function (item) {
                            item[0].sheet.render(true);
                        });
                    }
                }
            }
        });
        dialog.render(true);
    }

    _newHabilidade(event) {
        if (!this.options.editable) return;
        const actor = this.actor;
        actor.createEmbeddedDocuments("Item", [{name: "Nova Habilidade", type: "Habilidade", data: {tipo: "profissional"}}]).then(function (item) {
            item[0].sheet.render(true);
        });
    }

    _newEfeito(event) {
        if (!this.options.editable) return;
        const actor = this.actor;
        actor.createEmbeddedDocuments('Item', [{name: "Novo Efeito", type: "Efeito"}]).then(function (efeito) {
            efeito[0].sheet.render(true);
        });
    }

    _passandoEH(event) {
        let estagio_atual = this.actor.data.data.estagio;
        let valord10 = parseInt($(".valord10EH").val());
        if (!valord10 && estagio_atual > 1) {
            ui.notifications.warn("Clique em '1d10' para rolar o dado ou preencha o valor no campo.");
            $('.roll1d10').css('color', 'rgb(94, 8, 8)');
            return;
        }
        let raca_list = [];
        let nova_eh = 0;
        let eh_atual = this.actor.data.data.eh.max;
        let attFIS = this.actor.data.data.atributos.FIS;
        if (estagio_atual > 1 && valord10 > 0 && valord10 <= 10) {
            if (this.profissao) {
                if (valord10 >= 1 && valord10 <= 2) {
                    nova_eh = this.profissao.data.data.lista_eh.v1;
                    this.actor.update({
                        "data.eh.max": eh_atual + nova_eh + attFIS
                    });
                    ui.notifications.info("Nova EH calculada.");
                } else if (valord10 >= 3 && valord10 <= 5) {
                    nova_eh = this.profissao.data.data.lista_eh.v2;
                    this.actor.update({
                        "data.eh.max": eh_atual + nova_eh + attFIS
                    });
                    ui.notifications.info("Nova EH calculada.");
                } else if (valord10 >= 6 && valord10 <= 8) {
                    nova_eh = this.profissao.data.data.lista_eh.v3;
                    this.actor.update({
                        "data.eh.max": eh_atual + nova_eh + attFIS
                    });
                    ui.notifications.info("Nova EH calculada.");
                } else if (valord10 >= 9 && valord10 <= 10) {
                    nova_eh = this.profissao.data.data.lista_eh.v4;
                    this.actor.update({
                        "data.eh.max": eh_atual + nova_eh + attFIS
                    });
                    ui.notifications.info("Nova EH calculada.");
                }
            }
        }
        if (this.actor.data.data.valor_dado_eh) {
            this.actor.update({
                "data.valor_dado_eh": null
            });
        }
        //$(".valord10EH").val("");
        //this.render();
    }

    _onItemRightButton (event) {
        let button = $(event.currentTarget);
        const li = button.parents(".item");
        const item = this.actor.items.get(li.data("itemId"));
        if (typeof item.data.data.descricao == "string") {
            let content = `<div style="height:800px" class='rola_desc mediaeval'><img src="${item.data.img}" style="display:block;margin-left:auto;margin-right:auto">`;
            content += `<h1 class="fairyDust" style="text-align:center;">${item.name}</h1>`;
            if (item.data.type == "Magia") content += item.data.data.efeito ;
            else if (item.data.type == "Habilidade") {
                if (item.data.data.tarefAperf.length > 0) content += `<h3 class="mediaeval">Tarefas aperfeiçoadas:</h3>` +  item.data.data.tarefAperf;
                content += `<br><br><h3 class="mediaeval">Descrição:</h3>` + item.data.data.descricao;
            }
            else content += item.data.data.descricao;
            content += `</div>`;
            let dialog = new Dialog({
                title: item.name,
                content: content,
                buttons: {}
            });
            dialog.render(true);
        }
    }

    _onItemRoll (event) {
        let button = $(event.currentTarget);
        const li = button.parents(".item");
        const item = this.actor.items.get(li.data("itemId"));
        item.rollTagmarItem();
    }

    _editRaca(event) {
        if (!this.options.editable) return;
        const actor = this.actor;
        const raca = actor.items.find(item => item.type == "Raca");
        if (!raca) {
            actor.createEmbeddedDocuments("Item", [{name: "Raça", type: "Raca"}]).then(function (item) {
                item[0].sheet.render(true);
            });
        } else raca.sheet.render(true);
    }

    _editProf(event) {
        if (!this.options.editable) return;
        const actor = this.actor;
        const profissao = actor.items.find(item => item.type == "Profissao");
        if (!profissao) {
            actor.createEmbeddedDocuments("Item", [{name: "Profissão", type: "Profissao"}]).then(function (item) {
                item[0].sheet.render(true);
            });
        } else profissao.sheet.render(true);
    }

    async _rolarAtt(event) {      // Rolar Atributo
        const target = event.currentTarget;
        const cat = $(target).data("itemId");
        let teste = {name: "Atributo", id: cat};
        this.actor._rollTeste(teste);
    }
    
    _ativaEfeito(event) {
        let button = $(event.currentTarget);
        const li = button.parents(".item");
        const item = this.actor.items.get(li.data("itemId"));
        let ativo = item.data.data.ativo;
        let ativa;
        if (ativo) {
            ativa = false;
        } else {
            ativa = true;
        }
        this.actor.updateEmbeddedDocuments("Item", [{
            "_id": item.data._id,
            "data.ativo": ativa
        }]);
        event.preventDefault();
    }

    _rolarRF(event) {
        if (event.currentTarget.classList[0] == "testeRF") {
            this._dialogResistencia("Física");
        } else if (event.currentTarget.classList[0] == "testeRM") {
            this._dialogResistencia("Magía");
        }
        event.preventDefault();
    }

    _dialogResistencia(tipo) {
        let f_ataque;
        let rolar = false;
        let dialogContent = `
        <div class="mediaeval">
            <label for="forca-ataque">Força de Ataque:</label>
            <input type="number" name="forca-ataque" id="forca-ataque" value="1" style="width: 60px; text-align: center;"/>
        </div>`;
        let dialog = new Dialog({
            title: "Informe a força de ataque.",
            content: dialogContent,
            buttons: {
                Rolar: {
                    icon: '<i class="fas fa-dice-d20"></i>',
                    label: "Rolar Teste",
                    callback: (html) => {
                        f_ataque = html.find('#forca-ataque').val();
                        if (f_ataque) {
                            f_ataque = parseInt(f_ataque);
                            rolar = true;
                        }
                    }
                },
                Cancelar: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Cancelar"
                }
            },
            default: "Cancelar",
            close: html => {
                if (rolar) this.actor._rollTeste({name: "Resistencia", id: tipo, f_ataque: f_ataque});
            }
        });
        dialog.render(true);
    }
    
    _edtDesc(event) {
        const actorData = this.actor.data.data;
        if (actorData.v_base == 0) {
            this.actor.update({
                'data.v_base': 1
            });
        } else {
            this.actor.update({
                'data.v_base': 0
            });
        }
        event.preventDefault();
    }

    _getItems(sheetData) {  // get Actor Items
        const actorData = sheetData.actor;
        // get items
        const pertences = actorData.items.filter(item => item.type == "Pertence");
        const h_prof = actorData.items.filter(item => item.type == "Habilidade" && item.data.data.tipo == "profissional");
        const h_man = actorData.items.filter(item => item.type == "Habilidade" && item.data.data.tipo == "manobra");
        const h_con = actorData.items.filter(item => item.type == "Habilidade" && item.data.data.tipo == "conhecimento");
        const h_sub = actorData.items.filter(item => item.type == "Habilidade" && item.data.data.tipo == "subterfugio");
        const h_inf = actorData.items.filter(item => item.type == "Habilidade" && item.data.data.tipo == "influencia");
        const h_geral = actorData.items.filter(item => item.type == "Habilidade" && item.data.data.tipo == "geral");
        const profissoes = actorData.items.filter(item => item.type == "Profissao");
        const combate = actorData.items.filter(item => item.type == "Combate");
        const tecnicas = actorData.items.filter(item => item.type == "TecnicasCombate");
        const magias = actorData.items.filter(item => item.type == "Magia");
        const defesas = actorData.items.filter(item => item.type == "Defesa");
        const transportes = actorData.items.filter(item => item.type == "Transporte");
        const efeitos = actorData.items.filter(item => item.type == "Efeito");
        const racas = actorData.items.filter(item => item.type == "Raca");
        var especializacoes = [];

        const tabela_resol = [
            [-7, "verde", "verde", "verde", "verde", "verde", "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "laranja", "vermelho", "azul", "cinza"],
            [-6, "verde", "verde", "verde", "verde", "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "laranja", "vermelho", "azul", "cinza"],
            [-5, "verde", "verde", "verde", "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "vermelho", "azul", "cinza"],
            [-4, "verde", "verde", "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "vermelho", "azul", "cinza"],
            [-3, "verde", "verde", "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "vermelho", "azul", "cinza"],
            [-2, "verde", "verde", "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "vermelho", "vermelho", "azul", "cinza"],
            [-1, "verde", "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "vermelho", "vermelho", "azul", "cinza"],
            [0, "verde", "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "cinza"],
            [1, "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "cinza"],
            [2, "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "vermelho", "vermelho", "azul", "azul", "cinza"],
            [3, "verde", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "cinza"],
            [4, "verde", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "cinza"],
            [5, "verde", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "cinza"],
            [6, "verde", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "cinza"],
            [7, "verde", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "cinza"],
            [8, "verde", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "cinza"],
            [9, "verde", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "cinza"],
            [10, "verde", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "azul", "cinza"],
            [11, "verde", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "roxo", "cinza"],
            [12, "verde", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "roxo", "cinza"],
            [13, "verde", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "roxo", "cinza"],
            [14, "verde", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "azul", "roxo", "cinza"],
            [15, "verde", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "roxo", "roxo", "cinza"],
            [16, "verde", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "roxo", "roxo", "cinza"],
            [17, "verde", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "roxo", "roxo", "cinza"],
            [18, "verde", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "azul", "roxo", "roxo", "cinza"],
            [19, "verde", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "roxo", "roxo", "roxo", "cinza"],
            [20, "verde", "amarelo", "laranja", "laranja", "laranja", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "azul", "roxo", "roxo", "roxo", "cinza"]
        ];
        const table_resFisMag = [
            [-2, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20],
            [-1, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20],
            [ 0, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 20, 20, 20, 20],
            [ 1, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 20, 20, 20],
            [ 2, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 20, 20],
            [ 3,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 20],
            [ 4,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20],
            [ 5,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20],
            [ 6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20],
            [ 7,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19],
            [ 8,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19],
            [ 9,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18],
            [10,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18],
            [11,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17],
            [12,  4,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17],
            [13,  3,  4,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16],
            [14,  3,  3,  4,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16],
            [15,  2,  3,  3,  4,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15],
            [16,  2,  2,  3,  3,  4,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15],
            [17,  2,  2,  2,  3,  3,  4,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14],
            [18,  2,  2,  2,  2,  3,  3,  4,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13],
            [19,  2,  2,  2,  2,  2,  3,  3,  4,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12],
            [20,  2,  2,  2,  2,  2,  2,  3,  3,  4,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11]
        ];

        // organiza items
        if (pertences.length > 1) pertences.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (h_prof.length > 1) h_prof.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (h_man.length > 1) h_man.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (h_con.length > 1) h_con.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (h_sub.length > 1) h_sub.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (h_inf.length > 1) h_inf.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (h_geral.length > 1) h_geral.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (profissoes[0]) {
            especializacoes = profissoes[0].data.data.especializacoes.split(",");
        }
        if (combate.length > 1) combate.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (tecnicas.length > 1) tecnicas.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        /*if (tecnicas.length > 1) tecnicas.sort(function (a, b) {
            return a.data.data.categoria.localeCompare(b.data.data.categoria);
        });*/
        if (magias.length > 1) magias.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (transportes.length > 1) transportes.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (defesas.length > 1) defesas.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (efeitos.length > 1) efeitos.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

        actorData.raca = racas[0];
        actorData.profissao = profissoes[0];
        actorData.pertences = pertences;
        actorData.h_prof = h_prof;
        actorData.h_man = h_man;
        actorData.h_con = h_con;
        actorData.h_sub = h_sub;
        actorData.h_inf = h_inf;
        actorData.h_geral = h_geral;
        actorData.profissao = profissoes[0];
        actorData.especializacoes = especializacoes;
        actorData.tecnicas = tecnicas;
        actorData.combate = combate;
        actorData.magias = magias;
        actorData.transportes = transportes;
        actorData.defesas = defesas;
        actorData.efeitos = efeitos;
        actorData.pertences_transporte = [];

        this.table_resFisMag = table_resFisMag;
        this.tabela_resol = tabela_resol;
        this.raca = actorData.raca;
        this.profissao = actorData.profissao;
        // get system name
        actorData.system_name = game.system.id;
        actorData.ficha = "Pontos";
    }
}