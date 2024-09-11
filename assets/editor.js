import './styles/editor.css';
import './styles/custom-grapesjs.css';
import grapesjs from 'grapesjs';
import pl from 'grapesjs/locale/pl';
import gjsTailwind from 'grapesjs-tailwind';
import gjsBasicBlocks from 'grapesjs-blocks-basic';
import gjsForms from 'grapesjs-plugin-forms';
                const editor = grapesjs.init({
                    container: '#gjs',
                    i18n: {
                        locale: 'pl', 
                    },
                    stylePrefix: 'ti-',
                    blockManager: {
                        appendTo: '#blocks',
                      },
                    layerManager: {
                        appendTo: '#layers',
                    },
                    fromElement: false,
                    height: '100vh',
                    width: 'auto',
                    storageManager: false,
                    components: editorContent,
                    plugins: [gjsForms, gjsBasicBlocks, gjsTailwind],
                });
                editor.Commands.add('save-page', {
                    run(editor, sender) {
                      savePage();
                    }});
                editor.Commands.add('switch-layers', {
                    run(editor, sender) {
                      hidePanel('layers');
                    }});
                editor.Commands.add('switch-blocks', {
                    run(editor, sender) {
                      hidePanel('blocks');
                    }});
                editor.Commands.add('preview-hide-panels', {
                    run(editor, sender) {
                        editor.runCommand('preview');
                        document.getElementById('blocks').classList.add('hidden-panel');
                        document.getElementById('layers').classList.add('hidden-panel');
                        document.querySelectorAll(".ti-frame").forEach(function(element) {
                            element.classList.remove('panel-opened');
                        });
                    }});
                editor.Commands.add('load-template', {
                    run(editor, sender) {
                      loadTemplate();
                    }});    
                const savePagePanel = editor.Panels.addPanel({
                    id: 'save-action',
                    visible: true,
                    buttons: [
                        
                        {
                            id: 'page-name',
                            className: 'page-name',
                            label: window.pageName
                        },
                        {
                            id: 'save-button',
                            className: 'material-symbols-outlined',
                            active: false,
                            command: 'save-page',
                            label: '<span class="material-symbols-outlined">save</span>'
                        }
                  ]});
                const templateManagerPanel = editor.Panels.addPanel({
                    id: 'template-manager',
                    visible: true,
                    buttons: [
                        {
                            id:'switch-blocks',
                            className:'material-symbols-outlined blocks-button',
                            label: '<span class="material-symbols-outlined">add</span>',
                            command:'switch-blocks',
                            togglable:!1,
                            attributes:{title:'Open Blocks'}      
                        },
                        {
                            id:'switch-layers',
                            className:'material-symbols-outlined',
                            label: '<span class="material-symbols-outlined">layers</span>',
                            command:'switch-layers',
                            togglable:!1,
                            attributes:{title:'Open Layer Manager'}
                        },                        
                        {
                            id: 'load-template',
                            className: 'material-symbols-outlined',
                            active: false,
                            command: 'load-template',
                            label: '<span class="material-symbols-outlined">backup_table</span>'
                        }
                  ]});
                  editor.Panels.removePanel('views');
                  var ap='sw-visibility',sp='export-template',lp='open-sm',cp='open-tm',up='open-layers',pp='open-blocks',dp='fullscreen',fp='preview'
                  const componentEditorPanel = editor.Panels.addPanel({
                    id:'views',
                    buttons:[
                        {
                            id:lp,
                            className:'ti-views',
                            label: 'Styles',
                            command:lp,
                            active:!0,
                            togglable:!1,
                            attributes:{title:'Open Style Manager'}
                        },
                        {
                            id:cp,
                            className:'ti-views',
                            label: 'Settings',
                            command:cp,
                            togglable:!1,
                            attributes:{title:'Settings'}
                        },
                        /*{
                            id:up,
                            className:'material-symbols-outlined',
                            label: '<span class="material-symbols-outlined">layers</span>',
                            command:up,
                            togglable:!1,
                            attributes:{title:'Open Layer Manager'}
                        },
                        {
                            id:pp,
                            className:'material-symbols-outlined',
                            label: '<span class="material-symbols-outlined">add</span>',
                            command:pp,
                            togglable:!1,
                            attributes:{title:'Open Blocks'}      
                        }*/            
                  ]});
                  editor.Panels.removePanel('options');
                  editor.Panels.addPanel({
                    id:'options',
                    buttons:[
                        {
                            active:!0,
                            id:ap,
                            className:'material-symbols-outlined',
                            label: '<span class="material-symbols-outlined">select</span>',
                            command:'core:component-outline',
                            context:ap,
                            attributes:{title:'View components outline'}
                        },
                        {
                            id:fp,
                            className:'material-symbols-outlined',
                            label: '<span class="material-symbols-outlined">visibility</span>',
                            command:'preview-hide-panels',
                            context:fp,
                            attributes:{title:'Preview'}
                        },
                        {
                            id:dp,
                            className:'material-symbols-outlined',
                            label: '<span class="material-symbols-outlined">fullscreen</span>',
                            command:dp,
                            context:dp,
                            attributes:{title:'Fullscreen'}
                        },
                        {
                            id:sp,
                            className:'material-symbols-outlined',
                            label: '<span class="material-symbols-outlined">code</span>',
                            command:sp,
                            attributes:{title:'View code'}
                        }
                    ]
                  });
                async function fetchTemplates() {
                    try {
                        const response = await fetch(`/api/get-templates`);
                        const data = await response.json();
                        console.log('Fetched templates:', data); // Dodaj to logowanie
                        return data;
                    } catch (error) {
                        console.error('Error fetching templates:', error);
                        return [];
                    }
                }
                async function fetchTemplateById(templateId) {
                    try {
                        const response = await fetch(`/api/get-template/${templateId}`);
                        return await response.json();
                    } catch (error) {
                        console.error('Error fetching template:', error);
                        return null;
                    }
                }
                async function loadTemplate() {
                    const templates = await fetchTemplates();
                
                    // Tworzenie modala z szablonami
                    let modalContent = '<div id="template-modal">';
                    templates.forEach(template => {
                        modalContent += `
                            <div class="template-item" data-id="${template.id}">
                                <h3>${template.name}</h3>
                                <img src="${template.img}"></img>
                            </div>
                        `;
                    });
                    modalContent += '</div>';
                    const modal = editor.Modal;
                    modal.setTitle('Wybierz szablon');
                    modal.setContent(modalContent);
                    modal.open();
                
                    // Obsługa kliknięcia na szablon
                    document.querySelectorAll('.template-item').forEach(item => {
                        item.addEventListener('click', async () => {
                            const templateId = item.getAttribute('data-id');
                            await reloadEditorWithTemplate(templateId);
                            modal.close();
                        });
                    });
                }
                async function reloadEditorWithTemplate(templateId) {
                    const template = await fetchTemplateById(templateId);
                    if (template) {
                        editor.setComponents(template.html);
                        editor.setStyle(template.css);
                    } else {
                        console.error('Template not found');
                    }
                }
                function savePage() {

                    var content = editor.getHtml();
                    var style = editor.getCss();
                    var pageName = window.pageName;
    
                    fetch('/api/save-content/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                        body: JSON.stringify({ content: content, name: pageName, style: style })
                    })
                    .then(response => {
                        if (!response.ok) {
                            return response.text().then(text => { throw new Error(text) });
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.success) {
                            alert('Treść została zapisana!');
                        } else {
                            alert('Wystąpił błąd podczas zapisywania treści: ' + data.message);
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        alert('Wystąpił błąd: ' + error.message);
                    });
                };
                function hidePanel(panel){
                    var panelId;
                    switch(panel) {
                        case 'blocks':
                            panelId = 'blocks';
                            break;
                        case 'layers':
                            panelId = "layers";
                            break;
                    }
                    var isVisible = !document.getElementById(panelId).classList.contains('hidden-panel');
                    document.getElementById('blocks').classList.add('hidden-panel');
                    document.getElementById('layers').classList.add('hidden-panel');
                    if(isVisible){
                        document.getElementById(panelId).classList.add('hidden-panel');
                        document.querySelectorAll(".ti-frame").forEach(function(element) {
                            element.classList.remove('panel-opened');
                        });
                    }
                    else{
                        document.getElementById(panelId).classList.remove('hidden-panel');
                        document.querySelectorAll(".ti-frame").forEach(function(element) {
                            element.classList.add('panel-opened');
                        });
                    }
                }